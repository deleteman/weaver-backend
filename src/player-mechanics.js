// src/player-mechanics.js
const { log } = require('./logger');

/**
 * Player action resolution checks
 * All success/failure is deterministic based on playerState stats and target difficulty
 */

class PlayerMechanics {
    /**
     * Resolve a steal action
     * FailChance = Math.max(0.10, 0.60 - (playerState.stats.stealth * 0.05))
     */
    static resolveSteal(playerState, targetDifficulty = 1) {
        playerState = this.ensurePlayerState(playerState);
        const baseFailChance = 0.60 - (playerState.stats.stealth * 0.05);
        const failChance = Math.max(0.10, baseFailChance);
        const roll = Math.random();
        const success = roll > failChance;
        
        log('action-resolution:steal', { 
            failChance, 
            roll, 
            success,
            stealth: playerState.stats.stealth 
        });
        
        return { success, failChance };
    }

    /**
     * Resolve an assassination action
     * FailChance = Math.max(0.10, 0.80 - (playerState.stats.stealth * 0.05) - (playerState.stats.strength * 0.05))
     * Equipped weapons grant +0.10 to success (i.e., -0.10 to failChance)
     */
    static resolveAssassinate(playerState, hasWeapon = false) {
        playerState = this.ensurePlayerState(playerState);
        let baseFailChance = 0.80 - (playerState.stats.stealth * 0.05) - (playerState.stats.strength * 0.05);
        
        if (hasWeapon) {
            baseFailChance -= 0.10;
        }
        
        const failChance = Math.max(0.10, baseFailChance);
        const roll = Math.random();
        const success = roll > failChance;
        
        log('action-resolution:assassinate', {
            failChance,
            roll,
            success,
            stealth: playerState.stats.stealth,
            strength: playerState.stats.strength,
            hasWeapon
        });
        
        return { success, failChance };
    }

    /**
     * Resolve regicide (kingdom takeover)
     * Base FailChance is locked at 0.95
     * Requires massive stat stacking and high-tier weapons
     */
    static resolveRegicide(playerState, weaponTier = 0) {
        playerState = this.ensurePlayerState(playerState);
        let failChance = 0.95;
        
        // Each point in stealth/strength reduces fail chance by 1%
        failChance -= (playerState.stats.stealth * 0.01);
        failChance -= (playerState.stats.strength * 0.01);
        
        // High-tier weapons provide bonus
        failChance -= (weaponTier * 0.05);
        
        failChance = Math.max(0.05, failChance); // Min 5% chance of success
        
        const roll = Math.random();
        const success = roll > failChance;
        
        log('action-resolution:regicide', {
            failChance,
            roll,
            success,
            stealth: playerState.stats.stealth,
            strength: playerState.stats.strength,
            weaponTier
        });
        
        return { success, failChance };
    }

    /**
     * Resolve diplomatic actions (ally, trade)
     * Base success chance with artifact bonus modifier
     */
    static resolveDiplomacy(playerState, baseChance = 0.5, artifactBonus = 0) {
        const roll = Math.random();
        const modifiedChance = Math.min(0.95, baseChance + artifactBonus);
        const success = roll < modifiedChance;
        
        log('action-resolution:diplomacy', {
            baseChance,
            artifactBonus,
            modifiedChance,
            roll,
            success
        });
        
        return { success, actualChance: modifiedChance };
    }

    /**
     * Calculate reputation changes
     * Colony reputation changes propagate 50% to suzerain
     */
    static calculateReputationDelta(action, baseAmount, isColony = false, isFailed = false) {
        let delta = baseAmount;
        
        if (isFailed) {
            // Failures have higher reputation penalties
            delta = -Math.abs(baseAmount) * 2;
        }
        
        // Colony effects
        if (isColony) {
            return {
                local: delta,
                suzerain: Math.floor(delta * 0.5)
            };
        }
        
        return { local: delta };
    }

    /**
     * Ensure playerState has proper structure
     */
    static ensurePlayerState(playerState = {}) {
        if (!playerState.stats) playerState.stats = {};
        if (playerState.stats.stealth === undefined) playerState.stats.stealth = 5;
        if (playerState.stats.strength === undefined) playerState.stats.strength = 5;
        if (!playerState.level) playerState.level = 1;
        if (!playerState.xp) playerState.xp = 0;
        if (!playerState.reputation) playerState.reputation = {};
        if (!playerState.titles) playerState.titles = {};
        return playerState;
    }
}

module.exports = { PlayerMechanics };
