/**
 * Chronicle Summary Engine
 *
 * Pure functions that transform a raw chronicle timeline (from /chronicle endpoint)
 * into structured narrative summaries. No ECS, no DB access — all inputs are plain objects.
 */

// ─── Event type constants ──────────────────────────────────────────────────────
const EVENT_TYPE_POWER_SEIZURE   = 'power_seizure';
const EVENT_TYPE_REGICIDE        = 'regicide';
const EVENT_TYPE_DEATH           = 'death';
const EVENT_TYPE_ASSASSINATION   = 'assassination';
const EVENT_TYPE_CHILD_DEATH     = 'child_death';
const EVENT_TYPE_BIRTH           = 'birth';
const EVENT_TYPE_CAREER_SHIFT    = 'career_shift';
const EVENT_TYPE_FRIENDSHIP      = 'friendship';
const EVENT_TYPE_ROMANCE         = 'romance';
const EVENT_TYPE_RIVALRY         = 'rivalry';
const EVENT_TYPE_ARTIFACT        = 'artifact_discovery';
const EVENT_TYPE_INHERITANCE     = 'inheritance';
const EVENT_TYPE_MIGRATION       = 'migration';
const EVENT_TYPE_IMMIGRATION     = 'immigration';

// ─── Text signal constants (matched against event.text) ───────────────────────
const TEXT_SIGNAL_SEIZED              = 'Seized power';
const TEXT_SIGNAL_OUSTED              = 'Was ousted from';
const TEXT_SIGNAL_TRAVELER_ABDICATED  = 'The traveler abdicated';
const TEXT_SIGNAL_PEOPLE_ELECTED      = 'the people elected';
const TEXT_SIGNAL_TRAVELER_CLAIMED    = 'the traveler stepped up and claimed';
const TEXT_SIGNAL_LEADERLESS          = 'leaving the town leaderless';
const TEXT_SIGNAL_TRAVELER_SEIZED     = 'traveler seized';
const TEXT_SIGNAL_CHILD_NAMED         = 'child named ';
const TEXT_SIGNAL_WELCOMED_CHILD      = 'Welcomed their child, ';
const TEXT_SIGNAL_DISCOVERED          = 'Discovered ';
const TEXT_SIGNAL_IN_THE_WILDERNESS   = ' in the wilderness';

// ─── Ruler leave-office reason codes ──────────────────────────────────────────
const REASON_SEIZED        = 'seized';
const REASON_OUSTED        = 'ousted';
const REASON_ABDICATED     = 'abdicated';
const REASON_CLAIMED       = 'claimed_empty_throne';
const REASON_DIED_IN_OFFICE = 'died_in_office';
const REASON_STILL_RULING  = 'still_ruling';
const REASON_UNKNOWN       = 'unknown';

// ─── Summary type identifiers ──────────────────────────────────────────────────
const SUMMARY_TYPE_RULER_HISTORY = 'ruler_history';
const SUMMARY_TYPE_PERSON        = 'person_summary';

// ─── Focus query param values ──────────────────────────────────────────────────
const FOCUS_RULER  = 'ruler';
const FOCUS_PERSON = 'person';

// ─── Turbulence threshold: distinct rulers gaining power in same year ──────────
const TURBULENT_YEAR_RULER_THRESHOLD = 2;

// ─── Maximum lineage recursion depth (generations up and down) ────────────────
const MAX_LINEAGE_DEPTH = 4;

// ─── Valid ruler titles (kept in sync with TIER_RULER_TITLES in politics.js) ──
const VALID_RULER_TITLES = ['Mayor', 'Lord', 'Magistrate', 'King'];

// ─── Death event types (for cross-referencing fate) ───────────────────────────
const DEATH_EVENT_TYPES = new Set([
    EVENT_TYPE_DEATH,
    EVENT_TYPE_ASSASSINATION,
    EVENT_TYPE_REGICIDE,
    EVENT_TYPE_CHILD_DEATH,
]);

// ─── Power event types (for ruler history analysis) ───────────────────────────
const POWER_EVENT_TYPES = new Set([
    EVENT_TYPE_POWER_SEIZURE,
    EVENT_TYPE_REGICIDE,
]);

// ─── Types excluded from "notable events while ruling" ────────────────────────
const EXCLUDED_FROM_NOTABLE = new Set([
    EVENT_TYPE_POWER_SEIZURE,
    EVENT_TYPE_REGICIDE,
    EVENT_TYPE_DEATH,
    EVENT_TYPE_ASSASSINATION,
]);

