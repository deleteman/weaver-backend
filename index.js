// index.js
const express = require('express');
const { World } = require('miniplex');
const seedrandom = require('seedrandom');

const { Identity, Location, History, Knowledge, Inventory, Quests, Status, Political, Diplomacy } = require('./src/components');
const { PoliticalEngine } = require('./src/politics'); 
const { generateText } = require('./src/grammar');
const { saveDelta, upsertDelta, getDeltas, getGlobalYear, getParentCity } = require('./src/db');
const { simulateHistory } = require('./src/history');
const { generateQuests } = require('./src/quests');
const actions = require('./src/actions'); 
const { generateMiniMap, estimateTierFromTime, CLAIM_RADIUS_BY_TIER, DISTRICT_TYPES } = require('./src/map');
const { BloomFilter } = require('./src/bloom-filter');
const { determineBiome, assignRoleByBiome, getBiomeDemographics, determinePoliticalStance } = require('./src/biomes');
const cors = require("cors");
// Add this to your requires at the top of index.js
const crypto = require('crypto');
const { log } = require('./src/logger');
const { generateAppearance } = require('./src/appearance');
const { generateTileDescription } = require('./src/tile-description');

const MAX_FUTURE_YEARS = 500;

const app = express();
app.use(cors());

app.use(express.json());
const port = 3000;

const world = new World();

// Helper functions
function generateTown(world, x, y, rng) {
    const currentCoordinate = `world_X${x}_Y${y}`;
    const townName = generateText(rng, "#townName#");
    const townId = crypto.createHash('md5').update(`${currentCoordinate}_${townName}_town`).digest('hex').substring(0, 12);
    
    const townEntity = world.add({
        identity: Identity(townName, "Town", townId),
        location: Location(x, y),
        history: { events: [] },
        currentMayor: "NPC",
        political: Political(1, {}),
        population: 0
    });
    log(`Generated town: ${townName} at (${x}, ${y})`);
    return townEntity;
}

function generateNPCs(world, x, y, rng, populationSize, townEntity) {
    const currentCoordinate = `world_X${x}_Y${y}`;
    const biome = determineBiome(x, y);
    
    for (let i = 0; i < populationSize; i++) {
        const name = generateText(rng, "#npcName#");
        const age = Math.floor(rng() * 27) + 18;
        const npcId = crypto.createHash('md5').update(`${currentCoordinate}_${name}_base_${i}`).digest('hex').substring(0, 12);
        const role = assignRoleByBiome(rng, biome);
        
        world.add({
            identity: Identity(name, "NPC", npcId),
            location: Location(x, y, townEntity), 
            description: generateText(rng, "#npcDesc#"),
            age,
            currentRole: role,
            biome,
            status: "Alive",
            inventory: { items: [] },
            quests: { offeredQuests: [] },
            history: { events: [] },
            knowledge: { memories: {} }
        });
    }
    log(`Generated ${populationSize} NPCs at (${x}, ${y}) with biome ${biome}`);
}

