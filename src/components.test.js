// src/components.test.js
const { Identity, Location, History, Knowledge, Inventory, Quests } = require('./components');

describe('Components', () => {
    test('Identity should create an identity object', () => {
        const identity = Identity('Test Name', 'NPC', 'test-id');
        expect(identity).toEqual({ name: 'Test Name', type: 'NPC', id: 'test-id' });
    });

    test('Location should create a location object', () => {
        const location = Location(10, 20, 'parent-id');
        expect(location).toEqual({ x: 10, y: 20, parentId: 'parent-id' });
    });

    test('Location should handle null parentId', () => {
        const location = Location(10, 20);
        expect(location).toEqual({ x: 10, y: 20, parentId: null });
    });

    test('History should create a history object', () => {
        const history = History();
        expect(history).toEqual({ events: [] });
    });

    test('Knowledge should create a knowledge object', () => {
        const knowledge = Knowledge();
        expect(knowledge).toEqual({ memories: {} });
    });

    test('Inventory should create an inventory object', () => {
        const inventory = Inventory();
        expect(inventory).toEqual({ items: [] });
    });

    test('Quests should create a quests object', () => {
        const quests = Quests();
        expect(quests).toEqual({ offeredQuests: [] });
    });
});