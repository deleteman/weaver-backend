# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed
- **Mystery Heist — duplicate `year: 0` history event (bug-7a)**: `ArtifactEffects` (Weapon/Tome/Jewelry) were pushing a redundant `career_shift` event without a `[Year X]` prefix, causing `makeEvent()` to resolve `year: 0`. These pushes are removed; the `butterflyEvent` in `turnInQuest()` is now the single authoritative history record for Weapon/Tome/Jewelry role changes. Relic events (which affect other town NPCs) are kept but now correctly receive `currentYear` and include the `[Year X]` prefix.
- **Mystery Heist — infinite quest loop (bug-7b)**: After a successful Mystery Heist turnin, `turnInQuest()` now changes the questGiver's memory for the enemy to `MEMORY_STATES.SATISFIED`, persists a `memory_<enemyId>` delta, and removes the resolved quest from `offeredQuests`. `generateQuests()` only creates Mystery Heist quests when the feeling is `MEMORY_STATES.HATES`, so the quest no longer regenerates on subsequent chunk loads.
- Exiled NPCs were silently excluded from the `population` array in chunk responses. They now appear with `status: "Exiled"` — consistent with how `"Dead"` and `"Migrated"` NPCs are handled. `API-REFERENCE.md` updated accordingly.
- Migrated NPCs were silently excluded from the `population` array in all chunk responses, including `advance_time`. They now appear with `status: "Migrated"` as already specified by the API contract and PRD — aligning the implementation with the documented `"Alive" | "Dead" | "Exiled" | "Migrated"` status enum.
- History events emitted by artifact effects (`applyTomeEffect`, `applyJewelryEffect`, `applyWeaponEffect`, `applyRelicEffect`) are now structured objects (`{ id, year, description, type, causedBy }`) instead of plain strings; types are `career_shift`, `legacy`, or `migration` depending on the effect.
- Refugee arrival event in `src/population.js` now initializes as a structured history object with `type: "migration"` instead of a plain string, making it consistent with all other NPC history entries.
- `API-REFERENCE.md` `town.history` example updated to show a structured event object instead of a plain string, matching the History Event shape already documented in the same file.
- Mourning events now fire correctly when an NPC's loved one is killed by player action (assassination or regicide). Previously only time-advancement deaths (type `'death'`) triggered grief; player kills write `'assassination'` or `'regicide'` events and were silently skipped. Introduced `FATAL_EVENT_TYPES` constant in `src/history.js` to cover all death-type events in the mourning check.
- Parent/child relationships now trigger grief on death, both in simulation (`simulateHistory`) and on player kills (`assassinate`/`regicide`). Previously only romantic partners (`loves`) fired mourning. Messages are relationship-aware: partners get "heartbroken", children mourning a parent get "grief-stricken", parents mourning a child get "devastated".
- Grief/mourning triggered by player kills now persists across chunk reloads. The previous fix only handled the `simulateHistory` path, but player kills happen after simulation runs — on the next fresh load the love relationship never re-formed (killed NPC is absent from `livingNpcs`), so grief never fired. Added `triggerMourningForLovedOnes` in `src/actions.js`: called immediately after `assassinate` and `regicide` mark an NPC dead, it finds all living NPCs who love the target, pushes a `grief` history event, flips the memory to `'mourns'`, and saves both as SQLite deltas so the state survives the next reload.

### Added
- NPC appearance now includes five facial detail fields — `faceShape`, `eyeShape`, `complexion`, `expressionBias`, and `noseShape` — each seeded deterministically from the NPC ID with weighted distribution driven by biome, age, role, sex, and build.
- `journal` SQLite table with indexes on `coordinate`, `npc_id`, and `year` for efficient filtering; created idempotently at DB init in `src/db.js`.
- `appendJournalEntry({ year, action, coordinate, npcId, itemId, summary, detail })` in `src/db.js`: appends a structured narrative entry to the journal table; `detail` is serialized to JSON.
- `getJournal({ coordinate, npcId, itemId, fromYear, toYear, limit })` in `src/db.js`: returns filtered journal entries in ascending year order plus an accurate `total` count (unaffected by `limit`).
- `GET /api/journal` endpoint: returns journal entries with optional filters (`coordinate`, `npcId`, `itemId`, `fromYear`, `toYear`, `limit`). Response includes `settlementName` and `npcName` surfaced from the `detail` JSON blob.
- Visit logging: every successful `GET /api/chunk/:x/:y` request now appends a `visit` journal entry recording the settlement name and current year.
- `advance_time` logging: `POST /api/action/advance_time` now appends a journal entry recording the year range skipped.
- Journal entries written on success for all 14 action handlers in `src/actions.js`: `steal`, `assassinate`, `turnin` (fetch and bounty), `trade` (buy and sell), `loot_tomb` (ruin and dead-NPC paths), `claim`, `tax`, `decree`, `banish`, `abdicate`, and `regicide`.
- `getSettlementName(world)` internal helper in `src/actions.js`: DRY ECS scan for the loaded Town/District entity name, reused across action handlers.
- 7 new tests in `src/journal.test.js` covering journal insert/retrieve, coordinate/npcId/year-range filtering, limit, sort order, and total-vs-returned-count correctness, using a real in-memory SQLite database.

