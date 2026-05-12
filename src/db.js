// src/db.js
const Database = require('better-sqlite3');
const path = require('path');
const { log } = require('./logger');

// Initialize a local SQLite file database
//const db = new Database('world_deltas.db');
const dbPath = path.resolve(__dirname, '..', 'world_deltas.db');
const db = new Database(dbPath, { readonly: false, fileMustExist: false });

// Create our Delta table if it doesn't exist.
// We track the coordinate, the entity's name (acting as our unique ID here), and the changed state.
db.exec(`
  CREATE TABLE IF NOT EXISTS deltas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coordinate TEXT,
    entity_name TEXT,
    state_key TEXT,
    state_value TEXT
  )
`);

// Function to save a player's action
function saveDelta(coordinate, entityName, stateKey, stateValue) {
    const stmt = db.prepare('INSERT INTO deltas (coordinate, entity_name, state_key, state_value) VALUES (?, ?, ?, ?)');
    stmt.run(coordinate, entityName, stateKey, stateValue);
    log('saveDelta', { coordinate, entityName, stateKey });
}

// Replace-or-insert: removes existing rows with the same key before inserting.
// Use for data that must not accumulate duplicates (territory claims, global state).
function upsertDelta(coordinate, entityName, stateKey, stateValue) {
    const del = db.prepare('DELETE FROM deltas WHERE coordinate = ? AND entity_name = ? AND state_key = ?');
    const ins = db.prepare('INSERT INTO deltas (coordinate, entity_name, state_key, state_value) VALUES (?, ?, ?, ?)');
    db.transaction(() => {
        del.run(coordinate, entityName, stateKey);
        ins.run(coordinate, entityName, stateKey, stateValue);
    })();
    log('upsertDelta', { coordinate, entityName, stateKey });
}

// Returns the coordinate string of the settlement that has claimed this tile,
// or null if the tile is unclaimed.
function getParentCity(coordinate) {
    const stmt = db.prepare(
        'SELECT state_value FROM deltas WHERE coordinate = ? AND entity_name = ? AND state_key = ? ORDER BY id DESC LIMIT 1'
    );
    const row = stmt.get('GLOBAL', coordinate, 'Claimed_By');
    return row ? row.state_value : null;
}

// Function to load all changes for a specific map chunk
function getDeltas(coordinate) {
    const stmt = db.prepare('SELECT * FROM deltas WHERE coordinate = ? ORDER BY id DESC');
    // We must pass the 'coordinate' variable here to replace the '?'
    const results = stmt.all(coordinate);
    log('getDeltas', { coordinate, count: results.length });
    return results; 
}

// At the bottom of src/db.js (below getDeltas)

function getGlobalYear() {
    const deltas = getDeltas("GLOBAL");
    const timeDelta = deltas.find(d => d.entity_name === "Time" && d.state_key === "currentYear");
    const year = timeDelta ? parseInt(timeDelta.state_value) : 51;
    log('getGlobalYear', { year });
    return year;
}

// Update the exports to include it!
module.exports = { saveDelta, upsertDelta, getDeltas, getGlobalYear, getParentCity };

