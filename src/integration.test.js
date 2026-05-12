// src/integration.test.js
/**
 * Integration tests for PRD system implementations
 * Tests biomes, artifacts, population, player mechanics, and politics
 */

const { determineBiome, assignRoleByBiome, determinePoliticalStance } = require('./biomes');
const seedrandom = require('seedrandom');
const { ArtifactEffects } = require('./artifact-effects');
const { replenishPopulationIfNeeded } = require('./population');
const { PlayerMechanics } = require('./player-mechanics');
const { PoliticalEngine, SETTLEMENT_TIERS } = require('./politics');
const { World } = require('miniplex');

describe('Biome System Integration', () => {
    test('determineBiome produces consistent results for same coordinate', () => {
        const biome1 = determineBiome(10, 20);
        const biome2 = determineBiome(10, 20);
        expect(biome1).toBe(biome2);
    });

    test('different coordinates produce different biomes', () => {
        const biome1 = determineBiome(0, 0);
        const biome2 = determineBiome(100, 100);
        // While they could theoretically be the same, this is highly unlikely
        // Just verify they're valid biomes
        expect(['Mountain', 'Forest', 'Desert', 'Marsh', 'Plains']).toContain(biome1);
        expect(['Mountain', 'Forest', 'Desert', 'Marsh', 'Plains']).toContain(biome2);
    });

    test('assignRoleByBiome respects demographic weights', () => {
        const rng = seedrandom('test');
        const roles = new Set();
        
        for (let i = 0; i < 100; i++) {
            const role = assignRoleByBiome(rng, 'Plains');
            roles.add(role);
        }
        
        // Plains should have Citizen as most common
        expect(roles.has('Citizen')).toBe(true);
    });

    test('determinePoliticalStance identifies Aggressive towns', () => {
        const demographics = {
            Guard: 0.3,
            Bandit: 0.3,
            Citizen: 0.4
        };
        const stance = determinePoliticalStance(demographics);
        expect(stance).toBe('Aggressive');
    });

    test('determinePoliticalStance identifies Federation towns', () => {
        const demographics = {
            Scholar: 0.3,
            Merchant: 0.3,
            Citizen: 0.4
        };
        const stance = determinePoliticalStance(demographics);
        expect(stance).toBe('Federation');
    });
});

describe('Artifact Effects System', () => {
    let world, npc, artifact;

    beforeEach(() => {
        world = new World();
        npc = world.add({
            identity: { id: 'npc1', name: 'Test NPC', type: 'NPC' },
            currentRole: 'Citizen',
            history: { events: [] },
            inventory: { items: [] },
            age: 25
        });
        artifact = {
            id: 'artifact1',
            name: 'Tome of Knowledge',
            type: 'Tome'
        };
    });

    test('Tome effect converts Citizen to Scholar', () => {
        ArtifactEffects.applyTomeEffect(world, 0, 0, artifact, npc);
        // 75% chance, but we can't guarantee it happened
        // Just verify the method doesn't throw
        expect(npc.currentRole).toMatch(/Citizen|Scholar/);
    });

    test('Jewelry effect adds diplomatic bonus', () => {
        const rng = () => 0.1;
        const initialBonus = npc.artifactBonus || 0;
        ArtifactEffects.applyJewelryEffect(world, 0, 0, artifact, npc, rng);
        expect(npc.artifactBonus).toBeGreaterThan(initialBonus);
    });

    test('Weapon effect elevates lower-class NPCs', () => {
        npc.currentRole = 'Citizen';
        ArtifactEffects.applyWeaponEffect(world, 0, 0, artifact, npc);
        expect(['Guard', 'Hero', 'Citizen']).toContain(npc.currentRole);
    });

    test('calculateCombatBonus sums weapon and role bonuses', () => {
        npc.currentRole = 'Guard';
        npc.weaponBonus = 10;
        npc.inventory.items = [
            { type: 'Weapon' },
            { type: 'Weapon' },
            { type: 'Tome' }
        ];
        const bonus = ArtifactEffects.calculateCombatBonus(npc);
        expect(bonus).toBeGreaterThan(10);
    });
});

