const crypto = require('crypto');

function deterministicHash(input) {
    return crypto.createHash('sha1').update(input).digest('hex').substring(0, 8);
}

/**
 * @param {string}      description  Full "[Year N] ..." event string
 * @param {string}      type         Event type slug (e.g. 'death', 'power_seizure')
 * @param {string|null} causedBy     ID of a prior event ("ev_xxxxxxxx") or null
 * @returns {{ id: string, year: number, description: string, type: string, causedBy: string|null }}
 */
function makeEvent(description, type, causedBy = null) {
    const yearMatch = description.match(/\[Year (\d+)\]/);
    const year = yearMatch ? parseInt(yearMatch[1]) : 0;
    return { id: 'ev_' + deterministicHash(description), year, description, type, causedBy };
}

module.exports = { deterministicHash, makeEvent };
