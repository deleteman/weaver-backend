// src/actions.js
const { saveDelta, upsertDelta, getDeltas, getGlobalYear, getSuzerainForCoordinate, getTierForCoordinate, getRuinHoard, appendJournalEntry } = require('./db');
const { generateArtifact } = require('./items');
const { log } = require('./logger');
const { makeEvent, buildCausedBySnapshot } = require('./event-utils');
const seedrandom = require('seedrandom');
const { ArtifactEffects } = require('./artifact-effects');
const { PlayerMechanics } = require('./player-mechanics');
const { QUEST_TYPES } = require('./quests');
const { MEMORY_STATES } = require('./history');
const { getRulerTitle } = require('./politics');

const LOG_PREFIX = '[ACTION]';

const RULER_TITLES = ['Mayor', 'Lord', 'Magistrate', 'King'];

function actionLog(event, details = {}) {
    log(`${LOG_PREFIX} ${event}`, details);
}

function ensurePlayerState(playerState) {
    if (!playerState) playerState = {};
    if (!playerState.stats) playerState.stats = {};
    if (playerState.stats.stealth === undefined) playerState.stats.stealth = 5;
    if (playerState.stats.strength === undefined) playerState.stats.strength = 5;
    if (!playerState.titles) playerState.titles = {};
    if (typeof playerState.reputation !== 'number') playerState.reputation = 0;
    if (!playerState.reputationMap) playerState.reputationMap = {};
    if (!Array.isArray(playerState.inventory)) playerState.inventory = [];
    if (typeof playerState.xp !== 'number') playerState.xp = 0;
    if (typeof playerState.level !== 'number') playerState.level = 1;
    if (typeof playerState.gold !== 'number') playerState.gold = 0;
    return playerState;
}

function findEntity(world, targetId, components = ['identity']) {
    return world.with(...components).where(e => e.identity.id === targetId || e.identity.name === targetId).first;
}

function persistInventory(coordinate, entity) {
    if (!entity || !entity.inventory || !Array.isArray(entity.inventory.items)) return;
    saveDelta(coordinate, entity.identity.id, 'inventory', JSON.stringify(entity.inventory.items));
    actionLog('persistInventory', { coordinate, entityId: entity.identity.id, itemCount: entity.inventory.items.length });
}

const MYTHOS_DEFAULT = { temporalExposure: 0, activeLegend: null, cultFaction: null, fearModifier: 1, titheAccumulated: 0 };

function incrementTemporalExposure(world, coordinate, amount) {
    const town = world.with('identity', 'mythos')
        .where(e => e.identity.type === 'Town' || e.identity.type === 'District').first;
    if (!town) return;
    if (!town.mythos) town.mythos = { ...MYTHOS_DEFAULT };
    town.mythos.temporalExposure += amount;
    upsertDelta(coordinate, town.identity.name, 'mythos', JSON.stringify(town.mythos));
}

function appendHistory(coordinate, entity, event) {
    if (!entity) return;
    if (!entity.history || !Array.isArray(entity.history.events)) {
        entity.history = { events: [] };
    }
    const evObj = typeof event === 'string' ? makeEvent(event, 'legacy') : event;
    entity.history.events.push(evObj);
    saveDelta(coordinate, entity.identity.id, 'history_append', JSON.stringify(evObj));
    actionLog('appendHistory', { coordinate, entityId: entity.identity.id, eventId: evObj.id });
}

const GRIEF_MESSAGES = {
    loves:  'Was heartbroken by the loss of their love.',
    parent: 'Was grief-stricken by the death of their parent.',
    child:  'Was devastated by the loss of their child.',
};

function triggerMourningForLovedOnes(world, coordinate, deceasedNPC, currentYear) {
    const mourners = world.with('identity', 'status', 'knowledge', 'history').where(e =>
        e.identity.type === 'NPC' &&
        e.status === 'Alive' &&
        GRIEF_MESSAGES[e.knowledge?.memories?.[deceasedNPC.identity.id]] !== undefined
    );
    const deathEvents = deceasedNPC.history?.events ?? [];
    const causingEvent = deathEvents[deathEvents.length - 1] ?? null;
    const causedBy = buildCausedBySnapshot(causingEvent, deceasedNPC.identity.name);
    for (const mourner of mourners) {
        const relationship = mourner.knowledge.memories[deceasedNPC.identity.id];
        const griefEvent = makeEvent(`[Year ${currentYear}] ${GRIEF_MESSAGES[relationship]}`, 'grief', causedBy);
        appendHistory(coordinate, mourner, griefEvent);
        mourner.knowledge.memories[deceasedNPC.identity.id] = 'mourns';
        saveDelta(coordinate, mourner.identity.id, `memory_${deceasedNPC.identity.id}`, 'mourns');
        actionLog('triggerMourning', { mournerID: mourner.identity.id, deceasedId: deceasedNPC.identity.id, year: currentYear, relationship });
    }
}

function awardXP(playerState, amount) {
    playerState = ensurePlayerState(playerState);
    const leveled = processXP(playerState, amount);
    actionLog('awardXP', { amount, level: playerState.level, xp: playerState.xp, leveled });
    return leveled;
}

function maybeAwardTitle(playerState, statKey, threshold, title, scope = 'Global') {
    playerState = ensurePlayerState(playerState);
    playerState.stats[statKey] = (playerState.stats[statKey] || 0) + 1;
    if (playerState.stats[statKey] >= threshold && playerState.titles[scope] !== title) {
        playerState.titles[scope] = title;
        actionLog('awardTitle', { title, scope, statKey, count: playerState.stats[statKey] });
    }
    return playerState;
}

