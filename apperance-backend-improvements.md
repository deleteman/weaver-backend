# Backend Appearance Fields — Proposed Additions

These fields would unlock visual detail in the NPC pixel portrait renderer that **cannot** be
derived from existing data. All should be seeded deterministically from the NPC ID (same pattern
as existing appearance fields), so portraits are stable across reloads.

All fields are optional — the frontend will fall back to current neutral defaults when absent.

---

## New fields for `NpcAppearance`

### `faceShape: 'oval' | 'square' | 'round' | 'angular' | 'heart'`

Gives every NPC a distinct facial silhouette — the single highest-ROI addition.

| Value | Effect | Suggested bias |
|-------|--------|----------------|
| `oval` | Current default — gentle jaw taper | Fallback for all |
| `square` | Jaw maintained at full head width, temple-to-jaw flat | Northern biomes, male-weighted |
| `round` | Maximum width throughout, full cheeks, no taper | Children, heavyset builds |
| `angular` | Narrow jaw, prominent cheekbones (sharp side shadows) | Lean/frail builds, elderly |
| `heart` | Wide forehead, narrow pointed chin, slight widow's-peak hairline | Female-weighted |

**Seed key suggestion:** `npcId + '_face'`
**Biome correlation:** northern/mountain → square/angular; southern/coastal → round/oval
**Age correlation:** children → round; elderly → angular
**Role correlation:** none required (variety within roles is desirable)

---

### `eyeShape: 'almond' | 'round' | 'narrow' | 'upturned'`

Every NPC currently shares the same 4×3 eye block. This is the most visually prominent
repetition after face shape.

| Value | Eye block | Detail |
|-------|-----------|--------|
| `almond` | 4×2 | Outer corner 1px raised vs inner (angled sclera column) |
| `round` | 4×3 | Wider sclera exposure, full 3-row height (current default) |
| `narrow` | 4×2 | Heavy shadow overhang, hooded appearance |
| `upturned` | 4×2 | Outer corner 1px higher than inner (fox-eye shape) |

**Seed key suggestion:** `npcId + '_eyes'`
**Sex correlation:** female → almond/upturned weighted; male → round/narrow weighted
**Role correlation:** Cultist → upturned; Scholar → round

---

### `complexion: 'smooth' | 'freckled' | 'weathered' | 'ruddy' | 'sallow'`

Skin texture overlays — impossible to derive from any existing field.

| Value | Visual effect |
|-------|--------------|
| `smooth` | Current default — no overlay |
| `freckled` | 10–14 semi-transparent dot pixels on nose bridge + cheeks (seeded positions) |
| `weathered` | Fine pixel lines at outer eye corners and forehead furrow |
| `ruddy` | Stronger cheek blush, warmer skin overall |
| `sallow` | Yellow-green tint overlay — unhealthy pallor |

**Seed key suggestion:** `npcId + '_complexion'`
**Age correlation:** 50+ → weathered weighted; children → smooth
**Role correlation:** Beggar/Exile → sallow; outdoor roles (Guard, Blacksmith) → ruddy
**Biome correlation:** cold/mountain → ruddy; indoor/city → sallow

---

### `expressionBias: 'neutral' | 'stern' | 'weary' | 'cheerful' | 'suspicious'`

A static default expression that varies per NPC even within the same role. Guards can be
tired instead of stern; Scholars can be wary instead of curious.

| Value | Brow change | Mouth change | Eye change |
|-------|-------------|--------------|------------|
| `neutral` | Current default | No change | No change |
| `stern` | Inner corners furrowed | Corners slightly down | No change |
| `weary` | Outer brow edge droops | Corners down | Dark circles under eyes |
| `cheerful` | Slight raise on outer brow | Corners slightly up | No change |
| `suspicious` | Asymmetric (one brow higher) | No change | Slight squint one side |

**Seed key suggestion:** `npcId + '_expr'`
**Role correlation (probabilistic, not deterministic):**
- Guard: 60% stern / 30% weary / 10% neutral
- Scholar: 50% cheerful / 30% suspicious / 20% neutral
- Cultist: 50% stern / 30% suspicious / 20% weary
- Merchant: 60% cheerful / 30% neutral / 10% suspicious
- Beggar/Exile: 60% weary / 30% neutral / 10% stern

---

### `noseShape: 'button' | 'straight' | 'broad' | 'hooked'`

All noses currently have the same 4-row bridge+tip structure.

| Value | Visual change |
|-------|--------------|
| `button` | Collapsed 1-row bridge, small 2px-wide tip |
| `straight` | Current default — 2-row bridge, standard tip |
| `broad` | Nostril pixels wider (+1px each side), wider tip block |
| `hooked` | Bridge highlight offset (suggests curve), tip slightly lower |

**Seed key suggestion:** `npcId + '_nose'`
**Sex correlation:** male → broad/hooked weighted; female → button/straight weighted
**Build correlation:** heavyset/stocky → broad; lean/frail → straight/button

---

## Summary table

| Field | Values | Seed key | Backend complexity |
|-------|--------|----------|--------------------|
| `faceShape` | 5 options | `npcId + '_face'` | Low — weighted random per biome/age |
| `eyeShape` | 4 options | `npcId + '_eyes'` | Low — weighted random per sex/role |
| `complexion` | 5 options | `npcId + '_complexion'` | Low — weighted random per age/role |
| `expressionBias` | 5 options | `npcId + '_expr'` | Low — weighted random per role |
| `noseShape` | 4 options | `npcId + '_nose'` | Low — weighted random per sex/build |

All five fields are **string enums only** — no structural changes to the appearance object,
no new nested objects, no arrays. Each can be added independently.

**Recommended implementation order:** `faceShape` → `expressionBias` → `complexion` → `eyeShape` → `noseShape`
(ordered by visual impact / ROI)

---

## TypeScript interface additions (frontend ready)

These optional fields are already guarded in the renderer — portraits degrade gracefully to
current defaults when absent:

```typescript
// Additions to NpcAppearance in src/store/useWorldStore.ts
faceShape?:      'oval' | 'square' | 'round' | 'angular' | 'heart';
eyeShape?:       'almond' | 'round' | 'narrow' | 'upturned';
complexion?:     'smooth' | 'freckled' | 'weathered' | 'ruddy' | 'sallow';
expressionBias?: 'neutral' | 'stern' | 'weary' | 'cheerful' | 'suspicious';
noseShape?:      'button' | 'straight' | 'broad' | 'hooked';
```
