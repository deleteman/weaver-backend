// src/population.test.js
const { replenishPopulationIfNeeded } = require('./population');
const { PoliticalEngine } = require('./politics');
const { World } = require('miniplex');
const seedrandom = require('seedrandom');

function makeWorld(x, y, npcCount, tier) {
    const world = new World();
    const town = world.add({
        identity: { id: 'town1', name: 'Test Town', type: 'Town' },
        location: { x, y },
        political: { tier, demographics: {}, stance: 'Balanced' }
    });
    for (let i = 0; i < npcCount; i++) {
        world.add({
            identity: { id: `npc${i}`, name: `NPC ${i}`, type: 'NPC' },
            location: { x, y },
            status: 'Alive',
            currentRole: 'Citizen',
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] },
            description: 'A test NPC'
        });
    }
    return { world, town };
}

function livingCount(world, x, y) {
    return Array.from(world.with('identity', 'status')
        .where(e => e.location.x === x && e.location.y === y && e.identity.type === 'NPC' && e.status === 'Alive')).length;
}

describe('Tier-aware population replenishment', () => {
    test('tier-1 town with population 6 does NOT trigger replenishment (above floor of 5)', () => {
        const { world, town } = makeWorld(0, 0, 6, 1);
        const rng = seedrandom('pop-test-1');
        const before = livingCount(world, 0, 0);
        replenishPopulationIfNeeded(world, 0, 0, rng, town, 'Plains', 10);
        expect(livingCount(world, 0, 0)).toBe(before);
    });

    test('tier-4 town with population 6 DOES trigger replenishment (below floor of 20)', () => {
        const { world, town } = makeWorld(0, 0, 6, 4);
        const rng = seedrandom('pop-test-2');
        const before = livingCount(world, 0, 0);
        replenishPopulationIfNeeded(world, 0, 0, rng, town, 'Plains', 10);
        expect(livingCount(world, 0, 0)).toBeGreaterThan(before);
    });

    test('higher tier spawns more NPCs per replenishment than lower tier', () => {
        const rng1 = seedrandom('spawn-count-tier1');
        const rng2 = seedrandom('spawn-count-tier1'); // same seed so calls are comparable
        const { world: w1, town: t1 } = makeWorld(1, 0, 0, 1);
        const { world: w2, town: t2 } = makeWorld(2, 0, 0, 5);

        replenishPopulationIfNeeded(w1, 1, 0, rng1, t1, 'Plains', 10);
        replenishPopulationIfNeeded(w2, 2, 0, rng2, t2, 'Plains', 10);

        const spawnedTier1 = livingCount(w1, 1, 0);
        const spawnedTier5 = livingCount(w2, 2, 0);
        expect(spawnedTier5).toBeGreaterThanOrEqual(spawnedTier1);
    });

    test('tier-3 town with 4 NPCs receives new settlers (below floor of 15)', () => {
        const { world, town } = makeWorld(0, 0, 4, 3);
        const rng = seedrandom('pop-test-3');
        replenishPopulationIfNeeded(world, 0, 0, rng, town, 'Forest', 50);
        expect(livingCount(world, 0, 0)).toBeGreaterThan(5); // exceeds tier-1 baseline
    });

    test('replenishment is deterministic — same seed always spawns same count', () => {
        const { world: w1, town: t1 } = makeWorld(0, 0, 2, 2);
        const { world: w2, town: t2 } = makeWorld(0, 0, 2, 2);
        replenishPopulationIfNeeded(w1, 0, 0, seedrandom('det-seed'), t1, 'Plains', 20);
        replenishPopulationIfNeeded(w2, 0, 0, seedrandom('det-seed'), t2, 'Plains', 20);
        expect(livingCount(w1, 0, 0)).toBe(livingCount(w2, 0, 0));
    });

    test('replenishment-spawned NPCs have a valid sex field', () => {
        const { world, town } = makeWorld(0, 0, 2, 4);
        const before = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).map(n => n.identity.id);
        replenishPopulationIfNeeded(world, 0, 0, seedrandom('sex-test'), town, 'Plains', 10);
        const newNpcs = Array.from(world.with('identity').where(
            e => e.identity.type === 'NPC' && !before.includes(e.identity.id)
        ));
        expect(newNpcs.length).toBeGreaterThan(0);
        newNpcs.forEach(npc => {
            expect(['male', 'female', 'other']).toContain(npc.sex);
        });
    });

    test('refugee arrival event is a structured migration object, not a plain string', () => {
        const CURRENT_YEAR = 42;
        const { world, town } = makeWorld(0, 0, 0, 1);
        const before = Array.from(world.with('identity').where(e => e.identity.type === 'NPC')).map(n => n.identity.id);
        replenishPopulationIfNeeded(world, 0, 0, seedrandom('refugee-event'), town, 'Plains', CURRENT_YEAR);
        const newNpcs = Array.from(world.with('identity').where(
            e => e.identity.type === 'NPC' && !before.includes(e.identity.id)
        ));
        expect(newNpcs.length).toBeGreaterThan(0);
        newNpcs.forEach(npc => {
            const firstEvent = npc.history.events[0];
            expect(typeof firstEvent).toBe('object');
            expect(firstEvent).toMatchObject({
                id: expect.stringMatching(/^ev_/),
                year: CURRENT_YEAR,
                description: expect.stringContaining('Arrived as a refugee'),
                type: 'migration',
                causedBy: null
            });
        });
    });
});

describe('PoliticalEngine.shouldDemote()', () => {
    test('tier-1 settlement never demotes regardless of population', () => {
        expect(PoliticalEngine.shouldDemote({ tier: 1, population: 0 })).toBe(false);
        expect(PoliticalEngine.shouldDemote({ tier: 1, population: 1 })).toBe(false);
    });

    test('tier-3 settlement with population 8 demotes (below 3 * 5 = 15)', () => {
        expect(PoliticalEngine.shouldDemote({ tier: 3, population: 8 })).toBe(true);
    });

    test('tier-3 settlement with population 16 does NOT demote (above 3 * 5 = 15)', () => {
        expect(PoliticalEngine.shouldDemote({ tier: 3, population: 16 })).toBe(false);
    });

    test('exact boundary: population === tier * 5 does NOT demote', () => {
        expect(PoliticalEngine.shouldDemote({ tier: 2, population: 10 })).toBe(false);
        expect(PoliticalEngine.shouldDemote({ tier: 4, population: 20 })).toBe(false);
    });

    test('one below boundary triggers demotion', () => {
        expect(PoliticalEngine.shouldDemote({ tier: 2, population: 9 })).toBe(true);
        expect(PoliticalEngine.shouldDemote({ tier: 4, population: 19 })).toBe(true);
    });

    test('tier-5 kingdom with 24 NPCs demotes (below 5 * 5 = 25)', () => {
        expect(PoliticalEngine.shouldDemote({ tier: 5, population: 24 })).toBe(true);
    });
});
