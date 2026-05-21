# Project Weaver — CLAUDE.md

> This file is the **constitution** for Claude Code in this project. All rules here override
> any temporary prompt or instruction. Read it fully before touching any file.

---

## Project Overview

**Project Weaver** is a Just-In-Time (JIT) Procedural RPG Engine — a stateless Node.js
backend API that generates infinite, deterministic game worlds on the fly.

- **Stack**: Node.js (ES Modules), Express, SQLite (`better-sqlite3`), `miniplex` ECS
- **Architecture**: Seed & Delta — worlds are generated deterministically from coordinate
  seeds; only player-made changes ("Deltas") are persisted to SQLite
- **Entry point**: `index.js` (main server, port 3000)
- **Test runner**: Jest (200 tests, all must pass before any commit)
- **Key sources of truth**:
  - `design-prd.md` — canonical product spec
  - `API-REFERENCE.md` — endpoint contracts
  - `IMPLEMENTATION-SUMMARY.md` — current completion status

---

## Architecture Non-Negotiables

These are load-bearing constraints. Breaking them breaks the entire system.

### 1 — Strict Determinism
Every world, NPC, and artifact must be **100% reproducible** from its coordinate seed
(`world_X{x}_Y{y}`). The same coordinate, loaded at the same `globalYear`, must produce
identical output every time — same names, same UUIDs, same history.

- **NEVER** use `Math.random()`. Always use the seeded RNG passed through context.
- UUID generation must be a **deterministic hash** of `(seed + year + name)`, not random.
- If you break determinism, you break save compatibility for all existing players.

### 2 — Stateless Backend / Stateful Client
The server holds **zero** per-request state. Every player action endpoint (`POST /api/action/*`)
receives the full `playerState` object in the request body and returns the updated
`playerState`. Never store player data server-side outside SQLite Deltas.

### 3 — JIT Generation Only
Do not pre-generate or cache full chunk data. Chunks are generated on demand and discarded
after serialization. Only **Deltas** (player-caused mutations) are written to SQLite.

### 4 — The 4-Pass Pipeline
All chunk loading must follow this order. Do not skip or reorder passes:
1. **Base Pass** — Generate from seed (town, biome, founding NPCs at Year 1)
2. **Legends Pass** — Simulate 50 years of NPC history
3. **Delta Pass** — Apply SQLite overrides (player kills, steals, migrations, territory claims)
4. **Future Pass** — Simulate forward from Year 51 → `globalYear`

### 5 — NPC Status Values & Serialization Contract

An NPC's `status` field can be one of four values:

| Value | Meaning |
|-------|---------|
| `"Alive"` | Present and living at this coordinate |
| `"Dead"` | Died at this coordinate (natural, murder, or old age) |
| `"Migrated"` | Voluntarily left this coordinate during simulation |
| `"Exiled"` | Banished by the Mayor via player action |

**Migrated and Exiled NPCs are intentionally included in the chunk serialization.** The UI
consumes them to render departed characters (e.g., in a "departed residents" panel). Do NOT
filter them out server-side and do NOT override their `status` to `"Dead"` — even if their
computed age exceeds `MAX_NATURAL_LIFESPAN`. Age-based death only applies to `"Alive"` NPCs.
The `dead` field in the response must be `false` for Migrated and Exiled NPCs.

---

## Code Style

- **Destructure imports**: `import { foo, bar } from './module.js'` not `import mod from './module.js'`
- **No TypeScript** — plain JS with JSDoc comments for complex types
- **Async/await** everywhere — no raw Promise chains or callbacks
- **Error handling**: wrap all async route handlers in try/catch; return structured errors:
  ```js
  res.status(500).json({ error: 'Human-readable message', code: 'MACHINE_CODE' });
  ```
- **No magic numbers** — extract constants to named variables or config
- **File naming**: `kebab-case.js` for source files, matching the existing `src/` structure

---

## File Structure — Do Not Reorganize

