// src/artifact-effects.test.js
const { World } = require('miniplex');
const { ArtifactEffects } = require('./artifact-effects');

jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    upsertDelta: jest.fn(),
    getTierForCoordinate: jest.fn(() => 0),
    getDeltas: jest.fn(() => [])
}));

jest.mock('./logger', () => ({ log: jest.fn() }));

const STRUCTURED_EVENT = {
    id: expect.stringMatching(/^ev_/),
    year: expect.any(Number),
    description: expect.any(String),
    type: expect.any(String),
    causedBy: null
};

describe('ArtifactEffects', () => {
    let world;

    beforeEach(() => {
        world = new World();
        world.add({
            identity: { type: 'Town', id: 'town-01', name: 'Test Town' },
            location: { x: 0, y: 0 },
            primaryExport: 'Grain',
            currentMayor: null
        });
    });

    function makeNpc(id, role, extra = {}) {
        return world.add({
            identity: { type: 'NPC', id, name: `NPC ${id}` },
            location: { x: 0, y: 0 },
            status: 'Alive',
            currentRole: role,
            age: 30,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            description: 'A test NPC',
            ...extra
        });
    }

    describe('applyTomeEffect', () => {
        test('converts Citizen to Scholar without pushing a history event (caller owns the event)', () => {
            const npc = makeNpc('npc-tome', 'Citizen');
            const artifact = { name: 'Tome of Enlightenment' };
            const rng = () => 0.5; // < 0.75 → triggers conversion

            ArtifactEffects.applyTomeEffect(world, 0, 0, artifact, npc, rng);

            expect(npc.currentRole).toBe('Scholar');
            expect(npc.history.events).toHaveLength(0);
        });

        test('does not push an event when conversion is skipped', () => {
            const npc = makeNpc('npc-tome-skip', 'Citizen');
            const artifact = { name: 'Tome of Enlightenment' };
            const rng = () => 0.8; // >= 0.75 → no conversion

            ArtifactEffects.applyTomeEffect(world, 0, 0, artifact, npc, rng);

            expect(npc.currentRole).toBe('Citizen');
            expect(npc.history.events).toHaveLength(0);
        });
    });

    describe('applyJewelryEffect', () => {
        test('corrupting to Merchant initializes merchantInventory and personalWealth', () => {
            const npc = makeNpc('npc-jewelry', 'Citizen');
            const artifact = { name: 'Cursed Ring' };

            // Force corruption roll (< 0.3) and pick Merchant (index 3 from 4-item list)
            // potentialRoles: ["Guard","Cultist","Bandit","Merchant"] → index 3 = Merchant
            // floor(rng * 4) === 3 → rng >= 0.75
            let call = 0;
            const rng = () => [0.29, 0.76][call++] ?? 0.5;

            ArtifactEffects.applyJewelryEffect(world, 0, 0, artifact, npc, rng);

            expect(npc.currentRole).toBe('Merchant');
            expect(Array.isArray(npc.merchantInventory)).toBe(true);
            expect(npc.merchantInventory.length).toBeGreaterThan(0);
            expect(npc.personalWealth).toBeGreaterThanOrEqual(500);
        });

        test('corrupting to a non-Merchant role does not initialize merchantInventory', () => {
            const npc = makeNpc('npc-jewelry-guard', 'Citizen');
            const artifact = { name: 'Iron Signet' };

            // Force corruption roll (< 0.3) and pick Guard (index 0)
            let call = 0;
            const rng = () => [0.29, 0.01][call++] ?? 0.5;

            ArtifactEffects.applyJewelryEffect(world, 0, 0, artifact, npc, rng);

            expect(npc.currentRole).toBe('Guard');
            expect(npc.merchantInventory).toBeUndefined();
        });

        test('does not push a history event when corrupting a role (caller owns the event)', () => {
            const npc = makeNpc('npc-jewelry-event', 'Citizen');
            const artifact = { name: 'Iron Signet' };

            let call = 0;
            const rng = () => [0.29, 0.01][call++] ?? 0.5;

            ArtifactEffects.applyJewelryEffect(world, 0, 0, artifact, npc, rng);

            expect(npc.currentRole).toBe('Guard');
            expect(npc.history.events).toHaveLength(0);
        });
    });

    describe('applyWeaponEffect', () => {
        test('Merchant elevated to Guard redistributes merchantInventory to other merchants', () => {
            const merchant = makeNpc('npc-weapon-merchant', 'Merchant', {
                merchantInventory: [{ itemId: 'iron-01', name: 'Iron', type: 'resource', tier: 1, quantity: 3, price: 40 }]
            });
            const recipient = makeNpc('other-merchant', 'Merchant', { merchantInventory: [] });
            const artifact = { name: 'Blade of Valor' };

            // Force Guard pick (rng < 0.5)
            const rng = () => 0.3;

            ArtifactEffects.applyWeaponEffect(world, 0, 0, artifact, merchant, rng);

            expect(merchant.currentRole).toBe('Guard');
            expect(merchant.merchantInventory).toHaveLength(0);
            expect(recipient.merchantInventory.some(s => s.itemId === 'iron-01')).toBe(true);
        });

        test('non-Merchant elevated to Guard does not affect inventory', () => {
            const citizen = makeNpc('npc-weapon-citizen', 'Citizen');
            const artifact = { name: 'Blade of Valor' };
            const rng = () => 0.3;

            ArtifactEffects.applyWeaponEffect(world, 0, 0, artifact, citizen, rng);

            expect(citizen.currentRole).toBe('Guard');
            expect(citizen.merchantInventory).toBeUndefined();
        });

        test('does not push a history event when elevating a role (caller owns the event)', () => {
            const citizen = makeNpc('npc-weapon-event', 'Citizen');
            const artifact = { name: 'Blade of Valor' };
            const rng = () => 0.3;

            ArtifactEffects.applyWeaponEffect(world, 0, 0, artifact, citizen, rng);

            expect(citizen.currentRole).toBe('Guard');
            expect(citizen.history.events).toHaveLength(0);
        });
    });

    describe('applyRelicEffect', () => {
        const RELIC_YEAR = 200;

        test('mass conversion: each converted NPC gets a career_shift event with correct year', () => {
            const npc1 = makeNpc('relic-npc-1', 'Citizen');
            const npc2 = makeNpc('relic-npc-2', 'Guard');
            const npc3 = makeNpc('relic-npc-3', 'Merchant');
            const artifact = { name: 'The Astral Urn' };
            const npcs = [npc1, npc2, npc3];

            // rng < 0.5 → mass conversion branch; rng < 0.5 → each NPC converts
            const rng = () => 0.4;

            ArtifactEffects.applyRelicEffect(world, 0, 0, artifact, npc1, npcs, rng, RELIC_YEAR);

            for (const npc of npcs) {
                const conversionEvent = npc.history.events.find(e => e.type === 'career_shift');
                expect(conversionEvent).toMatchObject({ ...STRUCTURED_EVENT, type: 'career_shift', year: RELIC_YEAR });
                expect(conversionEvent.description).toContain(`[Year ${RELIC_YEAR}]`);
            }
        });

        test('mass conversion: targetNpc gets a legacy town-alignment event with correct year', () => {
            const npc1 = makeNpc('relic-target-1', 'Citizen');
            const artifact = { name: 'The Astral Urn' };
            const npcs = [npc1];

            const rng = () => 0.4;

            ArtifactEffects.applyRelicEffect(world, 0, 0, artifact, npc1, npcs, rng, RELIC_YEAR);

            const legacyEvent = npc1.history.events.find(e => e.type === 'legacy');
            expect(legacyEvent).toMatchObject({ ...STRUCTURED_EVENT, type: 'legacy', year: RELIC_YEAR });
            expect(legacyEvent.description).toContain(`[Year ${RELIC_YEAR}]`);
        });

        test('migration branch: targetNpc gets a migration event with correct year', () => {
            const npc = makeNpc('relic-migration', 'Citizen');
            const artifact = { name: 'The Astral Urn' };
            const npcs = [npc];

            // rng >= 0.5 → migration branch
            const rng = () => 0.6;

            ArtifactEffects.applyRelicEffect(world, 0, 0, artifact, npc, npcs, rng, RELIC_YEAR);

            expect(npc.history.events).toHaveLength(1);
            expect(npc.history.events[0]).toMatchObject({ ...STRUCTURED_EVENT, type: 'migration', year: RELIC_YEAR });
            expect(npc.history.events[0].description).toContain(`[Year ${RELIC_YEAR}]`);
        });
    });
});