function injectImmigrantsAndApplyDeltas(world, x, y, townEntity, currentCoordinate) {
    const savedChanges = getDeltas(currentCoordinate);
    log(`Injecting immigrants and applying ${savedChanges.length} deltas at (${x}, ${y})`);

    // Inject Immigrants
    const immigrants = savedChanges.filter(c => c.state_key === "immigrant_data");
    for (const imm of immigrants) {
        const data = JSON.parse(imm.state_value);
        world.add({
            identity: Identity(data.name, "NPC", imm.entity_name), 
            location: Location(x, y, townEntity),
            description: data.description,
            status: "Alive",
            currentRole: "Exile", 
            age: data.age,
            history: { events: [] }, 
            knowledge: { memories: data.memories }, 
            inventory: { items: data.inventory },
            quests: Quests()
        });
        log(`Injected immigrant: ${data.name}`);
    }

    // Apply Deltas
    for (const change of savedChanges) {
        const entityToUpdate = world.with('identity').where(e => e.identity.id === change.entity_name || e.identity.name === change.entity_name).first;
        if (entityToUpdate) {
            if (change.state_key === "quests" || change.state_key === "immigrant_data") {
                continue; 
            } else if (change.state_key === "inventory") {
                entityToUpdate.inventory.items = JSON.parse(change.state_value);
                log(`Applied inventory delta to ${entityToUpdate.identity.name}`);
            } else if (change.state_key === "political") {
                const simulatedTier = entityToUpdate.political?.tier || 1;
                const savedPolitical = JSON.parse(change.state_value);
                entityToUpdate.political = { ...savedPolitical, tier: Math.max(simulatedTier, savedPolitical.tier || 1) };
                log(`Applied political delta to ${entityToUpdate.identity.name}`);
            } else if (change.state_key === "population") {
                entityToUpdate.population = parseInt(change.state_value);
                log(`Applied population delta to ${entityToUpdate.identity.name}`);
            } else if (change.state_key.startsWith("memory_")) {
                const targetName = change.state_key.split("_")[1];
                entityToUpdate.knowledge.memories[targetName] = change.state_value;
                log(`Applied memory delta to ${entityToUpdate.identity.name}`);
            } else if (change.state_key === "history_append") {
                entityToUpdate.history.events.push(change.state_value);
                log(`Appended history to ${entityToUpdate.identity.name}`);
            } else if (change.state_key === "currentMayor") {
                // Districts always inherit currentMayor from their parent (set by loadAsDistrict).
                // Skipping the saved delta here prevents a stale 'Unknown' — written on a first
                // visit before the parent was ever loaded — from overwriting the correct value.
                if (entityToUpdate.identity.type !== "District") {
                    entityToUpdate.currentMayor = change.state_value;
                    log(`Applied currentMayor delta to ${entityToUpdate.identity.name}`);
                }
            } else {
                console.log(`Applying ${change.state_key} = ${change.state_value} to ${entityToUpdate.identity.name} (${entityToUpdate.identity.id})`);
                entityToUpdate[change.state_key] = change.state_value;
                console.log(`Applied ${change.state_key} delta to ${entityToUpdate.identity.name}`);
            }
        } else {
            log(`No entity found for delta: ${change.entity_name} ${change.state_key}`);
        }
    }
}

function calculatePoliticalStance(world, x, y, townEntity) {
    const npcs = Array.from(world.with('identity', 'currentRole')
        .where(e => e.location.x === x && e.location.y === y && e.identity.type === "NPC" && e.status === "Alive"));
    
    const demographics = {};
    for (const npc of npcs) {
        const role = npc.currentRole;
        demographics[role] = (demographics[role] || 0) + 1;
    }
    
    // Normalize to percentages
    const total = npcs.length || 1;
    for (const role of Object.keys(demographics)) {
        demographics[role] = demographics[role] / total;
    }
    
    const stance = determinePoliticalStance(demographics);
    townEntity.politicalStance = stance;
    townEntity.demographics = demographics;
    
    log(`Town at (${x}, ${y}) assigned political stance: ${stance}`, demographics);
}

// Parses "world_X2_Y-1" → { x: 2, y: -1 }
function parseCoordinate(coordStr) {
    const match = coordStr.match(/world_X(-?\d+)_Y(-?\d+)/);
    return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : { x: 0, y: 0 };
}

