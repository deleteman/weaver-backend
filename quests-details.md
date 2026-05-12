# Quest System — Detailed Specification

## Quest Format

Quests live on NPCs. They are serialized directly from `npc.quests.offeredQuests` array and returned as the `quests` field on each NPC object inside `population[]` of the chunk response (`index.js:400`).

```
GET /api/chunk/:x/:y
  └── population[]
        └── npc.quests[]  ← array of quest objects
```

---

## Quest Types

There are **3 quest types**, all generated in `src/quests.js`.

---

### 1. `Bounty`

Triggered when an NPC `hates` another NPC and that enemy is **alive but has no items** (or RNG < 0.5).

```json
{
  "type": "Bounty",
  "title": "Eliminate Sly Rook",
  "description": "My blood feud with Sly Rook must end. Deal with them.",
  "target": "enemy-npc-uuid"
}
```

| Field | Type | Notes |
|---|---|---|
| `type` | `"Bounty"` | |
| `title` | string | `"Eliminate {enemy.name}"` |
| `description` | string | Prose using the enemy's name |
| `target` | string | **Enemy's deterministic NPC UUID** — the NPC to kill |

**How to complete:** Kill the target NPC, then call `POST /api/action/turnin` against the quest-giver (no `item` needed). Requires the quest-giver to have `memories[enemyId] === "hates"` and the enemy to be `Dead`. Rewards **+100 XP, +30 reputation**. The memory flips to `"avenged"`. At 3 bounties, grants global title `"Master Assassin"`.

---

### 2. `Mystery Heist`

Triggered when an NPC `hates` another NPC and that enemy is **alive with items** (and RNG > 0.5).

```json
{
  "type": "Mystery Heist",
  "title": "Find Golden Locket",
  "description": "A vile thief took Golden Locket from my family. Find who has it and bring it to me.",
  "target": "thief-npc-uuid",
  "itemId": "item-uuid-of-the-specific-item"
}
```

| Field | Type | Notes |
|---|---|---|
| `type` | `"Mystery Heist"` | |
| `title` | string | `"Find {item.name}"` |
| `description` | string | Prose using the item name |
| `target` | string | **Thief NPC's UUID** — the NPC holding the item |
| `itemId` | string | **Specific item's UUID** to steal and return |

**How to complete:** Steal the specific item from the target NPC using `POST /api/action/steal`, then call `POST /api/action/turnin` against the quest-giver with the `item`/`itemId` field set to that item's UUID. Rewards **+50 XP, +20 reputation**.

---

### 3. `Fetch`

Triggered for **Scholar** NPCs that have an empty inventory.

```json
{
  "type": "Fetch",
  "title": "Find any Tome",
  "description": "My research has stalled. I need any kind of Tome. I don't care who you have to steal it from to get it.",
  "target": "scholar-npc-uuid",
  "itemType": "Tome"
}
```

| Field | Type | Notes |
|---|---|---|
| `type` | `"Fetch"` | |
| `title` | string | `"Find any {itemType}"` |
| `description` | string | Prose flavor |
| `target` | string | **The Scholar's own NPC UUID** — deliver the item to them |
| `itemType` | string | The artifact category required — currently always `"Tome"` |

**How to complete:** Acquire any `Tome`-type artifact (e.g. via `loot_tomb` or `steal`), then call `POST /api/action/turnin` against the Scholar with the item. The item's `type` must match `itemType`. Rewards **+50 XP, +20 reputation**.

---

## Key Behavioral Notes

- **An NPC can have multiple quests simultaneously** — e.g. a Scholar who also hates someone could have both a `Fetch` and a `Bounty` quest in their array.
- **Dead NPCs never get quests** — `generateQuests` only processes `status === "Alive"` NPCs (`quests.js:8`).
- **Quest generation is deterministic** — seeded with `{coordinate}_quests` so the same chunk always produces the same quests at the same `globalYear`.
- **`target` is always an NPC UUID**, never a name. For `Bounty`/`Mystery Heist` it points to the enemy; for `Fetch` it points to the quest-giver themselves (where you deliver).
- **`itemId` vs `itemType`**: `Mystery Heist` gives you a specific `itemId` to fetch; `Fetch` gives you a generic `itemType` — any matching item will satisfy it.
