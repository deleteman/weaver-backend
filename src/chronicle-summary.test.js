/**
 * Tests for src/chronicle-summary.js
 *
 * Uses a synthetic minimal timeline plus the bugged-chronicle-ruler.json fixture
 * to verify all summarizer functions.
 */

const {
    flattenTimeline,
    classifyPowerEvent,
    extractTitleFromText,
    extractElectedName,
    extractTargetName,
    extractChildName,
    extractArtifactName,
    extractChildren,
    extractParents,
    buildLineageNode,
    summarizeRulerHistory,
    summarizePerson,
    REASON_SEIZED,
    REASON_OUSTED,
    REASON_ABDICATED,
    REASON_DIED_IN_OFFICE,
    REASON_STILL_RULING,
    REASON_UNKNOWN,
    SUMMARY_TYPE_RULER_HISTORY,
    SUMMARY_TYPE_PERSON,
} = require('./chronicle-summary');

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeEvent(year, actor, text, type, causedBy = null) {
    return { id: `ev_test_${year}`, actor, text, type, causedBy };
}

function wrapTimeline(eventsWithYear) {
    const timeline = {};
    for (const ev of eventsWithYear) {
        const key = `Year ${ev.year}`;
        if (!timeline[key]) timeline[key] = [];
        timeline[key].push({ id: ev.id, actor: ev.actor, text: ev.text, type: ev.type, causedBy: ev.causedBy });
    }
    return { timeline };
}

// Chronicle fixture derived from bugged-chronicle-ruler.json (read from disk)
const chronicleFixture = require('../bug-files/bugged-chronicle-ruler.json');

// ─── flattenTimeline ───────────────────────────────────────────────────────────

describe('flattenTimeline', () => {
    test('empty timeline returns []', () => {
        expect(flattenTimeline({})).toEqual([]);
    });

    test('null/undefined timeline returns []', () => {
        expect(flattenTimeline(null)).toEqual([]);
        expect(flattenTimeline(undefined)).toEqual([]);
    });

    test('events appear in year-ascending order', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(5, 'Alice', 'did something', 'career_shift'), year: 5 },
            { ...makeEvent(1, 'Bob', 'arrived', 'immigration'), year: 1 },
            { ...makeEvent(3, 'Alice', 'found item', 'artifact_discovery'), year: 3 },
        ]);
        const flat = flattenTimeline(timeline);
        expect(flat.map(e => e.year)).toEqual([1, 3, 5]);
    });

    test('same-year events preserve insertion order', () => {
        const timeline = {
            'Year 3': [
                makeEvent(3, 'First', 'first event', 'friendship'),
                makeEvent(3, 'Second', 'second event', 'rivalry'),
                makeEvent(3, 'Third', 'third event', 'romance'),
            ],
        };
        const flat = flattenTimeline(timeline);
        expect(flat.map(e => e.actor)).toEqual(['First', 'Second', 'Third']);
    });

    test('causedBy defaults to null when absent', () => {
        const timeline = {
            'Year 1': [{ id: 'x', actor: 'A', text: 'b', type: 'death' }],
        };
        const flat = flattenTimeline(timeline);
        expect(flat[0].causedBy).toBeNull();
    });
});

// ─── extractTitleFromText ──────────────────────────────────────────────────────

describe('extractTitleFromText', () => {
    test.each([
        ['Seized power and became the new Mayor.', 'Mayor'],
        ['Seized power and became the new Lord.', 'Lord'],
        ['Seized power and became the new Magistrate.', 'Magistrate'],
        ['Seized power and became the new King.', 'King'],
        ['With the seat empty, the traveler stepped up and claimed the title of Magistrate.', 'Magistrate'],
    ])('extracts "%s" → %s', (text, expected) => {
        expect(extractTitleFromText(text)).toBe(expected);
    });

    test('falls back to Mayor when no title found', () => {
        expect(extractTitleFromText('Something completely different.')).toBe('Mayor');
    });
});

// ─── extractElectedName ───────────────────────────────────────────────────────

