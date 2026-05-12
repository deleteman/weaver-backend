# NPC Appearance API Reference

Every NPC in a `/api/chunk` response carries a structured `appearance` object. All fields are discrete named strings drawn from fixed lists — use them to drive portrait rendering, filters, and tooltips without parsing prose.

All values are **100% deterministic** from the NPC's `id` and current `age`. The same NPC always looks the same at the same age. Three independent sub-seeds (`<id>_appearance`, `<id>_clothing`, `<id>_marks`) isolate trait groups so extending one group in future never shifts the values of another.

---

## Object shape

```json
{
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
}
```

---

## Fields

### `eyeColor` — string

Uniform distribution across all values.

| Value |
|-------|
| `brown` |
| `blue` |
| `green` |
| `grey` |
| `hazel` |
| `amber` |
| `black` |
| `pale grey` |
| `violet` |

---

### `skinTone` — string

Distribution is **biome-weighted**. The table shows approximate probability per biome.

| Value | Mountain | Forest | Desert | Marsh | Plains |
|-------|----------|--------|--------|-------|--------|
| `pale` | 25% | 15% | 3% | 10% | 14% |
| `fair` | 30% | 20% | 7% | 10% | 20% |
| `tan` | 20% | 25% | 25% | 15% | 20% |
| `olive` | 10% | 20% | 25% | 25% | 18% |
| `brown` | 10% | 12% | 25% | 20% | 16% |
| `dark brown` | 3% | 5% | 10% | 12% | 8% |
| `ebony` | 2% | 3% | 5% | 8% | 4% |

---

### `height` — string

Age-driven overrides take priority over the seeded base value.

| Value | Condition |
|-------|-----------|
| `very short` | age < 10 |
| `short` | age 10–15 |
| `average` | adult, seeded |
| `tall` | adult, seeded |

---

### `build` — string

Age-driven overrides take priority over the seeded base value.

| Value | Condition |
|-------|-----------|
| `slight` | age < 16 |
| `lean` | adult, seeded |
| `average` | adult, seeded |
| `stocky` | adult, seeded |
| `muscular` | adult, seeded |
| `heavyset` | adult, seeded |
| `frail` | age > 70 |

---

### `baldness` — boolean

Seeded per NPC. ~30% of NPCs are bald. When `true`, `hair.length` transitions by age (see below).

---

### `hair.color` — string

Age overrides take priority over the seeded base color.

| Value | Condition |
|-------|-----------|
| `black` | seeded base |
| `dark brown` | seeded base |
| `brown` | seeded base |
| `auburn` | seeded base |
| `chestnut` | seeded base |
| `blond` | seeded base |
| `platinum` | seeded base |
| `red` | seeded base |
| `streaked grey` | age ≥ 45 |
| `grey` | age ≥ 60 |
| `white` | age ≥ 75 |

---

### `hair.length` — string

Age and baldness overrides take priority over the seeded base length.

| Value | Condition |
|-------|-----------|
| `bald` | `baldness: true` and age ≥ 55 |
| `thinning` | `baldness: true` and age ≥ 40 |
| `cropped` | age < 16 |
| `short` | adult, seeded |
| `shoulder-length` | adult, seeded |
| `long` | adult, seeded |

---

### `hair.style` — string

Uniform distribution. Applied regardless of baldness (use `hair.length` to decide whether to render it).

| Value |
|-------|
| `straight` |
| `wavy` |
| `curly` |
| `braided` |
| `tied back` |
| `shaved sides` |

---

### `facialHair` — string

Always `"none"` for age < 16. Otherwise seeded from the fixed list below.

| Value |
|-------|
| `none` |
| `stubble` |
| `goatee` |
| `thin mustache` |
| `short beard` |
| `full beard` |
| `braided beard` |

---

### `clothing` — object

All five slots are seeded from the NPC's role. Role maps to a clothing tier, and each tier draws from its own pool.

**Role → clothing tier mapping:**