function processXP(playerState, amount) {
    playerState.xp += amount;
    let leveledUp = false;
    while (playerState.xp >= playerState.level * 100) {
        playerState.xp -= (playerState.level * 100);
        playerState.level += 1;
        playerState.stats.stealth += 1;
        playerState.stats.strength += 1;
        leveledUp = true;
    }
    return leveledUp;
}

function getCurrentYear(coordinateString) {
    return getGlobalYear();
}

function getSettlementName(world) {
    const town = world.with('identity').where(e => e.identity.type === 'Town' || e.identity.type === 'District').first;
    return town?.identity?.name ?? 'Unknown Settlement';
}

function applyReputationWithPropagation(playerState, coordinate, baseAmount, isFailed = false) {
    const suzerainKey = getSuzerainForCoordinate(coordinate);
    const isColony = suzerainKey !== null;
    const { local, suzerain } = PlayerMechanics.calculateReputationDelta('action', baseAmount, isColony, isFailed);

    playerState.reputation += local;

    if (!playerState.reputationMap) playerState.reputationMap = {};
    playerState.reputationMap[coordinate] = (playerState.reputationMap[coordinate] || 0) + local;
    if (suzerain !== undefined && suzerainKey) {
        playerState.reputationMap[suzerainKey] = (playerState.reputationMap[suzerainKey] || 0) + suzerain;
    }
}

function stealItem(world, coordinate, targetId, itemId, playerState) {
    actionLog('stealItem:start', { coordinate, targetId, itemId });
    playerState = ensurePlayerState(playerState);

    const targetNPC = findEntity(world, targetId, ['identity', 'inventory', 'status']);
    if (!targetNPC || targetNPC.status === "Dead") {
        actionLog('stealItem:target-missing', { targetId });
        return { success: false, message: `Target not found or dead.` };
    }

    const itemIndex = targetNPC.inventory.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
        actionLog('stealItem:item-missing', { targetId, itemId });
        return { success: false, message: `${targetNPC.identity.name} does not have that item.` };
    }

    const [targetItem] = targetNPC.inventory.items.splice(itemIndex, 1);
    const stolenItem = JSON.parse(JSON.stringify(targetItem));
    persistInventory(coordinate, targetNPC);

    const failChance = Math.max(0.10, 0.60 - (playerState.stats.stealth * 0.05));
    actionLog('stealItem:roll', { targetId, itemId, failChance });

    // Intentional non-deterministic player-experience roll — not a generation path
    if (Math.random() < failChance) {
        targetNPC.inventory.items.splice(itemIndex, 0, targetItem);
        persistInventory(coordinate, targetNPC);

        applyReputationWithPropagation(playerState, coordinate, -10, true);
        let msg = `You were caught trying to steal ${targetItem.name}! Your reputation fell.`;

        if (playerState.inventory.length > 0) {
            // Intentional non-deterministic player-experience roll — not a generation path
            const lostItem = playerState.inventory.splice(Math.floor(Math.random() * playerState.inventory.length), 1)[0];
            targetNPC.inventory.items.push(lostItem);
            persistInventory(coordinate, targetNPC);
            msg += ` As punishment, they confiscated your ${lostItem.name}.`;
            actionLog('stealItem:punished', { lostItemId: lostItem.id, playerInventoryCount: playerState.inventory.length });
        }

        actionLog('stealItem:failed', { targetId, itemId, reputation: playerState.reputation });
        return { success: false, message: msg };
    }

    playerState.inventory.push(stolenItem);
    maybeAwardTitle(playerState, 'itemsStolen', 5, 'Master Thief');
    const leveled = awardXP(playerState, 25);

    let msg = `🥷 You stole ${targetItem.name}! (+25 XP)`;
    if (playerState.titles["Global"] === "Master Thief") msg += ` Your prolific stealing has earned you the title of Master Thief!`;
    if (leveled) msg += ` YOU LEVELED UP TO LEVEL ${playerState.level}!`;

    const settlementName = getSettlementName(world);
    appendJournalEntry({
        year: getCurrentYear(coordinate),
        action: 'steal',
        coordinate,
        npcId: targetNPC.identity.id,
        itemId: stolenItem.id,
        summary: `Stole ${targetItem.name} from ${targetNPC.identity.name} (${targetNPC.currentRole ?? 'Citizen'}) in ${settlementName}`,
        detail: { settlementName, npcName: targetNPC.identity.name, itemName: targetItem.name, xpGained: 25 }
    });
    incrementTemporalExposure(world, coordinate, 3);
    actionLog('stealItem:success', { targetId, itemId, newInventoryCount: playerState.inventory.length });
    return { success: true, message: msg };
}

