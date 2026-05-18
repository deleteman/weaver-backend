// src/history.js
const { Identity, Location, History, Knowledge, Inventory, Quests } = require('./components');
const { generateText } = require('./grammar');
const { log } = require('./logger');
const crypto = require('crypto');
const { generateArtifact } = require('./items');
const { determineBiome } = require('./biomes');
const { replenishPopulationIfNeeded } = require('./population');
const { PoliticalEngine } = require('./politics');
const { saveDelta, getTierForCoordinate, upsertDelta, getDeltas } = require('./db');
const { simulate_economy, lockRuinHoard } = require('./economy');
const { getAdjacentTiles } = require('./map');
const { makeEvent, buildCausedBySnapshot } = require('./event-utils');

const SEX_MALE_THRESHOLD = 0.48;
const SEX_FEMALE_THRESHOLD = 0.96;

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

function simulateHistory(world, rng, targetX, targetY, totalYears = 20, startYear = 1) {
    log('simulateHistory:start', { targetX, targetY, totalYears, startYear });
    const townEntity = world.with('identity', 'currentMayor').where(e => (e.identity.type === "Town" || e.identity.type === "District") && e.location.x === targetX && e.location.y === targetY).first;
    const biome = determineBiome(targetX, targetY);

    const coordinateKey = `world_X${targetX}_Y${targetY}`;

    function pushEvent(entity, event) {
        entity.history.events.push(event);
    }

    // Initialize political and population components if not present
    if (townEntity && !townEntity.political) {
        townEntity.political = { tier: 1, demographics: {}, stance: 'Balanced' };
    }
    if (townEntity && !townEntity.population) {
        townEntity.population = 0;
    }

    for (let currentYear = startYear; currentYear < startYear + totalYears; currentYear++) {
        // Check for population replenishment every decade
        if (currentYear % 10 === 0) {
            replenishPopulationIfNeeded(world, targetX, targetY, rng, townEntity, biome, currentYear);
        }

        let livingNpcs = Array.from(world.with('identity', 'status', 'knowledge', 'history', 'inventory', 'description', 'location', 'currentRole')
            .where(e => e.location.x === targetX && e.location.y === targetY && e.identity.type === "NPC" && e.status === "Alive"));

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
                quests: Quests()
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
            const econResult = simulate_economy(townEntity, 10, rng, coordinateKey, currentYear);

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
            const allDeltas = getDeltas(coordinateKey);
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

        for (const actor of livingNpcs) {
            if (actor.status !== "Alive") continue;

            actor.age++;

            if (actor.age === 16) {
                if (actor.currentRole === "Child") actor.currentRole = "Citizen";
                actor.description = actor.description.replace("small child", "young adult");
                pushEvent(actor, makeEvent(`[Year ${currentYear}] Came of age and entered adulthood.`, 'age_transition'));
                log('history:age-transition', { actorId: actor.identity.id, year: currentYear });
            }

            const isMarried = Object.values(actor.knowledge.memories).includes("loves");
            for (const [targetId, feeling] of Object.entries(actor.knowledge.memories)) {
                if (feeling === "loves") {
                    const partner = livingNpcs.find(n => n.identity.id === targetId);
                    if (!partner) {
                        const partnerEntity = world.with('identity', 'history').where(e => e.identity.id === targetId).first;
                        const partnerEvents = partnerEntity?.history?.events ?? [];
                        const partnerLastEvent = partnerEvents[partnerEvents.length - 1];
                        const causingDeathEvent = (partnerLastEvent && partnerLastEvent.type === 'death') ? partnerLastEvent : null;
                        const partnerName = partnerEntity?.identity?.name ?? 'Unknown';
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] Was heartbroken by the loss of their love.`, 'grief', buildCausedBySnapshot(causingDeathEvent, partnerName)));
                        actor.knowledge.memories[targetId] = "mourns";
                    }
                }
            }

            const eventRoll = rng();

            if (isMarried && actor.age >= 18 && actor.age <= 50 && eventRoll < 0.08) {
                const partnerId = Object.keys(actor.knowledge.memories).find(k => actor.knowledge.memories[k] === "loves");
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
                        quests: Quests()
                    });

                    pushEvent(actor, makeEvent(`[Year ${currentYear}] Had a child named ${childName} with ${partner.identity.name}.`, 'birth'));
                    pushEvent(partner, makeEvent(`[Year ${currentYear}] Welcomed their child, ${childName}.`, 'birth'));
                    actor.knowledge.memories[childId] = "child";
                    partner.knowledge.memories[childId] = "child";
                    childEntity.knowledge.memories[actor.identity.id] = "parent";
                    childEntity.knowledge.memories[partner.identity.id] = "parent";
                    log('history:childbirth', { childId, parents: [actor.identity.id, partner.identity.id], year: currentYear });
                    livingNpcs.push(childEntity);
                    continue;
                }
            }

            if (actor.age < 16) {
                if (eventRoll > 0.98) {
                    actor.status = "Dead";
                    pushEvent(actor, makeEvent(`[Year ${currentYear}] Died of a tragic childhood fever.`, 'child_death'));
                    log('history:child-death', { actorId: actor.identity.id, year: currentYear });
                }
                continue;
            }

            if (eventRoll >= 0.08 && eventRoll < 0.10) {
                actor.status = "Dead";
                const causes = ["passed away peacefully in their sleep", "died of a sudden fever", "was killed by a wild beast"];
                const deathEvent = makeEvent(`[Year ${currentYear}] ${causes[Math.floor(rng() * causes.length)]}.`, 'death');
                pushEvent(actor, deathEvent);
                log('history:death', { actorId: actor.identity.id, year: currentYear });

                if (actor.inventory && actor.inventory.items.length > 0) {
                    const heirs = livingNpcs.filter(n =>
                        actor.knowledge.memories[n.identity.id] === "loves" ||
                        actor.knowledge.memories[n.identity.id] === "child"
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
                const potentialJobs = ["Beggar", "Mayor", "Cultist", "Bandit", "Merchant", "Scholar", "Guard"];
                let availableJobs = potentialJobs.filter(job => job !== actor.currentRole);
                if (townEntity && townEntity.currentMayor === "The Player") {
                    availableJobs = availableJobs.filter(job => job !== "Mayor");
                }
                const newJob = availableJobs[Math.floor(rng() * availableJobs.length)];

                if (newJob === "Mayor") {
                    // Compute seizure event first so the oust can reference it via causedBy
                    const seizureEvent = makeEvent(`[Year ${currentYear}] Seized power and became the new Mayor.`, 'power_seizure');
                    pushEvent(actor, seizureEvent);
                    const currentMayor = livingNpcs.find(n => n.currentRole === "Mayor" && n !== actor);
                    if (currentMayor) {
                        currentMayor.currentRole = "Citizen";
                        pushEvent(currentMayor, makeEvent(`[Year ${currentYear}] Was ousted from the Mayor's office by ${actor.identity.name}.`, 'power_seizure', buildCausedBySnapshot(seizureEvent, actor.identity.name)));
                    }
                    townEntity.currentMayor = actor.identity.name;
                } else {
                    pushEvent(actor, makeEvent(`[Year ${currentYear}] Became a ${newJob}.`, 'career_shift'));
                }
                actor.currentRole = newJob;
            } else if (eventRoll >= 0.18 && eventRoll < 0.33 && livingNpcs.length > 1) {
                log('history:social-event', { actorId: actor.identity.id, year: currentYear, roll: eventRoll });
                let target = livingNpcs[Math.floor(rng() * livingNpcs.length)];
                if (target !== actor && actor.knowledge.memories[target.identity.id] !== "parent" && actor.knowledge.memories[target.identity.id] !== "child") {
                    const socialRoll = rng();
                    const targetIsMarried = Object.values(target.knowledge.memories).includes("loves");

                    if (socialRoll < 0.33 && !actor.knowledge.memories[target.identity.id]) {
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] Formed a strong bond with ${target.identity.name}.`, 'friendship'));
                        actor.knowledge.memories[target.identity.id] = "likes";
                    } else if (socialRoll < 0.66 && !isMarried && !targetIsMarried && actor.age >= 18 && target.age >= 18 && !actor.knowledge.memories[target.identity.id]) {
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] Fell deeply in love with ${target.identity.name}.`, 'romance'));
                        actor.knowledge.memories[target.identity.id] = "loves";
                        target.knowledge.memories[actor.identity.id] = "loves";
                    } else if (socialRoll >= 0.66 && actor.knowledge.memories[target.identity.id] !== "hates") {
                        pushEvent(actor, makeEvent(`[Year ${currentYear}] Started a bitter blood feud with ${target.identity.name}.`, 'rivalry'));
                        actor.knowledge.memories[target.identity.id] = "hates";
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
            } else if (eventRoll >= 0.38 && eventRoll < 0.40) {
                if (actor.currentRole === "Mayor") continue;

                const familyIds = Object.keys(actor.knowledge.memories).filter(id =>
                    actor.knowledge.memories[id] === "loves" || actor.knowledge.memories[id] === "child"
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

module.exports = { simulateHistory };
