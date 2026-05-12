# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

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
