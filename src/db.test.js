// src/db.test.js
const db = require('./db');

// jest.mock is hoisted above all declarations; keep the factory self-contained.
jest.mock('better-sqlite3', () => {
    const stmt = {
        run: jest.fn(),
        all: jest.fn(() => []),
        get: jest.fn(() => null)
    };
    const instance = {
        exec: jest.fn(),
        prepare: jest.fn(() => stmt),
        transaction: jest.fn(fn => fn)
    };
    return jest.fn(() => instance);
});

describe('Database', () => {
    beforeEach(() => jest.clearAllMocks());

    test('saveDelta should not throw', () => {
        expect(() => db.saveDelta('world_X0_Y0', 'entity1', 'status', 'Alive')).not.toThrow();
    });

    test('getDeltas should return an array', () => {
        const deltas = db.getDeltas('world_X0_Y0');
        expect(Array.isArray(deltas)).toBe(true);
    });

    test('getGlobalYear should return default year of 51 when no delta exists', () => {
        expect(db.getGlobalYear()).toBe(51);
    });

    test('upsertDelta should not throw', () => {
        expect(() => db.upsertDelta('GLOBAL', 'world_X1_Y0', 'Claimed_By', 'world_X0_Y0')).not.toThrow();
    });

    test('getParentCity should return null when no claim record exists', () => {
        // The mocked stmt.get returns null by default
        expect(db.getParentCity('world_X5_Y5')).toBeNull();
    });
});