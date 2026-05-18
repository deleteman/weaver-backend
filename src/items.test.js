// src/items.test.js
const { generateArtifact, calculateItemValue } = require('./items');
const seedrandom = require('seedrandom');

describe('Artifact Generator', () => {
    test('generateArtifact should be perfectly deterministic', () => {
        // Setup two identical seeds
        const rng1 = seedrandom('test-seed-123');
        const rng2 = seedrandom('test-seed-123');
        
        const coordinate = 'world_X10_Y10';
        const year = 51;
        const finder = 'Kael Tester';

        const item1 = generateArtifact(rng1, coordinate, year, finder);
        const item2 = generateArtifact(rng2, coordinate, year, finder);

        // They should be completely identical objects
        expect(item1).toEqual(item2);
        
        // Ensure the ID is a 12-character hex string
        expect(item1.id).toBeDefined();
        expect(item1.id.length).toBe(12);
        expect(item1.type).toMatch(/^(Tome|Jewelry|Weapon|Relic)$/);
    });

    test('generateArtifact should produce different items with different seeds', () => {
        const item1 = generateArtifact(seedrandom('seed-A'), 'world_X0_Y0', 50, 'Kael');
        const item2 = generateArtifact(seedrandom('seed-B'), 'world_X0_Y0', 50, 'Kael');

        expect(item1.id).not.toBe(item2.id);
    });

    test('generateArtifact includes provenance fields', () => {
        const item = generateArtifact(seedrandom('prov-seed'), 'world_X5_Y5', 77, 'finder');
        expect(item.creationYear).toBe(77);
        expect(item.originSettlement).toBe('world_X5_Y5');
        expect(item.historicalSignificance).toEqual([]);
        expect(item.baseValue).toBeGreaterThan(0);
        expect(item.value).toBe(item.baseValue);
    });
});

describe('calculateItemValue', () => {
    const baseItem = generateArtifact(seedrandom('val-seed'), 'world_X1_Y1', 1, 'tester');

    test('item at creation year has no prefix and value equals baseValue', () => {
        const result = calculateItemValue(baseItem, 1);
        expect(result.prefix).toBeUndefined();
        expect(result.value).toBe(baseItem.baseValue);
    });

    test('item with age 150 has prefix Ancient and value equals baseValue * 2', () => {
        const result = calculateItemValue(baseItem, 151);
        expect(result.prefix).toBe('Ancient');
        expect(result.value).toBe(baseItem.baseValue * 2);
    });

    test('item with age 350 has prefix Relic and value greater than baseValue * 2', () => {
        const result = calculateItemValue(baseItem, 351);
        expect(result.prefix).toBe('Relic');
        expect(result.value).toBeGreaterThan(baseItem.baseValue * 2);
    });

    test('determinism: same item and year always returns the same value', () => {
        const r1 = calculateItemValue(baseItem, 400);
        const r2 = calculateItemValue(baseItem, 400);
        expect(r1.value).toBe(r2.value);
        expect(r1.prefix).toBe(r2.prefix);
    });
});