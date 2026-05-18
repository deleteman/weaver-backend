// src/items.js
const crypto = require('crypto');
const { log } = require('./logger');

function pick(rng, array) {
    return array[Math.floor(rng() * array.length)];
}

function generateArtifact(rng, coordinate, year, finderName) {
    const types = ["Tome", "Jewelry", "Weapon", "Relic"];
    const type = pick(rng, types);

    const materials = ["Obsidian", "Crimson", "Bone", "Void", "Iron", "Ethereal", "Astral"];
    const nouns = {
        "Tome": ["Grimoire", "Manifesto", "Scroll", "Chronicle", "Codex"],
        "Jewelry": ["Band", "Signet", "Amulet", "Pendant", "Ring"],
        "Weapon": ["Blade", "Dagger", "Mace", "Halberd", "Cleaver"],
        "Relic": ["Idol", "Chalice", "Lantern", "Crown", "Urn"]
    };

    const titleStr = pick(rng, nouns[type]);
    const matStr = pick(rng, materials);
    const name = `The ${matStr} ${titleStr}`;

    // Deterministic ID for the item!
    const id = crypto.createHash('md5').update(`${coordinate}_${name}_${year}_${finderName}`).digest('hex').substring(0, 12);
    log('generateArtifact', { coordinate, year, finderName, type, id });

    let description = "";
    let content = null;

    if (type === "Tome") {
        description = "An ancient, dust-covered text bound in strange, cold leather.";
        const subjects = ["the anatomy of shadows", "forgotten blood magic", "the true names of stars", "the lineage of the First Mayor", "a recipe for immortal soup"];
        const secrets = ["Do not trust the guards.", "The eclipse is a lie.", "Blood is the only currency.", "I hear the dirt breathing."];
        content = `The pages detail ${pick(rng, subjects)}. Scrawled frantically in the margins is a handwritten note: "${pick(rng, secrets)}"`;
    } 
    else if (type === "Jewelry") {
        const vibes = ["pulsing with a faint, sickly light", "freezing cold to the touch", "whispering faintly when held near the ear", "heavy with ancient malice"];
        description = `A piece of adornment that is ${pick(rng, vibes)}.`;
    } 
    else if (type === "Weapon") {
        const origins = ["forged in the heart of a dying star", "pulled from the chest of a tyrant", "crafted by a mad blacksmith"];
        description = `A brutal instrument of war, ${pick(rng, origins)}. It feels perfectly balanced, yet deeply unsettling.`;
    } 
    else if (type === "Relic") {
        const effects = ["makes your eyes water", "tastes like ash in the back of your throat", "causes shadows to bend towards it", "smells of ozone and dried blood"];
        description = `A bizarre artifact from a bygone era. Just looking at it ${pick(rng, effects)}.`;
    }

    const baseValueRanges = { Tome: [150, 600], Jewelry: [200, 700], Weapon: [100, 500], Relic: [250, 800] };
    const [min, max] = baseValueRanges[type];
    const baseValue = Math.floor(rng() * (max - min + 1)) + min;

    return {
        id, name, type, description, content,
        creationYear: year,
        originSettlement: coordinate,
        historicalSignificance: [],
        baseValue,
        value: baseValue
    };
}

function calculateItemValue(item, globalYear) {
    const age = globalYear - item.creationYear;
    const result = { ...item };
    if (age > 300) {
        result.prefix = 'Relic';
        result.value = item.baseValue * Math.pow(1.015, age - 300);
    } else if (age > 100) {
        result.prefix = 'Ancient';
        result.value = item.baseValue * 2;
    }
    return result;
}

/**
 * Generates a deterministic trade inventory for a Merchant NPC.
 * 4–8 units of the settlement's primaryExport resource plus 1–2 random artifacts.
 * @param {Function} rng - Seeded RNG
 * @param {string} primaryExport - Settlement's primary export commodity
 * @param {number} globalYear - Current world year (used for artifact age)
 * @param {string} coordinate - Tile coordinate key
 * @returns {Array<{itemId, name, tier, quantity, price, type}>}
 */
function generateMerchantInventory(rng, primaryExport, globalYear, coordinate) {
    const items = [];
    const itemCount = Math.floor(rng() * 5) + 4; // 4–8 export slots

    for (let i = 0; i < itemCount; i++) {
        const basePrice = Math.floor(rng() * 151) + 50; // 50–200g
        items.push({
            itemId: `trade_${coordinate}_${primaryExport}_${i}`,
            name: primaryExport,
            tier: 1,
            quantity: Math.floor(rng() * 5) + 1, // 1–5 units
            price: basePrice,
            type: 'resource'
        });
    }

    // 1–2 random artifacts
    const extraCount = Math.floor(rng() * 2) + 1;
    for (let i = 0; i < extraCount; i++) {
        const artifact = generateArtifact(rng, coordinate, globalYear, `merchant_${i}`);
        const valued = calculateItemValue(artifact, globalYear);
        items.push({
            itemId: valued.id,
            name: valued.name,
            tier: 1,
            quantity: 1,
            price: Math.floor(valued.value * 1.2), // 20% markup
            type: valued.type,
            creationYear: valued.creationYear,
            prefix: valued.prefix
        });
    }

    return items;
}

module.exports = { generateArtifact, calculateItemValue, generateMerchantInventory };