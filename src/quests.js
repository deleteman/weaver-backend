// src/quests.js

const { log } = require('./logger');

function generateQuests(world, targetX, targetY, rng) {
    log('generateQuests:start', { targetX, targetY });
    const npcs = world.with('identity', 'status', 'knowledge', 'inventory', 'quests')
                      .where(e => e.location.x === targetX && e.location.y === targetY && e.status === "Alive");

    const npcArray = Array.from(npcs);

    for (const questGiver of npcArray) {
        questGiver.quests.offeredQuests = [];

        for (const [enemyId, feeling] of Object.entries(questGiver.knowledge.memories)) {
            if (feeling === "hates") {
                const enemy = world.with('identity', 'inventory', 'status').where(e => e.identity.id === enemyId).first;

                if (enemy && enemy.status === "Alive") {
                    if (enemy.inventory.items.length > 0 && rng() > 0.5) {
                        const targetItem = enemy.inventory.items[0]; 
                        questGiver.quests.offeredQuests.push({
                            type: "Mystery Heist",
                            title: `Find ${targetItem.name}`,
                            description: `A vile thief took ${targetItem.name} from my family. Find who has it and bring it to me.`,
                            target: enemy.identity.id, 
                            itemId: targetItem.id // FIX: Expose the UUID of the item!
                        });
                    } else {
                        questGiver.quests.offeredQuests.push({
                            type: "Bounty",
                            title: `Eliminate ${enemy.identity.name}`, // We can still show the name to the player!
                            description: `My blood feud with ${enemy.identity.name} must end. Deal with them.`,
                            target: enemy.identity.id 
                        });
                    }
                }
            }
        }

      // FIX: Update Fetch quests to ask for a Type instead of a specific item
        if (questGiver.inventory.items.length === 0 && questGiver.currentRole === "Scholar") {
            questGiver.quests.offeredQuests.push({
                type: "Fetch",
                title: `Find any Tome`,
                description: `My research has stalled. I need any kind of Tome. I don't care who you have to steal it from to get it.`,
                target: questGiver.identity.id,
                itemType: "Tome"
            });
        }
    }
    log('generateQuests:end', { targetX, targetY, generated: Array.from(npcs).length });
}

module.exports = { generateQuests };