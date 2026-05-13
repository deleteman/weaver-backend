// src/biomes.js
const seedrandom = require('seedrandom');
const { log } = require('./logger');

const BIOME_TYPES = {
    Mountain: 'Mountain',
    Forest: 'Forest',
    Desert: 'Desert',
    Marsh: 'Marsh',
    Plains: 'Plains'
};

const BIOME_DEMOGRAPHICS = {
    Mountain: {
        Guard: 0.40,
        Blacksmith: 0.30,
        Bandit: 0.10,
        Merchant: 0.10,
        Citizen: 0.10,
        politicalStance: 'Militaristic & Industrial'
    },
    Forest: {
        Scholar: 0.40,
        Merchant: 0.30,
        Guard: 0.10,
        Cultist: 0.10,
        Citizen: 0.10,
        politicalStance: 'Knowledge & Trade'
    },
    Desert: {
        Bandit: 0.40,
        Merchant: 0.30,
        Guard: 0.10,
        Beggar: 0.10,
        Citizen: 0.10,
        politicalStance: 'Scarcity & Opportunism'
    },
    Marsh: {
        Cultist: 0.50,
        Beggar: 0.20,
        Bandit: 0.10,
        Scholar: 0.10,
        Citizen: 0.10,
        politicalStance: 'Occult & Isolationist'
    },
    Plains: {
        Citizen: 0.60,
        Guard: 0.10,
        Merchant: 0.10,
        Scholar: 0.10,
        Bandit: 0.10,
        politicalStance: 'Balanced'
    }
};

/**
 * Deterministically generates a biome for a given coordinate
 */
function determineBiome(x, y) {
    const seed = `biome_X${x}_Y${y}`;
    const rng = seedrandom(seed);
    const biomeValues = Object.keys(BIOME_TYPES);
    return BIOME_TYPES[biomeValues[Math.floor(rng() * biomeValues.length)]];
}

/**
 * Get the demographic weightings for a biome
 */
function getBiomeDemographics(biome) {
    return BIOME_DEMOGRAPHICS[biome] || BIOME_DEMOGRAPHICS.Plains;
}

/**
 * Assign a role to an NPC based on biome demographics
 */
function assignRoleByBiome(rng, biome) {
    const demographics = getBiomeDemographics(biome);
    const roll = rng();
    let cumulativeProbability = 0;

    for (const [role, weight] of Object.entries(demographics)) {
        if (role === 'politicalStance') continue;
        cumulativeProbability += weight;
        if (roll < cumulativeProbability) {
            return role;
        }
    }
    return 'Citizen';
}

/**
 * Determine political stance based on demographic composition
 */
function determinePoliticalStance(demographics) {
    // Check which demographics exceed 50% threshold
    const aggressiveWeight = (demographics.Guard || 0) + (demographics.Bandit || 0);
    const federationWeight = (demographics.Scholar || 0) + (demographics.Merchant || 0);
    const occultWeight = demographics.Cultist || 0;

    if (aggressiveWeight > 0.5) return 'Aggressive';
    if (federationWeight > 0.5) return 'Federation';
    if (occultWeight > 0.5) return 'Occult';
    return 'Balanced';
}

/**
 * Count demographics in a population
 */
function countDemographics(npcs) {
    const counts = {};
    const total = npcs.length || 1;

    for (const npc of npcs) {
        const role = npc.currentRole || 'Citizen';
        counts[role] = (counts[role] || 0) + 1;
    }

    const demographics = {};
    for (const [role, count] of Object.entries(counts)) {
        demographics[role] = count / total;
    }

    return demographics;
}

const BIOME_PRIMARY_EXPORT = {
    Mountain:   ['Iron', 'Stone'],
    Forest:     ['Timber', 'Game'],
    Desert:     ['Spice', 'Glass'],
    Marsh:      ['Peat', 'Alchemical Herbs'],
    Plains:     ['Grain', 'Livestock'],
    Wilderness: ['Furs', 'Exotic Foraged Goods']
};

module.exports = {
    BIOME_TYPES,
    BIOME_DEMOGRAPHICS,
    BIOME_PRIMARY_EXPORT,
    determineBiome,
    getBiomeDemographics,
    assignRoleByBiome,
    determinePoliticalStance,
    countDemographics
};
