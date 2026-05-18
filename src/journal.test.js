// src/journal.test.js
// Tests the journal table SQL logic using a real in-memory SQLite database.
// Does NOT use the db.js module (which has a live file-based DB) — instead it
// mirrors the DDL and query logic directly so we test the actual SQL behavior.
const Database = require('better-sqlite3');

const JOURNAL_DDL = `
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
`;

const JOURNAL_DEFAULT_LIMIT = 100;

function makeDb() {
    const db = new Database(':memory:');
    db.exec(JOURNAL_DDL);
    return db;
}

function appendEntry(db, { year, action, coordinate, npcId = null, itemId = null, summary, detail = null }) {
    const detailJson = detail !== null ? JSON.stringify(detail) : null;
    db.prepare(
        'INSERT INTO journal (year, action, coordinate, npc_id, item_id, summary, detail) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(year, action, coordinate, npcId, itemId, summary, detailJson);
}

function getEntries(db, { coordinate, npcId, itemId, fromYear, toYear, limit = JOURNAL_DEFAULT_LIMIT } = {}) {
    const conditions = [];
    const params = [];
    if (coordinate !== undefined) { conditions.push('coordinate = ?'); params.push(coordinate); }
    if (npcId      !== undefined) { conditions.push('npc_id = ?');     params.push(npcId); }
    if (itemId     !== undefined) { conditions.push('item_id = ?');     params.push(itemId); }
    if (fromYear   !== undefined) { conditions.push('year >= ?');       params.push(fromYear); }
    if (toYear     !== undefined) { conditions.push('year <= ?');       params.push(toYear); }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const total   = db.prepare(`SELECT COUNT(*) AS total FROM journal ${where}`).get(...params).total;
    const rows    = db.prepare(`SELECT * FROM journal ${where} ORDER BY year ASC LIMIT ?`).all(...params, limit);
    const entries = rows.map(r => ({
        ...r,
        npcId:  r.npc_id,
        itemId: r.item_id,
        detail: r.detail ? JSON.parse(r.detail) : null,
    }));
    return { entries, total };
}

describe('Journal DB logic', () => {
    let db;

    beforeEach(() => {
        db = makeDb();
    });

    afterEach(() => {
        db.close();
    });

    test('appendJournalEntry inserts a row; getJournal retrieves it', () => {
        appendEntry(db, {
            year: 100,
            action: 'visit',
            coordinate: 'world_X1_Y1',
            summary: 'Visited Ironkeep',
            detail: { settlementName: 'Ironkeep' }
        });

        const { entries, total } = getEntries(db);
        expect(total).toBe(1);
        expect(entries.length).toBe(1);
        expect(entries[0].summary).toBe('Visited Ironkeep');
        expect(entries[0].action).toBe('visit');
        expect(entries[0].detail).toEqual({ settlementName: 'Ironkeep' });
    });

    test('getJournal({ coordinate }) returns only entries for that coordinate', () => {
        appendEntry(db, { year: 50, action: 'visit', coordinate: 'world_X1_Y1', summary: 'Visited A' });
        appendEntry(db, { year: 60, action: 'visit', coordinate: 'world_X2_Y2', summary: 'Visited B' });
        appendEntry(db, { year: 70, action: 'steal', coordinate: 'world_X1_Y1', summary: 'Stole sword' });

        const { entries, total } = getEntries(db, { coordinate: 'world_X1_Y1' });
        expect(total).toBe(2);
        expect(entries.every(e => e.coordinate === 'world_X1_Y1')).toBe(true);
    });

    test('getJournal({ npcId }) returns only entries referencing that NPC', () => {
        appendEntry(db, { year: 50, action: 'steal',      coordinate: 'world_X0_Y0', npcId: 'npc_aaa', summary: 'Stole from aaa' });
        appendEntry(db, { year: 60, action: 'assassinate', coordinate: 'world_X0_Y0', npcId: 'npc_bbb', summary: 'Killed bbb' });
        appendEntry(db, { year: 70, action: 'visit',       coordinate: 'world_X0_Y0', summary: 'Visited town' });

        const { entries, total } = getEntries(db, { npcId: 'npc_aaa' });
        expect(total).toBe(1);
        expect(entries[0].npcId).toBe('npc_aaa');
    });

    test('getJournal({ fromYear, toYear }) returns only in-range entries', () => {
        appendEntry(db, { year: 50,  action: 'visit', coordinate: 'world_X0_Y0', summary: 'Before range' });
        appendEntry(db, { year: 150, action: 'visit', coordinate: 'world_X0_Y0', summary: 'In range' });
        appendEntry(db, { year: 250, action: 'visit', coordinate: 'world_X0_Y0', summary: 'After range' });

        const { entries, total } = getEntries(db, { fromYear: 100, toYear: 200 });
        expect(total).toBe(1);
        expect(entries[0].year).toBe(150);
        expect(entries[0].summary).toBe('In range');
    });

    test('getJournal({ limit }) returns at most that many entries', () => {
        for (let i = 1; i <= 10; i++) {
            appendEntry(db, { year: i * 10, action: 'visit', coordinate: 'world_X0_Y0', summary: `Visit ${i}` });
        }

        const { entries } = getEntries(db, { limit: 5 });
        expect(entries.length).toBe(5);
    });

    test('entries are returned in ascending year order', () => {
        appendEntry(db, { year: 300, action: 'visit', coordinate: 'world_X0_Y0', summary: 'Third' });
        appendEntry(db, { year: 100, action: 'visit', coordinate: 'world_X0_Y0', summary: 'First' });
        appendEntry(db, { year: 200, action: 'visit', coordinate: 'world_X0_Y0', summary: 'Second' });

        const { entries } = getEntries(db);
        expect(entries[0].year).toBe(100);
        expect(entries[1].year).toBe(200);
        expect(entries[2].year).toBe(300);
    });

    test('total count is accurate even when limit is applied', () => {
        for (let i = 1; i <= 10; i++) {
            appendEntry(db, { year: i * 10, action: 'visit', coordinate: 'world_X0_Y0', summary: `Visit ${i}` });
        }

        const { entries, total } = getEntries(db, { limit: 5 });
        expect(total).toBe(10);
        expect(entries.length).toBe(5);
    });
});
