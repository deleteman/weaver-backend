// src/actions.js
const { saveDelta, getDeltas, getGlobalYear } = require('./db');

const LOG_PREFIX = '[ACTION]';

function actionLog(event, details = {}) {
    console.log(`${LOG_PREFIX} ${event}`, details);
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
    if (!Array.isArray(entity.history)) {
        entity.history = entity.history ? [entity.history] : [];
    }
    entity.history.push(event);
    saveDelta(coordinate, entity.identity.id, 'history_append', event);
    actionLog('appendHistory', { coordinate, entityId: entity.identity.id, event });
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

    if (Math.random() < failChance) {
        targetNPC.inventory.items.splice(itemIndex, 0, targetItem);
        persistInventory(coordinate, targetNPC);

        playerState.reputation -= 10;
        let msg = `You were caught trying to steal ${targetItem.name}! Your reputation fell.`;

        if (playerState.inventory.length > 0) {
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

    if (Math.random() < successChance) {
        targetNPC.status = "Dead";
        saveDelta(coordinate, targetNPC.identity.id, "status", "Dead");
        appendHistory(coordinate, targetNPC, `[Year ${currentYear}] Assassinated by a mysterious traveler.`);
        
        let msg = `🗡️ You assassinated ${targetNPC.identity.name}!`;
        const leveled = awardXP(playerState, 75);

        if (targetNPC.currentRole === "Mayor" && town.identity.type === "District") {
            appendHistory(coordinate, town, `[Year ${currentYear}] A district administrator was slain by a traveler, but the parent city's rule endures.`);
            msg += ` The district is briefly leaderless, but it remains under its parent city's authority.`;
        } else if (targetNPC.currentRole === "Mayor" && playerState.reputation >= 20) {
            town.currentMayor = "The Player";
            saveDelta(coordinate, town.identity.name, "currentMayor", "The Player");
            saveDelta(coordinate, town.identity.name, "history_append", `[Year ${currentYear}] The Mayor was slain, and the respected traveler seized control of the town.`);
            msg += ` The town respects your ruthless power. YOU are the new Mayor!`;
            playerState.reputation += 50;

            if (!playerState.titles) playerState.titles = {};
            playerState.titles[town.identity.name] = "Mayor";

        } else if (targetNPC.currentRole === "Mayor") {
            town.currentMayor = "None";
            saveDelta(coordinate, town.identity.name, "currentMayor", "None");
            saveDelta(coordinate, town.identity.name, "history_append", `[Year ${currentYear}] The Mayor was murdered, throwing the town into chaos.`);
            msg += ` The town is in chaos without a Mayor. You are a wanted criminal.`;
            playerState.reputation -= 40;
        }

        if (leveled) msg += ` (+75 XP) YOU LEVELED UP TO LEVEL ${playerState.level}!`;
        return { success: true, message: msg };
    } else {
        playerState.reputation -= 30;
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

            let butterflyEvent = `[Year ${currentYear}] Received ${donatedItem.name} from a traveler.`;
            
            if (donatedItem.type === "Weapon" && questGiver.currentRole !== "Mayor") {
                questGiver.currentRole = "Hero";
                butterflyEvent = `[Year ${currentYear}] Was handed ${donatedItem.name} by a traveler and rose up as the town's new Hero.`;
                saveDelta(coordinate, questGiver.identity.id, "currentRole", "Hero");
            } else if (donatedItem.type === "Jewelry") {
                questGiver.currentRole = "Cultist";
                butterflyEvent = `[Year ${currentYear}] Put on ${donatedItem.name} delivered by a traveler and lost their mind to the abyss.`;
                saveDelta(coordinate, questGiver.identity.id, "currentRole", "Cultist");
            }

            appendHistory(coordinate, questGiver, butterflyEvent);
            persistInventory(coordinate, questGiver);

            playerState.reputation += 20;
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
            appendHistory(coordinate, questGiver, `[Year ${currentYear}] Was finally avenged when the traveler eliminated ${avengedTargetName}.`);

            maybeAwardTitle(playerState, 'bountiesCompleted', 3, 'Master Assassin');
            playerState.reputation += 30;
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
    appendHistory(coordinate, town, `[Year ${currentYear}] With the seat empty, the traveler stepped up and claimed the title of Mayor.`);

    playerState.titles[town.identity.name] = "Mayor";
    playerState.reputation += 30;

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

    playerState.reputation -= (itemsStolen * 10);
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
    appendHistory(coordinate, targetNPC, `[Year ${currentYear}] Was officially decreed a ${newRole} by the Mayor.`);
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
    appendHistory(coordinate, targetNPC, `[Year ${currentYear}] Stripped of titles and exiled from the town by the Mayor.`);
    
    const destX = Math.floor(Math.random() * 100);
    const destY = Math.floor(Math.random() * 100);
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
    playerState.reputation -= 15;
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
    let nextMayor = citizens[Math.floor(Math.random() * citizens.length)]; 

    delete playerState.titles[town.identity.name];
    
    if (nextMayor) {
        nextMayor.currentRole = "Mayor";
        saveDelta(coordinate, nextMayor.identity.id, "currentRole", "Mayor");
        saveDelta(coordinate, town.identity.name, "currentMayor", nextMayor.identity.name);
        appendHistory(coordinate, town, `[Year ${currentYear}] The traveler abdicated, and the people elected ${nextMayor.identity.name} as the new Mayor.`);
        
        playerState.reputation += 25;
        actionLog('abdicate:success', { nextMayorId: nextMayor.identity.id });
        return { success: true, message: `🕊️ You peacefully stepped down. ${nextMayor.identity.name} is the new Mayor.` };
    } else {
        saveDelta(coordinate, town.identity.name, "currentMayor", "NPC");
        appendHistory(coordinate, town, `[Year ${currentYear}] The traveler abdicated, leaving the town leaderless.`);
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
    
    playerState.reputation -= 5;
    actionLog('lootTomb:success', { targetId, lootedCount: lootedItems.length });
    return { success: true, message: `🦇 You looted the tomb of ${targetNPC.identity.name} and found: ${lootedItems.map(i => i.name).join(", ")}. (-5 Reputation)` };
}

module.exports = { stealItem, assassinate, claimThrone, turnInQuest, taxTown, decree, banish, abdicate, lootTomb };