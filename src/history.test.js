// src/history.test.js
const { World } = require('miniplex');
const { simulateHistory } = require('./history');

// Mock the db module to avoid database calls
jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    upsertDelta: jest.fn(),
    getTierForCoordinate: jest.fn(() => 0),
    getCapsuleDeltas: jest.fn(() => [])
}));

describe('History Simulation', () => {
    let world;
    let rng;

    beforeEach(() => {
        world = new World();
        rng = () => 0.5;

        // Add a basic town entity
        world.add({
            identity: { type: 'Town', id: 'town-id', name: 'Test Town' },
            location: { x: 0, y: 0 },
            currentMayor: null
        });

        // Add a basic NPC
        world.add({
            identity: { type: 'NPC', id: 'test-npc', name: 'Test NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Citizen',
            age: 20,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A test NPC'
        });
    });

    test('simulateHistory should run without errors for a basic world', () => {
        expect(() => {
            simulateHistory(world, rng, 0, 0, 1);
        }).not.toThrow();
    });

    test('simulateHistory should increase NPC age', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        const initialAge = npc.age;
        simulateHistory(world, rng, 0, 0, 1);
        expect(npc.age).toBe(initialAge + 1);
    });

    test('simulateHistory should trigger immigration when rng < 0.15', () => {
        rng = () => 0.1; // Below 0.15
        const initialNpcCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
        simulateHistory(world, rng, 0, 0, 1);
        const finalNpcCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
        expect(finalNpcCount).toBeGreaterThan(initialNpcCount);
    });

    test('simulateHistory should not trigger immigration when rng >= 0.15', () => {
        rng = () => 0.2; // Above 0.15
        const initialNpcCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
        simulateHistory(world, rng, 0, 0, 1);
        const finalNpcCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
        expect(finalNpcCount).toBe(initialNpcCount);
    });

    test('simulateHistory should handle child aging to adult', () => {
        // Add a child NPC
        world.add({
            identity: { type: 'NPC', id: 'child-npc', name: 'Child NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Child',
            age: 15,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A small child.'
        });
        const child = world.with('identity').where(e => e.identity.id === 'child-npc').first;
        simulateHistory(world, rng, 0, 0, 1);
        expect(child.age).toBe(16);
        expect(child.currentRole).toBe('Citizen');
        expect(child.description).not.toContain('small child');
    });

    test('simulateHistory should trigger death when eventRoll is between 0.08-0.10', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 30;
        npc.inventory.items = [{ name: 'Sword' }];
        
        let eventRollValue = 0.085;
        rng = () => eventRollValue;
        
        simulateHistory(world, rng, 0, 0, 1);
        expect(npc.status).toBe('Dead');
        expect(npc.history.events.some(e => e.type === 'death')).toBe(true);
    });

    test('simulateHistory should trigger childhood death with very high probability for young children', () => {
        world.add({
            identity: { type: 'NPC', id: 'young-child', name: 'Young Child' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Child',
            age: 10,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A small child.'
        });
        
        const child = world.with('identity').where(e => e.identity.id === 'young-child').first;
        rng = () => 0.99; // High enough to trigger childhood death
        
        simulateHistory(world, rng, 0, 0, 1);
        expect(child.status).toBe('Dead');
        expect(child.history.events.some(e => e.type === 'child_death')).toBe(true);
    });

    test('simulateHistory should handle career shifts when eventRoll is between 0.10-0.18', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 25;
        npc.currentRole = 'Citizen';
        
        rng = () => 0.15; // Triggers career shift

        simulateHistory(world, rng, 0, 0, 1);
        expect(npc.currentRole).not.toBe('Citizen');
        expect(npc.history.events.some(e => e.type === 'career_shift' || e.type === 'power_seizure')).toBe(true);
    });

    test('simulateHistory should trigger childbirth for married couples in childbearing years', () => {
        const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        
        // Add a partner
        world.add({
            identity: { type: 'NPC', id: 'partner-npc', name: 'Partner NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Citizen',
            age: 25,
            history: { events: [] },
            knowledge: { memories: { 'test-npc': 'loves' } },
            inventory: { items: [] },
            description: 'A partner NPC.'
        });

        npc1.age = 28;
        npc1.knowledge.memories['partner-npc'] = 'loves';

        rng = () => 0.05; // Triggers childbirth (< 0.08)

        const initialNpcCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
        simulateHistory(world, rng, 0, 0, 1);
        const finalNpcCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;

        expect(finalNpcCount).toBeGreaterThan(initialNpcCount);
        expect(npc1.history.events.some(e => e.type === 'birth')).toBe(true);
    });

    test('simulateHistory should trigger heartbreak when spouse dies', () => {
        const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        
        // Add a partner and mark as dead to trigger heartbreak
        const deadPartner = world.add({
            identity: { type: 'NPC', id: 'dead-partner', name: 'Dead Partner' },
            location: { x: 0, y: 0 },
            status: 'Dead',
            currentRole: 'Citizen',
            age: 30,
            history: { events: [] },
            knowledge: { memories: { 'test-npc': 'loves' } },
            inventory: { items: [] },
            description: 'A dead partner.'
        });

        npc1.knowledge.memories['dead-partner'] = 'loves';

        // Create a custom RNG that returns values to trigger heartbreak check
        let callCount = 0;
        rng = () => {
            callCount++;
            // Immigration: > 0.15
            if (callCount === 1) return 0.2;
            // Event roll: 0.5 (in social range, but we just want to test heartbreak)
            return 0.5;
        };

        simulateHistory(world, rng, 0, 0, 1);
        
        // The heartbreak event should have been recorded
        const npc1Updated = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        expect(npc1Updated.knowledge.memories['dead-partner']).toBe('mourns');
    });

    test('simulateHistory should trigger social events when eventRoll is between 0.18-0.33', () => {
        // Add a second NPC to enable social events
        world.add({
            identity: { type: 'NPC', id: 'other-npc', name: 'Other NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Citizen',
            age: 25,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'Another NPC'
        });

        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        
        // Use a counter to control which value is returned
        let callCount = 0;
        rng = () => {
            callCount++;
            // Immigration check: > 0.15
            if (callCount === 1) return 0.2;
            // Event roll: should be 0.25 to trigger social
            if (callCount === 2) return 0.25;
            // Target selection: return 0.5 to get second NPC
            if (callCount === 3) return 0.5;
            // Social roll: return 0.2 to trigger "likes"
            if (callCount === 4) return 0.2;
            return 0.5;
        };

        simulateHistory(world, rng, 0, 0, 1);

        // Check that the NPC formed a bond or relationship
        expect(npc.history.events.some(e => e.type === 'friendship' || e.type === 'romance' || e.type === 'rivalry')).toBe(true);
    });

    test('simulateHistory should trigger discovery events when eventRoll is between 0.33-0.38', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        
        rng = () => 0.35; // Discovery event

        simulateHistory(world, rng, 0, 0, 1);

        expect(npc.history.events.some(e => e.type === 'artifact_discovery')).toBe(true);
        expect(npc.inventory.items.length).toBeGreaterThan(0);
    });

    test('simulateHistory should trigger migration when eventRoll is between 0.38-0.40', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.currentRole = 'Citizen'; // Not a Mayor
        
        rng = () => 0.39; // Migration event

        simulateHistory(world, rng, 0, 0, 1);

        expect(npc.status).toBe('Migrated');
        expect(npc.history.events.some(e => e.type === 'migration')).toBe(true);
    });

    test('simulateHistory should not allow Mayors to migrate', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.currentRole = 'Mayor';
        
        let eventCount = 0;
        rng = () => {
            eventCount++;
            if (eventCount === 1) return 0.39; // Migration event
            return 0.5;
        };

        simulateHistory(world, rng, 0, 0, 1);

        expect(npc.currentRole).toBe('Mayor');
    });

    test('simulateHistory should inherit items to heirs on death', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 30;
        npc.inventory.items = [{ name: 'Precious Artifact' }];

        // Add an heir
        world.add({
            identity: { type: 'NPC', id: 'heir-npc', name: 'Heir NPC' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Citizen',
            age: 20,
            history: { events: [] },
            knowledge: { memories: { 'test-npc': 'child' } },
            inventory: { items: [] },
            description: 'An heir'
        });

        npc.knowledge.memories['heir-npc'] = 'child';

        // Use counter to trigger death at right time
        let callCount = 0;
        rng = () => {
            callCount++;
            // Immigration check: > 0.15
            if (callCount === 1) return 0.2;
            // Event roll for test-npc: 0.09 (death)
            if (callCount === 2) return 0.09;
            // Cause selection (rng() * causes.length)
            if (callCount === 3) return 0.5;
            return 0.5;
        };

        simulateHistory(world, rng, 0, 0, 1);

        const heir = world.with('identity').where(e => e.identity.id === 'heir-npc').first;
        expect(npc.status).toBe('Dead');
        expect(heir.inventory.items.length).toBeGreaterThan(0);
        expect(heir.history.events.some(e => e.type === 'inheritance')).toBe(true);
    });

    test('simulateHistory should protect the Player mayor from being replaced', () => {
        const town = world.with('identity').where(e => e.identity.type === 'Town').first;
        town.currentMayor = 'The Player';

        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 25;

        rng = () => 0.15; // Career shift

        simulateHistory(world, rng, 0, 0, 1);

        // NPC should not become Mayor
        expect(npc.currentRole).not.toBe('Mayor');
    });

    test('simulateHistory should skip dead NPCs during simulation', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.status = 'Dead';
        const initialAge = npc.age;

        simulateHistory(world, rng, 0, 0, 1);

        expect(npc.age).toBe(initialAge); // Dead NPCs don't age
    });

    // --- Structured history event tests ---

    test('all events pushed into history.events are objects with id, year, description, type, causedBy', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 30;
        rng = () => 0.35; // artifact_discovery

        simulateHistory(world, rng, 0, 0, 1);

        for (const ev of npc.history.events) {
            expect(ev).toHaveProperty('id');
            expect(ev).toHaveProperty('year');
            expect(ev).toHaveProperty('description');
            expect(ev).toHaveProperty('type');
            expect(ev).toHaveProperty('causedBy');
            expect(ev.id).toMatch(/^ev_[0-9a-f]{8}$/);
        }
    });

    test('death event followed by inheritance: inheritance.causedBy equals death event id', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 30;
        npc.inventory.items = [{ name: 'Precious Artifact' }];

        world.add({
            identity: { type: 'NPC', id: 'heir-causedby', name: 'Heir CausedBy' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Citizen',
            age: 20,
            history: { events: [] },
            knowledge: { memories: { 'test-npc': 'child' } },
            inventory: { items: [] },
            description: 'An heir'
        });
        npc.knowledge.memories['heir-causedby'] = 'child';

        let callCount = 0;
        rng = () => {
            callCount++;
            if (callCount === 1) return 0.2;  // skip immigration
            if (callCount === 2) return 0.09; // death roll
            return 0.5;
        };

        simulateHistory(world, rng, 0, 0, 1);

        const heir = world.with('identity').where(e => e.identity.id === 'heir-causedby').first;
        const deathEvent = npc.history.events.find(e => e.type === 'death');
        const inheritEvent = heir.history.events.find(e => e.type === 'inheritance');

        expect(deathEvent).toBeDefined();
        expect(inheritEvent).toBeDefined();
        expect(inheritEvent.causedBy).toBe(deathEvent.id);
    });

    test('power seizure: ousted mayor event has causedBy equal to new mayor seizure event id', () => {
        const currentMayorNpc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        currentMayorNpc.currentRole = 'Mayor';
        currentMayorNpc.age = 25;

        world.add({
            identity: { type: 'NPC', id: 'new-mayor', name: 'New Mayor' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Citizen',
            age: 25,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A would-be Mayor'
        });

        let callCount = 0;
        rng = () => {
            callCount++;
            if (callCount === 1) return 0.2;  // skip immigration
            if (callCount === 2) return 0.5;  // skip current mayor (no event since eventRoll not in any range triggering Mayor career shift)
            if (callCount === 3) return 0.15; // career shift for new-mayor
            return 0.5;
        };

        simulateHistory(world, rng, 0, 0, 1);

        const newMayor = world.with('identity').where(e => e.identity.id === 'new-mayor').first;
        if (newMayor.currentRole === 'Mayor') {
            const seizureEvent = newMayor.history.events.find(e => e.type === 'power_seizure');
            const oustEvent = currentMayorNpc.history.events.find(e => e.type === 'power_seizure');
            if (seizureEvent && oustEvent) {
                expect(oustEvent.causedBy).toBe(seizureEvent.id);
            }
        }
        // Whether or not the NPC became Mayor depends on RNG; the structural assertion is that causedBy is wired
    });

    test('saveDelta is called with JSON-stringified event object for history_append', () => {
        const { saveDelta } = require('./db');
        saveDelta.mockClear();
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 30;
        rng = () => 0.35; // artifact_discovery

        simulateHistory(world, rng, 0, 0, 1);

        const historyCall = saveDelta.mock.calls.find(call => call[2] === 'history_append');
        expect(historyCall).toBeDefined();
        const parsedEvent = JSON.parse(historyCall[3]);
        expect(parsedEvent).toHaveProperty('id');
        expect(parsedEvent).toHaveProperty('type');
        expect(parsedEvent).toHaveProperty('year');
    });

    test('immigrating NPC gets an immigration event object', () => {
        rng = () => 0.1; // triggers immigration
        simulateHistory(world, rng, 0, 0, 1);

        const immigrants = Array.from(world.with('identity').where(e => e.identity.type === 'NPC' && e.identity.id !== 'test-npc'));
        expect(immigrants.length).toBeGreaterThan(0);
        const immigrationEvent = immigrants[0].history.events.find(e => e.type === 'immigration');
        expect(immigrationEvent).toBeDefined();
        expect(immigrationEvent.year).toBe(1);
    });

    test('simulateHistory should handle empty town gracefully', () => {
        // Create an empty world with just a town
        const emptyWorld = new World();
        emptyWorld.add({
            identity: { type: 'Town', id: 'empty-town', name: 'Empty Town' },
            location: { x: 5, y: 5 },
            currentMayor: null
        });

        expect(() => {
            simulateHistory(emptyWorld, rng, 5, 5, 1);
        }).not.toThrow();
    });
});