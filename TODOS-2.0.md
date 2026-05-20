## Chrononaut Update (v2.0) — Implementation Backlog

Items 10–22 implement the mechanics described in `chrononaut-update.md`.
Sorted by **systemic dependency and impact ÷ difficulty**. Items with shared schema
dependencies are grouped so each can land independently without a later item needing
a schema re-migration.

**Mandatory** : After each feature is ready, you must update the PRD and design documents as well as API-implementation document to make sure the implementation is reflected in the documentation.

---

## ~~20. Economics & The Long Wealth — Settlement Economy Simulation~~ DONE
**Difficulty**: High | **Impact**: Very High

**What**: Settlements need a macro-economic model: production vs. consumption drives
booms and famines, trade routes create interdependencies, and the Vault / Time Capsule
system lets the player inject capital that compounds across centuries.

**Why it matters**: This is the foundational economic layer that makes Temporal Commerce
(item 16), Relic Economy (item 10), and World Expansion (item 19) feel meaningful.
Without it, "wealth" is just a number; with it, it is a cause and a consequence.

**Settlement schema additions** (in `src/components.js` Town component):
```js
{
  regionalWealth: number,      // aggregate liquid wealth of the settlement
  primaryExport: string,       // biome-keyed (see PRD biome table)
  tradePartners: string[],     // array of coordinate keys ["world_X2_Y3", ...]
  economicModifiers: {
    shortage: false,
    hyperinflation: false,
    hyperinflationExpiryYear: null,
    economicBoomYear: null
  }
}
```

**Biome → primaryExport mapping** (from GDD, in `src/biomes.js`):
```js
export const BIOME_PRIMARY_EXPORT = {
  Mountain: ['Iron', 'Stone'],
  Forest:   ['Timber', 'Game'],
  Desert:   ['Spice', 'Glass'],
  Marsh:    ['Peat', 'Alchemical Herbs'],
  Plains:   ['Grain', 'Livestock'],
  Wilderness: ['Furs', 'Exotic Foraged Goods']
};
// Pick index 0 or 1 deterministically from seedrandom(coordinate + "_export")
```

**simulate_economy(town, years, rng)** — new function in `src/history.js` (or new
`src/economy.js`):
```js
// Per decade:
// 1. Calculate production: baseProduction = tier * 100
// 2. Calculate consumption: baseConsumption = population * 10
// 3. Net = production - consumption
// 4. If net > 200 for 2 consecutive decades → Economic Boom (tier++)
// 5. If net < 0 for 2 consecutive decades → Famine / Depression
// 6. Apply hyperinflation: if economicModifiers.hyperinflation === true,
//    primaryExport value * 0.25 until hyperinflationExpiryYear
```

**Time Capsule system** (all triggers in `simulate_economy()` / `simulateHistory()`):

Load capsule deltas for the coordinate. For each unresolved capsule:
```js
const discoveryChance = Math.min(95, (ΔT * 0.5) + (town.population / 10));
if (rng() * 100 < discoveryChance) { /* trigger by item type */ }
```

| Capsule contents | Trigger |
|---|---|
| Gold G, given to lower-class NPC | if G×(1.02)^ΔT > 10000 → spawn Banking Guild faction; tier+1 |
| Tier 3+ Weapon | Add Militaristic trait; defense ×weaponTier; claim 1d4 adjacent tiles |
| Tier 3+ Tome | Add Scholarly trait; architecture upgrade; +50% base production |
| Gold G in buried capsule | if G > 5000 → Boom (tier+1) + Hyperinflation (primaryExport value ×0.25 for 100yr); 40% Ruin chance if no Merchant/Magistrate |

**Ruin Looting** — in `src/actions.js` `loot_tomb`:
- If tile is a Ruin (`tier === 0`), yield `Math.floor(rng() * 10 + 1) * 100` gold and
  10% base chance to recover a Tier 2+ item from the Ruin Hoard delta.
- Lock 50% of the Ruin's last `regionalWealth` into a `ruin_hoard` delta on the
  transition to Ruin (in `simulateHistory()` Ruin trigger).

**Macro Trade Routes**:
- `tradePartners` is seeded at generation: Tier 3+ settlements connect to 1–3 nearest
  Tier 2+ neighbors (by coordinate distance, deterministic).
- If a `tradePartners` entry's coordinate has `tier === 0` (Ruin), remove the link and
  apply a Shortage to any dependent settlement with population < 10.

**Where to look**:
- `src/components.js` — add economic fields to Town component.
- `src/biomes.js` — add `BIOME_PRIMARY_EXPORT` map.
- `src/history.js` — integrate `simulate_economy()` call in `simulateHistory()`; load
  capsule deltas; evaluate Ruin hoard transitions.
- `src/actions.js` `loot_tomb` — add Ruin Hoard extraction path.
- `src/db.js` — add `getCapsuleDeltas(coordinate)` and `getRuinHoard(coordinate)`.

**Tests** (`src/history.test.js`, `src/economy.test.js`):
- Tier 2 town with population 5: net > 200 for 2 decades → tier upgrades to 3.
- Famine: population 15, tier 1 → net < 0 → Famine event logged.
- Capsule Gold 100 given to lower-class NPC, ΔT=100: G×1.02^100 ≈ 724 → no Guild spawn.
- Capsule Gold 500, ΔT=100: G×1.02^100 ≈ 3622 → still no Guild spawn.
- Capsule Gold 1000, ΔT=100: G×1.02^100 ≈ 7245 → Banking Guild spawned, tier+1, CE+10.
- Buried Gold 6000 → Boom + Hyperinflation; no Merchant present → 40% Ruin roll applies.

---

## ~~10. Relic Economy — Item Provenance & Age-Based Value Modifiers~~ DONE
**Difficulty**: Low | **Impact**: High