### Fixed
- `lootTomb` in `src/actions.js` now correctly dispatches on `targetId` presence rather than `tileTier`. Previously, calling `POST /api/action/loot_tomb` with a `targetId` on a tier-0 (ruin) tile would silently ignore the target and return ruin loot instead of the dead NPC's items.
- NPC history arrays no longer accumulate duplicate event IDs when a retiring Merchant passes multiple inventory slots to the same fallback merchant. The other-merchants inheritance event description now includes the item name and quantity (e.g. "Acquired 5× Grain from …"), making each slot's event ID unique — matching the existing social-recipients path. A defensive deduplication guard in `pushEvent` was also added to silently drop any future hash collisions.
- `serializeChunk` in `index.js` now includes `merchantInventory` in the chunk API response for Merchant-role NPCs. Previously the field was generated and stored correctly on the ECS entity but never serialized, so clients saw no stock until after a trade action.
- `executeTrade` sell branch in `src/actions.js` now adds the sold item to `npc.merchantInventory` (upsert by `itemId`), so the response `npcInventory` field correctly reflects the updated stock instead of returning an empty array.
- NPCs who become Merchants via `career_shift` or artifact effect (jewelry corruption) now receive a seeded `merchantInventory` and `personalWealth`, matching the Base Pass initialization. Previously they were "ghost merchants" with empty stalls.
- Merchants who leave the role (via `career_shift` or weapon artifact elevation) now distribute their remaining stock through their social network before role reassignment: Relic/Ancient/high-value items are kept in personal inventory; regular stock goes to loved ones and friends first (with a linked `inheritance` history event on the recipient), then falls back to other active merchants, then is lost if no recipients exist.
- `ensurePlayerState()` in `src/actions.js` now initializes all required `playerState` fields (`reputation`, `reputationMap`, `inventory`, `xp`, `level`, `gold`, and stat defaults) so arithmetic like `reputation += delta` can never silently produce `NaN` when a client sends an incomplete state object.
- `PlayerMechanics.ensurePlayerState()` in `src/player-mechanics.js` was initializing `reputation` as `{}` instead of `0`; the guard `!playerState.reputation` evaluated to `true` when reputation was `0`, overwriting the scalar with an empty object and corrupting subsequent arithmetic.
- Argument-shifting guard in `turnInQuest()` now fires before `ensurePlayerState()` instead of after it, restoring the bounty-report path where the router passes `playerState` in the `itemId` slot.
- NPC ages are now simulation-independent: every NPC stores a `birthYear` at creation time, and the serialized `age` is always computed as `globalYear - birthYear`. Previously, ages were accumulated via `actor.age++` and capped at `MAX_FUTURE_YEARS` (year 550), causing NPCs created at year 550 to appear perpetually young (e.g. Brynn Greymantle, age 18 in year 1924).
- Delta-injected immigrants (via `/api/action/banish` and simulation-internal migration) now save `birthYear`, `arrivedYear`, and `ageAtArrival` in the stored delta. On injection, `effectiveAge = globalYear - birthYear` is calculated; NPCs whose effective age exceeds `MAX_NATURAL_LIFESPAN` (80) are silently skipped — they died of old age.
- `causedBy` on `grief`, `inheritance`, and `power_seizure` (oust) events now stores an inline snapshot object `{ id, year, description, type, actorName }` instead of a bare event ID string. This eliminates dangling references when the causing NPC has migrated out of the chunk — the frontend can render the full causal chain without any additional lookups.
- NPC history arrays growing exponentially on each chunk visit: `pushEvent()` in `history.js` was writing every simulation event to the DB via `saveDelta`, then the Delta Pass in `injectImmigrantsAndApplyDeltas` re-applied all those rows to the already-populated in-memory entities. The fix removes the `saveDelta` call from `pushEvent` — simulation events are deterministic from the seed and must not be persisted; only player-caused mutations written by `actions.js` belong in the DB.