/**
 * Parses the nested timeline object into a flat, chronologically sorted array.
 * Stable sort: same-year events preserve their original insertion order.
 *
 * @param {Object} timeline  - { "Year N": [{id, actor, text, type, causedBy}...] }
 * @returns {Array<NormalizedEvent>}
 */
function flattenTimeline(timeline) {
    if (!timeline || typeof timeline !== 'object') return [];
    const events = [];
    for (const yearKey of Object.keys(timeline)) {
        const yearNum = parseInt(yearKey.replace('Year ', ''), 10);
        if (isNaN(yearNum)) continue;
        const yearEvents = timeline[yearKey];
        if (!Array.isArray(yearEvents)) continue;
        for (const ev of yearEvents) {
            events.push({ year: yearNum, actor: ev.actor, text: ev.text, type: ev.type, causedBy: ev.causedBy ?? null });
        }
    }
    // Stable sort by year (Array.sort is stable in V8)
    events.sort((a, b) => a.year - b.year);
    return events;
}

/**
 * Extracts a ruler title from event text.
 * Falls back to 'Mayor' when no known title is found.
 *
 * @param {string} text
 * @returns {string}
 */
function extractTitleFromText(text) {
    const pattern = new RegExp(`(?:new|title of)\\s+(${VALID_RULER_TITLES.join('|')})`);
    const match = text.match(pattern);
    return match ? match[1] : 'Mayor';
}

/**
 * Extracts the name elected after abdication from text such as:
 * "The traveler abdicated, and the people elected Rowena Wintershield as the new Lord."
 *
 * @param {string} text
 * @returns {string|null}
 */
function extractElectedName(text) {
    const match = text.match(/the people elected (.*?) as the new/);
    return match ? match[1].trim() : null;
}

/**
 * Extracts a target NPC name from social event text.
 * Works for friendship ("bond with NAME"), romance ("in love with NAME"),
 * and rivalry ("blood feud with NAME") patterns.
 *
 * @param {string} text
 * @returns {string|null}
 */
function extractTargetName(text) {
    const match = text.match(/(?:bond with|in love with|blood feud with)\s+([\w\s]+?)(?:\.|,|$)/);
    return match ? match[1].trim() : null;
}

/**
 * Extracts the child's name from a birth event text.
 * "Had a child named Seren Marshborn with Zara Swiftstream."
 *
 * @param {string} text
 * @returns {string|null}
 */
function extractChildName(text) {
    const idx = text.indexOf(TEXT_SIGNAL_CHILD_NAMED);
    if (idx === -1) return null;
    const after = text.slice(idx + TEXT_SIGNAL_CHILD_NAMED.length);
    const end = after.search(/\s+with\s+|\.|,/);
    return end === -1 ? after.trim() : after.slice(0, end).trim();
}

/**
 * Extracts an artifact name from an artifact_discovery event text.
 * "Discovered The Astral Mace in the wilderness."
 *
 * @param {string} text
 * @returns {string|null}
 */
function extractArtifactName(text) {
    if (!text.startsWith(TEXT_SIGNAL_DISCOVERED)) return null;
    const inner = text.slice(TEXT_SIGNAL_DISCOVERED.length);
    const end = inner.indexOf(TEXT_SIGNAL_IN_THE_WILDERNESS);
    return end === -1 ? inner.trim() : inner.slice(0, end).trim();
}

/**
 * Classifies a power-related event into its semantic role.
 *
 * @param {NormalizedEvent} event
 * @returns {{ class: string, actor?: string, title?: string, oustedBy?: string, successor?: string }}
 */
function classifyPowerEvent(event) {
    const { text, actor, causedBy } = event;

    if (text.includes(TEXT_SIGNAL_TRAVELER_ABDICATED)) {
        if (text.includes(TEXT_SIGNAL_PEOPLE_ELECTED)) {
            const successor = extractElectedName(text);
            return { class: 'ABDICATE', actor, successor };
        }
        if (text.includes(TEXT_SIGNAL_LEADERLESS)) {
            return { class: 'ABDICATE_LEADERLESS', actor };
        }
        return { class: 'ABDICATE_LEADERLESS', actor };
    }

    if (text.includes(TEXT_SIGNAL_TRAVELER_CLAIMED)) {
        return { class: 'GAIN', actor, title: extractTitleFromText(text) };
    }

    if (text.includes(TEXT_SIGNAL_TRAVELER_SEIZED)) {
        return { class: 'GAIN', actor, title: extractTitleFromText(text) };
    }

    if (text.includes(TEXT_SIGNAL_SEIZED)) {
        return { class: 'GAIN', actor, title: extractTitleFromText(text) };
    }

    if (text.includes(TEXT_SIGNAL_OUSTED)) {
        const oustedBy = causedBy?.actorName ?? null;
        return { class: 'LOSE', actor, oustedBy };
    }

    // Regicide: "ruler was slain and the Traveler seized the throne"
    if (event.type === EVENT_TYPE_REGICIDE) {
        return { class: 'GAIN', actor, title: extractTitleFromText(text) };
    }

    return { class: 'UNKNOWN', actor };
}

