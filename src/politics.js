// src/politics.js
const { log } = require('./logger');
const { saveDelta, getDeltas } = require('./db');

/**
 * Macro-political engine for wars, alliances, and territory claiming
 * Tracks settlement tiers and territorial expansion
 */

const SETTLEMENT_TIERS = {
    Town: 1,           // 1x1
    SmallCity: 2,      // 2x2
    FullCity: 3,       // 3x3
    Magistrate: 4,     // 5x5
    Kingdom: 5         // 7x7
};

class PoliticalEngine {
    /**
     * Claim adjacent tiles when a settlement expands
     * Writes a "Claimed_By" delta to the target coordinate
     */
    static claimTile(x, y, claimingCityCoordinate) {
        const tileCoordinate = `world_X${x}_Y${y}`;
        saveDelta("GLOBAL", tileCoordinate, "Claimed_By", claimingCityCoordinate);
        log('political:tile-claimed', { tile: tileCoordinate, claimedBy: claimingCityCoordinate });
    }

    /**
     * Get all claimed tiles for a city
     */
    static getClaimedTiles(cityCoordinate) {
        const globalDeltas = getDeltas("GLOBAL");
        return globalDeltas
            .filter(d => d.state_key === "Claimed_By" && d.state_value === cityCoordinate)
            .map(d => d.entity_name);
    }

    /**
     * Calculate the offensive power of an invading settlement
     */
    static calculateOffenseScore(invader) {
        let score = 0;
        
        // Guards and Heroes contribute to military might
        const guardCount = invader.npcsByRole?.Guard || 0;
        const heroCount = invader.npcsByRole?.Hero || 0;
        const weaponCount = invader.weapons || 0;
        
        score += guardCount * 2;
        score += heroCount * 5;
        score += weaponCount * 5;
        
        // Suzerain support (if vassal)
        if (invader.suzerain) {
            score += (invader.suzerainGuards || 0) * 0.5;
        }
        
        return score;
    }

    /**
     * Calculate the defensive power of a target settlement
     */
    static calculateDefenseScore(target) {
        let score = 0;
        
        const guardCount = target.npcsByRole?.Guard || 0;
        const heroCount = target.npcsByRole?.Hero || 0;
        const weaponCount = target.weapons || 0;
        
        score += guardCount * 2;
        score += heroCount * 5;
        score += weaponCount * 5;
        
        // Ally support
        if (target.allies && target.allies.length > 0) {
            score += (target.alliedGuards || 0) * 0.5;
        }
        
        return score;
    }

    /**
     * Resolve conflict between two settlements
     * Returns outcome: 'crushing-victory', 'subjugation', or 'defeat'
     */
    static resolveConflict(invader, target) {
        const offenseScore = this.calculateOffenseScore(invader);
        const defenseScore = this.calculateDefenseScore(target);
        const margin = offenseScore - defenseScore;
        
        let outcome;
        let compensation = {};
        
        if (margin > 10) {
            // Crushing victory
            outcome = 'crushing-victory';
            compensation = {
                loserMayorKilled: true,
                inventoryTransferRatio: 0.5,
                vassalState: 'Annexed'
            };
        } else if (margin > 0) {
            // Subjugation
            outcome = 'subjugation';
            compensation = {
                loserMayorKilled: false,
                loserMayorState: 'Puppet',
                taxPerDecade: 1,
                vassalState: 'Colony'
            };
        } else {
            // Defeat
            outcome = 'defeat';
            compensation = {
                invaderCasualties: Math.floor((invader.npcsByRole?.Guard || 0) * 0.5),
                casualtyState: 'Dead'
            };
        }
        
        log('political:conflict-resolved', {
            offenseScore,
            defenseScore,
            margin,
            outcome,
            compensation
        });
        
        return {
            outcome,
            margin,
            ...compensation
        };
    }

    /**
     * Get the expansion range based on settlement tier
     */
    static getExpansionRange(tier) {
        const tierSize = {
            1: 1, // Town: 1x1
            2: 2, // SmallCity: 2x2
            3: 3, // FullCity: 3x3
            4: 5, // Magistrate: 5x5
            5: 7  // Kingdom: 7x7
        };
        return tierSize[tier] || 1;
    }

    /**
     * Check if a settlement can expand to the next tier
     */
    static canPromote(settlement) {
        const nextTier = settlement.tier + 1;
        
        // Need population and resources to expand
        const minPopulation = nextTier * 10;
        const hasEnoughPopulation = settlement.population >= minPopulation;
        
        return hasEnoughPopulation && nextTier <= 5;
    }

    /**
     * Promote a settlement to the next tier
     */
    static promoteSettlement(settlement) {
        if (this.canPromote(settlement)) {
            settlement.tier += 1;
            settlement.requiresExpansion = true;
            log('political:settlement-promoted', { 
                settlement: settlement.name,
                newTier: settlement.tier,
                tierName: Object.entries(SETTLEMENT_TIERS).find(([_, v]) => v === settlement.tier)?.[0]
            });
            return true;
        }
        return false;
    }
}

module.exports = { PoliticalEngine, SETTLEMENT_TIERS };