describe('extractElectedName', () => {
    test('extracts successor name', () => {
        expect(extractElectedName(
            'The traveler abdicated, and the people elected Rowena Wintershield as the new Lord.'
        )).toBe('Rowena Wintershield');
    });

    test('returns null when no election text', () => {
        expect(extractElectedName('The traveler abdicated, leaving the town leaderless.')).toBeNull();
    });
});

// ─── extractTargetName ────────────────────────────────────────────────────────

describe('extractTargetName', () => {
    test('extracts friendship target', () => {
        expect(extractTargetName('Formed a strong bond with Alistair Thornback.')).toBe('Alistair Thornback');
    });

    test('extracts romance target', () => {
        expect(extractTargetName('Fell deeply in love with Faelan Ravenwood.')).toBe('Faelan Ravenwood');
    });

    test('extracts rivalry target', () => {
        expect(extractTargetName('Started a bitter blood feud with Sigrid Blackmere.')).toBe('Sigrid Blackmere');
    });

    test('returns null when no pattern matches', () => {
        expect(extractTargetName('Just an unrelated event.')).toBeNull();
    });
});

// ─── extractChildName ─────────────────────────────────────────────────────────

describe('extractChildName', () => {
    test('extracts child name from "Had a child named X with Y"', () => {
        expect(extractChildName('Had a child named Seren Marshborn with Zara Swiftstream.')).toBe('Seren Marshborn');
    });

    test('returns null when pattern absent', () => {
        expect(extractChildName('Welcomed their child, Seren.')).toBeNull();
    });
});

// ─── extractArtifactName ──────────────────────────────────────────────────────

describe('extractArtifactName', () => {
    test('extracts artifact from discovery event', () => {
        expect(extractArtifactName('Discovered The Astral Mace in the wilderness.')).toBe('The Astral Mace');
    });

    test('returns null when text does not start with "Discovered"', () => {
        expect(extractArtifactName('Something else happened.')).toBeNull();
    });
});

// ─── classifyPowerEvent ───────────────────────────────────────────────────────

describe('classifyPowerEvent', () => {
    test('GAIN: standard seizure', () => {
        const ev = { year: 5, actor: 'Sylas Deepforge', text: 'Seized power and became the new Magistrate.', type: 'power_seizure', causedBy: null };
        expect(classifyPowerEvent(ev)).toMatchObject({ class: 'GAIN', actor: 'Sylas Deepforge', title: 'Magistrate' });
    });

    test('LOSE: ouster', () => {
        const ev = {
            year: 13, actor: 'Sylas Deepforge',
            text: "Was ousted from the Lord's seat by Lysander Coppergate.",
            type: 'power_seizure',
            causedBy: { actorName: 'Lysander Coppergate' },
        };
        expect(classifyPowerEvent(ev)).toMatchObject({ class: 'LOSE', actor: 'Sylas Deepforge', oustedBy: 'Lysander Coppergate' });
    });

    test('ABDICATE with successor', () => {
        const ev = {
            year: 51, actor: 'Ironford',
            text: 'The traveler abdicated, and the people elected Rowena Wintershield as the new Lord.',
            type: 'power_seizure', causedBy: null,
        };
        expect(classifyPowerEvent(ev)).toMatchObject({ class: 'ABDICATE', successor: 'Rowena Wintershield' });
    });

    test('ABDICATE leaderless', () => {
        const ev = {
            year: 10, actor: 'Ironford',
            text: 'The traveler abdicated, leaving the town leaderless.',
            type: 'power_seizure', causedBy: null,
        };
        expect(classifyPowerEvent(ev)).toMatchObject({ class: 'ABDICATE_LEADERLESS' });
    });

    test('GAIN: traveler claimed empty throne', () => {
        const ev = {
            year: 7, actor: 'The Traveler',
            text: 'With the seat empty, the traveler stepped up and claimed the title of Mayor.',
            type: 'power_seizure', causedBy: null,
        };
        expect(classifyPowerEvent(ev)).toMatchObject({ class: 'GAIN', title: 'Mayor' });
    });
});

// ─── extractParents ───────────────────────────────────────────────────────────

