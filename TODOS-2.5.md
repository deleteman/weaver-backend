## 23. The Ghost Traveler — Procedural Narrative Engine (v2.5)
**Difficulty**: High | **Impact**: Very High

**What**: A procedurally generated, overarching narrative "Golden Path." A previous time-traveler has left a trail of clues (Ghost Logs) across time and space. The story, clues, and locations are generated deterministically using a unique seed tied to the player, meaning the backend does not need to store pre-placed items. Clues are recovered via Ruin Excavation (`loot_tomb`) or through guarded generational secrets (`talk`).

**Why it matters**: Sandbox games need a long-term goal for when intrinsic motivation wanes. The Ghost Traveler provides a compelling mystery that organically teaches core mechanics (economics, bloodlines, time-skips) and acts as a massive Chronal Energy (CE) sink and reward system, all without violating the JIT procedural engine rules.

**Player State Schema Additions** (Client-side / `players` DB table):
```js
{
  "ghostSeed": "traveler_9f8a2", // Generated once per save file via crypto.randomUUID()
  "ghostProgress": 0             // Int tracking the current clue step (0 to ~10)
}

```

**Mechanic 1: The Blueprint & Tracery Generator** (`src/ghost.js` - New File)
Create a deterministic function that takes the `ghostSeed` and `ghostProgress` to generate the current objective and the narrative text.

```js
export function getGhostObjective(playerState) {
  // Use seedrandom to ensure this player ALWAYS gets the same arc sequence
  const rng = seedrandom(`${playerState.ghostSeed}_step_${playerState.ghostProgress}`);
  
  // Determine if the current clue is hidden in a Ruin or held by a Bloodline
  const isArcheological = rng() > 0.5; 

  return {
    type: isArcheological ? 'ruin' : 'bloodline',
    targetBiome: ['Desert', 'Forest', 'Mountain'][Math.floor(rng() * 3)],
    targetRole: isArcheological ? null : ['Merchant', 'Blacksmith', 'Scholar'][Math.floor(rng() * 3)],
    // Tracery generates the actual text of the log found in the PREVIOUS step
    clueText: generateGhostText(rng, playerState.ghostProgress) 
  };
}

```

**Mechanic 2: Ruin Excavation** (`src/actions.js` update to `loot_tomb`):
When a player loots a tier 0 Ruin, the engine checks if the current Ghost Objective aligns with the tile.

```js
const objective = getGhostObjective(playerState);
if (objective.type === 'ruin' && town.biome === objective.targetBiome) {
  // Base 15% chance to find the clue if in the correct biome ruin
  if (rng() < 0.15) {
    playerState.ghostProgress += 1;
    event = { 
      type: 'GHOST_LOG_FOUND', 
      text: objective.clueText,
      rewardCE: 25 // Refuel the player for their next jump
    };
    appendJournalEntry({ action: 'ghost_clue', summary: "Unearthed a Ghost Log from the ruins." });
  }
}

```

**Mechanic 3: Bloodline Dialogue** (`src/dialogue.js` update to `generateDialogNodes`):
When generating an NPC's dialog nodes, check if they match the Ghost Traveler's social criteria.

```js
const objective = getGhostObjective(playerState);
if (objective.type === 'bloodline' && town.biome === objective.targetBiome && npc.role === objective.targetRole) {
  // Deterministically check if this SPECIFIC lineage was chosen
  const lineageRng = seedrandom(`${playerState.ghostSeed}_lineage_${npc.lineageId}`);
  if (lineageRng() < 0.10) { // 10% of matching roles in this biome hold the secret
    npc.dialogNodes.push({
      type: 'ghost_secret',
      revealed: false,
      content: { text: "My ancestors were told to wait for you..." }
    });
  }
}

```

*Note: When the player uses `/api/action/talk` and reveals a `ghost_secret` node, `playerState.ghostProgress` increments and the Tracery-generated clue text is returned to the client.*

**Where to look**:

* `src/ghost.js` (New) — Houses `getGhostObjective()` and the Tracery grammar dictionaries for the Ghost Logs.
* `src/actions.js` — Update `loot_tomb` to roll for the `ruin` objective. Update `talk` to process `ghost_secret` node reveals and increment `ghostProgress`.
* `src/dialogue.js` — Inject `ghost_secret` nodes into specific NPCs during JIT generation based on the deterministic lineage check.
* `src/player.js` / Player Creation — Ensure `ghostSeed` is securely initialized on a new game.

**Tests** (`src/ghost.test.js`):

* `getGhostObjective({ ghostSeed: "test", ghostProgress: 1 })` returns the exact same objective object every time it is called.
* Two different `ghostSeed` strings return completely different narrative arcs.
* `loot_tomb` in the correct biome increments `ghostProgress` and returns the `GHOST_LOG_FOUND` event payload.
* `generateDialogNodes` successfully injects a `ghost_secret` node for the deterministically "chosen" lineage.
