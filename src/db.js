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

db.exec(`
  CREATE TABLE IF NOT EXISTS journal (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    year       INTEGER NOT NULL,
    action     TEXT NOT NULL,
    coordinate TEXT NOT NULL,
    npc_id     TEXT,
    item_id    TEXT,
    summary    TEXT NOT NULL,
    detail     TEXT
  );
  CREATE INDEX IF NOT EXISTS journal_coordinate ON journal(coordinate);
  CREATE INDEX IF NOT EXISTS journal_npc_id     ON journal(npc_id);
  CREATE INDEX IF NOT EXISTS journal_year       ON journal(year);
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

function getTierForCoordinate(key) {
    const deltas = getDeltas(key);
    const tierDelta = deltas.find(d => d.state_key === 'tier');
    return tierDelta ? parseInt(tierDelta.state_value) : 0;
}

function getSuzerainForCoordinate(key) {
    const deltas = getDeltas(key);
    const suzerainDelta = deltas.find(d => d.state_key === 'claimedBy' || d.state_key === 'suzerain');
    return suzerainDelta ? suzerainDelta.state_value : null;
}

function getCapsuleDeltas(coordinate) {
    const stmt = db.prepare(
        `SELECT * FROM deltas WHERE coordinate = ? AND state_key LIKE 'capsule_%' ORDER BY id ASC`
    );
    return stmt.all(coordinate);
}

function getRuinHoard(coordinate) {
    const stmt = db.prepare(
        `SELECT state_value FROM deltas WHERE coordinate = ? AND state_key = 'ruin_hoard' ORDER BY id DESC LIMIT 1`
    );
    return stmt.get(coordinate) || null;
}

const JOURNAL_DEFAULT_LIMIT = 100;

function appendJournalEntry({ year, action, coordinate, npcId = null, itemId = null, summary, detail = null }) {
    const stmt = db.prepare(
        'INSERT INTO journal (year, action, coordinate, npc_id, item_id, summary, detail) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const detailJson = detail !== null ? JSON.stringify(detail) : null;
    stmt.run(year, action, coordinate, npcId, itemId, summary, detailJson);
    log('appendJournalEntry', { year, action, coordinate });
}

function getJournal({ coordinate, npcId, itemId, fromYear, toYear, limit = JOURNAL_DEFAULT_LIMIT } = {}) {
    const conditions = [];
    const params = [];
    if (coordinate !== undefined) { conditions.push('coordinate = ?'); params.push(coordinate); }
    if (npcId      !== undefined) { conditions.push('npc_id = ?');     params.push(npcId); }
    if (itemId     !== undefined) { conditions.push('item_id = ?');     params.push(itemId); }
    if (fromYear   !== undefined) { conditions.push('year >= ?');       params.push(fromYear); }
    if (toYear     !== undefined) { conditions.push('year <= ?');       params.push(toYear); }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const total = db.prepare(`SELECT COUNT(*) AS total FROM journal ${where}`).get(...params).total;
    const rows   = db.prepare(`SELECT * FROM journal ${where} ORDER BY year ASC LIMIT ?`).all(...params, limit);
    const entries = rows.map(r => ({
        ...r,
        npcId:  r.npc_id,
        itemId: r.item_id,
        detail: r.detail ? JSON.parse(r.detail) : null,
    }));
    log('getJournal', { total, returned: entries.length });
    return { entries, total };
}

module.exports = { saveDelta, upsertDelta, getDeltas, getGlobalYear, getParentCity, getTierForCoordinate, getSuzerainForCoordinate, getCapsuleDeltas, getRuinHoard, appendJournalEntry, getJournal };

