// index.js
const express = require('express');
const { World } = require('miniplex');
const seedrandom = require('seedrandom');

const { Identity, Location, History, Knowledge, Inventory, Quests, Status, Political, Diplomacy, Memory } = require('./src/components');
const { PoliticalEngine, CONQUEST_TYPES } = require('./src/politics');
const { generateText } = require('./src/grammar');
const { saveDelta, upsertDelta, getDeltas, getGlobalYear, getParentCity, getTierForCoordinate, appendJournalEntry, getJournal } = require('./src/db');
const { simulateHistory, MAX_NATURAL_LIFESPAN, MAX_LIFESPAN_VARIANCE, computeDeathAge } = require('./src/history');
const { generateQuests } = require('./src/quests');
const actions = require('./src/actions'); 
const { generateMiniMap, estimateTierFromTime, CLAIM_RADIUS_BY_TIER, DISTRICT_TYPES, getAdjacentTiles } = require('./src/map');
const { BloomFilter } = require('./src/bloom-filter');
const { determineBiome, assignRoleByBiome, getBiomeDemographics, determinePoliticalStance, BIOME_PRIMARY_EXPORT } = require('./src/biomes');
const cors = require("cors");
// Add this to your requires at the top of index.js
const crypto = require('crypto');
const { log } = require('./src/logger');
const { generateAppearance } = require('./src/appearance');
const { generateTileDescription } = require('./src/tile-description');
const { deterministicHash, makeEvent } = require('./src/event-utils');
const { generateMerchantInventory } = require('./src/items');

const MAX_FUTURE_YEARS = 500;
const SEX_MALE_THRESHOLD = 0.48;
const SEX_FEMALE_THRESHOLD = 0.96;

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

    const biome = determineBiome(x, y);
    const exportOptions = BIOME_PRIMARY_EXPORT[biome] || BIOME_PRIMARY_EXPORT.Plains;
    const exportRng = seedrandom(currentCoordinate + '_export');
    const primaryExport = exportOptions[Math.floor(exportRng() * exportOptions.length)];

    const townEntity = world.add({
        identity: Identity(townName, "Town", townId),
        location: Location(x, y),
        history: { events: [] },
        currentMayor: "NPC",
        political: Political(estimateTierFromTime(x, y), {}),
        population: 0,
        regionalWealth: 500,
        primaryExport,
        tradePartners: [],
        economicModifiers: {
            shortage: false,
            hyperinflation: false,
            hyperinflationExpiryYear: null,
            economicBoomYear: null
        }
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
        const sexRoll = rng();
        const sex = sexRoll < SEX_MALE_THRESHOLD ? 'male' : sexRoll < SEX_FEMALE_THRESHOLD ? 'female' : 'other';

        const npcEntity = {
            identity: Identity(name, "NPC", npcId),
            location: Location(x, y, townEntity),
            description: generateText(rng, "#npcDesc#"),
            age,
            birthYear: 1 - age,
            currentRole: role,
            biome,
            sex,
            status: "Alive",
            inventory: { items: [] },
            quests: { offeredQuests: [] },
            history: { events: [] },
            knowledge: { memories: {} },
            ...Memory()
        };

        if (role === 'Merchant' && townEntity) {
            npcEntity.personalWealth = Math.floor(rng() * 2501) + 500;
            npcEntity.merchantInventory = generateMerchantInventory(rng, townEntity.primaryExport || 'Grain', getGlobalYear(), currentCoordinate);
        }

        world.add(npcEntity);
    }
    log(`Generated ${populationSize} NPCs at (${x}, ${y}) with biome ${biome}`);
}