// Generates a district entity that inherits the parent city's ruler and political state.
// Called in place of the standard town Base Pass when a coordinate is claimed.
function loadAsDistrict(x, y, parentCoordinate) {
    log(`Loading (${x}, ${y}) as district of ${parentCoordinate}`);
    const currentCoordinate = `world_X${x}_Y${y}`;
    const rng = seedrandom(currentCoordinate);

    // Deterministic district type from coordinate seed
    const districtTypeRng = seedrandom(`district_type_X${x}_Y${y}`);
    const districtType = DISTRICT_TYPES[Math.floor(districtTypeRng() * DISTRICT_TYPES.length)];

    // Inherit ruler and political state from the parent city's saved deltas
    const parentDeltas = getDeltas(parentCoordinate);
    const mayorDelta = parentDeltas.find(d => d.state_key === 'currentMayor');
    const politicalDelta = parentDeltas.find(d => d.state_key === 'political');
    const parentMayor = mayorDelta ? mayorDelta.state_value : 'Unknown';
    const parentPolitical = politicalDelta
        ? JSON.parse(politicalDelta.state_value)
        : { tier: 1, demographics: {}, stance: 'Balanced' };

    // Generate district town entity — same name seed as map so names are consistent
    const townName = generateText(rng, "#townName#");
    const townId = crypto.createHash('md5').update(`${currentCoordinate}_${townName}_district`).digest('hex').substring(0, 12);

    const districtEntity = world.add({
        identity: Identity(townName, "District", townId),
        location: Location(x, y),
        history: { events: [`[Year 1] Established as a ${districtType} district under ${parentCoordinate}.`] },
        currentMayor: parentMayor,
        political: { ...parentPolitical },
        population: 0,
        districtType,
        parentCity: parentCoordinate
    });

    // Generate NPCs — population is smaller than a full town (3–9)
    const populationSize = Math.floor(rng() * 7) + 3;
    generateNPCs(world, x, y, rng, populationSize, districtEntity);

    // Legends Pass (Years 1-50) and Future Pass — must run before delta injection,
    // matching the regular town pipeline so DB-accumulated immigrants don't compound
    simulateHistory(world, rng, x, y, 50, 1);
    const globalYear = getGlobalYear();
    const futureYears = Math.min(globalYear - 51, MAX_FUTURE_YEARS);
    if (futureYears > 0) {
        simulateHistory(world, seedrandom(currentCoordinate + "_future"), x, y, futureYears, 51);
    }

    // Districts are always governed by the parent city's ruler — simulation may have
    // promoted a local NPC to Mayor, so we restore the authoritative parent value.
    districtEntity.currentMayor = parentMayor;

    // Apply any player-caused deltas (kills, steals, etc.) for this coordinate
    injectImmigrantsAndApplyDeltas(world, x, y, districtEntity, currentCoordinate);

    // Generate quests scoped to this district
    generateQuests(world, x, y, seedrandom(currentCoordinate + "_quests"));
    log(`District (${districtType}) loaded at (${x}, ${y}) under ${parentCoordinate}`);
}

// Mirrors computeOwnership() from map.js: scans neighbours within the maximum
// possible claim radius and returns the coordinate string of the settlement
// that would own this tile according to the same tier-estimation logic the map
// uses. Returns null when no neighbour can claim this tile.
function findEstimatedParent(x, y) {
    const MAX_CLAIM_RADIUS = 3; // tier-5 Kingdom reaches 3 tiles
    const globalYear = getGlobalYear();
    let bestOwner = null;
    let bestTier = 0;
    let bestDist = Infinity;

    for (let dx = -MAX_CLAIM_RADIUS; dx <= MAX_CLAIM_RADIUS; dx++) {
        for (let dy = -MAX_CLAIM_RADIUS; dy <= MAX_CLAIM_RADIUS; dy++) {
            if (dx === 0 && dy === 0) continue;
            const dist = Math.max(Math.abs(dx), Math.abs(dy));
            const nx = x + dx;
            const ny = y + dy;

            // Quick math-only check — skip DB read if estimated tier can't reach us
            const estimatedTier = estimateTierFromTime(nx, ny, globalYear);
            if ((CLAIM_RADIUS_BY_TIER[estimatedTier] || 0) < dist) continue;

            // Only trust DB-confirmed tiers for district classification.
            // Unvisited neighbours have no political delta, so skip them — a pure
            // time estimate is not enough to turn a tile into a district.
            const neighborDeltas = getDeltas(`world_X${nx}_Y${ny}`);
            const politicalDelta = neighborDeltas.find(d => d.state_key === 'political');
            if (!politicalDelta) continue;
            const savedTier = JSON.parse(politicalDelta.state_value).tier || 1;
            const neighborTier = Math.max(savedTier, estimatedTier);
            if ((CLAIM_RADIUS_BY_TIER[neighborTier] || 0) < dist) continue;

            const beats =
                bestOwner === null ||
                neighborTier > bestTier ||
                (neighborTier === bestTier && dist < bestDist) ||
                (neighborTier === bestTier && dist === bestDist &&
                    (nx < x || (nx === x && ny < y)));

            if (beats) {
                bestOwner = `world_X${nx}_Y${ny}`;
                bestTier = neighborTier;
                bestDist = dist;
            }
        }
    }

    return bestOwner;
}

