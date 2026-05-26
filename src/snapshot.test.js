// src/snapshot.test.js
const { World } = require('miniplex');
const { serializeECSState, deserializeECSState } = require('./snapshot');

function makeWorld() {
    return new World();
}

function addTown(world, x, y, overrides = {}) {
    return world.add({
        identity: { name: 'Testburg', type: 'Town', id: 'town001' },
        location: { x, y, parentId: null },
        history: { events: [{ id: 'ev_1', year: 1, description: '[Year 1] Founded.', type: 'founding', causedBy: null }] },
        currentMayor: 'Elder Mira',
        political: { tier: 2, demographics: { Guard: 0.5 }, stance: 'Balanced' },
        population: 3,
        regionalWealth: 800,
        primaryExport: 'Grain',
        tradePartners: ['world_X1_Y0'],
        economicModifiers: { shortage: false, hyperinflation: false, hyperinflationExpiryYear: null, economicBoomYear: null },
        ...overrides,
    });
}

function addNPC(world, x, y, id, overrides = {}) {
    return world.add({
        identity: { name: 'Aldric Stone', type: 'NPC', id },
        location: { x, y, parentId: null },
        description: 'A tall warrior.',
        status: 'Alive',
        currentRole: 'Guard',
        age: 34,
        birthYear: 17,
        sex: 'male',
        biome: 'Mountain',
        history: { events: [] },
        knowledge: { memories: { town001: 'likes' } },
        inventory: { items: [{ id: 'sword1', name: 'Iron Sword', type: 'Weapon', quantity: 1 }] },
        quests: { offeredQuests: [] },
        memories: [{ type: 'love', targetId: 'npc002', intensity: 9, year: 30 }],
        ancestralMemories: [],
        ...overrides,
    });
}

function addFaction(world, x, y, overrides = {}) {
    return world.add({
        identity: { name: 'The Iron Circle', type: 'Faction', id: 'fac001' },
        location: { x, y, parentId: null },
        members: ['npc001', 'npc002'],
        history: { events: [] },
        targetLineage: 'npc003',
        factionType: 'blood_feud',
        foundedYear: 60,
        rootAncestor: { npcId: 'npc001', npcName: 'Aldric Stone', year: 60 },
        ...overrides,
    });
}