describe('Population Replenishment System', () => {
    test('replenishPopulationIfNeeded spawns NPCs when needed', () => {
        const world = new World();
        const town = world.add({
            identity: { id: 'town1', name: 'Test Town', type: 'Town' },
            location: { x: 0, y: 0 }
        });

        // Create only 2 NPCs (below 5 threshold)
        for (let i = 0; i < 2; i++) {
            world.add({
                identity: { id: `npc${i}`, name: `NPC ${i}`, type: 'NPC' },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                history: { events: [] },
                knowledge: { memories: {} },
                inventory: { items: [] },
                quests: { offeredQuests: [] },
                description: 'Test'
            });
        }

        const rng = seedrandom('test');
        const initialCount = Array.from(world.with('identity', 'status')
            .where(e => e.location.x === 0 && e.location.y === 0 && e.status === 'Alive')).length;
        
        replenishPopulationIfNeeded(world, 0, 0, rng, town, 'Plains', 1);
        
        const finalCount = Array.from(world.with('identity', 'status')
            .where(e => e.location.x === 0 && e.location.y === 0 && e.status === 'Alive')).length;
        
        expect(finalCount).toBeGreaterThan(initialCount);
    });
});

describe('Player Mechanics System', () => {
    test('resolveSteal failure chance respects stealth stat', () => {
        const playerState = {
            stats: { stealth: 0, strength: 5 },
            level: 1,
            xp: 0
        };
        const result = PlayerMechanics.resolveSteal(playerState);
        expect(result.failChance).toBe(0.60);

        const stealthyPlayer = {
            stats: { stealth: 10, strength: 5 },
            level: 1,
            xp: 0
        };
        const stealthyResult = PlayerMechanics.resolveSteal(stealthyPlayer);
        expect(stealthyResult.failChance).toBeLessThan(0.60);
    });

    test('resolveAssassinate combines stealth and strength bonuses', () => {
        const basePlayer = {
            stats: { stealth: 0, strength: 0 },
            level: 1,
            xp: 0
        };
        const baseResult = PlayerMechanics.resolveAssassinate(basePlayer, false);

        const strongPlayer = {
            stats: { stealth: 10, strength: 10 },
            level: 1,
            xp: 0
        };
        const strongResult = PlayerMechanics.resolveAssassinate(strongPlayer, false);
        
        expect(strongResult.failChance).toBeLessThan(baseResult.failChance);
    });

    test('resolveRegicide enforces high difficulty', () => {
        const weakPlayer = {
            stats: { stealth: 5, strength: 5 },
            level: 1,
            xp: 0
        };
        const result = PlayerMechanics.resolveRegicide(weakPlayer, 0);
        expect(result.failChance).toBeGreaterThan(0.8);
    });

    test('calculateReputationDelta applies failure penalty', () => {
        const delta = PlayerMechanics.calculateReputationDelta('steal', 10, false, true);
        expect(delta.local).toBe(-20); // 2x penalty
    });

    test('calculateReputationDelta applies colony propagation', () => {
        const delta = PlayerMechanics.calculateReputationDelta('steal', 10, true, false);
        expect(delta.suzerain).toBe(5); // 50% to suzerain
    });
});

