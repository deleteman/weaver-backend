const {
    generateTileDescription,
    generateTileLightDescription,
    SIZES,
    ATMOSPHERES,
    WALLS,
    WALLS_BY_TIER,
    LANDMARKS,
    SURROUNDINGS,
    TERRAIN,
    VEGETATION,
    SETTLEMENT_SILHOUETTE,
    ROLE_TO_BUILDING,
    DISTRICT_OVERLAY_BUILDING,
} = require('./tile-description');

// Helpers
function makeTown(overrides = {}) {
    return {
        name: 'Testville',
        type: 'Town',
        districtType: null,
        parentCity: null,
        ruler: 'Alice',
        tier: 1,
        population: 8,
        history: [],
        politicalStance: 'Balanced',
        ...overrides,
    };
}

function makeNpc(role) {
    return { id: 'abc', name: 'NPC', age: 30, role, status: 'Alive', dead: false };
}

const BIOMES = ['Plains', 'Forest', 'Mountain', 'Desert', 'Marsh'];

// --- generateTileDescription ---

describe('generateTileDescription — determinism', () => {
    test('same inputs always produce the same output', () => {
        const town = makeTown();
        const npcs = [makeNpc('Guard'), makeNpc('Citizen')];
        const a = generateTileDescription(town, npcs, 'Plains', 5, 5);
        const b = generateTileDescription(town, npcs, 'Plains', 5, 5);
        expect(a).toEqual(b);
    });

    test('different coordinates produce different landmark / surroundings', () => {
        const town = makeTown();
        const npcs = [makeNpc('Guard')];
        const a = generateTileDescription(town, npcs, 'Plains', 0, 0);
        const b = generateTileDescription(town, npcs, 'Plains', 99, 99);
        // At least one of the seeded fields should differ
        const differ = a.landmark !== b.landmark || a.surroundings !== b.surroundings;
        expect(differ).toBe(true);
    });
});

describe('generateTileDescription — size', () => {
    const cases = [
        [0, 'hamlet'], [4, 'hamlet'],
        [5, 'small'],  [9, 'small'],
        [10, 'modest'], [14, 'modest'],
        [15, 'large'],  [20, 'large'],
        [21, 'sprawling'], [50, 'sprawling'],
    ];
    test.each(cases)('population %d → size "%s"', (pop, expected) => {
        const town = makeTown({ population: pop });
        const result = generateTileDescription(town, [], 'Plains', 1, 1);
        expect(result.size).toBe(expected);
    });
});

describe('generateTileDescription — atmosphere', () => {
    const cases = [
        ['Aggressive', 1, 'tense'],
        ['Aggressive', 3, 'grim'],
        ['Federation', 2, 'bustling'],
        ['Federation', 4, 'prosperous'],
        ['Occult',     1, 'desolate'],
        ['Occult',     5, 'grim'],
        ['Balanced',   2, 'peaceful'],
        ['Balanced',   3, 'festive'],
    ];
    test.each(cases)('stance=%s tier=%d → atmosphere "%s"', (stance, tier, expected) => {
        const town = makeTown({ politicalStance: stance, tier });
        const result = generateTileDescription(town, [], 'Plains', 1, 1);
        expect(result.atmosphere).toBe(expected);
    });
});

