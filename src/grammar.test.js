// src/grammar.test.js
const { generateText } = require('./grammar');

describe('Grammar', () => {
    test('generateText should generate town name', () => {
        const rng = () => 0.5; // Fixed seed for deterministic test
        const result = generateText(rng, '#townName#');
        expect(result).toMatch(/[A-Z][a-z]+[a-z]+/); // Basic pattern check
    });

    test('generateText should generate NPC name', () => {
        const rng = () => 0.5;
        const result = generateText(rng, '#npcName#');
        expect(result).toMatch(/[A-Z][a-z]+ [A-Z][a-z]+/);
    });

    test('generateText should generate NPC description', () => {
        const rng = () => 0.5;
        const result = generateText(rng, '#npcDesc#');
        expect(result).toContain('A');
        expect(result).toContain('.');
    });
});