// 1. Update loadCoordinate to accept the override parameter
function loadCoordinate(x, y, forcedUniversalYear = null) {
    log(`Loading coordinate (${x}, ${y})`);
    const currentCoordinate = `world_X${x}_Y${y}`;

    // Delta Pass pre-check: if this tile is claimed by a higher-tier settlement,
    // skip generic town generation and load it as a District instead (PRD §5.1).
    // Fall back to in-memory tier estimation so the chunk API stays consistent
    // with computeOwnership() in the map API (which uses the same estimation).
    const parentCoordinate = getParentCity(currentCoordinate) || findEstimatedParent(x, y);
    if (parentCoordinate) {
        loadAsDistrict(x, y, parentCoordinate);
        return;
    }
    const rng = seedrandom(currentCoordinate);
    
    // Base Generation (Town)
    const townEntity = generateTown(world, x, y, rng);

    // Base Generation (Native Population)
    const populationSize = Math.floor(rng() * 9) + 4; 
    generateNPCs(world, x, y, rng, populationSize, townEntity);
    
    // Calculate and assign political stance
    calculatePoliticalStance(world, x, y, townEntity);

    // The Legends Pass (Years 1-50)
    log(`Simulating initial history for 50 years at (${x}, ${y})`);
    simulateHistory(world, rng, x, y, 50, 1);

    // THE FUTURE PASS (Fixed to use Universal Time & Bypasses)
    const currentUniversalYear = forcedUniversalYear !== null ? forcedUniversalYear : getGlobalYear();
    const futureYears = Math.min(currentUniversalYear - 51, MAX_FUTURE_YEARS);

    if (futureYears > 0) {
        log(`Simulating future history for ${futureYears} years at (${x}, ${y})`);
        simulateHistory(world, seedrandom(currentCoordinate + "_future"), x, y, futureYears, 51);
    }

    // Inject Immigrants and Apply Deltas
    injectImmigrantsAndApplyDeltas(world, x, y, townEntity, currentCoordinate);

    // Generate Dynamic Quests
    log(`Generating quests at (${x}, ${y})`);
    generateQuests(world, x, y, seedrandom(currentCoordinate + "_quests"));
    log(`Coordinate (${x}, ${y}) loaded successfully`);
}

