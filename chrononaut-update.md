# **Weaver: Backend Mechanics & Game Design Document**

**Theme:** The Chrononaut Update (v2.0)

## **1\. The Core Narrative Premise**

The player ("The Traveler") is a marooned chrononaut from a Type IV civilization (Year 1,000,000+). Their temporal drive is damaged: they can only skip *forward* in time. To the primitive inhabitants of this dark fantasy world, The Traveler is a timeless, immortal anomaly.

The core gameplay loop revolves around the player acting as the ultimate chaotic variable. The player cannot fight massive armies or build cities directly. Instead, they plant seeds (items, assassinations, wealth, ideas), trigger a time-skip, and use their "Ledger" (the UI) to observe how the butterfly effect reshaped the continent's history.

## **2\. New Mechanic: Economics & The Long Wealth**

**The Concept:** Economics over centuries isn't about daily trading; it's about generational hoarding, resource depletion, and macro-trade networks.

* **Resource Scarcity & Booms:** Every settlement has a primary economic driver based on its biome. The production specifications for the valid biomes are:  
  * **Mountain:** Iron / Stone  
  * **Forest:** Timber / Game  
  * **Desert:** Spice / Glass  
  * **Marsh:** Peat / Alchemical Herbs  
  * **Plains:** Grain / Livestock  
  * **Wilderness:** Furs / Exotic Foraged Goods

During a time-skip, the backend calculates the consumption vs. production. If a town over-produces, it triggers an Economic Boom (upgrading its tier). If it depletes its resource, it triggers a Famine or Depression.

* **The Vault & Time Capsules:** The Traveler can deposit coins or items with a specific NPC or bury a "Time Capsule" in a tile. The Traveler can place anything from their inventory (including money) into these capsules. During time-skips, these buried capsules have a chance to be discovered by the locals over time.  
  * *Deterministic Event Triggers:* \* **Wealth Compound (Gold):** Giving Gold (G) to a lower-class NPC triggers an interest formula over the Time Skip (ΔT). If Gx(1.02)^ΔT \> 10000, the backend forcibly spawns a new Banking Guild faction assigned to the NPC's descendants, and the host settlement's tier is incremented by \+1. **History Marker:** The NPC's lineage permanently gains a history entry citing "the mysterious seed coin from a stranger," and the town's Chronicle logs the exact year the Guild was founded.  
    * **Capsule Discovery Check:** Every Time Capsule rolls for discovery during a time-skip using the formula: Discovery\_Chance(%) \= Min(95, (ΔT \* 0.5) \+ (Settlement\_Population / 10)).  
    * **Relic Unearthing (Weapon):** If a Time Capsule containing a Tier 3+ Weapon is discovered, it adds the Militaristic trait to the closest settlement, multiplying its defense score by the weapon's Tier, and enabling the automatic conquest/claiming of 1d4 adjacent macro-map tiles. **History Marker:** The town's Chronicle records the unearthing of an "ancient weapon of the gods" that rallied their armies.  
    * **Relic Unearthing (Tome):** If a Time Capsule containing a Tier 3+ Tome is discovered, it adds the Scholarly trait to the nearest settlement, immediately forcing an upgrade of the town's architecture (e.g., stone-paved streets, stone walls) and applying a permanent \+50% modifier to the settlement's base resource production. **History Marker:** The town's Chronicle details the discovery of "sacred lost texts" that enlightened their architects.  
    * **Relic Unearthing (Gold):** If a Time Capsule containing Gold (G) is discovered, it injects sudden, unearned liquid wealth into the local economy (the "Gold Rush" effect). If G \> 5000 , the nearest settlement triggers an immediate Economic Boom (tier \+1). However, it applies the Hyperinflation trait, reducing the value of their primaryExport by 75% for the next 100 years as locals abandon industry. If the town lacks a strong Merchant or Magistrate presence to stabilize the economy, it gains a 40% chance to collapse into a Ruin on the subsequent time-skip. **History Marker:** The town's Chronicle logs the "Great Unearthing," detailing the exact year the gold was found and the subsequent era of greed or ruin.  
