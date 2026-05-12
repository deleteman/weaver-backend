// src/actions.js
const { saveDelta, getDeltas, getGlobalYear, getSuzerainForCoordinate } = require('./db');
const { log } = require('./logger');
const { makeEvent } = require('./event-utils');
const seedrandom = require('seedrandom');
const { ArtifactEffects } = require('./artifact-effects');
const { PlayerMechanics } = require('./player-mechanics');

const LOG_PREFIX = '[ACTION]';

function actionLog(event, details = {}) {
    log(`${LOG_PREFIX} ${event}`, details);
}

function ensurePlayerState(playerState) {
    if (!playerState) playerState = {};
    if (!playerState.stats) playerState.stats = {};
    if (!playerState.titles) playerState.titles = {};
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
    if (targetNPC.currentRole === "Mayor") successChance -= 0.40;

    // Intentional non-deterministic player-experience roll — not a generation path
    if (Math.random() < successChance) {
        targetNPC.status = "Dead";
        saveDelta(coordinate, targetNPC.identity.id, "status", "Dead");
        appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Assassinated by a mysterious traveler.`, 'assassination'));
        
        let msg = `🗡️ You assassinated ${targetNPC.identity.name}!`;
        const leveled = awardXP(playerState, 75);

        if (targetNPC.currentRole === "Mayor" && town.identity.type === "District") {
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] A district administrator was slain by a traveler, but the parent city's rule endures.`, 'assassination'));
            msg += ` The district is briefly leaderless, but it remains under its parent city's authority.`;
        } else if (targetNPC.currentRole === "Mayor" && playerState.reputation >= 20) {
            town.currentMayor = "The Player";
            saveDelta(coordinate, town.identity.name, "currentMayor", "The Player");
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The Mayor was slain, and the respected traveler seized control of the town.`, 'chaos'));
            msg += ` The town respects your ruthless power. YOU are the new Mayor!`;
            applyReputationWithPropagation(playerState, coordinate, 50);

            if (!playerState.titles) playerState.titles = {};
            playerState.titles[town.identity.name] = "Mayor";

        } else if (targetNPC.currentRole === "Mayor") {
            town.currentMayor = "None";
            saveDelta(coordinate, town.identity.name, "currentMayor", "None");
            appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The Mayor was murdered, throwing the town into chaos.`, 'chaos'));
            msg += ` The town is in chaos without a Mayor. You are a wanted criminal.`;
            applyReputationWithPropagation(playerState, coordinate, -40);
        }

        if (leveled) msg += ` (+75 XP) YOU LEVELED UP TO LEVEL ${playerState.level}!`;
        return { success: true, message: msg };
    } else {
        applyReputationWithPropagation(playerState, coordinate, -30, true);
        return { success: false, message: `Attempt failed! You were spotted trying to kill ${targetNPC.identity.name}. Your reputation tanked.` };
    }
}

function turnInQuest(world, coordinate, targetId, itemId, playerState) {
    actionLog('turnInQuest:start', { coordinate, targetId, itemId });
    playerState = ensurePlayerState(playerState);

    // FIX 1: Detect router argument shifting for Bounties!
    // If playerState is undefined, it means itemId contains the playerState object.
    if (!playerState || !playerState.inventory) {
        playerState = itemId;
        itemId = null;
    }

    const questGiver = findEntity(world, targetId, ['identity', 'inventory', 'status', 'currentRole', 'knowledge']);
    const currentYear = getGlobalYear(); // Ensure you use getGlobalYear() here!

    if (!questGiver || questGiver.status === "Dead") {
        actionLog('turnInQuest:missing-questgiver', { targetId });
        return { success: false, message: `Quest giver not found or dead.` };
    }

    if (itemId) {
        const playerItemIndex = playerState.inventory.findIndex(i => i.id === itemId);

        if (playerItemIndex > -1) {
            const donatedItem = playerState.inventory[playerItemIndex];
            
            const fetchQuest = questGiver.quests.offeredQuests.find(q => q.type === "Fetch");
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
                ArtifactEffects.applyRelicEffect(world, cx, cy, donatedItem, questGiver, npcs, artifactRng);
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
            if (feeling === "hates") {
                const enemy = world.with('identity', 'status').where(e => e.identity.id === enemyId).first;
                if (enemy && enemy.status === "Dead") {
                    avengedTargetName = enemy.identity.name;
                    avengedTargetId = enemy.identity.id;
                    break;
                }
            }
        }

        if (avengedTargetName) {
            questGiver.knowledge.memories[avengedTargetId] = "avenged"; 
            saveDelta(coordinate, questGiver.identity.id, `memory_${avengedTargetId}`, "avenged");
            appendHistory(coordinate, questGiver, makeEvent(`[Year ${currentYear}] Was finally avenged when the traveler eliminated ${avengedTargetName}.`, 'assassination'));

            maybeAwardTitle(playerState, 'bountiesCompleted', 3, 'Master Assassin');
            applyReputationWithPropagation(playerState, coordinate, 30);
            const leveled = awardXP(playerState, 100);
            
            let msg = `🩸 You reported the death of ${avengedTargetName} to ${questGiver.identity.name}. (+100 XP)`;
            if (playerState.titles["Global"] === "Master Assassin") msg += ` Your lethal efficiency has earned you the title of Master Assassin!`;
            if (leveled) msg += ` YOU LEVELED UP TO LEVEL ${playerState.level}!`;

            return { success: true, message: msg };
        }
        return { success: false, message: `You have no completed bounties to report to this person.` };
    }
}

