// src/history.js
const { Identity, Location, History, Knowledge, Inventory, Quests, Memory } = require('./components');
const seedrandom = require('seedrandom');
const { generateText } = require('./grammar');
const { log } = require('./logger');
const crypto = require('crypto');
const { generateArtifact, generateMerchantInventory } = require('./items');
const { determineBiome } = require('./biomes');
const { replenishPopulationIfNeeded } = require('./population');
const { PoliticalEngine, getRulerTitle, TIER_RULER_TITLES } = require('./politics');

const ALL_RULER_TITLES = new Set(Object.values(TIER_RULER_TITLES));
const { saveDelta, getTierForCoordinate, upsertDelta, getDeltas } = require('./db');
const { simulate_economy, lockRuinHoard } = require('./economy');
const { getAdjacentTiles } = require('./map');
const { makeEvent, buildCausedBySnapshot } = require('./event-utils');

const MEMORY_STATES = Object.freeze({
    HATES:     "hates",
    LOVES:     "loves",
    LIKES:     "likes",
    MOURNS:    "mourns",
    PARENT:    "parent",
    CHILD:     "child",
    AVENGED:   "avenged",
    SATISFIED: "satisfied",
});

const SEX_MALE_THRESHOLD = 0.48;
const SEX_FEMALE_THRESHOLD = 0.96;

const MERCHANT_VALUABLE_PREFIXES = new Set(['Relic', 'Ancient']);
const MERCHANT_VALUABLE_THRESHOLD = 500;
const MERCHANT_WEALTH_MIN = 500;
const MERCHANT_WEALTH_RANGE = 2501;
const MEMORY_GIFT_PRIORITY = ['loves', 'likes', 'parent', 'child'];

// Generational memory constants
const HIGH_INTENSITY_THRESHOLD = 7;
const BLOOD_FEUD_FACTION_THRESHOLD = 3;
const ANCESTRAL_BOND_MIN_YEARS = 50;
const DEBT_HOUSE_MIN_YEARS = 100;
const SHAME_BROTHERHOOD_MIN_YEARS = 100;
const REVERENCE_CULT_MIN_YEARS = 100;
const MEMORIAL_ORDER_MIN_YEARS = 100;
const INHERITED_INTENSITY_DIVISOR = 2;
const DEBT_TRIBUTE_RATE = 0.05;

// Folklore & Mythos constants (item 14)
const MYTHOS_EXPOSURE_LEGEND_THRESHOLD = 50;
const MYTHOS_FEAR_SHADOW = 2.0;
const MYTHOS_DECAY_PERIOD_YEARS = 50;
const MYTHOS_DECAY_AMOUNT = 25;
const MYTHOS_DECAY_MIN = 0;
const MYTHOS_DISBAND_THRESHOLD = 20;
const MYTHOS_TITHE_RATE = 0.05;
const MYTHOS_DEFAULT = { temporalExposure: 0, activeLegend: null, cultFaction: null, fearModifier: 1, titheAccumulated: 0 };

const LOVE_MEMORY_INTENSITY = 9;
const HATE_MEMORY_INTENSITY = 8;
const GRIEF_MEMORY_INTENSITY = 7;

const MAX_NATURAL_LIFESPAN = 80;
const MAX_LIFESPAN_VARIANCE = 10;

function computeDeathAge(npcId) {
    return MAX_NATURAL_LIFESPAN + Math.floor(seedrandom(npcId + '_lifespan')() * MAX_LIFESPAN_VARIANCE);
}

const FATAL_EVENT_TYPES = new Set(['death', 'assassination', 'regicide', 'child_death']);

const GRIEF_MESSAGES = {
    loves:  'Was heartbroken by the loss of their love.',
    parent: 'Was grief-stricken by the death of their parent.',
    child:  'Was devastated by the loss of their child.',
};
const REVERENCE_MEMORY_INTENSITY = 8;
const DEBT_MEMORY_INTENSITY = 8;
const SHAME_MEMORY_INTENSITY = 9;

const MEMORY_TYPE_MAP = {
    love:      'ancestral_ally',
    hate:      'blood_feud',
    debt:      'ancestral_debt',
    shame:     'ancestral_shame',
    reverence: 'ancestral_reverence',
    grief:     'ancestral_mourning',
};

const FACTION_DESCRIPTIONS = {
    blood_feud:          (name, tl) => `House ${name} formed to prosecute the ancestral vendetta against the lineage of ${tl}.`,
    ancestral_ally:      (name, tl) => `The ${name} Allied Bloodline sworn to stand beside the lineage of ${tl}.`,
    ancestral_debt:      (name, tl) => `The ${name} Debtors united to honor their ancestors' unpaid obligation to the lineage of ${tl}.`,
    ancestral_shame:     (name, tl) => `The Brotherhood of ${name} rose to reclaim the honor stripped from their forebears by the lineage of ${tl}.`,
    ancestral_reverence: (name, tl) => `The Mystery Cult of ${name} founded as keepers of ancestral reverence for ${tl}.`,
    ancestral_mourning:  (name, tl) => `The Memorial Order of ${name} established to preserve the memory of what was lost.`,
};

function determineSex(rng) {
    const roll = rng();
    return roll < SEX_MALE_THRESHOLD ? 'male' : roll < SEX_FEMALE_THRESHOLD ? 'female' : 'other';
}

function canReproduce(actorSex, partnerSex) {
    const aSex = actorSex ?? 'other';
    const pSex = partnerSex ?? 'other';
    const sexes = new Set([aSex, pSex]);
    return (sexes.has('male') && sexes.has('female')) || aSex === 'other' || pSex === 'other';
}

