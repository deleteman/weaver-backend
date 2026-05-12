// index.js
const { World } = require('miniplex');
const seedrandom = require('seedrandom');
const { Identity, Location } = require('./src/components');
const { generateText } = require('./src/grammar');
const { saveDelta, getDeltas } = require('./src/db');

const world = new World();

function loadCoordinate(x, y) {
    const currentCoordinate = `world_X${x}_Y${y}`;
    const rng = seedrandom(currentCoordinate);
    
    console.log(`\n=== Loading Chunk: [X:${x}, Y:${y}] ===`);

    // 1. Generate the pristine base world
    const townName = generateText(rng, "#townName#");
    const townEntity = world.add({
        identity: Identity(townName, "Town"),
        location: Location(x, y)
    });
    console.log(`🏰 Town: ${townName}`);

    const npcNames = ["Urist", "Bofur", "Thrain", "Elara", "Kael", "Lyra", "Grom", "Sylas"];
    for (let i = 0; i < 5; i++) {
        const randomName = npcNames[Math.floor(rng() * npcNames.length)];
        const desc = generateText(rng, "#npcDesc#");
        
        world.add({
            identity: Identity(randomName, "NPC"),
            location: Location(x, y, townEntity), 
            description: desc,
            status: "Alive" // Default state
        });
    }

    // 2. APPLY DELTAS (The crucial new step)
    const savedChanges = getDeltas(currentCoordinate);
    if (savedChanges.length > 0) {
        console.log(`   [System] Applying ${savedChanges.length} saved changes to this chunk...`);
        
        // Find the entities that need to be updated
        for (const change of savedChanges) {
            const entityToUpdate = world.with('identity').where(e => e.identity.name === change.entity_name).first;
            
            if (entityToUpdate) {
                // Overwrite the pristine state with the saved state
                entityToUpdate[change.state_key] = change.state_value; 
            }
        }
    }
    
    // 3. Display the final JIT state
    const npcs = world.with('identity', 'location', 'status').where(e => e.location.x === x && e.location.y === y && e.identity.type === "NPC");
    for (const npc of npcs) {
        const statusIcon = npc.status === "Dead" ? "💀" : "👤";
        console.log(`   ${statusIcon} ${npc.identity.name} - ${npc.description} (${npc.status})`);
    }
}

function unloadCoordinate(x, y) {
    console.log(`\n... Unloading Chunk: [X:${x}, Y:${y}] ...`);
    const entitiesAtLocation = world.with('location').where(e => e.location.x === x && e.location.y === y);
    for (const entity of entitiesAtLocation) {
        world.remove(entity);
    }
}

// --- SIMULATING THE GAMEPLAY LOOP ---

const targetX = 10;
const targetY = 15;
const targetCoordinateString = `world_X${targetX}_Y${targetY}`;

// 1. Player arrives for the first time
loadCoordinate(targetX, targetY);

// 2. Player Action: Kill Urist
console.log("\n⚔️ PLAYER ACTION: Player attacks and kills Urist!");
// In a real game, your combat system would do this. We just save the delta manually here.
saveDelta(targetCoordinateString, "Urist", "status", "Dead");

// 3. Player leaves the area (Unloads from memory)
unloadCoordinate(targetX, targetY);

// 4. Player returns later
console.log("\n🚶 Player travels back to the previous town...");
loadCoordinate(targetX, targetY);
