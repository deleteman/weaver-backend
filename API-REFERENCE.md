# Project Weaver — API Reference

**Base URL:** `http://localhost:3000`  
All action endpoints return `HTTP 400` on failure with `{ "error": "..." }`.

---

## playerState Object

Every action endpoint receives and returns this object. Initialize it for new players:

```json
{
  "stats":         { "stealth": 5, "strength": 5 },
  "level":         1,
  "xp":            0,
  "reputation":    0,
  "reputationMap": {},
  "inventory":     [],
  "titles":        {}
}
```

`titles` is a map of `{ "TownName": "Mayor" }` or `{ "Global": "Master Thief" }`.

`reputation` is the flat backward-compatible score. `reputationMap` is a coordinate-keyed map (`{ "world_X2_Y3": 50 }`) tracking per-location standing. All action endpoints populate both fields. For colony tiles, a portion of the reputation delta is propagated to the suzerain's entry in `reputationMap`.

---

## Read Endpoints

### `GET /api/chunk/:x/:y`

Full 4-pass world load for a coordinate.

**Response:**
```json
{
  "globalYear": 51,
  "coordinate": { "x": 0, "y": 0 },
  "town": {
    "name":        "Deephollow",
    "type":        "Town",
    "districtType": null,
    "parentCity":  null,
    "ruler":       "Kael the Brave",
    "tier":        1,
    "population":  8,
    "history":     [{ "id": "ev_3a2b1c4d", "year": 15, "description": "[Year 15] Founded the town.", "type": "legacy", "causedBy": null }]
  },
  "tileDescription": {
    "size":        "small",
    "atmosphere":  "peaceful",
    "walls":       "timber palisade",
    "streets":     "dirt path",
    "surroundings":"rolling hills",
    "landmark":    "ancient well",
    "buildings": [
      { "type": "guard tower", "condition": "weathered" },
      { "type": "town hall",   "condition": "weathered" }
    ]
  },
  "population": [
    {
      "id":     "abc123def456",
      "name":   "Kael the Brave",
      "age":    45,
      "role":   "Guard",
      "sex":    "male",
      "status": "Alive",
      "dead":   false,
      "appearance": {
        "eyeColor":   "hazel",
        "skinTone":   "fair",
        "height":     "tall",
        "build":      "stocky",
        "baldness":   false,
        "hair": {
          "color":  "streaked grey",
          "length": "short",
          "style":  "tied back"
        },
        "facialHair": "short beard",
        "clothing": {
          "head":      "iron helm",
          "torso":     "chainmail hauberk",
          "legs":      "leather trousers",
          "feet":      "iron-capped boots",
          "accessory": "leather belt"
        },
        "scars":   [{ "location": "left cheek", "type": "slash" }],
        "tattoos": [],
        "marks":   []
      },
      "inventory": [{ "id": "item001", "name": "Iron Blade", "type": "Weapon" }],
      "quests":    [{ "type": "Fetch", "itemType": "Weapon", "reward": 50 }],
      "history": [
        {
          "id":          "ev_a1b2c3d4",
          "year":        1,
          "description": "[Year 1] Became a Guard.",
          "type":        "career_shift",
          "causedBy":    null
        }
      ],
      "memories":  { "npc-id-xyz": "hates" }
    }
  ],
  "factions": [
    {
      "id":          "faction_abc123",
      "name":        "Blackthorn",
      "type":        "blood_feud",
      "memberCount": 3,
      "foundedYear": 110
    }
  ]
}
```

**Town tiers:** 1=Town, 2=SmallCity, 3=FullCity, 4=Magistrate, 5=Kingdom  
**NPC statuses:** `"Alive"`, `"Dead"`, `"Exiled"`, `"Migrated"`  
**NPC roles:** Guard, Mayor, Hero, Scholar, Merchant, Blacksmith, Bandit, Cultist, Beggar, Citizen, Exile

**`population[]` NPC object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Stable deterministic NPC identifier |
| `name` | string | NPC name |
| `age` | number | Current age in years |
| `role` | string | Current role (see role list above) |
| `sex` | string | `"male"` \| `"female"` \| `"other"` — assigned deterministically at creation; `"other"` for legacy NPCs loaded from old deltas |
| `status` | string | `"Alive"` \| `"Dead"` \| `"Exiled"` \| `"Migrated"` |
| `dead` | boolean | `true` when `status === "Dead"`, or when `status === "Alive"` and the NPC's age exceeds `MAX_NATURAL_LIFESPAN` (80). Always `false` for `"Migrated"` and `"Exiled"` NPCs — use `status` to distinguish them from the dead |
| `appearance` | object | Structured visual profile (see below) |
| `inventory` | object[] | Items carried by this NPC — see Artifact object fields below |
| `quests` | object[] | Quests this NPC offers |
| `history` | object[] | This NPC's personal event log — see History Event shape below |
| `memories` | object | Map of `{ npcId: memoryState }` where `memoryState` is one of `"hates"` \| `"loves"` \| `"likes"` \| `"mourns"` \| `"parent"` \| `"child"` \| `"avenged"` \| `"satisfied"` |