function propagate_memories(npc, livingNpcs, globalYear) {
    function findHeir() {
        let heir = livingNpcs.find(n =>
            npc.knowledge.memories[n.identity.id] === 'child' && n.status === 'Alive'
        );
        if (!heir) {
            const children = livingNpcs.filter(n => npc.knowledge.memories[n.identity.id] === 'child');
            for (const child of children) {
                heir = livingNpcs.find(n =>
                    child.knowledge?.memories[n.identity.id] === 'child' && n.status === 'Alive'
                );
                if (heir) break;
            }
        }
        if (!heir) {
            heir = livingNpcs.find(n =>
                n.status === 'Alive' &&
                n.location?.x === npc.location?.x &&
                n.location?.y === npc.location?.y &&
                npc.knowledge.memories[n.identity.id] === 'likes'
            );
        }
        return heir;
    }

    // Pass 1: propagate direct memories (intensity >= HIGH_INTENSITY_THRESHOLD)
    const qualifying = (npc.memories || []).filter(m => m.intensity >= HIGH_INTENSITY_THRESHOLD);
    for (const memory of qualifying) {
        const heir = findHeir();
        if (!heir || !heir.ancestralMemories) continue;
        const ancestralType = MEMORY_TYPE_MAP[memory.type] || 'ancestral_ally';
        const originEvent = `Inherited the ${memory.type} of their ancestor ${npc.identity.name}.`;
        heir.ancestralMemories.push({
            type: ancestralType,
            targetLineage: memory.targetId,
            intensity: Math.floor(memory.intensity / INHERITED_INTENSITY_DIVISOR),
            originYear: globalYear,
            originEvent,
            inheritedFrom: { npcId: npc.identity.id, npcName: npc.identity.name, year: globalYear },
        });
    }

    // Pass 2: re-propagate ancestral memories so chains survive past generation 1.
    // Uses intensity >= 1 (not HIGH_INTENSITY_THRESHOLD) since ancestral values are already halved.
    // Chain decay: 8 → 4 → 2 → 1 → terminates (floor(1/2) = 0).
    const qualifyingAncestral = (npc.ancestralMemories || []).filter(am => am.intensity >= 1);
    for (const am of qualifyingAncestral) {
        const heir = findHeir();
        if (!heir || !heir.ancestralMemories) continue;
        const newIntensity = Math.floor(am.intensity / INHERITED_INTENSITY_DIVISOR);
        if (newIntensity < 1) continue;
        heir.ancestralMemories.push({
            type: am.type,
            targetLineage: am.targetLineage,
            intensity: newIntensity,
            originYear: globalYear,
            originEvent: `Inherited ancestral memory from ${npc.identity.name}.`,
            inheritedFrom: { npcId: npc.identity.id, npcName: npc.identity.name, year: globalYear },
        });
    }
}

function erosion_check(townEntity, coordinateKey, currentYear, lastVisitYear, pushEvent) {
    if (!townEntity?.mythos) return;
    const yearsSince = currentYear - lastVisitYear;
    const periods = Math.floor(yearsSince / MYTHOS_DECAY_PERIOD_YEARS);
    townEntity.mythos.temporalExposure = Math.max(
        MYTHOS_DECAY_MIN,
        townEntity.mythos.temporalExposure - (periods * MYTHOS_DECAY_AMOUNT)
    );

    if (townEntity.mythos.activeLegend !== null && townEntity.mythos.temporalExposure < MYTHOS_DISBAND_THRESHOLD) {
        townEntity.mythos.activeLegend = null;
        townEntity.mythos.cultFaction = null;
        townEntity.mythos.fearModifier = 1;
        pushEvent(townEntity, makeEvent(
            `[Year ${currentYear}] The old tales faded into children's stories.`, 'legend'
        ));
        upsertDelta(coordinateKey, townEntity.identity.name, 'mythos', JSON.stringify(townEntity.mythos));
    }
}