### Added
- NPCs now have a `sex` field (`'male'`, `'female'`, or `'other'`), assigned deterministically via the seeded RNG at creation time across all creation paths: base generation (`generateNPCs`), immigration, population replenishment, and childbirth.
- Childbirth is now restricted to couples where at least one partner is `'male'` and the other is `'female'` (or either is `'other'`). Same-sex couples can still form via the romance system but will not produce children.
- `generateAppearance()` in `src/appearance.js` accepts an optional `sex` parameter: `'female'` NPCs no longer generate facial hair; `'male'` and `'other'` NPCs can. The `sex` field is also included in the NPC serialization returned by `/api/chunk/:x/:y`.
- `POST /api/trade` endpoint for buying from and selling to Merchant NPCs; non-standard response shape (`playerState`, `npcInventory`, `event`) distinct from the `/api/action/*` family.
- Merchant NPCs now carry deterministic `merchantInventory` (4–8 `primaryExport` resource slots plus 1–2 random artifacts with 20% markup) and `personalWealth` (500–3000g), both seeded at NPC generation time in `generateNPCs()` and re-applied from deltas on subsequent chunk loads.
- Market Depletion: when the player buys > 80% of a Merchant's `primaryExport` stock, `executeTrade()` writes a `shortage: true` delta; `simulate_economy()` will give the settlement a 60% chance of tier-drop or export pivot on the next time-skip.
- Merchant Ascendancy: selling a Relic (item with `prefix === 'Relic'`, i.e. age > 300yr) to a Merchant whose `personalWealth` exceeds 15 000g writes a `plutocracy_candidate` delta; `simulateHistory()` detects this delta during the next `advance_time` and installs the Merchant as ruler, recording "The Era of the Merchant Kings."
- `generateMerchantInventory(rng, primaryExport, globalYear, coordinate)` exported from `src/items.js` — deterministic Merchant stock generation using seeded RNG.
- Price stubs in `executeTrade()` read `town?.mythos?.fearModifier ?? 1.0` as a no-op placeholder, ready to become active when item 14 (Folklore & Mythos) is implemented.
- `generateArtifact()` in `src/items.js` now includes three provenance fields on every item: `creationYear`, `originSettlement`, and `historicalSignificance` (initially `[]`), plus deterministic `baseValue` and `value` fields keyed by artifact type.
- `calculateItemValue(item, globalYear)` exported from `src/items.js`: applies age-based value modifiers — items older than 100 years gain the `'Ancient'` prefix and 2× value; items older than 300 years gain the `'Relic'` prefix and exponential growth (`baseValue × 1.015^(age-300)`).


- `src/event-utils.js`: new module exporting `deterministicHash(input)` (SHA-1, 8-char hex) and `makeEvent(description, type, causedBy)` — the shared factory for all structured history events.
- History events are now structured objects `{ id, year, description, type, causedBy }` instead of plain strings. All 20 event push sites in `src/history.js` and all 13 sites in `src/actions.js` produce structured events.
- Causal links wired: `inheritance` events carry `causedBy` pointing to the preceding `death` event ID; `grief` events point to the deceased partner's death event; `power_seizure` (oust) events point to the new Mayor's seizure event.
- `appendHistory()` in `src/actions.js` fixed to correctly push to `entity.history.events` (was `entity.history`) and now stores events as JSON-stringified objects in the `history_append` Delta column.
- Delta Pass in `index.js` gains a backward-compat shim: legacy plain-string `history_append` deltas (detected by non-`{` first character) are auto-wrapped as `type: 'legacy'` event objects on read, so old DB rows remain readable without migration.
- Chronicle endpoint (`GET /api/chunk/:x/:y/chronicle`) updated to dual-path parser: structured events are rendered directly from their fields; legacy strings are parsed via the existing `[Year N]` regex. Timeline entries now include `id`, `type`, and `causedBy` fields alongside `actor` and `text`.