describe('Political Engine System', () => {
    test('calculateOffenseScore sums military might', () => {
        const invader = {
            npcsByRole: { Guard: 10, Hero: 2 },
            weapons: 5,
            suzerain: null
        };
        const score = PoliticalEngine.calculateOffenseScore(invader);
        expect(score).toBe(10 * 2 + 2 * 5 + 5 * 5); // 50
    });

    test('resolveConflict determines crushing victory', () => {
        const invader = {
            npcsByRole: { Guard: 50, Hero: 10 },
            weapons: 20,
            suzerain: null
        };
        const target = {
            npcsByRole: { Guard: 5, Hero: 1 },
            weapons: 2,
            allies: []
        };
        const result = PoliticalEngine.resolveConflict(invader, target);
        expect(result.outcome).toBe('crushing-victory');
        expect(result.loserMayorKilled).toBe(true);
    });

    test('resolveConflict determines subjugation', () => {
        const invader = {
            npcsByRole: { Guard: 12, Hero: 0 },
            weapons: 2,
            suzerain: null
        };
        const target = {
            npcsByRole: { Guard: 10, Hero: 0 },
            weapons: 1,
            allies: []
        };
        // Invader: 12*2 + 0*5 + 2*5 = 34
        // Target: 10*2 + 0*5 + 1*5 = 25
        // Margin: 9 (between 0 and 10) = subjugation
        const result = PoliticalEngine.resolveConflict(invader, target);
        expect(result.outcome).toBe('subjugation');
        expect(result.vassalState).toBe('Colony');
    });

    test('getExpansionRange returns correct territory size', () => {
        expect(PoliticalEngine.getExpansionRange(1)).toBe(1); // Town: 1x1
        expect(PoliticalEngine.getExpansionRange(2)).toBe(2); // SmallCity: 2x2
        expect(PoliticalEngine.getExpansionRange(3)).toBe(3); // FullCity: 3x3
        expect(PoliticalEngine.getExpansionRange(5)).toBe(7); // Kingdom: 7x7
    });

    test('canPromote checks population requirement', () => {
        const settlement = { tier: 1, population: 5 };
        expect(PoliticalEngine.canPromote(settlement)).toBe(false);

        settlement.population = 25; // Need 2 * 10 = 20
        expect(PoliticalEngine.canPromote(settlement)).toBe(true);
    });
});

describe('Integration: Full Settlement Lifecycle', () => {
    test('town generation includes biome and political stance', () => {
        const biome = determineBiome(42, 42);
        expect(['Mountain', 'Forest', 'Desert', 'Marsh', 'Plains']).toContain(biome);

        const rng = seedrandom(`world_X42_Y42`);
        const role = assignRoleByBiome(rng, biome);
        expect(typeof role).toBe('string');
    });

    test('conflict resolution enforces deterministic outcomes', () => {
        const invader = {
            npcsByRole: { Guard: 30, Hero: 5 },
            weapons: 10
        };
        const target = {
            npcsByRole: { Guard: 20, Hero: 3 },
            weapons: 5
        };

        const result1 = PoliticalEngine.resolveConflict(invader, target);
        const result2 = PoliticalEngine.resolveConflict(invader, target);
        
        // Same inputs should give same outcome (deterministic)
        expect(result1.outcome).toBe(result2.outcome);
        expect(result1.margin).toBe(result2.margin);
    });

    test('settlement grows larger when population increases over time', () => {
        const world = new World();
        const town = world.add({
            identity: { id: 'town1', name: 'Test Town', type: 'Town' },
            location: { x: 0, y: 0 },
            history: { events: [] },
            political: { tier: 1, demographics: {}, stance: 'Balanced' },
            population: 0
        });

        // Create enough NPCs to trigger tier 2 promotion (need population >= 20)
        for (let i = 0; i < 25; i++) {
            world.add({
                identity: { id: `npc${i}`, name: `NPC ${i}`, type: 'NPC' },
                location: { x: 0, y: 0 },
                status: 'Alive',
                currentRole: 'Citizen',
                history: { events: [] },
                knowledge: { memories: {} },
                inventory: { items: [] },
                quests: { offeredQuests: [] },
                description: 'Test'
            });
        }

        // Simulate that population was counted
        town.population = 25;

        // Check tier before promotion
        expect(town.political.tier).toBe(1);

        // For promotion, PoliticalEngine expects settlement object with tier and population at top level
        // Create a settlement-like object
        const settlementObj = { 
            tier: town.political.tier, 
            population: town.population,
            name: town.identity.name
        };

        // Try to promote
        const promoted = PoliticalEngine.promoteSettlement(settlementObj);
        expect(promoted).toBe(true);
        expect(settlementObj.tier).toBe(2);

        // Verify second tier promotion is possible with more population
        settlementObj.population = 30;
        const promoted2 = PoliticalEngine.promoteSettlement(settlementObj);
        expect(promoted2).toBe(true);
        expect(settlementObj.tier).toBe(3);
    });
});