function assassinate(world, coordinate, targetId, playerState) {
    actionLog('assassinate:start', { coordinate, targetId });
    playerState = ensurePlayerState(playerState);

    const targetNPC = findEntity(world, targetId, ['identity', 'status', 'currentRole']);
    const town = world.with('identity', 'history').where(e => e.identity.type === "Town" || e.identity.type === "District").first;
    const currentYear = getCurrentYear(coordinate);
    
    if (!targetNPC || targetNPC.status === "Dead") {
        actionLog('assassinate:target-missing', { targetId });
        return { success: false, message: `Target not found or dead.` };
    }

    let successChance = 0.40 + (playerState.stats.strength * 0.05) + (playerState.stats.stealth * 0.05);
    if (targetNPC.currentRole === "Guard") successChance -= 0.30;
    if (RULER_TITLES.includes(targetNPC.currentRole)) successChance -= 0.40;
    if (targetNPC.currentRole === "Puppet") successChance -= 0.20;

    // Intentional non-deterministic player-experience roll — not a generation path
    if (Math.random() < successChance) {
        targetNPC.status = "Dead";
        saveDelta(coordinate, targetNPC.identity.id, "status", "Dead");
        appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Assassinated by a mysterious traveler.`, 'assassination'));
        triggerMourningForLovedOnes(world, coordinate, targetNPC, currentYear);

        let msg = `🗡️ You assassinated ${targetNPC.identity.name}!`;
        const leveled = awardXP(playerState, 75);

        if (targetNPC.currentRole === "Puppet" && town.identity.type === "District") {
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The puppet administrator was slain. The parent city will appoint another.`, 'assassination'));
            msg += ` The puppet administrator is dead. ${town.parentCity} will install a replacement — only deposing the parent ruler would change this district's fate.`;
        } else if (RULER_TITLES.includes(targetNPC.currentRole) && town.identity.type === "District") {
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] A district administrator was slain by a traveler, but the parent city's rule endures.`, 'assassination'));
            msg += ` The district is briefly leaderless, but it remains under its parent city's authority.`;
        } else if (RULER_TITLES.includes(targetNPC.currentRole) && playerState.reputation >= 20) {
            const claimedTitle = getRulerTitle(town?.political?.tier || 1);
            town.currentMayor = "The Player";
            saveDelta(coordinate, town.identity.name, "currentMayor", "The Player");
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The ${targetNPC.currentRole} was slain, and the respected traveler seized control of the settlement.`, 'chaos'));
            msg += ` The settlement respects your ruthless power. YOU are the new ${claimedTitle}!`;
            applyReputationWithPropagation(playerState, coordinate, 50);

            if (!playerState.titles) playerState.titles = {};
            playerState.titles[town.identity.name] = claimedTitle;

        } else if (RULER_TITLES.includes(targetNPC.currentRole)) {
            town.currentMayor = "None";
            saveDelta(coordinate, town.identity.name, "currentMayor", "None");
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The ${targetNPC.currentRole} was murdered, throwing the settlement into chaos.`, 'chaos'));
            msg += ` The settlement is in chaos without a leader. You are a wanted criminal.`;
            applyReputationWithPropagation(playerState, coordinate, -40);
        }

        if (leveled) msg += ` (+75 XP) YOU LEVELED UP TO LEVEL ${playerState.level}!`;
        const settlementName = town?.identity?.name ?? coordinate;
        appendJournalEntry({
            year: currentYear,
            action: 'assassinate',
            coordinate,
            npcId: targetNPC.identity.id,
            summary: `Assassinated ${targetNPC.identity.name} (${targetNPC.currentRole ?? 'Citizen'}) in ${settlementName}`,
            detail: { settlementName, npcName: targetNPC.identity.name, xpGained: 75 }
        });
        incrementTemporalExposure(world, coordinate, 20);
        return { success: true, message: msg };
    } else {
        applyReputationWithPropagation(playerState, coordinate, -30, true);
        return { success: false, message: `Attempt failed! You were spotted trying to kill ${targetNPC.identity.name}. Your reputation tanked.` };
    }
}

