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

    return { id, name, type, description, content };
}

module.exports = { generateArtifact };