// --- MAYOR ACTIONS ---

function claimThrone(world, coordinate, playerState) {
    actionLog('claimThrone:start', { coordinate });
    playerState = ensurePlayerState(playerState);

    const activeMayor = world.with('currentRole', 'status').where(e => e.currentRole === "Mayor" && e.status === "Alive").first;
    const town = world.with('identity').where(e => e.identity.type === "Town" || e.identity.type === "District").first;
    const currentYear = getCurrentYear(coordinate);

    if (town.identity.type === "District") {
        actionLog('claimThrone:district-blocked');
        return { success: false, message: `This is a district governed by its parent city. Travel there to take political action.` };
    }

    if (activeMayor) {
        actionLog('claimThrone:occupied');
        return { success: false, message: `The throne is currently occupied. You must eliminate them or wait for them to step down.` };
    }
    if (playerState.reputation < 20) {
        actionLog('claimThrone:low-reputation', { reputation: playerState.reputation });
        return { success: false, message: `You are not respected enough to claim the throne.` };
    }

    saveDelta(coordinate, town.identity.name, "currentMayor", "The Player");
    appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] With the seat empty, the traveler stepped up and claimed the title of Mayor.`, 'power_seizure'));

    playerState.titles[town.identity.name] = "Mayor";
    applyReputationWithPropagation(playerState, coordinate, 30);

    actionLog('claimThrone:success', { town: town.identity.name });
    return { success: true, message: `👑 You have stepped up to lead! You are now the Mayor of ${town.identity.name}!` };
}

function isMayor(world, playerState) {
    const town = world.with('identity').where(e => e.identity.type === "Town" || e.identity.type === "District").first;
    if (town.identity.type === "District") return false;
    return (playerState.titles && playerState.titles[town.identity.name] === "Mayor");
}

function taxTown(world, coordinate, playerState) {
    actionLog('taxTown:start', { coordinate });
    playerState = ensurePlayerState(playerState);

    if (!isMayor(world, playerState)) {
        actionLog('taxTown:unauthorized');
        return { success: false, message: "Only the Mayor can levy taxes." };
    }

    const citizens = Array.from(world.with('identity', 'inventory', 'status', 'knowledge').where(e => e.identity.type === "NPC" && e.status === "Alive"));
    let itemsStolen = 0;

    for (const citizen of citizens) {
        if (citizen.inventory.items.length > 0) {
            const confiscated = citizen.inventory.items.splice(0, 1)[0]; 
            playerState.inventory.push(confiscated);
            itemsStolen++;
            
            citizen.knowledge.memories["The Player"] = "hates";
            persistInventory(coordinate, citizen);
            saveDelta(coordinate, citizen.identity.id, "memory_The Player", "hates");
            actionLog('taxTown:confiscated', { citizenId: citizen.identity.id, confiscatedId: confiscated.id });
        }
    }

    applyReputationWithPropagation(playerState, coordinate, -(itemsStolen * 10));
    actionLog('taxTown:complete', { itemsStolen, reputation: playerState.reputation });
    return { success: true, message: `💰 You abused your power and taxed ${itemsStolen} items from the town. The people despise you.` };
}

function decree(world, coordinate, targetId, newRole, playerState) {
    actionLog('decree:start', { coordinate, targetId, newRole });
    if (!isMayor(world, playerState)) {
        actionLog('decree:unauthorized');
        return { success: false, message: "Only the Mayor can issue decrees." };
    }
    
    const targetNPC = findEntity(world, targetId, ['identity', 'status']);
    const currentYear = getCurrentYear(coordinate);

    if (!targetNPC || targetNPC.status === "Dead") {
        actionLog('decree:target-missing', { targetId });
        return { success: false, message: "Target not found." };
    }

    targetNPC.currentRole = newRole;
    saveDelta(coordinate, targetNPC.identity.id, "currentRole", newRole);
    appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Was officially decreed a ${newRole} by the Mayor.`, 'career_shift'));
    actionLog('decree:success', { targetId, newRole });

    return { success: true, message: `📜 You have decreed ${targetNPC.identity.name} to be a ${newRole}.` };
}