function injectImmigrantsAndApplyDeltas(world, x, y, townEntity, currentCoordinate) {
    const savedChanges = getDeltas(currentCoordinate);
    log(`Injecting immigrants and applying ${savedChanges.length} deltas at (${x}, ${y})`);

    // Inject Immigrants
    const currentGlobalYear = getGlobalYear();
    const immigrants = savedChanges.filter(c => c.state_key === "immigrant_data");
    for (const imm of immigrants) {
        const data = JSON.parse(imm.state_value);

        // Reconstruct birthYear — support old deltas that only stored `age`
        const birthYear = data.birthYear
            ?? ((data.arrivedYear ?? currentGlobalYear) - (data.ageAtArrival ?? data.age));
        const effectiveAge = currentGlobalYear - birthYear;

        if (effectiveAge > MAX_NATURAL_LIFESPAN + MAX_LIFESPAN_VARIANCE) {
            log(`Skipped immigrant ${data.name}: died of old age (age ${effectiveAge})`);
            continue;
        }

        world.add({
            identity: Identity(data.name, "NPC", imm.entity_name),
            location: Location(x, y, townEntity),
            description: data.description,
            status: "Alive",
            currentRole: "Exile",
            age: effectiveAge,
            birthYear,
            history: { events: [] },
            knowledge: { memories: data.memories },
            inventory: { items: data.inventory },
            quests: Quests()
        });
        log(`Injected immigrant: ${data.name} (age ${effectiveAge})`);
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
                const raw = change.state_value;
                let historyEvent;
                if (typeof raw === 'string' && raw.charAt(0) !== '{') {
                    // Backward compat: legacy plain-string event stored before structured events
                    const yearMatch = raw.match(/\[Year (\d+)\]/);
                    historyEvent = {
                        id: 'ev_' + deterministicHash(raw),
                        year: yearMatch ? parseInt(yearMatch[1]) : 0,
                        description: raw,
                        type: 'legacy',
                        causedBy: null
                    };
                } else {
                    historyEvent = JSON.parse(raw);
                }
                entityToUpdate.history.events.push(historyEvent);
                log(`Appended history to ${entityToUpdate.identity.name}`);
            } else if (change.state_key === "personalWealth") {
                entityToUpdate.personalWealth = parseInt(change.state_value);
                log(`Applied personalWealth delta to ${entityToUpdate.identity.name}`);
            } else if (change.state_key === "merchantInventory") {
                entityToUpdate.merchantInventory = JSON.parse(change.state_value);
                log(`Applied merchantInventory delta to ${entityToUpdate.identity.name}`);
            } else if (change.state_key === "currentMayor") {
                // Districts always inherit currentMayor from their parent (set by loadAsDistrict).
                // Skipping the saved delta here prevents a stale 'Unknown' — written on a first
                // visit before the parent was ever loaded — from overwriting the correct value.
                if (entityToUpdate.identity.type !== "District") {
                    entityToUpdate.currentMayor = change.state_value;
                    log(`Applied currentMayor delta to ${entityToUpdate.identity.name}`);
                }
            } else {
                log(`Applying ${change.state_key} = ${change.state_value} to ${entityToUpdate.identity.name} (${entityToUpdate.identity.id})`);
                entityToUpdate[change.state_key] = change.state_value;
                log(`Applied ${change.state_key} delta to ${entityToUpdate.identity.name}`);
            }
        } else {
            log(`No entity found for delta: ${change.entity_name} ${change.state_key}`);
        }
    }

    // Seed trade partners for Tier 3+ towns that don't have them yet
    if (townEntity && townEntity.political?.tier >= 3 && townEntity.tradePartners && townEntity.tradePartners.length === 0) {
        const tradeRng = seedrandom(`${currentCoordinate}_trade`);
        const neighbors = getAdjacentTiles(x, y);
        const eligibleNeighbors = neighbors.filter(n => getTierForCoordinate(n.key) >= 2);
        const count = Math.min(eligibleNeighbors.length, Math.floor(tradeRng() * 3) + 1);
        townEntity.tradePartners = eligibleNeighbors.slice(0, count).map(n => n.key);
        log(`Seeded ${townEntity.tradePartners.length} trade partners for ${townEntity.identity.name}`);
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

    // Reconcile any NPC that simulation elevated to Mayor: their fate depends on how
    // this tile was conquered. Annexation = executed; Subjugation = demoted to Puppet;
    // organic expansion (no conquest delta) = demoted to Citizen.
    const districtDeltas = getDeltas(currentCoordinate);
    const conquestDelta = districtDeltas.find(d => d.entity_name === 'conquest' && d.state_key === 'conquest_type');
    const conquestType = conquestDelta ? conquestDelta.state_value : null;

    const localMayors = Array.from(
        world.with('identity', 'currentRole', 'status', 'location')
             .where(e => e.identity.type === 'NPC'
                      && e.currentRole === 'Mayor'
                      && e.status !== 'Dead'
                      && e.location.x === x && e.location.y === y)
    );
    for (const npc of localMayors) {
        if (conquestType === CONQUEST_TYPES.SUBJUGATION) {
            npc.currentRole = 'Puppet';
            saveDelta(currentCoordinate, npc.identity.id, 'currentRole', 'Puppet');
            districtEntity.history.events.push(makeEvent(
                `[Year 1] ${npc.identity.name} was reduced to a puppet administrator under ${parentCoordinate}.`,
                'subjugation'
            ));
        } else {
            npc.status = 'Dead';
            saveDelta(currentCoordinate, npc.identity.id, 'status', 'Dead');
            districtEntity.history.events.push(makeEvent(
                `[Year 1] ${npc.identity.name} was executed when ${districtEntity.identity.name} was annexed.`,
                'annexation'
            ));
        }
    }

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

    const entitiesAtLocation = Array.from(world.with('location').where(e => e.location.x === x && e.location.y === y));
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

    const npcs = world.with('identity', 'location').where(e =>
        e.location.x === x && e.location.y === y &&
        e.identity.type === "NPC"
    );

    const DEPARTED_STATUSES = new Set(['Migrated', 'Exiled']);
    const currentGlobalYear = getGlobalYear();
    const npcData = Array.from(npcs).map(npc => {
        const currentAge = npc.birthYear != null
            ? currentGlobalYear - npc.birthYear
            : npc.age;
        const isDeparted = DEPARTED_STATUSES.has(npc.status);
        const isDead = !isDeparted && (npc.status === 'Dead' || currentAge >= computeDeathAge(npc.identity.id));
        const retroDeathEvent = (isDead && npc.status !== 'Dead')
            ? [makeEvent(`[Year ${currentAge}] Died of old age.`, 'death')]
            : [];
        return {
            id: npc.identity.id,
            name: npc.identity.name,
            age: currentAge,
            role: npc.currentRole,
            sex: npc.sex ?? 'other',
            status: isDead && npc.status !== 'Dead' ? 'Dead' : npc.status,
            appearance: generateAppearance(npc.identity.id, currentAge, npc.currentRole, npc.biome || chunkBiome, isDead ? 'Dead' : npc.status, npc.sex),
            dead: isDead,
            inventory: npc.inventory ? npc.inventory.items : [],
            merchantInventory: npc.currentRole === 'Merchant' ? (npc.merchantInventory || []) : undefined,
            quests: npc.quests ? npc.quests.offeredQuests : [],
            history: [...(npc.history ? npc.history.events : []), ...retroDeathEvent],
            memories: npc.knowledge ? npc.knowledge.memories : {}
        };
    });

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

    const factionEntities = Array.from(world.with('identity', 'location').where(e =>
        e.identity.type === 'Faction' && e.location.x === x && e.location.y === y
    ));
    const factionSummary = factionEntities.map(f => ({
        id: f.identity.id,
        name: f.identity.name,
        type: f.factionType,
        memberCount: (f.members || []).length,
        foundedYear: f.foundedYear,
    }));

    const result = {
        globalYear: getGlobalYear(),
        coordinate: { x, y },
        town: townData,
        population: npcData,
        factions: factionSummary,
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
    try {
        loadCoordinate(x, y);
        const chunkData = serializeChunk(x, y);
        const coordinateString = `world_X${x}_Y${y}`;
        const visitSettlementName = chunkData.town?.name ?? coordinateString;
        appendJournalEntry({
            year: chunkData.globalYear,
            action: 'visit',
            coordinate: coordinateString,
            summary: `Visited ${visitSettlementName}`,
            detail: { settlementName: visitSettlementName }
        });
        unloadCoordinate(x, y);
        log(`API response: chunk data sent`);
        res.json(chunkData);
    } catch (err) {
        unloadCoordinate(x, y);
        log(`Chunk load error at (${x}, ${y}): ${err.message}`);
        res.status(500).json({ error: err.message, code: 'CHUNK_LOAD_ERROR' });
    }
});

