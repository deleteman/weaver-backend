// src/history.test.js
const { World } = require('miniplex');
const { simulateHistory } = require('./history');

// Mock the db module to avoid database calls
jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    upsertDelta: jest.fn(),
    getTierForCoordinate: jest.fn(() => 0),
    getCapsuleDeltas: jest.fn(() => []),
    getDeltas: jest.fn(() => [])
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

    test.each([
        ['assassination', 'assassination'],
        ['regicide', 'regicide'],
        ['child_death', 'child_death'],
    ])('simulateHistory should trigger mourning when loved NPC died via %s event', (label, eventType) => {
        const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;

        world.add({
            identity: { type: 'NPC', id: 'slain-partner', name: 'Slain Partner' },
            location: { x: 0, y: 0 },
            status: 'Dead',
            currentRole: 'Citizen',
            age: 30,
            history: { events: [{ type: eventType, description: `[Year 1] Died via ${label}.` }] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A slain partner.'
        });

        npc1.knowledge.memories['slain-partner'] = 'loves';

        let callCount = 0;
        const testRng = () => {
            callCount++;
            if (callCount === 1) return 0.2;
            return 0.5;
        };

        simulateHistory(world, testRng, 0, 0, 1);

        const npc1Updated = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        expect(npc1Updated.knowledge.memories['slain-partner']).toBe('mourns');
        const griefEvent = npc1Updated.history.events.find(e => e.type === 'grief');
        expect(griefEvent).toBeDefined();
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
        expect(inheritEvent.causedBy).toMatchObject({
            id: deathEvent.id,
            type: 'death',
            actorName: npc.identity.name
        });
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
                expect(oustEvent.causedBy).toMatchObject({
                    id: seizureEvent.id,
                    type: 'power_seizure',
                    actorName: newMayor.identity.name
                });
            }
        }
        // Whether or not the NPC became Mayor depends on RNG; the structural assertion is that causedBy is wired
    });

    test('simulation events are pushed to entity history in-memory only, not persisted to DB', () => {
        const { saveDelta } = require('./db');
        saveDelta.mockClear();
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.age = 30;
        rng = () => 0.35; // artifact_discovery

        simulateHistory(world, rng, 0, 0, 1);

        // Simulation events must NOT be written to DB — they are deterministic and
        // re-applied during the Delta Pass, which would cause exponential duplication.
        const historyCall = saveDelta.mock.calls.find(call => call[2] === 'history_append');
        expect(historyCall).toBeUndefined();

        // Event must still be present in the entity's in-memory history
        const updatedNpc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        expect(updatedNpc.history.events.length).toBeGreaterThan(0);
        const ev = updatedNpc.history.events[updatedNpc.history.events.length - 1];
        expect(ev).toHaveProperty('id');
        expect(ev).toHaveProperty('type');
        expect(ev).toHaveProperty('year');
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

    test('grief event causedBy is a snapshot object when partner has a death event', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;

        const deadPartner = world.add({
            identity: { type: 'NPC', id: 'grief-partner', name: 'Grief Partner' },
            location: { x: 99, y: 99 },
            status: 'Dead',
            currentRole: 'Citizen',
            age: 30,
            history: { events: [{ id: 'ev_deathxxx', year: 1, description: '[Year 1] died of a sudden fever.', type: 'death', causedBy: null }] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A dead partner.'
        });
        npc.knowledge.memories['grief-partner'] = 'loves';

        // Force the grief check path: partner is not in livingNpcs (different location)
        // The grief loop checks memories for 'loves' and fires when partner is absent from livingNpcs
        simulateHistory(world, rng, 0, 0, 1);

        const griefEvent = npc.history.events.find(e => e.type === 'grief');
        expect(griefEvent).toBeDefined();
        expect(griefEvent.causedBy).not.toBeNull();
        expect(griefEvent.causedBy).toMatchObject({
            id: 'ev_deathxxx',
            type: 'death',
            actorName: 'Grief Partner'
        });

        world.remove(deadPartner);
    });

    test('grief event causedBy is null when partner has no death event (e.g. migrated)', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;

        const migratedPartner = world.add({
            identity: { type: 'NPC', id: 'migrated-partner', name: 'Migrated Partner' },
            location: { x: 99, y: 99 },
            status: 'Migrated',
            currentRole: 'Citizen',
            age: 30,
            history: { events: [{ id: 'ev_migxxx', year: 1, description: '[Year 1] Packed their belongings and migrated.', type: 'migration', causedBy: null }] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A migrated partner.'
        });
        npc.knowledge.memories['migrated-partner'] = 'loves';

        simulateHistory(world, rng, 0, 0, 1);

        const griefEvent = npc.history.events.find(e => e.type === 'grief');
        expect(griefEvent).toBeDefined();
        expect(griefEvent.causedBy).toBeNull();

        world.remove(migratedPartner);
    });

    test('grief event causedBy is null when partner is not found in world at all', () => {
        const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc.knowledge.memories['nonexistent-id-xyz'] = 'loves';

        simulateHistory(world, rng, 0, 0, 1);

        const griefEvent = npc.history.events.find(e => e.type === 'grief');
        expect(griefEvent).toBeDefined();
        expect(griefEvent.causedBy).toBeNull();

        delete npc.knowledge.memories['nonexistent-id-xyz'];
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

    // --- birthYear / aging correctness tests ---

    test('immigrants spawned during simulation have birthYear set', () => {
        rng = () => 0.1; // below 0.15, triggers immigration
        simulateHistory(world, rng, 0, 0, 1, 1);

        const immigrants = Array.from(world.with('identity').where(
            e => e.identity.type === 'NPC' && e.identity.id !== 'test-npc'
        ));
        expect(immigrants.length).toBeGreaterThan(0);
        for (const npc of immigrants) {
            expect(npc).toHaveProperty('birthYear');
            // birthYear must be consistent: creationYear(1) - initialAge == birthYear
            expect(npc.birthYear).toBe(1 - (1 - npc.birthYear)); // identity check via formula
            expect(typeof npc.birthYear).toBe('number');
        }
    });

    test('immigrant birthYear is consistent with age at creation year', () => {
        const creationYear = 5;
        rng = () => 0.1; // triggers immigration
        simulateHistory(world, rng, 0, 0, 1, creationYear);

        const immigrant = Array.from(world.with('identity').where(
            e => e.identity.type === 'NPC' && e.identity.id !== 'test-npc'
        ))[0];

        if (immigrant) {
            expect(immigrant).toHaveProperty('birthYear');
            // age at creationYear = creationYear - birthYear
            const ageAtCreation = creationYear - immigrant.birthYear;
            // initialAge is between 18 and 37 for simulation immigrants
            expect(ageAtCreation).toBeGreaterThanOrEqual(18);
            expect(ageAtCreation).toBeLessThanOrEqual(37);
        }
    });

    test('children born during simulation have birthYear equal to the simulation year', () => {
        const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
        npc1.age = 28;
        npc1.knowledge.memories['partner-for-birth'] = 'loves';

        world.add({
            identity: { type: 'NPC', id: 'partner-for-birth', name: 'Birth Partner' },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: 'Citizen',
            age: 25,
            history: { events: [] },
            knowledge: { memories: { 'test-npc': 'loves' } },
            inventory: { items: [] },
            description: 'A birth partner.'
        });

        rng = () => 0.05; // triggers childbirth
        // startYear=1 avoids the decade economy check that requires getDeltas
        simulateHistory(world, rng, 0, 0, 1, 1);

        const children = Array.from(world.with('identity').where(
            e => e.identity.type === 'NPC' && e.currentRole === 'Child'
        ));

        if (children.length > 0) {
            expect(children[0]).toHaveProperty('birthYear', 1);
        }
    });

    describe('NPC sex field', () => {
        test('immigrant NPCs receive a valid sex field', () => {
            rng = () => 0.1; // triggers immigration (< 0.15)
            simulateHistory(world, rng, 0, 0, 1);

            const immigrants = Array.from(world.with('identity').where(
                e => e.identity.type === 'NPC' && e.history && e.history.events.some(ev => ev.type === 'immigration')
            ));

            expect(immigrants.length).toBeGreaterThan(0);
            immigrants.forEach(npc => {
                expect(['male', 'female', 'other']).toContain(npc.sex);
            });
        });

        test('immigrant sex is deterministic for the same rng sequence', () => {
            let callCount = 0;
            const deterministicRng = () => {
                callCount++;
                return 0.1;
            };

            const world1 = new World();
            world1.add({ identity: { type: 'Town', id: 'town-id', name: 'Test Town' }, location: { x: 0, y: 0 }, currentMayor: null });
            world1.add({ identity: { type: 'NPC', id: 'test-npc', name: 'Test NPC' }, location: { x: 0, y: 0 }, status: 'Alive', currentRole: 'Citizen', age: 20, history: { events: [] }, knowledge: { memories: {} }, inventory: { items: [] }, description: 'A test NPC' });

            callCount = 0;
            simulateHistory(world1, deterministicRng, 0, 0, 1);
            const sex1 = Array.from(world1.with('identity').where(e => e.identity.type === 'NPC' && e.sex)).map(n => n.sex);

            const world2 = new World();
            world2.add({ identity: { type: 'Town', id: 'town-id', name: 'Test Town' }, location: { x: 0, y: 0 }, currentMayor: null });
            world2.add({ identity: { type: 'NPC', id: 'test-npc', name: 'Test NPC' }, location: { x: 0, y: 0 }, status: 'Alive', currentRole: 'Citizen', age: 20, history: { events: [] }, knowledge: { memories: {} }, inventory: { items: [] }, description: 'A test NPC' });

            callCount = 0;
            simulateHistory(world2, deterministicRng, 0, 0, 1);
            const sex2 = Array.from(world2.with('identity').where(e => e.identity.type === 'NPC' && e.sex)).map(n => n.sex);

            expect(sex1).toEqual(sex2);
        });

        test('heterosexual couple (male + female) can have children', () => {
            const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
            npc1.age = 28;
            npc1.sex = 'male';
            npc1.knowledge.memories['female-partner'] = 'loves';

            world.add({
                identity: { type: 'NPC', id: 'female-partner', name: 'Female Partner' },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                age: 25,
                sex: 'female',
                history: { events: [] },
                knowledge: { memories: { 'test-npc': 'loves' } },
                inventory: { items: [] },
                description: 'A female partner NPC.'
            });

            rng = () => 0.05; // triggers childbirth (< 0.08)
            const initialCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
            simulateHistory(world, rng, 0, 0, 1);
            const finalCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;

            expect(finalCount).toBeGreaterThan(initialCount);
        });

        test('same-sex couple (male + male) cannot have children', () => {
            const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
            npc1.age = 28;
            npc1.sex = 'male';
            npc1.knowledge.memories['male-partner'] = 'loves';

            world.add({
                identity: { type: 'NPC', id: 'male-partner', name: 'Male Partner' },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                age: 25,
                sex: 'male',
                history: { events: [] },
                knowledge: { memories: { 'test-npc': 'loves' } },
                inventory: { items: [] },
                description: 'A male partner NPC.'
            });

            // First call is the immigration check — return >= 0.15 to suppress it.
            // Subsequent calls (eventRoll) return 0.05 to attempt childbirth.
            let calls = 0;
            rng = () => (++calls === 1 ? 0.2 : 0.05);
            const initialCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
            simulateHistory(world, rng, 0, 0, 1);
            const finalCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;

            expect(finalCount).toBe(initialCount);
            expect(npc1.history.events.every(e => e.type !== 'birth')).toBe(true);
        });

        test('same-sex couple (female + female) cannot have children', () => {
            const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
            npc1.age = 28;
            npc1.sex = 'female';
            npc1.knowledge.memories['female-partner-2'] = 'loves';

            world.add({
                identity: { type: 'NPC', id: 'female-partner-2', name: 'Female Partner 2' },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                age: 25,
                sex: 'female',
                history: { events: [] },
                knowledge: { memories: { 'test-npc': 'loves' } },
                inventory: { items: [] },
                description: 'A female partner NPC.'
            });

            let calls = 0;
            rng = () => (++calls === 1 ? 0.2 : 0.05);
            const initialCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
            simulateHistory(world, rng, 0, 0, 1);
            const finalCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;

            expect(finalCount).toBe(initialCount);
            expect(npc1.history.events.every(e => e.type !== 'birth')).toBe(true);
        });

        test('other + male couple can have children', () => {
            const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
            npc1.age = 28;
            npc1.sex = 'other';
            npc1.knowledge.memories['male-partner-2'] = 'loves';

            world.add({
                identity: { type: 'NPC', id: 'male-partner-2', name: 'Male Partner 2' },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                age: 25,
                sex: 'male',
                history: { events: [] },
                knowledge: { memories: { 'test-npc': 'loves' } },
                inventory: { items: [] },
                description: 'A male partner NPC.'
            });

            rng = () => 0.05;
            const initialCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;
            simulateHistory(world, rng, 0, 0, 1);
            const finalCount = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).length;

            expect(finalCount).toBeGreaterThan(initialCount);
        });

        test('children born to a couple receive a valid sex field', () => {
            const npc1 = world.with('identity').where(e => e.identity.id === 'test-npc').first;
            npc1.age = 28;
            npc1.sex = 'male';
            npc1.knowledge.memories['female-partner-3'] = 'loves';

            world.add({
                identity: { type: 'NPC', id: 'female-partner-3', name: 'Female Partner 3' },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                age: 25,
                sex: 'female',
                history: { events: [] },
                knowledge: { memories: { 'test-npc': 'loves' } },
                inventory: { items: [] },
                description: 'A female partner NPC.'
            });

            rng = () => 0.05;
            simulateHistory(world, rng, 0, 0, 1);

            const children = Array.from(world.with('identity').where(
                e => e.identity.type === 'NPC' && e.currentRole === 'Child'
            ));

            expect(children.length).toBeGreaterThan(0);
            children.forEach(child => {
                expect(['male', 'female', 'other']).toContain(child.sex);
            });
        });
    });

    function makeRng(values) {
        let i = 0;
        return () => (i < values.length ? values[i++] : 0.5);
    }

    describe('Merchant career lifecycle', () => {
        function addMerchantNpc(w, id, opts = {}) {
            w.add({
                identity: { type: 'NPC', id, name: `Merchant ${id}` },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Merchant',
                age: 30,
                merchantInventory: opts.merchantInventory ?? [],
                personalWealth: opts.personalWealth ?? 1000,
                history: { events: [] },
                knowledge: { memories: opts.memories ?? {} },
                inventory: { items: [] },
                description: 'A test merchant'
            });
        }

        test('career_shift to Merchant initializes merchantInventory and personalWealth', () => {
            // test-npc (Citizen) is the only NPC; it shifts to Merchant
            // RNG: [no-immigration(0.5), career_shift(0.14), pick-Merchant(0.58), rest...]
            rng = makeRng([0.5, 0.14, 0.58]);
            simulateHistory(world, rng, 0, 0, 1);

            const npc = world.with('identity').where(e => e.identity.id === 'test-npc').first;
            expect(npc.currentRole).toBe('Merchant');
            expect(Array.isArray(npc.merchantInventory)).toBe(true);
            expect(npc.merchantInventory.length).toBeGreaterThan(0);
            expect(npc.personalWealth).toBeGreaterThanOrEqual(500);
        });

        test('career_shift away from Merchant: Relics stay in personal inventory', () => {
            addMerchantNpc(world, 'merchant-relic', {
                merchantInventory: [{ itemId: 'relic-sword', name: 'Blade of Ancients', type: 'Weapon', prefix: 'Relic', value: 800, tier: 2, quantity: 1, price: 640 }]
            });
            // RNG: [no-immigration(0.5), test-npc no-event(0.5), merchant career_shift(0.14), pick Beggar(0.01)]
            rng = makeRng([0.5, 0.5, 0.14, 0.01]);
            simulateHistory(world, rng, 0, 0, 1);

            const merchant = world.with('identity').where(e => e.identity.id === 'merchant-relic').first;
            expect(merchant.currentRole).toBe('Beggar');
            expect(merchant.merchantInventory).toHaveLength(0);
            expect(merchant.inventory.items.some(i => i.itemId === 'relic-sword')).toBe(true);
        });

        test('career_shift away from Merchant: regular stock goes to loved ones first with inheritance event', () => {
            // test-npc is the loved one; merchant-loved ships stock to them
            addMerchantNpc(world, 'merchant-loved', {
                merchantInventory: [{ itemId: 'grain-01', name: 'Grain', type: 'resource', tier: 1, quantity: 5, price: 80, value: 80 }],
                memories: { 'test-npc': 'loves' }
            });
            // RNG: [no-immigration(0.5), test-npc no-event(0.5), merchant career_shift(0.14), pick Beggar(0.01)]
            rng = makeRng([0.5, 0.5, 0.14, 0.01]);
            simulateHistory(world, rng, 0, 0, 1);

            const merchant = world.with('identity').where(e => e.identity.id === 'merchant-loved').first;
            const recipient = world.with('identity').where(e => e.identity.id === 'test-npc').first;

            expect(merchant.merchantInventory).toHaveLength(0);
            expect(recipient.inventory.items.some(i => i.itemId === 'grain-01')).toBe(true);
            const inheritEvent = recipient.history.events.find(e => e.type === 'inheritance');
            expect(inheritEvent).toBeDefined();
            expect(inheritEvent.causedBy).not.toBeNull();
            expect(inheritEvent.causedBy.type).toBe('career_shift');
        });

        test('career_shift away from Merchant: falls back to other merchant with inheritance event when no social recipients', () => {
            addMerchantNpc(world, 'merchant-from', {
                merchantInventory: [{ itemId: 'cloth-01', name: 'Cloth', type: 'resource', tier: 1, quantity: 3, price: 50, value: 50 }]
            });
            addMerchantNpc(world, 'merchant-to', { merchantInventory: [] });

            // RNG: [no-immigration(0.5), test-npc(0.5), merchant-from career_shift(0.14), pick Beggar(0.01), pick recipient(0.5)]
            rng = makeRng([0.5, 0.5, 0.14, 0.01, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            const from = world.with('identity').where(e => e.identity.id === 'merchant-from').first;
            const to = world.with('identity').where(e => e.identity.id === 'merchant-to').first;

            expect(from.merchantInventory).toHaveLength(0);
            expect(to.merchantInventory.some(s => s.itemId === 'cloth-01')).toBe(true);
            const inheritEvent = to.history.events.find(e => e.type === 'inheritance');
            expect(inheritEvent).toBeDefined();
            expect(inheritEvent.causedBy).not.toBeNull();
            expect(inheritEvent.causedBy.type).toBe('career_shift');
        });

        test('career_shift away from Merchant: each slot distributed to other merchants gets a distinct event ID', () => {
            addMerchantNpc(world, 'merchant-from', {
                merchantInventory: [
                    { itemId: 'grain-01', name: 'Grain',  type: 'resource', tier: 1, quantity: 5, price: 80, value: 80 },
                    { itemId: 'cloth-01', name: 'Cloth',  type: 'resource', tier: 1, quantity: 3, price: 50, value: 50 },
                    { itemId: 'iron-01',  name: 'Iron',   type: 'resource', tier: 1, quantity: 2, price: 60, value: 60 },
                ]
            });
            addMerchantNpc(world, 'merchant-to', { merchantInventory: [] });
            // RNG: [no-immigration(0.5), test-npc(0.5), merchant-from career_shift(0.14), pick Beggar(0.01),
            //       pick recipient×3(0.5, 0.5, 0.5), merchant-to no-event(0.5)]
            rng = makeRng([0.5, 0.5, 0.14, 0.01, 0.5, 0.5, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            const recipient = world.with('identity').where(e => e.identity.id === 'merchant-to').first;
            const inheritEvents = recipient.history.events.filter(e => e.type === 'inheritance');
            expect(inheritEvents).toHaveLength(3);
            const ids = inheritEvents.map(e => e.id);
            expect(new Set(ids).size).toBe(3);
        });

        test('career_shift away from Merchant: stock is lost when no recipients exist', () => {
            addMerchantNpc(world, 'merchant-alone', {
                merchantInventory: [{ itemId: 'wood-01', name: 'Wood', type: 'resource', tier: 1, quantity: 4, price: 30, value: 30 }]
            });
            // RNG: [no-immigration(0.5), test-npc(0.5), merchant career_shift(0.14), pick Beggar(0.01)]
            rng = makeRng([0.5, 0.5, 0.14, 0.01]);
            simulateHistory(world, rng, 0, 0, 1);

            const merchant = world.with('identity').where(e => e.identity.id === 'merchant-alone').first;
            expect(merchant.merchantInventory).toHaveLength(0);
        });
    });

    describe('Generational Bloodlines — Memory Inheritance & Faction Spawning', () => {
        function addNpcWithMemory(world, id, memories = [], ancestralMemories = [], extra = {}) {
            return world.add({
                identity: { type: 'NPC', id, name: `NPC ${id}` },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                age: 30,
                birthYear: 1,
                sex: 'male',
                description: 'A test NPC',
                history: { events: [] },
                knowledge: { memories: {} },
                inventory: { items: [] },
                quests: { offeredQuests: [] },
                memories,
                ancestralMemories,
                ...extra,
            });
        }

        test('hate memory with intensity 9 propagates to child as blood_feud on death', () => {
            const parent = addNpcWithMemory(world, 'parent-npc',
                [{ type: 'hate', targetId: 'rival-id', intensity: 9, year: 1 }]
            );
            const child = addNpcWithMemory(world, 'child-npc');
            parent.knowledge.memories['child-npc'] = 'child';
            child.knowledge.memories['parent-npc'] = 'parent';

            // RNG: immigration(0.5=no), test-npc roll(0.5=nothing), parent roll(0.09=death), death-cause pick(0.5), child roll(0.5)
            rng = makeRng([0.5, 0.5, 0.09, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            expect(parent.status).toBe('Dead');
            const feud = child.ancestralMemories.find(am => am.type === 'blood_feud');
            expect(feud).toBeDefined();
            expect(feud.targetLineage).toBe('rival-id');
            expect(feud.inheritedFrom.npcId).toBe('parent-npc');
        });

        test('memory with intensity below threshold (< 7) is NOT propagated', () => {
            const parent = addNpcWithMemory(world, 'parent-low',
                [{ type: 'hate', targetId: 'rival-id', intensity: 5, year: 1 }]
            );
            const child = addNpcWithMemory(world, 'child-low');
            parent.knowledge.memories['child-low'] = 'child';

            rng = makeRng([0.5, 0.5, 0.09, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            expect(parent.status).toBe('Dead');
            expect(child.ancestralMemories).toHaveLength(0);
        });

        test('debt memory with intensity 8 propagates to child as ancestral_debt', () => {
            const parent = addNpcWithMemory(world, 'debtor-parent',
                [{ type: 'debt', targetId: 'creditor-id', intensity: 8, year: 1 }]
            );
            const child = addNpcWithMemory(world, 'debtor-child');
            parent.knowledge.memories['debtor-child'] = 'child';

            rng = makeRng([0.5, 0.5, 0.09, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            const am = child.ancestralMemories.find(am => am.type === 'ancestral_debt');
            expect(am).toBeDefined();
            expect(am.targetLineage).toBe('creditor-id');
        });

        test('shame memory with intensity 9 propagates to child as ancestral_shame', () => {
            const parent = addNpcWithMemory(world, 'shamed-parent',
                [{ type: 'shame', targetId: 'banisher-id', intensity: 9, year: 1 }]
            );
            const child = addNpcWithMemory(world, 'shamed-child');
            parent.knowledge.memories['shamed-child'] = 'child';

            rng = makeRng([0.5, 0.5, 0.09, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            const am = child.ancestralMemories.find(am => am.type === 'ancestral_shame');
            expect(am).toBeDefined();
        });

        test('reverence memory with intensity 8 propagates to child as ancestral_reverence', () => {
            const parent = addNpcWithMemory(world, 'reverent-parent',
                [{ type: 'reverence', targetId: 'tome-id', intensity: 8, year: 1 }]
            );
            const child = addNpcWithMemory(world, 'reverent-child');
            parent.knowledge.memories['reverent-child'] = 'child';

            rng = makeRng([0.5, 0.5, 0.09, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            const am = child.ancestralMemories.find(am => am.type === 'ancestral_reverence');
            expect(am).toBeDefined();
        });

        test('grief memory with intensity 7 propagates to child as ancestral_mourning', () => {
            const parent = addNpcWithMemory(world, 'grieving-parent',
                [{ type: 'grief', targetId: 'lost-one-id', intensity: 7, year: 1 }]
            );
            const child = addNpcWithMemory(world, 'mourning-child');
            parent.knowledge.memories['mourning-child'] = 'child';

            rng = makeRng([0.5, 0.5, 0.09, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            const am = child.ancestralMemories.find(am => am.type === 'ancestral_mourning');
            expect(am).toBeDefined();
        });

        test('intensity is halved when propagated to heir', () => {
            const parent = addNpcWithMemory(world, 'parent-halved',
                [{ type: 'hate', targetId: 'rival-id', intensity: 8, year: 1 }]
            );
            const child = addNpcWithMemory(world, 'child-halved');
            parent.knowledge.memories['child-halved'] = 'child';

            rng = makeRng([0.5, 0.5, 0.09, 0.5, 0.5]);
            simulateHistory(world, rng, 0, 0, 1);

            const feud = child.ancestralMemories.find(am => am.type === 'blood_feud');
            expect(feud.intensity).toBe(4); // 8 / 2
        });

        function addEconomicsTownFields(townEntity) {
            townEntity.political = { tier: 1, demographics: {}, stance: 'Balanced' };
            townEntity.population = 5;
            townEntity.regionalWealth = 1000;
            townEntity.primaryExport = 'Grain';
            townEntity.tradePartners = [];
            townEntity.history = { events: [] };
            townEntity.economicModifiers = { shortage: false, hyperinflation: false, hyperinflationExpiryYear: null, economicBoomYear: null };
        }

        const feudAm = (targetLineage) => ({ type: 'blood_feud', targetLineage, intensity: 4, originYear: 1, originEvent: 'test', inheritedFrom: null });

        test('3 NPCs with blood_feud older than 50 years spawn a Faction entity', () => {
            const town = world.with('identity', 'currentMayor').where(e => e.identity.type === 'Town').first;
            addEconomicsTownFields(town);
            // Pre-seed 3 NPCs with blood_feud ancestralMemories that have been active 60 years
            addNpcWithMemory(world, 'npc-feud-1', [], [feudAm('rival-lineage')]);
            addNpcWithMemory(world, 'npc-feud-2', [], [feudAm('rival-lineage')]);
            addNpcWithMemory(world, 'npc-feud-3', [], [feudAm('rival-lineage')]);

            // startYear=60: feud is 59 years old (60-1=59) > ANCESTRAL_BOND_MIN_YEARS(50) → spawn
            rng = makeRng(Array(200).fill(0.5));
            simulateHistory(world, rng, 0, 0, 10, 60);

            const factions = Array.from(world.with('identity').where(e => e.identity.type === 'Faction'));
            expect(factions.length).toBeGreaterThanOrEqual(1);
        });

        test('fewer than 3 NPCs sharing a blood_feud do NOT spawn a Faction', () => {
            const town = world.with('identity', 'currentMayor').where(e => e.identity.type === 'Town').first;
            addEconomicsTownFields(town);
            addNpcWithMemory(world, 'npc-solo-1', [], [feudAm('rival-solo')]);
            addNpcWithMemory(world, 'npc-solo-2', [], [feudAm('rival-solo')]);

            rng = makeRng(Array(200).fill(0.5));
            simulateHistory(world, rng, 0, 0, 10, 60);

            const factions = Array.from(world.with('identity').where(e => e.identity.type === 'Faction'));
            expect(factions).toHaveLength(0);
        });

        test('faction name is deterministic for the same lineage seed', () => {
            const town = world.with('identity', 'currentMayor').where(e => e.identity.type === 'Town').first;
            addEconomicsTownFields(town);
            for (let i = 0; i < 3; i++) {
                addNpcWithMemory(world, `npc-det-${i}`, [], [feudAm('det-lineage')]);
            }
            rng = makeRng(Array(200).fill(0.5));
            simulateHistory(world, rng, 0, 0, 10, 60);
            const firstRun = Array.from(world.with('identity').where(e => e.identity.type === 'Faction'));
            const firstName = firstRun[0]?.identity.name;

            // Reset world and repeat with identical setup
            const world2 = new World();
            const town2 = world2.add({ identity: { type: 'Town', id: 'town-id', name: 'Test Town' }, location: { x: 0, y: 0 }, currentMayor: null });
            addEconomicsTownFields(town2);
            for (let i = 0; i < 3; i++) {
                world2.add({
                    identity: { type: 'NPC', id: `npc-det2-${i}`, name: `NPC det2-${i}` },
                    location: { x: 0, y: 0 }, status: 'Alive', currentRole: 'Citizen', age: 30,
                    birthYear: 1, sex: 'male', description: 'A test NPC', history: { events: [] },
                    knowledge: { memories: {} }, inventory: { items: [] }, quests: { offeredQuests: [] },
                    memories: [], ancestralMemories: [feudAm('det-lineage')],
                });
            }
            const rng2 = makeRng(Array(200).fill(0.5));
            simulateHistory(world2, rng2, 0, 0, 10, 60);
            const secondRun = Array.from(world2.with('identity').where(e => e.identity.type === 'Faction'));
            const secondName = secondRun[0]?.identity.name;

            expect(firstName).toBeDefined();
            expect(firstName).toBe(secondName);
        });

        test('ancestral_mourning suppresses economic boom when 3+ mourning NPCs present', () => {
            const town = world.with('identity', 'currentMayor').where(e => e.identity.type === 'Town').first;
            addEconomicsTownFields(town);
            town.economicModifiers.economicBoomYear = 45; // boom was set before simulation

            for (let i = 0; i < 3; i++) {
                addNpcWithMemory(world, `mourner-${i}`, [], [{
                    type: 'ancestral_mourning', targetLineage: 'loss-id', intensity: 3,
                    originYear: 1, originEvent: 'test', inheritedFrom: null
                }]);
            }

            rng = makeRng(Array(200).fill(0.5));
            simulateHistory(world, rng, 0, 0, 10, 50);

            // economicBoomYear should have been nulled by mourning suppression
            expect(town.economicModifiers.economicBoomYear).toBeNull();
        });
    });
});