* **Macro Trade Routes:** Settlements are connected by invisible trade routes. If the Traveler assassinates a key Merchant in a hub city, the trade route collapses during the time-skip, causing neighboring outposts to starve and turn into Ruins.  
* **Ruin Looting (Temporal Arbitrage):** When a settlement turns into a Ruin, 50% of its current regionalWealth and all local artifacts are locked into a Ruin Hoard. The Traveler can extract this wealth via a "Scavenge" action, yielding 1d10 x 100  Gold and a 10%  base chance to recover a lost Tier 2+ item.  
* **Backend Requirements:** \* Add regionalWealth, primaryExport, and tradePartners to the Settlement schema.  
  * Create a simulate\_economy(years) function that calculates wealth growth, inflation, and starvation over time.

## **3\. Upgraded Mechanic: Folklore & Mythos**

**The Concept:** The backend must recognize the impossibility of the Traveler's existence and generate procedural "Folklore" based on their actions.

* **Temporal Exposure:** Every time the Traveler interacts with a town, its temporalExposure counter increases by a specific, deterministic amount based on the severity of the anomaly:  
  * **Talk / Gossip / Bribe:** \+1  
  * **Steal / Pickpocket:** \+3  
  * **Complete Quest / Trade:** \+5  
  * **Bury Time Capsule / Vault Deposit:** \+10  
  * **Assassination / Public Murder:** \+20  
* **Myth Generation:** During a time-skip, if temporalExposure \> 50, the backend spawns a local myth.  
  * *Violent Player:* The town generates a lore entry about "The Shadow That Never Ages," and future generations gain a fear modifier against the Traveler. Merchants charge a massive "paranoia tax" (inflating prices by 200%), and town population growth slows. However, the town's heightened fear makes future Intimidate or Assassinate actions 50% more likely to succeed.  
  * *Benevolent Player:* The town spawns a Cult that worships "The Timeless Savior." This introduces the **"Tithe" Economy**. The Cult continuously hoards wealth and local resources for the Traveler's return. The value and rarity of the tithe scale linearly with the length of the time-skip (ΔT).  
* **Mythological Decay:** Myths are not permanent. For every 50 years skipped without Traveler interaction in that specific tile, temporalExposure decreases by 25%. If temporalExposure drops below 20,  Cults automatically disband (members revert to default roles) and Fear taxes are nullified.  
  * **History Marker:** "The old tales faded into children's stories."  
* **Backend Requirements:** \* Add a mythos object to the Town schema tracking local reputation, active legends, and cults, plus an erosion\_check() during the time-skip loop.

## **4\. Upgraded Mechanic: Generational Bloodlines**

**The Concept:** Grudges and loyalties must outlive the individual to make time-skips impactful.

* **Memory Inheritance:** When an NPC dies, their high-intensity memories (loves, hates) are passed down to their children or close faction members, mutating into ancestral\_ally or blood\_feud.  
* **Faction Spawning:** If a blood feud against the Traveler (or another family) survives for more than 50 years, the backend groups those descendants into a named "House" or "Faction."  
* **Backend Requirements:** \* Inside the advance\_time loop, run a propagate\_memories() function that transfers unresolved memories to the next generation before setting the NPC to "Dead".

## **5\. New Mechanic: Temporal Smuggling (The Relic Economy)**

**The Concept:** Items need to experience time differently than the player.

* **Provenance Tracking:** If the player drops a basic item in a time capsule and skips forward 300 years, that item becomes an artifact.  
* **The Relic Modifier:** When the backend calculates item values, it checks Current Year \- creationYear.  
  * \> 100 years \= Gains the Ancient prefix.  
  * \> 300 years \= Becomes a Relic. Its monetary value multiplies exponentially.  
* **Backend Requirements:** \* Every item requires a creationYear, originSettlement, and historicalSignificance field.

## **6\. Upgraded Mechanic: The Butterfly Effect (Causal Crises)**

**The Concept:** The Traveler's micro-actions must trigger macro-events during the advance\_time calculation.

* **Crisis Triggers:** \* *Power Vacuum:* If the player assassinates three consecutive leaders of a FullCity, the city fractures into two warring Hamlets during the skip.  
  * *Golden Age:* If the player gives an Ancient Relic to a Scholar and skips 100 years, the town experiences a technological Renaissance, instantly upgrading its walls to stone and expanding its borders.  