**Artifact object** — each entry in `inventory[]` has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | 12-char deterministic MD5 hash of `coordinate + name + year + finderName` |
| `name` | string | e.g. `"The Obsidian Blade"` |
| `type` | string | `"Tome"` \| `"Jewelry"` \| `"Weapon"` \| `"Relic"` |
| `description` | string | Flavour text |
| `content` | string \| null | Populated only for Tomes; `null` for all other types |
| `creationYear` | number | In-world year the artifact was generated |
| `originSettlement` | string | Coordinate key of the tile where the artifact was created, e.g. `"world_X2_Y3"` |
| `historicalSignificance` | string[] | Array of event tags appended over time, e.g. `["Unearthed in Year 312"]`; empty at creation |
| `baseValue` | number | Deterministic base gold value, seeded by artifact type at generation |
| `value` | number | Current effective value — equals `baseValue` at creation; apply `calculateItemValue(item, globalYear)` to get the age-adjusted figure |
| `prefix` | string \| undefined | `"Ancient"` (age > 100 yr) or `"Relic"` (age > 300 yr); absent at creation — set by `calculateItemValue()` |

**Age-based value formula** (applied by `calculateItemValue(item, globalYear)` in `src/items.js`):
- Age > 300 yr → `prefix: 'Relic'`, `value = baseValue × 1.015^(age − 300)` (exponential growth)
- Age 101–300 yr → `prefix: 'Ancient'`, `value = baseValue × 2`
- Age ≤ 100 yr → no prefix, `value = baseValue`

---

**History Event object** — each entry in `history[]` and `town.history[]` is a structured object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `"ev_"` + 8-char deterministic hex hash of the description. Stable across loads. |
| `year` | number | In-world year when the event occurred |
| `description` | string | Human-readable event text, e.g. `"[Year 12] Became a Guard."` |
| `type` | string | Machine-readable event category (see table below) |
| `causedBy` | object \| null | Inline snapshot of the event that caused this one, or `null` (see **CausedBy snapshot** below) |

**Event type values:**

| Type | Trigger |
|------|---------|
| `immigration` | NPC arrived from another coordinate |
| `settlement_promoted` | Settlement gained a tier |
| `age_transition` | NPC came of age (child → adult) |
| `grief` | NPC lost a loved one |
| `birth` | New NPC born |
| `death` | NPC died of natural causes |
| `child_death` | NPC died before adulthood |
| `inheritance` | NPC inherited from the deceased (`causedBy` = death event ID) |
| `career_shift` | NPC changed role |
| `power_seizure` | NPC ousted the Mayor and took control |
| `romance` | NPC fell in love |
| `friendship` | NPC formed a strong bond |
| `rivalry` | NPC entered a blood feud |
| `artifact_discovery` | NPC found an artifact |
| `migration` | NPC moved to a different coordinate |
| `assassination` | NPC killed by player action |
| `chaos` | Political instability following a slaying |
| `regicide` | Ruler slain by the player; new ruler took power |
| `legacy` | Miscellaneous player-triggered event (quest outcomes, gifts) |
| `legacy` (DB) | Plain-string event from pre-structured DB rows, auto-wrapped on read |
| `economic_boom` | Settlement reached two consecutive surplus decades and gained a tier |
| `famine` | Settlement reached two consecutive deficit decades (no tier change) |
| `banking_guild_founded` | Time Capsule: seeded gold compounded past threshold — Banking Guild formed, tier+1 |
| `buried_gold_boom` | Time Capsule: buried gold trove discovered — Boom + Hyperinflation risk |
| `economic_ruin` | Time Capsule: buried gold without Merchant/Magistrate caused settlement collapse |
| `capsule_weapon` | Time Capsule: Tier 3+ weapon unearthed — settlement gains Militaristic trait |
| `capsule_tome` | Time Capsule: Tier 3+ tome unearthed — settlement gains Scholarly trait and production bonus |
| `trade_route_collapse` | A trade partner fell to Ruin; the link was severed |
| `shortage` | Trade partner Ruin triggered a supply shortage (small dependent towns only) |
| `settlement_ruined` | Settlement's tier dropped to 0; Ruin Hoard locked |

**CausedBy snapshot** — when populated, `causedBy` is an object containing all the information needed to render the causal link without any additional lookups, even if the causing NPC has since migrated out of the chunk:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `"ev_"` + 8-char hash — the ID of the causing event |
| `year` | number | In-world year when the causing event occurred |
| `description` | string | Full `"[Year N] ..."` text of the causing event |
| `type` | string | Event type of the causing event |
| `actorName` | string | Display name of the NPC who owns the causing event |

Only populated for these event types, and only when the causal event exists at write time:
- `inheritance` → causing event is the deceased NPC's `death` event; `actorName` is the deceased
- `grief` → causing event is the partner's `death` event; `actorName` is the partner (`null` if partner migrated or has no death event)
- `power_seizure` (oust) → causing event is the new Mayor's seizure; `actorName` is the new Mayor

**`appearance` object fields:**

All values are discrete named strings drawn from fixed lists — use them to drive portrait rendering, filters, and tooltips without parsing prose.

