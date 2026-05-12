// src/quests.test.js
const { World } = require('miniplex');
const seedrandom = require('seedrandom');
const { generateQuests } = require('./quests');

describe('Quests', () => {
    test('generateQuests should generate bounty quests for hated NPCs with no items', () => {
        const world = new World();

        const giver = world.add({
            identity: { id: 'giver', type: 'NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            knowledge: { memories: { 'enemy': 'hates' } },
            inventory: { items: [] },
            quests: { offeredQuests: [] },
            currentRole: 'Citizen'
        });

        // Enemy has no items — rng() branch is never reached, Bounty is always produced
        world.add({
            identity: { id: 'enemy', name: 'Enemy NPC', type: 'NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            inventory: { items: [] }
        });

        generateQuests(world, 0, 0, seedrandom('world_X0_Y0_quests'));

        expect(giver.quests.offeredQuests.length).toBeGreaterThan(0);
        expect(giver.quests.offeredQuests[0].type).toBe('Bounty');
    });

    test('generateQuests Mystery Heist title and description use item name, not [object Object]', () => {
        const world = new World();

        const giver = world.add({
            identity: { id: 'giver', type: 'NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            knowledge: { memories: { 'thief': 'hates' } },
            inventory: { items: [] },
            quests: { offeredQuests: [] },
            currentRole: 'Citizen'
        });

        world.add({
            identity: { id: 'thief', name: 'Sly Rook', type: 'NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            inventory: { items: [{ id: 'item-1', name: 'Golden Locket', type: 'Jewelry' }] }
        });

        // seed 'quest' produces 0.97 on the first call, deterministically selecting Mystery Heist
        generateQuests(world, 0, 0, seedrandom('quest'));

        const heistQuest = giver.quests.offeredQuests.find(q => q.type === 'Mystery Heist');
        expect(heistQuest).toBeDefined();
        expect(heistQuest.title).toBe('Find Golden Locket');
        expect(heistQuest.description).toContain('Golden Locket');
        expect(heistQuest.description).not.toContain('[object Object]');
        expect(heistQuest.itemId).toBe('item-1');
    });

    test('generateQuests should generate fetch quests for scholars with no items', () => {
        const world = new World();

        const scholar = world.add({
            identity: { id: 'scholar', type: 'NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] },
            currentRole: 'Scholar'
        });

        generateQuests(world, 0, 0, seedrandom('world_X0_Y0_quests'));

        expect(scholar.quests.offeredQuests.length).toBeGreaterThan(0);
        expect(scholar.quests.offeredQuests[0].type).toBe('Fetch');
    });

    test('generateQuests Fetch quest target is the Scholar NPC id, not "ANY"', () => {
        const world = new World();

        const scholar = world.add({
            identity: { id: 'scholar-npc-id', type: 'NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] },
            currentRole: 'Scholar'
        });

        generateQuests(world, 0, 0, seedrandom('world_X0_Y0_quests'));

        const fetchQuest = scholar.quests.offeredQuests.find(q => q.type === 'Fetch');
        expect(fetchQuest).toBeDefined();
        expect(fetchQuest.target).toBe('scholar-npc-id');
        expect(fetchQuest.target).not.toBe('ANY');
    });
});
