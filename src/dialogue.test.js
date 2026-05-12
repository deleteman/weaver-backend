// src/dialogue.test.js
const { talkTo } = require('./dialogue');

describe('Dialogue', () => {
    test('talkTo should return no response for dead NPC', () => {
        const npc = { status: 'Dead' };
        const response = talkTo(npc, 'yourself', Math.random);
        expect(response).toBe('(No response. They are dead.)');
    });

    test('talkTo should generate response for yourself topic', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            currentRole: 'Blacksmith'
        };
        const response = talkTo(npc, 'yourself', Math.random);
        expect(response).toContain('Test NPC');
        expect(response).toContain('Blacksmith');
    });

    test('talkTo should generate response for known topic', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            knowledge: { memories: { 'enemy': 'hates' } }
        };
        const response = talkTo(npc, 'enemy', Math.random);
        expect(response).toMatch(/despise|blood feud/);
    });

    test('talkTo should generate response for unknown topic', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            knowledge: { memories: {} }
        };
        const response = talkTo(npc, 'unknown', Math.random);
        expect(response).toContain('unknown');
    });

    test('talkTo should generate response for likes memory', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            knowledge: { memories: { 'friend': 'likes' } }
        };
        const response = talkTo(npc, 'friend', Math.random);
        expect(response).toContain('friend');
    });

    test('talkTo should generate response for loves memory', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            knowledge: { memories: { 'lover': 'loves' } }
        };
        const response = talkTo(npc, 'lover', Math.random);
        expect(response).toContain('lover');
    });

    test('talkTo should generate response for mourns memory', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            knowledge: { memories: { 'deceased': 'mourns' } }
        };
        const response = talkTo(npc, 'deceased', Math.random);
        expect(response).toContain('deceased');
    });

    test('talkTo should generate response for child memory', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            knowledge: { memories: { 'child-id': 'child' } }
        };
        const response = talkTo(npc, 'child-id', Math.random);
        expect(response).toContain('child-id');
    });

    test('talkTo should generate response for parent memory', () => {
        const npc = {
            status: 'Alive',
            identity: { name: 'Test NPC' },
            knowledge: { memories: { 'parent-id': 'parent' } }
        };
        const response = talkTo(npc, 'parent-id', Math.random);
        expect(response).toContain('parent-id');
    });
});