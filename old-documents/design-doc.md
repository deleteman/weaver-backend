## Project Overview
**Codename:** Project Weaver
**Core Concept:** A fully deterministic, server-side narrative engine that generates deeply simulated locations, characters, and histories Just-In-Time (JIT) based on player coordinates and interactions.
**Design Philosophy:** Math over magic. The world relies entirely on seeded pseudo-random number generation (PRNG) and Entity-Component System (ECS) architecture to ensure consistent, unbreakable lore without the use of AI.

---

## 1. Technology Stack
* **Environment:** Node.js
* **ECS Framework:** `miniplex` (A lightweight, fast Entity-Component System for JavaScript).
* **RNG Engine:** `seedrandom` (Overrides `Math.random` to ensure deterministic outputs based on string seeds).
* **Grammar Engine:** `tracery-grammar` (Compiles data state into readable dialogue and descriptions).
* **Database (Delta Storage):** `sqlite3` or `leveldb` (Used exclusively to save world modifications, not the generated world itself).

---

## 2. Core Architecture: The "Seed & Delta" Concept
To achieve infinite scale without infinite storage, the system uses the **Seed & Delta** architecture.

The engine does not save generated worlds. It generates them from a mathematical seed on the fly. It only saves the **Deltas** (the changes the player makes). 

**The JIT Resolution Order:**
1.  Player enters Coordinate X:10, Y:15.
2.  Engine runs the world generator using the seed `"world_X10_Y15"`.
3.  Engine loads the newly generated entities into the ECS memory.
4.  Engine checks the Delta Database for this coordinate.
5.  Engine applies Deltas (e.g., "Overwrite NPC Urist's status to 'Dead'").
6.  World is served to the player.

---

## 3. Entity-Component System (ECS) Design
Everything in the world—towns, NPCs, historical events, items—is an Entity. Entities are just ID numbers. Components attach raw data to those IDs. 

### Core Components Table
| Component Name | Data Payload | Purpose |
| :--- | :--- | :--- |
| `Identity` | `name` (string), `type` (enum) | Defines what the entity is (NPC, Town, Item). |
| `Location` | `x` (int), `y` (int), `parent_id` (int) | Defines global map coordinates and nested locations (e.g., inside a specific tavern). |
| `Relationships` | `friends` (array), `enemies` (array) | Stores arrays of other Entity IDs to map out the social web. |
| `Knowledge` | `known_facts` (array of strings) | Tracks what the entity knows (e.g., `["artifact_location_142", "murder_event_55"]`). |
| `Inventory` | `items` (array of ints) | Stores IDs of item entities held by an NPC or stored in a location. |
| `State` | `is_alive` (bool), `mood` (string) | Tracks volatile state conditions for interaction gating. |

---

## 4. The Historical Simulation Loop (The "Legends" Pass)
When a player visits a location for the first time, the engine must simulate its past to give it depth.

**The Execution Flow:**
1.  **Initialize Base State:** Generate the location at Year 0.
2.  **Define Simulation Ticks:** Determine how many years to simulate (e.g., 50 years).
3.  **Run Event Systems:** For each year tick, the ECS runs specific rulesets.
4.  **Event: Migration:** A seeded roll checks if new NPCs arrive.
5.  **Event: Conflict:** A seeded roll checks if factions at the location generate a war event.
6.  **Event: Artifact Creation:** A seeded roll checks if a resident crafts a notable item.
7.  **Finalize State:** The simulation stops at the present year, leaving behind generated ruins, heirlooms, and grudges.

---

## 5. The Dialogue & Quest Generation Engine
Quests and dialogue are not hardcoded; they are reflections of the ECS state parsed through Tracery templates.

**The Interaction Flow:**
1.  Player initiates dialogue with Entity 45 (Blacksmith).
2.  Engine queries Entity 45's `Knowledge` and `State` components.
3.  Engine detects a missing requirement: Blacksmith wants Item Entity 99 (Iron), but Item 99 is at Location X:12 (Goblin Camp).
4.  Engine builds a data object based on these facts.
5.  Engine injects the data object into a Tracery syntax tree.
6.  Tracery parses the grammar: `"I need [ItemName]. It was taken to [LocationName]."`
7.  The string is delivered to the player.