**What**: Every item needs a temporal identity so that age makes it valuable. Add three
new fields to the item schema and apply an age-based modifier to all value calculations.

**Why it matters**: This is the lowest-effort lever that immediately makes time-skips
feel consequential — a sword dropped in Year 50 is a worthless piece of iron; the same
sword recovered in Year 400 is a priceless relic. It also unblocks items 16 and 19
which gate on "is this a Relic (>300 years old)?".

**Schema changes** (`src/items.js` — add to every generated item):
```js
{
  creationYear: globalYear,          // year the item was generated / buried
  originSettlement: coordinateKey,   // "world_X{x}_Y{y}" of the tile it spawned in
  historicalSignificance: []         // array of string event tags appended over time
                                     // e.g. ["Unearthed in Year 312", "Wielded by Maren Ashford"]
}
```

**Value modifier** (`src/items.js` `calculateItemValue()` or equivalent):
```js
const age = globalYear - item.creationYear;
if (age > 300) {
  item.prefix = 'Relic';
  item.value = item.baseValue * Math.pow(1.015, age - 300); // exponential growth past 300yr
} else if (age > 100) {
  item.prefix = 'Ancient';
  item.value = item.baseValue * 2;
}
```

**Where to look**:
- `src/items.js` — `generateItem()` and any value-calculation path; add the three fields
  at generation time.
- `src/actions.js` `loot_tomb` — already returns items; make sure it passes `globalYear`
  into `generateItem()`.
- Delta Pass in `index.js` — items stored in Time Capsule deltas must preserve all three
  new fields verbatim; do not re-generate them on load.

**Tests** (`src/items.test.js`):
- Item generated at year 1 has `creationYear: 1`, `prefix: undefined`, `value === baseValue`.
- Same item at globalYear 150 has `prefix: 'Ancient'`, `value === baseValue * 2`.
- Same item at globalYear 350 has `prefix: 'Relic'`, `value > baseValue * 2`.
- Determinism: same seed + year always returns same value multiplier.

---

## ~~16. Temporal Commerce — /api/trade Endpoint & Merchant Economy~~ DONE
**Difficulty**: Medium | **Impact**: High

**What**: Give Merchant NPCs an inventory and personal wealth, and expose a `/api/trade`
endpoint so the Traveler can buy from or sell to them. Large purchases deplete the
town's primaryExport; selling a Relic to the right Merchant can trigger a Plutocracy.

**Why it matters**: The Traveler currently has no way to interact economically with the
world in real time. Trade is how the player acquires relics and intentionally engineers
Market Depletion / Merchant Ascendancy outcomes based on the foundation built in Item 20.

**NPC schema additions** (Merchant role only, in `src/components.js`):
```js
{
  inventory: [
    { itemId: string, name: string, tier: number, quantity: number, price: number }
  ],
  personalWealth: number   // seeded from rng, range 500–3000 at generation
}
```

Inventory is deterministically generated at NPC creation for Merchant role: 4–8 items
drawn from the settlement's `primaryExport` resource type plus 1–2 random items.

**New endpoint** `POST /api/trade`:
```js
// Request body
{
  x, y,
  npcId: string,
  playerState: { gold, inventory, ... },
  transaction: {
    type: 'buy' | 'sell',
    itemId: string,
    quantity: number
  }
}

// Response
{
  playerState: { /* updated gold, inventory */ },
  npcInventory: [ /* updated */ ],
  event: null | { type: 'MARKET_DEPLETION' | 'MERCHANT_ASCENDANCY', description: string }
}
```

**Deterministic event triggers** (checked after each transaction):

*Market Depletion*: if the player has purchased > 80% of the Merchant's stock of the
settlement's `primaryExport`, write a delta `shortage: true` on the coordinate. In the
next time-skip, `simulate_economy()` gives the town a 60% chance to drop 1 tier or a
40% chance to pivot `primaryExport`.

*Merchant Ascendancy*: selling a Relic (item with `prefix === 'Relic'`, i.e. age > 300)
increases `npc.personalWealth` by `item.value * 5`. If `personalWealth > 15000`, write
a delta `plutocracy_candidate: npcId`. During the next time-skip, `simulateHistory()`
checks this delta and runs the Plutocracy takeover: overthrow current ruling NPC, set
settlement governance to `Plutocracy`, write history: `"The Era of the Merchant Kings."`.

**Where to look**:
- `src/items.js` — extend Merchant NPC generation to populate `inventory`.
- `index.js` — add `POST /api/trade` route; validate `npcId` belongs to the loaded chunk.
- `src/actions.js` — add `executeTrade(npc, transaction, playerState, town)` function.
- `src/history.js` — add `plutocracy_candidate` delta check in `simulateHistory()`.

**Tests** (`src/actions.test.js`):
- Buying 81% of primaryExport stock sets `shortage: true` delta.
- Selling a Relic worth 2000 to Merchant with 13500 wealth → wealth becomes 23500 →
  `plutocracy_candidate` delta written.
- Merchant with wealth 14000 does NOT trigger Plutocracy.
- Transaction that would reduce player gold below 0 is rejected with `400`.

---

## ~~11. The Traveler's Journal — Persistent Action Log with Entity Linking~~ DONE
**Difficulty**: Low | **Impact**: High

**What**: Every action, visit, and interaction the Traveler makes must be recorded in a
persistent, structured journal. Each entry links back to the involved entity (NPC, item,
or settlement) by ID so the player can drill into the full history of any person, place,
or object they have touched.

**Why it matters**: The entire Chrononaut premise — planting seeds and watching the
butterfly effect play out — is invisible without a ledger of what the Traveler actually
did and when. The journal is the player's telescope: it turns the raw delta record into
a readable personal history. Without it, long time-skips feel arbitrary rather than
consequential.

