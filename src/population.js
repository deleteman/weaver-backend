// src/population.js
const { Identity, Location, Inventory, Knowledge, Quests } = require('./components');
const { generateText } = require('./grammar');
const { assignRoleByBiome } = require('./biomes');
const { log } = require('./logger');
const { makeEvent } = require('./event-utils');
const crypto = require('crypto');

const SEX_MALE_THRESHOLD = 0.48;
const SEX_FEMALE_THRESHOLD = 0.96;

/**
 * Check if population needs replenishment (decade check)
 * If population < 5, trigger refugee crisis or baby boom
 */
function replenishPopulationIfNeeded(world, x, y, rng, townEntity, biome, currentYear) {
    const npcs = Array.from(world.with('identity', 'status')
        .where(e => e.location.x === x && e.location.y === y && e.identity.type === "NPC" && e.status === "Alive"));
    
    const tier = townEntity?.political?.tier || 1;
    const tierMinimum = Math.max(5, tier * 5);
    if (npcs.length < tierMinimum) {
        const spawnCount = Math.floor(rng() * 5) + Math.max(3, tier * 2);
        const currentCoordinate = `world_X${x}_Y${y}`;
        const spawnedNpcs = [];

        for (let i = 0; i < spawnCount; i++) {
            const name = generateText(rng, "#npcName#");
            const newId = crypto.createHash('md5').update(`${currentCoordinate}_${name}_replenish_${currentYear}`).digest('hex').substring(0, 12);
            const role = assignRoleByBiome(rng, biome);

            const initialAge = Math.floor(rng() * 15) + 16;
            const sexRoll = rng();
            const sex = sexRoll < SEX_MALE_THRESHOLD ? 'male' : sexRoll < SEX_FEMALE_THRESHOLD ? 'female' : 'other';
            const newNpc = world.add({
                identity: Identity(name, "NPC", newId),
                location: Location(x, y, townEntity),
                description: generateText(rng, "#npcDesc#"),
                status: "Alive",
                currentRole: role,
                biome,
                age: initialAge,
                birthYear: currentYear - initialAge,
                sex,
                history: { events: [makeEvent(`[Year ${currentYear}] Arrived as a refugee seeking shelter.`, 'migration')] },
                knowledge: Knowledge(),
                inventory: Inventory(),
                quests: Quests()
            });

            spawnedNpcs.push(newNpc);
        }

        log('population-replenishment', { coordinate: `${x},${y}`, spawnedCount: spawnCount, tier, tierMinimum, reason: npcs.length < 3 ? 'refugee-crisis' : 'baby-boom' });
        return spawnedNpcs;
    }
    return [];
}

module.exports = { replenishPopulationIfNeeded };