---

## 6. Directory Structure
A clean separation of concerns is vital for a project of this complexity.

* `/src/core/` (Holds the game loop, ECS initialization, and PRNG logic)
* `/src/components/` (Defines all data structures for ECS)
* `/src/systems/` (Holds the logic loops: `combatSystem`, `historySystem`, `relationshipSystem`)
* `/src/generators/` (Holds the grammar rules, name generators, and Tracery logic)
* `/src/database/` (Handles saving and loading the Delta states)

---

---

## 8. Fog of War: Mini-Map Feature (The "Spatial Visibility" System)

The Problem: Players traveling via D-Pad have no visibility into adjacent tiles. Moving blind through the world feels like stumbling through a dark room without knowing what biomes, towns, or ruins surround them.

The Solution: A lightweight Mini-Map UI that reveals adjacent tiles without running the full population simulation. This provides intentionality and strategic travel planning.

### 8.1. Backend: The Map Metadata Endpoint
A new endpoint efficiently generates just the metadata (biome, town name, ruler) of surrounding tiles:

**Endpoint:** `GET /api/map/:x/:y/:radius`
* **Parameters:**
  * `x` (int): Player's current X coordinate
  * `y` (int): Player's current Y coordinate
  * `radius` (int): Radius of the mini-map grid (3x3 uses radius=1, 5x5 uses radius=2)
* **Response:** A 2D grid of tile metadata with minimal computational overhead.

### 8.2. Tile Metadata Structure
Each tile in the mini-map returns:
* `x` (int): Tile X coordinate
* `y` (int): Tile Y coordinate
* `biome` (string): The dominant environmental type (`"Wilderness"`, `"Forest"`, `"Desert"`, `"Mountain"`, `"Marsh"`)
* `hasTown` (bool): Whether this coordinate contains a town
* `townName` (string or null): The deterministically generated town name if `hasTown === true`
* `ruler` (string or null): The current Mayor/Ruler of the town if `hasTown === true`
* `isDiscovered` (bool): Whether the player has previously visited this coordinate

### 8.3. Biome Determination
Biomes are seeded based on the coordinate and X/Y offset. A simple algorithm determines the dominant biome type without running the full simulation:
```
const biome = determineBiome(x, y, rng);
```

The function uses the coordinate-specific RNG to roll from the predefined biome table based on the coordinate's fractional X/Y values.

### 8.4. Performance Optimization
The endpoint is designed to be *extremely* fast:
* **No ECS Instantiation:** Metadata is calculated via pure functions, not entity generation.
* **No Delta Lookups (for basic metadata):** The endpoint generates metadata deterministically and can optionally check Deltas only for the player's current tile (full chunk) or the Center tile of the radius.
* **Caching Potential:** The response is deterministic and could be cached on the frontend.

---

## 9. Immediate Development Roadmap

**Phase 1: The Foundation**
* Initialize Node project.
* Implement `seedrandom` and verify consistent PRNG outputs.
* Set up `miniplex` and define the basic `Identity` and `Location` components.

**Phase 2: The Generator**
* Write a script that takes a coordinate (e.g., 0,0) and generates a static town with 5 NPCs.
* Implement `tracery-grammar` to generate names and descriptions for these NPCs based on the seed.

**Phase 3: The JIT Engine**
* Create a simple console interface allowing you to "move" coordinates.
* Ensure moving to 1,0 generates new data, and moving back to 0,0 generates the *exact same* initial data.

**Phase 4: The Delta System**
* Implement a SQLite database.
* Create a command to "kill" an NPC.
* Ensure leaving the coordinate and returning maintains the NPC's "dead" state.

**Phase 5: The Mini-Map Feature**
* Implement lightweight tile metadata generation (`determineBiome`, town name lookup).
* Create the `GET /api/map/:x/:y/:radius` endpoint.
* Write comprehensive unit tests for deterministic biome generation and tile metadata accuracy.
* Integrate mini-map data into existing ECS workflow without performance degradation.
