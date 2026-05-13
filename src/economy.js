// src/economy.js — Settlement macro-economy simulation (Chrononaut v2.0, item 20)
const { getCapsuleDeltas, getTierForCoordinate, upsertDelta } = require('./db');
const { makeEvent } = require('./event-utils');
const { log } = require('./logger');

// 1000 * 1.02^100 ≈ 7245 → triggers guild; 500 * 1.02^100 ≈ 3622 → does not
const BANKING_GUILD_THRESHOLD = 5000;
const BURIED_GOLD_BOOM_THRESHOLD = 5000;
const HYPERINFLATION_DURATION_YEARS = 100;
const HYPERINFLATION_PRODUCTION_FACTOR = 0.25;
const BOOM_NET_THRESHOLD = 200;
const CONSECUTIVE_DECADES_FOR_BOOM = 2;
const CONSECUTIVE_DECADES_FOR_FAMINE = 2;
const RUIN_CHANCE_WITHOUT_MERCHANT = 0.40;

/**
 * Simulate one pass of economic activity for a settlement.
 *
 * @param {object}   town        - Town entity (with political.tier, population, economicModifiers, tradePartners)
 * @param {number}   years       - How many years to simulate (per-decade loop, so multiples of 10 are natural)
 * @param {Function} rng         - Seeded random number generator
 * @param {string}   coordinate  - "world_X{x}_Y{y}" key for capsule/hoard queries
 * @param {number}   globalYear  - Current universal year (used for capsule ΔT calculation)
 * @returns {{ events: object[], tierDelta: number, modifierChanges: object, divergenceLog: object[] }}
 */
function simulate_economy(town, years, rng, coordinate, globalYear) {
    const events = [];
    const divergenceLog = [];
    let tierDelta = 0;
    const modifierChanges = {};

    const tier = (town.political?.tier || 1) + tierDelta;
    const mods = town.economicModifiers || {
        shortage: false,
        hyperinflation: false,
        hyperinflationExpiryYear: null,
        economicBoomYear: null
    };

    let consecutivePositive = 0;
    let consecutiveNegative = 0;

    const decades = Math.floor(years / 10);

    for (let d = 0; d < decades; d++) {
        const decadeYear = globalYear - years + (d + 1) * 10;
        const currentTier = (town.political?.tier || 1) + tierDelta;

        let baseProduction = currentTier * 100;
        const baseConsumption = (town.population || 0) * 10;

        // Hyperinflation reduces export production value by 75%
        if (mods.hyperinflation && mods.hyperinflationExpiryYear && decadeYear < mods.hyperinflationExpiryYear) {
            baseProduction = Math.floor(baseProduction * HYPERINFLATION_PRODUCTION_FACTOR);
        }

        const net = baseProduction - baseConsumption;

        if (net > BOOM_NET_THRESHOLD) {
            consecutivePositive++;
            consecutiveNegative = 0;
        } else if (net < 0) {
            consecutiveNegative++;
            consecutivePositive = 0;
        } else {
            consecutivePositive = 0;
            consecutiveNegative = 0;
        }

        if (consecutivePositive >= CONSECUTIVE_DECADES_FOR_BOOM) {
            tierDelta++;
            consecutivePositive = 0;
            modifierChanges.economicBoomYear = decadeYear;
            events.push(makeEvent(
                `[Year ${decadeYear}] Economic Boom! Sustained surplus drove ${town.identity?.name || 'the settlement'} to a new tier.`,
                'economic_boom'
            ));
            divergenceLog.push({ type: 'economic_boom', ceGained: 10, year: decadeYear });
            log('economy:boom', { coordinate, decadeYear, newTierDelta: tierDelta });
        }

        if (consecutiveNegative >= CONSECUTIVE_DECADES_FOR_FAMINE) {
            consecutiveNegative = 0;
            events.push(makeEvent(
                `[Year ${decadeYear}] Famine and Depression. Consumption outstripped production for two decades.`,
                'famine'
            ));
            log('economy:famine', { coordinate, decadeYear });
        }
    }

    // Process Time Capsule deltas (returns additional tier changes)
    tierDelta += _processCapsules(town, coordinate, globalYear, rng, events, divergenceLog, modifierChanges);

    // Evaluate trade route health
    _evaluateTradeRoutes(town, coordinate, modifierChanges, events, globalYear);

    return { events, tierDelta, modifierChanges, divergenceLog };
}

/**
 * Load and trigger unresolved Time Capsule deltas for this coordinate.
 * Mutates events, divergenceLog, and modifierChanges in place.
 * @returns {number} additional tierDelta accumulated from capsule triggers
 */
