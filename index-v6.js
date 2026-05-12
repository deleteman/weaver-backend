
// index.js
const { World } = require('miniplex');
const seedrandom = require('seedrandom');
const { stealItem, turnInQuest } = require('./src/actions');
// Add Knowledge to imports
const { Identity, Location, History, Knowledge, Inventory, Quests } = require('./src/components'); 

const { generateQuests} = require('./src/quests');
const { generateText } = require('./src/grammar');
const { saveDelta, getDeltas } = require('./src/db');
const { simulateHistory } = require('./src/history');
// Add Dialogue system
const { talkTo } = require('./src/dialogue'); 

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
    const populationSize = Math.floor(rng() * 9) + 4; 
    console.log(`   (Generating ${populationSize} citizens...)`);

    // We no longer need the npcNames array!
    for (let i = 0; i < populationSize; i++) {
        // Generate a unique First and Last name deterministically
        const generatedName = generateText(rng, "#npcName#");
        const desc = generateText(rng, "#npcDesc#");
        
        world.add({
            identity: Identity(generatedName, "NPC"),
            location: Location(x, y, townEntity), 
            description: desc,
            status: "Alive",
	    age: Math.floor(rng() * 27) + 18,
            history: History(),
            knowledge: Knowledge() ,
	    inventory: Inventory(),
	    quests: Quests()
        });
    }
   // 2. THE LEGENDS PASS 
    simulateHistory(world, rng, x, y, 50);

// 3. APPLY DELTAS
    const savedChanges = getDeltas(currentCoordinate);
    if (savedChanges.length > 0) {
        for (const change of savedChanges) {
            const entityToUpdate = world.with('identity').where(e => e.identity.name === change.entity_name).first;
            
            if (entityToUpdate) {
                // Ignore deprecated delta keys (like quests, since they are dynamic now)
                if (change.state_key === "quests") {
                    continue; 
                } 
                // Parse complex arrays
                else if (change.state_key === "inventory") {
                    entityToUpdate.inventory.items = JSON.parse(change.state_value);
                } 
                // Apply simple state changes (status, roles, etc.)
                else {
                    entityToUpdate[change.state_key] = change.state_value; 
                }
            }
        }
    }
    generateQuests(world, x, y)
    
    // 4. DISPLAY THE WORLD
    const npcs = world.with('identity', 'location', 'status', 'history', 'knowledge').where(e => e.location.x === x && e.location.y === y && e.identity.type === "NPC");
    
    const livingNpcs = []; // Track who we can talk to

    for (const npc of npcs) {
        const statusIcon = npc.status === "Dead" ? "💀" : "👤";
	console.log(`   ${statusIcon} ${npc.identity.name} (Age ${npc.age}) - ${npc.description} (${npc.status})`);
        if (npc.history.events.length > 0) {
            for (const event of npc.history.events) {
                console.log(`      ↳ ${event}`);
            }
        }
        if (npc.status === "Alive") {
            livingNpcs.push(npc);
        }
	if (npc.quests && npc.quests.offeredQuests.length > 0) {
            console.log(`      [!] QUEST GIVER:`);
            for (const quest of npc.quests.offeredQuests) {
                console.log(`          - ${quest.title}: "${quest.description}"`);
            }
        }
    }

    // 5. PLAYER INTERACTION: DIALOGUE
    if (livingNpcs.length >= 2) {
        console.log("\n💬 PLAYER INTERACTION: Asking questions...");
        
        const speaker = livingNpcs[0]; // Pick the first living NPC to talk to
        const subject = livingNpcs[1].identity.name; // Ask them about the second NPC
        
        // Topic 1: Themselves
        console.log(`Player: "Tell me about yourself."`);
        console.log(`${speaker.identity.name}: "${talkTo(speaker, "yourself", rng)}"`);
        
        // Topic 2: Another NPC
        console.log(`\nPlayer: "What do you know about ${subject}?"`);
        console.log(`${speaker.identity.name}: "${talkTo(speaker, subject, rng)}"`);

        // Topic 3: A stranger
        console.log(`\nPlayer: "Have you ever heard of King Arthur?"`);
        console.log(`${speaker.identity.name}: "${talkTo(speaker, "King Arthur", rng)}"`);
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
const targetX = 99;
const targetY = 99;

const coordinateString = `world_X${targetX}_Y${targetY}`;

// The Player's temporary state
const playerInventory = [];

// 1. The Player enters the town and sees the generated world
loadCoordinate(targetX, targetY);

console.log("\n--- SIMULATING PLAYER ACTIONS ---");

// Let's find an active Heist quest generated by the engine
const npcsWithQuests = world.with('identity', 'quests').where(e => e.quests && e.quests.offeredQuests.length > 0);
const activeQuestNPC = Array.from(npcsWithQuests)[0]; 

if (activeQuestNPC) {
    const quest = activeQuestNPC.quests.offeredQuests[0];
    console.log(`\nPlayer accepts quest from ${activeQuestNPC.identity.name}: "${quest.title}"`);
    
    // 2. The Player attempts to execute the Heist!
    const stealSuccess = stealItem(world, coordinateString, quest.target, quest.item, playerInventory);
    
    if (stealSuccess) {
        console.log(`Player Inventory: [${playerInventory.join(", ")}]`);
        
        // 3. The Player returns to the Quest Giver to turn it in!
        turnInQuest(world, coordinateString, activeQuestNPC.identity.name, quest.item, playerInventory);
    }
} else {
    console.log("No quests generated in this town. Try a different coordinate seed!");
}

// 4. PROOF OF PERSISTENCE:
console.log("\n--- UNLOADING AND RELOADING CHUNK TO PROVE PERSISTENCE ---");
unloadCoordinate(targetX, targetY);
loadCoordinate(targetX, targetY);