function unloadCoordinate(x, y) {
    log(`Unloading coordinate (${x}, ${y})`);
    const currentCoordinate = `world_X${x}_Y${y}`;

    const settlement = world.with('location', 'identity', 'political', 'population')
        .where(e => (e.identity.type === "Town" || e.identity.type === "District")
                 && e.location.x === x && e.location.y === y).first;

    if (settlement) {
        saveDelta(currentCoordinate, settlement.identity.id, "political", JSON.stringify(settlement.political));
        saveDelta(currentCoordinate, settlement.identity.id, "population", settlement.population.toString());
        // Districts inherit currentMayor from their parent on every load — saving it here would
        // write a stale value that later overwrites the parent's authoritative mayor during delta injection.
        if (settlement.identity.type !== "District") {
            saveDelta(currentCoordinate, settlement.identity.id, "currentMayor", settlement.currentMayor || "None");
        }
        log(`Saved ${settlement.identity.type} state: tier=${settlement.political?.tier}, population=${settlement.population}, mayor=${settlement.currentMayor || "None"}`);

        // Write territory claims for Towns that have expanded beyond tier 1.
        // Uses upsertDelta so repeated visits don't accumulate duplicate rows.
        if (settlement.identity.type === "Town") {
            const tier = settlement.political?.tier || 1;
            if (tier > 1) {
                const claimRadius = Math.floor(PoliticalEngine.getExpansionRange(tier) / 2);
                for (let dx = -claimRadius; dx <= claimRadius; dx++) {
                    for (let dy = -claimRadius; dy <= claimRadius; dy++) {
                        if (dx === 0 && dy === 0) continue;
                        const claimedCoord = `world_X${x + dx}_Y${y + dy}`;
                        upsertDelta("GLOBAL", claimedCoord, "Claimed_By", currentCoordinate);
                    }
                }
                log(`Wrote territory claims for tier ${tier} settlement at (${x}, ${y}), radius ${claimRadius}`);
            }
        }
    }

    const entitiesAtLocation = world.with('location').where(e => e.location.x === x && e.location.y === y);
    for (const entity of entitiesAtLocation) {
        world.remove(entity);
    }
    log(`Unloaded ${entitiesAtLocation.length} entities from (${x}, ${y})`);
}
function serializeChunk(x, y) {
    log(`Serializing chunk at (${x}, ${y})`);
    const town = world.with('identity', 'location', 'history', 'currentMayor', 'political', 'population')
                      .where(e => (e.identity.type === "Town" || e.identity.type === "District")
                               && e.location.x === x && e.location.y === y).first;

    // Biome is deterministic from coordinate — used as fallback for immigrants
    // who were injected without a biome component
    const chunkBiome = determineBiome(x, y);

    // Filter out both "Exiled" AND "Migrated" NPCs
    const npcs = world.with('identity', 'location').where(e =>
        e.location.x === x && e.location.y === y &&
        e.identity.type === "NPC" &&
        e.status !== "Exiled" &&
        e.status !== "Migrated"
    );

    const npcData = Array.from(npcs).map(npc => ({
        id: npc.identity.id,
        name: npc.identity.name,
        age: npc.age,
        role: npc.currentRole,
        status: npc.status,
        appearance: generateAppearance(npc.identity.id, npc.age, npc.currentRole, npc.biome || chunkBiome, npc.status),
        dead: npc.status === 'Dead',
        inventory: npc.inventory ? npc.inventory.items : [],
        quests: npc.quests ? npc.quests.offeredQuests : [],
        history: npc.history ? npc.history.events : [],
        memories: npc.knowledge ? npc.knowledge.memories : {}
    }));

    const townData = {
        name:        town ? town.identity.name : "Unknown",
        type:        town ? town.identity.type : "Town",
        districtType: town?.districtType || null,
        parentCity:  town?.parentCity || null,
        ruler:       town ? town.currentMayor : "NPC",
        tier:        town ? (town.political?.tier ?? 1) : 1,
        population:  town ? town.population : 0,
        history:     town ? town.history.events : [],
        politicalStance: town?.politicalStance || 'Balanced',
    };

    const result = {
        globalYear: getGlobalYear(),
        coordinate: { x, y },
        town: townData,
        population: npcData,
        tileDescription: generateTileDescription(townData, npcData, chunkBiome, x, y),
    };
    log(`Serialized chunk with ${npcData.length} NPCs at tier ${result.town.tier}`);
    return result;
}

// --- REST API ENDPOINTS ---

app.get('/api/chunk/:x/:y', (req, res) => {
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);
    log(`API request: GET /api/chunk/${x}/${y}`);
    loadCoordinate(x, y);
    const chunkData = serializeChunk(x, y);
    unloadCoordinate(x, y); 
    log(`API response: chunk data sent`);
    res.json(chunkData);
});

