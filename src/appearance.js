// src/appearance.js
const seedrandom = require('seedrandom');

// ── Discrete trait lists ──────────────────────────────────────────────────────

const EYE_COLORS = ['brown', 'blue', 'green', 'grey', 'hazel', 'amber', 'black', 'pale grey', 'violet'];

const SKIN_TONES = ['pale', 'fair', 'tan', 'olive', 'brown', 'dark brown', 'ebony'];

// Per-biome weights aligned to SKIN_TONES index order
const BIOME_SKIN_WEIGHTS = {
    Mountain: [0.25, 0.30, 0.20, 0.10, 0.10, 0.03, 0.02],
    Forest:   [0.15, 0.20, 0.25, 0.20, 0.12, 0.05, 0.03],
    Desert:   [0.03, 0.07, 0.25, 0.25, 0.25, 0.10, 0.05],
    Marsh:    [0.10, 0.10, 0.15, 0.25, 0.20, 0.12, 0.08],
    Plains:   [0.14, 0.20, 0.20, 0.18, 0.16, 0.08, 0.04],
};

// Age-transitioned colors excluded from base pool (assigned by age override instead)
const BASE_HAIR_COLORS = ['black', 'dark brown', 'brown', 'auburn', 'chestnut', 'blond', 'platinum', 'red'];
const HAIR_COLORS = [...BASE_HAIR_COLORS, 'streaked grey', 'grey', 'white'];

const BASE_HAIR_LENGTHS = ['cropped', 'short', 'shoulder-length', 'long'];
const HAIR_LENGTHS = ['bald', 'thinning', ...BASE_HAIR_LENGTHS];

const HAIR_STYLES = ['straight', 'wavy', 'curly', 'braided', 'tied back', 'shaved sides'];

const FACIAL_HAIR = ['none', 'stubble', 'goatee', 'thin mustache', 'short beard', 'full beard', 'braided beard'];

const HEIGHTS = ['very short', 'short', 'average', 'tall'];
const ADULT_HEIGHTS = ['average', 'tall'];

// 'frail' and 'slight' are age-driven; excluded from base seeded pool
const BASE_BUILDS = ['lean', 'average', 'stocky', 'muscular', 'heavyset'];
const BUILDS = ['slight', ...BASE_BUILDS, 'frail'];

// ── Clothing ──────────────────────────────────────────────────────────────────

const ROLE_CLOTHING_TIER = {
    Mayor:      'noble',
    Scholar:    'noble',
    Guard:      'military',
    Bandit:     'outcast',
    Beggar:     'outcast',
    Exile:      'outcast',
    Cultist:    'clergy',
    Blacksmith: 'common',
    Merchant:   'common',
    Citizen:    'common',
    Child:      'common',
};

const CLOTHING = {
    noble: {
        head:      ['none', 'wide-brim hat', 'crown', 'veil'],
        torso:     ['silk robe', 'merchant coat', 'plate breastplate'],
        legs:      ['wool breeches', 'linen skirt', 'chainmail chausses'],
        feet:      ['leather shoes', 'riding boots'],
        accessory: ['silk sash', 'fur-lined cloak', 'leather belt'],
    },
    military: {
        head:      ['iron helm', 'leather hood', 'none'],
        torso:     ['chainmail hauberk', 'padded gambeson', 'plate breastplate'],
        legs:      ['chainmail chausses', 'plate greaves', 'leather trousers'],
        feet:      ['iron-capped boots', 'riding boots', 'worn boots'],
        accessory: ['bandolier', 'leather belt', 'travel cloak'],
    },
    clergy: {
        head:      ['veil', 'wool cap', 'none'],
        torso:     ['silk robe', 'linen shirt', 'wool tunic'],
        legs:      ['linen skirt', 'wool breeches'],
        feet:      ['sandals', 'leather shoes'],
        accessory: ['rope belt', 'silk sash', 'none'],
    },
    common: {
        head:      ['none', 'wool cap', 'leather hood'],
        torso:     ['linen shirt', 'wool tunic', 'leather vest', 'padded gambeson'],
        legs:      ['wool breeches', 'leather trousers', 'linen skirt'],
        feet:      ['worn boots', 'leather shoes', 'sandals'],
        accessory: ['rope belt', 'leather belt', 'travel cloak', 'none'],
    },
    outcast: {
        head:      ['none', 'wool cap'],
        torso:     ['tattered rags', 'linen shirt', 'leather vest'],
        legs:      ['torn rags', 'wool breeches'],
        feet:      ['bare', 'sandals', 'worn boots'],
        accessory: ['none', 'rope belt'],
    },
};

// ── Mark lists ────────────────────────────────────────────────────────────────

const SCAR_LOCATIONS = ['left cheek', 'right cheek', 'forehead', 'chin', 'neck', 'left hand', 'right hand', 'left forearm', 'right forearm', 'lip'];
const SCAR_TYPES     = ['slash', 'burn', 'bite', 'pockmark', 'brand'];

const TATTOO_LOCATIONS = ['right forearm', 'left forearm', 'neck', 'chest', 'back', 'right hand', 'left hand', 'right shoulder', 'left shoulder', 'face'];
const TATTOO_MOTIFS    = ['serpent', 'rune', 'star', 'skull', 'rose', 'wolf', 'anchor', 'sun', 'crossed swords', 'eye'];