| Field | Discrete values |
|-------|----------------|
| `eyeColor` | `brown`, `blue`, `green`, `grey`, `hazel`, `amber`, `black`, `pale grey`, `violet` |
| `skinTone` | `pale`, `fair`, `tan`, `olive`, `brown`, `dark brown`, `ebony` (biome-weighted distribution) |
| `height` | `very short` (age < 10), `short` (age 10–15), `average`, `tall` (adults) |
| `build` | `slight` (age < 16), `lean`, `average`, `stocky`, `muscular`, `heavyset`, `frail` (age > 70) |
| `baldness` | `true` / `false` — seeded, ~30% of NPCs |
| `hair.color` | `black`, `dark brown`, `brown`, `auburn`, `chestnut`, `blond`, `platinum`, `red`; age-driven: `streaked grey` (45+), `grey` (60+), `white` (75+) |
| `hair.length` | `cropped` (age < 16), `short`, `shoulder-length`, `long`; baldness-driven: `thinning` (40+), `bald` (55+) |
| `hair.style` | `straight`, `wavy`, `curly`, `braided`, `tied back`, `shaved sides` |
| `facialHair` | `none` (age < 16, NPC `sex === 'female'`, or seeded), `stubble`, `goatee`, `thin mustache`, `short beard`, `full beard`, `braided beard` |
| `clothing.head` | varies by role tier — `none`, `wool cap`, `leather hood`, `iron helm`, `wide-brim hat`, `crown`, `veil` |
| `clothing.torso` | varies by role tier — `linen shirt`, `wool tunic`, `leather vest`, `padded gambeson`, `chainmail hauberk`, `plate breastplate`, `silk robe`, `merchant coat`, `tattered rags` |
| `clothing.legs` | varies by role tier — `wool breeches`, `leather trousers`, `linen skirt`, `chainmail chausses`, `plate greaves`, `torn rags` |
| `clothing.feet` | varies by role tier — `bare`, `sandals`, `leather shoes`, `worn boots`, `riding boots`, `iron-capped boots` |
| `clothing.accessory` | varies by role tier — `none`, `rope belt`, `leather belt`, `fur-lined cloak`, `travel cloak`, `silk sash`, `bandolier` |
| `scars` | Array of `{ location, type }` — 0–2 entries, rare (~15% have one, ~5% have two) |
| `tattoos` | Array of `{ location, motif }` — 0–2 entries, rare (~12% / ~4%) |
| `marks` | Array of `{ location, type }` — 0–2 entries, rare (~10% / ~3%) |
| `faceShape` | `oval`, `square`, `round`, `angular`, `heart` — biome-weighted; children → round-biased, elderly → angular-biased |
| `eyeShape` | `almond`, `round`, `narrow`, `upturned` — sex-weighted; Cultist → upturned, Scholar → round |
| `complexion` | `smooth`, `freckled`, `weathered`, `ruddy`, `sallow` — biome-weighted; age/role overrides (age≥50 → weathered, Beggar/Exile → sallow, Guard/Blacksmith → ruddy, children → smooth) |
| `expressionBias` | `neutral`, `stern`, `weary`, `cheerful`, `suspicious` — role-weighted (Guard: stern/weary; Merchant: cheerful; Scholar: cheerful/suspicious; Cultist: stern/suspicious; Beggar/Exile: weary) |
| `noseShape` | `button`, `straight`, `broad`, `hooked` — sex-weighted; build overrides (heavyset/stocky → broad, lean/frail/slight → button/straight) |

Role → clothing tier mapping: Mayor/Scholar → noble; Guard → military; Cultist → clergy; Blacksmith/Merchant/Citizen/Child → common; Bandit/Beggar/Exile → outcast.

**Appearance determinism:** all fields are recomputed on every load from eight independent sub-seeds of the NPC's `id` (`_appearance`, `_clothing`, `_marks`, `_face`, `_eyes`, `_complexion`, `_expr`, `_nose`). The same NPC always has the same appearance at the same age. Age-dependent fields (hair colour, baldness progression, height, build) update automatically as `globalYear` advances — no delta storage required.

**`tileDescription` object** — included in every chunk response. All values are discrete named strings drawn from fixed lists so frontends can drive rendering without parsing prose.

| Field | Type | Discrete values |
|-------|------|----------------|
| `size` | string | `hamlet` (pop < 5), `small` (5–9), `modest` (10–14), `large` (15–20), `sprawling` (21+) |
| `atmosphere` | string | `peaceful`, `bustling`, `tense`, `grim`, `festive`, `desolate`, `prosperous` — derived from political stance × tier |
| `walls` | string | Seeded by coordinate; selected from a tier- and biome-aware pool. Tier 1 (pop < 5): earthworks/ditch variants; Tier 1 (pop ≥ 5): timber/palisade variants; Tier 2: stone/earthen walls; Tier 3: gatehouses and curtain walls; Tier 4–5: ramparts and citadel walls. Biome influences material (Mountain → stone, Desert → adobe, Marsh → timber). Stable across revisits. See `WALLS` export for full allowlist (~20 values). |
| `streets` | string | `stone-paved` (Mountain), `sand-swept` (Desert tier 3+), `dirt path` (Desert tier 1–2, Plains/Wilderness), `muddy cobblestone` (Forest, Marsh tier 1–2), `wooden boardwalk` (Marsh tier 3+) |
| `surroundings` | string | Biome-specific: Forest → `dense canopy`, `ancient oaks`, `pine thicket`, `mossy clearings`; Mountain → `jagged peaks`, `rocky outcrops`, `narrow passes`, `alpine meadow`; Desert → `drifting sands`, `rocky plateau`, `salt flats`, `dry riverbed`; Marsh → `murky wetlands`, `reed beds`, `boggy ground`, `shallow flood plain`; Plains/Wilderness → `rolling hills`, `open plains`, `scrubland`, `dark thicket`. Seeded from coordinate — stable across revisits. |
| `landmark` | string | One of 13 named landmarks (e.g. `crumbling watchtower`, `ancient well`, `great oak`, `guild hall`). Seeded from coordinate — stable across revisits. |
| `buildings` | object[] | One entry per unique NPC role present; see building table below. |