function handleAction(req, res, actionFunction) {
    console.log(`handleAction called for ${actionFunction.name}`);
    // Extract BOTH item and itemId to support the new artifacts
    const { x: xStr, y: yStr, target, item, itemId, newRole, playerState } = req.body;
    const x = parseInt(xStr);
    const y = parseInt(yStr);
    const coordinateString = `world_X${x}_Y${y}`;

    if (!playerState.titles) playerState.titles = {};

    log(`Handling action at (${x}, ${y}): ${actionFunction.name} on ${target}`);
    loadCoordinate(x, y);
    
    // Normalize the item variable regardless of what the frontend sent
    const targetItem = itemId || item;
    
    let result;
    if (targetItem && target) result = actionFunction(world, coordinateString, target, targetItem, playerState);
    else if (newRole && target) result = actionFunction(world, coordinateString, target, newRole, playerState); 
    else if (target) result = actionFunction(world, coordinateString, target, playerState);
    else result = actionFunction(world, coordinateString, playerState); 

    if (result.success) {
        log(`Action successful: ${result.message}`);
        // Return updated chunk data after successful action
        const chunkData = serializeChunk(x, y);
        unloadCoordinate(x, y);
        log(`Returning chunkData with ${chunkData.population.length} NPCs`);
        res.json({ message: result.message, playerState, chunkData });
    } else {
        log(`Action failed: ${result.message}`);
        unloadCoordinate(x, y);
        res.status(400).json({ error: result.message, playerState });
    }
}

app.post('/api/action/steal', (req, res) => handleAction(req, res, actions.stealItem));
app.post('/api/action/turnin', (req, res) => handleAction(req, res, actions.turnInQuest));
app.post('/api/action/assassinate', (req, res) => {
    console.log('POST /api/action/assassinate received');
    handleAction(req, res, actions.assassinate);
});
app.post('/api/action/claim', (req, res) => handleAction(req, res, actions.claimThrone));

app.post('/api/action/tax', (req, res) => handleAction(req, res, actions.taxTown));
app.post('/api/action/abdicate', (req, res) => handleAction(req, res, actions.abdicate));
app.post('/api/action/banish', (req, res) => handleAction(req, res, actions.banish));
app.post('/api/action/decree', (req, res) => handleAction(req, res, actions.decree));
app.post('/api/action/loot_tomb', (req, res) => handleAction(req, res, actions.lootTomb)); // NEW!



// 2. Update the endpoint to securely pass the new year
app.post('/api/action/advance_time', (req, res) => {
    const { x, y, years } = req.body;
    const yearsToAdd = parseInt(years) || 0;
    
    const currentYear = getGlobalYear();
    const newYear = currentYear + yearsToAdd;
    
    log(`API request: POST /api/action/advance_time, advancing to year ${newYear}`);
    saveDelta("GLOBAL", "Time", "currentYear", newYear.toString());
    
    // FIX: Pass the newYear directly to bypass the database write delay!
    loadCoordinate(x, y, newYear);
    const chunkData = serializeChunk(x, y);
    unloadCoordinate(x, y);

    log(`Time advanced successfully`);
    res.json({ message: `⏳ Universal Time moved forward to Year ${newYear}.`, chunkData });
});

// --- NEW ENDPOINT: FOG OF WAR MINI-MAP ---
// Helper function to handle mini-map generation
function handleMiniMapRequest(req, res) {
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);
    const radius = req.params.radius ? parseInt(req.params.radius) : 1; // Default 3x3 grid

    // Validate inputs
    if (isNaN(x) || isNaN(y) || isNaN(radius) || radius < 1 || radius > 5) {
        return res.status(400).json({ 
            error: 'Invalid coordinates or radius. Radius must be 1-5.' 
        });
    }

    log(`API request: GET /api/map/${x}/${y}/${radius} - Mini-map generation`);

    let discoveredFilter = BloomFilter.empty();
    if (req.query.bf) {
        try {
            discoveredFilter = BloomFilter.fromBase64(req.query.bf);
        } catch {
            return res.status(400).json({ error: 'Invalid bloom filter value', code: 'INVALID_BF' });
        }
    }

    try {
        const miniMap = generateMiniMap(x, y, radius, discoveredFilter);
        log(`Mini-map generated: ${miniMap.gridSize}x${miniMap.gridSize} grid`);
        res.json(miniMap);
    } catch (error) {
        log(`Mini-map generation error: ${error.message}`);
        res.status(500).json({ error: 'Failed to generate mini-map', details: error.message });
    }
}

// Register both endpoints - with and without radius
app.get('/api/map/:x/:y', handleMiniMapRequest);
app.get('/api/map/:x/:y/:radius', handleMiniMapRequest);