function banish(world, coordinate, targetId, playerState) {
    actionLog('banish:start', { coordinate, targetId });
    if (!isMayor(world, playerState)) {
        actionLog('banish:unauthorized');
        return { success: false, message: "Only the Mayor can banish citizens." };
    }
    
    const targetNPC = findEntity(world, targetId, ['identity', 'status', 'knowledge', 'inventory', 'description', 'age']);
    const currentYear = getCurrentYear(coordinate);

    if (!targetNPC || targetNPC.status === "Dead") {
        actionLog('banish:target-missing', { targetId });
        return { success: false, message: "Target not found." };
    }

    targetNPC.status = "Exiled";
    saveDelta(coordinate, targetNPC.identity.id, "status", "Exiled");
    appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Stripped of titles and exiled from the town by the Mayor.`, 'migration'));
    
    const banishRng = seedrandom(`banish_${coordinate}_${getGlobalYear()}`);
    const destX = Math.floor(banishRng() * 100);
    const destY = Math.floor(banishRng() * 100);
    const destCoordinate = `world_X${destX}_Y${destY}`;

    targetNPC.knowledge.memories["The Player"] = "hates";
    const immigrantData = {
        name: targetNPC.identity.name,
        description: targetNPC.description,
        age: targetNPC.age,
        inventory: targetNPC.inventory.items,
        memories: targetNPC.knowledge.memories
    };

    saveDelta(destCoordinate, targetNPC.identity.id, "immigrant_data", JSON.stringify(immigrantData));
    applyReputationWithPropagation(playerState, coordinate, -15);
    actionLog('banish:success', { targetId, destination: destCoordinate });

    return { success: true, message: `🛑 You banished ${targetNPC.identity.name}. They were last seen wandering towards coordinates X:${destX}, Y:${destY} swearing revenge against you.` };
}

function abdicate(world, coordinate, playerState) {
    actionLog('abdicate:start', { coordinate });
    const town = world.with('identity').where(e => e.identity.type === "Town" || e.identity.type === "District").first;
    const currentYear = getCurrentYear(coordinate);
    if (!isMayor(world, playerState)) {
        actionLog('abdicate:unauthorized');
        return { success: false, message: "You are not the Mayor." };
    }

    const citizens = Array.from(world.with('identity', 'status', 'knowledge').where(e => e.identity.type === "NPC" && e.status === "Alive"));
    const abdicateRng = seedrandom(`abdicate_${coordinate}_${getGlobalYear()}`);
    let nextMayor = citizens[Math.floor(abdicateRng() * citizens.length)];

    delete playerState.titles[town.identity.name];
    
    if (nextMayor) {
        nextMayor.currentRole = "Mayor";
        saveDelta(coordinate, nextMayor.identity.id, "currentRole", "Mayor");
        saveDelta(coordinate, town.identity.name, "currentMayor", nextMayor.identity.name);
        appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The traveler abdicated, and the people elected ${nextMayor.identity.name} as the new Mayor.`, 'power_seizure'));
        
        applyReputationWithPropagation(playerState, coordinate, 25);
        actionLog('abdicate:success', { nextMayorId: nextMayor.identity.id });
        return { success: true, message: `🕊️ You peacefully stepped down. ${nextMayor.identity.name} is the new Mayor.` };
    } else {
        saveDelta(coordinate, town.identity.name, "currentMayor", "NPC");
        appendHistory(coordinate, town, makeEvent(`[Year ${currentYear}] The traveler abdicated, leaving the town leaderless.`, 'power_seizure'));
        actionLog('abdicate:leaderless');
        return { success: true, message: `🕊️ You stepped down. With no one to replace you, the town is leaderless.` };
    }
}

// FIX: New Tomb Looting Action!
function lootTomb(world, coordinate, targetId, playerState) {
    actionLog('lootTomb:start', { coordinate, targetId });
    playerState = ensurePlayerState(playerState);

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
    actionLog('lootTomb:success', { targetId, lootedCount: lootedItems.length });
    return { success: true, message: `🦇 You looted the tomb of ${targetNPC.identity.name} and found: ${lootedItems.map(i => i.name).join(", ")}. (-5 Reputation)` };
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
    if (targetNPC.currentRole !== 'Mayor') {
        return { success: false, message: 'Regicide requires targeting the ruling Mayor.' };
    }

    const { success } = PlayerMechanics.resolveRegicide(playerState, weaponTier || 0);

    if (success) {
        targetNPC.status = 'Dead';
        saveDelta(coordinate, targetNPC.identity.id, 'status', 'Dead');
        appendHistory(coordinate, targetNPC, makeEvent(`[Year ${currentYear}] Slain by the Traveler in an act of regicide.`, 'regicide'));

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
        return { success: true, message: msg };
    } else {
        applyReputationWithPropagation(playerState, coordinate, -50);
        return { success: false, message: `Regicide attempt failed. You were repelled and your reputation is in tatters.` };
    }
}

module.exports = { stealItem, assassinate, claimThrone, turnInQuest, taxTown, decree, banish, abdicate, lootTomb, regicide };