function handleAction(req, res, actionFunction) {
    log(`handleAction called for ${actionFunction.name}`);
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
    log('POST /api/action/assassinate received');
    handleAction(req, res, actions.assassinate);
});
app.post('/api/action/claim', (req, res) => handleAction(req, res, actions.claimThrone));

app.post('/api/action/tax', (req, res) => handleAction(req, res, actions.taxTown));
app.post('/api/action/abdicate', (req, res) => handleAction(req, res, actions.abdicate));
app.post('/api/action/banish', (req, res) => handleAction(req, res, actions.banish));
app.post('/api/action/decree', (req, res) => handleAction(req, res, actions.decree));
app.post('/api/action/loot_tomb', (req, res) => handleAction(req, res, actions.lootTomb));
app.post('/api/action/regicide', (req, res) => {
    const { x: xStr, y: yStr, target, weaponTier, playerState } = req.body;
    const x = parseInt(xStr);
    const y = parseInt(yStr);
    if (isNaN(x) || isNaN(y)) return res.status(400).json({ error: 'Invalid x or y coordinate.' });
    const coordinateString = `world_X${x}_Y${y}`;
    if (!playerState.titles) playerState.titles = {};
    try {
        loadCoordinate(x, y);
        const result = actions.regicide(world, coordinateString, target, weaponTier || 0, playerState);
        if (result.success) {
            const chunkData = serializeChunk(x, y);
            unloadCoordinate(x, y);
            res.json({ message: result.message, playerState, chunkData });
        } else {
            unloadCoordinate(x, y);
            res.status(400).json({ error: result.message, playerState });
        }
    } catch (err) {
        unloadCoordinate(x, y);
        log(`Regicide error: ${err.message}`);
        res.status(500).json({ error: err.message, code: 'REGICIDE_ERROR' });
    }
});



