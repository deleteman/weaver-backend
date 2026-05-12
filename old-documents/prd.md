# Product Requirements Document: Project Weaver
**Version:** 3.0 (The Living World Update)
**Product Type:** Just-In-Time Procedural RPG Engine (Backend API)

## 1. Executive Summary
Project Weaver is a stateless, coordinate-based procedural RPG engine. Unlike traditional RPGs that simulate an entire world simultaneously, Weaver uses a Just-In-Time (JIT) generation architecture. When a player visits a coordinate `(X, Y)`, the engine uses deterministic hashing to generate a town, populate it with NPCs, and simulate decades of history in milliseconds. By layering a lightweight SQLite database (tracking "Deltas") over a deterministic generation sequence, the engine creates the illusion of a massive, persistent, living universe while using near-zero idle server resources.

## 2. Goals & Objectives
* **Infinite Exploration:** Generate a mathematically infinite amount of playable space without requiring manual level design.
* **Emergent Narrative:** Drive gameplay through deeply simulated NPC relationships (love, childbirth, blood feuds, inheritance) rather than static, pre-written quests.
* **Strict Determinism:** Ensure that hitting the same coordinate at the same point in time always yields the exact same world state, artifacts, and NPC IDs.
* **Stateless Client Interaction:** The backend must remain completely stateless regarding the player. The frontend is responsible for storing and sending the `playerState` (inventory, stats, titles) with every action.

---

## 3. Core Architecture

### 3.1. Entity Component System (ECS)
The engine utilizes `miniplex` to manage entities. Every actor, town, and child in the game is an entity composed of specific data components:
* `Identity`: Holds the Name, Type, and a deterministic UUID.
* `Location`: Links an entity to an X/Y coordinate and a Parent Entity (Town).
* `History`: An array of chronologically stamped string events.
* `Knowledge`: A `memories` object linking NPC UUIDs to relationship statuses (`loves`, `hates`, `child`, `parent`, `mourns`, `avenged`).
* `Inventory`: An array of dynamically generated Artifact objects.
* `Status`: Tracks physical presence (`Alive`, `Dead`, `Migrated`, `Exiled`).

### 3.2. Universal Time & The JIT Catch-Up
Time is universal and stored in the SQLite database under the `GLOBAL` namespace (`globalYear`). 
When a chunk is loaded:
1. **Base Pass:** Generates the town and founders at Year 1.
2. **Legends Pass:** Simulates 50 years of baseline history.
3. **Delta Application:** Loads database changes (thefts, player assassinations, player-given roles) to alter the deterministic base.
4. **Future Pass:** Calculates `globalYear - 51`. If greater than 0, it simulates the "catch up" years so the town perfectly syncs with the current global timeline.

---

## 4. Feature Specifications

### 4.1. NPC Life Simulation
The engine must simulate a believable lifecycle for generated NPCs during the History passes.
* **Aging & Growth:** NPCs age yearly. Children reach adulthood at age 16, dynamically altering their descriptions.
* **Social Dynamics:** Unmarried adults can form bonds or fall in love. Rivals can start blood feuds.
* **Reproduction:** Married NPCs have a yearly probability of generating a new Child entity. The child inherits a deterministic UUID based on the coordinate, name, and birth year.
* **Mortality & Inheritance:** NPCs have a natural death chance. Upon death, their inventory passes directly to a living spouse or child. If no heirs exist, items remain in their "Tomb" for the player to loot.
* **Autonomous Migration:** Entire family units have a chance to pack up and migrate to random universal coordinates, leaving a "ghost" record in their origin town and an `immigrant_data` Delta at their destination.

### 4.2. Dynamic Artifact System
Standard item strings are replaced with a rich Object-Oriented artifact generator.
* **Deterministic Forging:** Artifact UUIDs, names, and descriptions are hashed using the coordinate, year, and finder's name.
* **Types:** * `Tome`: Generates readable `content` (creepy lore, secrets, recipes).
  * `Jewelry`: Modifies NPC roles (e.g., turning them into Cultists if gifted).
  * `Weapon`: Modifies NPC roles (e.g., turning them into Heroes if gifted).
  * `Relic`: Generates bizarre atmospheric descriptions.

