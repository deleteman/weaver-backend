const { deterministicHash, makeEvent } = require('./event-utils');

describe('deterministicHash', () => {
    it('returns an 8-character hex string', () => {
        const result = deterministicHash('hello world');
        expect(result).toMatch(/^[0-9a-f]{8}$/);
    });

    it('is deterministic — same input always returns same output', () => {
        const input = '[Year 42] Arrived in town seeking a new life.';
        expect(deterministicHash(input)).toBe(deterministicHash(input));
    });

    it('produces different outputs for different inputs', () => {
        expect(deterministicHash('event A')).not.toBe(deterministicHash('event B'));
    });
});

describe('makeEvent', () => {
    it('returns an object with all required fields', () => {
        const ev = makeEvent('[Year 87] Seized power and became the new Mayor.', 'power_seizure');
        expect(ev).toHaveProperty('id');
        expect(ev).toHaveProperty('year');
        expect(ev).toHaveProperty('description');
        expect(ev).toHaveProperty('type');
        expect(ev).toHaveProperty('causedBy');
    });

    it('parses year correctly from the description string', () => {
        const ev = makeEvent('[Year 87] Seized power and became the new Mayor.', 'power_seizure');
        expect(ev.year).toBe(87);
    });

    it('sets year to 0 when no [Year N] prefix is present', () => {
        const ev = makeEvent('Some event without year prefix.', 'legacy');
        expect(ev.year).toBe(0);
    });

    it('prefixes id with ev_', () => {
        const ev = makeEvent('[Year 10] Arrived in town.', 'immigration');
        expect(ev.id).toMatch(/^ev_[0-9a-f]{8}$/);
    });

    it('is deterministic — same description always returns same id', () => {
        const desc = '[Year 42] Packed their belongings and migrated.';
        expect(makeEvent(desc, 'migration').id).toBe(makeEvent(desc, 'migration').id);
    });

    it('defaults causedBy to null when not supplied', () => {
        const ev = makeEvent('[Year 5] Came of age and entered adulthood.', 'age_transition');
        expect(ev.causedBy).toBeNull();
    });

    it('passes causedBy through when supplied', () => {
        const ev = makeEvent('[Year 50] Inherited belongings.', 'inheritance', 'ev_abcd1234');
        expect(ev.causedBy).toBe('ev_abcd1234');
    });

    it('preserves the description field unchanged', () => {
        const desc = '[Year 3] Was heartbroken by the loss of their love.';
        const ev = makeEvent(desc, 'grief');
        expect(ev.description).toBe(desc);
    });

    it('sets the type field correctly', () => {
        const ev = makeEvent('[Year 10] Died of a tragic childhood fever.', 'child_death');
        expect(ev.type).toBe('child_death');
    });
});
