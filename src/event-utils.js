const crypto = require('crypto');

function deterministicHash(input) {
    return crypto.createHash('sha1').update(input).digest('hex').substring(0, 8);
}

/**
 * @param {string} description  Full "[Year N] ..." event string
 * @param {string} type         Event type slug (e.g. 'death', 'power_seizure')
 * @param {{ id: string, year: number, description: string, type: string, actorName: string }|null} causedBy
 * @returns {{ id: string, year: number, description: string, type: string, causedBy: object|null }}
 */
function makeEvent(description, type, causedBy = null) {
    const yearMatch = description.match(/\[Year (\d+)\]/);
    const year = yearMatch ? parseInt(yearMatch[1]) : 0;
    return { id: 'ev_' + deterministicHash(description), year, description, type, causedBy };
}

/**
 * Builds an inline snapshot of a causing event so that consumers never need to
 * resolve a bare event ID across chunks or against absent (migrated) NPCs.
 *
 * @param {{ id: string, year: number, description: string, type: string }|null} causingEvent
 * @param {string|null} actorName  display name of the NPC who owns the causing event
 * @returns {{ id: string, year: number, description: string, type: string, actorName: string }|null}
 */
function buildCausedBySnapshot(causingEvent, actorName) {
    if (!causingEvent || !causingEvent.id) return null;
    return {
        id:          causingEvent.id,
        year:        causingEvent.year,
        description: causingEvent.description,
        type:        causingEvent.type,
        actorName:   actorName ?? 'Unknown'
    };
}

module.exports = { deterministicHash, makeEvent, buildCausedBySnapshot };