function turnInQuest(world, coordinate, targetId, itemId, playerState) {
    actionLog('turnInQuest:start', { coordinate, targetId, itemId });

    // Detect router argument shifting for Bounties: when no itemId is given, the
    // router passes playerState in the itemId slot and leaves playerState undefined.
    if (playerState === undefined || playerState === null) {
        playerState = itemId;
        itemId = null;
    }

    // Auto-detect fetch quest item when client sends no itemId (bought items pre-fix,
    // or old playerState data with itemId instead of id).
    if (!itemId) {
        const questGiverForFetch = findEntity(world, targetId, ['quests']);
        const fetchQuest = questGiverForFetch?.quests?.offeredQuests?.find(q => q.type === QUEST_TYPES.FETCH);
        if (fetchQuest) {
            const match = playerState?.inventory?.find(i => i.type === fetchQuest.itemType);
            if (match) itemId = match.id || match.itemId;
        }
    }

    playerState = ensurePlayerState(playerState);

    const questGiver = findEntity(world, targetId, ['identity', 'inventory', 'status', 'currentRole', 'knowledge']);
    const currentYear = getGlobalYear(); // Ensure you use getGlobalYear() here!

    if (!questGiver || questGiver.status === "Dead") {
        actionLog('turnInQuest:missing-questgiver', { targetId });
        return { success: false, message: `Quest giver not found or dead.` };
    }

    if (itemId) {
        const playerItemIndex = playerState.inventory.findIndex(i => (i.id || i.itemId) === itemId);

        if (playerItemIndex > -1) {
            const donatedItem = playerState.inventory[playerItemIndex];
            
            const fetchQuest = questGiver.quests.offeredQuests.find(q => q.type === QUEST_TYPES.FETCH);
            if (fetchQuest && donatedItem.type !== fetchQuest.itemType) {
                return { success: false, message: `They are looking for a ${fetchQuest.itemType}, not a ${donatedItem.type}.` };
            }

            playerState.inventory.splice(playerItemIndex, 1);
            questGiver.inventory.items.push(donatedItem);

            const coordMatch = coordinate.match(/world_X(-?\d+)_Y(-?\d+)/);
            const cx = coordMatch ? parseInt(coordMatch[1]) : 0;
            const cy = coordMatch ? parseInt(coordMatch[2]) : 0;
            const artifactRng = seedrandom(`artifact_${donatedItem.id}_${coordinate}`);
            const roleBeforeEffect = questGiver.currentRole;

            if (donatedItem.type === "Weapon") {
                ArtifactEffects.applyWeaponEffect(world, cx, cy, donatedItem, questGiver, artifactRng);
            } else if (donatedItem.type === "Tome") {
                ArtifactEffects.applyTomeEffect(world, cx, cy, donatedItem, questGiver, artifactRng);
            } else if (donatedItem.type === "Jewelry") {
                ArtifactEffects.applyJewelryEffect(world, cx, cy, donatedItem, questGiver, artifactRng);
            } else if (donatedItem.type === "Relic") {
                const npcs = Array.from(world.with('identity', 'status').where(e => e.identity.type === 'NPC' && e.status === 'Alive'));
                ArtifactEffects.applyRelicEffect(world, cx, cy, donatedItem, questGiver, npcs, artifactRng, currentYear);
            }

            const heistQuest = questGiver.quests?.offeredQuests?.find(
                q => q.type === QUEST_TYPES.MYSTERY_HEIST && q.itemId === itemId
            );
            if (heistQuest) {
                const enemyId = heistQuest.target;
                questGiver.knowledge.memories[enemyId] = MEMORY_STATES.SATISFIED;
                saveDelta(coordinate, questGiver.identity.id, `memory_${enemyId}`, MEMORY_STATES.SATISFIED);
                questGiver.quests.offeredQuests = questGiver.quests.offeredQuests.filter(q => q !== heistQuest);
            }

            if (fetchQuest) {
                questGiver.quests.offeredQuests = questGiver.quests.offeredQuests.filter(q => q !== fetchQuest);
            }

            const roleChanged = questGiver.currentRole !== roleBeforeEffect;
            if (roleChanged) {
                saveDelta(coordinate, questGiver.identity.id, "currentRole", questGiver.currentRole);
            }

            const butterflyEvent = makeEvent(`[Year ${currentYear}] Received ${donatedItem.name} from a traveler${roleChanged ? ` and was transformed into a ${questGiver.currentRole}` : ''}.`, roleChanged ? 'career_shift' : 'legacy');
            appendHistory(coordinate, questGiver, butterflyEvent);
            persistInventory(coordinate, questGiver);

            applyReputationWithPropagation(playerState, coordinate, 20);
            const leveled = processXP(playerState, 50);
            let msg = `🤝 You gave ${donatedItem.name} to ${questGiver.identity.name}. (+50 XP)`;
            if (leveled) msg += ` YOU LEVELED UP TO LEVEL ${playerState.level}!`;

            const settlementNameFetch = getSettlementName(world);
            appendJournalEntry({
                year: currentYear,
                action: 'turnin',
                coordinate,
                npcId: questGiver.identity.id,
                itemId: donatedItem.id,
                summary: `Completed quest '${donatedItem.name}' — delivered artifact to ${questGiver.identity.name} in ${settlementNameFetch}`,
                detail: { settlementName: settlementNameFetch, npcName: questGiver.identity.name, itemName: donatedItem.name, xpGained: 50 }
            });
            incrementTemporalExposure(world, coordinate, 5);
            return { success: true, message: msg };
        }

        // FIX 2: Change ${itemName} to generic text to prevent ReferenceErrors
        return { success: false, message: `You do not have that item.` };
    } 
    else {
        // REPORTING A BOUNTY
        let avengedTargetName = null;
        let avengedTargetId = null;

        for (const [enemyId, feeling] of Object.entries(questGiver.knowledge.memories)) {
            if (feeling === MEMORY_STATES.HATES) {
                const enemy = world.with('identity', 'status').where(e => e.identity.id === enemyId).first;
                if (enemy && enemy.status === "Dead") {
                    avengedTargetName = enemy.identity.name;
                    avengedTargetId = enemy.identity.id;
                    break;
                }
            }
        }

        if (avengedTargetName) {
            questGiver.knowledge.memories[avengedTargetId] = MEMORY_STATES.AVENGED;
            saveDelta(coordinate, questGiver.identity.id, `memory_${avengedTargetId}`, MEMORY_STATES.AVENGED);

            const avengedQuest = questGiver.quests?.offeredQuests?.find(
                q => q.type === QUEST_TYPES.BOUNTY && q.target === avengedTargetId
            );
            if (avengedQuest) {
                questGiver.quests.offeredQuests = questGiver.quests.offeredQuests.filter(q => q !== avengedQuest);
            }

            appendHistory(coordinate, questGiver, makeEvent(`[Year ${currentYear}] Was finally avenged when the traveler eliminated ${avengedTargetName}.`, 'assassination'));

            maybeAwardTitle(playerState, 'bountiesCompleted', 3, 'Master Assassin');
            applyReputationWithPropagation(playerState, coordinate, 30);
            const leveled = awardXP(playerState, 100);
            
            let msg = `🩸 You reported the death of ${avengedTargetName} to ${questGiver.identity.name}. (+100 XP)`;
            if (playerState.titles["Global"] === "Master Assassin") msg += ` Your lethal efficiency has earned you the title of Master Assassin!`;
            if (leveled) msg += ` YOU LEVELED UP TO LEVEL ${playerState.level}!`;

            const settlementNameBounty = getSettlementName(world);
            appendJournalEntry({
                year: currentYear,
                action: 'turnin',
                coordinate,
                npcId: questGiver.identity.id,
                summary: `Completed bounty on ${avengedTargetName} — reported to ${questGiver.identity.name} in ${settlementNameBounty}`,
                detail: { settlementName: settlementNameBounty, npcName: questGiver.identity.name, avengedName: avengedTargetName, xpGained: 100 }
            });
            incrementTemporalExposure(world, coordinate, 5);
            return { success: true, message: msg };
        }
        return { success: false, message: `You have no completed bounties to report to this person.` };
    }
}

// --- MAYOR ACTIONS ---