- `regicide` player action (`POST /api/action/regicide`): allows the player to attempt to assassinate the ruling Mayor and seize the throne. Awards +5000 XP on success; reduces reputation by 50 on failure. Uses `PlayerMechanics.resolveRegicide()` for probability resolution.
- `ArtifactEffects` static methods (`applyTomeEffect`, `applyWeaponEffect`, `applyJewelryEffect`, `applyRelicEffect`) are now wired into `turnInQuest` — donating an artifact to a quest giver triggers the correct effect class instead of a hardcoded role assignment.
- Conflict resolution triggered during decade-based settlement promotion in `simulateHistory`: when a settlement promotes to a new tier, it checks adjacent tiles for occupied neighbors and calls `PoliticalEngine.resolveConflict()` to determine annexation, subjugation, or repulsion outcomes, persisting results as Deltas.
- Colony reputation propagation: all player actions now route reputation changes through `applyReputationWithPropagation()`, which calls `PlayerMechanics.calculateReputationDelta()` and splits the delta between `playerState.reputation` (flat, backward-compatible) and a new `playerState.reputationMap` coordinate-keyed object that tracks per-location standing and propagates a portion to the suzerain if the tile is a colony.
- `getAdjacentTiles(x, y)` helper added to `src/map.js` returning the 4 cardinal neighbors as `{ x, y, key }` objects.
- `getTierForCoordinate(key)` and `getSuzerainForCoordinate(key)` added to `src/db.js` to query settlement tier and suzerain from the Delta store.
- `src/economy.js`: new module exporting `simulate_economy(town, years, rng, coordinate, globalYear)` — runs a per-decade production/consumption loop, evaluates Economic Boom (2 consecutive net > 200 → tier++) and Famine (2 consecutive net < 0 → history event), processes Time Capsule deltas (Banking Guild, Hyperinflation, Scholarly/Militaristic traits), and evaluates trade route health.
- `BIOME_PRIMARY_EXPORT` map added to `src/biomes.js`: each of the 5 biomes (plus forward-compat Wilderness) maps to a pair of export goods; one is picked deterministically from `seedrandom(coordinate + "_export")` at town generation.
- Town entities now carry `regionalWealth`, `primaryExport`, `tradePartners`, and `economicModifiers` fields, initialized in `generateTown()` in `index.js`.
- Trade partners seeded for Tier 3+ settlements after delta injection: 1–3 nearest Tier 2+ cardinal neighbors, deterministic per coordinate.
- `simulate_economy()` called once per decade inside `simulateHistory()` in `src/history.js`; economic events are pushed to town history and tier changes applied back to the entity.
- Ruin Hoard: when a settlement demotes to tier 0, 50% of `regionalWealth` is locked as a `ruin_hoard` delta via `lockRuinHoard()`.
- `lootTomb` in `src/actions.js` gains a Ruin path: if the tile tier is 0, awards `(1d10) × 100` gold and a 10% chance to recover a `Tier 2+` artifact from the Ruin Hoard.
- `getCapsuleDeltas(coordinate)` and `getRuinHoard(coordinate)` added to `src/db.js`.

### Changed
- `src/artifact-effects.js`: all four static methods now accept an `rng` parameter instead of calling `Math.random()` directly, restoring full determinism for simulation paths.
- `banish()` and `abdicate()` in `src/actions.js` now use a seeded `seedrandom` RNG (keyed on coordinate + globalYear) instead of `Math.random()` for destination and successor selection, making outcomes reproducible.
- `src/actions.js` and `index.js`: all `console.log` calls in production code paths replaced with `log()` from `src/logger.js`.
- Inline `require('./db')` inside `simulateHistory()` moved to the top-level module imports in `src/history.js`.