describe('extractParents', () => {
    test('finds both parents via birth events', () => {
        const allEvents = [
            { year: 13, actor: 'Grom Marshborn', text: 'Had a child named Seren Marshborn with Zara Swiftstream.', type: 'birth', causedBy: null },
            { year: 13, actor: 'Zara Swiftstream', text: 'Welcomed their child, Seren Marshborn.', type: 'birth', causedBy: null },
        ];
        const parents = extractParents(allEvents, 'Seren Marshborn');
        expect(parents).toContain('Grom Marshborn');
        expect(parents).toContain('Zara Swiftstream');
        expect(parents).toHaveLength(2);
    });

    test('returns empty array when no parents found', () => {
        const allEvents = [
            { year: 1, actor: 'Unknown', text: 'Some unrelated event.', type: 'immigration', causedBy: null },
        ];
        expect(extractParents(allEvents, 'Nobody')).toEqual([]);
    });
});

// ─── extractChildren ──────────────────────────────────────────────────────────

describe('extractChildren', () => {
    test('extracts both children from birth events', () => {
        const personEvents = [
            { year: 13, actor: 'Grom Marshborn', text: 'Had a child named Seren Marshborn with Zara Swiftstream.', type: 'birth', causedBy: null },
            { year: 22, actor: 'Grom Marshborn', text: 'Had a child named Sigrid Marshborn with Zara Swiftstream.', type: 'birth', causedBy: null },
        ];
        expect(extractChildren(personEvents)).toEqual(['Seren Marshborn', 'Sigrid Marshborn']);
    });

    test('deduplicates child names', () => {
        const personEvents = [
            { year: 5, actor: 'A', text: 'Had a child named Bob Smith with C.', type: 'birth', causedBy: null },
            { year: 5, actor: 'A', text: 'Had a child named Bob Smith with C.', type: 'birth', causedBy: null },
        ];
        expect(extractChildren(personEvents)).toHaveLength(1);
    });
});

// ─── summarizeRulerHistory ────────────────────────────────────────────────────