function claimThrone(world, coordinate, playerState) {
    actionLog('claimThrone:start', { coordinate });
    playerState = ensurePlayerState(playerState);

    const town = world.with('identity').where(e => e.identity.type === "Town" || e.identity.type === "District").first;
    const currentYear = getCurrentYear(coordinate);

    if (town.identity.type === "District") {
        actionLog('claimThrone:district-blocked');
        return { success: false, message: `This is a district governed by its parent city. Travel there to take political action.` };
    }

    const claimedTitle = getRulerTitle(town?.political?.tier || 1);
    const activeRuler = world.with('currentRole', 'status').where(e => RULER_TITLES.includes(e.currentRole) && e.status === "Alive").first;

    if (activeRuler) {
        actionLog('claimThrone:occupied');
        return { success: false, message: `The throne is currently occupied. You must eliminate them or wait for them to step down.` };
    }
    if (playerState.reputation < 20) {
        actionLog('claimThrone:low-reputation', { reputation: playerState.reputation });
        return { success: false, message: `You are not respected enough to claim the throne.` };
    }

    town.currentMayor = "The Player";
    saveDelta(coordinate, town.identity.name, "currentMayor", "The Player");
    appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] With the seat empty, the traveler stepped up and claimed the title of ${claimedTitle}.`, 'power_seizure'));

    playerState.titles[town.identity.name] = claimedTitle;
    applyReputationWithPropagation(playerState, coordinate, 30);

    appendJournalEntry({
        year: currentYear,
        action: 'claim',
        coordinate,
        summary: `Claimed the throne of ${town.identity.name}`,
        detail: { settlementName: town.identity.name }
    });
    actionLog('claimThrone:success', { town: town.identity.name });
    return { success: true, message: `👑 You have stepped up to lead! You are now the ${claimedTitle} of ${town.identity.name}!` };
}

function isMayor(world, playerState) {
    const town = world.with('identity', 'currentMayor').where(e => e.identity.type === "Town" || e.identity.type === "District").first;
    if (!town || town.identity.type === "District") return false;
    const claimedTitle = playerState.titles && playerState.titles[town.identity.name];
    if (!RULER_TITLES.includes(claimedTitle)) return false;
    // Cross-check against world state — prevents a stale or tampered client title
    // (e.g. carried over from a wiped DB) from authorising mayor-only actions.
    return town.currentMayor === "The Player";
}

function taxTown(world, coordinate, playerState) {
    actionLog('taxTown:start', { coordinate });
    playerState = ensurePlayerState(playerState);

    if (!isMayor(world, playerState)) {
        actionLog('taxTown:unauthorized');
        return { success: false, message: "Only the ruling leader can levy taxes." };
    }

    const citizens = Array.from(world.with('identity', 'inventory', 'status', 'knowledge').where(e => e.identity.type === "NPC" && e.status === "Alive"));
    let itemsStolen = 0;

    for (const citizen of citizens) {
        if (citizen.inventory.items.length > 0) {
            const confiscated = citizen.inventory.items.splice(0, 1)[0]; 
            playerState.inventory.push(confiscated);
            itemsStolen++;
            
            citizen.knowledge.memories["The Player"] = MEMORY_STATES.HATES;
            persistInventory(coordinate, citizen);
            saveDelta(coordinate, citizen.identity.id, "memory_The Player", MEMORY_STATES.HATES);
            actionLog('taxTown:confiscated', { citizenId: citizen.identity.id, confiscatedId: confiscated.id });
        }
    }

    applyReputationWithPropagation(playerState, coordinate, -(itemsStolen * 10));
    const taxSettlementName = getSettlementName(world);
    appendJournalEntry({
        year: getCurrentYear(coordinate),
        action: 'tax',
        coordinate,
        summary: `Taxed ${taxSettlementName} — confiscated ${itemsStolen} items`,
        detail: { settlementName: taxSettlementName, itemsStolen }
    });
    actionLog('taxTown:complete', { itemsStolen, reputation: playerState.reputation });
    return { success: true, message: `💰 You abused your power and taxed ${itemsStolen} items from the town. The people despise you.` };
}

function decree(world, coordinate, targetId, newRole, playerState) {
    actionLog('decree:start', { coordinate, targetId, newRole });
    if (!isMayor(world, playerState)) {
        actionLog('decree:unauthorized');
        return { success: false, message: "Only the ruling leader can issue decrees." };
    }
    
    const targetNPC = findEntity(world, targetId, ['identity', 'status']);
    const currentYear = getCurrentYear(coordinate);

    if (!targetNPC || targetNPC.status === "Dead") {
        actionLog('decree:target-missing', { targetId });
        return { success: false, message: "Target not found." };
    }

    targetNPC.currentRole = newRole;
    saveDelta(coordinate, targetNPC.identity.id, "currentRole", newRole);
    appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Was officially decreed a ${newRole} by the ruling leader.`, 'career_shift'));

    const decreeSettlementName = getSettlementName(world);
    appendJournalEntry({
        year: currentYear,
        action: 'decree',
        coordinate,
        npcId: targetNPC.identity.id,
        summary: `Decreed ${targetNPC.identity.name} to role ${newRole} in ${decreeSettlementName}`,
        detail: { settlementName: decreeSettlementName, npcName: targetNPC.identity.name, newRole }
    });
    actionLog('decree:success', { targetId, newRole });

    return { success: true, message: `📜 You have decreed ${targetNPC.identity.name} to be a ${newRole}.` };
}

