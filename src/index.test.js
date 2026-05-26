// src/index.test.js

jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    upsertDelta: jest.fn(),
    getDeltas: jest.fn(() => []),
    getGlobalYear: jest.fn(() => 51),
    getParentCity: jest.fn(() => null),
    getTierForCoordinate: jest.fn(() => 0),
    getCapsuleDeltas: jest.fn(() => []),
    getRuinHoard: jest.fn(() => null),
    appendJournalEntry: jest.fn(),
    getJournal: jest.fn(() => ({ entries: [], total: 0 })),
    saveSnapshot: jest.fn(),
    loadLatestSnapshot: jest.fn(() => null),
}));

const db = require('./db');
const { generateTownName } = require('./map');
const { loadCoordinate, serializeChunk, unloadCoordinate } = require('../index');

describe('Chunk Delta Application', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // clearAllMocks() preserves implementations set via mockReturnValue/mockImplementation
        // from earlier tests, which would leak (e.g. getGlobalYear=10000, getParentCity='world_X8_Y9')
        // into tests that expect default behavior. Restore defaults explicitly.
        db.getDeltas.mockImplementation(() => []);
        db.getGlobalYear.mockImplementation(() => 51);
        db.getParentCity.mockImplementation(() => null);
        db.loadLatestSnapshot.mockImplementation(() => null);
    });

    test('loadCoordinate should query getDeltas with the string coordinate key', () => {
        loadCoordinate(3, -2);
        unloadCoordinate(3, -2);

        expect(db.getDeltas).toHaveBeenCalledWith('world_X3_Y-2');
    });

    test('loadCoordinate generates a District when the tile has a Claimed_By record', () => {
        // Make getParentCity return a parent for coordinate (9, 9)
        db.getParentCity.mockReturnValue('world_X8_Y9');
        // Provide minimal parent deltas so loadAsDistrict can read mayor + political
        db.getDeltas.mockImplementation(coord => {
            if (coord === 'world_X8_Y9') {
                return [
                    { state_key: 'currentMayor', state_value: 'Lord Varek' },
                    { state_key: 'political', state_value: JSON.stringify({ tier: 5, demographics: {}, stance: 'Aggressive' }) }
                ];
            }
            return [];
        });

        loadCoordinate(9, 9);
        const chunk = serializeChunk(9, 9);
        unloadCoordinate(9, 9);

        expect(chunk.town.type).toBe('District');
        expect(chunk.town.ruler).toBe('Lord Varek');
        expect(chunk.town.parentCity).toBe('world_X8_Y9');
        expect(chunk.town.districtType).toBeTruthy();
        expect(['Market', 'Slums', 'Keep', 'Barracks', 'Temple']).toContain(chunk.town.districtType);
    });

    test('loadCoordinate generates a regular Town when the tile is unclaimed', () => {
        db.getParentCity.mockReturnValue(null);
        db.getDeltas.mockReturnValue([]);
        // Year 1 ensures all estimated tiers are 1 (maturation is min 50 years),
        // so findEstimatedParent() cannot find a claimant and the tile stays a Town.
        db.getGlobalYear.mockReturnValue(1);

        loadCoordinate(0, 0);
        const chunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        expect(chunk.town.type).toBe('Town');
        expect(chunk.town.parentCity).toBeNull();
        expect(chunk.town.districtType).toBeNull();
    });

    test('loadCoordinate loads as Town when no DB claim and no neighbour has a saved political delta', () => {
        // No Claimed_By and no visited neighbours — purely estimated tiers must NOT
        // trigger district loading, because unvisited neighbours cannot be confirmed owners.
        db.getParentCity.mockReturnValue(null);
        db.getDeltas.mockReturnValue([]);
        db.getGlobalYear.mockReturnValue(10000);
        // Return a near-year snapshot so only 1 year simulates (avoids 9949-year cold path)
        db.loadLatestSnapshot.mockReturnValue({
            year: 9999,
            stateBlob: JSON.stringify({
                npcs: [],
                towns: [{
                    identity: { name: 'Mock Town', type: 'Town', id: 'mock_town_0_0' },
                    location: { x: 0, y: 0, parentId: null },
                    history: { events: [] },
                    currentMayor: 'NPC',
                    political: { tier: 1, demographics: {}, stance: 'Balanced' },
                    population: 0,
                    regionalWealth: 500,
                    primaryExport: 'Grain',
                    tradePartners: [],
                    economicModifiers: { shortage: false, hyperinflation: false, hyperinflationExpiryYear: null, economicBoomYear: null }
                }],
                factions: []
            })
        });

        loadCoordinate(0, 0);
        const chunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        expect(chunk.town.type).toBe('Town');
        expect(chunk.town.parentCity).toBeNull();
    });

    test('loadCoordinate falls back to findEstimatedParent when a visited neighbour has a saved high-tier political delta', () => {
        db.getParentCity.mockReturnValue(null);
        db.getGlobalYear.mockReturnValue(10000);
        // Provide a visited neighbour at (1, 0) with a tier-5 political delta so
        // findEstimatedParent() picks it up and (0, 0) becomes a district.
        db.getDeltas.mockImplementation(coord => {
            if (coord === 'world_X1_Y0') {
                return [
                    { state_key: 'currentMayor', state_value: 'High King Aldric' },
                    { state_key: 'political', state_value: JSON.stringify({ tier: 5, demographics: {}, stance: 'Balanced' }) }
                ];
            }
            return [];
        });
        // Return a near-year District snapshot so only 1 year simulates (avoids 9949-year cold path)
        db.loadLatestSnapshot.mockReturnValue({
            year: 9999,
            stateBlob: JSON.stringify({
                npcs: [],
                towns: [{
                    identity: { name: 'Mock District', type: 'District', id: 'mock_dist_0_0' },
                    location: { x: 0, y: 0, parentId: null },
                    history: { events: [] },
                    currentMayor: 'High King Aldric',
                    political: { tier: 5, demographics: {}, stance: 'Balanced' },
                    population: 0,
                    districtType: 'Market',
                    parentCity: 'world_X1_Y0'
                }],
                factions: []
            })
        });

        loadCoordinate(0, 0);
        const chunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        expect(chunk.town.type).toBe('District');
        expect(chunk.town.parentCity).toMatch(/^world_X-?\d+_Y-?\d+$/);
        expect(['Market', 'Slums', 'Keep', 'Barracks', 'Temple']).toContain(chunk.town.districtType);
    });

    test('District shows parent ruler even when its own saved currentMayor delta is stale Unknown', () => {
        // Simulate: district was visited before its parent existed, saving 'Unknown'.
        // The district's name is deterministic from its coordinate seed — we use it as
        // entity_name so injectImmigrantsAndApplyDeltas will find and (wrongly) apply the delta.
        const districtName = generateTownName(9, 9);

        db.getParentCity.mockReturnValue('world_X8_Y9');
        db.getDeltas.mockImplementation(coord => {
            if (coord === 'world_X8_Y9') {
                return [
                    { entity_name: 'parent-town-id', state_key: 'currentMayor', state_value: 'Lord Varek' },
                    { entity_name: 'parent-town-id', state_key: 'political', state_value: JSON.stringify({ tier: 5, demographics: {}, stance: 'Aggressive' }) }
                ];
            }
            if (coord === 'world_X9_Y9') {
                // Stale delta from a first visit when parent was unvisited
                return [{ entity_name: districtName, state_key: 'currentMayor', state_value: 'Unknown' }];
            }
            return [];
        });

        loadCoordinate(9, 9);
        const chunk = serializeChunk(9, 9);
        unloadCoordinate(9, 9);

        expect(chunk.town.type).toBe('District');
        expect(chunk.town.ruler).toBe('Lord Varek');
        expect(chunk.town.ruler).not.toBe('Unknown');
    });

    test('unloadCoordinate does not save a currentMayor delta for District entities', () => {
        db.getParentCity.mockReturnValue('world_X8_Y9');
        db.getDeltas.mockImplementation(coord => {
            if (coord === 'world_X8_Y9') {
                return [
                    { entity_name: 'parent-id', state_key: 'currentMayor', state_value: 'Lord Varek' },
                    { entity_name: 'parent-id', state_key: 'political', state_value: JSON.stringify({ tier: 5, demographics: {}, stance: 'Aggressive' }) }
                ];
            }
            return [];
        });

        loadCoordinate(9, 9);
        unloadCoordinate(9, 9);

        const currentMayorSaves = db.saveDelta.mock.calls.filter(call => call[2] === 'currentMayor');
        expect(currentMayorSaves).toHaveLength(0);
    });

    test('status delta should mark a generated NPC as Migrated and still include it in the population', () => {
        loadCoordinate(0, 0);
        const firstChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const aliveNpc = firstChunk.population.find(npc => npc.status === 'Alive');
        expect(aliveNpc).toBeDefined();

        const migrationDelta = [{
            coordinate: 'world_X0_Y0',
            entity_name: aliveNpc.id,
            state_key: 'status',
            state_value: 'Migrated'
        }];

        db.getDeltas.mockReturnValue(migrationDelta);

        loadCoordinate(0, 0);
        const secondChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const targetAfter = secondChunk.population.find(npc => npc.id === aliveNpc.id);
        expect(targetAfter).toBeDefined();
        expect(targetAfter.status).toBe('Migrated');
    });

    test('status delta should mark a generated NPC as Exiled and still include it in the population', () => {
        loadCoordinate(0, 0);
        const firstChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const aliveNpc = firstChunk.population.find(npc => npc.status === 'Alive');
        expect(aliveNpc).toBeDefined();

        const exileDelta = [{
            coordinate: 'world_X0_Y0',
            entity_name: aliveNpc.id,
            state_key: 'status',
            state_value: 'Exiled'
        }];

        db.getDeltas.mockReturnValue(exileDelta);

        loadCoordinate(0, 0);
        const secondChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const targetAfter = secondChunk.population.find(npc => npc.id === aliveNpc.id);
        expect(targetAfter).toBeDefined();
        expect(targetAfter.status).toBe('Exiled');
    });

    test('status delta should mark a generated NPC as Dead in the returned chunk', () => {
        loadCoordinate(0, 0);
        const firstChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const aliveNpc = firstChunk.population.find(npc => npc.status === 'Alive');
        expect(aliveNpc).toBeDefined();

        const deathDelta = [{
            coordinate: 'world_X0_Y0',
            entity_name: aliveNpc.id,
            state_key: 'status',
            state_value: 'Dead'
        }];

        db.getDeltas.mockReturnValue(deathDelta);

        loadCoordinate(0, 0);
        const secondChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const targetAfter = secondChunk.population.find(npc => npc.id === aliveNpc.id);
        expect(targetAfter).toBeDefined();
        expect(targetAfter.status).toBe('Dead');
        expect(db.getDeltas).toHaveBeenCalledWith('world_X0_Y0');
    });

    test('Migrated NPC older than MAX_NATURAL_LIFESPAN is NOT serialized as dead', () => {
        // At year 200, founding NPCs (born ~year 1) are ~199 years old — well over the 80-year cap.
        // A Migrated NPC must keep status="Migrated" and dead=false regardless of age.
        db.getGlobalYear.mockReturnValue(200);

        loadCoordinate(0, 0);
        const firstChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const aliveNpc = firstChunk.population.find(npc => npc.status === 'Alive');
        expect(aliveNpc).toBeDefined();

        db.getDeltas.mockReturnValue([{
            coordinate: 'world_X0_Y0',
            entity_name: aliveNpc.id,
            state_key: 'status',
            state_value: 'Migrated'
        }]);

        loadCoordinate(0, 0);
        const secondChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const targetAfter = secondChunk.population.find(npc => npc.id === aliveNpc.id);
        expect(targetAfter).toBeDefined();
        expect(targetAfter.status).toBe('Migrated');
        expect(targetAfter.dead).toBe(false);
    });

    test('Exiled NPC older than MAX_NATURAL_LIFESPAN is NOT serialized as dead', () => {
        db.getGlobalYear.mockReturnValue(200);

        loadCoordinate(0, 0);
        const firstChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const aliveNpc = firstChunk.population.find(npc => npc.status === 'Alive');
        expect(aliveNpc).toBeDefined();

        db.getDeltas.mockReturnValue([{
            coordinate: 'world_X0_Y0',
            entity_name: aliveNpc.id,
            state_key: 'status',
            state_value: 'Exiled'
        }]);

        loadCoordinate(0, 0);
        const secondChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const targetAfter = secondChunk.population.find(npc => npc.id === aliveNpc.id);
        expect(targetAfter).toBeDefined();
        expect(targetAfter.status).toBe('Exiled');
        expect(targetAfter.dead).toBe(false);
    });

    test('Alive NPC older than MAX_NATURAL_LIFESPAN is still serialized as dead', () => {
        // Founding NPCs born at year 1 will be ~199 at year 200, exceeding the 80-year lifespan cap.
        db.getGlobalYear.mockReturnValue(200);

        loadCoordinate(0, 0);
        const chunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const overageNpc = chunk.population.find(npc => npc.age > 80 && npc.status === 'Dead');
        expect(overageNpc).toBeDefined();
        expect(overageNpc.dead).toBe(true);
    });

    test('NPC dead from age overflow always has a death event in the serialized history', () => {
        // At year 200 founding NPCs are ~199 years old — they die in simulation or via the
        // serialization fallback. Either way the response must contain a death event.
        db.getGlobalYear.mockReturnValue(200);

        loadCoordinate(0, 0);
        const chunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const deadNpcs = chunk.population.filter(npc => npc.dead === true);
        expect(deadNpcs.length).toBeGreaterThan(0);
        for (const npc of deadNpcs) {
            const hasDeathEvent = npc.history.some(e => e.type === 'death' || e.type === 'child_death');
            expect(hasDeathEvent).toBe(true);
        }
    });

    test('serializeChunk includes rulerTitle matching settlement tier', () => {
        loadCoordinate(0, 0);
        const chunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        expect(chunk.town).toHaveProperty('rulerTitle');
        const validTitles = ['Mayor', 'Lord', 'Magistrate', 'King'];
        expect(validTitles).toContain(chunk.town.rulerTitle);
    });


    test('computeDeathAge is deterministic and varies across NPC ids', () => {
        const { computeDeathAge, MAX_NATURAL_LIFESPAN, MAX_LIFESPAN_VARIANCE } = require('../src/history');
        const id = 'abc123def456';
        expect(computeDeathAge(id)).toBe(computeDeathAge(id));
        expect(computeDeathAge(id)).toBeGreaterThanOrEqual(MAX_NATURAL_LIFESPAN);
        expect(computeDeathAge(id)).toBeLessThan(MAX_NATURAL_LIFESPAN + MAX_LIFESPAN_VARIANCE);
        const differentId = '000000000000';
        // Two ids shouldn't always produce the same death age (probabilistically guaranteed by the 10-year range)
        const results = new Set(['abc123', 'def456', '111111', '222222', '333333', '444444'].map(computeDeathAge));
        expect(results.size).toBeGreaterThan(1);
    });

    test('currentMayor delta application uses newest-wins (matches /api/map find() semantics)', () => {
        // Bug 2c regression: when multiple currentMayor deltas exist (newest first
        // from ORDER BY id DESC), the chunk pipeline must apply only the newest one.
        // Previously it iterated all matches and the OLDEST won — so a stale 'None'
        // from an early unload would clobber a recent 'The Player' / successor delta.
        // Year 1 keeps simulation deterministic (no extra ruler events fire).
        db.getGlobalYear.mockReturnValue(1);
        db.getParentCity.mockReturnValue(null);

        // First load to learn the deterministic town entity id/name for this coord.
        db.getDeltas.mockReturnValue([]);
        loadCoordinate(0, 0);
        const baselineChunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        const townName = baselineChunk.town.name;

        // Now stage three currentMayor deltas in newest-first order. Only the first
        // (newest) should win — older ones must be skipped.
        db.getDeltas.mockReturnValue([
            { id: 30, entity_name: townName, state_key: 'currentMayor', state_value: 'Rowena Wintershield' },
            { id: 20, entity_name: townName, state_key: 'currentMayor', state_value: 'The Player' },
            { id: 10, entity_name: townName, state_key: 'currentMayor', state_value: 'None' },
        ]);

        loadCoordinate(0, 0);
        const chunk = serializeChunk(0, 0);
        unloadCoordinate(0, 0);

        expect(chunk.town.ruler).toBe('Rowena Wintershield');
    });

    test('unloadCoordinate uses upsertDelta (not saveDelta) for Town currentMayor', () => {
        // Bug 2b regression: accumulating saveDelta rows on every visit eventually
        // outranked any legitimate ruler delta under newest-wins. Switching to
        // upsertDelta keeps a single row per (coord, entity_id, currentMayor).
        db.getParentCity.mockReturnValue(null);
        db.getDeltas.mockReturnValue([]);
        db.getGlobalYear.mockReturnValue(1);

        loadCoordinate(0, 0);
        unloadCoordinate(0, 0);

        const saveMayorCalls = db.saveDelta.mock.calls.filter(call => call[2] === 'currentMayor');
        const upsertMayorCalls = db.upsertDelta.mock.calls.filter(call => call[2] === 'currentMayor');

        expect(saveMayorCalls).toHaveLength(0);
        expect(upsertMayorCalls.length).toBeGreaterThan(0);
    });
});