**Storage** — add a dedicated `journal` table to SQLite (via `src/db.js`). This is
distinct from the delta table because journal entries are append-only read records, not
world-state mutations, and they need efficient filtering by entity:

```sql
CREATE TABLE IF NOT EXISTS journal (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  year       INTEGER NOT NULL,
  action     TEXT NOT NULL,        -- e.g. 'visit', 'assassinate', 'steal', 'gift', 'trade', 'talk', 'turnin', 'bury_capsule', 'loot_tomb', 'advance_time'
  coordinate TEXT NOT NULL,        -- "world_X{x}_Y{y}" of where it happened
  npc_id     TEXT,                 -- nullable — set when the action targets an NPC
  item_id    TEXT,                 -- nullable — set when an item is involved
  summary    TEXT NOT NULL,        -- human-readable one-liner, e.g. "Assassinated Maren Ashford (Guard) in Ironkeep"
  detail     TEXT                  -- JSON blob for extra structured data (reward amounts, quest IDs, etc.)
);
CREATE INDEX IF NOT EXISTS journal_coordinate ON journal(coordinate);
CREATE INDEX IF NOT EXISTS journal_npc_id     ON journal(npc_id);
CREATE INDEX IF NOT EXISTS journal_year       ON journal(year);
```

**`src/db.js` additions**:
```js
export function appendJournalEntry({ year, action, coordinate, npcId, itemId, summary, detail }) { ... }
export function getJournal({ coordinate, npcId, itemId, fromYear, toYear, limit } = {}) { ... }
```
`getJournal()` builds a `WHERE` clause from whatever filters are provided and returns
entries in ascending year order.

**Write a journal entry in every action handler** (`src/actions.js`):

| Action | `action` value | `summary` pattern |
|---|---|---|
| Chunk visited | `visit` | `"Visited {settlementName}"` |
| steal | `steal` | `"Stole {itemName} from {npcName} ({role}) in {settlementName}"` |
| assassinate | `assassinate` | `"Assassinated {npcName} ({role}) in {settlementName}"` |
| turnin | `turnin` | `"Completed quest '{questName}' — received {reward}g"` |
| trade (buy) | `trade` | `"Bought {qty}× {itemName} from {npcName} in {settlementName}"` |
| trade (sell) | `trade` | `"Sold {itemName} to {npcName} in {settlementName} for {price}g"` |
| gift | `gift` | `"Gifted {itemName} (Tier {tier}) to {npcName} ({role}) in {settlementName}"` |
| talk | `talk` | `"Spoke with {npcName} — revealed {n} node(s)"` |
| bury_capsule | `bury_capsule` | `"Buried Time Capsule at {settlementName} containing {contents}"` |
| loot_tomb | `loot_tomb` | `"Looted ruin at {coordinate} — found {gold}g and {itemName}"` |
| advance_time | `advance_time` | `"Skipped {years} years (Year {from} → {to})"` |

**New endpoint** `GET /api/journal`:
```
Query params (all optional):
  ?coordinate=world_X2_Y3   — filter to one settlement
  ?npcId=<id>               — filter to all entries touching one NPC
  ?itemId=<id>              — filter to all entries involving one item
  ?fromYear=100&toYear=300  — time range filter
  ?limit=50                 — max entries (default 100)

Response:
{
  "entries": [
    {
      "id": 17,
      "year": 142,
      "action": "assassinate",
      "coordinate": "world_X2_Y3",
      "settlementName": "Ironkeep",
      "npcId": "npc_...",
      "npcName": "Maren Ashford",
      "itemId": null,
      "summary": "Assassinated Maren Ashford (Guard) in Ironkeep",
      "detail": { "xpGained": 75, "failChance": 0.35 }
    }
  ],
  "total": 84
}
```

**Visit logging** — the chunk visit entry is the one case that doesn't go through
`src/actions.js`. Write it at the end of the `GET /api/chunk/:x/:y` handler in
`index.js`, after serialization, using the loaded town name and current `globalYear`.

**Where to look**:
- `src/db.js` — add `journal` table creation to the DB init block; add
  `appendJournalEntry()` and `getJournal()`.
- `src/actions.js` — add `appendJournalEntry()` call at the end of every action
  function (after all deltas are written and the response is built).
- `index.js` — add `GET /api/journal` route; add visit-logging to chunk load handler.
- `API-REFERENCE.md` — document the new endpoint (get user approval first per
  CLAUDE.md guardrails).

**Tests** (`src/db.test.js` or new `src/journal.test.js`):
- `appendJournalEntry()` inserts a row; `getJournal()` retrieves it.
- `getJournal({ coordinate })` returns only entries for that coordinate.
- `getJournal({ npcId })` returns only entries that reference that NPC.
- `getJournal({ fromYear: 100, toYear: 200 })` returns only entries in range.
- `getJournal({ limit: 5 })` returns at most 5 entries.
- Entries are returned in ascending year order.
- Visit entry is written on chunk load; action entry is written on every action.

---

## 13. Generational Bloodlines — Memory Inheritance & Faction Spawning
**Difficulty**: Medium | **Impact**: High

**What**: When an NPC dies, their high-intensity memories (loves, hates) must survive
them by transferring to descendants or close faction members as `ancestral_ally` or
`blood_feud` bonds. If a blood feud lasts more than 50 years, the descendants
automatically coalesce into a named House or Faction.

**Why it matters**: Time-skips are meaningless if the world forgets. Memory inheritance
turns a single assassination into a 200-year vendetta — the core fantasy of the
Chrononaut premise.

**NPC schema additions** (`src/components.js` Memory component):
```js
{
  memories: [
    { type: 'love' | 'hate', targetId: string, intensity: 1–10, year: number }
  ],
  ancestralMemories: [
    { type: 'ancestral_ally' | 'blood_feud', targetLineage: string, intensity: number,
      originYear: number, originEvent: string }
  ]
}
```