function _processCapsules(town, coordinate, globalYear, rng, events, divergenceLog, modifierChanges) {
    const capsuleRows = getCapsuleDeltas(coordinate);
    let capsuleTierDelta = 0;

    for (const row of capsuleRows) {
        let capsule;
        try {
            capsule = JSON.parse(row.state_value);
        } catch {
            continue;
        }

        if (capsule.resolved) continue;

        const buriedYear = capsule.buriedYear || 0;
        const deltaT = globalYear - buriedYear;
        const discoveryChance = Math.min(95, (deltaT * 0.5) + ((town.population || 0) / 10));

        if (rng() * 100 >= discoveryChance) continue;

        // Mark resolved immediately so it doesn't trigger again
        capsule.resolved = true;
        upsertDelta(coordinate, row.entity_name, row.state_key, JSON.stringify(capsule));

        if (capsule.type === 'gold_npc' && capsule.gold) {
            // Gold given to lower-class NPC: compound interest check
            const compoundedValue = capsule.gold * Math.pow(1.02, deltaT);
            if (compoundedValue > BANKING_GUILD_THRESHOLD) {
                capsuleTierDelta++;
                events.push(makeEvent(
                    `[Year ${globalYear}] A Banking Guild rose from the wealth seeded generations ago — the town ascends.`,
                    'banking_guild_founded'
                ));
                divergenceLog.push({ type: 'banking_guild', ceGained: 10, year: globalYear });
                log('economy:banking-guild', { coordinate, gold: capsule.gold, deltaT, compoundedValue });
            }
        } else if (capsule.type === 'buried_gold' && capsule.gold) {
            // Buried gold capsule: boom + hyperinflation risk
            if (capsule.gold > BURIED_GOLD_BOOM_THRESHOLD) {
                capsuleTierDelta++;
                modifierChanges.hyperinflation = true;
                modifierChanges.hyperinflationExpiryYear = globalYear + HYPERINFLATION_DURATION_YEARS;
                events.push(makeEvent(
                    `[Year ${globalYear}] A trove of buried gold triggered an economic Boom — but at the cost of rampant Hyperinflation.`,
                    'buried_gold_boom'
                ));
                // 40% Ruin chance if no Merchant or Magistrate present
                const hasMerchantOrMagistrate = capsule.hasMerchant || false;
                if (!hasMerchantOrMagistrate && rng() < RUIN_CHANCE_WITHOUT_MERCHANT) {
                    capsuleTierDelta--;
                    events.push(makeEvent(
                        `[Year ${globalYear}] Without a Merchant or Magistrate to manage the influx, the settlement collapsed into ruin.`,
                        'economic_ruin'
                    ));
                    log('economy:buried-gold-ruin', { coordinate });
                }
                log('economy:buried-gold-boom', { coordinate, gold: capsule.gold });
            }
        } else if (capsule.type === 'weapon' && (capsule.tier === undefined || capsule.tier >= 3)) {
            // Tier 3+ Weapon: Militaristic trait, claim adjacent tiles
            modifierChanges.militaristicTrait = true;
            events.push(makeEvent(
                `[Year ${globalYear}] An otherworldly weapon unearthed from the past — the settlement turns Militaristic.`,
                'capsule_weapon'
            ));
            divergenceLog.push({ type: 'capsule_weapon', ceGained: 20, year: globalYear });
            log('economy:capsule-weapon', { coordinate });
        } else if (capsule.type === 'tome' && (capsule.tier === undefined || capsule.tier >= 3)) {
            // Tier 3+ Tome: Scholarly trait, +50% base production
            modifierChanges.scholarlyTrait = true;
            modifierChanges.productionBonus = 0.5;
            events.push(makeEvent(
                `[Year ${globalYear}] An ancient tome unearthed — scholars flock to the settlement, transforming its character.`,
                'capsule_tome'
            ));
            divergenceLog.push({ type: 'capsule_tome', ceGained: 20, year: globalYear });
            log('economy:capsule-tome', { coordinate });
        }
    }

    return capsuleTierDelta;
}

/**
 * Check each trade partner; remove links to Ruins and apply Shortage to vulnerable towns.
 */
function _evaluateTradeRoutes(town, coordinate, modifierChanges, events, globalYear) {
    if (!town.tradePartners || town.tradePartners.length === 0) return;

    const survivingPartners = [];
    for (const partnerKey of town.tradePartners) {
        const partnerTier = getTierForCoordinate(partnerKey);
        if (partnerTier === 0) {
            // Partner has become a Ruin — sever the link
            events.push(makeEvent(
                `[Year ${globalYear}] The trade route to ${partnerKey} collapsed — our partner has fallen to ruin.`,
                'trade_route_collapse'
            ));
            // Apply Shortage to vulnerable (small) towns
            if ((town.population || 0) < 10) {
                modifierChanges.shortage = true;
                events.push(makeEvent(
                    `[Year ${globalYear}] With a key trade partner gone, shortages grip the settlement.`,
                    'shortage'
                ));
            }
            log('economy:trade-route-collapsed', { coordinate, partnerKey });
        } else {
            survivingPartners.push(partnerKey);
        }
    }

    if (survivingPartners.length !== town.tradePartners.length) {
        modifierChanges.tradePartners = survivingPartners;
    }
}

/**
 * Lock 50% of a town's regional wealth into a ruin_hoard delta when a settlement falls.
 * Call this from simulateHistory() when a town demotes to tier 0.
 */
function lockRuinHoard(coordinate, town) {
    const hoardValue = Math.floor((town.regionalWealth || 0) * 0.5);
    upsertDelta(coordinate, 'RUIN', 'ruin_hoard', String(hoardValue));
    log('economy:ruin-hoard-locked', { coordinate, hoardValue });
}

module.exports = { simulate_economy, lockRuinHoard };