describe('serializeECSState / deserializeECSState round-trip', () => {
    test('serializes and restores a Town entity', () => {
        const world = makeWorld();
        addTown(world, 5, 5);

        const blob = serializeECSState(world, 5, 5);
        expect(blob.towns).toHaveLength(1);
        const t = blob.towns[0];
        expect(t.identity.name).toBe('Testburg');
        expect(t.identity.type).toBe('Town');
        expect(t.location.x).toBe(5);
        expect(t.location.y).toBe(5);
        expect(t.location.parentId).toBeNull();
        expect(t.currentMayor).toBe('Elder Mira');
        expect(t.political.tier).toBe(2);
        expect(t.regionalWealth).toBe(800);
        expect(t.primaryExport).toBe('Grain');
    });

    test('serializes and restores an NPC entity', () => {
        const world = makeWorld();
        addTown(world, 3, 3);
        addNPC(world, 3, 3, 'npc001');

        const blob = serializeECSState(world, 3, 3);
        expect(blob.npcs).toHaveLength(1);
        const n = blob.npcs[0];
        expect(n.identity.id).toBe('npc001');
        expect(n.status).toBe('Alive');
        expect(n.age).toBe(34);
        expect(n.birthYear).toBe(17);
        expect(n.sex).toBe('male');
        expect(n.biome).toBe('Mountain');
        expect(n.knowledge.memories).toEqual({ town001: 'likes' });
        expect(n.inventory.items).toHaveLength(1);
        expect(n.memories).toHaveLength(1);
        expect(n.memories[0].type).toBe('love');
        expect(n.location.parentId).toBeNull();
    });

    test('serializes and restores a Faction entity', () => {
        const world = makeWorld();
        addTown(world, 2, 2);
        addFaction(world, 2, 2);

        const blob = serializeECSState(world, 2, 2);
        expect(blob.factions).toHaveLength(1);
        const f = blob.factions[0];
        expect(f.identity.id).toBe('fac001');
        expect(f.factionType).toBe('blood_feud');
        expect(f.members).toEqual(['npc001', 'npc002']);
        expect(f.targetLineage).toBe('npc003');
        expect(f.foundedYear).toBe(60);
    });

    test('deserializes into a fresh world and entities are queryable', () => {
        const worldA = makeWorld();
        addTown(worldA, 7, 7);
        addNPC(worldA, 7, 7, 'npc001');
        addFaction(worldA, 7, 7);

        const blob = serializeECSState(worldA, 7, 7);

        const worldB = makeWorld();
        deserializeECSState(worldB, blob);

        const town = worldB.with('identity').where(e => e.identity.type === 'Town').first;
        expect(town).toBeDefined();
        expect(town.identity.name).toBe('Testburg');
        expect(town.political.tier).toBe(2);

        const npc = worldB.with('identity').where(e => e.identity.type === 'NPC').first;
        expect(npc).toBeDefined();
        expect(npc.identity.id).toBe('npc001');
        expect(npc.age).toBe(34);
        expect(npc.inventory.items).toHaveLength(1);
        expect(npc.memories[0].intensity).toBe(9);

        const faction = worldB.with('identity').where(e => e.identity.type === 'Faction').first;
        expect(faction).toBeDefined();
        expect(faction.identity.id).toBe('fac001');
    });

    test('round-trip preserves NPC history events', () => {
        const world = makeWorld();
        addTown(world, 1, 1);
        addNPC(world, 1, 1, 'npc_hist', {
            history: {
                events: [
                    { id: 'ev_a', year: 10, description: '[Year 10] Formed a bond.', type: 'friendship', causedBy: null },
                    { id: 'ev_b', year: 20, description: '[Year 20] Fell in love.', type: 'romance', causedBy: null },
                ],
            },
        });

        const blob = serializeECSState(world, 1, 1);
        const worldB = makeWorld();
        deserializeECSState(worldB, blob);

        const npc = worldB.with('identity').where(e => e.identity.id === 'npc_hist').first;
        expect(npc.history.events).toHaveLength(2);
        expect(npc.history.events[0].id).toBe('ev_a');
        expect(npc.history.events[1].type).toBe('romance');
    });

    test('does not include entities from other coordinates', () => {
        const world = makeWorld();
        addTown(world, 4, 4);
        addNPC(world, 4, 4, 'npc_here');
        addTown(world, 9, 9);
        addNPC(world, 9, 9, 'npc_elsewhere');

        const blob = serializeECSState(world, 4, 4);
        expect(blob.npcs).toHaveLength(1);
        expect(blob.npcs[0].identity.id).toBe('npc_here');
        expect(blob.towns).toHaveLength(1);
        expect(blob.towns[0].location.x).toBe(4);
    });

    test('handles Dead and Migrated NPCs without error', () => {
        const world = makeWorld();
        addTown(world, 0, 0);
        addNPC(world, 0, 0, 'npc_dead', { status: 'Dead' });
        addNPC(world, 0, 0, 'npc_migrated', { status: 'Migrated' });
        addNPC(world, 0, 0, 'npc_alive', { status: 'Alive' });

        const blob = serializeECSState(world, 0, 0);
        expect(blob.npcs).toHaveLength(3);

        const worldB = makeWorld();
        deserializeECSState(worldB, blob);
        const npcs = Array.from(worldB.with('identity').where(e => e.identity.type === 'NPC'));
        expect(npcs).toHaveLength(3);
        const statuses = npcs.map(n => n.status).sort();
        expect(statuses).toEqual(['Alive', 'Dead', 'Migrated']);
    });

    test('handles Merchant NPCs with personalWealth and merchantInventory', () => {
        const world = makeWorld();
        addTown(world, 6, 6);
        addNPC(world, 6, 6, 'npc_merchant', {
            currentRole: 'Merchant',
            personalWealth: 1500,
            merchantInventory: [{ itemId: 'item1', name: 'Silk', quantity: 3, value: 200 }],
        });

        const blob = serializeECSState(world, 6, 6);
        const worldB = makeWorld();
        deserializeECSState(worldB, blob);

        const npc = worldB.with('identity').where(e => e.identity.id === 'npc_merchant').first;
        expect(npc.personalWealth).toBe(1500);
        expect(npc.merchantInventory).toHaveLength(1);
        expect(npc.merchantInventory[0].name).toBe('Silk');
    });

    test('handles District entities', () => {
        const world = makeWorld();
        world.add({
            identity: { name: 'East Quarter', type: 'District', id: 'dist001' },
            location: { x: 8, y: 8, parentId: null },
            history: { events: [] },
            currentMayor: 'Lord Vane',
            political: { tier: 1, demographics: {}, stance: 'Balanced' },
            population: 2,
            districtType: 'Military',
            parentCity: 'world_X7_Y7',
        });

        const blob = serializeECSState(world, 8, 8);
        expect(blob.towns).toHaveLength(1);
        const t = blob.towns[0];
        expect(t.identity.type).toBe('District');
        expect(t.districtType).toBe('Military');
        expect(t.parentCity).toBe('world_X7_Y7');

        const worldB = makeWorld();
        deserializeECSState(worldB, blob);
        const district = worldB.with('identity').where(e => e.identity.type === 'District').first;
        expect(district).toBeDefined();
        expect(district.districtType).toBe('Military');
        expect(district.parentCity).toBe('world_X7_Y7');
    });

    test('blob is JSON-serializable (no circular references)', () => {
        const world = makeWorld();
        addTown(world, 0, 0);
        addNPC(world, 0, 0, 'npc_circ');

        const blob = serializeECSState(world, 0, 0);
        expect(() => JSON.stringify(blob)).not.toThrow();
        const parsed = JSON.parse(JSON.stringify(blob));
        expect(parsed.npcs).toHaveLength(1);
    });
});
