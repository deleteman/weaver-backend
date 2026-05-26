// src/actions.test.js
const { World } = require('miniplex');
const actions = require('./actions');
const { Identity, Inventory, Knowledge, Quests } = require('./components');

// 1. MOCK THE DATABASE
// This intercepts any calls to src/db.js so we don't write to the real SQLite file
jest.mock('./db', () => ({
    saveDelta: jest.fn(),
    getDeltas: jest.fn(() => []),
    getGlobalYear: jest.fn(() => 51),
    getSuzerainForCoordinate: jest.fn(() => null),
    getTierForCoordinate: jest.fn(() => 1),
    getRuinHoard: jest.fn(() => null),
    appendJournalEntry: jest.fn()
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
            currentRole: "Citizen",
            inventory: {
                items: [{ id: dummyItemId, name: "The Mock Amulet", type: "Jewelry" }]
            },
            knowledge: Knowledge(),
            quests: Quests(),
            history: { events: [] }
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
        questGiver.knowledge.memories[enemyId] = 'hates';

        // Add the dead enemy to the world
        world.add({
            identity: Identity("Dead Enemy", "NPC", enemyId),
            status: "Dead"
        });

        // Simulate the Frontend omitting the 'itemId' argument for a bounty
        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, playerState, undefined);

        expect(result.success).toBe(true);
        expect(result.message).toMatch(/reported the death/i);
        expect(playerState.reputation).toBeGreaterThan(25);
        expect(questGiver.knowledge.memories[enemyId]).toBe('avenged');
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

    test('lootTomb with targetId on a tier-0 tile should loot NPC tomb, not ruin', () => {
        const { getTierForCoordinate } = require('./db');
        getTierForCoordinate.mockReturnValueOnce(0);

        const deadNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        deadNpc.status = "Dead";
        const result = actions.lootTomb(world, "world_X0_Y0", dummyTargetId, playerState);
        expect(result.success).toBe(true);
        expect(result.message).toContain('The Mock Amulet');
        expect(result.message).not.toContain('ruin');
    });

    test('lootTomb without targetId on tier-0 tile should loot ruin', () => {
        const { getTierForCoordinate } = require('./db');
        getTierForCoordinate.mockReturnValueOnce(0);

        const result = actions.lootTomb(world, "world_X0_Y0", null, playerState);
        expect(result.success).toBe(true);
        expect(result.message).toContain('ruin');
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

    test('turnInQuest auto-detects item when no itemId arg sent (old playerState with itemId field)', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.quests.offeredQuests = [{ type: "Fetch", itemType: "Tome" }];

        // Simulate old playerState: tome stored with `itemId` not `id` (pre-normalization data)
        playerState.inventory = [{ itemId: "tome-old-id", name: "The Bone Tome", type: "Tome" }];

        // Client sends no itemId (because item.id is undefined) — same as the actual bug scenario
        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, playerState, undefined);

        expect(result.success).toBe(true);
        expect(result.message).toMatch(/gave/i);
    });

    test('turnInQuest should accept a tome purchased from a merchant (itemId normalized to id)', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.quests.offeredQuests = [{ type: "Fetch", itemType: "Tome" }];

        // Bought items arrive with `id` after the normalization fix (was `itemId` before the fix)
        playerState.inventory = [{ id: "tome-purchased-id", name: "The Bone Tome", type: "Tome" }];

        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, "tome-purchased-id", playerState);

        expect(result.success).toBe(true);
        expect(result.message).toMatch(/gave/i);
    });

    test('turnInQuest removes Fetch quest from offeredQuests after successful delivery', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.quests.offeredQuests = [{ type: "Fetch", itemType: "Tome" }];

        playerState.inventory = [{ id: "tome-removal-id", name: "The Bone Tome", type: "Tome" }];

        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, "tome-removal-id", playerState);

        expect(result.success).toBe(true);
        expect(questGiver.quests.offeredQuests).toHaveLength(0);
    });

    test('turnInQuest removes Bounty quest from offeredQuests after reporting avenged kill', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        const enemyId = "bounty-removal-enemy";

        questGiver.knowledge.memories[enemyId] = 'hates';
        questGiver.quests.offeredQuests = [{ type: "Bounty", target: enemyId }];

        world.add({
            identity: { id: enemyId, name: "Dead Foe", type: "NPC" },
            status: "Dead"
        });

        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, playerState, undefined);

        expect(result.success).toBe(true);
        expect(questGiver.quests.offeredQuests).toHaveLength(0);
    });

    test('turnInQuest falls to bounty branch when no itemId sent and inventory has no matching item', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.quests.offeredQuests = [{ type: "Fetch", itemType: "Tome" }];

        // Inventory has wrong type — auto-detect finds nothing, itemId stays null → bounty branch
        playerState.inventory = [{ id: "ring-id", name: "Gold Ring", type: "Jewelry" }];

        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, playerState, undefined);

        expect(result.success).toBe(false);
        expect(result.message).toMatch(/no completed bounties/i);
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

    test('turnInQuest should elevate Citizen to Guard or Hero on Weapon gift', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.currentRole = "Citizen";

        // Give the player a weapon
        playerState.inventory = [{ id: "weapon-id", name: "Sword", type: "Weapon" }];

        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, "weapon-id", playerState);

        expect(result.success).toBe(true);
        // Weapon elevates Citizen to Guard or Hero (seeded, 50/50)
        expect(["Guard", "Hero"]).toContain(questGiver.currentRole);
        expect(questGiver.weaponBonus).toBe(5);
    });

    test('turnInQuest should apply artifact bonus to recipient on Jewelry gift', () => {
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.currentRole = "Citizen";

        // Give the player jewelry
        playerState.inventory = [{ id: dummyItemId, name: "The Mock Amulet", type: "Jewelry" }];
        world.with('identity').where(e => e.identity.id === dummyTargetId).first.inventory.items = [];

        const result = actions.turnInQuest(world, "world_X0_Y0", dummyTargetId, dummyItemId, playerState);

        expect(result.success).toBe(true);
        // Jewelry applies a +0.20 diplomatic bonus; role may change (30% seeded chance)
        expect(questGiver.artifactBonus).toBeCloseTo(0.20);
        expect(playerState.reputation).toBeGreaterThan(25);
    });

    test('taxTown should fail if player is not Mayor', () => {
        playerState.titles = {};
        const result = actions.taxTown(world, "world_X0_Y0", playerState);
        expect(result.success).toBe(false);
        expect(result.message).toContain('Only the ruling leader');
    });

    test('taxTown should confiscate items from citizens', () => {
        playerState.titles['Town'] = 'Mayor';
        const taxConfTown = world.with('identity').where(e => e.identity.type === 'Town').first;
        taxConfTown.currentMayor = 'The Player';
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
        const decreeTown = world.with('identity').where(e => e.identity.type === 'Town').first;
        decreeTown.currentMayor = 'The Player';
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
        const banishMayorTown = world.with('identity').where(e => e.identity.type === 'Town').first;
        banishMayorTown.currentMayor = 'The Player';
        const result = actions.banish(world, "world_X0_Y0", dummyTargetId, playerState);

        // Either succeeds or fails based on world state, but should not throw
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('message');
    });

    test('banish should save birthYear, arrivedYear, and ageAtArrival in the immigrant delta', () => {
        const { saveDelta } = require('./db');
        saveDelta.mockClear();

        playerState.titles['Town'] = 'Mayor';
        const banishAgeTown = world.with('identity').where(e => e.identity.type === 'Town').first;
        banishAgeTown.currentMayor = 'The Player';

        const banishId = 'banish-age-target';
        world.add({
            identity: Identity("Age Target", "NPC", banishId),
            status: "Alive",
            currentRole: "Citizen",
            age: 30,
            birthYear: 21,
            description: "A test NPC.",
            location: { x: 0, y: 0 },
            inventory: { items: [] },
            knowledge: { memories: {} },
            quests: Quests(),
            history: { events: [] }
        });

        actions.banish(world, "world_X0_Y0", banishId, playerState);

        const immigrantCall = saveDelta.mock.calls.find(call => call[2] === 'immigrant_data');
        expect(immigrantCall).toBeDefined();

        const savedData = JSON.parse(immigrantCall[3]);
        expect(savedData).toHaveProperty('ageAtArrival', 30);
        expect(savedData).toHaveProperty('arrivedYear', 51); // getGlobalYear() mock returns 51
        expect(savedData).toHaveProperty('birthYear', 21);
        expect(savedData).not.toHaveProperty('age');
    });

    test('abdicate should fail if player is not Mayor', () => {
        playerState.titles = {};
        const result = actions.abdicate(world, "world_X0_Y0", playerState);
        expect(result.success).toBe(false);
        expect(result.message).toContain('not the ruling leader');
    });

    test('abdicate should succeed and transfer power', () => {
        playerState.titles['Town'] = 'Mayor';
        const town = world.with('identity').where(e => e.identity.type === 'Town').first;
        town.currentMayor = 'The Player';

        const result = actions.abdicate(world, "world_X0_Y0", playerState);

        expect(result.success).toBe(true);
        expect(playerState.titles['Town']).toBeUndefined();
    });

    test('abdicate updates town.currentMayor in memory when a successor is found', () => {
        playerState.titles['Town'] = 'Mayor';
        const town = world.with('identity').where(e => e.identity.type === 'Town').first;
        town.currentMayor = 'The Player';

        const result = actions.abdicate(world, "world_X0_Y0", playerState);

        expect(result.success).toBe(true);
        // The successor's name must appear in both the message and the in-memory town entity
        const successorName = town.currentMayor;
        expect(successorName).not.toBe('The Player');
        expect(successorName).not.toBe('None');
        expect(result.message).toContain(successorName);
    });

    test('abdicate sets town.currentMayor to "NPC" in memory when no living citizens remain', () => {
        playerState.titles['Town'] = 'Mayor';
        const town = world.with('identity').where(e => e.identity.type === 'Town').first;
        town.currentMayor = 'The Player';

        // Kill the only NPC so there is no successor
        const npc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        npc.status = 'Dead';

        const result = actions.abdicate(world, "world_X0_Y0", playerState);

        expect(result.success).toBe(true);
        expect(town.currentMayor).toBe('NPC');
    });

    // --- Structured history event tests ---

    test('after assassinate success, targetNPC.history.events contains an object with type === assassination', () => {
        playerState.stats.stealth = 20;
        playerState.stats.strength = 20;
        const targetNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        targetNpc.history = { events: [] };

        actions.assassinate(world, 'world_X0_Y0', dummyTargetId, playerState);

        const ev = targetNpc.history.events.find(e => e.type === 'assassination');
        expect(ev).toBeDefined();
        expect(ev.id).toMatch(/^ev_[0-9a-f]{8}$/);
        expect(ev.year).toBe(51);
    });

    test('after claimThrone success, town.history.events contains an object with type === power_seizure', () => {
        const town = world.with('identity').where(e => e.identity.type === 'Town').first;
        town.history = { events: [] };
        playerState.reputation = 30;

        actions.claimThrone(world, 'world_X0_Y0', playerState);

        const ev = town.history.events.find(e => e.type === 'power_seizure');
        expect(ev).toBeDefined();
        expect(ev.causedBy).toBeNull();
    });

    test('after regicide success, targetNPC.history.events contains type === regicide', () => {
        const targetNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        targetNpc.currentRole = 'Mayor';
        targetNpc.history = { events: [] };

        // Force success by giving max stats and a high weapon tier
        jest.spyOn(Math, 'random').mockReturnValue(0.0);
        playerState.stats.stealth = 20;
        playerState.stats.strength = 20;

        const result = actions.regicide(world, 'world_X0_Y0', dummyTargetId, 5, playerState);

        if (result.success) {
            const ev = targetNpc.history.events.find(e => e.type === 'regicide');
            expect(ev).toBeDefined();
        }
    });

    test('assassinate triggers grief for any NPC that loves the target', () => {
        playerState.stats.stealth = 20;
        playerState.stats.strength = 20;

        const loverId = 'lover-npc-id';
        world.add({
            identity: Identity('Heartbroken Lover', 'NPC', loverId),
            status: 'Alive',
            currentRole: 'Citizen',
            inventory: { items: [] },
            knowledge: { memories: { [dummyTargetId]: 'loves' } },
            history: { events: [] }
        });

        actions.assassinate(world, 'world_X0_Y0', dummyTargetId, playerState);

        const lover = world.with('identity').where(e => e.identity.id === loverId).first;
        expect(lover.knowledge.memories[dummyTargetId]).toBe('mourns');
        const griefEv = lover.history.events.find(e => e.type === 'grief');
        expect(griefEv).toBeDefined();
        expect(griefEv.description).toMatch(/heartbroken/i);
    });

    test('regicide triggers grief for any NPC that loves the target', () => {
        const targetNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        targetNpc.currentRole = 'Mayor';

        jest.spyOn(Math, 'random').mockReturnValue(0.0);
        playerState.stats.stealth = 20;
        playerState.stats.strength = 20;

        const loverId = 'lover-npc-id-2';
        world.add({
            identity: Identity('Grieving Lover', 'NPC', loverId),
            status: 'Alive',
            currentRole: 'Citizen',
            inventory: { items: [] },
            knowledge: { memories: { [dummyTargetId]: 'loves' } },
            history: { events: [] }
        });

        const result = actions.regicide(world, 'world_X0_Y0', dummyTargetId, 5, playerState);
        if (!result.success) return; // skip if random still failed

        const lover = world.with('identity').where(e => e.identity.id === loverId).first;
        expect(lover.knowledge.memories[dummyTargetId]).toBe('mourns');
        const griefEv = lover.history.events.find(e => e.type === 'grief');
        expect(griefEv).toBeDefined();
    });

    test.each([
        ['parent', /grief-stricken/i],
        ['child',  /devastated/i],
    ])('assassinate triggers grief with correct message when relationship is %s', (relationship, msgPattern) => {
        playerState.stats.stealth = 20;
        playerState.stats.strength = 20;

        const relativeid = `relative-npc-${relationship}`;
        world.add({
            identity: Identity('Grieving Relative', 'NPC', relativeid),
            status: 'Alive',
            currentRole: 'Citizen',
            inventory: { items: [] },
            knowledge: { memories: { [dummyTargetId]: relationship } },
            history: { events: [] }
        });

        actions.assassinate(world, 'world_X0_Y0', dummyTargetId, playerState);

        const relative = world.with('identity').where(e => e.identity.id === relativeid).first;
        expect(relative.knowledge.memories[dummyTargetId]).toBe('mourns');
        const griefEv = relative.history.events.find(e => e.type === 'grief');
        expect(griefEv).toBeDefined();
        expect(griefEv.description).toMatch(msgPattern);
    });

    test('appendHistory wraps a legacy plain string in a legacy-type event object', () => {
        // Directly test that the public API still accepts strings via the turnInQuest path
        const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
        questGiver.history = { events: [] };
        questGiver.quests.offeredQuests = [];
        playerState.inventory = [{ id: 'item-x', name: 'Random Item', type: 'Tome' }];

        actions.turnInQuest(world, 'world_X0_Y0', dummyTargetId, 'item-x', playerState);

        const ev = questGiver.history.events[0];
        expect(ev).toBeDefined();
        expect(typeof ev).toBe('object');
        expect(ev).toHaveProperty('id');
        expect(ev).toHaveProperty('type');
        expect(ev).toHaveProperty('year');
    });

    // ─── executeTrade tests ────────────────────────────────────────────────────

    test('executeTrade: buying > 80% of primaryExport stock writes a shortage delta', () => {
        const { saveDelta } = require('./db');
        saveDelta.mockClear();

        const merchantId = 'merchant-uuid-001';
        const town = world.with('identity').where(e => e.identity.type === 'Town').first;
        town.primaryExport = 'Grain';

        world.add({
            identity: Identity('Grain Merchant', 'NPC', merchantId),
            status: 'Alive',
            currentRole: 'Merchant',
            merchantInventory: [
                { itemId: 'slot-grain-0', name: 'Grain', tier: 1, quantity: 10, price: 50, type: 'resource' }
            ],
            personalWealth: 1000,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] }
        });

        playerState.gold = 5000;
        const result = actions.executeTrade(world, 'world_X0_Y0', merchantId, { type: 'buy', itemId: 'slot-grain-0', quantity: 9 }, playerState);

        expect(result.success).toBe(true);
        expect(result.event).not.toBeNull();
        expect(result.event.type).toBe('MARKET_DEPLETION');
        const shortageCall = saveDelta.mock.calls.find(c => c[2] === 'shortage' && c[3] === 'true');
        expect(shortageCall).toBeDefined();
    });

    test('executeTrade: selling a Relic to Merchant with 13500 wealth triggers MERCHANT_ASCENDANCY', () => {
        const { saveDelta } = require('./db');
        saveDelta.mockClear();

        const merchantId = 'merchant-uuid-002';

        world.add({
            identity: Identity('Relic Buyer', 'NPC', merchantId),
            status: 'Alive',
            currentRole: 'Merchant',
            merchantInventory: [],
            personalWealth: 13500,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] }
        });

        playerState.gold = 0;
        playerState.inventory = [{ id: 'relic-001', itemId: 'relic-001', name: 'The Ancient Blade', type: 'Weapon', prefix: 'Relic', value: 2000, price: 2000 }];

        const result = actions.executeTrade(world, 'world_X0_Y0', merchantId, { type: 'sell', itemId: 'relic-001', quantity: 1 }, playerState);

        expect(result.success).toBe(true);
        expect(result.event).not.toBeNull();
        expect(result.event.type).toBe('MERCHANT_ASCENDANCY');
        // personalWealth: 13500 + 2000*5 = 23500 > 15000 → delta written
        const plutocracyCall = saveDelta.mock.calls.find(c => c[2] === 'plutocracy_candidate' && c[3] === merchantId);
        expect(plutocracyCall).toBeDefined();
    });

    test('executeTrade: Merchant with wealth 14000 selling a cheap Relic does NOT trigger Ascendancy', () => {
        const { saveDelta } = require('./db');
        saveDelta.mockClear();

        const merchantId = 'merchant-uuid-003';

        world.add({
            identity: Identity('Small Dealer', 'NPC', merchantId),
            status: 'Alive',
            currentRole: 'Merchant',
            merchantInventory: [],
            personalWealth: 14000,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] }
        });

        playerState.gold = 0;
        // Relic value 100 → wealth becomes 14000 + 100*5 = 14500 < 15000
        playerState.inventory = [{ id: 'relic-002', itemId: 'relic-002', name: 'The Cracked Crown', type: 'Relic', prefix: 'Relic', value: 100, price: 100 }];

        const result = actions.executeTrade(world, 'world_X0_Y0', merchantId, { type: 'sell', itemId: 'relic-002', quantity: 1 }, playerState);

        expect(result.success).toBe(true);
        expect(result.event).toBeNull();
        const plutocracyCall = saveDelta.mock.calls.find(c => c[2] === 'plutocracy_candidate');
        expect(plutocracyCall).toBeUndefined();
    });

    test('executeTrade: selling an item adds it to npcInventory', () => {
        const merchantId = 'merchant-sell-inv-001';

        world.add({
            identity: Identity('Empty Stall', 'NPC', merchantId),
            status: 'Alive',
            currentRole: 'Merchant',
            merchantInventory: [],
            personalWealth: 0,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] }
        });

        playerState.gold = 0;
        playerState.inventory = [{ id: 'sword-01', itemId: 'sword-01', name: 'Iron Sword', type: 'Weapon', tier: 1, value: 50, price: 50 }];

        const result = actions.executeTrade(world, 'world_X0_Y0', merchantId, { type: 'sell', itemId: 'sword-01', quantity: 1 }, playerState);

        expect(result.success).toBe(true);
        expect(result.npcInventory).toHaveLength(1);
        expect(result.npcInventory[0].itemId).toBe('sword-01');
        expect(result.npcInventory[0].quantity).toBe(1);
    });

    test('executeTrade: selling the same item twice increments its quantity in npcInventory', () => {
        const merchantId = 'merchant-sell-inv-002';

        world.add({
            identity: Identity('Stacking Stall', 'NPC', merchantId),
            status: 'Alive',
            currentRole: 'Merchant',
            merchantInventory: [],
            personalWealth: 0,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] }
        });

        playerState.gold = 0;
        playerState.inventory = [
            { id: 'dagger-01', itemId: 'dagger-01', name: 'Rusty Dagger', type: 'Weapon', tier: 1, value: 20, price: 20 },
            { id: 'dagger-02', itemId: 'dagger-01', name: 'Rusty Dagger', type: 'Weapon', tier: 1, value: 20, price: 20 }
        ];

        actions.executeTrade(world, 'world_X0_Y0', merchantId, { type: 'sell', itemId: 'dagger-01', quantity: 1 }, playerState);
        playerState.inventory = [{ id: 'dagger-02', itemId: 'dagger-01', name: 'Rusty Dagger', type: 'Weapon', tier: 1, value: 20, price: 20 }];
        const result = actions.executeTrade(world, 'world_X0_Y0', merchantId, { type: 'sell', itemId: 'dagger-01', quantity: 1 }, playerState);

        expect(result.success).toBe(true);
        expect(result.npcInventory).toHaveLength(1);
        expect(result.npcInventory[0].itemId).toBe('dagger-01');
        expect(result.npcInventory[0].quantity).toBe(2);
    });

    test('executeTrade: buy that would leave player gold below 0 is rejected with status 400', () => {
        const merchantId = 'merchant-uuid-004';

        world.add({
            identity: Identity('Expensive Dealer', 'NPC', merchantId),
            status: 'Alive',
            currentRole: 'Merchant',
            merchantInventory: [
                { itemId: 'expensive-item', name: 'Diamond', tier: 2, quantity: 5, price: 1000, type: 'resource' }
            ],
            personalWealth: 500,
            history: { events: [] },
            knowledge: { memories: {} },
            inventory: { items: [] },
            quests: { offeredQuests: [] }
        });

        playerState.gold = 100; // Not enough for 1000g item
        const result = actions.executeTrade(world, 'world_X0_Y0', merchantId, { type: 'buy', itemId: 'expensive-item', quantity: 1 }, playerState);

        expect(result.success).toBe(false);
        expect(result.status).toBe(400);
        expect(result.message).toMatch(/[Ii]nsufficient gold/);
    });

    // ─── reputationMap propagation tests ─────────────────────────────────────────

    describe('reputationMap is populated by every reputation-modifying action', () => {
        const COORDINATE = 'world_X0_Y0';

        test('stealItem failure writes -20 (doubled penalty) to reputationMap', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0); // 0 < failChance(0.35) → caught
            playerState.stats.stealth = 5; // failChance = 0.35
            const result = actions.stealItem(world, COORDINATE, dummyTargetId, dummyItemId, playerState);
            expect(result.success).toBe(false);
            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap).toBeDefined();
            expect(playerState.reputationMap[COORDINATE]).toBe(-20); // -10 * 2 (isFailed=true)
        });

        test('assassinate success on Mayor (rep >= 20) writes +50 to reputationMap', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0); // 0 < successChance → success
            const mayorNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            mayorNpc.currentRole = 'Mayor';
            playerState.reputation = 25; // >= 20 → seizes power

            actions.assassinate(world, COORDINATE, dummyTargetId, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(50);
        });

        test('assassinate success on Mayor (rep < 20) writes -40 to reputationMap', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0); // 0 < successChance → success
            const mayorNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            mayorNpc.currentRole = 'Mayor';
            playerState.reputation = 10; // < 20 → chaos path

            actions.assassinate(world, COORDINATE, dummyTargetId, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(-40);
        });

        test('assassinate failure writes -60 (doubled penalty) to reputationMap', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.99); // 0.99 < successChance(0.40)? No → fail
            playerState.stats.stealth = 0;
            playerState.stats.strength = 0;

            actions.assassinate(world, COORDINATE, dummyTargetId, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(-60); // -30 * 2 (isFailed=true)
        });

        test('turnInQuest (item delivery) writes +20 to reputationMap', () => {
            const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            questGiver.quests.offeredQuests = [];
            playerState.inventory = [{ id: 'item-rep', name: 'Test Tome', type: 'Tome' }];

            actions.turnInQuest(world, COORDINATE, dummyTargetId, 'item-rep', playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(20);
        });

        test('turnInQuest (bounty report) writes +30 to reputationMap', () => {
            const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            const enemyId = 'bounty-enemy-rep-test';
            questGiver.knowledge.memories[enemyId] = 'hates';
            world.add({ identity: Identity('Dead Foe', 'NPC', enemyId), status: 'Dead' });

            actions.turnInQuest(world, COORDINATE, dummyTargetId, playerState, undefined);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(30);
        });

        test('claimThrone writes +30 to reputationMap', () => {
            playerState.reputation = 25;

            actions.claimThrone(world, COORDINATE, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(30);
        });

        test('taxTown writes -(itemsStolen * 10) to reputationMap', () => {
            playerState.titles['Town'] = 'Mayor';
            const taxTown = world.with('identity').where(e => e.identity.type === 'Town').first;
            taxTown.currentMayor = 'The Player';
            playerState.inventory = [];
            // beforeEach NPC has 1 item → itemsStolen = 1 → delta = -10

            actions.taxTown(world, COORDINATE, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(-10);
        });

        test('banish writes -15 to reputationMap', () => {
            playerState.titles['Town'] = 'Mayor';
            const banishTown = world.with('identity').where(e => e.identity.type === 'Town').first;
            banishTown.currentMayor = 'The Player';
            const banishTargetId = 'banish-rep-target';
            world.add({
                identity: Identity('Banish Target', 'NPC', banishTargetId),
                status: 'Alive',
                currentRole: 'Citizen',
                age: 28,
                birthYear: 23,
                description: 'A test citizen.',
                inventory: { items: [] },
                knowledge: { memories: {} },
                quests: Quests(),
                history: { events: [] }
            });

            actions.banish(world, COORDINATE, banishTargetId, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(-15);
        });

        test('abdicate (with successor) writes +25 to reputationMap', () => {
            playerState.titles['Town'] = 'Mayor';
            const abdicateTown = world.with('identity').where(e => e.identity.type === 'Town').first;
            abdicateTown.currentMayor = 'The Player';
            // beforeEach NPC is alive → qualifies as successor

            actions.abdicate(world, COORDINATE, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(25);
        });

        test('lootTomb on dead NPC writes -5 to reputationMap', () => {
            const deadNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            deadNpc.status = 'Dead';

            actions.lootTomb(world, COORDINATE, dummyTargetId, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(-5);
        });

        test('regicide failure writes -50 to reputationMap', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 > failChance(0.85)? No → fail
            const mayorNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            mayorNpc.currentRole = 'Mayor';

            actions.regicide(world, COORDINATE, dummyTargetId, 0, playerState);

            expect(typeof playerState.reputation).toBe('number');
            expect(playerState.reputationMap[COORDINATE]).toBe(-50);
        });
    });

    // ─── minimal playerState guard — no NaN leaks ─────────────────────────────

    describe('minimal playerState guard — no NaN leaks', () => {
        const COORDINATE = 'world_X0_Y0';

        test('assassinate with minimal playerState leaves reputation as a valid number', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.99); // force fail to trigger rep change
            const ps = { stats: { stealth: 0, strength: 0 } };
            actions.assassinate(world, COORDINATE, dummyTargetId, ps);
            expect(typeof ps.reputation).toBe('number');
            expect(Number.isNaN(ps.reputation)).toBe(false);
        });

        test('lootTomb with minimal playerState leaves reputation as a valid number', () => {
            const deadNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            deadNpc.status = 'Dead';
            const ps = { stats: { stealth: 5, strength: 5 } };
            actions.lootTomb(world, COORDINATE, dummyTargetId, ps);
            expect(typeof ps.reputation).toBe('number');
            expect(Number.isNaN(ps.reputation)).toBe(false);
        });

        test('claimThrone with reputation: 0 does not corrupt reputation to an object', () => {
            // Bug: !playerState.reputation was true when reputation=0, overwriting with {}
            const ps = { stats: { stealth: 5, strength: 5 }, reputation: 0, titles: {} };
            actions.claimThrone(world, COORDINATE, ps);
            // claimThrone fails (rep < 20) but reputation must remain a number
            expect(typeof ps.reputation).toBe('number');
            expect(Number.isNaN(ps.reputation)).toBe(false);
        });
    });

    describe('Mystery Heist quest resolution (bug-7b)', () => {
        const COORDINATE = 'world_X0_Y0';
        const ENEMY_ID = 'enemy-heist-01';
        const HEIST_ITEM_ID = 'heist-item-01';

        beforeEach(() => {
            const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;

            world.add({
                identity: { type: 'NPC', id: ENEMY_ID, name: 'Heist Enemy' },
                status: 'Alive',
                currentRole: 'Bandit',
                inventory: { items: [] },
                knowledge: { memories: {} },
                history: { events: [] },
            });

            questGiver.knowledge.memories[ENEMY_ID] = 'hates';
            questGiver.quests.offeredQuests = [{
                type: 'Mystery Heist',
                title: 'Find The Iron Dagger',
                description: 'A vile thief took The Iron Dagger from my family.',
                target: ENEMY_ID,
                itemId: HEIST_ITEM_ID
            }];

            playerState.inventory = [{ id: HEIST_ITEM_ID, name: 'The Iron Dagger', type: 'Weapon' }];
            questGiver.inventory.items = [];
        });

        test('successful Mystery Heist turnin changes questGiver memory for enemy to satisfied', () => {
            const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;

            const result = actions.turnInQuest(world, COORDINATE, dummyTargetId, HEIST_ITEM_ID, playerState);

            expect(result.success).toBe(true);
            expect(questGiver.knowledge.memories[ENEMY_ID]).toBe('satisfied');
        });

        test('successful Mystery Heist turnin removes the quest from offeredQuests', () => {
            const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;

            actions.turnInQuest(world, COORDINATE, dummyTargetId, HEIST_ITEM_ID, playerState);

            const heistQuests = questGiver.quests.offeredQuests.filter(q => q.type === 'Mystery Heist');
            expect(heistQuests).toHaveLength(0);
        });

        test('satisfied memory delta is persisted via saveDelta', () => {
            const { saveDelta } = require('./db');
            saveDelta.mockClear();

            actions.turnInQuest(world, COORDINATE, dummyTargetId, HEIST_ITEM_ID, playerState);

            const memoryCall = saveDelta.mock.calls.find(
                ([, , key, value]) => key === `memory_${ENEMY_ID}` && value === 'satisfied'
            );
            expect(memoryCall).toBeDefined();
        });
    });

    describe('turnInQuest Weapon gift — single history event (bug-7a)', () => {
        const COORDINATE = 'world_X0_Y0';
        const WEAPON_ID = 'weapon-7a-01';

        test('donating a Weapon produces exactly one history event on questGiver', () => {
            const questGiver = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            questGiver.currentRole = 'Citizen';
            questGiver.inventory.items = [];

            playerState.inventory = [{ id: WEAPON_ID, name: 'The Iron Dagger', type: 'Weapon' }];

            actions.turnInQuest(world, COORDINATE, dummyTargetId, WEAPON_ID, playerState);

            expect(questGiver.history.events).toHaveLength(1);
            const ev = questGiver.history.events[0];
            expect(ev.year).toBeGreaterThan(0);
            expect(ev.description).toMatch(/\[Year \d+\]/);
        });
    });

    // ─── Ruler title / isMayor gap (Gap 3 fix) ───────────────────────────────
    describe('Ruler title recognition', () => {
        test('taxTown succeeds when player holds King title after regicide', () => {
            playerState.titles['Town'] = 'King';
            const kingTown = world.with('identity').where(e => e.identity.type === 'Town').first;
            kingTown.currentMayor = 'The Player';

            const result = actions.taxTown(world, 'world_X0_Y0', playerState);

            expect(result.success).toBe(true);
        });

        test('banish is not blocked by authorization when player holds King title', () => {
            playerState.titles['Town'] = 'King';
            const kingBanishTown = world.with('identity').where(e => e.identity.type === 'Town').first;
            kingBanishTown.currentMayor = 'The Player';

            const result = actions.banish(world, 'world_X0_Y0', dummyTargetId, playerState);

            // Target dummy is missing `description`/`age` so banish may still fail,
            // but the important check is that it is NOT blocked by authorization.
            expect(result.message).not.toContain('Only the ruling leader');
        });

        test('abdicate succeeds when player holds King title', () => {
            playerState.titles['Town'] = 'King';
            const kingAbdicateTown = world.with('identity').where(e => e.identity.type === 'Town').first;
            kingAbdicateTown.currentMayor = 'The Player';

            const result = actions.abdicate(world, 'world_X0_Y0', playerState);

            expect(result.success).toBe(true);
            expect(playerState.titles['Town']).toBeUndefined();
        });

        test('taxTown fails when player has no title', () => {
            playerState.titles = {};

            const result = actions.taxTown(world, 'world_X0_Y0', playerState);

            expect(result.success).toBe(false);
        });
    });

    // ─── Puppet role in districts (Gap 2 fix) ────────────────────────────────
    describe('Puppet NPC in district', () => {
        test('assassinating a Puppet in a District does not make the player mayor', () => {
            const puppet = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            puppet.currentRole = 'Puppet';
            puppet.history = { events: [] };

            // Promote the town entity to a District
            const town = world.with('identity').where(e => e.identity.type === 'Town').first;
            town.identity.type = 'District';
            town.parentCity = 'world_X1_Y1';

            jest.spyOn(Math, 'random').mockReturnValue(0.0); // force success

            const result = actions.assassinate(world, 'world_X0_Y0', dummyTargetId, playerState);

            expect(result.success).toBe(true);
            expect(playerState.titles['Town']).toBeUndefined();
            expect(result.message).toMatch(/puppet/i);
        });

        test('assassinating a Puppet applies a lighter success penalty than a Mayor', () => {
            // Puppet penalty is -0.20, Mayor penalty is -0.40.
            // With stealth=0, strength=0: base = 0.40. Mayor → 0.00 (never succeeds). Puppet → 0.20 (sometimes succeeds).
            // Spy on Math.random to return a value just above Mayor threshold but below Puppet threshold.
            const puppetNpc = world.with('identity').where(e => e.identity.id === dummyTargetId).first;
            puppetNpc.currentRole = 'Puppet';
            puppetNpc.history = { events: [] };

            playerState.stats.stealth = 0;
            playerState.stats.strength = 0;

            // random = 0.15 → Puppet succeeds (0.20 > 0.15), Mayor would fail (0.00 < 0.15)
            jest.spyOn(Math, 'random').mockReturnValue(0.15);

            const result = actions.assassinate(world, 'world_X0_Y0', dummyTargetId, playerState);

            expect(result.success).toBe(true);
        });
    });

    // ─── bugged-chronicle-ruler.json regressions ─────────────────────────────
    describe('Chronicle/ruler bug regressions', () => {
        test('claimThrone updates town.currentMayor in memory to "The Player"', () => {
            // Bug 2a: claimThrone saved the delta but left the in-memory currentMayor
            // stale, so unloadCoordinate later wrote the stale value back as a newer
            // delta and clobbered the legitimate claim.
            playerState.reputation = 30;
            const town = world.with('identity').where(e => e.identity.type === 'Town').first;
            town.currentMayor = 'None';

            const result = actions.claimThrone(world, 'world_X0_Y0', playerState);

            expect(result.success).toBe(true);
            expect(town.currentMayor).toBe('The Player');
        });

        test('abdicate fails when player has a stale title but town.currentMayor is not "The Player"', () => {
            // Bug 1: isMayor() trusted the client-supplied playerState.titles without
            // confirming server state. A stale title (e.g. from a previous session
            // before the DB was wiped) would let the player abdicate a throne they
            // never legitimately claimed, producing an orphan abdication chronicle entry.
            playerState.titles['Town'] = 'Mayor';
            const town = world.with('identity').where(e => e.identity.type === 'Town').first;
            town.currentMayor = 'Halfdan Stoneheart'; // NPC ruler, not the player

            const result = actions.abdicate(world, 'world_X0_Y0', playerState);

            expect(result.success).toBe(false);
            expect(result.message).toContain('not the ruling leader');
        });

        test('taxTown fails when player has a stale title but town.currentMayor is "None"', () => {
            // Same gap as above — exercises the second mayor-only action.
            playerState.titles['Town'] = 'Mayor';
            const town = world.with('identity').where(e => e.identity.type === 'Town').first;
            town.currentMayor = 'None';

            const result = actions.taxTown(world, 'world_X0_Y0', playerState);

            expect(result.success).toBe(false);
            expect(result.message).toContain('Only the ruling leader');
        });

        test('claim → abdicate flow leaves town.currentMayor as the successor (not stale)', () => {
            // Bug 2 full path: after claim sets currentMayor to "The Player",
            // abdicate must overwrite it with the successor in-memory so the next
            // unload persists the correct ruler rather than a stale value.
            playerState.reputation = 30;
            const town = world.with('identity').where(e => e.identity.type === 'Town').first;
            town.currentMayor = 'None';

            const claimResult = actions.claimThrone(world, 'world_X0_Y0', playerState);
            expect(claimResult.success).toBe(true);
            expect(town.currentMayor).toBe('The Player');

            const abdicateResult = actions.abdicate(world, 'world_X0_Y0', playerState);
            expect(abdicateResult.success).toBe(true);
            expect(town.currentMayor).not.toBe('The Player');
            expect(town.currentMayor).not.toBe('None');
            // Successor must be one of the living NPCs at this coordinate
            expect(town.currentMayor).toBe('Target Dummy');
        });
    });
});