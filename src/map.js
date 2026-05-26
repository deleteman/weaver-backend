// src/map.js
const seedrandom = require('seedrandom');
const { generateText } = require('./grammar');
const { getDeltas, getGlobalYear, getParentCity } = require('./db');
const { generateTileLightDescription } = require('./tile-description');

/**
 * Biome definitions based on coordinate offset
 * Used to deterministically assign terrain types to each tile
 */
const BIOME_TYPES = ['Wilderness', 'Forest', 'Desert', 'Mountain', 'Marsh'];

/**
 * Deterministically generates a biome for a given coordinate
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {string} - One of the BIOME_TYPES
 */
function determineBiome(x, y) {
    const seed = `biome_X${x}_Y${y}`;
    const rng = seedrandom(seed);
    const biomeIndex = Math.floor(rng() * BIOME_TYPES.length);
    return BIOME_TYPES[biomeIndex];
}

/**
 * Generates a town name deterministically for a coordinate
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {string} - Procedurally generated town name
 */
function generateTownName(x, y) {
    const seed = `world_X${x}_Y${y}`;
    const rng = seedrandom(seed);
    return generateText(rng, "#townName#");
}

/**
 * Estimates settlement tier for coordinates never visited, based on global time.
 * Uses a dedicated seed so it doesn't interfere with the main simulation RNG chain.
 *
 * Each settlement has a seeded growth ceiling so most of the map stays as towns
 * and only a minority become high-tier settlements — matching realistic world design:
 *   ~50% Town (tier 1), ~25% SmallCity, ~13% FullCity, ~7% Magistrate, ~5% Kingdom
 */
function estimateTierFromTime(x, y, globalYear = null) {
    const year = globalYear !== null ? globalYear : getGlobalYear();
    if (year <= 0) return 1;

    const seed = `tier_estimate_X${x}_Y${y}`;
    const rng = seedrandom(seed);

    // Seeded growth ceiling: most settlements never exceed tier 1–2
    const potentialRoll = rng();
    const maxTier = potentialRoll < 0.50 ? 1 :
                    potentialRoll < 0.75 ? 2 :
                    potentialRoll < 0.88 ? 3 :
                    potentialRoll < 0.95 ? 4 : 5;

    // Seeded maturation window: how many years to reach maxTier (50–300)
    const maturationYear = 50 + Math.floor(rng() * 251);

    if (year >= maturationYear) return maxTier;

    // Graduated progression toward maxTier before maturation
    return Math.max(1, Math.ceil(maxTier * (year / maturationYear)));
}

/**
 * Gets the current ruler and tier of a town at a coordinate.
 * For visited coordinates, reads from the delta DB. For unvisited coordinates,
 * estimates tier from global time and the coordinate seed.
 *
 * District tiles never store a currentMayor delta of their own (unloadCoordinate
 * intentionally skips it to avoid stale overwrite of the parent's authoritative value).
 * When no currentMayor delta is found, we fall back to the parent city's delta via
 * getParentCity. We also force tier = 1 for districts so they don't masquerade as
 * high-tier owners in computeOwnership and incorrectly claim territory.
 */
function getTownRulerAndTier(x, y) {
    const currentCoordinate = `world_X${x}_Y${y}`;
    const deltas = getDeltas(currentCoordinate);

    const mayorDelta = deltas.find(d => d.state_key === 'currentMayor');
    const politicalDelta = deltas.find(d => d.state_key === 'political');

    // Detect district tiles: they have a DB-confirmed parent city written by unloadCoordinate.
    const parentCoordinate = getParentCity(currentCoordinate);

    let ruler = 'Unknown';
    if (mayorDelta) {
        ruler = mayorDelta.state_value;
    } else if (parentCoordinate) {
        const parentDeltas = getDeltas(parentCoordinate);
        const parentMayorDelta = parentDeltas.find(d => d.state_key === 'currentMayor');
        if (parentMayorDelta) ruler = parentMayorDelta.state_value;
    }

    let tier;
    if (politicalDelta) {
        try {
            const political = JSON.parse(politicalDelta.state_value);
            // Districts inherit the parent's tier in their political delta, but must never
            // act as high-tier territory owners in computeOwnership — force tier 1.
            const effectiveTier = parentCoordinate ? 1 : (political.tier || 1);
            tier = parentCoordinate ? 1 : Math.max(effectiveTier, estimateTierFromTime(x, y));
        } catch (e) {
            tier = estimateTierFromTime(x, y);
        }
    } else {
        tier = estimateTierFromTime(x, y);
    }

    return { ruler, tier, isDbConfirmed: !!politicalDelta };
}

// Settlement tier names for display — module-level so computeOwnership can reuse them
const TIER_NAMES = ['Unknown', 'Town', 'SmallCity', 'FullCity', 'Magistrate', 'Kingdom'];

/**
 * Generates metadata for a single tile without running full simulation
 * @param {number} x - X coordinate of the tile
 * @param {number} y - Y coordinate of the tile
 * @param {Set} discoveredCoordinates - Set of coordinates the player has visited
 * @returns {object} - Tile metadata
 */
