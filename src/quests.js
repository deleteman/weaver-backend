// src/quests.js

const { log } = require('./logger');
const { MEMORY_STATES } = require('./history');

const QUEST_TYPES = Object.freeze({
    MYSTERY_HEIST: "Mystery Heist",
    BOUNTY:        "Bounty",
    FETCH:         "Fetch",
});

function generateQuests(world, targetX, targetY, rng) {
    log('generateQuests:start', { targetX, targetY });
    const npcs = world.with('identity', 'status', 'knowledge', 'inventory', 'quests')
                      .where(e => e.location.x === targetX && e.location.y === targetY && e.status === "Alive");

    const npcArray = Array.from(npcs);

    for (const questGiver of npcArray) {
        questGiver.quests.offeredQuests = [];

        for (const [enemyId, feeling] of Object.entries(questGiver.knowledge.memories)) {
            if (feeling === MEMORY_STATES.HATES) {
                const enemy = world.with('identity', 'inventory', 'status').where(e => e.identity.id === enemyId).first;

                if (enemy && enemy.status === "Alive") {
                    if (enemy.inventory.items.length > 0 && rng() > 0.5) {
                        const targetItem = enemy.inventory.items[0];
                        questGiver.quests.offeredQuests.push({
                            type: QUEST_TYPES.MYSTERY_HEIST,
                            title: `Find ${targetItem.name}`,
                            description: `A vile thief took ${targetItem.name} from my family. Find who has it and bring it to me.`,
                            target: enemy.identity.id,
                            itemId: targetItem.id
                        });
                    } else {
                        questGiver.quests.offeredQuests.push({
                            type: QUEST_TYPES.BOUNTY,
                            title: `Eliminate ${enemy.identity.name}`,
                            description: `My blood feud with ${enemy.identity.name} must end. Deal with them.`,
                            target: enemy.identity.id
                        });
                    }
                }
            }
        }

        if (questGiver.inventory.items.length === 0 && questGiver.currentRole === "Scholar") {
            questGiver.quests.offeredQuests.push({
                type: QUEST_TYPES.FETCH,
                title: `Find any Tome`,
                description: `My research has stalled. I need any kind of Tome. I don't care who you have to steal it from to get it.`,
                target: questGiver.identity.id,
                itemType: "Tome"
            });
        }
    }
    log('generateQuests:end', { targetX, targetY, generated: Array.from(npcs).length });
}

module.exports = { generateQuests, QUEST_TYPES };