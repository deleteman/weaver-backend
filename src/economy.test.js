// src/economy.test.js
const { simulate_economy, lockRuinHoard } = require('./economy');

jest.mock('./db', () => ({
    getCapsuleDeltas: jest.fn(() => []),
    getTierForCoordinate: jest.fn(() => 0),
    upsertDelta: jest.fn()
}));

jest.mock('./logger', () => ({ log: jest.fn() }));

const { upsertDelta } = require('./db');

function makeTown(tier, population, overrides = {}) {
    return {
        identity: { name: 'Test Town', id: 'town-test', type: 'Town' },
        political: { tier },
        population,
        regionalWealth: tier * 500,
        tradePartners: [],
        economicModifiers: {
            shortage: false,
            hyperinflation: false,
            hyperinflationExpiryYear: null,
            economicBoomYear: null
        },
        ...overrides
    };
}

describe('simulate_economy — core per-decade loop', () => {
    const rng = () => 0.5;
    const coordinate = 'world_X3_Y3';

    test('net > 200 for only 1 decade does NOT trigger Economic Boom', () => {
        // Tier 2, population 5: net = 200 - 50 = 150 — below BOOM_NET_THRESHOLD (200)
        const town = makeTown(2, 5);
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        expect(result.tierDelta).toBe(0);
        const boomEvents = result.events.filter(e => e.type === 'economic_boom');
        expect(boomEvents).toHaveLength(0);
    });

    test('net > 200 for 2 consecutive decades triggers Economic Boom and tier+1', () => {
        // Tier 3, population 5: net = 300 - 50 = 250 > 200; need 2 decades → simulate 20 years
        const town = makeTown(3, 5);
        const result = simulate_economy(town, 20, rng, coordinate, 200);
        expect(result.tierDelta).toBeGreaterThanOrEqual(1);
        const boomEvents = result.events.filter(e => e.type === 'economic_boom');
        expect(boomEvents.length).toBeGreaterThanOrEqual(1);
    });

    test('net < 0 for 2 consecutive decades triggers Famine event', () => {
        // Tier 1, population 15: net = 100 - 150 = -50 < 0; 2 decades → 20 years
        const town = makeTown(1, 15);
        const result = simulate_economy(town, 20, rng, coordinate, 200);
        const famineEvents = result.events.filter(e => e.type === 'famine');
        expect(famineEvents.length).toBeGreaterThanOrEqual(1);
    });

    test('famine does NOT trigger with only 1 negative decade', () => {
        const town = makeTown(1, 15);
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        const famineEvents = result.events.filter(e => e.type === 'famine');
        expect(famineEvents).toHaveLength(0);
    });

    test('no economic events for balanced production/consumption', () => {
        // Tier 2, population 20: net = 200 - 200 = 0 — exactly zero
        const town = makeTown(2, 20);
        const result = simulate_economy(town, 20, rng, coordinate, 200);
        expect(result.tierDelta).toBe(0);
        const economicEvents = result.events.filter(e => ['economic_boom', 'famine'].includes(e.type));
        expect(economicEvents).toHaveLength(0);
    });
});