function generateTileMetadata(x, y, discoveredCoordinates = new Set()) {
    const biome = determineBiome(x, y);
    const townName = generateTownName(x, y);
    const { ruler, tier, isDbConfirmed } = getTownRulerAndTier(x, y);
    const isDiscovered = discoveredCoordinates.has(`${x},${y}`);

    const settlementType = TIER_NAMES[tier] || 'Town';

    // Territory size based on tier (used by UI for rendering)
    const territoryRadius = {
        1: 1,  // Town: 1x1
        2: 2,  // SmallCity: 2x2
        3: 3,  // FullCity: 3x3
        4: 5,  // Magistrate: 5x5
        5: 7   // Kingdom: 7x7
    }[tier] || 1;
    
    return {
        x,
        y,
        biome,
        hasTown: true,
        townName,
        ruler,
        tier,
        isDbConfirmed,
        settlementType,
        territoryRadius,
        isDiscovered,
        tileDescription: generateTileLightDescription(biome, tier),
    };
}

// Chebyshev radius a settlement of each tier can claim beyond its own tile.
// Derived from the full widths in politics.js (floor(width / 2)):
//   Town 1×1 → 0, SmallCity 2×2 → 1, FullCity 3×3 → 1,
//   Magistrate 5×5 → 2, Kingdom 7×7 → 3
const CLAIM_RADIUS_BY_TIER = { 1: 0, 2: 1, 3: 1, 4: 2, 5: 3 };

// District flavour types — must match the list in loadAsDistrict() in index.js
// (same seed "district_type_X${x}_Y${y}" is used in both places)
const DISTRICT_TYPES = ['Market', 'Slums', 'Keep', 'Barracks', 'Temple'];

/**
 * Annotates each tile with the coordinate of the settlement that controls it.
 * A settlement controls a tile if the tile falls within its claim radius AND
 * no other settlement with a higher tier (or equal tier closer to the tile) also
 * reaches it. Operates purely on the already-assembled grid — no extra DB reads.
 */
function computeOwnership(grid) {
    return grid.map(tile => {
        let owner = null;
        let ownerDist = Infinity;

        for (const candidate of grid) {
            // Only DB-confirmed (visited) tiles can act as owners — matches findEstimatedParent()
            if (!candidate.isDbConfirmed) continue;
            const claimRadius = CLAIM_RADIUS_BY_TIER[candidate.tier] || 0;
            const dist = Math.max(
                Math.abs(tile.x - candidate.x),
                Math.abs(tile.y - candidate.y)
            );

            if (dist > claimRadius) continue;

            const beats =
                owner === null ||
                candidate.tier > owner.tier ||
                (candidate.tier === owner.tier && dist < ownerDist) ||
                (candidate.tier === owner.tier && dist === ownerDist &&
                    (candidate.x < owner.x || (candidate.x === owner.x && candidate.y < owner.y)));

            if (beats) {
                owner = candidate;
                ownerDist = dist;
            }
        }

        if (!owner) owner = tile;

        const isSovereign = (owner.x === tile.x && owner.y === tile.y);

        if (isSovereign) {
            return { ...tile, claimedBy: null, claimedByName: null, districtType: null };
        }

        // Tile is a district — derive flavour from the same seed as loadAsDistrict()
        const districtTypeRng = seedrandom(`district_type_X${tile.x}_Y${tile.y}`);
        const districtType = DISTRICT_TYPES[Math.floor(districtTypeRng() * DISTRICT_TYPES.length)];

        return {
            ...tile,
            // Districts are subordinate settlements — override inflated coordinate-seed tier
            tier: 1,
            settlementType: TIER_NAMES[1],
            territoryRadius: 1,
            // Claimed tiles inherit the controlling settlement's ruler so the
            // frontend shows one consistent ruler across an entire territory.
            ruler: owner.ruler,
            claimedBy: `world_X${owner.x}_Y${owner.y}`,
            claimedByName: owner.townName,
            districtType
        };
    });
}

/**
 * Generates a mini-map grid centered on the player's coordinate
 * @param {number} centerX - Player's current X coordinate
 * @param {number} centerY - Player's current Y coordinate
 * @param {number} radius - Radius of the mini-map (1 = 3x3, 2 = 5x5)
 * @param {Set} discoveredCoordinates - Optional set of discovered coordinates for marking
 * @returns {object} - Mini-map data including grid and center tile
 */
function generateMiniMap(centerX, centerY, radius = 1, discoveredCoordinates = new Set()) {
    const tiles = [];

    for (let x = centerX - radius; x <= centerX + radius; x++) {
        for (let y = centerY - radius; y <= centerY + radius; y++) {
            tiles.push(generateTileMetadata(x, y, discoveredCoordinates));
        }
    }

    const grid = computeOwnership(tiles);
    const centerTile = grid.find(t => t.x === centerX && t.y === centerY);

    return {
        center: centerTile,
        grid,
        radius,
        gridSize: (radius * 2 + 1)
    };
}

function getAdjacentTiles(x, y) {
    return [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy]) => ({
        x: x + dx,
        y: y + dy,
        key: `world_X${x + dx}_Y${y + dy}`
    }));
}

module.exports = {
    determineBiome,
    generateTownName,
    getTownRulerAndTier,
    generateTileMetadata,
    computeOwnership,
    generateMiniMap,
    estimateTierFromTime,
    getAdjacentTiles,
    BIOME_TYPES,
    CLAIM_RADIUS_BY_TIER,
    DISTRICT_TYPES,
    TIER_NAMES,
};
