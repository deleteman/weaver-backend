// src/snapshot.js
// ECS state serialization / deserialization for snapshot checkpointing.
// Snapshots capture the deterministic simulation state (post-Future Pass, pre-Delta Pass).
// Player mutations (Delta Pass) are NOT included — they are always re-applied fresh from SQLite.

const SERIALIZABLE_NPC_FIELDS = [
    'identity', 'location', 'description', 'status', 'currentRole',
    'age', 'birthYear', 'sex', 'biome',
    'history', 'knowledge', 'inventory', 'quests',
    'memories', 'ancestralMemories',
    'personalWealth', 'merchantInventory',
];

const SERIALIZABLE_TOWN_FIELDS = [
    'identity', 'location', 'history', 'currentMayor',
    'political', 'population', 'regionalWealth', 'primaryExport',
    'tradePartners', 'economicModifiers', 'politicalStance', 'demographics',
    'mythos',
    // District-only fields (undefined for Towns — safe to include):
    'districtType', 'parentCity',
];

const SERIALIZABLE_FACTION_FIELDS = [
    'identity', 'location', 'members', 'history',
    'targetLineage', 'factionType', 'foundedYear', 'rootAncestor',
];

function pickFields(entity, fields) {
    const result = {};
    for (const field of fields) {
        if (entity[field] !== undefined) {
            result[field] = entity[field];
        }
    }
    return result;
}

function serializeLocation(entity) {
    // parentId is an entity-object reference — not JSON-serializable and never read downstream.
    return { x: entity.location.x, y: entity.location.y, parentId: null };
}

/**
 * Serialize all ECS entities at (x, y) to a plain JSON-serializable state blob.
 * Excludes player-caused mutations — those stay in the Delta Pass.
 *
 * @param {import('miniplex').World} world
 * @param {number} x
 * @param {number} y
 * @returns {{ npcs: object[], towns: object[], factions: object[] }}
 */
function serializeECSState(world, x, y) {
    const npcs = Array.from(
        world.with('identity', 'location')
            .where(e => e.identity.type === 'NPC' && e.location.x === x && e.location.y === y)
    );

    const towns = Array.from(
        world.with('identity', 'location')
            .where(e =>
                (e.identity.type === 'Town' || e.identity.type === 'District') &&
                e.location.x === x && e.location.y === y
            )
    );

    const factions = Array.from(
        world.with('identity', 'location')
            .where(e => e.identity.type === 'Faction' && e.location.x === x && e.location.y === y)
    );

    return {
        npcs: npcs.map(npc => {
            const data = pickFields(npc, SERIALIZABLE_NPC_FIELDS);
            data.location = serializeLocation(npc);
            return data;
        }),
        towns: towns.map(town => {
            const data = pickFields(town, SERIALIZABLE_TOWN_FIELDS);
            data.location = serializeLocation(town);
            return data;
        }),
        factions: factions.map(faction => {
            const data = pickFields(faction, SERIALIZABLE_FACTION_FIELDS);
            data.location = serializeLocation(faction);
            return data;
        }),
    };
}

/**
 * Restore ECS entities at a coordinate from a previously serialized state blob.
 * Call this instead of the Base Pass + Legends Pass + Future Pass chain.
 *
 * @param {import('miniplex').World} world
 * @param {{ npcs: object[], towns: object[], factions: object[] }} stateBlob
 */
function deserializeECSState(world, stateBlob) {
    for (const town of stateBlob.towns) {
        world.add({ ...town });
    }
    for (const npc of stateBlob.npcs) {
        world.add({ ...npc });
    }
    for (const faction of stateBlob.factions) {
        world.add({ ...faction });
    }
}

module.exports = { serializeECSState, deserializeECSState };