| Role | Tier |
|------|------|
| Mayor, Scholar | `noble` |
| Guard | `military` |
| Cultist | `clergy` |
| Blacksmith, Merchant, Citizen, Child | `common` |
| Bandit, Beggar, Exile | `outcast` |

**`clothing.head`:**

| Value | Tiers available |
|-------|----------------|
| `none` | noble, military, clergy, common, outcast |
| `wool cap` | clergy, common, outcast |
| `leather hood` | military, common |
| `iron helm` | military |
| `wide-brim hat` | noble |
| `crown` | noble |
| `veil` | noble, clergy |

**`clothing.torso`:**

| Value | Tiers available |
|-------|----------------|
| `linen shirt` | clergy, common |
| `wool tunic` | clergy, common |
| `leather vest` | common, outcast |
| `padded gambeson` | military, common |
| `chainmail hauberk` | military |
| `plate breastplate` | noble, military |
| `silk robe` | noble, clergy |
| `merchant coat` | noble |
| `tattered rags` | outcast |

**`clothing.legs`:**

| Value | Tiers available |
|-------|----------------|
| `wool breeches` | noble, clergy, common |
| `leather trousers` | military, common |
| `linen skirt` | noble, clergy, common |
| `chainmail chausses` | military |
| `plate greaves` | military |
| `torn rags` | outcast |

**`clothing.feet`:**

| Value | Tiers available |
|-------|----------------|
| `bare` | outcast |
| `sandals` | clergy, common, outcast |
| `leather shoes` | noble, common |
| `worn boots` | military, common, outcast |
| `riding boots` | noble, military |
| `iron-capped boots` | military |

**`clothing.accessory`:**

| Value | Tiers available |
|-------|----------------|
| `none` | noble, clergy, common, outcast |
| `rope belt` | clergy, common, outcast |
| `leather belt` | military, common |
| `fur-lined cloak` | noble |
| `travel cloak` | military, common |
| `silk sash` | noble, clergy |
| `bandolier` | military |

---

### `scars` — array of `{ location, type }`

Rare. ~15% of NPCs have one scar; ~5% have two.

**`location` values:**

| Value |
|-------|
| `left cheek` |
| `right cheek` |
| `forehead` |
| `chin` |
| `neck` |
| `left hand` |
| `right hand` |
| `left forearm` |
| `right forearm` |
| `lip` |

**`type` values:**

| Value |
|-------|
| `slash` |
| `burn` |
| `bite` |
| `pockmark` |
| `brand` |

---

### `tattoos` — array of `{ location, motif }`

Rare. ~12% of NPCs have one tattoo; ~4% have two.

**`location` values:**

| Value |
|-------|
| `right forearm` |
| `left forearm` |
| `neck` |
| `chest` |
| `back` |
| `right hand` |
| `left hand` |
| `right shoulder` |
| `left shoulder` |
| `face` |

**`motif` values:**

| Value |
|-------|
| `serpent` |
| `rune` |
| `star` |
| `skull` |
| `rose` |
| `wolf` |
| `anchor` |
| `sun` |
| `crossed swords` |
| `eye` |

---

### `marks` — array of `{ location, type }`

Rare. ~10% of NPCs have one mark; ~3% have two.

**`location` values:**

| Value |
|-------|
| `neck` |
| `cheek` |
| `forehead` |
| `left hand` |
| `right hand` |
| `collarbone` |

**`type` values:**

| Value |
|-------|
| `birthmark` |
| `brand` |
| `mole` |
| `ritual scar` |

---

## Rendering notes

- Check `hair.length` before rendering hair — values `bald` and `thinning` indicate little to no hair.
- `facialHair: "none"` is the majority case; only render facial hair for other values.
- `scars`, `tattoos`, and `marks` may be empty arrays — always check `.length` before iterating.
- `clothing.accessory: "none"` and `clothing.head: "none"` are valid values meaning no item in that slot.
- Age-dependent fields (`hair.color`, `hair.length`, `height`, `build`) update automatically as `globalYear` advances. No client-side age calculation is needed — the server always returns values appropriate for the NPC's current age.