describe('summarizeRulerHistory', () => {
    test('empty timeline returns empty result', () => {
        const result = summarizeRulerHistory({});
        expect(result).toMatchObject({ type: SUMMARY_TYPE_RULER_HISTORY, rulers: [], turbulentYears: [] });
    });

    test('single ruler still in power', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'Alice', 'Seized power and became the new Mayor.', 'power_seizure'), year: 1 },
        ]);
        const result = summarizeRulerHistory(timeline);
        expect(result.rulers).toHaveLength(1);
        expect(result.rulers[0]).toMatchObject({
            name: 'Alice',
            title: 'Mayor',
            seizedPowerYear: 1,
            leftOfficeYear: null,
            leftOfficeReason: REASON_STILL_RULING,
        });
    });

    test('second ruler ousts first', () => {
        const causedByA = { actorName: 'Bob', year: 5 };
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'Alice', 'Seized power and became the new Mayor.', 'power_seizure'), year: 1 },
            { ...makeEvent(5, 'Bob', 'Seized power and became the new Mayor.', 'power_seizure'), year: 5 },
            { ...makeEvent(5, 'Alice', "Was ousted from the Mayor's seat by Bob.", 'power_seizure', causedByA), year: 5 },
        ]);
        const result = summarizeRulerHistory(timeline);
        const alice = result.rulers.find(r => r.name === 'Alice');
        const bob   = result.rulers.find(r => r.name === 'Bob');
        expect(alice.leftOfficeReason).toBe(REASON_OUSTED);
        expect(alice.oustedBy).toBe('Bob');
        expect(alice.leftOfficeYear).toBe(5);
        expect(alice.tenure).toBe(4);
        expect(bob.leftOfficeReason).toBe(REASON_STILL_RULING);
    });

    test('ruler who dies in office', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'Alice', 'Seized power and became the new Mayor.', 'power_seizure'), year: 1 },
            { ...makeEvent(8, 'Alice', 'died of a sudden fever.', 'death'), year: 8 },
        ]);
        const result = summarizeRulerHistory(timeline);
        const alice = result.rulers[0];
        expect(alice.diedInOffice).toMatchObject({ year: 8 });
        expect(alice.leftOfficeReason).toBe(REASON_DIED_IN_OFFICE);
    });

    test('ruler ousted in same year they seized power (tenure 0)', () => {
        const causedBy = { actorName: 'Bob', year: 3 };
        const { timeline } = wrapTimeline([
            { ...makeEvent(3, 'Alice', 'Seized power and became the new Mayor.', 'power_seizure'), year: 3 },
            { ...makeEvent(3, 'Bob', 'Seized power and became the new Mayor.', 'power_seizure'), year: 3 },
            { ...makeEvent(3, 'Alice', "Was ousted from the Mayor's seat by Bob.", 'power_seizure', causedBy), year: 3 },
        ]);
        const result = summarizeRulerHistory(timeline);
        const alice = result.rulers.find(r => r.name === 'Alice');
        expect(alice.tenure).toBe(0);
    });

    test('turbulent year: 3 rulers in year 3', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(3, 'A', 'Seized power and became the new Mayor.', 'power_seizure'), year: 3 },
            { ...makeEvent(3, 'B', 'Seized power and became the new Mayor.', 'power_seizure'), year: 3 },
            { ...makeEvent(3, 'C', 'Seized power and became the new Mayor.', 'power_seizure'), year: 3 },
        ]);
        const result = summarizeRulerHistory(timeline);
        expect(result.turbulentYears).toHaveLength(1);
        expect(result.turbulentYears[0]).toMatchObject({ year: 3, rulerCount: 3 });
    });

    test('abdication with successor', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'Alice', 'Seized power and became the new Lord.', 'power_seizure'), year: 1 },
            {
                ...makeEvent(10, 'Ironford',
                    'The traveler abdicated, and the people elected Rowena Wintershield as the new Lord.',
                    'power_seizure'),
                year: 10,
            },
        ]);
        const result = summarizeRulerHistory(timeline);
        const alice  = result.rulers.find(r => r.name === 'Alice');
        const rowena = result.rulers.find(r => r.name === 'Rowena Wintershield');
        expect(alice.leftOfficeReason).toBe(REASON_ABDICATED);
        expect(rowena).toBeDefined();
        expect(rowena.seizedPowerYear).toBe(10);
    });

    test('fateAfterOffice captured for ousted ruler who later dies', () => {
        const causedBy = { actorName: 'Bob', year: 5 };
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'Alice', 'Seized power and became the new Mayor.', 'power_seizure'), year: 1 },
            { ...makeEvent(5, 'Bob', 'Seized power and became the new Mayor.', 'power_seizure'), year: 5 },
            { ...makeEvent(5, 'Alice', "Was ousted from the Mayor's seat by Bob.", 'power_seizure', causedBy), year: 5 },
            { ...makeEvent(20, 'Alice', 'passed away peacefully in their sleep.', 'death'), year: 20 },
        ]);
        const result = summarizeRulerHistory(timeline);
        const alice = result.rulers.find(r => r.name === 'Alice');
        expect(alice.fateAfterOffice).toMatchObject({ year: 20 });
    });

    test('no turbulence when only one ruler per year', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'A', 'Seized power and became the new Mayor.', 'power_seizure'), year: 1 },
            { ...makeEvent(5, 'B', 'Seized power and became the new Mayor.', 'power_seizure'), year: 5 },
        ]);
        const result = summarizeRulerHistory(timeline);
        expect(result.turbulentYears).toHaveLength(0);
    });

    test('fixture: Ironford ruler sequence', () => {
        const result = summarizeRulerHistory(chronicleFixture.timeline);

        // Sylas is the first ruler (Year 4)
        const sylas = result.rulers.find(r => r.name === 'Sylas Deepforge');
        expect(sylas).toBeDefined();
        expect(sylas.seizedPowerYear).toBe(4);
        expect(sylas.title).toBe('Magistrate');

        // Year 24 and Year 38 are turbulent
        const turbulentYears = result.turbulentYears.map(t => t.year);
        expect(turbulentYears).toContain(24);
        expect(turbulentYears).toContain(38);

        // Last ruler is Rowena Wintershield (abdication successor, Year 51)
        const rowena = result.rulers.find(r => r.name === 'Rowena Wintershield');
        expect(rowena).toBeDefined();
        expect(rowena.seizedPowerYear).toBe(51);

        // Sylas died in Year 34 — should be fateAfterOffice (was ousted long before)
        expect(sylas.fateAfterOffice).toBeDefined();
        expect(sylas.fateAfterOffice.year).toBe(34);
    });

    test('determinism: same input produces identical output', () => {
        const r1 = summarizeRulerHistory(chronicleFixture.timeline);
        const r2 = summarizeRulerHistory(chronicleFixture.timeline);
        expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
    });
});

