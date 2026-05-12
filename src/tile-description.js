// src/tile-description.js
const seedrandom = require('seedrandom');

// --- Discrete lists ---

const SIZES = ['hamlet', 'small', 'modest', 'large', 'sprawling'];

const ATMOSPHERES = ['peaceful', 'bustling', 'tense', 'grim', 'festive', 'desolate', 'prosperous'];

const WALLS = ['none', 'timber palisade', 'stone walls', 'reinforced gatehouse', 'fortress ramparts'];

const LANDMARKS = [
    'crumbling watchtower', 'ancient well', 'market square', 'great oak', 'standing stones',
    'ruined temple', 'ornate fountain', 'execution platform', 'guild hall', 'memorial statue',
    'scorched pit', 'dried-up well', 'overgrown shrine'
];

// 'Plains' (biomes.js) and 'Wilderness' (map.js) are the same terrain class —
// both biome-assignment functions exist in this codebase; handle both.
const SURROUNDINGS = {
    Forest:    ['dense canopy', 'ancient oaks', 'pine thicket', 'mossy clearings'],
    Mountain:  ['jagged peaks', 'rocky outcrops', 'narrow passes', 'alpine meadow'],
    Desert:    ['drifting sands', 'rocky plateau', 'salt flats', 'dry riverbed'],
    Marsh:     ['murky wetlands', 'reed beds', 'boggy ground', 'shallow flood plain'],
    Plains:    ['rolling hills', 'open plains', 'scrubland', 'dark thicket'],
    Wilderness:['rolling hills', 'open plains', 'scrubland', 'dark thicket'],
};

const TERRAIN = {
    Forest:    'dense woodland',
    Mountain:  'jagged peaks',
    Desert:    'open desert',
    Marsh:     'murky wetlands',
    Plains:    'rolling hills',
    Wilderness:'rolling hills',
};

const VEGETATION = {
    Forest:    'pine thicket',
    Mountain:  'sparse scrub',
    Desert:    'cacti and dust',
    Marsh:     'reed beds',
    Plains:    'lush meadow',
    Wilderness:'lush meadow',
};

// tier index 0 unused; index 1–5 match settlement tiers
const SETTLEMENT_SILHOUETTE = [null, 'village', 'walled town', 'small city', 'fortified city', 'capital citadel'];

const ROLE_TO_BUILDING = {
    Mayor:     'town hall',
    Guard:     'guard tower',
    Blacksmith:'forge',
    Merchant:  'trading post',
    Scholar:   'library',
    Citizen:   'cottage row',
    Beggar:    'makeshift shelter',
    Cultist:   'hidden shrine',
    Bandit:    'hideout',
    Exile:     'shack',
};

const DISTRICT_OVERLAY_BUILDING = {
    Market:   'market square',
    Keep:     'armory',
    Barracks: 'training ground',
    Temple:   'processional path',
    Slums:    'tenement block',
};

// --- Derivation helpers ---

function getSize(population) {
    if (population < 5)  return 'hamlet';
    if (population < 10) return 'small';
    if (population < 15) return 'modest';
    if (population <= 20) return 'large';
    return 'sprawling';
}

function getAtmosphere(stance, tier) {
    const isHighTier = tier >= 3;
    switch (stance) {
        case 'Aggressive': return isHighTier ? 'grim'        : 'tense';
        case 'Federation': return isHighTier ? 'prosperous'  : 'bustling';
        case 'Occult':     return isHighTier ? 'grim'        : 'desolate';
        default:           return isHighTier ? 'festive'     : 'peaceful'; // Balanced
    }
}

function getWalls(tier, population) {
    if (tier >= 4) return 'fortress ramparts';
    if (tier === 3) return 'reinforced gatehouse';
    if (tier === 2) return 'stone walls';
    // tier 1
    return population < 5 ? 'none' : 'timber palisade';
}