**New function** `propagate_memories(npc, world, globalYear)` in `src/history.js`:
- Called inside the NPC death handler in `simulateHistory()`, before the NPC entity is
  marked `Dead`.
- For each memory with `intensity >= 7`: find the NPC's living descendants (children,
  grandchildren) or, failing that, the closest ally in the same faction.
- Downgrade `type` to `ancestral_ally` / `blood_feud` and halve `intensity`.
- Append a history entry: `"Inherited the {type} of their ancestor {npc.name}."`.

**Faction spawning** (inside `simulateHistory()` per-year loop):
- Scan all NPCs with `ancestralMemories` where `type === 'blood_feud'` and
  `(globalYear - originYear) > 50`.
- If three or more NPCs in the same settlement share the same `targetLineage`, spawn a
  named Faction entity (name generated from seed `"faction_{lineageId}_{year}"`), assign
  those NPCs as members, and write a history entry: `"House {name} formed to prosecute
  the ancestral vendetta against {targetLineage}."`.

**Where to look**:
- `src/history.js` — NPC death handling (currently sets `status: 'Dead'`); insert
  `propagate_memories()` call immediately before status update.
- `src/components.js` — add `memories` and `ancestralMemories` to the NPC component.
- `src/politics.js` — Faction entity creation already exists for political promotions;
  reuse that path for blood-feud factions.

**Tests** (`src/history.test.js`):
- NPC with `hate` intensity 9 dies → child NPC gains `blood_feud` `ancestralMemory`.
- Memories with intensity < 7 are NOT propagated.
- Three NPCs sharing a blood feud for 51+ years → named Faction entity is created.
- Faction name is deterministic given the same lineage seed.

---

## 14. Folklore & Mythos System — Reputation, Cults, and Myth Decay
**Difficulty**: Medium | **Impact**: High

**What**: Every town must track how anomalous The Traveler's presence is and generate
procedural myths once that exposure passes a threshold. Myths decay without re-exposure,
keeping the world dynamic across long time-skips.

**Why it matters**: This is the world's memory of the player, not just individual NPCs'.
It creates emergent reputation consequences (paranoia tax, cult tithes) and makes
long-term absence feel real.

**Town schema additions** (`src/components.js` Town component):
```js
{
  mythos: {
    temporalExposure: 0,        // cumulative anomaly score
    activeLegend: null,         // 'shadow' | 'savior' | null
    cultFaction: null,          // faction ID if a Cult exists
    fearModifier: 0,            // applied to merchant prices (0.0 – 2.0 multiplier)
    titheAccumulated: 0         // gold stockpiled for Traveler's return
  }
}
```

**Exposure increments** — apply in `src/actions.js` after every relevant player action,
keyed to the action's coordinate:

| Action | temporalExposure delta |
|---|---|
| talk / gossip / bribe | +1 |
| steal / pickpocket | +3 |
| complete quest / trade | +5 |
| bury Time Capsule / vault deposit | +10 |
| assassination / public murder | +20 |

Write the updated `mythos` object as a delta: `saveDelta(coordinate, 'mythos', JSON.stringify(mythos))`.

**Myth generation** (in `simulateHistory()`, checked once per time-skip):
- If `temporalExposure > 50` and no `activeLegend` yet:
  - Count player's past violent actions (assassinations, steals) vs. benevolent (quests,
    trades) from the delta record for this coordinate.
  - Majority violent → set `activeLegend: 'shadow'`, `fearModifier: 2.0`; append
    history: `"The Shadow That Never Ages was spoken of in fearful whispers."`.
  - Majority benevolent → set `activeLegend: 'savior'`; spawn Cult faction; append
    history: `"A Cult of the Timeless Savior founded in {year}."`.

**Cult tithe accumulation** (in `simulate_economy()`, item 20 dependency):
```js
// tithe scales linearly with time since last visit
mythos.titheAccumulated += Math.floor(town.regionalWealth * 0.05 * decadesSinceVisit);
```

**Mythological decay** — `erosion_check(town, globalYear, lastVisitYear)` called in the
time-skip loop:
```js
const yearsSince = globalYear - lastVisitYear;
const periods = Math.floor(yearsSince / 50);
mythos.temporalExposure = Math.max(0, mythos.temporalExposure - (periods * 25));
if (mythos.temporalExposure < 20) {
  mythos.activeLegend = null;
  mythos.cultFaction = null; // disband — members revert to default roles
  mythos.fearModifier = 0;
  appendHistory(town, `"The old tales faded into children's stories."`);
}
```

**Where to look**:
- `src/actions.js` — every action handler; add exposure increment + delta write.
- `src/history.js` `simulateHistory()` — add myth generation and `erosion_check()` calls.
- `index.js` Delta Pass — load `mythos` delta and apply to town entity before Future Pass.
- Merchant dialogue / price calculation in `src/dialogue.js` — multiply prices by
  `mythos.fearModifier` when `activeLegend === 'shadow'`.
- **`src/actions.js` `executeTrade()`** — the buy-price already reads
  `town?.mythos?.fearModifier ?? 1.0` and the sell-price divides by the same value.
  These stubs are live but are no-ops (default 1.0) until `mythos` is populated here.
  No further change is needed in `executeTrade()` once item 14 writes `mythos` as a delta.

**Tests** (`src/history.test.js`):
- Town with `temporalExposure: 51` and majority violent actions → `activeLegend: 'shadow'`.
- Town with `temporalExposure: 51` and majority benevolent → Cult faction spawned.
- After 100 years with no visits, `temporalExposure` decreases by 50.
- `temporalExposure` dropping below 20 disbands the Cult and nulls `activeLegend`.

