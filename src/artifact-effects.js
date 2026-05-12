// src/artifact-effects.js
const { log } = require('./logger');

/**
 * Apply artifact effects when an NPC obtains or uses an artifact
 * Artifacts should have lasting effects on NPCs and the town
 */

class ArtifactEffects {
    static applyTomeEffect(world, x, y, artifact, targetNpc) {
        // Tomes: 75% chance to convert Citizens to Scholars
        if (targetNpc.currentRole === "Citizen" && Math.random() < 0.75) {
            const oldRole = targetNpc.currentRole;
            targetNpc.currentRole = "Scholar";
            targetNpc.history.events.push(`Studied the ${artifact.name} and became enlightened, transforming into a Scholar.`);
            log('artifact-effect:tome-conversion', { npcId: targetNpc.identity.id, oldRole, newRole: 'Scholar' });
            return true;
        }
        return false;
    }

    static applyJewelryEffect(world, x, y, artifact, targetNpc, rng) {
        // Jewelry: +20% diplomatic modifier, can corrupt roles
        targetNpc.artifactBonus = (targetNpc.artifactBonus || 0) + 0.20;
        
        // Small chance to corrupt role
        if (rng && rng() < 0.3) {
            const potentialRoles = ["Guard", "Cultist", "Bandit", "Merchant"];
            const newRole = potentialRoles[Math.floor(Math.random() * potentialRoles.length)];
            const oldRole = targetNpc.currentRole;
            targetNpc.currentRole = newRole;
            targetNpc.history.events.push(`The ${artifact.name} corrupted their mind, transforming them into a ${newRole}.`);
            log('artifact-effect:jewelry-corruption', { npcId: targetNpc.identity.id, oldRole, newRole });
        }
        
        log('artifact-effect:jewelry-bonus', { npcId: targetNpc.identity.id, bonusApplied: 0.20 });
    }

    static applyWeaponEffect(world, x, y, artifact, targetNpc) {
        // Weapons: Elevate lower-class NPCs to Guards or Heroes
        if (['Citizen', 'Beggar', 'Merchant'].includes(targetNpc.currentRole)) {
            const newRole = Math.random() < 0.5 ? 'Guard' : 'Hero';
            const oldRole = targetNpc.currentRole;
            targetNpc.currentRole = newRole;
            targetNpc.weaponBonus = (targetNpc.weaponBonus || 0) + 5;
            targetNpc.history.events.push(`Wielded the ${artifact.name} and rose to power as a ${newRole}.`);
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

    static applyRelicEffect(world, x, y, artifact, targetNpc, npcs) {
        // Relics: Paradigm shift - convert 50% of town to Cultists or force migration
        const roll = Math.random();
        
        if (roll < 0.5) {
            // Mass conversion to Cultists
            let converted = 0;
            for (const npc of npcs) {
                if (npc.currentRole !== 'Cultist' && Math.random() < 0.5) {
                    npc.currentRole = 'Cultist';
                    npc.history.events.push(`Was touched by the power of the ${artifact.name} and converted to Cultism.`);
                    converted++;
                }
            }
            log('artifact-effect:relic-conversion', { coordinate: `${x},${y}`, converted });
            targetNpc.history.events.push(`The ${artifact.name} transformed the entire town's spiritual alignment.`);
        } else {
            // Force migration
            log('artifact-effect:relic-migration', { coordinate: `${x},${y}`, artifact: artifact.name });
            targetNpc.history.events.push(`The ${artifact.name} triggered a mass exodus from the town.`);
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