// ─── summarizePerson ──────────────────────────────────────────────────────────

describe('summarizePerson', () => {
    test('unknown person returns null', () => {
        expect(summarizePerson({}, 'Nobody Here')).toBeNull();
    });

    test('person with only immigration event gets arrivedYear set', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(7, 'Nadir Stonehelm', 'Arrived in town seeking a new life.', 'immigration'), year: 7 },
        ]);
        const result = summarizePerson(timeline, 'Nadir Stonehelm');
        expect(result.lifespan.arrivedYear).toBe(7);
        expect(result.lifespan.diedYear).toBeNull();
    });

    test('career shifts extracted correctly', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(3, 'Faelan Ravenwood', 'Became a Merchant.', 'career_shift'), year: 3 },
            { ...makeEvent(6, 'Faelan Ravenwood', 'Became a Bandit.', 'career_shift'), year: 6 },
            { ...makeEvent(7, 'Faelan Ravenwood', 'Became a Merchant.', 'career_shift'), year: 7 },
        ]);
        const result = summarizePerson(timeline, 'Faelan Ravenwood');
        // Second "Merchant" is deduplicated
        expect(result.careers).toEqual(['Merchant', 'Bandit']);
    });

    test('relationships extracted', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(2, 'Soraya Ironfist', 'Formed a strong bond with Alistair Thornback.', 'friendship'), year: 2 },
            { ...makeEvent(5, 'Soraya Ironfist', 'Fell deeply in love with Alistair Thornback.', 'romance'), year: 5 },
            { ...makeEvent(6, 'Soraya Ironfist', 'Started a bitter blood feud with Bob.', 'rivalry'), year: 6 },
        ]);
        const result = summarizePerson(timeline, 'Soraya Ironfist');
        expect(result.relationships.friendships).toContain('Alistair Thornback');
        expect(result.relationships.romances).toContain('Alistair Thornback');
        expect(result.relationships.rivals).toContain('Bob');
    });

    test('artifacts from both discovery and inheritance events', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'Emric Blackwood', 'Discovered The Crimson Signet in the wilderness.', 'artifact_discovery'), year: 1 },
            { ...makeEvent(6, 'Emric Blackwood', 'Received The Astral Crown from someone.', 'inheritance'), year: 6 },
        ]);
        const result = summarizePerson(timeline, 'Emric Blackwood');
        expect(result.artifacts).toContain('The Crimson Signet');
        expect(result.artifacts).toContain('The Astral Crown');
    });

    test('lineage contains children for person with birth events', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(1, 'Grom Marshborn', 'Arrived as a refugee seeking shelter.', 'migration'), year: 1 },
            { ...makeEvent(13, 'Grom Marshborn', 'Had a child named Seren Marshborn with Zara Swiftstream.', 'birth'), year: 13 },
            { ...makeEvent(22, 'Grom Marshborn', 'Had a child named Sigrid Marshborn with Zara Swiftstream.', 'birth'), year: 22 },
            { ...makeEvent(13, 'Zara Swiftstream', 'Welcomed their child, Seren Marshborn.', 'birth'), year: 13 },
            { ...makeEvent(22, 'Zara Swiftstream', 'Welcomed their child, Sigrid Marshborn.', 'birth'), year: 22 },
        ]);
        const result = summarizePerson(timeline, 'Grom Marshborn');
        const childNames = result.lineage.children.map(c => c.name);
        expect(childNames).toContain('Seren Marshborn');
        expect(childNames).toContain('Sigrid Marshborn');
    });

    test('lineage upward: parents found', () => {
        const { timeline } = wrapTimeline([
            { ...makeEvent(13, 'Grom Marshborn', 'Had a child named Seren Marshborn with Zara Swiftstream.', 'birth'), year: 13 },
            { ...makeEvent(13, 'Zara Swiftstream', 'Welcomed their child, Seren Marshborn.', 'birth'), year: 13 },
            { ...makeEvent(13, 'Seren Marshborn', 'Was born.', 'birth'), year: 13 },
        ]);
        const result = summarizePerson(timeline, 'Seren Marshborn');
        const parentNames = result.lineage.parents.map(p => p.name);
        expect(parentNames).toContain('Grom Marshborn');
        expect(parentNames).toContain('Zara Swiftstream');
    });

    test('fixture: Sylas Deepforge summary', () => {
        const result = summarizePerson(chronicleFixture.timeline, 'Sylas Deepforge');
        expect(result).not.toBeNull();
        expect(result.type).toBe(SUMMARY_TYPE_PERSON);
        expect(result.careers).toContain('Merchant');
        expect(result.power.some(p => p.title === 'Magistrate')).toBe(true);
        expect(result.lifespan.diedYear).toBe(34);
    });

    test('fixture: Grom Marshborn has children in lineage', () => {
        const result = summarizePerson(chronicleFixture.timeline, 'Grom Marshborn');
        const childNames = result.lineage.children.map(c => c.name);
        expect(childNames).toContain('Seren Marshborn');
        expect(childNames).toContain('Sigrid Marshborn');
    });

    test('determinism: same name + timeline → identical output', () => {
        const r1 = summarizePerson(chronicleFixture.timeline, 'Sylas Deepforge');
        const r2 = summarizePerson(chronicleFixture.timeline, 'Sylas Deepforge');
        expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
    });
});