function banish(world, coordinate, targetId, playerState) {
    actionLog('banish:start', { coordinate, targetId });
    if (!isMayor(world, playerState)) {
        actionLog('banish:unauthorized');
        return { success: false, message: "Only the ruling leader can banish citizens." };
    }
    
    const targetNPC = findEntity(world, targetId, ['identity', 'status', 'knowledge', 'inventory', 'description', 'age']);
    const currentYear = getCurrentYear(coordinate);

    if (!targetNPC || targetNPC.status === "Dead") {
        actionLog('banish:target-missing', { targetId });
        return { success: false, message: "Target not found." };
    }

    targetNPC.status = "Exiled";
    saveDelta(coordinate, targetNPC.identity.id, "status", "Exiled");
    appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Stripped of titles and exiled from the settlement by the ruling leader.`, 'migration'));
    
    const banishRng = seedrandom(`banish_${coordinate}_${getGlobalYear()}`);
    const destX = Math.floor(banishRng() * 100);
    const destY = Math.floor(banishRng() * 100);
    const destCoordinate = `world_X${destX}_Y${destY}`;

    targetNPC.knowledge.memories["The Player"] = MEMORY_STATES.HATES;
    const immigrantData = {
        name: targetNPC.identity.name,
        description: targetNPC.description,
        ageAtArrival: targetNPC.age,
        arrivedYear: currentYear,
        birthYear: targetNPC.birthYear ?? (currentYear - targetNPC.age),
        inventory: targetNPC.inventory.items,
        memories: targetNPC.knowledge.memories
    };

    saveDelta(destCoordinate, targetNPC.identity.id, "immigrant_data", JSON.stringify(immigrantData));
    applyReputationWithPropagation(playerState, coordinate, -15);

    const banishSettlementName = getSettlementName(world);
    appendJournalEntry({
        year: currentYear,
        action: 'banish',
        coordinate,
        npcId: targetNPC.identity.id,
        summary: `Banished ${targetNPC.identity.name} from ${banishSettlementName}`,
        detail: { settlementName: banishSettlementName, npcName: targetNPC.identity.name, destination: destCoordinate }
    });
    actionLog('banish:success', { targetId, destination: destCoordinate });

    return { success: true, message: `🛑 You banished ${targetNPC.identity.name}. They were last seen wandering towards coordinates X:${destX}, Y:${destY} swearing revenge against you.` };
}

function abdicate(world, coordinate, playerState) {
    actionLog('abdicate:start', { coordinate });
    const town = world.with('identity').where(e => e.identity.type === "Town" || e.identity.type === "District").first;
    const currentYear = getCurrentYear(coordinate);
    if (!isMayor(world, playerState)) {
        actionLog('abdicate:unauthorized');
        return { success: false, message: "You are not the ruling leader." };
    }

    const rulerTitle = getRulerTitle(town?.political?.tier || 1);
    const citizens = Array.from(world.with('identity', 'status', 'knowledge').where(e => e.identity.type === "NPC" && e.status === "Alive"));
    const abdicateRng = seedrandom(`abdicate_${coordinate}_${getGlobalYear()}`);
    let nextMayor = citizens[Math.floor(abdicateRng() * citizens.length)];

    delete playerState.titles[town.identity.name];

    const abdicateSettlementName = town?.identity?.name ?? coordinate;
    if (nextMayor) {
        nextMayor.currentRole = rulerTitle;
        saveDelta(coordinate, nextMayor.identity.id, "currentRole", rulerTitle);
        town.currentMayor = nextMayor.identity.name;
        saveDelta(coordinate, town.identity.name, "currentMayor", nextMayor.identity.name);
        appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The traveler abdicated, and the people elected ${nextMayor.identity.name} as the new ${rulerTitle}.`, 'power_seizure'));

        applyReputationWithPropagation(playerState, coordinate, 25);
        appendJournalEntry({
            year: currentYear,
            action: 'abdicate',
            coordinate,
            npcId: nextMayor.identity.id,
            summary: `Abdicated throne of ${abdicateSettlementName} to ${nextMayor.identity.name}`,
            detail: { settlementName: abdicateSettlementName, npcName: nextMayor.identity.name }
        });
        actionLog('abdicate:success', { nextMayorId: nextMayor.identity.id });
        return { success: true, message: `🕊️ You peacefully stepped down. ${nextMayor.identity.name} is the new ${rulerTitle}.` };
    } else {
        town.currentMayor = "NPC";
        saveDelta(coordinate, town.identity.name, "currentMayor", "NPC");
        appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The traveler abdicated, leaving the town leaderless.`, 'power_seizure'));
        appendJournalEntry({
            year: currentYear,
            action: 'abdicate',
            coordinate,
            summary: `Abdicated throne of ${abdicateSettlementName} — town left leaderless`,
            detail: { settlementName: abdicateSettlementName }
        });
        actionLog('abdicate:leaderless');
        return { success: true, message: `🕊️ You stepped down. With no one to replace you, the town is leaderless.` };
    }
}

// FIX: New Tomb Looting Action!
function lootTomb(world, coordinate, targetId, playerState) {
    actionLog('lootTomb:start', { coordinate, targetId });
    playerState = ensurePlayerState(playerState);

    // NPC Tomb path: caller specified a target → loot that dead NPC's tomb
    if (targetId) {
        const targetNPC = findEntity(world, targetId, ['identity', 'inventory', 'status']);

        if (!targetNPC || targetNPC.status === "Alive") {
            actionLog('lootTomb:invalid-target', { targetId });
            return { success: false, message: `Target not found or is still alive!` };
        }
        if (targetNPC.inventory.items.length === 0) {
            actionLog('lootTomb:empty-tomb', { targetId });
            return { success: false, message: `The tomb is empty.` };
        }

        const lootedItems = [...targetNPC.inventory.items];
        playerState.inventory.push(...lootedItems);
        targetNPC.inventory.items = [];
        persistInventory(coordinate, targetNPC);

        applyReputationWithPropagation(playerState, coordinate, -5);
        appendJournalEntry({
            year: getCurrentYear(coordinate),
            action: 'loot_tomb',
            coordinate,
            npcId: targetNPC.identity.id,
            summary: `Looted ${targetNPC.identity.name} — took ${lootedItems.length} item(s)`,
            detail: { settlementName: getSettlementName(world), npcName: targetNPC.identity.name, itemCount: lootedItems.length }
        });
        actionLog('lootTomb:success', { targetId, lootedCount: lootedItems.length });
        return { success: true, message: `🦇 You looted the tomb of ${targetNPC.identity.name} and found: ${lootedItems.map(i => i.name).join(", ")}. (-5 Reputation)` };
    }

    // Ruin Hoard path: no targetId → loot the tile if it is a ruin (tier 0)
    const tileTier = getTierForCoordinate(coordinate);
    if (tileTier !== 0) {
        return { success: false, message: `There is nothing to loot here.` };
    }

    const currentYear = getGlobalYear();
    const ruinRng = seedrandom(`${coordinate}_loot_${currentYear}`);
    const goldFound = Math.floor(ruinRng() * 10 + 1) * 100;

    if (!playerState.inventory) playerState.inventory = [];
    if (typeof playerState.gold !== 'number') playerState.gold = 0;
    playerState.gold += goldFound;

    let lootedItem = null;
    const hoardRow = getRuinHoard(coordinate);
    if (hoardRow && ruinRng() < 0.10) {
        lootedItem = generateArtifact(ruinRng, coordinate, currentYear, 'ruin_hoard');
        playerState.inventory.push(lootedItem);
    }

    appendJournalEntry({
        year: currentYear,
        action: 'loot_tomb',
        coordinate,
        itemId: lootedItem?.id ?? null,
        summary: `Looted ruin at ${coordinate} — found ${goldFound}g${lootedItem ? ` and ${lootedItem.name}` : ''}`,
        detail: { goldFound, itemName: lootedItem?.name ?? null }
    });
    actionLog('lootTomb:ruin-hoard', { coordinate, goldFound, itemFound: lootedItem?.name || null });
    const itemPart = lootedItem ? ` and ${lootedItem.name}` : '';
    return { success: true, message: `You looted the ruin and found ${goldFound}g${itemPart}.` };
}

function regicide(world, coordinate, targetId, weaponTier, playerState) {
    actionLog('regicide:start', { coordinate, targetId, weaponTier });
    playerState = ensurePlayerState(playerState);

    const targetNPC = findEntity(world, targetId, ['identity', 'status', 'currentRole']);
    const town = world.with('identity', 'history').where(e => e.identity.type === 'Town' || e.identity.type === 'District').first;
    const currentYear = getCurrentYear(coordinate);

    if (!targetNPC || targetNPC.status === 'Dead') {
        return { success: false, message: 'Target not found or already dead.' };
    }
    if (!RULER_TITLES.includes(targetNPC.currentRole)) {
        return { success: false, message: 'Regicide requires targeting the ruling leader.' };
    }

    const { success } = PlayerMechanics.resolveRegicide(playerState, weaponTier || 0);

    if (success) {
        targetNPC.status = 'Dead';
        saveDelta(coordinate, targetNPC.identity.id, 'status', 'Dead');
        appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Slain by the Traveler in an act of regicide.`, 'regicide'));
        triggerMourningForLovedOnes(world, coordinate, targetNPC, currentYear);

        if (town) {
            town.currentMayor = 'The Player';
            saveDelta(coordinate, town.identity.name, 'currentMayor', 'The Player');
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The ruler was slain and the Traveler seized the throne.`, 'regicide'));
        }

        if (!playerState.titles) playerState.titles = {};
        playerState.titles[town ? town.identity.name : coordinate] = 'King';

        const leveled = awardXP(playerState, 5000);
        let msg = `⚔️ Regicide! You have slain ${targetNPC.identity.name} and seized the throne!`;
        if (leveled) msg += ` (+5000 XP) YOU LEVELED UP TO LEVEL ${playerState.level}!`;
        const regicideSettlementName = town?.identity?.name ?? coordinate;
        appendJournalEntry({
            year: currentYear,
            action: 'regicide',
            coordinate,
            npcId: targetNPC.identity.id,
            summary: `Slew ${targetNPC.identity.name} (${targetNPC.currentRole ?? 'Mayor'}) in ${regicideSettlementName}`,
            detail: { settlementName: regicideSettlementName, npcName: targetNPC.identity.name, xpGained: 5000 }
        });
        return { success: true, message: msg };
    } else {
        applyReputationWithPropagation(playerState, coordinate, -50);
        return { success: false, message: `Regicide attempt failed. You were repelled and your reputation is in tatters.` };
    }
}

/**
 * Executes a buy or sell transaction between the player and a Merchant NPC.
 * Market Depletion fires when > 80% of the primaryExport stock is purchased.
 * Merchant Ascendancy fires when selling a Relic pushes the Merchant's personalWealth > 15000.
 */
function executeTrade(world, coordinate, npcId, transaction, playerState) {
    actionLog('executeTrade:start', { coordinate, npcId, transaction });
    playerState = ensurePlayerState(playerState);

    const npc = findEntity(world, npcId, ['identity', 'currentRole']);
    if (!npc) return { success: false, message: 'NPC not found.', status: 404 };
    if (npc.currentRole !== 'Merchant') return { success: false, message: 'NPC is not a Merchant.', status: 400 };

    const town = world.with('identity').where(e => e.identity.type === 'Town' || e.identity.type === 'District').first;
    const { type, itemId, quantity } = transaction;
    let event = null;
    let tradeJournalEntry = null;

    if (type === 'buy') {
        const slot = (npc.merchantInventory || []).find(i => i.itemId === itemId);
        if (!slot || slot.quantity < quantity) {
            return { success: false, message: 'Item unavailable or insufficient stock.', status: 400 };
        }

        // stub hook: multiply by town.mythos?.fearModifier ?? 1.0 once item 14 lands
        const fearModifier = town?.mythos?.fearModifier || 1.0;
        const totalCost = Math.floor(slot.price * quantity * fearModifier);
        if ((playerState.gold || 0) < totalCost) {
            return { success: false, message: 'Insufficient gold.', status: 400 };
        }

        playerState.gold = (playerState.gold || 0) - totalCost;
        slot.quantity -= quantity;

        playerState.inventory = playerState.inventory || [];
        for (let i = 0; i < quantity; i++) {
            const { itemId: slotItemId, ...rest } = slot;
            playerState.inventory.push({ ...rest, id: slotItemId, quantity: 1 });
        }

        // Market Depletion check — track against primaryExport slots before this purchase
        if (town && town.primaryExport) {
            const exportSlots = npc.merchantInventory.filter(s => s.name === town.primaryExport);
            const remaining = exportSlots.reduce((sum, s) => sum + s.quantity, 0);
            const total = exportSlots.reduce((sum, s) => sum + s.quantity + (s.itemId === itemId ? quantity : 0), 0);
            if (total > 0 && remaining / total <= 0.20) {
                saveDelta(coordinate, town.identity.id, 'shortage', 'true');
                event = {
                    type: 'MARKET_DEPLETION',
                    description: `The ${town.primaryExport} market has been depleted. Expect shortages during the next time-skip.`
                };
                actionLog('executeTrade:market-depletion', { coordinate, primaryExport: town.primaryExport });
            }
        }

        const tradeSettlementName = town?.identity?.name ?? coordinate;
        tradeJournalEntry = {
            year: getCurrentYear(coordinate),
            action: 'trade',
            coordinate,
            npcId: npc.identity.id,
            itemId: slot.itemId,
            summary: `Bought ${quantity}× ${slot.name} from ${npc.identity.name} in ${tradeSettlementName}`,
            detail: { settlementName: tradeSettlementName, npcName: npc.identity.name, qty: quantity, price: totalCost }
        };

    } else if (type === 'sell') {
        const playerSlot = (playerState.inventory || []).find(i => (i.itemId || i.id) === itemId);
        if (!playerSlot) return { success: false, message: 'Item not in player inventory.', status: 400 };

        // stub hook: divide by fearModifier once item 14 lands
        const fearModifier = town?.mythos?.fearModifier || 1.0;
        const salePrice = Math.floor((playerSlot.price || playerSlot.value || 100) * 0.8 / fearModifier);
        playerState.gold = (playerState.gold || 0) + salePrice;
        playerState.inventory = (playerState.inventory || []).filter(i => (i.itemId || i.id) !== itemId);

        npc.merchantInventory = npc.merchantInventory || [];
        const existingSlot = npc.merchantInventory.find(i => i.itemId === (playerSlot.itemId || playerSlot.id));
        if (existingSlot) {
            existingSlot.quantity += 1;
        } else {
            npc.merchantInventory.push({
                itemId: playerSlot.itemId || playerSlot.id,
                name: playerSlot.name,
                type: playerSlot.type,
                tier: playerSlot.tier ?? 1,
                quantity: 1,
                price: salePrice
            });
        }

        // Merchant Ascendancy — selling a Relic
        if (playerSlot.prefix === 'Relic' && town) {
            npc.personalWealth = (npc.personalWealth || 0) + (playerSlot.value || 0) * 5;
            if (npc.personalWealth > 15000) {
                saveDelta(coordinate, town.identity.id, 'plutocracy_candidate', npc.identity.id);
                event = {
                    type: 'MERCHANT_ASCENDANCY',
                    description: `${npc.identity.name}'s wealth has grown immense. Their influence may reshape this settlement's governance.`
                };
                actionLog('executeTrade:merchant-ascendancy', { coordinate, npcId: npc.identity.id, wealth: npc.personalWealth });
            }
        }

        const sellSettlementName = town?.identity?.name ?? coordinate;
        tradeJournalEntry = {
            year: getCurrentYear(coordinate),
            action: 'trade',
            coordinate,
            npcId: npc.identity.id,
            itemId: playerSlot.itemId || playerSlot.id || null,
            summary: `Sold ${playerSlot.name ?? 'item'} to ${npc.identity.name} in ${sellSettlementName} for ${salePrice}g`,
            detail: { settlementName: sellSettlementName, npcName: npc.identity.name, price: salePrice }
        };

    } else {
        return { success: false, message: 'Invalid transaction type. Must be "buy" or "sell".', status: 400 };
    }

    // Persist updated merchant state
    saveDelta(coordinate, npc.identity.id, 'merchantInventory', JSON.stringify(npc.merchantInventory || []));
    saveDelta(coordinate, npc.identity.id, 'personalWealth', String(npc.personalWealth || 0));

    if (tradeJournalEntry) appendJournalEntry(tradeJournalEntry);
    incrementTemporalExposure(world, coordinate, 5);

    actionLog('executeTrade:complete', { coordinate, npcId, type, event: event?.type || null });
    return {
        success: true,
        npcInventory: npc.merchantInventory || [],
        event,
        message: type === 'buy' ? `Purchased from ${npc.identity.name}.` : `Sold to ${npc.identity.name}.`
    };
}

module.exports = { stealItem, assassinate, claimThrone, turnInQuest, taxTown, decree, banish, abdicate, lootTomb, regicide, executeTrade, RULER_TITLES };