```
generator/
├── index.js                  # Server entry point — minimal, delegates to src/
├── world_deltas.db           # SQLite — NEVER commit this file
├── src/
│   ├── actions.js            # Player action implementations
│   ├── artifact-effects.js   # Artifact mechanics (Tome, Jewelry, Weapon, Relic)
│   ├── biomes.js             # Biome system & demographic weighting
│   ├── components.js         # ECS component definitions (miniplex)
│   ├── db.js                 # SQLite Delta persistence layer
│   ├── dialogue.js           # NPC dialogue generation
│   ├── grammar.js            # Procedural text generation
│   ├── history.js            # NPC lifecycle simulation
│   ├── items.js              # Artifact generation
│   ├── map.js                # Fog-of-war / mini-map (no ECS instantiation)
│   ├── appearance.js         # Deterministic NPC appearance generation
│   ├── player-mechanics.js   # Action resolution & XP
│   ├── politics.js           # Settlement tiers & conflict resolution
│   ├── population.js         # Population replenishment system
│   └── quests.js             # Quest generation
```

- **New files go in `src/`** with a matching `src/*.test.js` sibling.
- `index.js` should remain a thin router — business logic belongs in `src/`.
- Do NOT create `utils/`, `helpers/`, or `lib/` directories without discussion.

---

## Database Rules (SQLite / `world_deltas.db`)

- All DB access goes through `src/db.js`. Never `import Database` directly in other files.
- **Only Deltas** are stored — player kills, stolen items, migrations, territory claims,
  `globalYear`. Never persist full generated chunk state.
- Delta keys follow the pattern `world_X{x}_Y{y}` for coordinate-scoped data and `GLOBAL`
  for world-wide state (e.g., `globalYear`, `immigrant_data`).
- All writes are synchronous (`better-sqlite3` style) — wrap mutations in transactions where
  multiple rows change atomically.
- `world_deltas.db` is in `.gitignore`. **Never commit it.**

---

## API Contracts — Do Not Break Existing Signatures

These endpoints are deployed and must remain backward-compatible:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/chunk/:x/:y` | Full chunk load (4-pass pipeline) |
| GET | `/api/coordinate?x=X&y=Y` | Alias for chunk |
| GET | `/api/map/:x/:y/:radius` | Fog-of-war mini-map (no ECS, math only) |
| GET | `/api/chunk/:x/:y/chronicle` | Town history timeline |
| POST | `/api/action/steal` | Steal item from NPC |
| POST | `/api/action/assassinate` | Kill NPC |
| POST | `/api/action/claim` | Regicide / kingdom takeover |
| POST | `/api/action/turnin` | Complete quest |
| POST | `/api/action/tax` | Collect taxes |
| POST | `/api/action/abdicate` | Step down as ruler |
| POST | `/api/action/banish` | Exile NPC |
| POST | `/api/action/loot_tomb` | Find artifacts |
| POST | `/api/action/advance_time` | Progress universal time |

**IMPORTANT**: If you need to change a response shape, add new fields — never rename or
remove existing fields. Clients depend on the current response contracts.

---

## Game Mechanics — Do Not Guess

All probability formulas are locked. Do not "improve" them without a spec change:

```js
// Steal
FailChance = Math.max(0.10, 0.60 - (stealth * 0.05))

// Assassinate
FailChance = Math.max(0.10, 0.80 - (stealth * 0.05) - (strength * 0.05))

// Regicide
FailChance = 0.95 - (stealth * 0.01) - (strength * 0.01) - (weaponTier * 0.05)
```

XP rewards are also fixed: Steal +25, Assassinate +75, Quest +50, Bounty +100, Regicide +5000.
Leveling: every 100 XP = +1 Level = +1 Stealth or +1 Strength.

---

## Testing Workflow

**MUST RUN before any commit or PR.**

```bash
# Run all tests
npm test

# Run a single test file (preferred during development)
npm test -- src/biomes.test.js

