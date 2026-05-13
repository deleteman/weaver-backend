// src/index.test.js

jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    upsertDelta: jest.fn(),
    getDeltas: jest.fn(() => []),
    getGlobalYear: jest.fn(() => 51),
    getParentCity: jest.fn(() => null),
    getTierForCoordinate: jest.fn(() => 0),
    getCapsuleDeltas: jest.fn(() => []),
    getRuinHoard: jest.fn(() => null)
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
});
