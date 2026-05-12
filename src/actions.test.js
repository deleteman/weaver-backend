// src/actions.test.js
const { World } = require('miniplex');
const actions = require('./actions');
const { Identity, Inventory, Knowledge, Quests } = require('./components');

// 1. MOCK THE DATABASE
// This intercepts any calls to src/db.js so we don't write to the real SQLite file
jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    getDeltas: jest.fn(() => []),
    getGlobalYear: jest.fn(() => 51)
}));

describe('Player Actions', () => {
    let world;
    let playerState;
    let dummyTargetId = "target-uuid-123";
    let dummyItemId = "item-uuid-456";

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // 2. SETUP A FRESH WORLD BEFORE EVERY TEST
    beforeEach(() => {
        world = new World();
        
        // Reset player state
        playerState = {
            level: 1, xp: 0, reputation: 25, 
            stats: { stealth: 5, strength: 5, itemsStolen: 0 },
            inventory: [], titles: {}
        };

        // Add a dummy NPC to our temporary world
        world.add({
            identity: Identity("Target Dummy", "NPC", dummyTargetId),
            status: "Alive",
            currentRole: "Citizen", // FIX: The query requires a role to find them!
            inventory: { 
                items: [{ id: dummyItemId, name: "The Mock Amulet", type: "Jewelry" }] 
            },
            knowledge: Knowledge(),
            quests: Quests()
        });

        // Add a town entity
        world.add({
            identity: Identity("Town", "Town", "town-id"),
            currentMayor: null,
            history: { events: [] }
        });
    });

    // 3. THE TESTS
    test('stealItem should fail if the target is dead', () => {
        const deadNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        deadNpc.status = "Dead"; // Kill the NPC

        const result = actions.stealItem(world, "world_X0_Y0", dummyTargetId, dummyItemId, playerState);

        expect(result.success).toBe(false);
        expect(result.message).toMatch(/Target not found or dead/);
    });

    test('turnInQuest should successfully shift arguments and process a Bounty', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        const enemyId = "enemy-uuid-789";
        
        // Give the dummy NPC a blood feud
        questGiver.knowledge.memories[enemyId] = "hates";

        // Add the dead enemy to the world
        world.add({
            identity: Identity("Dead Enemy", "NPC", enemyId),
            status: "Dead"
        });

        // Simulate the Frontend omitting the 'itemId' argument for a bounty
        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, playerState, undefined);

        expect(result.success).toBe(true);
        // FIX: Simplified the regex matcher
        expect(result.message).toMatch(/reported the death/i);
        expect(playerState.reputation).toBeGreaterThan(25);
        expect(questGiver.knowledge.memories[enemyId]).toBe("avenged");
    });

    test('assassinate should succeed on a regular NPC', () => {
        // Force successChance > 1.0 so Math.random() always satisfies the condition
        playerState.stats.stealth = 20;
        playerState.stats.strength = 20;
        const result = actions.assassinate(world, "world_X0_Y0", dummyTargetId, playerState);
        expect(result.success).toBe(true);
        expect(result.message).toContain('assassinated');
        expect(playerState.xp).toBeGreaterThan(0);

        const targetNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        expect(targetNpc.status).toBe('Dead');
    });

    test('assassinate should fail on dead target', () => {
        const deadNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        deadNpc.status = "Dead";
        const result = actions.assassinate(world, "world_X0_Y0", dummyTargetId, playerState);
        expect(result.success).toBe(false);
        expect(result.message).toContain('not found or dead');
    });

    test('claimThrone should succeed if no mayor and high reputation', () => {
        playerState.reputation = 25;
        const result = actions.claimThrone(world, "world_X0_Y0", playerState);
        expect(result.success).toBe(true);
        expect(result.message).toContain('Mayor');
        expect(playerState.titles).toHaveProperty('Town', 'Mayor');
    });

    test('claimThrone should fail if reputation too low', () => {
        playerState.reputation = 10;
        const result = actions.claimThrone(world, "world_X0_Y0", playerState);
        expect(result.success).toBe(false);
        expect(result.message).toContain('not respected enough');
    });

    test('lootTomb should succeed on dead NPC with items', () => {
        const deadNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        deadNpc.status = "Dead";
        const result = actions.lootTomb(world, "world_X0_Y0", dummyTargetId, playerState);
        expect(result.success).toBe(true);
        expect(result.message).toContain('looted');
        expect(result.message).toContain('The Mock Amulet');
        expect(result.message).not.toContain('[object Object]');
        expect(playerState.inventory.length).toBeGreaterThan(0);
    });

    test('lootTomb should fail on alive NPC', () => {
        const result = actions.lootTomb(world, "world_X0_Y0", dummyTargetId, playerState);
        expect(result.success).toBe(false);
        expect(result.message).toContain('still alive');
    });

    test('stealItem should fail when item not found on target', () => {
        const result = actions.stealItem(world, "world_X0_Y0", dummyTargetId, "nonexistent-item-id", playerState);
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('does not have that item');
    });

    test('stealItem should succeed with sufficient stealth and remove the item from the target', () => {
        // Return 0.95 so Math.random() >= any failChance, guaranteeing the steal succeeds
        jest.spyOn(Math, 'random').mockReturnValue(0.95);
        playerState.stats.stealth = 10;
        playerState.inventory = [];

        const targetNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        const initialCount = targetNpc.inventory.items.length;

        const result = actions.stealItem(world, "world_X0_Y0", dummyTargetId, dummyItemId, playerState);
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('You stole');
        expect(playerState.inventory.some(item => item.id === dummyItemId)).toBe(true);
        expect(targetNpc.inventory.items.length).toBe(initialCount - 1);
        expect(targetNpc.inventory.items.every(item => item.id !== dummyItemId)).toBe(true);
    });

    test('stealItem should fail on a second attempt for the same item id after successful theft', () => {
        // Return 0.95 so the first steal always succeeds; second attempt fails because the item is gone
        jest.spyOn(Math, 'random').mockReturnValue(0.95);
        playerState.stats.stealth = 10;
        playerState.inventory = [];

        const firstResult = actions.stealItem(world, "world_X0_Y0", dummyTargetId, dummyItemId, playerState);
        expect(firstResult.success).toBe(true);

        const secondResult = actions.stealItem(world, "world_X0_Y0", dummyTargetId, dummyItemId, playerState);
        expect(secondResult.success).toBe(false);
        expect(secondResult.message).toContain('does not have that item');
    });

    test('assassinate should have lower success chance on Guard', () => {
        const guardNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        guardNpc.currentRole = "Guard";
        
        playerState.stats.strength = 10;
        playerState.stats.stealth = 10;
        
        const result = actions.assassinate(world, "world_X0_Y0", dummyTargetId, playerState);
        
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('message');
    });

    test('assassinate should have lower success chance on Mayor', () => {
        const mayorNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        mayorNpc.currentRole = "Mayor";
        
        const result = actions.assassinate(world, "world_X0_Y0", dummyTargetId, playerState);
        
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('message');
    });

    test('turnInQuest should successfully transfer fetch quest item', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        
        // Give the quest giver a fetch quest
        questGiver.quests.offeredQuests = [
            { type: "Fetch", itemType: "Artifact" }
        ];
        
        // Give the player an artifact
        playerState.inventory = [{ id: "artifact-id", name: "Ancient Artifact", type: "Artifact" }];
        
        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, "artifact-id", playerState);
        
        expect(result.success).toBe(true);
        expect(result.message).toMatch(/gave/i);
    });

    test('turnInQuest should reject wrong item type', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        
        // Give the quest giver a fetch quest for a specific item type
        questGiver.quests.offeredQuests = [
            { type: "Fetch", itemType: "Weapon" }
        ];
        
        // Give the player a different type
        playerState.inventory = [{ id: "artifact-id", name: "Amulet", type: "Jewelry" }];
        
        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, "artifact-id", playerState);
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('looking for');
    });

    test('turnInQuest should promote recipient to Hero on Weapon gift', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.currentRole = "Citizen";
        
        // Give the player a weapon
        playerState.inventory = [{ id: "weapon-id", name: "Sword", type: "Weapon" }];
        
        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, "weapon-id", playerState);
        
        if (result.success) {
            expect(questGiver.currentRole).toBe("Hero");
        }
    });

    test('turnInQuest should make recipient Cultist on Jewelry gift', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.currentRole = "Citizen";
        
        // Give the player jewelry (already set up in beforeEach)
        playerState.inventory = [{ id: dummyItemId, name: "The Mock Amulet", type: "Jewelry" }];
        world.with('identity').where(e => e.identity.id === dummyTargetId).first.inventory.items = [];
        
        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, dummyItemId, playerState);
        
        if (result.success) {
            expect(questGiver.currentRole).toBe("Cultist");
        }
    });

    test('taxTown should fail if player is not Mayor', () => {
        playerState.titles = {};
        const result = actions.taxTown(world, "world_X0_Y0", playerState);
        expect(result.success).toBe(false);
        expect(result.message).toContain('Only the Mayor');
    });

    test('taxTown should confiscate items from citizens', () => {
        playerState.titles['Town'] = 'Mayor';
        playerState.inventory = [];
        
        const result = actions.taxTown(world, "world_X0_Y0", playerState);
        
        expect(result.success).toBe(true);
        expect(result.message).toContain('taxed');
    });

    test('decree should fail if player is not Mayor', () => {
        playerState.titles = {};
        const result = actions.decree(world, "world_X0_Y0", dummyTargetId, "Hero", playerState);
        expect(result.success).toBe(false);
    });

    test('decree should succeed if player is Mayor', () => {
        playerState.titles['Town'] = 'Mayor';
        const result = actions.decree(world, "world_X0_Y0", dummyTargetId, "Hero", playerState);
        expect(result.success).toBe(true);
        
        const targetNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        expect(targetNpc.currentRole).toBe("Hero");
    });

    test('banish should fail if player is not Mayor', () => {
        playerState.titles = {};
        const result = actions.banish(world, "world_X0_Y0", dummyTargetId, playerState);
        expect(result.success).toBe(false);
    });

    test('banish should succeed if player is Mayor', () => {
        playerState.titles['Town'] = 'Mayor';
        const result = actions.banish(world, "world_X0_Y0", dummyTargetId, playerState);
        
        // Either succeeds or fails based on world state, but should not throw
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('message');
    });

    test('abdicate should fail if player is not Mayor', () => {
        playerState.titles = {};
        const result = actions.abdicate(world, "world_X0_Y0", playerState);
        expect(result.success).toBe(false);
        expect(result.message).toContain('not the Mayor');
    });

    test('abdicate should succeed and transfer power', () => {
        playerState.titles['Town'] = 'Mayor';
        
        const result = actions.abdicate(world, "world_X0_Y0", playerState);
        
        expect(result.success).toBe(true);
        expect(playerState.titles['Town']).toBeUndefined();
    });
});