/**
 * Produces the full political ruler history for the settlement.
 *
 * @param {Object} timeline  - Raw timeline from chronicle endpoint
 * @returns {RulerHistorySummary}
 */
function summarizeRulerHistory(timeline) {
    const events = flattenTimeline(timeline);

    const powerEvents = events.filter(e => POWER_EVENT_TYPES.has(e.type));

    // ── Pass 1: Build ruler slots from GAIN events ───────────────────────────
    const rulers = [];
    let currentRuler = null;

    for (const ev of powerEvents) {
        const classification = classifyPowerEvent(ev);

        if (classification.class === 'GAIN') {
            if (currentRuler) {
                currentRuler.leftOfficeYear = ev.year;
                currentRuler.leftOfficeReason = REASON_UNKNOWN;
                rulers.push(currentRuler);
            }
            currentRuler = {
                name: classification.actor,
                title: classification.title ?? 'Mayor',
                seizedPowerYear: ev.year,
                leftOfficeYear: null,
                tenure: null,
                leftOfficeReason: REASON_STILL_RULING,
                oustedBy: null,
                diedInOffice: null,
                fateAfterOffice: null,
                notableEventsWhileRuling: [],
            };
        } else if (classification.class === 'ABDICATE' || classification.class === 'ABDICATE_LEADERLESS') {
            // Close the current ruler (the player / traveler) who abdicated
            const abdicating = currentRuler;
            if (abdicating) {
                abdicating.leftOfficeYear = ev.year;
                abdicating.leftOfficeReason = REASON_ABDICATED;
                rulers.push(abdicating);
                currentRuler = null;
            }
            // Open a new slot for the elected successor (if any)
            if (classification.class === 'ABDICATE' && classification.successor) {
                currentRuler = {
                    name: classification.successor,
                    title: extractTitleFromText(ev.text),
                    seizedPowerYear: ev.year,
                    leftOfficeYear: null,
                    tenure: null,
                    leftOfficeReason: REASON_STILL_RULING,
                    oustedBy: null,
                    diedInOffice: null,
                    fateAfterOffice: null,
                    notableEventsWhileRuling: [],
                };
            }
        }
    }

    if (currentRuler) {
        rulers.push(currentRuler);
    }

    // ── Pass 2: Patch LOSE events onto existing ruler slots ──────────────────
    for (const ev of powerEvents) {
        const classification = classifyPowerEvent(ev);
        if (classification.class !== 'LOSE') continue;

        const target = rulers.find(r => r.name === classification.actor);
        if (!target) continue;

        target.leftOfficeYear  = ev.year;
        target.leftOfficeReason = REASON_OUSTED;
        target.oustedBy        = classification.oustedBy;
    }

    // ── Compute tenure ───────────────────────────────────────────────────────
    for (const ruler of rulers) {
        if (ruler.leftOfficeYear !== null) {
            ruler.tenure = ruler.leftOfficeYear - ruler.seizedPowerYear;
        }
    }

    // ── Cross-reference deaths ───────────────────────────────────────────────
    const deathEvents = events.filter(e => DEATH_EVENT_TYPES.has(e.type));

    for (const ruler of rulers) {
        const start = ruler.seizedPowerYear;
        const end   = ruler.leftOfficeYear ?? Infinity;

        const inOffice = deathEvents.find(e => e.actor === ruler.name && e.year >= start && e.year <= end);
        if (inOffice) {
            ruler.diedInOffice         = { year: inOffice.year, cause: inOffice.text };
            ruler.leftOfficeReason     = REASON_DIED_IN_OFFICE;
            ruler.leftOfficeYear       = ruler.leftOfficeYear ?? inOffice.year;
            ruler.tenure               = ruler.leftOfficeYear - start;
        }

        if (ruler.leftOfficeYear !== null) {
            const afterOffice = deathEvents.find(e => e.actor === ruler.name && e.year > ruler.leftOfficeYear);
            if (afterOffice) {
                ruler.fateAfterOffice = { year: afterOffice.year, cause: afterOffice.text };
            }
        }
    }

    // ── Notable events while ruling ──────────────────────────────────────────
    for (const ruler of rulers) {
        const start = ruler.seizedPowerYear;
        const end   = ruler.leftOfficeYear ?? Infinity;

        ruler.notableEventsWhileRuling = events
            .filter(e =>
                e.actor === ruler.name &&
                e.year >= start &&
                e.year <= end &&
                !EXCLUDED_FROM_NOTABLE.has(e.type)
            )
            .map(e => ({ year: e.year, text: e.text, type: e.type }));
    }

    // ── Turbulent years ──────────────────────────────────────────────────────
    const gainByYear = new Map();
    for (const ev of powerEvents) {
        const classification = classifyPowerEvent(ev);
        if (classification.class !== 'GAIN') continue;
        if (!gainByYear.has(ev.year)) gainByYear.set(ev.year, new Set());
        gainByYear.get(ev.year).add(classification.actor);
    }

    const turbulentYears = [];
    for (const [year, actors] of gainByYear) {
        if (actors.size >= TURBULENT_YEAR_RULER_THRESHOLD) {
            turbulentYears.push({
                year,
                rulerCount: actors.size,
                description: `${actors.size} rulers seized power in Year ${year}`,
            });
        }
    }
    turbulentYears.sort((a, b) => a.year - b.year);

    return { type: SUMMARY_TYPE_RULER_HISTORY, rulers, turbulentYears };
}