# Run with coverage
npm test -- --coverage
```

- Current baseline: **200 tests passing**. Never merge code that drops this count.
- Every new feature or bug fix requires a corresponding test in `src/*.test.js`.
- Tests must cover: happy path, edge cases, and determinism (same input → same output).
- Do NOT use `test.only` or `test.skip` in committed code.
- Do NOT mock the seeded RNG — test with real seeds and assert exact output values.

---

## Guardrails 

### Things Claude Must Not Do

| ❌ Do NOT | Why |
|-----------|-----|
| Use `Math.random()` anywhere in generation | Breaks determinism |
| Commit `world_deltas.db` | Contains runtime player state, not source |
| Add `console.log` debug statements to committed code | Use `src/logger.js` |
| Skip the Delta Pass when loading a chunk | Player changes would be invisible |
| Store full chunk state in SQLite | Violates the Seed & Delta architecture |
| Change existing response field names | Breaks client compatibility |
| Add new npm dependencies without noting them here | Increases bundle risk |
| Generate UUIDs with `crypto.randomUUID()` in simulation code | Must be deterministic hashes |
| Use "magic numbers" or "magic strings" | All key numeric  and string constants must be assigned to a mnemotechnic constant for better understanding and tweaking|
| Modify `design-prd.md` or `API-REFERENCE.md` without asking | These are sources of truth — when a feature is added, changed, or removed, ask the user for explicit approval before updating them |


### Things Claude Must Do

| ✅ Do | Why |
|-------|-----|
| Always try to use design patterns and abstract logic as much as possible | This allows you to focus your coding specifically in the logic you need to change with minimum impact to surrounding logic.|
---

## Logging

Use `src/logger.js` for all logging. Never use `console.log` in production paths.

```js
import logger from './logger.js';
logger.info('Chunk loaded', { x, y, globalYear });
logger.warn('Population below threshold', { x, y, living });
logger.error('Delta write failed', { error });
```

Log levels: `debug` (dev only), `info`, `warn`, `error`.

---

## Git Workflow

- Branch names: `feature/short-description` or `fix/short-description`
- Commit messages follow Conventional Commits:
  - `feat: add migration injection to Delta Pass`
  - `fix: determinism broken in Mountain biome NPC names`
  - `test: add coverage for regicide fail paths`
  - `refactor: extract conflict math to politics.js`
  - `docs: update API-REFERENCE for /action/tax`
- **Never push directly to `main`**. All changes via PR.
- PRs require all 200+ tests passing. No exceptions.

### CHANGELOG — Required After Every Iteration

**YOU MUST update `CHANGELOG.md` at the project root after completing any unit of work**
(feature, fix, refactor, or docs change). This is not optional.

Follow [Keep a Changelog](https://keepachangelog.com) format:

```markdown
## [Unreleased]

### Added
- Population replenishment now fires a "Baby Boom" history event on the town entity

### Fixed
- Determinism bug in Mountain biome NPC name generation (seed collision at year 50)

### Changed
- `resolveConflict()` now returns structured outcome object instead of plain string

### Removed
- Deprecated `/api/coordinate` alias (use `/api/chunk/:x/:y` instead)
```

Rules:
- One entry per logical change — don't batch unrelated changes into one bullet
- Write for a human reading it 6 months from now, not for yourself right now
- **Never edit past dated entries** — only add to `[Unreleased]`
- When a version is released, the maintainer promotes `[Unreleased]` to `[x.y.z] - YYYY-MM-DD`
- If you forget to update it during a task and catch it later, add it before the next commit

---

## Performance Targets

- Chunk load time: **< 150ms** (baseline ~50-100ms)
- Mini-map (`/api/map`): **< 20ms** — no ECS instantiation, math only
- SQLite writes: wrap multi-row mutations in transactions for atomicity + speed
- After chunk serialization to JSON response, discard all ECS entities to free memory

---

## Dependency Notes

| Package | Purpose | Notes |
|---------|---------|-------|
| `express` | HTTP server | Keep at current major version |
| `better-sqlite3` | SQLite | Synchronous — intentional, don't switch to async |
| `miniplex` | ECS world | Entity lifecycle is manual — remember to destroy entities |
| `jest` | Test runner | Config in `package.json` |

---

## When working off of a TODO list
- Always review the sources of truth and if the implementation adds/changes something, ask to update those files

## When You're Unsure

1. **Check `design-prd.md`** — it is the canonical source for intended behavior
2. **Check `API-REFERENCE.md`** — for endpoint contracts and response shapes
3. **Check `IMPLEMENTATION-SUMMARY.md`** — for current status and known placeholders
4. **Run the tests** — if tests pass and behavior matches the PRD, you're good
5. **Ask before inventing** — if the PRD doesn't cover it, don't implement it speculatively

---

*Last updated: May 2026 — keep this file in sync with the codebase. Review when tests fail.*