// --- NEW ENDPOINT: THE TOWN CHRONICLE ---
app.get('/api/chunk/:x/:y/chronicle', (req, res) => {
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);
    
    log(`API request: GET /api/chunk/${x}/${y}/chronicle`);
    loadCoordinate(x, y);
    
    // Gather all entities with a history
    const entities = Array.from(world.with('identity', 'history').where(e => e.location.x === x && e.location.y === y));
    
    let allEvents = [];
    const yearRegex = /\[Year (\d+)\] (.*)/;

    for (const entity of entities) {
        for (const eventString of entity.history.events) {
            const match = eventString.match(yearRegex);
            if (match) {
                allEvents.push({
                    year: parseInt(match[1]),
                    actor: entity.identity.name,
                    text: match[2]
                });
            }
        }
    }

    // Sort chronologically
    allEvents.sort((a, b) => a.year - b.year);

    // Group by year for a beautiful JSON summary format
    let chronicle = {};
    for (const ev of allEvents) {
        if (!chronicle[`Year ${ev.year}`]) chronicle[`Year ${ev.year}`] = [];
        chronicle[`Year ${ev.year}`].push(`${ev.actor}: ${ev.text}`);
    }

    unloadCoordinate(x, y);

    log(`Chronicle generated with ${allEvents.length} events`);
    res.json({
        title: `The Chronicles of Coordinate ${x}, ${y}`,
        timeline: chronicle
    });
});

// --- GET COORDINATE ---
function executeActionByType(actionType, coordinateString, target, item, itemId, newRole, playerState, x, y) {
    if (!actions[actionType] || typeof actions[actionType] !== 'function') {
        return { success: false, message: `Action '${actionType}' is not available.` };
    }

    log(`Executing action by type: ${actionType} at (${x}, ${y})`);
    loadCoordinate(x, y);

    const targetItem = itemId || item;
    let result;
    if (targetItem && target) {
        result = actions[actionType](world, coordinateString, target, targetItem, playerState);
    } else if (newRole && target) {
        result = actions[actionType](world, coordinateString, target, newRole, playerState);
    } else if (target) {
        result = actions[actionType](world, coordinateString, target, playerState);
    } else {
        result = actions[actionType](world, coordinateString, playerState);
    }

    if (result.success) {
        const chunkData = serializeChunk(x, y);
        unloadCoordinate(x, y);
        return { success: true, message: result.message, playerState: result.playerState || playerState, chunkData };
    } else {
        unloadCoordinate(x, y);
        return { success: false, message: result.message };
    }
}

app.get('/api/coordinate', (req, res) => {
    const x = parseInt(req.query.x);
    const y = parseInt(req.query.y);
    if (isNaN(x) || isNaN(y)) {
        return res.status(400).json({ error: 'Invalid x or y coordinate.' });
    }

    log(`API request: GET /api/coordinate?x=${x}&y=${y}`);
    loadCoordinate(x, y);
    const chunkData = serializeChunk(x, y);
    unloadCoordinate(x, y);
    res.json(chunkData);
});

// --- POST ACTION ---
app.post('/api/action/:actionType', (req, res) => {
    const actionType = req.params.actionType;
    const { x, y, target, item, itemId, newRole, playerState } = req.body;
    const xInt = parseInt(x);
    const yInt = parseInt(y);

    if (isNaN(xInt) || isNaN(yInt)) {
        return res.status(400).json({ error: 'Invalid x or y coordinate.' });
    }

    const coordinateString = `world_X${xInt}_Y${yInt}`;
    const result = executeActionByType(actionType, coordinateString, target, item, itemId, newRole, playerState, xInt, yInt);
    if (result.success) {
        res.json({ message: result.message, playerState: result.playerState, chunkData: result.chunkData });
    } else {
        res.status(400).json({ error: result.message });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        log(`🚀 Weaver RPG Engine API running at http://localhost:${port}`);
        console.log(`🚀 Weaver RPG Engine API running at http://localhost:${port}`);
    });
}

module.exports = { app, loadCoordinate, serializeChunk, unloadCoordinate };