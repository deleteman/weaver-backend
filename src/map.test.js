// src/map.test.js

// Mock the DB module so tests never touch the SQLite file.
// Default return values match what the real DB returns for an unvisited coordinate.
jest.mock('./db', () => ({
    getDeltas: jest.fn().mockReturnValue([]),
    getGlobalYear: jest.fn().mockReturnValue(51),
    getParentCity: jest.fn().mockReturnValue(null),
}));

const db = require('./db');

// Reset all mocks to their defaults before every test so state doesn't leak.
beforeEach(() => {
    db.getDeltas.mockReturnValue([]);
    db.getGlobalYear.mockReturnValue(51);
    db.getParentCity.mockReturnValue(null);
});

const {
    determineBiome,
    generateTownName,
    getTownRulerAndTier,
    generateTileMetadata,
    computeOwnership,
    generateMiniMap,
    estimateTierFromTime,
    BIOME_TYPES,
    CLAIM_RADIUS_BY_TIER,
    DISTRICT_TYPES,
    TIER_NAMES,
} = require('./map');

describe('Map Module - Fog of War Mini-Map Feature', () => {
    
    // ===== Biome Tests =====
    describe('determineBiome', () => {
        it('should return a valid biome type', () => {
            const biome = determineBiome(0, 0);
            expect(BIOME_TYPES).toContain(biome);
        });

        it('should be deterministic - same coordinates produce same biome', () => {
            const biome1 = determineBiome(5, 10);
            const biome2 = determineBiome(5, 10);
            expect(biome1).toBe(biome2);
        });

        it('should produce different biomes for different coordinates', () => {
            const biome1 = determineBiome(0, 0);
            const biome2 = determineBiome(1, 0);
            const biome3 = determineBiome(0, 1);
            
            // At least some should be different (statistically very likely)
            const allSame = biome1 === biome2 && biome2 === biome3;
            expect(allSame).toBe(false);
        });

        it('should handle negative coordinates', () => {
            const biome = determineBiome(-5, -10);
            expect(BIOME_TYPES).toContain(biome);
        });

        it('should handle large coordinates', () => {
            const biome = determineBiome(10000, 20000);
            expect(BIOME_TYPES).toContain(biome);
        });

        it('should have all 5 biome types available', () => {
            expect(BIOME_TYPES.length).toBe(5);
            expect(BIOME_TYPES).toEqual(
                expect.arrayContaining(['Wilderness', 'Forest', 'Desert', 'Mountain', 'Marsh'])
            );
        });
    });

    // ===== Town Name Tests =====
    describe('generateTownName', () => {
        it('should generate a non-empty string', () => {
            const name = generateTownName(0, 0);
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThan(0);
        });

        it('should be deterministic - same coordinates produce same name', () => {
            const name1 = generateTownName(42, 73);
            const name2 = generateTownName(42, 73);
            expect(name1).toBe(name2);
        });

        it('should produce different names for different coordinates', () => {
            const name1 = generateTownName(0, 0);
            const name2 = generateTownName(1, 0);
            const name3 = generateTownName(0, 1);
            
            // At least some should be different
            const allSame = name1 === name2 && name2 === name3;
            expect(allSame).toBe(false);
        });

        it('should use predefined prefixes and suffixes', () => {
            const prefixes = ['Oak', 'Iron', 'Stone', 'Gloom', 'Ash', 'River', 'Frost', 'Deep'];
            const suffixes = ['haven', 'ford', 'keep', 'gate', 'watch', 'fall', 'wood', 'hollow'];
            
            const name = generateTownName(999, 999);
            const isValid = prefixes.some(p => name.startsWith(p)) && 
                           suffixes.some(s => name.endsWith(s));
            expect(isValid).toBe(true);
        });

        it('should handle negative coordinates', () => {
            const name = generateTownName(-100, -200);
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThan(0);
        });
    });

    // ===== Tile Metadata Tests =====
    describe('generateTileMetadata', () => {
        it('should return an object with required fields', () => {
            const metadata = generateTileMetadata(0, 0);
            expect(metadata).toHaveProperty('x');
            expect(metadata).toHaveProperty('y');
            expect(metadata).toHaveProperty('biome');
            expect(metadata).toHaveProperty('hasTown');
            expect(metadata).toHaveProperty('townName');
            expect(metadata).toHaveProperty('ruler');
            expect(metadata).toHaveProperty('isDiscovered');
        });

        it('should have correct x and y values', () => {
            const metadata = generateTileMetadata(15, 25);
            expect(metadata.x).toBe(15);
            expect(metadata.y).toBe(25);
        });

        it('should mark tiles as undiscovered by default', () => {
            const metadata = generateTileMetadata(5, 5);
            expect(metadata.isDiscovered).toBe(false);
        });

        it('should mark tiles as discovered when in set', () => {
            const discovered = new Set(['5,5', '10,10']);
            const metadata1 = generateTileMetadata(5, 5, discovered);
            const metadata2 = generateTileMetadata(10, 10, discovered);
            const metadata3 = generateTileMetadata(0, 0, discovered);
            
            expect(metadata1.isDiscovered).toBe(true);
            expect(metadata2.isDiscovered).toBe(true);
            expect(metadata3.isDiscovered).toBe(false);
        });

        it('should have valid biome and town name', () => {
            const metadata = generateTileMetadata(0, 0);
            expect(BIOME_TYPES).toContain(metadata.biome);
            expect(typeof metadata.townName).toBe('string');
            expect(metadata.townName.length).toBeGreaterThan(0);
        });

        it('should always have hasTown as true', () => {
            const metadata = generateTileMetadata(0, 0);
            expect(metadata.hasTown).toBe(true);
        });

        it('should include tier and settlementType fields', () => {
            const metadata = generateTileMetadata(0, 0);
            expect(metadata).toHaveProperty('tier');
            expect(metadata).toHaveProperty('settlementType');
            expect(metadata).toHaveProperty('territoryRadius');
            expect(typeof metadata.tier).toBe('number');
            expect(typeof metadata.settlementType).toBe('string');
            expect(typeof metadata.territoryRadius).toBe('number');
        });
    });

    // ===== Town Ruler Tests =====
    describe('getTownRulerAndTier', () => {
        it('should return "Unknown" as default ruler', () => {
            const { ruler } = getTownRulerAndTier(999, 999);
            expect(ruler).toBe('Unknown');
        });

        it('should return a valid estimated tier for unvisited coordinate', () => {
            const { tier } = getTownRulerAndTier(999, 999);
            expect(tier).toBeGreaterThanOrEqual(1);
            expect(tier).toBeLessThanOrEqual(5);
        });

        it('should return an object with ruler and tier properties', () => {
            const result = getTownRulerAndTier(0, 0);
            expect(typeof result).toBe('object');
            expect(result).toHaveProperty('ruler');
            expect(result).toHaveProperty('tier');
        });

        it('returns isDbConfirmed: false for an unvisited coordinate', () => {
            const result = getTownRulerAndTier(999, 999);
            expect(result.isDbConfirmed).toBe(false);
        });
    });

    // ===== Mini-Map Tests =====
    describe('generateMiniMap', () => {
        it('should generate a 3x3 grid for radius 1', () => {
            const miniMap = generateMiniMap(0, 0, 1);
            expect(miniMap.grid.length).toBe(9); // 3x3
            expect(miniMap.gridSize).toBe(3);
            expect(miniMap.radius).toBe(1);
        });

        it('should generate a 5x5 grid for radius 2', () => {
            const miniMap = generateMiniMap(0, 0, 2);
            expect(miniMap.grid.length).toBe(25); // 5x5
            expect(miniMap.gridSize).toBe(5);
            expect(miniMap.radius).toBe(2);
        });

        it('should generate a 7x7 grid for radius 3', () => {
            const miniMap = generateMiniMap(0, 0, 3);
            expect(miniMap.grid.length).toBe(49); // 7x7
            expect(miniMap.gridSize).toBe(7);
        });

        it('should center the grid correctly around the player', () => {
            const miniMap = generateMiniMap(10, 20, 1);
            
            // Extract x,y pairs from grid
            const coordinates = miniMap.grid.map(tile => [tile.x, tile.y]);
            
            // Should have tiles from (9,19) to (11,21)
            const minX = Math.min(...coordinates.map(c => c[0]));
            const maxX = Math.max(...coordinates.map(c => c[0]));
            const minY = Math.min(...coordinates.map(c => c[1]));
            const maxY = Math.max(...coordinates.map(c => c[1]));
            
            expect(minX).toBe(9);
            expect(maxX).toBe(11);
            expect(minY).toBe(19);
            expect(maxY).toBe(21);
        });

        it('should have center tile matching the player coordinate', () => {
            const miniMap = generateMiniMap(5, 15, 1);
            expect(miniMap.center.x).toBe(5);
            expect(miniMap.center.y).toBe(15);
        });

        it('should include all tiles within radius', () => {
            const centerX = 10, centerY = 20, radius = 2;
            const miniMap = generateMiniMap(centerX, centerY, radius);
            
            const expectedTiles = [];
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                for (let y = centerY - radius; y <= centerY + radius; y++) {
                    expectedTiles.push(`${x},${y}`);
                }
            }
            
            const actualTiles = miniMap.grid.map(tile => `${tile.x},${tile.y}`);
            
            expect(actualTiles.sort()).toEqual(expectedTiles.sort());
        });

        it('should mark discovered tiles correctly', () => {
            const discovered = new Set(['10,10', '10,11', '11,10']);
            const miniMap = generateMiniMap(10, 10, 1, discovered);
            
            const discoveredTiles = miniMap.grid.filter(t => t.isDiscovered);
            expect(discoveredTiles.length).toBe(3);
        });

        it('should have deterministic biome distribution', () => {
            const miniMap1 = generateMiniMap(0, 0, 1);
            const miniMap2 = generateMiniMap(0, 0, 1);
            
            // Compare biomes at same positions
            for (let i = 0; i < miniMap1.grid.length; i++) {
                expect(miniMap1.grid[i].biome).toBe(miniMap2.grid[i].biome);
                expect(miniMap1.grid[i].townName).toBe(miniMap2.grid[i].townName);
            }
        });

        it('should have different tiles for different centers', () => {
            const miniMap1 = generateMiniMap(0, 0, 1);
            const miniMap2 = generateMiniMap(1, 1, 1);
            
            // Centers should be different
            expect(miniMap1.center.townName).not.toBe(miniMap2.center.townName);
        });

        it('should handle large coordinate offsets', () => {
            const miniMap = generateMiniMap(10000, 20000, 1);
            expect(miniMap.center.x).toBe(10000);
            expect(miniMap.center.y).toBe(20000);
            expect(miniMap.grid.length).toBe(9);
        });

        it('should handle negative coordinates', () => {
            const miniMap = generateMiniMap(-5, -10, 1);
            expect(miniMap.center.x).toBe(-5);
            expect(miniMap.center.y).toBe(-10);
            expect(miniMap.grid.length).toBe(9);
        });

        it('should have all tiles with valid metadata', () => {
            const miniMap = generateMiniMap(0, 0, 2);
            
            for (const tile of miniMap.grid) {
                expect(tile.x).toBeDefined();
                expect(tile.y).toBeDefined();
                expect(BIOME_TYPES).toContain(tile.biome);
                expect(typeof tile.hasTown).toBe('boolean');
                expect(typeof tile.townName).toBe('string');
                expect(tile.townName.length).toBeGreaterThan(0);
                expect(typeof tile.isDiscovered).toBe('boolean');
            }
        });
    });

    // ===== Ownership Tests =====
    describe('computeOwnership', () => {
        function makeTile(x, y, tier, townName = `Town_${x}_${y}`, ruler = 'Unknown', isDbConfirmed = true) {
            return { x, y, tier, townName, ruler, biome: 'Forest', hasTown: true,
                     settlementType: 'Town', territoryRadius: 1, isDiscovered: false, isDbConfirmed };
        }

        it('should give every tile a claimedBy, claimedByName, and ruler field', () => {
            const grid = [makeTile(0, 0, 1), makeTile(1, 0, 1)];
            const result = computeOwnership(grid);
            for (const tile of result) {
                expect(tile).toHaveProperty('claimedBy');
                expect(tile).toHaveProperty('claimedByName');
                expect(tile).toHaveProperty('ruler');
            }
        });

        it('claimedBy format matches world_X{x}_Y{y} for a claimed tile', () => {
            // Kingdom at (0,0) claims (2,1); verify the format of the claimedBy key
            const grid = [makeTile(0, 0, 5, 'Ironhaven'), makeTile(2, 1, 1, 'Smallburg')];
            const result = computeOwnership(grid);
            const smallburg = result.find(t => t.x === 2 && t.y === 1);
            expect(smallburg.claimedBy).toBe('world_X0_Y0');
        });

        it('a sovereign town (tier 1) has claimedBy: null and districtType: null', () => {
            const grid = [makeTile(0, 0, 1), makeTile(1, 0, 1), makeTile(0, 1, 1)];
            const result = computeOwnership(grid);
            for (const tile of result) {
                expect(tile.claimedBy).toBeNull();
                expect(tile.claimedByName).toBeNull();
                expect(tile.districtType).toBeNull();
            }
        });

        it('a kingdom (tier 5, radius 3) claims tiles within 3 steps', () => {
            // Kingdom at (0,0), town at (2,1) — chebyshev distance = max(2,1) = 2 ≤ 3
            const grid = [makeTile(0, 0, 5, 'Ironhaven'), makeTile(2, 1, 1, 'Smallburg')];
            const result = computeOwnership(grid);
            const smallburg = result.find(t => t.x === 2 && t.y === 1);
            expect(smallburg.claimedBy).toBe('world_X0_Y0');
            expect(smallburg.claimedByName).toBe('Ironhaven');
        });

        it('claimed tiles inherit the ruler of the controlling settlement', () => {
            const grid = [
                makeTile(0, 0, 5, 'Ironhaven', 'Kael the Bold'),
                makeTile(2, 0, 1, 'Smallburg', 'Bob')
            ];
            const result = computeOwnership(grid);
            const smallburg = result.find(t => t.x === 2 && t.y === 0);
            // Smallburg is within kingdom radius (dist=2 ≤ 3), so it gets Ironhaven's ruler
            expect(smallburg.ruler).toBe('Kael the Bold');
        });

        it('independent towns keep their own ruler', () => {
            const grid = [
                makeTile(0, 0, 5, 'Ironhaven', 'Kael the Bold'),
                makeTile(4, 0, 1, 'Fartown', 'Local Chief')
            ];
            const result = computeOwnership(grid);
            const fartown = result.find(t => t.x === 4 && t.y === 0);
            // dist=4 > kingdom radius 3, so Fartown stays independent
            expect(fartown.ruler).toBe('Local Chief');
        });

        it('a kingdom does not claim tiles beyond its radius', () => {
            // Kingdom at (0,0) radius 3; tile at (4,0) chebyshev = 4 > 3
            const grid = [makeTile(0, 0, 5, 'Ironhaven'), makeTile(4, 0, 1, 'Fartown')];
            const result = computeOwnership(grid);
            const fartown = result.find(t => t.x === 4 && t.y === 0);
            expect(fartown.claimedBy).toBeNull();
        });

        it('higher tier wins when two settlements both reach a tile', () => {
            // SmallCity at (0,0) tier 2 radius 1, Kingdom at (5,0) tier 5 radius 3
            // Tile at (3,0): chebyshev from (0,0) = 3 > 1 (out of SmallCity range)
            //               chebyshev from (5,0) = 2 ≤ 3 (Kingdom claims it)
            const grid = [
                makeTile(0, 0, 2, 'SmallCity'),
                makeTile(5, 0, 5, 'Kingdom'),
                makeTile(3, 0, 1, 'Midtown')
            ];
            const result = computeOwnership(grid);
            const midtown = result.find(t => t.x === 3 && t.y === 0);
            expect(midtown.claimedBy).toBe('world_X5_Y0');
        });

        it('when tier is equal, closer settlement wins', () => {
            // Two kingdoms equidistant from (3,0): one at (0,0) dist=3, one at (6,0) dist=3
            // tie on distance → lower x wins: (0,0)
            const grid = [
                makeTile(0, 0, 5, 'WestKingdom'),
                makeTile(6, 0, 5, 'EastKingdom'),
                makeTile(3, 0, 1, 'Midtown')
            ];
            const result = computeOwnership(grid);
            const midtown = result.find(t => t.x === 3 && t.y === 0);
            expect(midtown.claimedBy).toBe('world_X0_Y0');
        });

        it('each kingdom claims itself when kingdoms are adjacent (both sovereign)', () => {
            // Two kingdoms at (0,0) and (1,0) — each has dist 0 to itself; both are sovereign
            const grid = [makeTile(0, 0, 5, 'Kingdom A'), makeTile(1, 0, 5, 'Kingdom B')];
            const result = computeOwnership(grid);
            expect(result.find(t => t.x === 0).claimedBy).toBeNull();
            expect(result.find(t => t.x === 1).claimedBy).toBeNull();
        });

        it('CLAIM_RADIUS_BY_TIER covers all five tiers', () => {
            for (let tier = 1; tier <= 5; tier++) {
                expect(CLAIM_RADIUS_BY_TIER[tier]).toBeDefined();
            }
        });

        it('claimed tile has a districtType from DISTRICT_TYPES', () => {
            const grid = [makeTile(0, 0, 5, 'Ironhaven'), makeTile(2, 1, 1, 'Smallburg')];
            const result = computeOwnership(grid);
            const smallburg = result.find(t => t.x === 2 && t.y === 1);
            expect(DISTRICT_TYPES).toContain(smallburg.districtType);
        });

        it('districtType is deterministic for the same coordinate', () => {
            const grid = [makeTile(0, 0, 5, 'Ironhaven'), makeTile(2, 1, 1, 'Smallburg')];
            const r1 = computeOwnership(grid).find(t => t.x === 2 && t.y === 1);
            const r2 = computeOwnership(grid).find(t => t.x === 2 && t.y === 1);
            expect(r1.districtType).toBe(r2.districtType);
        });

        it('districtType is null for a sovereign tile', () => {
            const grid = [makeTile(5, 5, 1, 'Standalone')];
            const [tile] = computeOwnership(grid);
            expect(tile.districtType).toBeNull();
        });

        it('every tile in the grid has a districtType field (null or string)', () => {
            const grid = [
                makeTile(0, 0, 5, 'Ironhaven'),
                makeTile(1, 0, 1, 'Near'),
                makeTile(5, 0, 1, 'Far')
            ];
            const result = computeOwnership(grid);
            for (const tile of result) {
                expect(tile).toHaveProperty('districtType');
                const dt = tile.districtType;
                expect(dt === null || DISTRICT_TYPES.includes(dt)).toBe(true);
            }
        });

        it('district tile has tier:1, settlementType:"Town", territoryRadius:1 regardless of its own estimated tier', () => {
            const grid = [
                makeTile(0, 0, 5, 'Ironhaven'),
                makeTile(2, 1, 3, 'Highburg'),  // tier:3 as if estimateTierFromTime inflated it
            ];
            const result = computeOwnership(grid);
            const highburg = result.find(t => t.x === 2 && t.y === 1);
            expect(highburg.claimedBy).toBe('world_X0_Y0');
            expect(highburg.tier).toBe(1);
            expect(highburg.settlementType).toBe(TIER_NAMES[1]);
            expect(highburg.territoryRadius).toBe(1);
        });

        it('unconfirmed tile cannot act as an owner for neighboring tiles', () => {
            const grid = [
                makeTile(0, 0, 5, 'Ghost', 'Unknown', false),  // isDbConfirmed: false
                makeTile(1, 0, 1, 'Hamlet'),
            ];
            const result = computeOwnership(grid);
            const hamlet = result.find(t => t.x === 1 && t.y === 0);
            expect(hamlet.claimedBy).toBeNull();
        });
    });

    // ===== Integration Tests =====
    describe('Integration - Full Mini-Map Workflow', () => {
        it('should generate consistent mini-maps across multiple calls', () => {
            const calls = [];
            for (let i = 0; i < 5; i++) {
                calls.push(generateMiniMap(42, 73, 1));
            }
            
            // All should have identical data
            const firstCall = calls[0];
            for (let i = 1; i < calls.length; i++) {
                expect(calls[i].grid.length).toBe(firstCall.grid.length);
                for (let j = 0; j < firstCall.grid.length; j++) {
                    expect(calls[i].grid[j]).toEqual(firstCall.grid[j]);
                }
            }
        });

        it('should produce different maps for adjacent centers', () => {
            const mapA = generateMiniMap(0, 0, 1);
            const mapB = generateMiniMap(1, 0, 1);
            const mapC = generateMiniMap(0, 1, 1);
            
            // Centers should be different
            expect(mapA.center.townName).not.toBe(mapB.center.townName);
            expect(mapA.center.townName).not.toBe(mapC.center.townName);
            expect(mapB.center.townName).not.toBe(mapC.center.townName);
        });

        it('should support various radius sizes', () => {
            for (let radius = 1; radius <= 5; radius++) {
                const miniMap = generateMiniMap(0, 0, radius);
                const expectedSize = (radius * 2 + 1);
                expect(miniMap.gridSize).toBe(expectedSize);
                expect(miniMap.grid.length).toBe(expectedSize * expectedSize);
            }
        });
    });

    // ===== District Ruler / Tier Fallback Tests =====
    describe('getTownRulerAndTier — district tile behavior', () => {
        it('returns the parent ruler when the tile is a district with no own currentMayor delta', () => {
            db.getDeltas.mockImplementation(coord => {
                if (coord === 'world_X5_Y5') return [{ state_key: 'political', state_value: '{"tier":5}' }];
                if (coord === 'world_X0_Y0') return [{ state_key: 'currentMayor', state_value: 'Alice the Bold' }];
                return [];
            });
            db.getParentCity.mockReturnValue('world_X0_Y0');

            const { ruler } = getTownRulerAndTier(5, 5);
            expect(ruler).toBe('Alice the Bold');
        });

        it('forces tier 1 for a district regardless of inherited political tier', () => {
            db.getDeltas.mockImplementation(coord => {
                if (coord === 'world_X5_Y5') return [{ state_key: 'political', state_value: '{"tier":5}' }];
                return [];
            });
            db.getParentCity.mockReturnValue('world_X0_Y0');

            const { tier } = getTownRulerAndTier(5, 5);
            expect(tier).toBe(1);
        });

        it('returns "Unknown" when district parent has no currentMayor delta yet', () => {
            db.getDeltas.mockImplementation(coord => {
                if (coord === 'world_X5_Y5') return [{ state_key: 'political', state_value: '{"tier":5}' }];
                if (coord === 'world_X0_Y0') return [{ state_key: 'political', state_value: '{"tier":5}' }];
                return [];
            });
            db.getParentCity.mockReturnValue('world_X0_Y0');

            const { ruler } = getTownRulerAndTier(5, 5);
            expect(ruler).toBe('Unknown');
        });

        it('sovereign tile uses its own currentMayor delta and saved tier (no parent)', () => {
            db.getDeltas.mockImplementation(coord => {
                if (coord === 'world_X3_Y3') {
                    return [
                        { state_key: 'currentMayor', state_value: 'Bob the Mayor' },
                        { state_key: 'political', state_value: '{"tier":3}' },
                    ];
                }
                return [];
            });
            db.getParentCity.mockReturnValue(null);

            const { ruler, tier } = getTownRulerAndTier(3, 3);
            expect(ruler).toBe('Bob the Mayor');
            expect(tier).toBeGreaterThanOrEqual(3);
        });

        it('isDbConfirmed reflects political delta, not mayor delta', () => {
            db.getDeltas.mockImplementation(coord => {
                if (coord === 'world_X5_Y5') return [{ state_key: 'political', state_value: '{"tier":5}' }];
                if (coord === 'world_X0_Y0') return [{ state_key: 'currentMayor', state_value: 'Alice' }];
                return [];
            });
            db.getParentCity.mockReturnValue('world_X0_Y0');

            const { isDbConfirmed } = getTownRulerAndTier(5, 5);
            expect(isDbConfirmed).toBe(true);
        });
    });

    // ===== estimateTierFromTime Tests =====
    describe('estimateTierFromTime', () => {
        it('should return 1 when year is 0', () => {
            expect(estimateTierFromTime(0, 0, 0)).toBe(1);
        });

        it('should return 1 when year is negative', () => {
            expect(estimateTierFromTime(5, 5, -10)).toBe(1);
        });

        it('should return a tier between 1 and 5 inclusive', () => {
            for (let x = 0; x < 5; x++) {
                for (let y = 0; y < 5; y++) {
                    const tier = estimateTierFromTime(x, y, 10000);
                    expect(tier).toBeGreaterThanOrEqual(1);
                    expect(tier).toBeLessThanOrEqual(5);
                }
            }
        });

        it('should be deterministic for the same coordinate and year', () => {
            const t1 = estimateTierFromTime(7, -3, 500);
            const t2 = estimateTierFromTime(7, -3, 500);
            expect(t1).toBe(t2);
        });

        it('should accept an explicit globalYear without calling getGlobalYear', () => {
            // Both calls use different explicit years — results should differ only
            // when the year crosses a maturation threshold for that tile.
            const tierLow = estimateTierFromTime(3, 3, 1);
            const tierHigh = estimateTierFromTime(3, 3, 10000);
            expect(tierHigh).toBeGreaterThanOrEqual(tierLow);
        });

        it('should produce higher or equal tiers at later years', () => {
            // Find at least one coordinate whose maxTier >= 2 and verify progression
            let found = false;
            for (let x = 0; x < 20 && !found; x++) {
                const tierEarly = estimateTierFromTime(x, 0, 60);
                const tierLate = estimateTierFromTime(x, 0, 10000);
                if (tierLate > 1) {
                    expect(tierLate).toBeGreaterThanOrEqual(tierEarly);
                    found = true;
                }
            }
            expect(found).toBe(true);
        });
    });
});