* **Backend Requirements:** \* A robust event-listener system inside the temporal simulation loop that checks for threshold breaches.

## **7\. New Mechanic: Temporal Commerce (Trading with Merchants)**

**The Concept:** The Traveler can exchange currency and items directly with Merchant NPCs.

* *Deterministic Event Triggers:*  
  * **Market Depletion:** If the Traveler purchases \> 80%  of a Merchant's stock of the town's primaryExport, the town immediately gains the Shortage status. On the next time-skip, the town has a 60% chance to drop 1 Tier as supply chains fail, or a 40% chance to permanently pivot its primaryExport. **History Marker:** The Chronicle logs "The Great Resource Famine."  
  * **Merchant Ascendancy:** Selling a Relic (an item \> 300  years old) to a Merchant increases that NPC's personalWealth by Value x 5 . If the Merchant's wealth reaches \> 15000 G, they automatically overthrow the current leadership during the time-skip, transforming the town into a Plutocracy. **History Marker:** "The Era of the Merchant Kings."  
* **Backend Requirements:** \* Add inventory and personalWealth arrays to specific NPCs. Create a /api/trade endpoint.

## **8\. New Mechanic: Artifact Seeding (Giving Items to NPCs)**

**The Concept:** The Traveler can gift an item from their inventory directly to an NPC, binding it to their bloodline.

* *Deterministic Event Triggers:*  
  * **Heirloom Designation:** An item gifted to an NPC permanently becomes a Family Heirloom. For every 50 years that pass, the descendant's base influence stat increases by \+10. **History Marker:** The NPC's lineage log attaches the "Sacred Gift" prefix to the inherited item.  
  * **Role Forcing:** Gifting a Weapon forces descendants to spawn as Guard or Hero. A Tome forces Scholar or Cultist. High-Value Jewelry forces Merchant or Mayor.  
  * **Class Uprising:** Gifting a Tier 3+ Weapon or Tome to a low-tier NPC (Beggar, Bandit, Citizen) guarantees a Rebellion event during the next time-skip. The current ruling Faction is overthrown, the settlement loses 20%  of its population, and the recipient's descendants become the new ruling faction. **History Marker:** "The otherworldly artifact granted to the downtrodden."  
* **Backend Requirements:** \* Add a gift\_item endpoint and propagate\_heirlooms() loop.

## **9\. New Mechanic: The Conversation Engine & Bloodline Oaths**

**The Concept:** By engaging in Dialog with NPCs, the Traveler extracts hidden data, revealing relationship networks, quests, and core personality traits.

* **Information Extraction (The "Talk" Action):** Engaging an NPC costs 1 Temporal Exposure. It deterministically reveals 1d3  hidden data nodes:  
  * *Node 1: Memories & Grudges.* Reveals a specific love or hate target.  
  * *Node 2: Legacy Quests.* Reveals a specific task.  
  * *Node 3: Core Ambition.* Reveals the internal drive.  
* **Legacy Quests (Bloodline Oaths):** Traditional quests expire when the quest-giver dies. In Weaver, accepting a quest bounds it as a Bloodline Oath.  
  * *Inheritance:* The Oath passes down to the quest-giver's direct descendants.  
  * *Temporal Multiplier:* Completing an Oath after ΔT \> 50  years proves the player is a mythic entity. The payout is calculated as: Reward \= Base\_Reward \* (1 \+ (ΔT / 50)).  
  * *Mythic Injection:* Fulfilling an ancient Oath instantly generates \+15  temporalExposure. **History Marker:** "The fulfillment of the ancestral pact."  
* **Backend Requirements:** \* Add a dialog\_nodes array to the NPC schema. Update quest structures to attach to Faction/Lineage rather than an individual NPC\_ID.

## **10\. New Mechanic: Generational Ambitions & Time-Skip Agency**

**The Concept:** An NPC's Ambition acts as a behavioral script executed by the backend's simulation loop over ΔT . Success is calculated via: Agency \= (Base\_Influence \+ Personal\_Wealth \+ Artifact\_Bonus).