app.post('/api/trade', (req, res) => {
    const { x: xStr, y: yStr, npcId, playerState, transaction } = req.body;
    if (!npcId || !playerState || !transaction) {
        return res.status(400).json({ error: 'Missing required fields: npcId, playerState, transaction', code: 'INVALID_REQUEST' });
    }
    const x = parseInt(xStr);
    const y = parseInt(yStr);
    if (isNaN(x) || isNaN(y)) return res.status(400).json({ error: 'Invalid x or y coordinate.', code: 'INVALID_REQUEST' });
    const coordinate = `world_X${x}_Y${y}`;

    try {
        loadCoordinate(x, y);
        const result = actions.executeTrade(world, coordinate, npcId, transaction, playerState);
        unloadCoordinate(x, y);

        if (!result.success) {
            return res.status(result.status || 400).json({ error: result.message, playerState });
        }

        res.json({ playerState, npcInventory: result.npcInventory, event: result.event });
    } catch (err) {
        unloadCoordinate(x, y);
        log(`Trade error: ${err.message}`);
        res.status(500).json({ error: err.message, code: 'TRADE_ERROR' });
    }
});

// 2. Update the endpoint to securely pass the new year
app.post('/api/action/advance_time', (req, res) => {
    const { x, y, years } = req.body;
    const yearsToAdd = parseInt(years) || 0;
    
    const currentYear = getGlobalYear();
    const newYear = currentYear + yearsToAdd;

    log(`API request: POST /api/action/advance_time, advancing to year ${newYear}`);
    saveDelta("GLOBAL", "Time", "currentYear", newYear.toString());

    const advanceCoordinateString = `world_X${parseInt(x) || 0}_Y${parseInt(y) || 0}`;
    appendJournalEntry({
        year: newYear,
        action: 'advance_time',
        coordinate: advanceCoordinateString,
        summary: `Skipped ${yearsToAdd} years (Year ${currentYear} → ${newYear})`,
        detail: { fromYear: currentYear, toYear: newYear, yearsSkipped: yearsToAdd }
    });

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
    try {
        loadCoordinate(x, y);

        // Gather all entities with a history
        const entities = Array.from(world.with('identity', 'history').where(e => e.location.x === x && e.location.y === y));

        let allEvents = [];
        const yearRegex = /\[Year (\d+)\] (.*)/;

        for (const entity of entities) {
            for (const ev of entity.history.events) {
                if (typeof ev === 'string') {
                    // Legacy plain-string event (pre-structured-events data)
                    const match = ev.match(yearRegex);
                    if (match) {
                        allEvents.push({
                            year: parseInt(match[1]),
                            actor: entity.identity.name,
                            text: match[2],
                            id: null,
                            type: 'legacy',
                            causedBy: null
                        });
                    }
                } else {
                    allEvents.push({
                        year: ev.year,
                        actor: entity.identity.name,
                        text: ev.description.replace(/^\[Year \d+\]\s*/, ''),
                        id: ev.id,
                        type: ev.type,
                        causedBy: ev.causedBy
                    });
                }
            }
        }

        // Sort chronologically
        allEvents.sort((a, b) => a.year - b.year);

        // Group by year; entries are objects (id, actor, text, type, causedBy)
        let chronicle = {};
        for (const ev of allEvents) {
            if (!chronicle[`Year ${ev.year}`]) chronicle[`Year ${ev.year}`] = [];
            chronicle[`Year ${ev.year}`].push({ id: ev.id, actor: ev.actor, text: ev.text, type: ev.type, causedBy: ev.causedBy });
        }

        unloadCoordinate(x, y);

        log(`Chronicle generated with ${allEvents.length} events`);
        res.json({
            title: `The Chronicles of Coordinate ${x}, ${y}`,
            timeline: chronicle
        });
    } catch (err) {
        unloadCoordinate(x, y);
        log(`Chronicle error at (${x}, ${y}): ${err.message}`);
        res.status(500).json({ error: err.message, code: 'CHRONICLE_ERROR' });
    }
});