// ─── Person summary helpers ────────────────────────────────────────────────────

function extractLifespan(events, name) {
    const personEvents = events.filter(e => e.actor === name);
    if (personEvents.length === 0) return { arrivedYear: null, diedYear: null, cause: null };

    const arrivalTypes = new Set([EVENT_TYPE_IMMIGRATION, EVENT_TYPE_MIGRATION]);
    const arrivalEvent = personEvents.find(e => arrivalTypes.has(e.type));
    const arrivedYear  = arrivalEvent?.year ?? personEvents[0].year;

    const deathEvent = personEvents.find(e => DEATH_EVENT_TYPES.has(e.type));
    return {
        arrivedYear,
        diedYear: deathEvent?.year ?? null,
        cause:    deathEvent?.text ?? null,
    };
}

function extractCareers(personEvents) {
    const seen    = new Set();
    const careers = [];
    const careerPattern = /Became (?:a|an) ([\w\s]+?)(?:\.|,|$)/;
    const titlePattern  = new RegExp(`became the new (${VALID_RULER_TITLES.join('|')})`, 'i');

    for (const ev of personEvents) {
        let role = null;

        if (ev.type === EVENT_TYPE_CAREER_SHIFT) {
            const m = ev.text.match(careerPattern);
            if (m) role = m[1].trim();
        } else if (ev.type === EVENT_TYPE_POWER_SEIZURE && ev.text.includes(TEXT_SIGNAL_SEIZED)) {
            const m = ev.text.match(titlePattern);
            if (m) role = m[1].trim();
        }

        if (role && !seen.has(role)) {
            seen.add(role);
            careers.push(role);
        }
    }
    return careers;
}

function extractPower(personEvents) {
    const power = [];
    const titlePattern = new RegExp(`became the new (${VALID_RULER_TITLES.join('|')})`, 'i');
    for (const ev of personEvents) {
        if (ev.type === EVENT_TYPE_POWER_SEIZURE && ev.text.includes(TEXT_SIGNAL_SEIZED)) {
            const m = ev.text.match(titlePattern);
            const title = m ? m[1].trim() : extractTitleFromText(ev.text);
            power.push({ title, year: ev.year });
        }
    }
    return power;
}

function extractRelationships(personEvents) {
    const rel = { friendships: [], romances: [], rivals: [] };
    const seenFriend = new Set();
    const seenRomance = new Set();
    const seenRival   = new Set();

    for (const ev of personEvents) {
        const name = extractTargetName(ev.text);
        if (!name) continue;

        if (ev.type === EVENT_TYPE_FRIENDSHIP && !seenFriend.has(name)) {
            seenFriend.add(name);
            rel.friendships.push(name);
        } else if (ev.type === EVENT_TYPE_ROMANCE && !seenRomance.has(name)) {
            seenRomance.add(name);
            rel.romances.push(name);
        } else if (ev.type === EVENT_TYPE_RIVALRY && !seenRival.has(name)) {
            seenRival.add(name);
            rel.rivals.push(name);
        }
    }
    return rel;
}

function extractArtifacts(personEvents) {
    const artifacts = [];
    const inheritancePatterns = [
        /Received (The [\w\s]+?) from/,
        /Acquired \d+.*?(The [\w\s]+?) from/,
        /Inherited (The [\w\s]+?) from/,
    ];

    for (const ev of personEvents) {
        if (ev.type === EVENT_TYPE_ARTIFACT) {
            const name = extractArtifactName(ev.text);
            if (name) artifacts.push(name);
        } else if (ev.type === EVENT_TYPE_INHERITANCE) {
            for (const pattern of inheritancePatterns) {
                const m = ev.text.match(pattern);
                if (m) {
                    artifacts.push(m[1].trim());
                    break;
                }
            }
        }
    }
    return artifacts;
}