**`tileDescription.buildings[]` entry:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Building name derived from NPC role: Mayor → `town hall`, Guard → `guard tower`, Blacksmith → `forge`, Merchant → `trading post`, Scholar → `library`, Citizen → `cottage row`, Beggar → `makeshift shelter`, Cultist → `hidden shrine`, Bandit → `hideout`, Exile → `shack`. Three or more Children → `schoolhouse`. District tiles append an overlay building: Market → `market square`, Keep → `armory`, Barracks → `training ground`, Temple → `processional path`, Slums → `tenement block`. |
| `condition` | string | `derelict` (tier 1, pop < 5), `weathered` (tier 1, pop ≥ 5), `modest` (tier 2), `sturdy` (tier 3), `grand` (tier 4–5) |

**Atmosphere derivation by stance and tier:**

| Stance | Tier 1–2 | Tier 3–5 |
|--------|----------|----------|
| Aggressive | `tense` | `grim` |
| Federation | `bustling` | `prosperous` |
| Occult | `desolate` | `grim` |
| Balanced | `peaceful` | `festive` |

---

**`town` object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Settlement name |
| `type` | `"Town"` \| `"District"` | `"District"` when the tile is claimed by a neighbouring higher-tier settlement |
| `districtType` | string \| null | District flavour (`"Market"`, `"Slums"`, `"Keep"`, `"Barracks"`, `"Temple"`). `null` for Towns. |
| `parentCity` | string \| null | Coordinate key of the controlling settlement (e.g. `"world_X2_Y1"`). `null` for independent Towns. |
| `ruler` | string | Current mayor/ruler — inherited from the parent city for Districts |
| `tier` | number | Political tier of the controlling settlement (inherited by Districts) |
| `population` | number | Number of living NPCs at this location |
| `history` | string[] | Chronological event log |
| `regionalWealth` | number | Accumulated wealth of the settlement (seeded at `tier × 500`, modified by economy simulation) |
| `primaryExport` | string | Deterministic export good derived from biome (e.g. `"Iron"`, `"Grain"`, `"Spice"`) |
| `tradePartners` | string[] | Coordinate keys of active trade partners (non-empty for Tier 3+ settlements; may shrink if partners become Ruins) |
| `economicModifiers` | object | `{ shortage: bool, hyperinflation: bool, hyperinflationExpiryYear: number\|null, economicBoomYear: number\|null }` |

---

### `GET /api/coordinate?x=X&y=Y`

Alias for `GET /api/chunk/:x/:y`. Same response shape.

---

### `GET /api/chunk/:x/:y/chronicle`

Full chronological event log for a coordinate. Runs the full 4-pass pipeline.

**Response:**
```json
{
  "title": "The Chronicles of Coordinate 0, 0",
  "timeline": {
    "Year 1": [
      { "actor": "Deephollow", "text": "Founded the town.",  "id": "ev_3f1a2b4c", "type": "settlement_promoted", "causedBy": null },
      { "actor": "Kael",       "text": "Became a Guard.",    "id": "ev_a1b2c3d4", "type": "career_shift",        "causedBy": null }
    ],
    "Year 15": [
      { "actor": "Kael", "text": "Slew the bandit lord Mira.", "id": "ev_9e8d7c6b", "type": "assassination", "causedBy": null }
    ]
  }
}
```

Each timeline entry is an object with `actor` (entity name), `text` (event text without the year prefix), `id` (event ID or `null` for legacy rows), `type`, and `causedBy`.

---

### `GET /api/chunk/:x/:y/lineage`

Family-tree data for all Factions that have formed at this coordinate. Includes alive **and** dead NPCs — dead NPCs retain their `ancestralMemories`, enabling full chain traversal.

**Response:**
```json
{
  "coordinate": "world_X2_Y3",
  "factions": [
    {
      "id":           "faction_abc123",
      "name":         "House Blackthorn",
      "type":         "blood_feud",
      "targetLineage":"npc_rival_id",
      "foundedYear":  200,
      "rootAncestor": { "npcId": "npc_original", "npcName": "Eredin Blackthorn", "year": 100 },
      "members": [
        {
          "npcId":       "npc_003",
          "npcName":     "Serath Blackthorn",
          "currentRole": "Guard",
          "status":      "Alive",
          "inheritanceChain": [
            { "npcId": "npc_original", "npcName": "Eredin Blackthorn", "year": 100, "status": "Dead" },
            { "npcId": "npc_002",      "npcName": "Mira Blackthorn",   "year": 150, "status": "Dead" },
            { "npcId": "npc_003",      "npcName": "Serath Blackthorn", "year": 195, "status": "Alive" }
          ]
        }
      ]
    }
  ]
}
```