**Item 13 integration note** (Generational Bloodlines, already implemented):
When generating a Cult faction from `temporalExposure > 50` (benevolent majority path), first
check for living NPCs at the coordinate whose `ancestralMemories` contains
`type: 'ancestral_reverence'`. If any exist, seed those NPCs as founding Cult members rather
than creating a new faction from scratch. If a `Mystery Cult` Faction entity (spawned by item
13's decade loop — `factionType: 'ancestral_reverence'`) already exists at the coordinate,
set its `identity.id` as `mythos.cultFaction` rather than spawning a duplicate.

---

## 17. Artifact Seeding — /api/gift Endpoint & Heirloom Propagation
**Difficulty**: Medium | **Impact**: High

**What**: The Traveler can give any item from their inventory directly to an NPC. The
item becomes a Family Heirloom, influences the NPC's descendants' roles, and can trigger
a Class Uprising if a Tier 3+ weapon or tome goes to a low-tier NPC.

**Why it matters**: Artifact Seeding is the highest-agency version of the time-capsule
mechanic — the player picks a specific bloodline to empower, creating a named legacy
that the Ledger tracks for centuries.

**New endpoint** `POST /api/gift`:
```js
// Request body
{ x, y, npcId: string, itemId: string, playerState: { inventory, ... } }

// Response
{ playerState: { /* item removed from inventory */ }, event: null | HeirloomEvent }
```

**Heirloom item fields** (added to item schema on gift, extending item 10's additions):
```js
{
  heirloom: true,
  heirloomLineage: npc.id,          // root NPC of the bloodline
  heirloomInfluenceBonus: 0         // accumulated; +10 per 50 years (see propagation)
}
```

**Delta written on gift**: `saveDelta(coordinate, "heirloom_${npc.id}", JSON.stringify(item))`.

**propagate_heirlooms(coordinate, deltas, globalYear)** — called in `simulateHistory()`:
- Load all `heirloom_*` deltas for the coordinate.
- For each heirloom, compute `elapsed = globalYear - item.creationYear`.
- `item.heirloomInfluenceBonus = Math.floor(elapsed / 50) * 10`.
- Pass the bonus to the NPC's current descendant as a `influence` modifier.

**Role forcing** (applied when descendant NPCs are spawned in `simulateHistory()`):
- Heirloom is a Weapon → descendant job pool restricted to `['Guard', 'Hero']`.
- Heirloom is a Tome → restricted to `['Scholar', 'Cultist']`.
- Heirloom is high-value Jewelry (value > 5000) → restricted to `['Merchant', 'Mayor']`.

**Class Uprising trigger** (in `POST /api/gift` handler, before returning):
- If `item.tier >= 3` AND recipient NPC role is one of `['Beggar', 'Bandit', 'Citizen']`:
  - Write `uprising_pending: { lineageId: npc.id, year: globalYear }` delta.
  - During next time-skip, `simulateHistory()` checks this delta → overthrow current
    ruling faction, reduce population by 20%, install recipient lineage as new rulers.
  - Append history: `"The otherworldly artifact granted to the downtrodden sparked revolution."`.
  - Award +15 CE (Divergence: faction overthrown by player-supplied weapon, item 12).

**Where to look**:
- `index.js` — add `POST /api/gift` route.
- `src/actions.js` — add `executeGift(npc, item, playerState, coordinate)`.
- `src/history.js` — add `propagate_heirlooms()` call and uprising delta check.
- `src/components.js` — add `heirloom`, `heirloomLineage`, `heirloomInfluenceBonus`
  to the item component definition.

**Tests** (`src/actions.test.js`):
- Gifting Tier 3 weapon to a Beggar writes `uprising_pending` delta.
- Gifting Tier 2 weapon to a Beggar does NOT trigger uprising.
- `propagate_heirlooms()` after 150 years sets `heirloomInfluenceBonus: 30`.
- Item is removed from playerState inventory after gift.

---

## 18. Generational Ambitions — NPC Behavioral Scripts
**Difficulty**: Medium–High | **Impact**: High

**What**: Each NPC receives an `ambition` that acts as a behavioral script executed by
the simulation loop across time. The simulation calculates whether the NPC (and their
lineage) successfully executes their ambition based on `Agency` score, then fires the
appropriate world event.

**Why it matters**: Without ambitions, NPCs are passive. With them, every NPC is a tiny
autonomous agent whose success or failure reshapes the settlement — the player's job is
to tip the scales by gifting items, assassinating rivals, or injecting wealth.

**NPC schema addition** (in `src/components.js`):
```js
ambition: 'content' | 'ascension' | 'avarice' | 'legacy' | 'vengeance' | 'artifact_hunter'
// seeded from rng at NPC generation; weighted by role:
// Mayor/Guard → 30% ascension, Merchant → 40% avarice, Citizen → 40% content, etc.
```

**Agency formula** (computed per NPC per time-skip in `simulateHistory()`):
```js
const agency = npc.influence + npc.personalWealth / 100 + (npc.heirloomInfluenceBonus || 0);
```

**Ambition execution table** (evaluate once per simulated decade per living NPC lineage
representative):

| Ambition | Condition | Outcome |
|---|---|---|
| Content | always | +1 town Stability per decade; -10% Ruin chance |
| Ascension (pacific) | agency > 100 | lineage takes control; town upgrades to Magistrate |
| Ascension (violent) | agency < 100, has gifted Weapon | coup; town drops 1 tier |
| Avarice | agency > 80 | drain 50% primaryExport → multiply personalWealth; risk Market Depletion |
| Legacy | always | descendant spawn rate ×3; risk Famine |
| Vengeance | survival = Max(0, 100 - ΔT×2) | if 0, target lineage wiped |
| Artifact Hunter | always | +40% Discovery_Chance on all buried Time Capsules in tile |

**Where to look**:
- `src/components.js` — add `ambition` field to NPC component.
- `src/history.js` `simulateHistory()` — after propagating memories, evaluate each
  living NPC's ambition. Group by lineage (use eldest surviving member as representative).
- `src/grammar.js` — add History Marker strings for each ambition outcome.
- `src/items.js` — `calculateDiscoveryChance()` must check for any living NPC with
  `ambition === 'artifact_hunter'` in the tile and apply the +40% modifier.

**Tests** (`src/history.test.js`):
- NPC with `ascension` ambition and agency 110 → lineage controls town after skip.
- NPC with `ascension` ambition, agency 80, and a gifted Weapon → coup fires.
- NPC with `legacy` ambition → descendant count triples; Famine risk check present.
- NPC with `vengeance` ambition after ΔT = 51 → rival survival chance at 0; lineage wiped.

**Item 13 integration note** (Generational Bloodlines, already implemented):
Before applying the role-weighted ambition table, check the NPC's `ancestralMemories` array
(added by item 13). The following overrides apply:
- Any entry with `type: 'ancestral_shame'` → weight ambition 70% `ascension`, 30% `vengeance`
  (overrides role default).
- Any entry with `type: 'ancestral_mourning'` → force ambition to `content` (overrides all
  other weights).
- Any entry with `type: 'blood_feud'` → weight ambition 60% `vengeance`, 40% role default.

---

## 19. World Expansion — Pioneer Factions & Ruin Reclamation
**Difficulty**: Medium | **Impact**: Medium

**What**: High-tier settlements that experience Economic Booms can spawn Pioneer factions
that found new Tier 1 towns on adjacent empty tiles. NPCs with Content or Ascension
ambitions can also reclaim Ruin tiles. Without this, the map eventually heat-deaths into
a graveyard.

**Why it matters**: A player who engineers multiple booms (via wealth injection or relic
gifts) should see the map actually fill in — a visible payoff for long-term strategy.

**Pioneer Faction spawning** (in `simulateHistory()`, end of each decade pass):
```js
if (town.tier >= 4 && hadEconomicBoom && hasAdjacentEmptyOrWildernessTile) {
  const targetTile = pickAdjacentEmptyTile(x, y, world);
  if (targetTile) {
    saveDelta(targetTile.key, 'tier', '1');
    saveDelta(targetTile.key, 'founded_by', coordinateKey);
    saveDelta(targetTile.key, 'founded_year', String(globalYear));
    appendHistory(town, `"The Great Expansion ordered by ${rulerName} in ${globalYear}."`);
    appendHistory(targetTile, `"Founded as a colony of ${town.name} in ${globalYear}."`);
  }
}
```

**Ruin Reclamation** (also in `simulateHistory()`, per-decade):
```js
// For each NPC with ambition 'content' or 'ascension' and influence > 80
// who lives in a tile adjacent to a Ruin:
if (rng() < 0.20) { // 20% per decade
  saveDelta(ruinTile.key, 'tier', '1');
  saveDelta(ruinTile.key, 'ruling_lineage', npc.lineageId);
  appendHistory(ruinTile, `"The Reclaiming of the Ash-Lands by the ${npc.name} lineage."`);
}
```

**Tile adjacency helper** — add `getAdjacentTiles(x, y)` to `src/map.js`:
```js
// Returns the 4 cardinal neighbors as { x, y, key } objects (no diagonal)
export function getAdjacentTiles(x, y) {
  return [[-1,0],[1,0],[0,-1],[0,1]].map(([dx,dy]) => ({
    x: x+dx, y: y+dy, key: `world_X${x+dx}_Y${y+dy}`
  }));
}
```

**Where to look**:
- `src/map.js` — add `getAdjacentTiles()`.
- `src/history.js` `simulateHistory()` — add Pioneer and Reclamation checks at end of
  decade loop. Load adjacent tile deltas (just `tier` field) from DB to classify each
  neighbor as Empty / Wilderness / Ruin / Settled.
- `src/db.js` — add `getTierForCoordinate(key)` if not already present.

**Tests** (`src/history.test.js`):
- `getAdjacentTiles(3, 5)` returns exactly 4 entries with correct coordinates.
- Tier 4 town with economic boom and empty neighbor → new delta written for neighbor.
- Ruin tile adjacent to NPC with influence 85 and content ambition → 20% reclaim chance
  in test (mock rng to return 0.15).

---

## 15. Butterfly Effect — Causal Crisis Event System
**Difficulty**: Medium | **Impact**: High

**What**: The `advance_time` simulation loop must check for threshold conditions caused
by prior player actions and fire macro-level world events (city fractures, Renaissance
upgrades, trade-route collapses). This is the "butterfly effect" feedback the player
reads in the Ledger.

**Why it matters**: Without causal crises, time-skips feel passive. This system is what
transforms individual player micro-actions into world-reshaping events — the core game
fantasy.

**Architecture**: add an `eventListeners` array inside `simulateHistory()`. Each listener
is a `{ condition(world, deltas), fire(world, globalYear) }` pair evaluated once per
time-skip. Listeners are registered at module load, not dynamically.

**Crisis triggers to implement (first pass)**:

*Power Vacuum*
```js
{
  condition: (coordinate, deltas) => {
    const assassinations = deltas.filter(d =>
      d.key === coordinate && d.field === 'assassinated_leader'
    );
    return assassinations.length >= 3;
  },
  fire: (town, globalYear) => {
    // fracture FullCity (tier >= 4) into two Hamlets (tier 1)
    // spawn two new town entities at adjacent tiles
    // write history: "The {cityName} Fracture of {year}"
  }
}
```

*Golden Age*
```js
{
  condition: (coordinate, deltas) => {
    const relicGifts = deltas.filter(d =>
      d.key === coordinate && d.field === 'relic_gifted_to_scholar'
    );
    return relicGifts.length >= 1 && (globalYear - relicGifts[0].year) >= 100;
  },
  fire: (town, globalYear) => {
    // upgrade walls to 'stone', expand borders by claiming 1 adjacent tile
    // write history: "The Renaissance of {cityName}"
  }
}
```

*Trade Route Collapse* (when a key Merchant NPC is assassinated):
- Existing assassinate action in `src/actions.js` should write a delta
  `assassinated_merchant_hub: true` if the NPC was a Merchant in a tier >= 3 settlement.
- Event listener checks for this delta → neighboring outposts lose their `tradePartners`
  entry and gain a 40% chance to turn Ruin on the next time-skip.

**Where to look**:
- `src/history.js` `simulateHistory()` — add the event listener evaluation loop at the
  end of each simulated year (or as a post-simulation pass).
- `src/actions.js` `assassinate` — write prerequisite deltas (`assassinated_leader`,
  `assassinated_merchant_hub`) when the target role qualifies.
- `src/politics.js` — reuse existing Ruin logic for the Power Vacuum fracture outcome.

**Tests** (`src/history.test.js`):
- 3 leader assassinations in the same coordinate triggers Power Vacuum split.
- Fewer than 3 assassinations → no fracture.
- Relic-to-Scholar gift + 100-year skip triggers Golden Age wall upgrade.
- Golden Age NOT triggered if skip is < 100 years.

---

## 21. The Conversation Engine & Bloodline Oaths
**Difficulty**: High | **Impact**: High

**What**: NPC dialogue becomes an information-extraction mechanic. Talking to an NPC
reveals hidden data nodes (memories, quests, ambitions). Quests accepted from NPCs
become Bloodline Oaths that persist through the quest-giver's death and pay out more
the longer the Traveler takes to complete them.

**Why it matters**: This transforms dialogue from flavour text into a strategic tool.
The Traveler reads NPC relationship graphs to decide who to befriend, who to assassinate,
and which Oaths to hold deliberately to maximize the temporal multiplier payout.

**NPC schema additions** (`src/components.js`):
```js
{
  dialogNodes: [
    { type: 'memory',   revealed: false, content: { targetId, emotion: 'love'|'hate' } },
    { type: 'quest',    revealed: false, content: { questId, description } },
    { type: 'ambition', revealed: false, content: { ambition, driveStatement: string } }
  ]
}
```

`dialogNodes` are generated deterministically in `src/dialogue.js` using
`seedrandom(npc.id + "_dialog")`. Each NPC gets exactly 3 nodes, one of each type,
populated from the NPC's existing `memories`, `quests`, and `ambition` fields.

**Talk action** (`POST /api/action/talk` — new endpoint):
```js
// Request: { x, y, npcId, playerState }
// Response: {
//   revealedNodes: [ ...1d3 of the unrevealed dialogNodes ],
//   playerState: { /* temporalExposure increment applied */ },
//   event: null | { type: 'BLOODLINE_OATH_AVAILABLE', questId }
// }
```
- Costs +1 `temporalExposure` on the coordinate (item 14).
- Reveals `Math.ceil(rng() * 3)` (i.e. 1–3) unrevealed nodes, chosen in order.
- Marks revealed nodes as `revealed: true`; persist via delta.

**Bloodline Oaths** — quest restructuring:
- When the Traveler accepts a quest from an NPC (via a revealed `quest` dialog node),
  write a delta: `saveDelta('GLOBAL', "oath_${questId}", JSON.stringify({ lineageId: npc.id, baseReward, acceptedYear: globalYear }))`.
- On quest turn-in (`POST /api/action/turnin`), load the oath delta and compute:
  ```js
  const ΔT = globalYear - oath.acceptedYear;
  const multiplier = 1 + (ΔT / 50);
  const reward = Math.floor(oath.baseReward * multiplier);
  ```
- If `ΔT > 50`: inject +15 `temporalExposure` at the fulfillment coordinate; append
  history: `"The fulfillment of the ancestral pact."`.
- The quest survives the original NPC's death: on turn-in, resolve against the quest
  lineage (not the NPC entity). If the NPC is Dead, the oath is still valid — pay out
  to the Traveler normally.

**Where to look**:
- `index.js` — add `POST /api/action/talk` route.
- `src/dialogue.js` — add `generateDialogNodes(npc, rng)`.
- `src/quests.js` — attach quests to `lineageId` rather than `npcId` in the quest
  struct; update `turnin` to look up by lineage.
- `src/actions.js` `turnin` — load oath delta, compute multiplier, refund CE if ΔT > 50.
- `API-REFERENCE.md` — document `/api/action/talk` endpoint (ask user before editing
  this file per CLAUDE.md guardrails).

**Tests** (`src/dialogue.test.js`, `src/actions.test.js`):
- `generateDialogNodes(npc, rng)` always returns exactly 3 nodes, one per type.
- Same NPC seed always returns same node content (determinism).
- Talk action reveals 1–3 nodes; already-revealed nodes are not re-revealed.
- Quest accepted at year 100, turned in at year 200 → multiplier = 1 + (100/50) = 3 ×
  baseReward.
- Quest turned in at year 140 (ΔT=40) → multiplier = 1.8; no temporalExposure bonus.
- Dead NPC's Bloodline Oath is still resolvable — turnin succeeds if lineage exists.

---

## 12. Temporal Integrity — Chronal Energy (Win/Lose Condition)
**Difficulty**: Medium | **Impact**: Very High

**What**: The player's temporal drive needs fuel. Introduce `chronalEnergy` (CE) as a
consumable player resource, deducted on every time-skip and refunded by major timeline
divergences. If CE hits 0 the player is stranded and must trigger a "Present-Day
Divergence" to restart.

**Why it matters**: Without a lose condition, players have no reason to act deliberately.
CE is the strategic heartbeat of the Chrononaut update — it makes every action a
resource decision and gives the time-skip mechanic teeth. Must be implemented after
all other refund sources (Items 17, 19, 20, 21) exist.

**Player state changes** (`/api/action/advance_time` request body):
```js
playerState.chronalEnergy  // current CE, 0–100
playerState.maxChronalEnergy = 100
```

**CE costs** (deducted in `/api/action/advance_time` before simulation):
```js
const cost = Math.ceil(yearsToSkip / 10);
if (playerState.chronalEnergy < cost) {
  return res.status(400).json({ error: 'Insufficient Chronal Energy', code: 'CE_DEPLETED' });
}
playerState.chronalEnergy -= cost;
```

**CE refunds** (aggregated inside `simulateHistory()` / `advance_time` loop; returned in
the `/api/action/advance_time` response as `divergenceEvents[]`):

| Divergence event | CE gained |
|---|---|
| New settlement founded via player wealth injection | +10 |
| Ruling faction overthrown via player-supplied weapon | +15 |
| Time Capsule Relic unearthed | +20 |
| Ancient Bloodline Oath fulfilled (ΔT > 50) | +25 |

**Stranding state**: if `chronalEnergy === 0` on the `/api/action/advance_time` call,
return a structured error with `code: 'TEMPORAL_GROUNDING'` and instructions listing
valid "Present-Day Divergence" actions (assassinate ruler, bribe faction, exhaust
primaryExport via trade). A successful present-day divergence awards a baseline +10 CE.

**Where to look**:
- `src/actions.js` `advance_time` handler — add cost deduction at the top.
- `simulateHistory()` in `src/history.js` — accumulate CE refunds from divergences into
  a running `divergenceLog` array returned alongside the simulation result.
- `index.js` `/api/action/advance_time` route — merge `divergenceLog` CE totals back into
  `playerState.chronalEnergy` before returning the response.

**Tests** (`src/player-mechanics.test.js`):
- Skip 50 years costs exactly 5 CE.
- Skip that would drop CE below 0 is rejected with `CE_DEPLETED`.
- A simulation run that unearts a Relic capsule returns +20 CE in `divergenceLog`.
- `chronalEnergy` is clamped to `[0, maxChronalEnergy]` after refunds.

---

## 22. Rearchitect for shared-world multi-player
**Difficulty**: High | **Impact**: High  
**Note**: Deferred — the game remains single-player until items 10–21 are complete and
the architecture has stabilised. Do not start this item without an explicit decision to
go multi-player.

**What**: The game is currently single-player. All state in `playerState` is owned and
sent by one client; the `deltas` table has no concept of player identity. This item
introduces a proper multi-player model where multiple players share the same persistent
world.

**Why it matters**: The core world (settlements, NPCs, history, territory) is already
shared and deterministic. The only missing layer is player identity — who did what, what
each player has seen, and how player actions interact when they happen in the same
coordinate.

**Key changes required**:

### 22.1 — Introduce a `player_id` to the delta schema
- Add a `player_id TEXT` column to the `deltas` table (nullable, with a migration for
  existing rows defaulting to `"default"`).
- All `saveDelta` / `upsertDelta` calls that relate to a specific player (kills,
  steals, visited, reputation) must carry a `player_id`.
- World-level deltas (territory claims, `globalYear`, immigration, town tiers) remain
  player-agnostic (`player_id = NULL` or `"WORLD"`).

### 22.2 — Player registration and identity
- Add `POST /api/player/register` → returns a stable `playerId` (UUID v4 on first call;
  stored server-side). This is the only place `crypto.randomUUID()` is allowed — it is
  not a generation/simulation path.
- `playerState` no longer lives purely on the client. Server holds a canonical
  `playerState` row per `player_id` in a new `players` table (xp, level, stealth,
  strength, inventory, gold). The client may cache it but the server is authoritative.
- All `POST /api/action/*` endpoints require a `playerId` field in the request body;
  reject with `400` if absent.

### 22.3 — Per-player discovery / `isDiscovered`
- On every `GET /api/chunk/:x/:y` call that includes a `?playerId=` query param, write
  a `visited` delta scoped to that player:
  `saveDelta(coordinate, "Player_<playerId>", "visited", "true")`.
- Add `getDiscoveredCoordinates(playerId)` to `src/db.js`: returns a `Set` of
  coordinate strings where a `visited` delta exists for that player.
- `GET /api/map/:x/:y/:radius?playerId=<id>` calls `getDiscoveredCoordinates(playerId)`
  and passes the result to `generateMiniMap()` so `isDiscovered` is accurate.

### 22.4 — Conflict model for shared-world actions
- Define what happens when two players act on the same NPC in the same tick (e.g. both
  assassinate the same target). The delta table's `id` ordering is the tiebreaker:
  first write wins; subsequent writes against a dead/stolen entity return a structured
  conflict error (`409 CONFLICT`).
- Document the conflict contract in `API-REFERENCE.md`.

### 22.5 — `globalYear` is now world-wide, not per-player
- `advance_time` must be gated: only the player with the highest in-world tenure (or a
  designated "timekeeper" role) may advance the year, or it becomes a vote/threshold
  mechanic. Decide and document in `design-prd.md` before implementing.

**Suggested execution order**: 22.1 (schema) → 22.2 (identity) → 22.3 (discovery) →
22.4 (conflict) → 22.5 (time governance).  
**Dependency**: Complete items 10–21 before starting this — a mid-feature codebase is
the wrong base for a player-identity schema change.