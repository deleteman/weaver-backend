// src/artifact-effects.js
const { log } = require('./logger');
const { generateMerchantInventory } = require('./items');
const { makeEvent } = require('./event-utils');

const ARTIFACT_MERCHANT_WEALTH_MIN = 500;
const ARTIFACT_MERCHANT_WEALTH_RANGE = 2501;

/**
 * Apply artifact effects when an NPC obtains or uses an artifact
 * Artifacts should have lasting effects on NPCs and the town
 */

class ArtifactEffects {
    static applyTomeEffect(world, x, y, artifact, targetNpc, rng) {
        // Tomes: 75% chance to convert Citizens to Scholars
        if (targetNpc.currentRole === "Citizen" && rng() < 0.75) {
            const oldRole = targetNpc.currentRole;
            targetNpc.currentRole = "Scholar";
            log('artifact-effect:tome-conversion', { npcId: targetNpc.identity.id, oldRole, newRole: 'Scholar' });
            return true;
        }
        return false;
    }

    static applyJewelryEffect(world, x, y, artifact, targetNpc, rng) {
        // Jewelry: +20% diplomatic modifier, can corrupt roles
        targetNpc.artifactBonus = (targetNpc.artifactBonus || 0) + 0.20;

        // Small chance to corrupt role
        if (rng() < 0.3) {
            const potentialRoles = ["Guard", "Cultist", "Bandit", "Merchant"];
            const newRole = potentialRoles[Math.floor(rng() * potentialRoles.length)];
            const oldRole = targetNpc.currentRole;
            targetNpc.currentRole = newRole;
            log('artifact-effect:jewelry-corruption', { npcId: targetNpc.identity.id, oldRole, newRole });

            if (newRole === 'Merchant') {
                const townEntity = world.with('identity').where(e => e.identity.type === 'Town' || e.identity.type === 'District').first;
                targetNpc.merchantInventory = generateMerchantInventory(rng, townEntity?.primaryExport || 'Grain', 0, `world_X${x}_Y${y}`);
                targetNpc.personalWealth = Math.floor(rng() * ARTIFACT_MERCHANT_WEALTH_RANGE) + ARTIFACT_MERCHANT_WEALTH_MIN;
            }
        }

        log('artifact-effect:jewelry-bonus', { npcId: targetNpc.identity.id, bonusApplied: 0.20 });
    }

    static applyWeaponEffect(world, x, y, artifact, targetNpc, rng) {
        // Weapons: Elevate lower-class NPCs to Guards or Heroes
        if (['Citizen', 'Beggar', 'Merchant'].includes(targetNpc.currentRole)) {
            const newRole = rng() < 0.5 ? 'Guard' : 'Hero';
            const oldRole = targetNpc.currentRole;

            if (oldRole === 'Merchant') {
                const allNpcs = [...world.with('currentRole')];
                const otherMerchants = allNpcs.filter(n => n !== targetNpc && n.currentRole === 'Merchant');
                for (const slot of (targetNpc.merchantInventory || [])) {
                    if (otherMerchants.length > 0) {
                        const recipient = otherMerchants[Math.floor(rng() * otherMerchants.length)];
                        recipient.merchantInventory = recipient.merchantInventory || [];
                        const existing = recipient.merchantInventory.find(s => s.itemId === slot.itemId);
                        if (existing) existing.quantity += slot.quantity;
                        else recipient.merchantInventory.push({ ...slot });
                    }
                }
                targetNpc.merchantInventory = [];
            }

            targetNpc.currentRole = newRole;
            targetNpc.weaponBonus = (targetNpc.weaponBonus || 0) + 5;
            log('artifact-effect:weapon-elevation', { npcId: targetNpc.identity.id, oldRole, newRole });
            return true;
        }

        // For Guards/Heroes, just add combat bonus
        if (['Guard', 'Hero', 'Blacksmith'].includes(targetNpc.currentRole)) {
            targetNpc.weaponBonus = (targetNpc.weaponBonus || 0) + 5;
            log('artifact-effect:weapon-bonus', { npcId: targetNpc.identity.id, bonusApplied: 5 });
            return true;
        }
        return false;
    }

    static applyRelicEffect(world, x, y, artifact, targetNpc, npcs, rng, currentYear) {
        // Relics: Paradigm shift - convert 50% of town to Cultists or force migration
        if (rng() < 0.5) {
            // Mass conversion to Cultists
            let converted = 0;
            for (const npc of npcs) {
                if (npc.currentRole !== 'Cultist' && rng() < 0.5) {
                    npc.currentRole = 'Cultist';
                    npc.history.events.push(makeEvent(`[Year ${currentYear}] Was touched by the power of the ${artifact.name} and converted to Cultism.`, 'career_shift'));
                    converted++;
                }
            }
            log('artifact-effect:relic-conversion', { coordinate: `${x},${y}`, converted });
            targetNpc.history.events.push(makeEvent(`[Year ${currentYear}] The ${artifact.name} transformed the entire town's spiritual alignment.`, 'legacy'));
        } else {
            // Force migration
            log('artifact-effect:relic-migration', { coordinate: `${x},${y}`, artifact: artifact.name });
            targetNpc.history.events.push(makeEvent(`[Year ${currentYear}] The ${artifact.name} triggered a mass exodus from the town.`, 'migration'));
        }
    }

    /**
     * Calculate combat bonuses from artifacts
     */
    static calculateCombatBonus(npc) {
        let bonus = 0;
        if (npc.weaponBonus) bonus += npc.weaponBonus;
        if (npc.currentRole === 'Guard' || npc.currentRole === 'Hero') {
            bonus += npc.inventory?.items?.filter(i => i.type === 'Weapon').length * 5 || 0;
        }
        return bonus;
    }
}

module.exports = { ArtifactEffects };