// --- LINEAGE ENDPOINT ---
app.get('/api/chunk/:x/:y/lineage', (req, res) => {
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);
    log(`API request: GET /api/chunk/${x}/${y}/lineage`);
    try {
        loadCoordinate(x, y);

        const factions = Array.from(world.with('identity', 'location').where(e =>
            e.identity.type === 'Faction' && e.location.x === x && e.location.y === y
        ));

        // Include dead NPCs — they still hold ancestralMemories needed for chain traversal
        const allNpcs = Array.from(world.with('identity', 'location').where(e =>
            e.identity.type === 'NPC' && e.location.x === x && e.location.y === y
        ));
        const npcIndex = Object.fromEntries(allNpcs.map(n => [n.identity.id, n]));

        function rebuildChain(startNpcId, memType, targetLineage) {
            const chain = [];
            let currentId = startNpcId;
            const visited = new Set();
            while (currentId && !visited.has(currentId)) {
                visited.add(currentId);
                const npc = npcIndex[currentId];
                if (!npc) break;
                const mem = (npc.ancestralMemories || []).find(
                    am => am.type === memType && am.targetLineage === targetLineage
                );
                chain.unshift({
                    npcId: npc.identity.id,
                    npcName: npc.identity.name,
                    year: mem?.originYear ?? null,
                    status: npc.status,
                });
                currentId = mem?.inheritedFrom?.npcId ?? null;
            }
            return chain;
        }

        const payload = factions.map(faction => ({
            id: faction.identity.id,
            name: faction.identity.name,
            type: faction.factionType,
            targetLineage: faction.targetLineage,
            foundedYear: faction.foundedYear,
            rootAncestor: faction.rootAncestor,
            members: (faction.members || []).map(npcId => {
                const npc = npcIndex[npcId];
                if (!npc) return { npcId, npcName: 'Unknown', currentRole: null, status: null, inheritanceChain: [] };
                return {
                    npcId,
                    npcName: npc.identity.name,
                    currentRole: npc.currentRole,
                    status: npc.status,
                    inheritanceChain: rebuildChain(npcId, faction.factionType, faction.targetLineage),
                };
            }),
        }));

        unloadCoordinate(x, y);
        log(`Lineage generated with ${factions.length} factions`);
        res.json({ coordinate: `world_X${x}_Y${y}`, factions: payload });
    } catch (err) {
        unloadCoordinate(x, y);
        log(`Lineage error at (${x}, ${y}): ${err.message}`);
        res.status(500).json({ error: err.message, code: 'LINEAGE_ERROR' });
    }
});