**Fields:**

| Field | Type | Description |
|---|---|---|
| `id` | string | Faction entity ID |
| `name` | string | Deterministic faction name (generated from faction seed) |
| `type` | string | One of: `blood_feud`, `ancestral_ally`, `ancestral_debt`, `ancestral_shame`, `ancestral_reverence`, `ancestral_mourning` |
| `targetLineage` | string | ID of the NPC, item, or entity this faction is bound to |
| `foundedYear` | number | In-world year the faction coalesced |
| `rootAncestor` | object | `{ npcId, npcName, year }` — the NPC whose original memory started the lineage |
| `members[].inheritanceChain` | object[] | Ordered list from root ancestor to current member. Reconstructed by walking `inheritedFrom` pointers across alive and dead NPCs — never stored redundantly. |
| `members[].status` | string | `"Alive"` or `"Dead"` — lets frontends distinguish living vs. historical members |

**`inheritanceChain` reconstruction:** the engine walks each member's `inheritedFrom` pointer backward through ECS entities (alive and dead) until the root is reached. The chain is computed at request time; it is not stored in the raw data.

**Faction types and their origin:**

| `type` | Source memory | Spawn condition |
|---|---|---|
| `blood_feud` | `hate` (intensity ≥ 7) | 3+ NPCs, 50+ years |
| `ancestral_ally` | `love` (intensity ≥ 7) | 3+ NPCs, 50+ years |
| `ancestral_debt` | `debt` (intensity ≥ 7) | 3+ NPCs, 100+ years |
| `ancestral_shame` | `shame` (intensity ≥ 7) | 3+ NPCs, 100+ years |
| `ancestral_reverence` | `reverence` (intensity ≥ 7) | 3+ NPCs, 100+ years |
| `ancestral_mourning` | `grief` (intensity ≥ 7) | 3+ NPCs, 100+ years |

---

### `GET /api/journal`

The Traveler's personal action log. Returns all journal entries matching the supplied filters, in ascending year order.

**Query parameters (all optional):**

| Param | Type | Description |
|---|---|---|
| `coordinate` | string | Filter to one settlement — e.g. `world_X2_Y3` |
| `npcId` | string | Filter to all entries that reference a specific NPC |
| `itemId` | string | Filter to all entries that involve a specific item |
| `fromYear` | number | Lower bound (inclusive) on the entry year |
| `toYear` | number | Upper bound (inclusive) on the entry year |
| `limit` | number | Max entries returned (default 100, max 500) |

**Response:**
```json
{
  "entries": [
    {
      "id":             17,
      "year":           142,
      "action":         "assassinate",
      "coordinate":     "world_X2_Y3",
      "settlementName": "Ironkeep",
      "npcId":          "npc_a1b2c3d4e5f6",
      "npcName":        "Maren Ashford",
      "itemId":         null,
      "summary":        "Assassinated Maren Ashford (Guard) in Ironkeep",
      "detail": { "settlementName": "Ironkeep", "npcName": "Maren Ashford", "xpGained": 75 }
    }
  ],
  "total": 84
}
```

`total` reflects the unfiltered count matching the query — it is unaffected by `limit`, so you can page through results.

`settlementName` and `npcName` are surfaced from the `detail` JSON blob for convenience. The full `detail` object is also returned for action-specific structured fields (e.g. `xpGained`, `goldFound`, `qty`, `price`).

**`action` values written by the engine:**

| Value | Trigger |
|---|---|
| `visit` | `GET /api/chunk/:x/:y` — written after every successful chunk load |
| `steal` | `POST /api/action/steal` (success only) |
| `assassinate` | `POST /api/action/assassinate` (success only) |
| `turnin` | `POST /api/action/turnin` — both item-delivery and bounty-report paths |
| `trade` | `POST /api/trade` — both buy and sell |
| `loot_tomb` | `POST /api/action/loot_tomb` — ruin path and dead-NPC path |
| `claim` | `POST /api/action/claim` (success only) |
| `tax` | `POST /api/action/tax` (success only) |
| `decree` | `POST /api/action/decree` (success only) |
| `banish` | `POST /api/action/banish` (success only) |
| `abdicate` | `POST /api/action/abdicate` (both leaderless and successor paths) |
| `regicide` | `POST /api/action/regicide` (success only) |
| `advance_time` | `POST /api/action/advance_time` — written before simulation runs |
| `gift` | `POST /api/gift` — reserved for item 17 (Artifact Seeding) |
| `talk` | `POST /api/action/talk` — reserved for item 21 (Conversation Engine) |
| `bury_capsule` | Time Capsule burial — reserved for a future item |

**Error codes:**

| Status | `code` | Reason |
|---|---|---|
| `500` | `JOURNAL_ERROR` | Unexpected server error during journal query |

---

### `GET /api/map/:x/:y` or `GET /api/map/:x/:y/:radius`

Lightweight fog-of-war mini-map. No ECS, no simulation — reads deltas only.  
`radius` must be 1–5 (default `1`). A radius of `1` returns a 3×3 grid.

