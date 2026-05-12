// index.js
const { World } = require('miniplex');
const seedrandom = require('seedrandom');
const { Identity, Location } = require('./src/components');

// 1. Initialize the ECS World
// This holds all our entities and allows us to query them based on their components.
const world = new World();

// 2. Set up our PRNG with a specific coordinate seed
// No matter how many times you run this script, this seed will always produce the exact same sequence of numbers.
const currentCoordinate = "world_X10_Y15";
const rng = seedrandom(currentCoordinate);

console.log(`\n=== Initializing Seed: ${currentCoordinate} ===\n`);

// Helper function: Get a random integer between min and max (inclusive) using our seeded rng
function getRandomInt(min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
}

// 3. Verify PRNG Consistency
console.log("--- Verifying PRNG Outputs ---");
console.log("Roll 1:", getRandomInt(1, 100));
console.log("Roll 2:", getRandomInt(1, 100));
console.log("Roll 3:", getRandomInt(1, 100));
console.log("(Run this script again; these numbers will not change.)\n");

// 4. Create Entities using the seeded RNG
console.log("--- Spawning Entities ---");

// Simple arrays to randomly pull from
const names = ["Urist", "Bofur", "Thrain", "Elara", "Kael"];
const types = ["Blacksmith", "Guard", "Merchant", "Thief", "Noble"];

for (let i = 0; i < 3; i++) {
    // Pick random attributes using our seeded RNG
    const randomName = names[getRandomInt(0, names.length - 1)];
    const randomType = types[getRandomInt(0, types.length - 1)];
    
    // Spawn entity into the Miniplex world
    // An entity is just a plain JavaScript object holding component data
    world.add({
        identity: Identity(randomName, randomType),
        location: Location(10, 15) // Everyone spawns at the seed's base coordinates
    });
}
console.log("3 Entities successfully added to the ECS World.\n");

// 5. Querying the ECS
console.log("--- Querying ECS for Entities at X:10, Y:15 ---");

// Miniplex allows us to create an 'archetype' query.
// Here we want all entities that possess both an 'identity' and a 'location'.
const locatedEntities = world.with('identity', 'location');

for (const entity of locatedEntities) {
    console.log(`Found ${entity.identity.name} the ${entity.identity.type} at coordinates X:${entity.location.x}, Y:${entity.location.y}`);
}