describe('generateTileDescription — walls', () => {
    const ALL_BIOMES = ['Plains', 'Forest', 'Mountain', 'Desert', 'Marsh'];

    test('walls value is always in WALLS allowlist across all tier/pop/biome combinations', () => {
        for (const biome of ALL_BIOMES) {
            for (let tier = 1; tier <= 5; tier++) {
                for (const pop of [2, 8]) {
                    const result = generateTileDescription(
                        makeTown({ tier, population: pop }), [], biome, 1, 1
                    );
                    expect(WALLS).toContain(result.walls);
                }
            }
        }
    });

    test('walls is deterministic — same coordinate always returns same value', () => {
        const town = makeTown({ tier: 1, population: 8 });
        const a = generateTileDescription(town, [], 'Forest', 7, 13);
        const b = generateTileDescription(town, [], 'Forest', 7, 13);
        expect(a.walls).toBe(b.walls);
    });

    test('walls vary across different coordinates at the same tier and biome', () => {
        const walls = new Set();
        for (let x = 0; x < 30; x++) {
            const result = generateTileDescription(
                makeTown({ tier: 1, population: 8 }), [], 'Plains', x, x * 3
            );
            walls.add(result.walls);
        }
        expect(walls.size).toBeGreaterThan(1);
    });

    test('tier 1 low-pop walls never appear when population >= 5', () => {
        const lowPopPool = [
            ...WALLS_BY_TIER['1_low'].default,
            ...Object.values(WALLS_BY_TIER['1_low']).flat(),
        ];
        const anyPopPool = [
            ...WALLS_BY_TIER['1_any'].default,
            ...Object.values(WALLS_BY_TIER['1_any']).flat(),
        ];
        // Values exclusive to 1_low (not present in 1_any)
        const exclusiveLowPop = lowPopPool.filter(v => !anyPopPool.includes(v));
        for (let x = 0; x < 30; x++) {
            const result = generateTileDescription(
                makeTown({ tier: 1, population: 8 }), [], 'Plains', x, x
            );
            expect(exclusiveLowPop).not.toContain(result.walls);
        }
    });

    test('tier 1 high-pop walls never appear when population < 5', () => {
        const lowPopPool = [
            ...WALLS_BY_TIER['1_low'].default,
            ...Object.values(WALLS_BY_TIER['1_low']).flat(),
        ];
        const anyPopPool = [
            ...WALLS_BY_TIER['1_any'].default,
            ...Object.values(WALLS_BY_TIER['1_any']).flat(),
        ];
        // Values exclusive to 1_any (not present in 1_low)
        const exclusiveHighPop = anyPopPool.filter(v => !lowPopPool.includes(v));
        for (let x = 0; x < 30; x++) {
            const result = generateTileDescription(
                makeTown({ tier: 1, population: 2 }), [], 'Plains', x, x
            );
            expect(exclusiveHighPop).not.toContain(result.walls);
        }
    });

    test('Mountain biome tier 2 walls always come from the Mountain pool', () => {
        const mountainPool = WALLS_BY_TIER['2']['Mountain'];
        for (let x = 0; x < 20; x++) {
            const result = generateTileDescription(
                makeTown({ tier: 2, population: 10 }), [], 'Mountain', x, x * 7
            );
            expect(mountainPool).toContain(result.walls);
        }
    });
});

describe('generateTileDescription — streets', () => {
    test('Mountain → stone-paved', () => {
        const result = generateTileDescription(makeTown(), [], 'Mountain', 1, 1);
        expect(result.streets).toBe('stone-paved');
    });
    test('Desert tier 1 → dirt path', () => {
        const result = generateTileDescription(makeTown({ tier: 1 }), [], 'Desert', 1, 1);
        expect(result.streets).toBe('dirt path');
    });
    test('Desert tier 3 → sand-swept', () => {
        const result = generateTileDescription(makeTown({ tier: 3 }), [], 'Desert', 1, 1);
        expect(result.streets).toBe('sand-swept');
    });
    test('Marsh tier 1 → muddy cobblestone', () => {
        const result = generateTileDescription(makeTown({ tier: 1 }), [], 'Marsh', 1, 1);
        expect(result.streets).toBe('muddy cobblestone');
    });
    test('Marsh tier 3 → wooden boardwalk', () => {
        const result = generateTileDescription(makeTown({ tier: 3 }), [], 'Marsh', 1, 1);
        expect(result.streets).toBe('wooden boardwalk');
    });
    test('Forest → muddy cobblestone', () => {
        const result = generateTileDescription(makeTown(), [], 'Forest', 1, 1);
        expect(result.streets).toBe('muddy cobblestone');
    });
    test('Plains → dirt path', () => {
        const result = generateTileDescription(makeTown(), [], 'Plains', 1, 1);
        expect(result.streets).toBe('dirt path');
    });
    test('Wilderness → dirt path', () => {
        const result = generateTileDescription(makeTown(), [], 'Wilderness', 1, 1);
        expect(result.streets).toBe('dirt path');
    });
});

describe('generateTileDescription — surroundings and landmark are valid discrete values', () => {
    test.each(BIOMES)('biome %s yields valid surroundings', (biome) => {
        const result = generateTileDescription(makeTown(), [], biome, 3, 3);
        expect(SURROUNDINGS[biome]).toContain(result.surroundings);
    });

    test('landmark is always from the allowed list', () => {
        for (let coord = 0; coord < 20; coord++) {
            const result = generateTileDescription(makeTown(), [], 'Plains', coord, coord);
            expect(LANDMARKS).toContain(result.landmark);
        }
    });
});