### Fixed
- `src/index.test.js` beforeEach restores default mock implementations for `db.getDeltas`, `db.getGlobalYear`, and `db.getParentCity`. `jest.clearAllMocks()` only clears call history, so `mockReturnValue`/`mockImplementation` overrides from earlier tests (notably `getGlobalYear=10000` and `getParentCity='world_X8_Y9'`) leaked into later tests, causing the "status delta should mark a generated NPC as Dead" test to load coordinate (0,0) as a tier-5 district with a 500-year Future Pass on the first call and a tier-1 district on the second — different deterministic NPC IDs across the two loads, so the death delta couldn't be matched.
- `unloadCoordinate()` in `index.js` now snapshots the entity query to an array before iterating and removing, avoiding any future iterator-invalidation surprises when `world.remove()` mutates the underlying bucket during the loop. The log count is now accurate (previously read `.length` from a Query object, printing `undefined`).
- Four route handlers in `index.js` (`GET /api/chunk/:x/:y`, `GET /api/coordinate`, `GET /api/chunk/:x/:y/chronicle`, `POST /api/action/:actionType`) were unprotected. All now have `try/catch` blocks with structured `{ error, code }` responses and `unloadCoordinate` cleanup in the catch path to prevent stale ECS state.

### Fixed
- `assassinate`, `claimThrone`, `isMayor`, and `abdicate` in `src/actions.js` crashed with `TypeError: Cannot set properties of undefined` when the target coordinate was a District. All four functions queried for `identity.type === "Town"` only; Districts have `identity.type === "District"`, so the query returned `undefined`. The filter now includes both types.
- Governing actions (`claimThrone`, `taxTown`, `decree`, `banish`, `abdicate`) are now blocked on District coordinates with a clear message directing the player to the parent city. `isMayor` returns `false` unconditionally for Districts, which gates all mayor-only actions. Killing a District administrator no longer grants the player a Mayor title or writes a `currentMayor` delta that would be silently overwritten on the next load.
- District coordinates (tiles claimed by a higher-tier settlement) skipped the Legends Pass and Future Pass entirely, leaving all NPCs with empty history and the `/chronicle` endpoint returning only the Year 1 establishment entry regardless of `globalYear`. Districts now run the full history pipeline matching the regular town flow.
- During district history simulation, a local NPC could seize the "Mayor" career and overwrite `currentMayor` on the district entity. Districts are always governed by their parent city's ruler, so `currentMayor` is now restored to the parent's authoritative value after simulation.
- Future Pass simulation was unbounded: at extreme `globalYear` values (e.g. 10 000) the engine would simulate thousands of years per chunk load, causing test-suite OOM kills and multi-minute load times. The Future Pass is now capped at `MAX_FUTURE_YEARS = 500` for both towns and districts.
- NPC `history` and `memories` were empty on almost all coordinates because `findEstimatedParent()` was classifying ~83% of tiles as districts using pure time estimates (no DB evidence). Districts skip `simulateHistory()`, so their NPCs had no events or relationships. The fix requires a saved `political` delta (DB-confirmed visit) before a neighbour can claim a tile; purely estimated tiers no longer trigger district loading.

### Added
- `src/bloom-filter.js`: fixed-size (8192-bit, 3 hash functions) bloom filter for encoding visited coordinates as a compact, opaque, URL-safe base64 string. The filter is designed to be owned by the frontend, updated on every chunk load, and sent to the map endpoint as `?bf=<value>`. False positive rate stays below 2% for up to 500 visited coordinates.
- `GET /api/map/:x/:y/:radius` now accepts an optional `?bf=<base64>` query param containing a serialized bloom filter. When provided, `isDiscovered` on each map tile reflects whether the frontend has previously visited that coordinate. Without the param the filter is treated as empty and all tiles return `isDiscovered: false` (previous behaviour).