describe('simulate_economy — Time Capsule system', () => {
    const coordinate = 'world_X5_Y5';
    const { getCapsuleDeltas } = require('./db');

    beforeEach(() => {
        jest.clearAllMocks();
        getCapsuleDeltas.mockReturnValue([]);
    });

    function makeCapsuleRow(id, capsuleData) {
        return {
            id,
            coordinate,
            entity_name: 'CAPSULE',
            state_key: `capsule_${id}`,
            state_value: JSON.stringify(capsuleData)
        };
    }

    test('Gold 100, ΔT=100: compounded ≈724 → NO Banking Guild (threshold 10000)', () => {
        // 100 * 1.02^100 ≈ 724.46
        getCapsuleDeltas.mockReturnValue([
            makeCapsuleRow('c1', { type: 'gold_npc', gold: 100, buriedYear: 0, resolved: false })
        ]);
        const town = makeTown(2, 5);
        // rng always < 1, so discovery always succeeds with high enough ΔT
        // discoveryChance = min(95, 100*0.5 + 5/10) = min(95, 50.5) = 50.5
        // rng()*100 = 0.5*100 = 50 < 50.5 → discovered
        const rng = () => 0.5;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        const guildEvents = result.events.filter(e => e.type === 'banking_guild_founded');
        expect(guildEvents).toHaveLength(0);
        expect(result.tierDelta).toBe(0);
    });

    test('Gold 500, ΔT=100: compounded ≈3622 → NO Banking Guild', () => {
        getCapsuleDeltas.mockReturnValue([
            makeCapsuleRow('c2', { type: 'gold_npc', gold: 500, buriedYear: 0, resolved: false })
        ]);
        const town = makeTown(2, 5);
        const rng = () => 0.5;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        const guildEvents = result.events.filter(e => e.type === 'banking_guild_founded');
        expect(guildEvents).toHaveLength(0);
    });

    test('Gold 1000, ΔT=100: compounded ≈7245 → Banking Guild spawned, tier+1', () => {
        getCapsuleDeltas.mockReturnValue([
            makeCapsuleRow('c3', { type: 'gold_npc', gold: 1000, buriedYear: 0, resolved: false })
        ]);
        const town = makeTown(2, 5);
        // Force discovery: rng()*100 must be < discoveryChance
        // discoveryChance = min(95, 100*0.5 + 5/10) = 50.5 → rng must return < 0.505
        const rng = () => 0.4;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        const guildEvents = result.events.filter(e => e.type === 'banking_guild_founded');
        expect(guildEvents.length).toBeGreaterThanOrEqual(1);
        expect(result.tierDelta).toBeGreaterThanOrEqual(1);
    });

    test('Buried Gold 6000 → Boom + Hyperinflation written to modifierChanges', () => {
        getCapsuleDeltas.mockReturnValue([
            makeCapsuleRow('c4', { type: 'buried_gold', gold: 6000, buriedYear: 0, resolved: false, hasMerchant: true })
        ]);
        const town = makeTown(2, 20);
        const rng = () => 0.1; // always triggers discovery, hasMerchant=true so no ruin roll
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        expect(result.tierDelta).toBeGreaterThanOrEqual(1);
        expect(result.modifierChanges.hyperinflation).toBe(true);
        expect(result.modifierChanges.hyperinflationExpiryYear).toBe(200); // 100 + 100
    });

    test('Buried Gold 6000, no Merchant → 40% Ruin chance applied', () => {
        getCapsuleDeltas.mockReturnValue([
            makeCapsuleRow('c5', { type: 'buried_gold', gold: 6000, buriedYear: 0, resolved: false, hasMerchant: false })
        ]);
        const town = makeTown(2, 20);
        // rng returns 0.1 for discovery check, then 0.1 for the 40% ruin check → triggers ruin (< 0.40)
        const rng = () => 0.1;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        const ruinEvents = result.events.filter(e => e.type === 'economic_ruin');
        expect(ruinEvents.length).toBeGreaterThanOrEqual(1);
    });

    test('already-resolved capsule is not re-triggered', () => {
        getCapsuleDeltas.mockReturnValue([
            makeCapsuleRow('c6', { type: 'gold_npc', gold: 9000, buriedYear: 0, resolved: true })
        ]);
        const town = makeTown(2, 5);
        const rng = () => 0.1;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        expect(result.tierDelta).toBe(0);
    });
});

describe('simulate_economy — trade route evaluation', () => {
    const coordinate = 'world_X7_Y7';
    const { getCapsuleDeltas, getTierForCoordinate } = require('./db');

    beforeEach(() => {
        jest.clearAllMocks();
        getCapsuleDeltas.mockReturnValue([]);
    });

    test('partner with tier > 0 is kept in tradePartners', () => {
        getTierForCoordinate.mockReturnValue(2);
        const town = makeTown(3, 10, { tradePartners: ['world_X6_Y7'] });
        const rng = () => 0.5;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        expect(result.modifierChanges.tradePartners).toBeUndefined();
    });

    test('partner with tier 0 (Ruin) is removed and trade_route_collapse event fires', () => {
        getTierForCoordinate.mockReturnValue(0);
        const town = makeTown(3, 5, { tradePartners: ['world_X6_Y7'] });
        const rng = () => 0.5;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        expect(result.modifierChanges.tradePartners).toEqual([]);
        const collapseEvents = result.events.filter(e => e.type === 'trade_route_collapse');
        expect(collapseEvents.length).toBeGreaterThanOrEqual(1);
    });

    test('Ruin partner + population < 10 → Shortage applied', () => {
        getTierForCoordinate.mockReturnValue(0);
        const town = makeTown(3, 5, { tradePartners: ['world_X6_Y7'] });
        const rng = () => 0.5;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        expect(result.modifierChanges.shortage).toBe(true);
    });

    test('Ruin partner + population >= 10 → no Shortage', () => {
        getTierForCoordinate.mockReturnValue(0);
        const town = makeTown(3, 12, { tradePartners: ['world_X6_Y7'] });
        const rng = () => 0.5;
        const result = simulate_economy(town, 10, rng, coordinate, 100);
        expect(result.modifierChanges.shortage).toBeUndefined();
    });
});

describe('lockRuinHoard', () => {
    beforeEach(() => jest.clearAllMocks());

    test('locks 50% of regionalWealth into ruin_hoard delta', () => {
        const town = makeTown(2, 5, { regionalWealth: 2000 });
        lockRuinHoard('world_X1_Y1', town);
        expect(upsertDelta).toHaveBeenCalledWith('world_X1_Y1', 'RUIN', 'ruin_hoard', '1000');
    });

    test('handles zero regionalWealth gracefully', () => {
        const town = makeTown(1, 0, { regionalWealth: 0 });
        lockRuinHoard('world_X2_Y2', town);
        expect(upsertDelta).toHaveBeenCalledWith('world_X2_Y2', 'RUIN', 'ruin_hoard', '0');
    });
});