// --- TRAVELER'S JOURNAL ---
const JOURNAL_MAX_LIMIT = 500;

app.get('/api/journal', (req, res) => {
    const { coordinate, npcId, itemId, fromYear, toYear, limit } = req.query;
    const filters = {};
    if (coordinate) filters.coordinate = coordinate;
    if (npcId)      filters.npcId = npcId;
    if (itemId)     filters.itemId = itemId;
    if (fromYear)   filters.fromYear = parseInt(fromYear);
    if (toYear)     filters.toYear = parseInt(toYear);
    if (limit)      filters.limit = Math.min(parseInt(limit), JOURNAL_MAX_LIMIT);

    try {
        const { entries, total } = getJournal(filters);
        const shaped = entries.map(e => ({
            id:             e.id,
            year:           e.year,
            action:         e.action,
            coordinate:     e.coordinate,
            settlementName: e.detail?.settlementName ?? null,
            npcId:          e.npcId,
            npcName:        e.detail?.npcName ?? null,
            itemId:         e.itemId,
            summary:        e.summary,
            detail:         e.detail,
        }));
        log(`GET /api/journal returned ${entries.length} of ${total} entries`);
        res.json({ entries: shaped, total });
    } catch (err) {
        log(`Journal error: ${err.message}`);
        res.status(500).json({ error: err.message, code: 'JOURNAL_ERROR' });
    }
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
    try {
        loadCoordinate(x, y);
        const chunkData = serializeChunk(x, y);
        unloadCoordinate(x, y);
        res.json(chunkData);
    } catch (err) {
        unloadCoordinate(x, y);
        log(`Coordinate load error at (${x}, ${y}): ${err.message}`);
        res.status(500).json({ error: err.message, code: 'COORDINATE_LOAD_ERROR' });
    }
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
    try {
        const result = executeActionByType(actionType, coordinateString, target, item, itemId, newRole, playerState, xInt, yInt);
        if (result.success) {
            res.json({ message: result.message, playerState: result.playerState, chunkData: result.chunkData });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (err) {
        log(`Action dispatch error for ${actionType}: ${err.message}`);
        res.status(500).json({ error: err.message, code: 'ACTION_DISPATCH_ERROR' });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        log(`🚀 Weaver RPG Engine API running at http://localhost:${port}`);
        console.log(`🚀 Weaver RPG Engine API running at http://localhost:${port}`);
    });
}

module.exports = { app, loadCoordinate, serializeChunk, unloadCoordinate };