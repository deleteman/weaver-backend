// index.js
const { World } = require('miniplex');
const seedrandom = require('seedrandom');
const { Identity, Location, History } = require('./src/components'); // Added History
const { generateText } = require('./src/grammar');
const { saveDelta, getDeltas } = require('./src/db');
const { simulateHistory } = require('./src/history'); // Added simulateHistory

const world = new World();

function loadCoordinate(x, y) {
    const currentCoordinate = `world_X${x}_Y${y}`;
    const rng = seedrandom(currentCoordinate);
    
    console.log(`\n=== Loading Chunk: [X:${x}, Y:${y}] ===`);

    const townName = generateText(rng, "#townName#");
    const townEntity = world.add({
        identity: Identity(townName, "Town"),
        location: Location(x, y)
    });
    console.log(`🏰 Town: ${townName}`);

    // 1. BASE GENERATION
    const npcNames = ["Urist", "Bofur", "Thrain", "Elara", "Kael", "Lyra", "Grom", "Sylas"];
    for (let i = 0; i < 5; i++) {
        const randomName = npcNames[Math.floor(rng() * npcNames.length)];
        const desc = generateText(rng, "#npcDesc#");
        
        world.add({
            identity: Identity(randomName, "NPC"),
            location: Location(x, y, townEntity), 
            description: desc,
            status: "Alive",
            history: History() // Attach the history component
        });
    }

    // 2. THE LEGENDS PASS (Historical Simulation)
    // Run 20 years of simulation before the player arrives
    simulateHistory(world, rng, x, y, 20);

    // 3. APPLY DELTAS
    const savedChanges = getDeltas(currentCoordinate);
    if (savedChanges.length > 0) {
        console.log(`   [System] Applying ${savedChanges.length} saved changes to this chunk...`);
        for (const change of savedChanges) {
            const entityToUpdate = world.with('identity').where(e => e.identity.name === change.entity_name).first;
            if (entityToUpdate) {
                entityToUpdate[change.state_key] = change.state_value; 
            }
        }
    }
    
    // 4. DISPLAY THE WORLD
    const npcs = world.with('identity', 'location', 'status', 'history').where(e => e.location.x === x && e.location.y === y && e.identity.type === "NPC");
    for (const npc of npcs) {
        const statusIcon = npc.status === "Dead" ? "💀" : "👤";
        console.log(`   ${statusIcon} ${npc.identity.name} - ${npc.description} (${npc.status})`);
        
        // Print their generated history if they have any
        if (npc.history.events.length > 0) {
            for (const event of npc.history.events) {
                console.log(`      ↳ ${event}`);
            }
        }
    }
}

function unloadCoordinate(x, y) {
    console.log(`\n... Unloading Chunk: [X:${x}, Y:${y}] ...`);
    const entitiesAtLocation = world.with('location').where(e => e.location.x === x && e.location.y === y);
    for (const entity of entitiesAtLocation) {
        world.remove(entity);
    }
}

// --- RUNNING THE ENGINE ---
const targetX = 10;
const targetY = 15;

loadCoordinate(targetX, targetY);
// Try commenting out these lines on your second run to see the pristine generated history without player interference!
// console.log("\n⚔️ PLAYER ACTION: Player attacks and kills Urist!");
// saveDelta(`world_X${targetX}_Y${targetY}`, "Urist", "status", "Dead");
