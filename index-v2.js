// index.js
const { World } = require('miniplex');
const seedrandom = require('seedrandom');
const { Identity, Location } = require('./src/components');
const { generateText } = require('./src/grammar');

const world = new World();

// The player's coordinates
const coordinateX = 10;
const coordinateY = 15;
const currentCoordinate = `world_X${coordinateX}_Y${coordinateY}`;

// Initialize the RNG for this specific coordinate
const rng = seedrandom(currentCoordinate);

console.log(`\n=== Generating Phase 2 at Seed: ${currentCoordinate} ===\n`);

// 1. Generate the Town
const townName = generateText(rng, "#townName#");
const townEntity = world.add({
    identity: Identity(townName, "Town"),
    location: Location(coordinateX, coordinateY)
});

console.log(`🏰 Discovered Town: ${townName}`);
console.log("-----------------------------------------");

// 2. Generate 5 NPCs for this Town
const npcNames = ["Urist", "Bofur", "Thrain", "Elara", "Kael", "Lyra", "Grom", "Sylas"];

for (let i = 0; i < 5; i++) {
    // Pick a name deterministically
    const randomName = npcNames[Math.floor(rng() * npcNames.length)];
    
    // Generate a description deterministically
    const desc = generateText(rng, "#npcDesc#");
    
    // Add to the ECS
    world.add({
        identity: Identity(randomName, "NPC"),
        // Notice we attach the townEntity object as the parent ID
        location: Location(coordinateX, coordinateY, townEntity), 
        description: desc 
    });
}

// 3. Query the ECS for NPCs
// We query for anything that has an identity and a location, then filter for NPCs
const npcs = world.with('identity', 'location').where(e => e.identity.type === "NPC");

for (const npc of npcs) {
    console.log(`👤 ${npc.identity.name}`);
    console.log(`   Description: ${npc.description}`);
}

console.log("\n(Run this again to verify it remains 100% deterministic!)\n");