/**
 * Returns the names of children this person had (from birth events where they are actor).
 *
 * @param {Array} personEvents
 * @returns {string[]}
 */
function extractChildren(personEvents) {
    const children = [];
    const seen = new Set();
    for (const ev of personEvents) {
        if (ev.type !== EVENT_TYPE_BIRTH) continue;
        const child = extractChildName(ev.text);
        if (child && !seen.has(child)) {
            seen.add(child);
            children.push(child);
        }
    }
    return children;
}

/**
 * Finds the parents of a person by scanning ALL events for birth entries that name them.
 * "Had a child named NAME with ..." → actor is father
 * "Welcomed their child, NAME." → actor is mother
 *
 * @param {Array} allEvents  - Full flat event list
 * @param {string} personName
 * @returns {string[]}
 */
function extractParents(allEvents, personName) {
    const parents = [];
    const seen = new Set();
    const welcomePrefix = TEXT_SIGNAL_WELCOMED_CHILD + personName;

    for (const ev of allEvents) {
        if (ev.type !== EVENT_TYPE_BIRTH) continue;
        const isChildNamed = ev.text.includes(TEXT_SIGNAL_CHILD_NAMED + personName);
        const isWelcomed   = ev.text.startsWith(welcomePrefix);
        if ((isChildNamed || isWelcomed) && !seen.has(ev.actor)) {
            seen.add(ev.actor);
            parents.push(ev.actor);
        }
    }
    return parents;
}

/**
 * Recursively builds a lineage node for a given person.
 *
 * @param {Array}  allEvents  - Full flat event list
 * @param {string} name
 * @param {'up'|'down'|'both'} direction
 * @param {number} depth
 * @param {Set}    visited    - Cycle guard
 * @returns {LineageNode|null}
 */
function buildLineageNode(allEvents, name, direction, depth, visited) {
    if (depth === 0 || visited.has(name)) return null;
    visited.add(name);

    const personEvents = allEvents.filter(e => e.actor === name);

    const node = {
        name,
        lifespan: extractLifespan(allEvents, name),
        careers:  extractCareers(personEvents),
        power:    extractPower(personEvents),
        parents:  [],
        children: [],
    };

    if (direction === 'down' || direction === 'both') {
        const childNames = extractChildren(personEvents);
        node.children = childNames
            .map(childName => buildLineageNode(allEvents, childName, 'down', depth - 1, visited))
            .filter(Boolean);
    }

    if (direction === 'up' || direction === 'both') {
        const parentNames = extractParents(allEvents, name);
        node.parents = parentNames
            .map(parentName => buildLineageNode(allEvents, parentName, 'up', depth - 1, visited))
            .filter(Boolean);
    }

    return node;
}

/**
 * Produces a biographical summary for a named NPC, including full lineage.
 *
 * @param {Object} timeline  - Raw timeline from chronicle endpoint
 * @param {string} name
 * @returns {PersonSummary|null}  null when no events found for the given name
 */
function summarizePerson(timeline, name) {
    const allEvents   = flattenTimeline(timeline);
    const personEvents = allEvents.filter(e => e.actor === name);

    if (personEvents.length === 0) return null;

    return {
        type:          SUMMARY_TYPE_PERSON,
        name,
        lifespan:      extractLifespan(allEvents, name),
        careers:       extractCareers(personEvents),
        relationships: extractRelationships(personEvents),
        power:         extractPower(personEvents),
        artifacts:     extractArtifacts(personEvents),
        lineage:       buildLineageNode(allEvents, name, 'both', MAX_LINEAGE_DEPTH, new Set()),
    };
}

module.exports = {
    // Public summarizers
    summarizeRulerHistory,
    summarizePerson,
    // Building blocks (exported for testability)
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
    // Constants
    FOCUS_RULER,
    FOCUS_PERSON,
    SUMMARY_TYPE_RULER_HISTORY,
    SUMMARY_TYPE_PERSON,
    REASON_SEIZED,
    REASON_OUSTED,
    REASON_ABDICATED,
    REASON_CLAIMED,
    REASON_DIED_IN_OFFICE,
    REASON_STILL_RULING,
    REASON_UNKNOWN,
    TURBULENT_YEAR_RULER_THRESHOLD,
    MAX_LINEAGE_DEPTH,
};