**Response:**
```json
{
  "center": {
    "x": 0, "y": 0,
    "biome":           "Forest",
    "hasTown":         true,
    "townName":        "Deephollow",
    "ruler":           "Kael the Brave",
    "tier":            1,
    "settlementType":  "Town",
    "territoryRadius": 1,
    "isDiscovered":    false,
    "claimedBy":       null,
    "claimedByName":   null,
    "districtType":    null,
    "tileDescription": {
      "terrain":              "dense woodland",
      "vegetation":           "pine thicket",
      "settlementSilhouette": "village"
    }
  },
  "grid": [
    {
      "x": -1, "y": -1,
      "biome":           "Mountain",
      "hasTown":         true,
      "townName":        "Ironpeak",
      "ruler":           "Unknown",
      "tier":            1,
      "settlementType":  "Town",
      "territoryRadius": 1,
      "isDiscovered":    false,
      "claimedBy":       null,
      "claimedByName":   null,
      "districtType":    null,
      "tileDescription": {
        "terrain":              "jagged peaks",
        "vegetation":           "sparse scrub",
        "settlementSilhouette": "village"
      }
    },
    {
      "x": 1, "y": 0,
      "biome":           "Forest",
      "hasTown":         true,
      "townName":        "Ashford",
      "ruler":           "Mira Goldhand",
      "tier":            2,
      "settlementType":  "SmallCity",
      "territoryRadius": 2,
      "isDiscovered":    true,
      "claimedBy":       "world_X2_Y0",
      "claimedByName":   "Stonekeep",
      "districtType":    "Market",
      "tileDescription": {
        "terrain":              "dense woodland",
        "vegetation":           "pine thicket",
        "settlementSilhouette": "walled town"
      }
    }
  ],
  "radius":   1,
  "gridSize": 3
}
```

`settlementType` values: `"Town"`, `"SmallCity"`, `"FullCity"`, `"Magistrate"`, `"Kingdom"`, `"Unknown"`

**Territory ownership fields:**

| Field | Type | Description |
|-------|------|-------------|
| `claimedBy` | `string \| null` | Coordinate key of the controlling settlement (e.g. `"world_X2_Y0"`). `null` for sovereign tiles (no external claimant). Use non-null values as the group key to cluster tiles visually. |
| `claimedByName` | `string \| null` | Display name of the controlling settlement. `null` for sovereign tiles. |
| `districtType` | `string \| null` | District flavour for claimed tiles: `"Market"`, `"Slums"`, `"Keep"`, `"Barracks"`, `"Temple"`. `null` for sovereign tiles. Deterministic from the tile's coordinate seed. |

A tile is controlled by the highest-tier settlement whose territory reaches it. Claim radii by tier:

| Tier | Type | Claim radius (Chebyshev) |
|------|------|--------------------------|
| 1 | Town | 0 — self only |
| 2 | SmallCity | ±1 tile (3×3) |
| 3 | FullCity | ±1 tile (3×3) |
| 4 | Magistrate | ±2 tiles (5×5) |
| 5 | Kingdom | ±3 tiles (7×7) |

When two settlements of equal tier both reach a tile, the closer one wins; equal distance is broken by lower x then lower y. Ownership is computed only within the tiles returned by the response — request a radius up to 3 tiles larger than you intend to render to ensure off-screen kingdoms are included in the calculation.

**`tileDescription` on map tiles** — every tile in the grid (and `center`) includes a lightweight description object. Computed purely from the coordinate seed and tier — no ECS instantiation, no simulation.

| Field | Type | Discrete values |
|-------|------|----------------|
| `terrain` | string | `rolling hills` (Plains/Wilderness), `dense woodland` (Forest), `jagged peaks` (Mountain), `open desert` (Desert), `murky wetlands` (Marsh) |
| `vegetation` | string | `lush meadow` (Plains/Wilderness), `pine thicket` (Forest), `sparse scrub` (Mountain), `cacti and dust` (Desert), `reed beds` (Marsh) |
| `settlementSilhouette` | string | `village` (tier 1), `walled town` (tier 2), `small city` (tier 3), `fortified city` (tier 4), `capital citadel` (tier 5) |

---

## Action Endpoints

All action endpoints share a common request envelope and response pattern.

**Common Request Fields:**
```json
{
  "x":           0,
  "y":           0,
  "target":      "npc-id-or-name",
  "item":        "item-id",
  "itemId":      "item-id",
  "newRole":     "RoleName",
  "playerState": { ... }
}
```

`item` and `itemId` are interchangeable. Only supply the fields each action requires (see below).

**Success Response (all actions):**
```json
{
  "message":     "Human-readable outcome string",
  "playerState": { "...updated playerState..." },
  "chunkData":   { "...same shape as GET /api/chunk..." }
}
```

**Failure Response (all actions) — HTTP 400:**
```json
{
  "error":       "Human-readable error string",
  "playerState": { "...unchanged playerState..." }
}
```

---

### `POST /api/action/steal`

Steal an item from a living NPC.

**Required fields:** `x`, `y`, `target`, `item`/`itemId`, `playerState`

**Mechanics:**
- `FailChance = Math.max(0.10, 0.60 - stealth × 0.05)`
- Success: item moves to `playerState.inventory`, +25 XP. At 5 steals, title `"Master Thief"` added to `playerState.titles["Global"]`
- Failure: −10 reputation; if player has items, one is confiscated by the NPC

---

### `POST /api/action/assassinate`

Kill a living NPC permanently.

**Required fields:** `x`, `y`, `target`, `playerState`