### Added
- NPC name pool expanded from 14 first names + 10 surnames (140 combinations) to 90 first names + 70 surnames (6 300 combinations), eliminating near-certain duplicate names in any world with more than a handful of NPCs. All new names stay within the established fantasy-medieval register; no logic changes required.
- Tile description system (`src/tile-description.js`): every `/api/chunk` response now includes a top-level `tileDescription` object with structured, discrete fields — `size`, `atmosphere`, `walls`, `streets`, `surroundings`, `landmark`, and a `buildings` array derived from the NPC roles actually present. All fields draw from fixed discrete lists so frontends can drive rendering without parsing prose.
- `generateTileLightDescription(biome, tier)` added to the map pipeline: every tile in `/api/map` responses now includes a `tileDescription` with `terrain`, `vegetation`, and `settlementSilhouette` — computed purely from the coordinate seed and tier, with no ECS instantiation.
- Building condition (`derelict` → `weathered` → `modest` → `sturdy` → `grand`) is derived from settlement tier and live population so it evolves naturally as the world ages.
- District overlay buildings (armory for Keep, training ground for Barracks, etc.) are appended automatically when a tile is a District.
- `landmark` and `surroundings` are seeded from `tile_desc_X${x}_Y${y}` so they are stable across visits but vary by coordinate.
- NPC appearance system (`src/appearance.js`): each NPC now carries a structured `appearance` object in the chunk response with discrete fields for eye colour, skin tone, height, build, hair (colour/length/style), facial hair, role-appropriate clothing, and rare marks (scars, tattoos, birthmarks). All traits are 100% deterministic from the NPC's ID — the same NPC always looks the same. Age-driven traits (hair greying, baldness progression, child height/build) update automatically as the NPC ages without any stored delta.
- Three independent sub-RNGs per NPC (`_appearance`, `_clothing`, `_marks`) isolate trait groups so that extending one group in future never shifts the random sequence — and therefore the appearance — of another.
- `dead` top-level boolean added to each NPC in the chunk response so clients can switch to a death-state portrait without inspecting the `status` field.
- Skin tone distribution is biome-weighted (e.g. Marsh → more olive/dark tones; Mountain → more pale/fair tones) while remaining fully deterministic.

### Removed
- `description` prose string removed from NPC objects in the `/api/chunk` response. Clients should derive any display text from the structured `appearance` object. The field remains on NPC entities internally (used during history simulation) but is no longer serialised to the API.

### Fixed
- Districts showed `ruler: "Unknown"` even after their parent settlement had been visited. Root cause: `unloadCoordinate()` saved the district's own `currentMayor` delta (which was `'Unknown'` from the first visit before the parent was loaded), and `injectImmigrantsAndApplyDeltas()` re-applied that stale delta on every subsequent load, overwriting the correct parent value fetched by `loadAsDistrict()`. Fix: (1) `unloadCoordinate()` no longer saves a `currentMayor` delta for District entities — they always re-derive their mayor from the parent on load; (2) `injectImmigrantsAndApplyDeltas()` explicitly skips `currentMayor` deltas for District entities, handling any stale deltas already present in existing databases.

### Added
- `districtType` field added to every tile in the `/api/map` response. Claimed tiles now carry their district flavour (`Market`, `Slums`, `Keep`, `Barracks`, `Temple`) computed from the same deterministic seed (`district_type_X${x}_Y${y}`) used by `loadAsDistrict()`, so the map and chunk APIs always agree on district type.
- `DISTRICT_TYPES` constant moved from `index.js` to `src/map.js` (exported) and imported back in `index.js` — single source of truth for the district flavour list.

### Fixed
- `claimedBy` and `claimedByName` in the `/api/map` response were always set — even for tiles that no other settlement claimed — because `computeOwnership()` fell back to the tile itself as owner. Sovereign tiles (no external claimant) now correctly return `claimedBy: null`, `claimedByName: null`, and `districtType: null`, so the frontend can distinguish claimed territory from independent settlements without comparing a coordinate against itself.

### Fixed
- `lootTomb` action response contained `[object Object]` instead of item names — `lootedItems.join(", ")` was called on an array of item objects; replaced with `lootedItems.map(i => i.name).join(", ")` in `src/actions.js`.
- `assassinate` and `stealItem` tests were non-deterministic because they asserted a specific success outcome from a `Math.random()` roll with a non-zero fail floor. Tests now either force stat values that push successChance above 1.0, or mock `Math.random()` to return 0.95, so the outcome is guaranteed rather than probabilistic.

### Fixed
- `districtType` and `parentCity` were null in `/api/chunk` responses for tiles that the map showed as claimed, when the claiming settlement's `Claimed_By` delta had never been written (i.e. the parent had never been visited, or was visited before its tier grew past 1). `loadCoordinate()` now falls back to the same in-memory tier estimation used by `computeOwnership()` in the map API — if a neighbour's estimated tier gives it a claim radius that reaches the current tile, the tile loads as a District. Both APIs now agree on ownership.
- Ruler shown on the map for a claimed tile (inherited from the parent's `currentMayor` delta) could differ from the ruler in the chunk response (generated independently for the tile's own town) for the same reason above. The fix above also resolves this: claimed tiles now inherit the parent's saved ruler via `loadAsDistrict()` in both paths.

