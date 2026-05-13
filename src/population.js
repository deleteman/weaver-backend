// src/population.js
const { Identity, Location, Inventory, Knowledge, Quests } = require('./components');
const { generateText } = require('./grammar');
const { assignRoleByBiome } = require('./biomes');
const { log } = require('./logger');
const crypto = require('crypto');

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
        
        for (let i = 0; i < spawnCount; i++) {
            const name = generateText(rng, "#npcName#");
            const newId = crypto.createHash('md5').update(`${currentCoordinate}_${name}_replenish_${currentYear}`).digest('hex').substring(0, 12);
            const role = assignRoleByBiome(rng, biome);
            
            const newNpc = world.add({
                identity: Identity(name, "NPC", newId),
                location: Location(x, y, townEntity),
                description: generateText(rng, "#npcDesc#"),
                status: "Alive",
                currentRole: role,
                biome,
                age: Math.floor(rng() * 15) + 16,
                history: { events: [`[Year ${currentYear}] Arrived as a refugee seeking shelter.`] },
                knowledge: Knowledge(),
                inventory: Inventory(),
                quests: Quests()
            });
            
            npcs.push(newNpc);
        }
        
        log('population-replenishment', { coordinate: `${x},${y}`, spawnedCount: spawnCount, tier, tierMinimum, reason: npcs.length < 3 ? 'refugee-crisis' : 'baby-boom' });
    }
}

module.exports = { replenishPopulationIfNeeded };