### 4.3. Procedural Quest Engine
Quests are not randomly assigned; they are strictly derived from the `Knowledge` and `Inventory` states of NPCs.
* **Bounties:** If an NPC `"hates"` a living target, they generate an assassination quest. Turning in the dead target's UUID changes the memory to `"avenged"`.
* **Mystery Heists:** If an NPC `"hates"` a living target who possesses an artifact, they ask the player to retrieve the item. Requires detective work (reading the Chronicle) to locate the target.
* **Fetch Quests:** Scholars with empty inventories dynamically request *any* artifact of type `Tome`.

### 4.4. Political Engine
The player can manipulate the power structure of any loaded coordinate.
* **Claiming Power:** If the Mayor is dead and the player has `reputation > 20`, they can claim the throne. The simulation blocks NPCs from staging a coup while the player holds the title.
* **Decrees & Taxation:** Mayors can change NPC roles, banish citizens to random coordinates, and legally confiscate items from the population at the cost of extreme reputation damage.

### 4.5. The Chronicle Summarizer
A dedicated endpoint that scrapes the `History` components of the Town and all localized NPCs, parses the `[Year X]` regex tags, and returns a fully chronological, human-readable timeline of the coordinate's entire existence.

---

## 5. API Interface Contract

### 5.1. World & Exploration
* `GET /api/chunk/:x/:y`
  * **Function:** Runs the JIT simulation and returns the current chunk state.
  * **Data:** Exposes `globalYear`, `town` metadata, and an array of `population` (filtering out Migrated/Exiled entities).
* `GET /api/chunk/:x/:y/chronicle`
  * **Function:** Returns the aggregated history timeline for UI display.

### 5.2. Core Actions (POST)
*All actions require `x, y, target (UUID), playerState` in the JSON body.*
* `/api/action/steal` - Compares Player Stealth vs. RNG. Confiscates player items on failure.
* `/api/action/assassinate` - Checks Player Strength/Stealth. Major reputation hit if caught. Can destabilize town leadership.
* `/api/action/loot_tomb` - Extracts items from NPCs with `status: "Dead"`.
* `/api/action/turnin` - Evaluates presence of `itemId` to determine if processing a Fetch/Heist (item exchange) or a Bounty (UUID death verification).
* `/api/action/advance_time` - Increments the DB's `globalYear`, forcing universal aging on the next chunk load.

### 5.3. Mayor Actions (POST)
*Requires `playerState.titles["TownName"] === "Mayor"`*
* `/api/action/claim` - Takes an empty throne.
* `/api/action/tax` - Loops through living NPCs and steals 1 item from each.
* `/api/action/decree` - Changes target `currentRole`.
* `/api/action/banish` - Changes target status to `Exiled` and pushes an immigrant Delta to a random coordinate.
* `/api/action/abdicate` - Triggers a peaceful NPC election to replace the player.

---

## 6. Global Progression System
The player accrues global, cross-coordinate titles attached to their `playerState.titles["Global"]` object based on gameplay milestones:
* **Master Thief:** Awarded after successfully executing 5 thefts.
* **Master Assassin:** Awarded after successfully reporting 3 completed Bounties.

---

## 7. Data Persistence (SQLite Deltas)
Because the world is generated on the fly, only changes to the deterministic base are saved to `world_deltas.db`.
* **Primary Key Concept:** `coordinate` (e.g., `world_X10_Y10`) + `entity_name` (UUID) + `state_key` (e.g., `inventory`, `status`, `memory_UUID`).
* **Global Namespace:** Universal properties, such as `currentYear`, are saved with the coordinate `GLOBAL` to ensure they persist regardless of the player's physical location.

---

## 8. Future Considerations (Post-v3.0)
* **Inter-Chunk Travel Engine:** NPCs that migrate currently teleport to their destination. Future iterations could simulate travel time, allowing the player to intercept migrating families in the wilderness.
* **Dynamic Town Visuals:** Passing the `chronicle` output to an LLM to generate a rich, prose-based physical description of the town's architecture based on its violent or peaceful history.
* **Economy System:** Introducing currency, shopkeepers, and randomized artifact pricing based on town wealth.