describe('generateTileDescription — buildings from NPC roles', () => {
    test('each unique role produces one building', () => {
        const npcs = [makeNpc('Mayor'), makeNpc('Guard'), makeNpc('Blacksmith')];
        const result = generateTileDescription(makeTown(), npcs, 'Plains', 1, 1);
        const types = result.buildings.map(b => b.type);
        expect(types).toContain('town hall');
        expect(types).toContain('guard tower');
        expect(types).toContain('forge');
        expect(types).toHaveLength(3);
    });

    test('duplicate roles collapse to one building', () => {
        const npcs = [makeNpc('Guard'), makeNpc('Guard'), makeNpc('Guard')];
        const result = generateTileDescription(makeTown(), npcs, 'Plains', 1, 1);
        expect(result.buildings.filter(b => b.type === 'guard tower')).toHaveLength(1);
    });

    test('Child with count < 3 produces no schoolhouse', () => {
        const npcs = [makeNpc('Child'), makeNpc('Child')];
        const result = generateTileDescription(makeTown(), npcs, 'Plains', 1, 1);
        expect(result.buildings.map(b => b.type)).not.toContain('schoolhouse');
    });

    test('Child with count >= 3 produces one schoolhouse', () => {
        const npcs = [makeNpc('Child'), makeNpc('Child'), makeNpc('Child')];
        const result = generateTileDescription(makeTown(), npcs, 'Plains', 1, 1);
        expect(result.buildings.map(b => b.type)).toContain('schoolhouse');
        expect(result.buildings.filter(b => b.type === 'schoolhouse')).toHaveLength(1);
    });

    test('no buildings when npcs array is empty', () => {
        const result = generateTileDescription(makeTown(), [], 'Plains', 1, 1);
        expect(result.buildings).toHaveLength(0);
    });
});

describe('generateTileDescription — building condition', () => {
    const conditionCases = [
        [1, 3, 'derelict'],
        [1, 8, 'weathered'],
        [2, 20, 'modest'],
        [3, 30, 'sturdy'],
        [4, 40, 'grand'],
        [5, 50, 'grand'],
    ];
    test.each(conditionCases)('tier %d pop %d → condition "%s"', (tier, pop, expected) => {
        const npcs = [makeNpc('Guard')];
        const result = generateTileDescription(makeTown({ tier, population: pop }), npcs, 'Plains', 1, 1);
        expect(result.buildings[0].condition).toBe(expected);
    });
});

describe('generateTileDescription — district overlay building', () => {
    const overlays = Object.entries(DISTRICT_OVERLAY_BUILDING);
    test.each(overlays)('districtType %s adds overlay building "%s"', (dtype, btype) => {
        const town = makeTown({ districtType: dtype });
        const result = generateTileDescription(town, [], 'Plains', 1, 1);
        expect(result.buildings.map(b => b.type)).toContain(btype);
    });
});

describe('generateTileDescription — all returned values are discrete', () => {
    test('size, atmosphere, walls are always in their allowed lists', () => {
        const stances = ['Aggressive', 'Federation', 'Occult', 'Balanced'];
        for (const stance of stances) {
            for (let tier = 1; tier <= 5; tier++) {
                const town = makeTown({ tier, politicalStance: stance, population: 8 });
                const result = generateTileDescription(town, [], 'Plains', 1, 1);
                expect(SIZES).toContain(result.size);
                expect(ATMOSPHERES).toContain(result.atmosphere);
                expect(WALLS).toContain(result.walls);
            }
        }
    });
});

// --- generateTileLightDescription ---

describe('generateTileLightDescription — terrain and vegetation', () => {
    test.each(BIOMES)('biome %s yields valid terrain and vegetation', (biome) => {
        const result = generateTileLightDescription(biome, 1);
        expect(result.terrain).toBe(TERRAIN[biome]);
        expect(result.vegetation).toBe(VEGETATION[biome]);
    });

    test('unknown biome falls back gracefully', () => {
        const result = generateTileLightDescription('Unknown', 1);
        expect(typeof result.terrain).toBe('string');
        expect(typeof result.vegetation).toBe('string');
    });
});

describe('generateTileLightDescription — settlementSilhouette', () => {
    const silhouetteCases = [
        [1, 'village'],
        [2, 'walled town'],
        [3, 'small city'],
        [4, 'fortified city'],
        [5, 'capital citadel'],
    ];
    test.each(silhouetteCases)('tier %d → silhouette "%s"', (tier, expected) => {
        const result = generateTileLightDescription('Plains', tier);
        expect(result.settlementSilhouette).toBe(expected);
    });
});

describe('generateTileLightDescription — determinism', () => {
    test('same inputs always produce the same output', () => {
        const a = generateTileLightDescription('Mountain', 3);
        const b = generateTileLightDescription('Mountain', 3);
        expect(a).toEqual(b);
    });
});

describe('generateTileLightDescription — Wilderness alias', () => {
    test('Wilderness biome returns same terrain as Plains', () => {
        const w = generateTileLightDescription('Wilderness', 1);
        const p = generateTileLightDescription('Plains', 1);
        expect(w.terrain).toBe(p.terrain);
        expect(w.vegetation).toBe(p.vegetation);
    });
});