const MARK_LOCATIONS = ['neck', 'cheek', 'forehead', 'left hand', 'right hand', 'collarbone'];
const MARK_TYPES     = ['birthmark', 'brand', 'mole', 'ritual scar'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function pick(rng, list) {
    return list[Math.floor(rng() * list.length)];
}

function pickWeighted(rng, list, weights) {
    const roll = rng();
    let cum = 0;
    for (let i = 0; i < list.length; i++) {
        cum += weights[i];
        if (roll < cum) return list[i];
    }
    return list[list.length - 1];
}

// Rolls for 0, 1, or 2 rare entries. typeKey is the property name ('type' or 'motif').
function rollRare(rng, typeKey, locationList, valueList, singleChance = 0.15, doubleChance = 0.05) {
    const roll = rng();
    if (roll < doubleChance) {
        return [
            { location: pick(rng, locationList), [typeKey]: pick(rng, valueList) },
            { location: pick(rng, locationList), [typeKey]: pick(rng, valueList) },
        ];
    }
    if (roll < singleChance) {
        return [{ location: pick(rng, locationList), [typeKey]: pick(rng, valueList) }];
    }
    return [];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate a structured NPC appearance object.
 *
 * Three independent sub-RNGs are created from npcId so that extending one
 * trait group (e.g. clothing) never shifts the random sequence for another
 * (e.g. marks), preserving existing NPC appearances across future additions.
 *
 * @param {string} npcId   — deterministic NPC identifier
 * @param {number} age     — current age (drives hair, build, height overrides)
 * @param {string} role    — NPC role (drives clothing tier)
 * @param {string} biome   — biome type (drives skin tone distribution)
 * @param {string} status  — NPC status ('Alive' | 'Dead')
 * @param {string} [sex]   — NPC sex ('male' | 'female' | 'other'); affects facial hair and build
 * @returns {object}
 */
function generateAppearance(npcId, age, role, biome, status, sex = 'other') {
    const baseRng  = seedrandom(npcId + '_appearance');
    const clothRng = seedrandom(npcId + '_clothing');
    const markRng  = seedrandom(npcId + '_marks');

    // ── Stable base traits (from baseRng) ─────────────────────────────────────

    const eyeColor = pick(baseRng, EYE_COLORS);

    const skinWeights = BIOME_SKIN_WEIGHTS[biome] || BIOME_SKIN_WEIGHTS.Plains;
    const skinTone = pickWeighted(baseRng, SKIN_TONES, skinWeights);

    const baseHairColor  = pick(baseRng, BASE_HAIR_COLORS);
    const baseHairLength = pick(baseRng, BASE_HAIR_LENGTHS);
    const hairStyle      = pick(baseRng, HAIR_STYLES);

    // ~30% of NPCs are seeded bald; progression applied below by age
    const isBald = baseRng() < 0.30;

    const baseFacialHair = pick(baseRng, FACIAL_HAIR);
    const baseAdultHeight = pick(baseRng, ADULT_HEIGHTS);
    const baseBuild      = pick(baseRng, BASE_BUILDS);

    // ── Age-driven overrides ──────────────────────────────────────────────────

    let hairColor = baseHairColor;
    if (age >= 75)      hairColor = 'white';
    else if (age >= 60) hairColor = 'grey';
    else if (age >= 45) hairColor = 'streaked grey';

    let hairLength = baseHairLength;
    if (age < 16) {
        hairLength = 'cropped';
    } else if (isBald) {
        if (age >= 55)      hairLength = 'bald';
        else if (age >= 40) hairLength = 'thinning';
    }

    let build = baseBuild;
    if (age > 70)      build = 'frail';
    else if (age < 16) build = 'slight';

    const canHaveFacialHair = sex === 'male' || sex === 'other';
    const facialHair = (age < 16 || !canHaveFacialHair) ? 'none' : baseFacialHair;

    let height = baseAdultHeight;
    if (age < 10)      height = 'very short';
    else if (age < 16) height = 'short';

    // ── Clothing (role tier, independent seed) ────────────────────────────────

    const tier = ROLE_CLOTHING_TIER[role] || 'common';
    const tierClothing = CLOTHING[tier];
    const clothing = {
        head:      pick(clothRng, tierClothing.head),
        torso:     pick(clothRng, tierClothing.torso),
        legs:      pick(clothRng, tierClothing.legs),
        feet:      pick(clothRng, tierClothing.feet),
        accessory: pick(clothRng, tierClothing.accessory),
    };

    // ── Rare marks (independent seed so clothing changes never shift these) ───

    const scars   = rollRare(markRng, 'type',  SCAR_LOCATIONS,   SCAR_TYPES,    0.15, 0.05);
    const tattoos = rollRare(markRng, 'motif', TATTOO_LOCATIONS, TATTOO_MOTIFS, 0.12, 0.04);
    const marks   = rollRare(markRng, 'type',  MARK_LOCATIONS,   MARK_TYPES,    0.10, 0.03);

    return {
        dead: status === 'Dead',
        eyeColor,
        skinTone,
        height,
        build,
        baldness: isBald,
        hair: {
            color:  hairColor,
            length: hairLength,
            style:  hairStyle,
        },
        facialHair,
        clothing,
        scars,
        tattoos,
        marks,
    };
}

module.exports = {
    generateAppearance,
    // Exported for use in tests
    EYE_COLORS,
    SKIN_TONES,
    HAIR_COLORS,
    HAIR_LENGTHS,
    HAIR_STYLES,
    FACIAL_HAIR,
    HEIGHTS,
    BUILDS,
};
