// src/items.test.js
const { generateArtifact } = require('./items');
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
});