* **Ambition Types & Deterministic Executions:**  
  * **Content (No Ambition):** Increases the town's Stability rating by \+1  per decade. Reduces the town's overall chance of falling into Ruin by 10%. **History Marker:** "A long era of uneventful peace."  
  * **Ascension (Become Ruler):** \* *Pacific Path:* If Agency \> 100, the lineage takes control. The town upgrades to a Magistrate. **History Marker:** "The Bloodless Transition of Power."  
    * *Violent Path:* If Agency \< 100 but the lineage possesses a gifted Weapon, they stage a coup. Town drops 1 Tier. **History Marker:** "The Violent Usurpation."  
  * **Avarice (Earn Money):** If successful ( Agency \> 80), they drain the town's primaryExport by 50% to multiply their personalWealth, risking *Market Depletion*. **History Marker:** "The Monopolization of \[Resource\]."  
  * **Legacy (Have Family/Dynasty):** Multiplies their descendant spawn rate by 3x , artificially inflating the town's population, risking a Famine. **History Marker:** "The Population Surge of \[FamilyName\]"  
  * **Vengeance:** The survival chance of the hated lineage is calculated as Survival\_Chance \= Max(0,100 \- (ΔT x 2)). If 0 , the rival lineage is wiped. **History Marker:** "The Culmination of the \[Name\] Vendetta."  
  * **Artifact Hunter:** Permanently adds \+40% to the Discovery\_Chance formula for any buried Time Capsule in the tile. **History Marker:** "The Great Excavation led by \[NPCName\]”  
* **Backend Requirements:** \* Add an ambition enum to the NPC schema.

## **11\. New Mechanic: World Expansion (Pioneering & Reclamation)**

**The Concept:** Without a way to build new towns, the map will eventually suffer a "heat death" of empty ruins.

* **Pioneer Factions:** If a settlement reaches Tier \>= 4 (Magistrate/Kingdom) AND experiences an Economic Boom AND has at least 1 adjacent empty/Wilderness tile, it spawns a Pioneer faction. During the time-skip, this faction founds a new Tier 1 Town on the adjacent tile, sharing a trade route with the parent city.  
  * **History Marker:** "The Great Expansion ordered by \[Ruler Name\]”  
* **Ruin Reclamation:** If an NPC with the Content or Ascension ambition achieves High Influence ( \> 80\)  and lives adjacent to a Ruin tile, they have a 20% chance per decade to lead an expedition to rebuild it. If successful, the Ruin becomes a Tier 1 Town and the NPC's lineage becomes the new ruling faction.  
  * **History Marker:** "The Reclaiming of the Ash-Lands."  
* **Backend Requirements:** \* Add tile-adjacency checks to the advance\_time macro-loop to allow grid population to expand.

## **12\. New Mechanic: Temporal Integrity (The Lose Condition)**

**The Concept:** The Traveler cannot skip time infinitely. They require a resource to fuel their damaged temporal drive, creating intense strategic friction.

* **Chronal Energy (CE):** The player has a maximum capacity of 100 CE.  
* **The Cost of Skipping:** Initiating a time-skip costs 1 CE per 10 years skipped.  
* **Energy Harvesting:** The Traveler must absorb energy from "Historical Divergences" (major timeline alterations caused by their actions).  
  * \+10 CE: A new settlement is founded due to player wealth injection.  
  * \+15 CE: A ruling faction is overthrown via a player-supplied weapon.  
  * \+20 CE: A Time Capsule Relic is unearthed.  
  * \+25 CE: An ancient Bloodline Oath is fulfilled.  
* **Temporal Grounding:** If Chronal Energy reaches 0,  the temporal drive stalls out. The Traveler is temporarily stranded in the current era and cannot skip time. To jumpstart the drive, the player must manually orchestrate a "Present-Day Divergence" (e.g., directly assassinating a ruler, bribing a faction into rebellion, or exhausting local resources through trade) to harvest a baseline charge of CE.  
* **Backend Requirements:** \* Add chronalEnergy to the Player state. Deduct on the /api/skip endpoint, and aggregate divergence scores during the simulation calculation to refund energy.