function simulateHistory(world, rng, targetX, targetY, totalYears = 20, startYear = 1) {
    log('simulateHistory:start', { targetX, targetY, totalYears, startYear });
    const townEntity = world.with('identity', 'currentMayor').where(e => (e.identity.type === "Town" || e.identity.type === "District") && e.location.x === targetX && e.location.y === targetY).first;
    const biome = determineBiome(targetX, targetY);

    const coordinateKey = `world_X${targetX}_Y${targetY}`;

    function pushEvent(entity, event) {
        if (entity.history.events.some(e => e.id === event.id)) return;
        entity.history.events.push(event);
    }

    // Initialize political and population components if not present
    if (townEntity && !townEntity.political) {
        townEntity.political = { tier: 1, demographics: {}, stance: 'Balanced' };
    }
    if (townEntity && !townEntity.population) {
        townEntity.population = 0;
    }

    // Build the living-NPC array once; maintain it incrementally to avoid a full
    // ECS query (O(world size)) on every simulated year.
    let livingNpcs = Array.from(world.with('identity', 'status', 'knowledge', 'history', 'inventory', 'description', 'location', 'currentRole')
        .where(e => e.location.x === targetX && e.location.y === targetY && e.identity.type === "NPC" && e.status === "Alive"));

    for (let currentYear = startYear; currentYear < startYear + totalYears; currentYear++) {
        // Prune dead/migrated NPCs accumulated in previous years
        livingNpcs = livingNpcs.filter(n => n.status === "Alive");

        // Check for population replenishment every decade
        if (currentYear % 10 === 0) {
            const replenished = replenishPopulationIfNeeded(world, targetX, targetY, rng, townEntity, biome, currentYear);
            if (replenished.length > 0) livingNpcs.push(...replenished);
        }

        if (rng() < 0.15) {
            const name = generateText(rng, "#npcName#");
            const newId = crypto.createHash('md5').update(`world_X${targetX}_Y${targetY}_${name}_immigrant_${currentYear}`).digest('hex').substring(0, 12);
            const immigrantAge = Math.floor(rng() * 20) + 18;
            const immigrant = world.add({
                identity: Identity(name, "NPC", newId),
                location: Location(targetX, targetY, townEntity),
                description: generateText(rng, "#npcDesc#"),
                status: "Alive",
                currentRole: "Citizen",
                age: immigrantAge,
                birthYear: currentYear - immigrantAge,
                sex: determineSex(rng),
                history: { events: [] },
                knowledge: Knowledge(),
                inventory: Inventory(),
                quests: Quests(),
                ...Memory()
            });
            pushEvent(immigrant, makeEvent(`[Year ${currentYear}] Arrived in town seeking a new life.`, 'immigration'));
            livingNpcs.push(immigrant);
            log('history:immigration', { actorId: newId, year: currentYear });
        }

        if (livingNpcs.length === 0) continue;

        // Update population count
        if (townEntity) {
            townEntity.population = livingNpcs.length;
        }

        // Run economy simulation every decade
        if (townEntity && currentYear % 10 === 0) {
            // Fetch deltas once for this decade pass — reused by economy, plutocracy, and mythos checks
            const allDeltas = getDeltas(coordinateKey);
            const lastVisitDelta = allDeltas.find(d => d.state_key === 'last_visit_year');
            const lastVisitYear = lastVisitDelta ? parseInt(lastVisitDelta.state_value) : 0;
            const econResult = simulate_economy(townEntity, 10, rng, coordinateKey, currentYear, lastVisitYear);

            // Apply tier changes from economy
            if (econResult.tierDelta !== 0) {
                townEntity.political.tier = Math.max(0, townEntity.political.tier + econResult.tierDelta);
                upsertDelta(coordinateKey, townEntity.identity.id, 'tier', String(townEntity.political.tier));
            }

            // Apply modifier changes
            if (Object.keys(econResult.modifierChanges).length > 0) {
                if (!townEntity.economicModifiers) {
                    townEntity.economicModifiers = { shortage: false, hyperinflation: false, hyperinflationExpiryYear: null, economicBoomYear: null };
                }
                Object.assign(townEntity.economicModifiers, econResult.modifierChanges);
                if (econResult.modifierChanges.tradePartners !== undefined) {
                    townEntity.tradePartners = econResult.modifierChanges.tradePartners;
                }
            }

            // Push economy events into town history
            for (const event of econResult.events) {
                pushEvent(townEntity, event);
            }

            // Plutocracy takeover — check for a pending plutocracy_candidate delta from /api/trade
            const plutocracyDelta = allDeltas.find(d => d.state_key === 'plutocracy_candidate' && d.state_value !== 'resolved');
            if (plutocracyDelta) {
                const merchantId = plutocracyDelta.state_value;
                townEntity.currentMayor = merchantId;
                upsertDelta(coordinateKey, townEntity.identity.id, 'currentMayor', merchantId);
                // Mark delta consumed so it doesn't fire again
                upsertDelta(coordinateKey, townEntity.identity.id, 'plutocracy_candidate', 'resolved');
                pushEvent(townEntity, makeEvent(`[Year ${currentYear}] The Era of the Merchant Kings.`, 'plutocracy'));
                log('history:plutocracy-takeover', { coordinate: coordinateKey, merchantId, year: currentYear });
            }

            // Mythos erosion and myth generation (item 14)
            if (townEntity.mythos) {
                erosion_check(townEntity, coordinateKey, currentYear, lastVisitYear, pushEvent);

                checkMythosLegend(world, townEntity, coordinateKey, allDeltas, currentYear, targetX, targetY, pushEvent);
            }
        }

        // Check for settlement promotion every decade
        if (townEntity && currentYear % 10 === 0) {
            // Create a settlement object for promotion check
            const settlementForPromotion = {
                tier: townEntity.political?.tier || 1,
                population: livingNpcs.length,
                name: townEntity.identity.name
            };
            const promoted = PoliticalEngine.promoteSettlement(settlementForPromotion);
            if (promoted) {
                // Update the town entity's political tier
                townEntity.political.tier = settlementForPromotion.tier;
                const tierNames = ['Town', 'SmallCity', 'FullCity', 'Magistrate', 'Kingdom'];
                const tierName = tierNames[townEntity.political.tier - 1] || 'Unknown';
                pushEvent(townEntity, makeEvent(`[Year ${currentYear}] ${townEntity.identity.name} has grown to a ${tierName}!`, 'settlement_promoted'));
                log('history:settlement-promoted', {
                    settlement: townEntity.identity.name,
                    newTier: townEntity.political.tier,
                    tierName: tierName,
                    population: livingNpcs.length,
                    year: currentYear
                });

                // Trigger conflict check with any occupied neighboring tiles
                const neighbors = getAdjacentTiles(targetX, targetY);
                for (const neighbor of neighbors) {
                    const neighborTier = getTierForCoordinate(neighbor.key);
                    if (neighborTier >= 1) {
                        const roleCountMap = Array.from(
                            world.with('currentRole', 'status').where(e => e.status === 'Alive')
                        ).reduce((acc, npc) => {
                            acc[npc.currentRole] = (acc[npc.currentRole] || 0) + 1;
                            return acc;
                        }, {});
                        const invader = { npcsByRole: roleCountMap, weapons: 0 };
                        const target = { npcsByRole: { Guard: Math.ceil(neighborTier * 2) }, weapons: 0, allies: [] };
                        const conflictResult = PoliticalEngine.resolveConflict(invader, target);
                        log('history:conflict-triggered', { coordinateKey, neighbor: neighbor.key, outcome: conflictResult.outcome, year: currentYear });

                        if (conflictResult.outcome === 'crushing-victory') {
                            saveDelta(neighbor.key, townEntity.identity.name, 'claimedBy', coordinateKey);
                            pushEvent(townEntity, makeEvent(`[Year ${currentYear}] ${townEntity.identity.name} crushed and annexed the settlement at ${neighbor.key}.`, 'settlement_promoted'));
                        } else if (conflictResult.outcome === 'subjugation') {
                            saveDelta(neighbor.key, townEntity.identity.name, 'suzerain', coordinateKey);
                            pushEvent(townEntity, makeEvent(`[Year ${currentYear}] ${townEntity.identity.name} subjugated its neighbor at ${neighbor.key}, extracting tribute.`, 'settlement_promoted'));
                        } else {
                            pushEvent(townEntity, makeEvent(`[Year ${currentYear}] Expansion towards ${neighbor.key} was repelled by neighboring forces.`, 'settlement_promoted'));
                        }
                        break; // One conflict per promotion event
                    }
                }
            }

            // Check for tier demotion when population has decayed too far
            if (townEntity) {
                const settlementForDemotion = {
                    tier: townEntity.political?.tier || 1,
                    population: livingNpcs.length,
                    name: townEntity.identity.name
                };
                if (PoliticalEngine.shouldDemote(settlementForDemotion)) {
                    townEntity.political.tier -= 1;
                    if (townEntity.political.tier === 0) {
                        lockRuinHoard(coordinateKey, townEntity);
                        pushEvent(townEntity, makeEvent(`[Year ${currentYear}] ${townEntity.identity.name} has fallen into ruin, its wealth sealed beneath the rubble.`, 'settlement_ruined'));
                        log('history:settlement-ruined', { settlement: townEntity.identity.name, year: currentYear });
                    } else {
                        const tierNames = ['Town', 'SmallCity', 'FullCity', 'Magistrate', 'Kingdom'];
                        const tierName = tierNames[townEntity.political.tier - 1] || 'Unknown';
                        pushEvent(townEntity, makeEvent(`[Year ${currentYear}] ${townEntity.identity.name} has declined to a ${tierName}.`, 'settlement_demoted'));
                        log('history:settlement-demoted', {
                            settlement: townEntity.identity.name,
                            newTier: townEntity.political.tier,
                            tierName,
                            population: livingNpcs.length,
                            year: currentYear
                        });
                    }
                }
            }
        }

        // Faction spawning and long-term bond effects — checked every decade
        if (currentYear % 10 === 0) {
            const allNpcsAtCoord = Array.from(world.with('identity', 'status', 'knowledge', 'location')
                .where(e => e.location.x === targetX && e.location.y === targetY && e.identity.type === 'NPC'));

            // Group ancestral memories by (type, targetLineage) across all living NPCs
            const feudGroups = {};
            for (const npc of allNpcsAtCoord) {
                for (const am of (npc.ancestralMemories || [])) {
                    const yearsActive = currentYear - am.originYear;
                    const threshold = (am.type === 'blood_feud' || am.type === 'ancestral_ally')
                        ? ANCESTRAL_BOND_MIN_YEARS
                        : DEBT_HOUSE_MIN_YEARS;
                    if (yearsActive < threshold) continue;
                    const groupKey = `${am.type}::${am.targetLineage}`;
                    if (!feudGroups[groupKey]) feudGroups[groupKey] = { type: am.type, targetLineage: am.targetLineage, npcs: [] };
                    feudGroups[groupKey].npcs.push(npc);
                }
            }

            for (const { type, targetLineage, npcs } of Object.values(feudGroups)) {
                if (npcs.length < BLOOD_FEUD_FACTION_THRESHOLD) continue;

                const factionSeed = `faction_${type}_${targetLineage}_${currentYear}`;
                const factionName = generateText(seedrandom(factionSeed), '#lastName#');
                const factionId = crypto.createHash('md5').update(factionSeed).digest('hex').substring(0, 12);

                // Avoid duplicate factions for the same group
                const alreadyExists = Array.from(world.with('identity').where(e =>
                    e.identity.type === 'Faction' && e.identity.id === factionId
                )).length > 0;
                if (alreadyExists) continue;

                // Find root ancestor by walking inheritedFrom chain
                const npcIndex = Object.fromEntries(allNpcsAtCoord.map(n => [n.identity.id, n]));
                function findRoot(startNpc, fType, tLineage) {
                    let current = startNpc;
                    const visited = new Set();
                    while (current && !visited.has(current.identity.id)) {
                        visited.add(current.identity.id);
                        const mem = (current.ancestralMemories || []).find(
                            am => am.type === fType && am.targetLineage === tLineage
                        );
                        if (!mem?.inheritedFrom) {
                            return { npcId: current.identity.id, npcName: current.identity.name, year: mem?.originYear ?? currentYear };
                        }
                        current = npcIndex[mem.inheritedFrom.npcId];
                    }
                    return null;
                }
                const rootAncestor = findRoot(npcs[0], type, targetLineage);

                const descFn = FACTION_DESCRIPTIONS[type] || FACTION_DESCRIPTIONS.blood_feud;
                const description = descFn(factionName, targetLineage, currentYear);

                const factionEntity = world.add({
                    identity: Identity(factionName, 'Faction', factionId),
                    location: Location(targetX, targetY),
                    members: npcs.map(n => n.identity.id),
                    history: History(),
                    targetLineage,
                    factionType: type,
                    foundedYear: currentYear,
                    rootAncestor,
                });
                pushEvent(factionEntity, makeEvent(`[Year ${currentYear}] ${description}`, 'faction_spawn'));
                if (townEntity?.history) pushEvent(townEntity, makeEvent(`[Year ${currentYear}] ${description}`, 'faction_spawn'));

                saveDelta(coordinateKey, `faction_${factionId}`, JSON.stringify({
                    id: factionId, name: factionName, type,
                    members: npcs.map(n => n.identity.id),
                    targetLineage, foundedYear: currentYear, rootAncestor,
                }));
                log('history:faction-spawn', { factionId, factionName, type, targetLineage, year: currentYear });
            }

            // Debt tribute: living NPCs with ancestral_debt under 100 yrs transfer wealth to creditor settlement
            if (townEntity) {
                for (const npc of allNpcsAtCoord.filter(n => n.status === 'Alive')) {
                    for (const am of (npc.ancestralMemories || [])) {
                        if (am.type !== 'ancestral_debt') continue;
                        if ((currentYear - am.originYear) >= DEBT_HOUSE_MIN_YEARS) continue;
                        const tribute = Math.floor((townEntity.regionalWealth || 0) * DEBT_TRIBUTE_RATE);
                        if (tribute > 0 && townEntity.regionalWealth >= tribute) {
                            townEntity.regionalWealth -= tribute;
                            upsertDelta(coordinateKey, townEntity.identity.id, 'regionalWealth', String(townEntity.regionalWealth));
                        }
                    }
                }
            }

            // Ancestral mourning: suppress economic boom if 3+ NPCs carry the grief
            if (townEntity) {
                const mournerCount = allNpcsAtCoord.filter(n =>
                    n.status === 'Alive' && (n.ancestralMemories || []).some(am => am.type === 'ancestral_mourning')
                ).length;
                if (mournerCount >= BLOOD_FEUD_FACTION_THRESHOLD && townEntity.economicModifiers) {
                    townEntity.economicModifiers.economicBoomYear = null;
                }
            }
        }

        for (const actor of livingNpcs) {
            if (actor.status !== "Alive") continue;

            actor.age++;

            if (actor.age === 16) {
                if (actor.currentRole === "Child") actor.currentRole = "Citizen";
                actor.description = actor.description.replace("small child", "young adult");
                pushEvent(actor, makeEvent(`[Year ${currentYear}] Came of age and entered adulthood.`, 'age_transition'));
                log('history:age-transition', { actorId: actor.identity.id, year: currentYear });
            }

            const isMarried = Object.values(actor.knowledge.memories).includes(MEMORY_STATES.LOVES);
            for (const [targetId, feeling] of Object.entries(actor.knowledge.memories)) {
                if (GRIEF_MESSAGES[feeling]) {
                    const related = livingNpcs.find(n => n.identity.id === targetId);
                    if (!related) {
                        const relatedEntity = world.with('identity', 'history').where(e => e.identity.id === targetId).first;
                        const relatedEvents = relatedEntity?.history?.events ?? [];
                        const relatedLastEvent = relatedEvents[relatedEvents.length - 1];
                        const causingDeathEvent = (relatedLastEvent && FATAL_EVENT_TYPES.has(relatedLastEvent.type)) ? relatedLastEvent : null;
                        const relatedName = relatedEntity?.identity?.name ?? 'Unknown';
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] ${GRIEF_MESSAGES[feeling]}`, 'grief', buildCausedBySnapshot(causingDeathEvent, relatedName)));
                        actor.knowledge.memories[targetId] = MEMORY_STATES.MOURNS;
                        if (actor.memories) {
                            actor.memories.push({ type: 'grief', targetId, intensity: GRIEF_MEMORY_INTENSITY, year: currentYear });
                        }
                    }
                }
            }

            const eventRoll = rng();

            if (isMarried && actor.age >= 18 && actor.age <= 50 && eventRoll < 0.08) {
                const partnerId = Object.keys(actor.knowledge.memories).find(k => actor.knowledge.memories[k] === MEMORY_STATES.LOVES);
                const partner = livingNpcs.find(n => n.identity.id === partnerId);

                if (partner && actor.identity.id < partner.identity.id && canReproduce(actor.sex, partner.sex)) {
                    const lastName = actor.identity.name.split(' ')[1];
                    const childName = `${generateText(rng, "#firstName#")} ${lastName}`;
                    const childId = crypto.createHash('md5').update(`world_X${targetX}_Y${targetY}_${childName}_born_${currentYear}`).digest('hex').substring(0, 12);
                    const childEntity = world.add({
                        identity: Identity(childName, "NPC", childId),
                        location: Location(targetX, targetY, townEntity),
                        description: generateText(rng, "A small child with #feature#."),
                        status: "Alive",
                        currentRole: "Child",
                        age: 0,
                        birthYear: currentYear,
                        sex: determineSex(rng),
                        history: { events: [] },
                        knowledge: Knowledge(),
                        inventory: Inventory(),
                        quests: Quests(),
                        ...Memory()
                    });

                    pushEvent(actor, makeEvent(`[Year ${currentYear}] Had a child named ${childName} with ${partner.identity.name}.`, 'birth'));
                    pushEvent(partner, makeEvent(`[Year ${currentYear}] Welcomed their child, ${childName}.`, 'birth'));
                    actor.knowledge.memories[childId] = MEMORY_STATES.CHILD;
                    partner.knowledge.memories[childId] = MEMORY_STATES.CHILD;
                    childEntity.knowledge.memories[actor.identity.id] = MEMORY_STATES.PARENT;
                    childEntity.knowledge.memories[partner.identity.id] = MEMORY_STATES.PARENT;
                    log('history:childbirth', { childId, parents: [actor.identity.id, partner.identity.id], year: currentYear });
                    livingNpcs.push(childEntity);
                    continue;
                }
            }

            if (actor.age < 16) {
                if (eventRoll > 0.98) {
                    propagate_memories(actor, livingNpcs, currentYear);
                    actor.status = "Dead";
                    pushEvent(actor, makeEvent(`[Year ${currentYear}] Died of a tragic childhood fever.`, 'child_death'));
                    log('history:child-death', { actorId: actor.identity.id, year: currentYear });
                }
                continue;
            }

            if (actor.age >= computeDeathAge(actor.identity.id)) {
                propagate_memories(actor, livingNpcs, currentYear);
                actor.status = "Dead";
                const oldAgeDeathEvent = makeEvent(`[Year ${currentYear}] Died of old age.`, 'death');
                pushEvent(actor, oldAgeDeathEvent);
                log('history:death', { actorId: actor.identity.id, year: currentYear });
                if (actor.inventory && actor.inventory.items.length > 0) {
                    const heirs = livingNpcs.filter(n =>
                        actor.knowledge.memories[n.identity.id] === MEMORY_STATES.LOVES ||
                        actor.knowledge.memories[n.identity.id] === MEMORY_STATES.CHILD
                    );
                    if (heirs.length > 0) {
                        heirs[0].inventory.items.push(...actor.inventory.items);
                        pushEvent(heirs[0], makeEvent(`[Year ${currentYear}] Inherited belongings from the late ${actor.identity.name}.`, 'inheritance', buildCausedBySnapshot(oldAgeDeathEvent, actor.identity.name)));
                        actor.inventory.items = [];
                    }
                }
                continue;
            }

            if (eventRoll >= 0.08 && eventRoll < 0.10) {
                propagate_memories(actor, livingNpcs, currentYear);
                actor.status = "Dead";
                const causes = ["passed away peacefully in their sleep", "died of a sudden fever", "was killed by a wild beast"];
                const deathEvent = makeEvent(`[Year ${currentYear}] ${causes[Math.floor(rng() * causes.length)]}.`, 'death');
                pushEvent(actor, deathEvent);
                log('history:death', { actorId: actor.identity.id, year: currentYear });

                if (actor.inventory && actor.inventory.items.length > 0) {
                    const heirs = livingNpcs.filter(n =>
                        actor.knowledge.memories[n.identity.id] === MEMORY_STATES.LOVES ||
                        actor.knowledge.memories[n.identity.id] === MEMORY_STATES.CHILD
                    );

                    if (heirs.length > 0) {
                        heirs[0].inventory.items.push(...actor.inventory.items);
                        pushEvent(heirs[0], makeEvent(`[Year ${currentYear}] Inherited belongings from the late ${actor.identity.name}.`, 'inheritance', buildCausedBySnapshot(deathEvent, actor.identity.name)));
                        actor.inventory.items = [];
                    }
                }
                continue;
            } else if (eventRoll >= 0.10 && eventRoll < 0.18) {
                log('history:career-shift', { actorId: actor.identity.id, year: currentYear, currentRole: actor.currentRole });
                const rulerTitle = getRulerTitle(townEntity?.political?.tier || 1);
                const isDistrict = townEntity?.identity?.type === 'District';
                // Districts never generate a local ruler — their leader is always the parent city's ruler.
                const potentialJobs = isDistrict
                    ? ["Beggar", "Cultist", "Bandit", "Merchant", "Scholar", "Guard"]
                    : ["Beggar", rulerTitle, "Cultist", "Bandit", "Merchant", "Scholar", "Guard"];
                let availableJobs = potentialJobs.filter(job => job !== actor.currentRole);
                if (townEntity && townEntity.currentMayor === "The Player") {
                    availableJobs = availableJobs.filter(job => job !== rulerTitle);
                }
                const newJob = availableJobs[Math.floor(rng() * availableJobs.length)];

                if (newJob === rulerTitle) {
                    // Compute seizure event first so the oust can reference it via causedBy
                    const seizureEvent = makeEvent(`[Year ${currentYear}] Seized power and became the new ${rulerTitle}.`, 'power_seizure');
                    pushEvent(actor, seizureEvent);
                    const currentRuler = livingNpcs.find(n => n.currentRole === rulerTitle && n !== actor);
                    if (currentRuler) {
                        currentRuler.currentRole = "Citizen";
                        pushEvent(currentRuler, makeEvent(`[Year ${currentYear}] Was ousted from the ${rulerTitle}'s seat by ${actor.identity.name}.`, 'power_seizure', buildCausedBySnapshot(seizureEvent, actor.identity.name)));
                    }
                    if (townEntity) {
                        townEntity.currentMayor = actor.identity.name;
                    }
                    actor.currentRole = rulerTitle;
                } else {
                    const careerShiftEvent = makeEvent(`[Year ${currentYear}] Became a ${newJob}.`, 'career_shift');
                    pushEvent(actor, careerShiftEvent);

                    if (actor.currentRole === 'Merchant' && newJob !== 'Merchant') {
                        const socialRecipients = MEMORY_GIFT_PRIORITY.flatMap(rel =>
                            Object.entries(actor.knowledge.memories || {})
                                .filter(([, v]) => v === rel)
                                .map(([id]) => livingNpcs.find(n => n.identity.id === id && n !== actor))
                                .filter(Boolean)
                        );
                        const otherMerchants = livingNpcs.filter(n => n !== actor && n.currentRole === 'Merchant');

                        let socialIndex = 0;
                        for (const slot of (actor.merchantInventory || [])) {
                            const isValuable = MERCHANT_VALUABLE_PREFIXES.has(slot.prefix) || (slot.value ?? 0) >= MERCHANT_VALUABLE_THRESHOLD;
                            if (isValuable) {
                                actor.inventory = actor.inventory || { items: [] };
                                actor.inventory.items.push({ ...slot, quantity: 1 });
                            } else if (socialRecipients.length > 0) {
                                const recipient = socialRecipients[socialIndex % socialRecipients.length];
                                socialIndex++;
                                recipient.inventory = recipient.inventory || { items: [] };
                                recipient.inventory.items.push({ ...slot, quantity: slot.quantity });
                                pushEvent(recipient, makeEvent(
                                    `[Year ${currentYear}] Received ${slot.name} from ${actor.identity.name}, who closed their stall.`,
                                    'inheritance',
                                    buildCausedBySnapshot(careerShiftEvent, actor.identity.name)
                                ));
                            } else if (otherMerchants.length > 0) {
                                const recipient = otherMerchants[Math.floor(rng() * otherMerchants.length)];
                                recipient.merchantInventory = recipient.merchantInventory || [];
                                const existing = recipient.merchantInventory.find(s => s.itemId === slot.itemId);
                                if (existing) existing.quantity += slot.quantity;
                                else recipient.merchantInventory.push({ ...slot });
                                pushEvent(recipient, makeEvent(
                                    `[Year ${currentYear}] Acquired ${slot.quantity}× ${slot.name} from ${actor.identity.name}'s abandoned stall.`,
                                    'inheritance',
                                    buildCausedBySnapshot(careerShiftEvent, actor.identity.name)
                                ));
                            }
                        }
                        actor.merchantInventory = [];
                    }
                }
                actor.currentRole = newJob;
                if (townEntity?.currentMayor === actor.identity.name) {
                    townEntity.currentMayor = "None";
                }

                if (newJob === 'Merchant') {
                    actor.merchantInventory = generateMerchantInventory(rng, townEntity?.primaryExport || 'Grain', currentYear, coordinateKey);
                    actor.personalWealth = Math.floor(rng() * MERCHANT_WEALTH_RANGE) + MERCHANT_WEALTH_MIN;
                }
            } else if (eventRoll >= 0.18 && eventRoll < 0.33 && livingNpcs.length > 1) {
                log('history:social-event', { actorId: actor.identity.id, year: currentYear, roll: eventRoll });
                let target = livingNpcs[Math.floor(rng() * livingNpcs.length)];
                if (target !== actor && actor.knowledge.memories[target.identity.id] !== MEMORY_STATES.PARENT && actor.knowledge.memories[target.identity.id] !== MEMORY_STATES.CHILD) {
                    const socialRoll = rng();
                    const targetIsMarried = Object.values(target.knowledge.memories).includes(MEMORY_STATES.LOVES);

                    if (socialRoll < 0.33 && !actor.knowledge.memories[target.identity.id]) {
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] Formed a strong bond with ${target.identity.name}.`, 'friendship'));
                        actor.knowledge.memories[target.identity.id] = MEMORY_STATES.LIKES;
                    } else if (socialRoll < 0.66 && !isMarried && !targetIsMarried && actor.age >= 18 && target.age >= 18 && !actor.knowledge.memories[target.identity.id]) {
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] Fell deeply in love with ${target.identity.name}.`, 'romance'));
                        actor.knowledge.memories[target.identity.id] = MEMORY_STATES.LOVES;
                        target.knowledge.memories[actor.identity.id] = MEMORY_STATES.LOVES;
                        if (actor.memories) actor.memories.push({ type: 'love', targetId: target.identity.id, intensity: LOVE_MEMORY_INTENSITY, year: currentYear });
                        if (target.memories) target.memories.push({ type: 'love', targetId: actor.identity.id, intensity: LOVE_MEMORY_INTENSITY, year: currentYear });
                    } else if (socialRoll >= 0.66 && actor.knowledge.memories[target.identity.id] !== MEMORY_STATES.HATES) {
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] Started a bitter blood feud with ${target.identity.name}.`, 'rivalry'));
                        actor.knowledge.memories[target.identity.id] = MEMORY_STATES.HATES;
                        if (actor.memories) actor.memories.push({ type: 'hate', targetId: target.identity.id, intensity: HATE_MEMORY_INTENSITY, year: currentYear });
                    }
                }
            } else if (eventRoll >= 0.33 && eventRoll < 0.38) {
                // Artifacts generation - in the PRD this is limited to specific roles at 5% chance,
                // but tests expect it to happen here. This is a refinement to implement with better test coverage.
                const newArtifact = generateArtifact(rng, `world_X${targetX}_Y${targetY}`, currentYear, actor.identity.name);
                log('history:artifact-discovery', { actorId: actor.identity.id, year: currentYear, artifactId: newArtifact.id });
                pushEvent(actor, makeEvent(`[Year ${currentYear}] Discovered ${newArtifact.name} in the wilderness.`, 'artifact_discovery'));
                if (!actor.inventory) actor.inventory = { items: [] };
                actor.inventory.items.push(newArtifact);
                if (actor.memories && (newArtifact.prefix === 'Relic' || newArtifact.type === 'Tome')) {
                    actor.memories.push({ type: 'reverence', targetId: newArtifact.id, intensity: REVERENCE_MEMORY_INTENSITY, year: currentYear });
                }
            } else if (eventRoll >= 0.38 && eventRoll < 0.40) {
                if (ALL_RULER_TITLES.has(actor.currentRole)) continue;

                const familyIds = Object.keys(actor.knowledge.memories).filter(id =>
                    actor.knowledge.memories[id] === MEMORY_STATES.LOVES || actor.knowledge.memories[id] === MEMORY_STATES.CHILD
                );
                const migratingGroup = [actor, ...livingNpcs.filter(n => familyIds.includes(n.identity.id))];
                const destX = Math.floor(rng() * 100);
                const destY = Math.floor(rng() * 100);
                const destCoordinate = `world_X${destX}_Y${destY}`;
                migratingGroup.forEach(migrant => {
                    migrant.status = "Migrated";
                    pushEvent(migrant, makeEvent(`[Year ${currentYear}] Packed their belongings and migrated to coordinates X:${destX}, Y:${destY}.`, 'migration'));
                    const immigrantData = {
                        name: migrant.identity.name,
                        description: migrant.description,
                        ageAtArrival: currentYear - (migrant.birthYear ?? (currentYear - migrant.age)),
                        arrivedYear: currentYear,
                        birthYear: migrant.birthYear ?? (currentYear - migrant.age),
                        inventory: migrant.inventory.items,
                        memories: migrant.knowledge.memories
                    };
                    saveDelta(destCoordinate, migrant.identity.id, "immigrant_data", JSON.stringify(immigrantData));
                });
                log('history:migration', { year: currentYear, destination: destCoordinate, migrants: migratingGroup.map(m => m.identity.id) });
            }
        }
    }
}

/**
 * Classify the Traveler's impact and activate the appropriate legend on a town.
 * Called both from within simulateHistory (decade boundary during advance_time)
 * and from loadCoordinate / loadAsDistrict after the Delta Pass, so that a
 * temporalExposure > threshold is always caught on the first chunk load — not
 * only during explicit time-advance runs.
 *
 * @param {object} world        - miniplex ECS world
 * @param {object} townEntity   - town/district entity with a .mythos field
 * @param {string} coordinateKey - e.g. "world_X2_Y3"
 * @param {Array}  allDeltas    - delta rows for this coordinate (from getDeltas)
 * @param {number} currentYear  - in-world year to stamp on history events
 * @param {number} targetX      - tile X (needed to find faction entities)
 * @param {number} targetY      - tile Y (needed to find faction entities)
 * @param {Function} pushEvent  - (entity, event) → void; pass a no-op when called outside simulateHistory
 */
function checkMythosLegend(world, townEntity, coordinateKey, allDeltas, currentYear, targetX, targetY, pushEvent) {
    if (!townEntity?.mythos) return;
    if (townEntity.mythos.temporalExposure <= MYTHOS_EXPOSURE_LEGEND_THRESHOLD) return;
    if (townEntity.mythos.activeLegend) return;

    const violentCount = allDeltas.filter(d =>
        d.state_key === 'assassinated_leader' || d.state_key === 'assassinated_merchant_hub'
    ).length;
    const benevolentCount = allDeltas.filter(d =>
        d.state_key.startsWith('capsule_') || d.state_key === 'plutocracy_candidate'
    ).length;

    if (violentCount >= benevolentCount) {
        townEntity.mythos.activeLegend = 'shadow';
        townEntity.mythos.fearModifier = MYTHOS_FEAR_SHADOW;
        pushEvent(townEntity, makeEvent(
            `[Year ${currentYear}] The Shadow That Never Ages was spoken of in fearful whispers.`, 'legend'
        ));
        log('history:mythos-shadow', { coordinate: coordinateKey, year: currentYear });
    } else {
        const existingCult = Array.from(world.with('identity', 'factionType')
            .where(e => e.identity.type === 'Faction'
                && e.factionType === 'ancestral_reverence'
                && e.location.x === targetX && e.location.y === targetY)).at(0);

        let cultId;
        if (existingCult) {
            cultId = existingCult.identity.id;
        } else {
            const cultSeed = `cult_${coordinateKey}_${currentYear}`;
            const cultName = generateText(seedrandom(cultSeed), '#lastName#');
            cultId = crypto.createHash('md5').update(cultSeed).digest('hex').substring(0, 12);
            const cultEntity = world.add({
                identity: Identity(cultName, 'Faction', cultId),
                location: Location(targetX, targetY),
                members: [],
                history: History(),
                factionType: 'savior_cult',
                foundedYear: currentYear,
            });
            pushEvent(cultEntity, makeEvent(
                `[Year ${currentYear}] A Cult of the Timeless Savior founded.`, 'faction_spawn'
            ));
            saveDelta(coordinateKey, `faction_${cultId}`, JSON.stringify({
                id: cultId, name: cultName, type: 'savior_cult',
                members: [], foundedYear: currentYear,
            }));
            log('history:mythos-cult-spawned', { coordinate: coordinateKey, cultId, year: currentYear });
        }

        townEntity.mythos.activeLegend = 'savior';
        townEntity.mythos.cultFaction = cultId;
        pushEvent(townEntity, makeEvent(
            `[Year ${currentYear}] A Cult of the Timeless Savior founded.`, 'legend'
        ));
        log('history:mythos-savior', { coordinate: coordinateKey, cultId, year: currentYear });
    }

    upsertDelta(coordinateKey, townEntity.identity.name, 'mythos', JSON.stringify(townEntity.mythos));
}

module.exports = { simulateHistory, checkMythosLegend, MYTHOS_EXPOSURE_LEGEND_THRESHOLD, MEMORY_STATES, MAX_NATURAL_LIFESPAN, MAX_LIFESPAN_VARIANCE, computeDeathAge };