function getStreets(biome, tier) {
    if (biome === 'Mountain') return 'stone-paved';
    if (biome === 'Desert')   return tier >= 3 ? 'sand-swept'       : 'dirt path';
    if (biome === 'Marsh')    return tier >= 3 ? 'wooden boardwalk' : 'muddy cobblestone';
    if (biome === 'Forest')   return 'muddy cobblestone';
    // Plains / Wilderness
    return 'dirt path';
}

function getBuildingCondition(tier, population) {
    if (tier >= 4) return 'grand';
    if (tier === 3) return 'sturdy';
    if (tier === 2) return 'modest';
    return population < 5 ? 'derelict' : 'weathered';
}

// npcs: array of serialized NPC objects with a `role` field (from serializeChunk)
function deriveBuildingsFromNpcs(npcs, tier, population, districtType) {
    const condition = getBuildingCondition(tier, population);
    const seenRoles = new Set();
    const buildings = [];

    const childCount = npcs.filter(n => n.role === 'Child').length;

    for (const npc of npcs) {
        const role = npc.role;
        if (!role || seenRoles.has(role)) continue;
        seenRoles.add(role);

        if (role === 'Child') {
            if (childCount >= 3) buildings.push({ type: 'schoolhouse', condition });
            continue;
        }

        const buildingType = ROLE_TO_BUILDING[role];
        if (buildingType) buildings.push({ type: buildingType, condition });
    }

    if (districtType && DISTRICT_OVERLAY_BUILDING[districtType]) {
        buildings.push({ type: DISTRICT_OVERLAY_BUILDING[districtType], condition });
    }

    return buildings;
}

// --- Public API ---

/**
 * Full tile description for chunk responses. Seeded from coordinate for landmark
 * and surroundings; other fields derived from live NPC/town state.
 *
 * @param {object} town  - Serialized town object from serializeChunk
 * @param {Array}  npcs  - Serialized NPC array from serializeChunk (each has `role`)
 * @param {string} biome - Biome string (Plains/Mountain/Forest/Desert/Marsh/Wilderness)
 * @param {number} x
 * @param {number} y
 * @returns {object}
 */
function generateTileDescription(town, npcs, biome, x, y) {
    const rng  = seedrandom(`tile_desc_X${x}_Y${y}`);

    const tier       = town?.tier || 1;
    const population = town?.population != null ? town.population : npcs.length;
    const stance     = town?.politicalStance || 'Balanced';
    const districtType = town?.districtType || null;

    const surroundingsList = SURROUNDINGS[biome] || SURROUNDINGS.Plains;
    const surroundings = surroundingsList[Math.floor(rng() * surroundingsList.length)];
    const landmark     = LANDMARKS[Math.floor(rng() * LANDMARKS.length)];

    return {
        size:        getSize(population),
        atmosphere:  getAtmosphere(stance, tier),
        walls:       getWalls(tier, population),
        streets:     getStreets(biome, tier),
        surroundings,
        landmark,
        buildings:   deriveBuildingsFromNpcs(npcs, tier, population, districtType),
    };
}

/**
 * Light tile description for map responses. Pure math — no ECS, no NPC data.
 *
 * @param {string} biome - Biome string
 * @param {number} tier  - Settlement tier (1–5)
 * @returns {object}
 */
function generateTileLightDescription(biome, tier) {
    return {
        terrain:              TERRAIN[biome]              || TERRAIN.Plains,
        vegetation:           VEGETATION[biome]           || VEGETATION.Plains,
        settlementSilhouette: SETTLEMENT_SILHOUETTE[Math.min(tier, 5)] || 'village',
    };
}

module.exports = {
    generateTileDescription,
    generateTileLightDescription,
    // Export constants so tests can validate allowed values
    SIZES,
    ATMOSPHERES,
    WALLS,
    LANDMARKS,
    SURROUNDINGS,
    TERRAIN,
    VEGETATION,
    SETTLEMENT_SILHOUETTE,
    ROLE_TO_BUILDING,
    DISTRICT_OVERLAY_BUILDING,
};