**Mechanics:**
- `SuccessChance = 0.40 + strength×0.05 + stealth×0.05`; Guards −0.30, Mayors −0.40, Puppet admins −0.20
- Success: NPC status → `"Dead"`, +75 XP
- If target was Mayor at a **sovereign town** and `playerState.reputation >= 20`: player becomes Mayor (`playerState.titles[townName] = "Mayor"`), +50 reputation
- If target was Mayor at a **sovereign town** and reputation < 20: `ruler` set to `"None"`, −40 reputation
- If target was Mayor or `"Puppet"` at a **District**: player does NOT become mayor; parent city's rule continues
- Failure: −30 reputation

> **Puppet NPCs**: When a town is subjugated (not annexed), the original Mayor NPC survives with `currentRole: "Puppet"`. Killing a Puppet yields +75 XP but never transfers the throne — the parent city will install a replacement. Puppet NPCs appear in the `population` array with `currentRole: "Puppet"`.

---

### `POST /api/action/claim`

Claim the empty throne of a leaderless town.

**Required fields:** `x`, `y`, `playerState` *(no `target` needed)*

**Preconditions:** No living Mayor NPC exists; `playerState.reputation >= 20`

**Mechanics:**
- Success: `playerState.titles[townName] = "Mayor"`, +30 reputation
- Failure conditions return HTTP 400

---

### `POST /api/action/turnin`

Deliver an item to an NPC (Fetch quest) **or** report a completed bounty.

**Required fields:** `x`, `y`, `target`, `playerState`  
**Optional:** `item`/`itemId` — include to deliver an item; omit to report a bounty

