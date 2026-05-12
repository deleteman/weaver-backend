const LOG_PREFIX = '[LOG]';

function log(event, details = {}) {
    console.log(`${LOG_PREFIX} ${event}`, details);
}

module.exports = { log };