### Added
- PRD §5.1 implemented: when a Town with tier > 1 is unloaded, `Claimed_By` records are written to the GLOBAL delta DB for every tile within its expansion radius (Kingdom ±3, Magistrate ±2, SmallCity/FullCity ±1). Subsequent visits to those tiles load them as Districts instead of generic Towns.
- `loadAsDistrict()` in `index.js`: generates a District entity that inherits the parent city's ruler and political state; district flavour (Market, Slums, Keep, Barracks, Temple) is deterministic from the coordinate seed.
- `/api/chunk` response now includes `town.type` (`"Town"` | `"District"`), `town.districtType` (flavour string or `null`), and `town.parentCity` (parent coordinate key or `null`) so clients can render claimed tiles differently.
- `upsertDelta()` in `src/db.js`: atomic DELETE + INSERT in a transaction — prevents claim records from accumulating duplicates across repeated visits.
- `getParentCity(coordinate)` in `src/db.js`: single-row lookup returning the parent settlement's coordinate key for a claimed tile, or `null`.

### Fixed
- `getClaimedTiles()` in `src/politics.js` was returning `d.coordinate` (always `"GLOBAL"`) instead of `d.entity_name` (the actual claimed tile coordinate).

### Fixed
- Claimed tiles on the map were showing their own independent `ruler` instead of the controlling settlement's ruler — `computeOwnership` now propagates the owner's `ruler` to every tile it claims, so a kingdom's entire territory shows one consistent ruler in the map response

### Fixed
- `estimateTierFromTime()` was using a linear population formula that inflated every coordinate to tier 5 after ~300 years, making all tiles equal-tier and causing every tile to claim itself — `claimedBy` was effectively useless. Replaced with a seeded growth-ceiling model: each settlement has a deterministic maximum tier it can ever reach (~50% stay tier 1, ~25% tier 2, ~13% tier 3, ~7% tier 4, ~5% tier 5) with a seeded maturation window of 50–300 years. This produces realistic world variation and meaningful territory grouping.

### Added
- Each tile in the `/api/map` response now includes `claimedBy` (coordinate key e.g. `world_X2_Y1`) and `claimedByName` (settlement name) so the frontend can group tiles by controlling settlement without any client-side spatial math
- `computeOwnership(grid)` in `src/map.js` determines the controlling settlement for each tile using Chebyshev distance against each candidate's claim radius (Town 0, SmallCity/FullCity ±1, Magistrate ±2, Kingdom ±3); highest tier wins, ties broken by proximity then coordinate order

### Fixed
- Settlement tiers never progressed on the mini-map because `/api/map` read tier purely from the delta DB, which only exists for visited coordinates — unvisited coordinates always returned tier 1 ("Town") regardless of `globalYear`
- Delta Pass was overwriting Future Pass tier results: when a coordinate was re-loaded after time advanced, the saved `political` delta restored the old tier, wiping out any tier gain the 450-year Future Pass had just computed — the max of simulated and saved tier is now kept

### Changed
- `getTownRulerAndTier()` in `src/map.js` now estimates settlement tier from `globalYear` and coordinate seed for unvisited coordinates, so the map shows realistic progression without running the full 4-pass pipeline

### Tests
- Updated `getTownRulerAndTier` test to assert a valid tier range (1–5) rather than a hardcoded default of 1, matching the new time-based estimation behavior

### Fixed
- `generateQuests` was using `Math.random()` to choose quest type, making offered quests non-deterministic across visits — replaced with seeded RNG passed from the `_quests` coordinate seed (`src/quests.js`, `index.js`)

### Changed
- `generateQuests` signature now accepts `rng` as a fourth parameter; all callers must pass a seeded RNG

### Fixed
- Mystery Heist quest title and description were rendering `[object Object]` instead of the item name — `targetItem.name` is now used in both template strings (`src/quests.js`)

- Fetch quest `target` was hardcoded to `"ANY"`, causing turnin to fail with "Quest giver not found" — now set to the Scholar's NPC identity id (`src/quests.js`)

### Tests
- Added test coverage for the Mystery Heist quest path, asserting item name appears correctly and `[object Object]` is never present
- Added test asserting Fetch quest `target` is the Scholar's NPC id, not `"ANY"`