**Fetch quest mechanics (+50 XP, +20 reputation):**
- `itemId` (or auto-detected from `playerState.inventory`) must match the `itemType` on the NPC's `"Fetch"` quest
- Item type must match the NPC's Fetch quest `itemType` if they have one
- Removes the `"Fetch"` quest from the NPC's `quests` array in the response
- Quest will not regenerate on future chunk loads (Scholar's inventory is now non-empty)
- 75% chance to convert a `Citizen` questGiver → `Scholar` when item type is `Tome`
- Giving a `Weapon` to a non-Mayor NPC → NPC role becomes `"Hero"`
- Giving `Jewelry` → NPC role becomes `"Cultist"`

**Mystery Heist mechanics (+50 XP, +20 reputation):**
- `itemId` must match the `itemId` on the NPC's `"Mystery Heist"` quest
- Clears the questGiver's `"hates"` memory for the enemy to `"satisfied"` (persisted as a delta)
- Removes the `"Mystery Heist"` quest from the NPC's `quests` array — it will not regenerate on future chunk loads

**Bounty report mechanics (+100 XP, +30 reputation):**
- NPC must have a `"hates"` memory for a now-dead NPC
- Clears that memory to `"avenged"` (persisted as a delta)
- Removes the `"Bounty"` quest from the NPC's `quests` array in the response
- At 3 bounties, title `"Master Assassin"` added to `playerState.titles["Global"]`

---

### `POST /api/action/tax` *(Mayor only)*

Seize one item from every living NPC that has one.

**Required fields:** `x`, `y`, `playerState`

**Mechanics:** All seized items appended to `playerState.inventory`; each taxed NPC gains `memories["The Player"] = "hates"`; reputation −10 per item taken

---

### `POST /api/action/decree` *(Mayor only)*

Change a living NPC's role by mayoral decree.

**Required fields:** `x`, `y`, `target`, `newRole`, `playerState`

**Valid roles:** Guard, Mayor, Puppet, Hero, Scholar, Merchant, Blacksmith, Bandit, Cultist, Beggar, Citizen

---

### `POST /api/action/banish` *(Mayor only)*

Exile a living NPC to a random coordinate.

**Required fields:** `x`, `y`, `target`, `playerState`

**Mechanics:** NPC status → `"Exiled"`; the NPC remains in the population array with `status: "Exiled"` on all future responses at the origin coordinate (same behaviour as `"Dead"`). NPC data is also injected as an immigrant at a random destination coordinate; −15 reputation. The response message includes the destination coordinates.

---

### `POST /api/action/abdicate` *(Mayor only)*

Step down as Mayor.

**Required fields:** `x`, `y`, `playerState` *(no `target` needed)*

**Mechanics:** Removes `playerState.titles[townName]`; a random living NPC is elected as new Mayor; +25 reputation if a successor is found

---

### `POST /api/action/regicide`

Attempt to assassinate the ruling Mayor of a Kingdom-tier settlement and seize the throne.

**Required fields:** `x`, `y`, `playerState`

**Preconditions:** A living Mayor NPC must exist at the coordinate. The coordinate must not be a District.

**Mechanics:**
- `FailChance = 0.95 - (stealth × 0.01) - (strength × 0.01) - (weaponTier × 0.05)`
- Success: Mayor status → `"Dead"`, player gains the `"King"` title (`playerState.titles[townName] = "King"`), +5000 XP; town history event `type: "regicide"` written
- The `"King"` title is recognized by all Mayor-only actions (tax, banish, abdicate, decree) — the player has full ruler powers after a successful regicide
- Failure: −50 reputation; town history event `type: "chaos"` written

---

### `POST /api/action/loot_tomb`

Loot a dead NPC's inventory, or plunder a Ruin tile for gold and artifacts.

**Required fields:** `x`, `y`, `playerState`  
**Optional:** `target` — dead NPC ID (required when looting an NPC; omit when looting a Ruin tile)

**Mechanics:**

*Ruin tile (coordinate tier 0):*
- Always yields `Math.floor(rng() * 10 + 1) × 100` gold added to `playerState.gold`
- 10% chance to recover an artifact from the Ruin Hoard (if a `ruin_hoard` delta exists for this coordinate)
- Returns `{ success: true, message: "..." }` — no reputation change

*Dead NPC (coordinate tier > 0):*
- `target` must be a dead NPC ID
- All items from NPC inventory moved to `playerState.inventory`; NPC inventory cleared; −5 reputation

---

### `POST /api/action/advance_time`

Advance the global year counter and return the chunk reloaded at the new year.

**Request:**
```json
{
  "x":     0,
  "y":     0,
  "years": 5
}
```

*(No `playerState` required)*

**Response:**
```json
{
  "message":   "⏳ Universal Time moved forward to Year 56.",
  "chunkData": { "...same shape as GET /api/chunk..." }
}
```

---

### `POST /api/trade`

Buy from or sell to a Merchant NPC.

**Request:**
```json
{
  "x": 0,
  "y": 0,
  "npcId": "<merchant-npc-id>",
  "playerState": { "gold": 500, "inventory": [] },
  "transaction": {
    "type": "buy",
    "itemId": "<item-id>",
    "quantity": 2
  }
}
```

`transaction.type` must be `"buy"` or `"sell"`.

**Response (`200 OK`):**
```json
{
  "playerState": { "gold": 300, "inventory": [...] },
  "npcInventory": [
    { "itemId": "...", "name": "Grain", "tier": 1, "quantity": 3, "price": 100, "type": "resource" }
  ],
  "event": null
}
```

When a significant event is triggered, `event` is a non-null object:

```json
{
  "type": "MARKET_DEPLETION",
  "description": "The Grain market has been depleted. Expect shortages during the next time-skip."
}
```

| `event.type` | Condition | Effect |
|---|---|---|
| `MARKET_DEPLETION` | Player purchases > 80% of Merchant's `primaryExport` stock | `shortage: true` delta written; next `advance_time` gives 60% chance of tier-drop or export pivot |
| `MERCHANT_ASCENDANCY` | Player sells a Relic (age > 300yr) that pushes Merchant's `personalWealth` above 15 000g | `plutocracy_candidate` delta written; next `advance_time` installs the Merchant as ruler |

**Error codes:**

| Status | `code` | Reason |
|---|---|---|
| `400` | `INVALID_REQUEST` | Missing `npcId`, `playerState`, or `transaction` |
| `400` | — | NPC is not a Merchant, item unavailable, or insufficient gold |
| `404` | — | NPC not found in the chunk |
| `500` | `TRADE_ERROR` | Unexpected server error |

---

## XP & Leveling

| Action | XP |
|---|---|
| Steal (success) | +25 |
| Assassinate (success) | +75 |
| Turn in quest — item delivery | +50 |
| Report bounty | +100 |
| Regicide (success) | +5000 |

Level-up threshold: `level × 100 XP`. Each level-up grants +1 Stealth and +1 Strength.

---

## Biome & Demographics

Each coordinate has a deterministic biome that shapes NPC role distribution:

| Biome | Primary Roles | Political Stance |
|-------|---------------|-----------------|
| **Mountain** | 40% Guard, 30% Blacksmith, 10% Bandit, 10% Merchant, 10% Citizen | Militaristic |
| **Forest** | 40% Scholar, 30% Merchant, 10% Guard, 10% Cultist, 10% Citizen | Knowledge |
| **Desert** | 40% Bandit, 30% Merchant, 10% Guard, 10% Beggar, 10% Citizen | Opportunist |
| **Marsh** | 50% Cultist, 20% Beggar, 10% Bandit, 10% Scholar, 10% Citizen | Occult |
| **Plains** | 60% Citizen, 10% Guard, 10% Merchant, 10% Scholar, 10% Bandit | Balanced |

---

## Artifact Types

| Type | Typical Source | Notable Effects |
|------|---------------|-----------------|
| **Tome** | Scholar | 75% chance to convert Citizens → Scholars |
| **Jewelry** | Bandit / Merchant | +20% diplomatic bonus; giving to NPC converts them to Cultist |
| **Weapon** | Blacksmith | Giving to NPC elevates them to Hero role |
| **Relic** | Cultist | 50% mass conversion OR forced migration |

---

## Settlement Tiers

| Tier | Name | Territory | Population |
|------|------|-----------|------------|
| 1 | Town | 1×1 | 5–20 |
| 2 | SmallCity | 2×2 | 20–50 |
| 3 | FullCity | 3×3 | 50–100 |
| 4 | Magistrate | 5×5 | 100–200 |
| 5 | Kingdom | 7×7 | 200+ |

---

## Error Handling

All errors return `HTTP 400` with `{ "error": "string" }`. Messages are human-readable; there are no machine error codes.  
Mini-map input validation errors (`HTTP 400`) and server errors (`HTTP 500`) include a `"details"` field with additional context.