// ─── buildLineageNode ─────────────────────────────────────────────────────────

describe('buildLineageNode', () => {
    test('depth 0 returns null', () => {
        const allEvents = [{ year: 1, actor: 'Alice', text: 'arrived', type: 'immigration', causedBy: null }];
        expect(buildLineageNode(allEvents, 'Alice', 'both', 0, new Set())).toBeNull();
    });

    test('cycle prevention: visited set blocks revisiting same name', () => {
        const allEvents = [
            { year: 1, actor: 'Alice', text: 'arrived', type: 'immigration', causedBy: null },
        ];
        const visited = new Set(['Alice']);
        expect(buildLineageNode(allEvents, 'Alice', 'both', 3, visited)).toBeNull();
    });

    test('direction "down" only traverses children, not parents', () => {
        const allEvents = [
            { year: 1, actor: 'Parent', text: 'arrived', type: 'immigration', causedBy: null },
            { year: 5, actor: 'Parent', text: 'Had a child named Child with Other.', type: 'birth', causedBy: null },
            { year: 5, actor: 'Other', text: 'Welcomed their child, Child.', type: 'birth', causedBy: null },
            { year: 5, actor: 'Grandparent', text: 'Had a child named Parent with X.', type: 'birth', causedBy: null },
        ];
        const node = buildLineageNode(allEvents, 'Parent', 'down', 3, new Set());
        expect(node.children.some(c => c.name === 'Child')).toBe(true);
        expect(node.parents).toHaveLength(0);
    });

    test('direction "up" only traverses parents, not children', () => {
        const allEvents = [
            { year: 1, actor: 'Me', text: 'arrived', type: 'immigration', causedBy: null },
            { year: 2, actor: 'Dad', text: 'Had a child named Me with Mom.', type: 'birth', causedBy: null },
            { year: 2, actor: 'Mom', text: 'Welcomed their child, Me.', type: 'birth', causedBy: null },
            { year: 10, actor: 'Me', text: 'Had a child named Kid with Y.', type: 'birth', causedBy: null },
        ];
        const node = buildLineageNode(allEvents, 'Me', 'up', 3, new Set());
        expect(node.parents.some(p => p.name === 'Dad')).toBe(true);
        expect(node.children).toHaveLength(0);
    });
});
