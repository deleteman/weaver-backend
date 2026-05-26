// src/politics.test.js
const { PoliticalEngine, CONQUEST_TYPES, getRulerTitle, TIER_RULER_TITLES } = require('./politics');

jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    getDeltas: jest.fn(() => [])
}));

jest.mock('./logger', () => ({
    log: jest.fn()
}));

describe('PoliticalEngine', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── resolveConflict: outcome logic ──────────────────────────────────────
    describe('resolveConflict outcomes', () => {
        const strongInvader = { npcsByRole: { Guard: 10, Hero: 3 }, weapons: 5 };
        const weakTarget    = { npcsByRole: { Guard: 0,  Hero: 0 }, weapons: 0 };
        const equalOpponent = { npcsByRole: { Guard: 5,  Hero: 1 }, weapons: 2 };

        test('crushing victory when margin > 10', () => {
            const result = PoliticalEngine.resolveConflict(strongInvader, weakTarget);
            expect(result.outcome).toBe('crushing-victory');
            expect(result.loserMayorKilled).toBe(true);
            expect(result.vassalState).toBe('Annexed');
        });

        test('subjugation when margin 0-10', () => {
            // Small invader advantage → margin just above 0 but ≤ 10
            const slightEdge = { npcsByRole: { Guard: 3, Hero: 0 }, weapons: 0 };
            const result = PoliticalEngine.resolveConflict(slightEdge, weakTarget);
            expect(result.outcome).toBe('subjugation');
            expect(result.loserMayorState).toBe('Puppet');
            expect(result.vassalState).toBe('Colony');
        });

        test('defeat when invader has no advantage', () => {
            const result = PoliticalEngine.resolveConflict(weakTarget, strongInvader);
            expect(result.outcome).toBe('defeat');
        });
    });

    // ─── resolveConflict: conquest delta persistence (Gap 1 fix) ─────────────
    describe('resolveConflict conquest delta writing', () => {
        const { saveDelta } = require('./db');

        const strongInvader = { npcsByRole: { Guard: 10, Hero: 3 }, weapons: 5 };
        const weakTarget    = { npcsByRole: { Guard: 0,  Hero: 0 }, weapons: 0 };

        test('writes annexation delta to loserCoordinate on crushing victory', () => {
            PoliticalEngine.resolveConflict(strongInvader, weakTarget, 'world_X5_Y5');

            expect(saveDelta).toHaveBeenCalledWith(
                'world_X5_Y5',
                'conquest',
                'conquest_type',
                CONQUEST_TYPES.ANNEXATION
            );
        });

        test('writes subjugation delta to loserCoordinate on subjugation', () => {
            const slightEdge = { npcsByRole: { Guard: 3, Hero: 0 }, weapons: 0 };
            PoliticalEngine.resolveConflict(slightEdge, weakTarget, 'world_X3_Y3');

            expect(saveDelta).toHaveBeenCalledWith(
                'world_X3_Y3',
                'conquest',
                'conquest_type',
                CONQUEST_TYPES.SUBJUGATION
            );
        });

        test('does not write any delta on defeat', () => {
            PoliticalEngine.resolveConflict(weakTarget, strongInvader, 'world_X2_Y2');

            expect(saveDelta).not.toHaveBeenCalled();
        });

        test('does not call saveDelta when loserCoordinate is null', () => {
            PoliticalEngine.resolveConflict(strongInvader, weakTarget, null);

            expect(saveDelta).not.toHaveBeenCalled();
        });

        test('does not call saveDelta when loserCoordinate is omitted', () => {
            PoliticalEngine.resolveConflict(strongInvader, weakTarget);

            expect(saveDelta).not.toHaveBeenCalled();
        });
    });

    // ─── canPromote / promoteSettlement ──────────────────────────────────────
    describe('settlement promotion', () => {
        test('canPromote returns true when population meets threshold', () => {
            expect(PoliticalEngine.canPromote({ tier: 1, population: 20 })).toBe(true);
        });

        test('canPromote returns false when population is too low', () => {
            expect(PoliticalEngine.canPromote({ tier: 1, population: 5 })).toBe(false);
        });

        test('canPromote returns false at max tier (5)', () => {
            expect(PoliticalEngine.canPromote({ tier: 5, population: 999 })).toBe(false);
        });

        test('promoteSettlement increments tier and sets requiresExpansion', () => {
            const s = { tier: 1, population: 30, name: 'TestTown' };
            const promoted = PoliticalEngine.promoteSettlement(s);
            expect(promoted).toBe(true);
            expect(s.tier).toBe(2);
            expect(s.requiresExpansion).toBe(true);
        });
    });

    // ─── shouldDemote ────────────────────────────────────────────────────────
    describe('settlement demotion', () => {
        test('shouldDemote returns true when population below threshold', () => {
            expect(PoliticalEngine.shouldDemote({ tier: 2, population: 3 })).toBe(true);
        });

        test('shouldDemote returns false for Tier 1 regardless of population', () => {
            expect(PoliticalEngine.shouldDemote({ tier: 1, population: 0 })).toBe(false);
        });
    });

    // ─── CONQUEST_TYPES constant ─────────────────────────────────────────────
    describe('CONQUEST_TYPES', () => {
        test('ANNEXATION is defined and equals "annexation"', () => {
            expect(CONQUEST_TYPES.ANNEXATION).toBe('annexation');
        });

        test('SUBJUGATION is defined and equals "subjugation"', () => {
            expect(CONQUEST_TYPES.SUBJUGATION).toBe('subjugation');
        });
    });

    describe('getRulerTitle', () => {
        test('returns Mayor for tier 1 (Town)', () => {
            expect(getRulerTitle(1)).toBe('Mayor');
        });

        test('returns Mayor for tier 2 (SmallCity)', () => {
            expect(getRulerTitle(2)).toBe('Mayor');
        });

        test('returns Lord for tier 3 (FullCity)', () => {
            expect(getRulerTitle(3)).toBe('Lord');
        });

        test('returns Magistrate for tier 4', () => {
            expect(getRulerTitle(4)).toBe('Magistrate');
        });

        test('returns King for tier 5 (Kingdom)', () => {
            expect(getRulerTitle(5)).toBe('King');
        });

        test('defaults to Mayor for unknown tier', () => {
            expect(getRulerTitle(99)).toBe('Mayor');
            expect(getRulerTitle(undefined)).toBe('Mayor');
        });

        test('TIER_RULER_TITLES covers all 5 tiers', () => {
            expect(Object.keys(TIER_RULER_TITLES).map(Number)).toEqual([1, 2, 3, 4, 5]);
        });
    });
});
