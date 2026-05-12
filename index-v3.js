// index.js
const { World } = require('miniplex');
const seedrandom = require('seedrandom');
const { Identity, Location } = require('./src/components');
const { generateText } = require('./src/grammar');

const world = new World();

// --- THE JIT GENERATOR FUNCTION ---
function loadCoordinate(x, y) {
    const currentCoordinate = `world_X${x}_Y${y}`;
    const rng = seedrandom(currentCoordinate);
    
    console.log(`\n=== Loading Chunk: [X:${x}, Y:${y}] ===`);

    // 1. Generate the Town
    const townName = generateText(rng, "#townName#");
    const townEntity = world.add({
        identity: Identity(townName, "Town"),
        location: Location(x, y)
    });

    console.log(`🏰 Town: ${townName}`);

    // 2. Generate 5 NPCs
    const npcNames = ["Urist", "Bofur", "Thrain", "Elara", "Kael", "Lyra", "Grom", "Sylas"];
    for (let i = 0; i < 5; i++) {
        const randomName = npcNames[Math.floor(rng() * npcNames.length)];
        const desc = generateText(rng, "#npcDesc#");
        
        world.add({
            identity: Identity(randomName, "NPC"),
            location: Location(x, y, townEntity), 
            description: desc 
        });
    }
    
    // 3. Display who is here
    const npcs = world.with('identity', 'location').where(e => e.location.x === x && e.location.y === y && e.identity.type === "NPC");
    for (const npc of npcs) {
        console.log(`   👤 ${npc.identity.name} - ${npc.description}`);
    }
}

// --- THE UNLOAD FUNCTION ---
function unloadCoordinate(x, y) {
    console.log(`\n... Unloading Chunk: [X:${x}, Y:${y}] ...`);
    
    // Find all entities at this coordinate and destroy them to free up memory
    const entitiesAtLocation = world.with('location').where(e => e.location.x === x && e.location.y === y);
    for (const entity of entitiesAtLocation) {
        world.remove(entity);
    }
}

// --- SIMULATING PLAYER MOVEMENT ---

// 1. Player starts at 10, 15
loadCoordinate(10, 15);

// 2. Player moves North to 10, 16
unloadCoordinate(10, 15);
loadCoordinate(10, 16);

// 3. Player moves back South to 10, 15
unloadCoordinate(10, 16);
loadCoordinate(10, 15); // This will perfectly recreate the exact state from step 1
