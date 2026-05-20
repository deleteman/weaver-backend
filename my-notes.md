
## no single towns by year 50, everything's bigger than simple towns by the time the game starts.

## Bug-1: when assessinating the mayor of a district
killing the mayor, when it works, doesn't turn you into mayor.
why is that? should I even be seeing a mayor in a district?

## Feature idea: have an underlying story where very randomly you find items or mystery time capsules in the town you visit, that leads to you different towns in different times. Each one disclosing the story of another traveler, who's been going through the same as you and living you clues.


## Reputation doesn't seem to be updated based on the current settlement.
Is the reputation shared across all settlements owned by the same parent tile? 
We need to improve the way we showcase this to make it obvious.

## ~~Improv-1: npcs have no sex, let's implement it, and have children only come from heterosexual couples, but let's still have homosexual couples available.~~  DONE

## Improv-2: child npcs should have factions similar to that of their parents

## Improv-3: re-architect the solution to enable for infinite simulation, instead of capping at MAX_FUTURE_YEARS for performance reasons.

## Improv-4: Improve overall tests coverage

## Improv-5: npcs should have levels , we need to further define this.

## ~~bug-3: looting tombs now starts wrong action, it returns ruin looting.~~ DONE
Looting tombs should still function independently from looting ruins.

## ~~bug-4: selling to an npc returns an empty inventory on the npc:~~ DONE
The response contains "npcInventory": [],

## ~~bug-5: killing an NPC that's loved by others doesn't trigger the mourning event in those other npcs.~~ DONE
Seems like this is only triggered when the death is done through time advancement and not by player action.


## ~~bug 6: quest turn in triggered events are not prperly added to the histoyr of the npc:~~
they're added as strings instead of structured objects.
also the initial "arrived as a refugee" event should be an object aswell.
  ],
                "history": [
                    "[Year 60] Arrived as a refugee seeking shelter.",
                    {
                        "id": "ev_abd9a311",
                        "year": 62,
                        "description": "[Year 62] Fell deeply in love with Thrain Blackthorn.",
                        "type": "romance",
                        "causedBy": null
                    },
                    {
                        "id": "ev_c0df4e6a",
                        "year": 64,
                        "description": "[Year 64] Was heartbroken by the loss of their love.",
                        "type": "grief",
                        "causedBy": {
                            "id": "ev_56d61d83",
                            "year": 63,
                            "description": "[Year 63] passed away peacefully in their sleep.",
                            "type": "death",
                            "actorName": "Thrain Blackthorn"
                        }
                    },
                    {
                        "id": "ev_4ddc23c1",
                        "year": 66,
                        "description": "[Year 66] Started a bitter blood feud with Rashid Ravenwood.",
                        "type": "rivalry",
                        "causedBy": null
                    },
                    {
                        "id": "ev_e47864ef",
                        "year": 67,
                        "description": "[Year 67] Started a bitter blood feud with Hadwin Stonewall.",
                        "type": "rivalry",
                        "causedBy": null
                    },
                    {
                        "id": "ev_5ebf7f2f",
                        "year": 68,
                        "description": "[Year 68] Fell deeply in love with Bogdan Stormwall.",
                        "type": "romance",
                        "causedBy": null
                    },
                    {
                        "id": "ev_d3bbc7f1",
                        "year": 71,
                        "description": "[Year 71] Became a Guard.",
                        "type": "career_shift",
                        "causedBy": null
                    },
                    {
                        "id": "ev_a1d76602",
                        "year": 72,
                        "description": "[Year 72] Discovered The Bone Codex in the wilderness.",
                        "type": "artifact_discovery",
                        "causedBy": null
                    },
                    {
                        "id": "ev_1cd8959f",
                        "year": 74,
                        "description": "[Year 74] Seized power and became the new Mayor.",
                        "type": "power_seizure",
                        "causedBy": null
                    },
                    {
                        "id": "ev_daa44042",
                        "year": 84,
                        "description": "[Year 84] Formed a strong bond with Ivar Blackveil.",
                        "type": "friendship",
                        "causedBy": null
                    },
                    {
                        "id": "ev_114b4ef6",
                        "year": 91,
                        "description": "[Year 91] Became a Merchant.",
                        "type": "career_shift",
                        "causedBy": null
                    },
                    {
                        "id": "ev_ffa12295",
                        "year": 96,
                        "description": "[Year 96] Became a Bandit.",
                        "type": "career_shift",
                        "causedBy": null
                    },
                    {
                        "id": "ev_83c4bccb",
                        "year": 103,
                        "description": "[Year 103] Started a bitter blood feud with Fenwick Marshborn.",
                        "type": "rivalry",
                        "causedBy": null
                    },
                    "Was touched by the power of the The Astral Urn and converted to Cultism.",
                    "The The Astral Urn transformed the entire town's spiritual alignment.",
                    {
                        "id": "ev_e1f6e5fa",
                        "year": 106,
                        "description": "[Year 106] Received The Astral Urn from a traveler and was transformed into a Cultist.",
                        "type": "career_shift",
                        "causedBy": null
                    }

## ~~bug-7: Strange behavior on mystery heist quests: ~~ DONE
### 1.mystery items quests are generating 2 events, but one is not formatted correctly:
The first event has "year": 0 and the description is missing the "[Year XXX]" part.
Example:
    {
                        "id": "ev_61ac56e9",
                        "year": 0,
                        "description": "Wielded the The Iron Dagger and rose to power as a Guard.",
                        "type": "career_shift",
                        "causedBy": null
                    },
                    {
                        "id": "ev_c62c84e9",
                        "year": 151,
                        "description": "[Year 151] Received The Iron Dagger from a traveler and was transformed into a Guard.",
                        "type": "career_shift",
                        "causedBy": null
                    }
### 2. Infinite quest loop
Moreover, after turning it in, the new chunk from the turnin endpoint returns the same quest in the same npc (and the npc I stole it from, has it again):
"quests": [
                    {
                        "type": "Mystery Heist",
                        "title": "Find The Iron Manifesto",
                        "description": "A vile thief took The Iron Manifesto from my family. Find who has it and bring it to me.",
                        "target": "65361fa9f29f",
                        "itemId": "c36dd2c095ec"
                    }
                ],


## ~~bug-2: people are not aging properly, in year 1924 I have a npc that arrived at year 550 and is only 18 years old.~~ DONE

npc: brynn greymantle

```json
{
  "globalYear": 1924,
  "coordinate": {
    "x": 0,
    "y": 2
  },
  "town": {
    "name": "Ironford",
    "type": "District",
    "districtType": "Market",
    "parentCity": "world_X0_Y0",
    "ruler": "Unknown",
    "tier": 1,
    "population": 9,
    "history": [
      "[Year 1] Established as a Market district under world_X0_Y0.",
      {
        "id": "ev_15cc1380",
        "year": 121,
        "description": "[Year 121] A district administrator was slain by a traveler, but the parent city's rule endures.",
        "type": "assassination",
        "causedBy": null
      }
    ],
    "politicalStance": "Balanced"
  },
  "population": [
    {
      "id": "b3b03290ef0d",
      "name": "Caius Swiftblade",
      "age": 44,
      "role": "Bandit",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "blue",
        "skinTone": "olive",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "dark brown",
          "length": "long",
          "style": "tied back"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "bare",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "cheek",
            "type": "brand"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_33e128c4",
          "year": 4,
          "description": "[Year 4] Formed a strong bond with Rowan Winterborne.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_e0cb6397",
          "year": 6,
          "description": "[Year 6] Started a bitter blood feud with Vesna Marshborn.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f5746137",
          "year": 11,
          "description": "[Year 11] Started a bitter blood feud with Brynn Rockhollow.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_a4a68546",
          "year": 14,
          "description": "[Year 14] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c5501686",
          "year": 19,
          "description": "[Year 19] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "a55c35693757": "likes",
        "df47c38f0b3e": "hates",
        "eda8264ef0a2": "hates",
        "9c06b5bed816": "loves"
      }
    },
    {
      "id": "91bce97f54ad",
      "name": "Lyra Nighthollow",
      "age": 43,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "fair",
        "height": "average",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "cropped",
          "style": "curly"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wool cap",
          "torso": "leather vest",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "94ff9b36f98d",
          "name": "The Astral Manifesto",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the lineage of the First Mayor. Scrawled frantically in the margins is a handwritten note: \"I hear the dirt breathing.\"",
          "creationYear": 9,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 459,
          "value": 459
        },
        {
          "id": "03506524e607",
          "name": "The Astral Signet",
          "type": "Jewelry",
          "description": "A piece of adornment that is heavy with ancient malice.",
          "content": null,
          "creationYear": 13,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 503,
          "value": 503
        },
        {
          "id": "32f008661eb4",
          "name": "The Ethereal Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail a recipe for immortal soup. Scrawled frantically in the margins is a handwritten note: \"Blood is the only currency.\"",
          "creationYear": 14,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 264,
          "value": 264
        },
        {
          "id": "0877ef328835",
          "name": "The Iron Blade",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 21,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 413,
          "value": 413
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_995f0f31",
          "year": 2,
          "description": "[Year 2] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_db4bb501",
          "year": 4,
          "description": "[Year 4] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_265ed2ca",
          "year": 8,
          "description": "[Year 8] Started a bitter blood feud with Rowan Winterborne.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_c3ad20bf",
          "year": 9,
          "description": "[Year 9] Discovered The Astral Manifesto in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_a4de1a12",
          "year": 13,
          "description": "[Year 13] Discovered The Astral Signet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_51de37a1",
          "year": 14,
          "description": "[Year 14] Discovered The Ethereal Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_8d80e32c",
          "year": 16,
          "description": "[Year 16] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8c243aa7",
          "year": 21,
          "description": "[Year 21] Discovered The Iron Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_0ce1a675",
          "year": 23,
          "description": "[Year 23] Formed a strong bond with Brynn Rockhollow.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_288a3b02",
          "year": 24,
          "description": "[Year 24] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "a55c35693757": "hates",
        "eda8264ef0a2": "likes"
      }
    },
    {
      "id": "a55c35693757",
      "name": "Rowan Winterborne",
      "age": 76,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "tan",
        "height": "average",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "shaved sides"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [
          {
            "location": "neck",
            "type": "brand"
          },
          {
            "location": "neck",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_8ddddbe4",
          "year": 2,
          "description": "[Year 2] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_54f7c3ca",
          "year": 3,
          "description": "[Year 3] Discovered The Obsidian Manifesto in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_e113d4b2",
          "year": 4,
          "description": "[Year 4] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_68d9de95",
          "year": 10,
          "description": "[Year 10] Discovered The Ethereal Grimoire in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_fea0dd33",
          "year": 13,
          "description": "[Year 13] Discovered The Astral Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_34c9b191",
          "year": 20,
          "description": "[Year 20] Formed a strong bond with Lyra Nighthollow.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_1666bef3",
          "year": 20,
          "description": "[Year 20] Was ousted from the Mayor's office by Carwyn Coldwater.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_5649a954",
            "year": 20,
            "description": "[Year 20] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Carwyn Coldwater"
          }
        },
        {
          "id": "ev_c4fa7240",
          "year": 24,
          "description": "[Year 24] Started a bitter blood feud with Ivar Blackveil.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_7873b3eb",
          "year": 28,
          "description": "[Year 28] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_bf8cc444",
          "year": 33,
          "description": "[Year 33] Welcomed their child, Gwyn Highkeep.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_8136206d",
          "year": 35,
          "description": "[Year 35] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_e183af3a",
          "year": 35,
          "description": "[Year 35] Was ousted from the Mayor's office by Brynn Rockhollow.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_13ed6837",
            "year": 35,
            "description": "[Year 35] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Brynn Rockhollow"
          }
        }
      ],
      "memories": {
        "91bce97f54ad": "likes",
        "470d0b3999a2": "hates",
        "6f22b101a73b": "loves",
        "d15ccd8e78b8": "child"
      }
    },
    {
      "id": "533caa5c1a08",
      "name": "Aldric Ashbrook",
      "age": 33,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "tan",
        "height": "tall",
        "build": "heavyset",
        "baldness": true,
        "hair": {
          "color": "red",
          "length": "long",
          "style": "tied back"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "leather hood",
          "torso": "wool tunic",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "right hand",
            "type": "brand"
          },
          {
            "location": "forehead",
            "type": "birthmark"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_3240c58d",
          "year": 1,
          "description": "[Year 1] Formed a strong bond with Lyra Nighthollow.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_49f8b4f3",
          "year": 8,
          "description": "[Year 8] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "91bce97f54ad": "likes"
      }
    },
    {
      "id": "9987a846d0e2",
      "name": "Declan Darkwater",
      "age": 48,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "olive",
        "height": "average",
        "build": "muscular",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "thinning",
          "style": "curly"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "veil",
          "torso": "silk robe",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "back",
            "motif": "eye"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "b93719638107",
          "name": "The Void Signet",
          "type": "Jewelry",
          "description": "A piece of adornment that is whispering faintly when held near the ear.",
          "content": null,
          "creationYear": 12,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 451,
          "value": 451
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_1707c062",
          "year": 2,
          "description": "[Year 2] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_705c5d89",
          "year": 3,
          "description": "[Year 3] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_db4bb501",
          "year": 4,
          "description": "[Year 4] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_459ea3dc",
          "year": 6,
          "description": "[Year 6] Formed a strong bond with Aldric Ashbrook.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_e87e87d5",
          "year": 7,
          "description": "[Year 7] Started a bitter blood feud with Caius Swiftblade.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_b64da810",
          "year": 11,
          "description": "[Year 11] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_b0df445c",
          "year": 12,
          "description": "[Year 12] Discovered The Void Signet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_08567001",
          "year": 14,
          "description": "[Year 14] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ebadce74",
          "year": 15,
          "description": "[Year 15] Started a bitter blood feud with Rowan Winterborne.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_2676891f",
          "year": 17,
          "description": "[Year 17] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "533caa5c1a08": "likes",
        "b3b03290ef0d": "hates",
        "a55c35693757": "hates"
      }
    },
    {
      "id": "eda8264ef0a2",
      "name": "Brynn Rockhollow",
      "age": 71,
      "role": "Mayor",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "fair",
        "height": "tall",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "grey",
          "length": "long",
          "style": "straight"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "none",
          "torso": "silk robe",
          "legs": "chainmail chausses",
          "feet": "leather shoes",
          "accessory": "fur-lined cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_f9a3a8de",
          "year": 11,
          "description": "[Year 11] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_96c524b8",
          "year": 22,
          "description": "[Year 22] Discovered The Void Ring in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_b6ca4acc",
          "year": 26,
          "description": "[Year 26] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c3141537",
          "year": 28,
          "description": "[Year 28] Fell deeply in love with Selwyn Dawnbringer.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_e104b958",
          "year": 32,
          "description": "[Year 32] Started a bitter blood feud with Rowan Winterborne.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_13ed6837",
          "year": 35,
          "description": "[Year 35] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_3ef6c0bd",
          "year": 35,
          "description": "[Year 35] Welcomed their child, Caspian Dawnbringer.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_745451f2",
          "year": 40,
          "description": "[Year 40] Formed a strong bond with Soraya Brightwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_623cd0c1",
          "year": 45,
          "description": "[Year 45] Welcomed their child, Fiona Dawnbringer.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_db62ab7f",
          "year": 46,
          "description": "[Year 46] Started a bitter blood feud with Ivar Blackveil.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_b91162f9",
          "year": 46,
          "description": "[Year 46] Welcomed their child, Helga Dawnbringer.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_ceaae03d",
          "year": 49,
          "description": "[Year 49] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "cacf8a632395": "loves",
        "a55c35693757": "hates",
        "ed0767d0eba3": "child",
        "42b6e47ca023": "likes",
        "ac4ef56196e2": "child",
        "470d0b3999a2": "hates",
        "acc89ad92349": "child"
      }
    },
    {
      "id": "9c06b5bed816",
      "name": "Zara Stonecroft",
      "age": 49,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "ebony",
        "height": "average",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "shoulder-length",
          "style": "wavy"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "none",
          "torso": "silk robe",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "silk sash"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "left hand",
            "motif": "eye"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_f744d58d",
          "year": 18,
          "description": "[Year 18] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_b0c583d3",
          "year": 19,
          "description": "[Year 19] Fell deeply in love with Caius Swiftblade.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_9505ffb4",
          "year": 20,
          "description": "[Year 20] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_c5501686",
            "year": 19,
            "description": "[Year 19] died of a sudden fever.",
            "type": "death",
            "actorName": "Caius Swiftblade"
          }
        },
        {
          "id": "ev_0e6984f6",
          "year": 22,
          "description": "[Year 22] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_b12cd04e",
          "year": 24,
          "description": "[Year 24] Started a bitter blood feud with Thorvald Highkeep.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f37fa00b",
          "year": 25,
          "description": "[Year 25] Welcomed their child, Grom Brightwater.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_823a49e5",
          "year": 26,
          "description": "[Year 26] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_9d9072a8",
          "year": 27,
          "description": "[Year 27] Discovered The Astral Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_287eb8b5",
          "year": 30,
          "description": "[Year 30] Welcomed their child, Ulf Brightwater.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_debdb3cf",
          "year": 33,
          "description": "[Year 33] Welcomed their child, Ingrid Brightwater.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_8136206d",
          "year": 35,
          "description": "[Year 35] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "b3b03290ef0d": "mourns",
        "42b6e47ca023": "loves",
        "6f22b101a73b": "hates",
        "01c96ca2ea7f": "child",
        "062901ba4233": "child",
        "1b8f4f0e814d": "child"
      }
    },
    {
      "id": "552fe21b42d7",
      "name": "Thorvald Blackwood",
      "age": 26,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "fair",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "red",
          "length": "shoulder-length",
          "style": "curly"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "veil",
          "torso": "wool tunic",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "left hand",
            "type": "brand"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 20] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_a0eb398f",
          "year": 22,
          "description": "[Year 22] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "42b6e47ca023",
      "name": "Soraya Brightwater",
      "age": 87,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "pale",
        "height": "average",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "straight"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "iron helm",
          "torso": "plate breastplate",
          "legs": "chainmail chausses",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "left forearm",
            "motif": "crossed swords"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 20] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_9c90e154",
          "year": 22,
          "description": "[Year 22] Fell deeply in love with Zara Stonecroft.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_7dd61b7a",
          "year": 23,
          "description": "[Year 23] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_30c6650e",
          "year": 24,
          "description": "[Year 24] Formed a strong bond with Selwyn Dawnbringer.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_eaad36ff",
          "year": 25,
          "description": "[Year 25] Had a child named Grom Brightwater with Zara Stonecroft.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_abbc74f8",
          "year": 26,
          "description": "[Year 26] Started a bitter blood feud with Rowan Winterborne.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_fa9ace9c",
          "year": 30,
          "description": "[Year 30] Had a child named Ulf Brightwater with Zara Stonecroft.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_74fee74a",
          "year": 31,
          "description": "[Year 31] Discovered The Ethereal Pendant in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_d7b72c16",
          "year": 33,
          "description": "[Year 33] Had a child named Ingrid Brightwater with Zara Stonecroft.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_5f2a5a31",
          "year": 35,
          "description": "[Year 35] Inherited belongings from the late Zara Stonecroft.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_8136206d",
            "year": 35,
            "description": "[Year 35] was killed by a wild beast.",
            "type": "death",
            "actorName": "Zara Stonecroft"
          }
        },
        {
          "id": "ev_d407c93a",
          "year": 35,
          "description": "[Year 35] Started a bitter blood feud with Ivar Blackveil.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_942f93e0",
          "year": 36,
          "description": "[Year 36] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_8136206d",
            "year": 35,
            "description": "[Year 35] was killed by a wild beast.",
            "type": "death",
            "actorName": "Zara Stonecroft"
          }
        },
        {
          "id": "ev_dd6407ca",
          "year": 46,
          "description": "[Year 46] Started a bitter blood feud with Selwyn Dawnbringer.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_c33c1cb0",
          "year": 51,
          "description": "[Year 51] Discovered The Crimson Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_9c21ae7a",
          "year": 56,
          "description": "[Year 56] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_2e3db6e6",
          "year": 59,
          "description": "[Year 59] Discovered The Bone Pendant in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_73f09ae0",
          "year": 62,
          "description": "[Year 62] Started a bitter blood feud with Thorvald Highkeep.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_95b7bdee",
          "year": 66,
          "description": "[Year 66] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_3c62f0d7",
          "year": 73,
          "description": "[Year 73] Formed a strong bond with Brennan Grimsword.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_92ab841d",
          "year": 77,
          "description": "[Year 77] Discovered The Obsidian Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_63f26b9d",
          "year": 78,
          "description": "[Year 78] Formed a strong bond with Kael Ravenwood.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_5a1d22f7",
          "year": 80,
          "description": "[Year 80] Formed a strong bond with Sigrid Starfall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_26fbc517",
          "year": 81,
          "description": "[Year 81] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "9c06b5bed816": "mourns",
        "cacf8a632395": "hates",
        "01c96ca2ea7f": "child",
        "a55c35693757": "hates",
        "062901ba4233": "child",
        "1b8f4f0e814d": "child",
        "470d0b3999a2": "hates",
        "bc8919c1b8de": "loves",
        "6f22b101a73b": "hates",
        "f3cdd11c116c": "likes",
        "3b8c28679fd2": "likes",
        "ae1298df8783": "likes"
      }
    },
    {
      "id": "1b8f4f0e814d",
      "name": "Ingrid Brightwater",
      "age": 13,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "brown",
        "height": "short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "dark brown",
          "length": "cropped",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "leather hood",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "worn boots",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_ec638981",
          "year": 45,
          "description": "[Year 45] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "42b6e47ca023": "parent",
        "9c06b5bed816": "parent"
      }
    },
    {
      "id": "696454aaa2b8",
      "name": "Bogdan Oakmere",
      "age": 36,
      "role": "Beggar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "blue",
        "skinTone": "brown",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "blond",
          "length": "short",
          "style": "wavy"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_d4fafa28",
          "year": 37,
          "description": "[Year 37] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_1556e5de",
          "year": 40,
          "description": "[Year 40] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_b8e72b88",
          "year": 43,
          "description": "[Year 43] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ce7bfbba",
          "year": 46,
          "description": "[Year 46] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "3184dcb61922",
      "name": "Faelan Blackveil",
      "age": 33,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "fair",
        "height": "tall",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "brown",
          "length": "short",
          "style": "shaved sides"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "leather hood",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [
          {
            "location": "neck",
            "type": "bite"
          },
          {
            "location": "right forearm",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_ac91cbea",
          "year": 40,
          "description": "[Year 40] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_578466a3",
          "year": 44,
          "description": "[Year 44] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "acc89ad92349",
      "name": "Helga Dawnbringer",
      "age": 3,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "fair",
        "height": "very short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "dark brown",
          "length": "cropped",
          "style": "tied back"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "wool tunic",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [
          {
            "location": "left hand",
            "type": "brand"
          }
        ],
        "tattoos": [],
        "marks": [
          {
            "location": "forehead",
            "type": "brand"
          },
          {
            "location": "left hand",
            "type": "mole"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_d183c087",
          "year": 48,
          "description": "[Year 48] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "cacf8a632395": "parent",
        "eda8264ef0a2": "parent"
      }
    },
    {
      "id": "45818dc5b65c",
      "name": "Dragan Coldmere",
      "age": 33,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "dark brown",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "dark brown",
          "length": "short",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_dfaa6499",
          "year": 56,
          "description": "[Year 56] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_a82c8fc0",
          "year": 58,
          "description": "[Year 58] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_ace7de8d",
          "year": 60,
          "description": "[Year 60] Started a bitter blood feud with Thorvald Highkeep.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_61467c61",
          "year": 61,
          "description": "[Year 61] Was ousted from the Mayor's office by Selwyn Dawnbringer.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_20e7b097",
            "year": 61,
            "description": "[Year 61] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Selwyn Dawnbringer"
          }
        },
        {
          "id": "ev_61c986c9",
          "year": 63,
          "description": "[Year 63] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "6f22b101a73b": "hates",
        "ac4ef56196e2": "loves"
      }
    },
    {
      "id": "ae1298df8783",
      "name": "Sigrid Starfall",
      "age": 50,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "fair",
        "height": "average",
        "build": "average",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "thinning",
          "style": "straight"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "crown",
          "torso": "plate breastplate",
          "legs": "linen skirt",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "cheek",
            "type": "ritual scar"
          }
        ]
      },
      "dead": true,
      "inventory": [
        {
          "id": "0a9b06ed407d",
          "name": "The Void Lantern",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it smells of ozone and dried blood.",
          "content": null,
          "creationYear": 70,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 397,
          "value": 397
        },
        {
          "id": "a95301e73476",
          "name": "The Ethereal Dagger",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 85,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 444,
          "value": 444
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_6100ef9d",
          "year": 61,
          "description": "[Year 61] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_afad1a94",
          "year": 64,
          "description": "[Year 64] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_6f41875c",
          "year": 70,
          "description": "[Year 70] Discovered The Void Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_41ec2ddd",
          "year": 71,
          "description": "[Year 71] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_d358873c",
          "year": 75,
          "description": "[Year 75] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e1888cd2",
          "year": 76,
          "description": "[Year 76] Formed a strong bond with Petra Stonewall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_6cccb006",
          "year": 77,
          "description": "[Year 77] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_d4e2e6e4",
          "year": 81,
          "description": "[Year 81] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_5c639079",
          "year": 85,
          "description": "[Year 85] Discovered The Ethereal Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_a5a59a6f",
          "year": 89,
          "description": "[Year 89] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "435890a7e687": "likes"
      }
    },
    {
      "id": "f3cdd11c116c",
      "name": "Brennan Grimsword",
      "age": 53,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "fair",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "short",
          "style": "wavy"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "wool cap",
          "torso": "padded gambeson",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 70] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_506d03b3",
          "year": 72,
          "description": "[Year 72] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_883edb38",
          "year": 76,
          "description": "[Year 76] Discovered The Bone Codex in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ba3ae0cf",
          "year": 76,
          "description": "[Year 76] Welcomed their child, Caspian Starfall.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_f16c0e6f",
          "year": 79,
          "description": "[Year 79] Discovered The Iron Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_4130d127",
          "year": 81,
          "description": "[Year 81] Formed a strong bond with Soraya Brightwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_6e4b1a38",
          "year": 84,
          "description": "[Year 84] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_5b8bf629",
          "year": 86,
          "description": "[Year 86] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_4de3cef5",
          "year": 90,
          "description": "[Year 90] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e64ac227",
          "year": 93,
          "description": "[Year 93] Welcomed their child, Caius Starfall.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_82c0f8ab",
          "year": 94,
          "description": "[Year 94] Welcomed their child, Sylas Starfall.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_4a380101",
          "year": 95,
          "description": "[Year 95] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "ad6150a8c0ef": "loves",
        "92b6a9eba7bb": "child",
        "42b6e47ca023": "likes",
        "69500d403cf0": "child",
        "55da4ab17f15": "child"
      }
    },
    {
      "id": "69c9dff2cff7",
      "name": "Radovan Frostbeard",
      "age": 54,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "fair",
        "height": "average",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "short",
          "style": "tied back"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [
          {
            "location": "left cheek",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 70] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_8f54c62c",
          "year": 72,
          "description": "[Year 72] Started a bitter blood feud with Sigrid Starfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_e52313a2",
          "year": 74,
          "description": "[Year 74] Discovered The Void Ring in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_631a8200",
          "year": 81,
          "description": "[Year 81] Formed a strong bond with Kael Ravenwood.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_f32ec1e8",
          "year": 82,
          "description": "[Year 82] Had a child named Vex Frostbeard with Azhar Highkeep.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_1c652faf",
          "year": 83,
          "description": "[Year 83] Formed a strong bond with Sven Stormgate.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_7c0f453c",
          "year": 84,
          "description": "[Year 84] Started a bitter blood feud with Brennan Grimsword.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_54fa45dc",
          "year": 87,
          "description": "[Year 87] Had a child named Radovan Frostbeard with Azhar Highkeep.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_38800cfd",
          "year": 89,
          "description": "[Year 89] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_0d59fb62",
          "year": 90,
          "description": "[Year 90] Started a bitter blood feud with Ingrid Starfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_e8426b75",
          "year": 94,
          "description": "[Year 94] Had a child named Helga Frostbeard with Azhar Highkeep.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_fb83b891",
          "year": 98,
          "description": "[Year 98] Formed a strong bond with Kael Swiftblade.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_4187cb54",
          "year": 99,
          "description": "[Year 99] Started a bitter blood feud with Caius Starfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f7605540",
          "year": 105,
          "description": "[Year 105] Was ousted from the Mayor's office by Sven Stormgate.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_da70535c",
            "year": 105,
            "description": "[Year 105] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Sven Stormgate"
          }
        },
        {
          "id": "ev_6645b15c",
          "year": 106,
          "description": "[Year 106] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "ae1298df8783": "hates",
        "767bccc0b60b": "loves",
        "3b8c28679fd2": "likes",
        "dd4d72627d13": "child",
        "ede40b2bfbe1": "likes",
        "f3cdd11c116c": "hates",
        "d2caaa7aaca5": "child",
        "ad6150a8c0ef": "hates",
        "1e54ddb9d178": "child",
        "89daf2ef5b4b": "likes",
        "69500d403cf0": "hates"
      }
    },
    {
      "id": "767bccc0b60b",
      "name": "Azhar Highkeep",
      "age": 104,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "olive",
        "height": "tall",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "straight"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "73cc074adeb2",
          "name": "The Bone Lantern",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 74,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 361,
          "value": 361
        },
        {
          "id": "45ea01bee3ba",
          "name": "The Astral Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the true names of stars. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 91,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 295,
          "value": 295
        },
        {
          "id": "2ccb077ed473",
          "name": "The Obsidian Lantern",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 100,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 296,
          "value": 296
        },
        {
          "id": "9dc0c42b17a6",
          "name": "The Astral Blade",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 104,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 274,
          "value": 274
        },
        {
          "id": "15d5ff92a1e4",
          "name": "The Void Ring",
          "type": "Jewelry",
          "description": "A piece of adornment that is whispering faintly when held near the ear.",
          "content": null,
          "creationYear": 74,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 602,
          "value": 602
        },
        {
          "id": "8e9a7ae2b08e",
          "name": "The Astral Urn",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it causes shadows to bend towards it.",
          "content": null,
          "creationYear": 112,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 481,
          "value": 481
        },
        {
          "id": "d1f18f228341",
          "name": "The Ethereal Dagger",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 116,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 450,
          "value": 450
        },
        {
          "id": "10724a0ccb92",
          "name": "The Bone Manifesto",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the true names of stars. Scrawled frantically in the margins is a handwritten note: \"Do not trust the guards.\"",
          "creationYear": 114,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 359,
          "value": 359
        },
        {
          "id": "ff79e4967a19",
          "name": "The Void Ring",
          "type": "Jewelry",
          "description": "A piece of adornment that is freezing cold to the touch.",
          "content": null,
          "creationYear": 126,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 255,
          "value": 255
        },
        {
          "id": "e4c79c6329d6",
          "name": "The Crimson Pendant",
          "type": "Jewelry",
          "description": "A piece of adornment that is pulsing with a faint, sickly light.",
          "content": null,
          "creationYear": 142,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 605,
          "value": 605
        }
      ],
      "quests": [],
      "history": [
        "[Year 70] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_69facc64",
          "year": 72,
          "description": "[Year 72] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_41ca9312",
          "year": 74,
          "description": "[Year 74] Discovered The Bone Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ffd70faa",
          "year": 77,
          "description": "[Year 77] Fell deeply in love with Radovan Frostbeard.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_5e448ecc",
          "year": 82,
          "description": "[Year 82] Welcomed their child, Vex Frostbeard.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_02c8a3ca",
          "year": 87,
          "description": "[Year 87] Welcomed their child, Radovan Frostbeard.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_2a061382",
          "year": 91,
          "description": "[Year 91] Discovered The Astral Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_f70509fa",
          "year": 94,
          "description": "[Year 94] Welcomed their child, Helga Frostbeard.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_5bf0d358",
          "year": 97,
          "description": "[Year 97] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_170a920d",
          "year": 100,
          "description": "[Year 100] Discovered The Obsidian Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_4708a310",
          "year": 104,
          "description": "[Year 104] Discovered The Astral Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_c2be4205",
          "year": 106,
          "description": "[Year 106] Inherited belongings from the late Radovan Frostbeard.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_6645b15c",
            "year": 106,
            "description": "[Year 106] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Radovan Frostbeard"
          }
        },
        {
          "id": "ev_d7af73be",
          "year": 107,
          "description": "[Year 107] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_6645b15c",
            "year": 106,
            "description": "[Year 106] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Radovan Frostbeard"
          }
        },
        {
          "id": "ev_f9e802d7",
          "year": 109,
          "description": "[Year 109] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a2e6d2c5",
          "year": 111,
          "description": "[Year 111] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ce844928",
          "year": 112,
          "description": "[Year 112] Discovered The Astral Urn in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_9a42bad1",
          "year": 116,
          "description": "[Year 116] Discovered The Ethereal Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_56fa1364",
          "year": 118,
          "description": "[Year 118] Inherited belongings from the late Caius Starfall.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_4fd3d8c1",
            "year": 118,
            "description": "[Year 118] was killed by a wild beast.",
            "type": "death",
            "actorName": "Caius Starfall"
          }
        },
        {
          "id": "ev_bbce8baf",
          "year": 119,
          "description": "[Year 119] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_4fd3d8c1",
            "year": 118,
            "description": "[Year 118] was killed by a wild beast.",
            "type": "death",
            "actorName": "Caius Starfall"
          }
        },
        {
          "id": "ev_c65c7578",
          "year": 120,
          "description": "[Year 120] Formed a strong bond with Zorya Greymantle.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_7f22276b",
          "year": 122,
          "description": "[Year 122] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_702fc029",
          "year": 125,
          "description": "[Year 125] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a4186c5d",
          "year": 126,
          "description": "[Year 126] Discovered The Void Ring in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_cd6f533a",
          "year": 131,
          "description": "[Year 131] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_e121bdfb",
          "year": 136,
          "description": "[Year 136] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_bef5d889",
          "year": 141,
          "description": "[Year 141] Started a bitter blood feud with Elowen Stormgate.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_12c31771",
          "year": 142,
          "description": "[Year 142] Discovered The Crimson Pendant in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_e3f64b43",
          "year": 143,
          "description": "[Year 143] Started a bitter blood feud with Astrid Dawnbringer.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f0450975",
          "year": 146,
          "description": "[Year 146] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_87dfd223",
          "year": 147,
          "description": "[Year 147] Packed their belongings and migrated to coordinates X:96, Y:90.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_81143753",
          "year": 121,
          "description": "[Year 121] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "69c9dff2cff7": "mourns",
        "dd4d72627d13": "child",
        "d2caaa7aaca5": "child",
        "1e54ddb9d178": "child",
        "69500d403cf0": "mourns",
        "e0357e27f0a0": "likes",
        "33f378348755": "hates",
        "1f57692d26c0": "hates"
      }
    },
    {
      "id": "435890a7e687",
      "name": "Petra Stonewall",
      "age": 28,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "pale",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "chestnut",
          "length": "cropped",
          "style": "shaved sides"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "none",
          "torso": "silk robe",
          "legs": "wool breeches",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "74251bf86546",
          "name": "The Astral Blade",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 75,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 177,
          "value": 177
        }
      ],
      "quests": [],
      "history": [
        "[Year 70] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_ea343e99",
          "year": 75,
          "description": "[Year 75] Discovered The Astral Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_b423401a",
          "year": 76,
          "description": "[Year 76] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "ad6150a8c0ef",
      "name": "Ingrid Starfall",
      "age": 100,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "olive",
        "height": "tall",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "braided"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "plate breastplate",
          "legs": "chainmail chausses",
          "feet": "riding boots",
          "accessory": "silk sash"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 70] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_3977f0f1",
          "year": 75,
          "description": "[Year 75] Fell deeply in love with Brennan Grimsword.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_abe30478",
          "year": 76,
          "description": "[Year 76] Had a child named Caspian Starfall with Brennan Grimsword.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_a4c46aff",
          "year": 78,
          "description": "[Year 78] Discovered The Ethereal Amulet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_64110bf5",
          "year": 79,
          "description": "[Year 79] Discovered The Bone Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_616c9106",
          "year": 83,
          "description": "[Year 83] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_9310cd83",
          "year": 84,
          "description": "[Year 84] Discovered The Astral Crown in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_95e971fd",
          "year": 89,
          "description": "[Year 89] Formed a strong bond with Cedric Ashfall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_8981b5c4",
          "year": 91,
          "description": "[Year 91] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_866bf8c9",
          "year": 93,
          "description": "[Year 93] Had a child named Caius Starfall with Brennan Grimsword.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_a8af63bf",
          "year": 94,
          "description": "[Year 94] Had a child named Sylas Starfall with Brennan Grimsword.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_a483a7fe",
          "year": 95,
          "description": "[Year 95] Inherited belongings from the late Brennan Grimsword.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_4a380101",
            "year": 95,
            "description": "[Year 95] died of a sudden fever.",
            "type": "death",
            "actorName": "Brennan Grimsword"
          }
        },
        {
          "id": "ev_69ea861c",
          "year": 96,
          "description": "[Year 96] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_4a380101",
            "year": 95,
            "description": "[Year 95] died of a sudden fever.",
            "type": "death",
            "actorName": "Brennan Grimsword"
          }
        },
        {
          "id": "ev_4915917a",
          "year": 97,
          "description": "[Year 97] Started a bitter blood feud with Cedric Ashfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f34869f0",
          "year": 101,
          "description": "[Year 101] Discovered The Iron Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_4969b4a1",
          "year": 111,
          "description": "[Year 111] Formed a strong bond with Kael Ravenwood.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_abb31abc",
          "year": 113,
          "description": "[Year 113] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_2485c81f",
          "year": 116,
          "description": "[Year 116] Formed a strong bond with Zorya Greymantle.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_2adcfa61",
          "year": 124,
          "description": "[Year 124] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c2d19fe4",
          "year": 129,
          "description": "[Year 129] Discovered The Bone Manifesto in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_9908e38a",
          "year": 132,
          "description": "[Year 132] Started a bitter blood feud with Astrid Dawnbringer.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_b640aa69",
          "year": 138,
          "description": "[Year 138] Fell deeply in love with Milica Cindermere.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_2fae37d3",
          "year": 143,
          "description": "[Year 143] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_eace51f5",
          "year": 144,
          "description": "[Year 144] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_81143753",
          "year": 121,
          "description": "[Year 121] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "f3cdd11c116c": "mourns",
        "92b6a9eba7bb": "child",
        "da0d329ccf08": "hates",
        "69500d403cf0": "child",
        "55da4ab17f15": "child",
        "3b8c28679fd2": "likes",
        "e0357e27f0a0": "likes",
        "1f57692d26c0": "hates",
        "e251e5f664f7": "loves"
      }
    },
    {
      "id": "92b6a9eba7bb",
      "name": "Caspian Starfall",
      "age": 2,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "olive",
        "height": "very short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "brown",
          "length": "cropped",
          "style": "wavy"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [
          {
            "location": "left forearm",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_f178e513",
          "year": 77,
          "description": "[Year 77] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "ad6150a8c0ef": "parent",
        "f3cdd11c116c": "parent"
      }
    },
    {
      "id": "dd4d72627d13",
      "name": "Vex Frostbeard",
      "age": 10,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "pale",
        "height": "short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "red",
          "length": "cropped",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "leather hood",
          "torso": "wool tunic",
          "legs": "leather trousers",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_60a32357",
          "year": 91,
          "description": "[Year 91] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "69c9dff2cff7": "parent",
        "767bccc0b60b": "parent"
      }
    },
    {
      "id": "1f57692d26c0",
      "name": "Astrid Dawnbringer",
      "age": 95,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "pale",
        "height": "average",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "tied back"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "back",
            "motif": "star"
          },
          {
            "location": "chest",
            "motif": "wolf"
          }
        ],
        "marks": [
          {
            "location": "collarbone",
            "type": "birthmark"
          },
          {
            "location": "forehead",
            "type": "birthmark"
          }
        ]
      },
      "dead": true,
      "inventory": [
        {
          "id": "92718d2518e4",
          "name": "The Obsidian Urn",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it causes shadows to bend towards it.",
          "content": null,
          "creationYear": 90,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 284,
          "value": 284
        },
        {
          "id": "63d96e565083",
          "name": "The Bone Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail a recipe for immortal soup. Scrawled frantically in the margins is a handwritten note: \"Blood is the only currency.\"",
          "creationYear": 95,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 175,
          "value": 175
        },
        {
          "id": "c1dc4aad6835",
          "name": "The Astral Halberd",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 96,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 359,
          "value": 359
        },
        {
          "id": "50169f6a865a",
          "name": "The Iron Ring",
          "type": "Jewelry",
          "description": "A piece of adornment that is pulsing with a faint, sickly light.",
          "content": null,
          "creationYear": 124,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 397,
          "value": 397
        },
        {
          "id": "9ecf3467ed07",
          "name": "The Astral Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the lineage of the First Mayor. Scrawled frantically in the margins is a handwritten note: \"Blood is the only currency.\"",
          "creationYear": 139,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 268,
          "value": 268
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_b69dc965",
          "year": 84,
          "description": "[Year 84] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_1d668c84",
          "year": 85,
          "description": "[Year 85] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_935538db",
          "year": 87,
          "description": "[Year 87] Formed a strong bond with Radovan Frostbeard.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_ca2ef713",
          "year": 88,
          "description": "[Year 88] Started a bitter blood feud with Brennan Grimsword.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f0105738",
          "year": 90,
          "description": "[Year 90] Discovered The Obsidian Urn in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_d1e6e565",
          "year": 95,
          "description": "[Year 95] Discovered The Bone Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ae695498",
          "year": 96,
          "description": "[Year 96] Discovered The Astral Halberd in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_05aa5c30",
          "year": 98,
          "description": "[Year 98] Had a child named Milica Dawnbringer with Cedric Ashfall.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_8af9286b",
          "year": 100,
          "description": "[Year 100] Had a child named Zara Dawnbringer with Cedric Ashfall.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_edb52dd7",
          "year": 103,
          "description": "[Year 103] Started a bitter blood feud with Caius Starfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_7d357ed1",
          "year": 109,
          "description": "[Year 109] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_f79df122",
          "year": 117,
          "description": "[Year 117] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_0bba012a",
          "year": 118,
          "description": "[Year 118] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_281fe261",
          "year": 122,
          "description": "[Year 122] Was ousted from the Mayor's office by Azhar Highkeep.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_7f22276b",
            "year": 122,
            "description": "[Year 122] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Azhar Highkeep"
          }
        },
        {
          "id": "ev_e7ed14d9",
          "year": 124,
          "description": "[Year 124] Discovered The Iron Ring in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_54507a8e",
          "year": 126,
          "description": "[Year 126] Started a bitter blood feud with Cedric Ashfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_8f512d94",
          "year": 133,
          "description": "[Year 133] Formed a strong bond with Elowen Stormgate.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_ef1617e9",
          "year": 135,
          "description": "[Year 135] Formed a strong bond with Sylas Starfall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_e9d856de",
          "year": 139,
          "description": "[Year 139] Discovered The Astral Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_6d0ec53c",
          "year": 147,
          "description": "[Year 147] Packed their belongings and migrated to coordinates X:61, Y:92.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_81143753",
          "year": 121,
          "description": "[Year 121] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "69c9dff2cff7": "likes",
        "f3cdd11c116c": "hates",
        "da0d329ccf08": "hates",
        "63eac30f4da7": "child",
        "03df2f50cbc5": "child",
        "69500d403cf0": "hates",
        "33f378348755": "likes",
        "55da4ab17f15": "likes"
      }
    },
    {
      "id": "da0d329ccf08",
      "name": "Cedric Ashfall",
      "age": 89,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "olive",
        "height": "average",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "wavy"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "leather hood",
          "torso": "wool tunic",
          "legs": "wool breeches",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "0781e424956e",
          "name": "The Astral Band",
          "type": "Jewelry",
          "description": "A piece of adornment that is heavy with ancient malice.",
          "content": null,
          "creationYear": 150,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 349,
          "value": 349
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_77b77de7",
          "year": 86,
          "description": "[Year 86] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_35eb366f",
          "year": 93,
          "description": "[Year 93] Fell deeply in love with Astrid Dawnbringer.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_8249c2c1",
          "year": 95,
          "description": "[Year 95] Started a bitter blood feud with Mira Coldmere.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_31998d7e",
          "year": 96,
          "description": "[Year 96] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_72744669",
          "year": 98,
          "description": "[Year 98] Welcomed their child, Milica Dawnbringer.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_5f105198",
          "year": 100,
          "description": "[Year 100] Welcomed their child, Zara Dawnbringer.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_89ca0ec6",
          "year": 104,
          "description": "[Year 104] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_2b55d76a",
          "year": 107,
          "description": "[Year 107] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_d674c7d4",
          "year": 110,
          "description": "[Year 110] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_d84a109a",
          "year": 113,
          "description": "[Year 113] Started a bitter blood feud with Caius Starfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_3f79d4a1",
          "year": 124,
          "description": "[Year 124] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8645c4f2",
          "year": 133,
          "description": "[Year 133] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_0676d512",
          "year": 145,
          "description": "[Year 145] Started a bitter blood feud with Astrid Dawnbringer.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_b42c682a",
          "year": 147,
          "description": "[Year 147] Formed a strong bond with Azhar Highkeep.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_ee2f2f79",
          "year": 150,
          "description": "[Year 150] Discovered The Astral Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_1e6e337f",
          "year": 151,
          "description": "[Year 151] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_9530eb15",
          "year": 152,
          "description": "[Year 152] Formed a strong bond with Thrain Marshborn.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_024a49b3",
          "year": 155,
          "description": "[Year 155] Packed their belongings and migrated to coordinates X:25, Y:5.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_81143753",
          "year": 121,
          "description": "[Year 121] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "1f57692d26c0": "hates",
        "e020fbe711e1": "hates",
        "63eac30f4da7": "child",
        "03df2f50cbc5": "child",
        "69500d403cf0": "hates",
        "767bccc0b60b": "likes",
        "9fe5b8349b79": "likes"
      }
    },
    {
      "id": "d2caaa7aaca5",
      "name": "Radovan Frostbeard",
      "age": 9,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "pale",
        "height": "very short",
        "build": "slight",
        "baldness": false,
        "hair": {
          "color": "auburn",
          "length": "cropped",
          "style": "curly"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "padded gambeson",
          "legs": "wool breeches",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_b5b66fd5",
          "year": 95,
          "description": "[Year 95] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "69c9dff2cff7": "parent",
        "767bccc0b60b": "parent"
      }
    },
    {
      "id": "9a9d5d5121e4",
      "name": "Aldwyn Ashbrook",
      "age": 66,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "olive",
        "height": "average",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "grey",
          "length": "long",
          "style": "shaved sides"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "leather hood",
          "torso": "chainmail hauberk",
          "legs": "plate greaves",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "neck",
            "motif": "sun"
          },
          {
            "location": "right shoulder",
            "motif": "eye"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "5120014ec1c6",
          "name": "The Iron Pendant",
          "type": "Jewelry",
          "description": "A piece of adornment that is pulsing with a faint, sickly light.",
          "content": null,
          "creationYear": 102,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 628,
          "value": 628
        },
        {
          "id": "e3ec43be6d0f",
          "name": "The Crimson Urn",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 121,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 765,
          "value": 765
        },
        {
          "id": "6d89b888e3b7",
          "name": "The Ethereal Band",
          "type": "Jewelry",
          "description": "A piece of adornment that is whispering faintly when held near the ear.",
          "content": null,
          "creationYear": 125,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 383,
          "value": 383
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_7a9868af",
          "year": 89,
          "description": "[Year 89] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_6f5b79c9",
          "year": 96,
          "description": "[Year 96] Formed a strong bond with Kael Ravenwood.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_a05438e9",
          "year": 100,
          "description": "[Year 100] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_1f70cbea",
          "year": 102,
          "description": "[Year 102] Formed a strong bond with Zara Dawnbringer.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_ac34d0ca",
          "year": 106,
          "description": "[Year 106] Fell deeply in love with Tanwen Brightmere.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_7ce1e001",
          "year": 108,
          "description": "[Year 108] Welcomed their child, Milica Brightmere.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_95186ca5",
          "year": 110,
          "description": "[Year 110] Inherited belongings from the late Tanwen Brightmere.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_12c2dfb3",
            "year": 110,
            "description": "[Year 110] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Tanwen Brightmere"
          }
        },
        {
          "id": "ev_74ab2198",
          "year": 111,
          "description": "[Year 111] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_12c2dfb3",
            "year": 110,
            "description": "[Year 110] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Tanwen Brightmere"
          }
        },
        {
          "id": "ev_cb1eff38",
          "year": 113,
          "description": "[Year 113] Welcomed their child, Vanya Greymantle.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_3a2bfa56",
          "year": 114,
          "description": "[Year 114] Welcomed their child, Zorya Greymantle.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_a26548c3",
          "year": 115,
          "description": "[Year 115] Formed a strong bond with Helga Frostbeard.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_c0026d90",
          "year": 119,
          "description": "[Year 119] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e8cb21d4",
          "year": 121,
          "description": "[Year 121] Discovered The Crimson Urn in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_5a4e30fc",
          "year": 125,
          "description": "[Year 125] Discovered The Ethereal Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_9d84e48c",
          "year": 126,
          "description": "[Year 126] Packed their belongings and migrated to coordinates X:26, Y:48.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_81143753",
          "year": 121,
          "description": "[Year 121] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "3b8c28679fd2": "likes",
        "03df2f50cbc5": "likes",
        "9789d8bc37d0": "mourns",
        "18fd2d225ba5": "child",
        "8bddbfbdeaf0": "loves",
        "65410dc8e524": "child",
        "e0357e27f0a0": "child",
        "1e54ddb9d178": "likes"
      }
    },
    {
      "id": "89daf2ef5b4b",
      "name": "Kael Swiftblade",
      "age": 39,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "olive",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "chestnut",
          "length": "short",
          "style": "curly"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "leather hood",
          "torso": "wool tunic",
          "legs": "linen skirt",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_fe782750",
          "year": 90,
          "description": "[Year 90] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_97ea4c58",
          "year": 93,
          "description": "[Year 93] Formed a strong bond with Mira Coldmere.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_88e38cb3",
          "year": 94,
          "description": "[Year 94] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_5ebee6f5",
          "year": 98,
          "description": "[Year 98] Started a bitter blood feud with Aldwyn Ashbrook.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_9e0775e9",
          "year": 103,
          "description": "[Year 103] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "e020fbe711e1": "likes",
        "9a9d5d5121e4": "hates"
      }
    },
    {
      "id": "9789d8bc37d0",
      "name": "Tanwen Brightmere",
      "age": 52,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "fair",
        "height": "tall",
        "build": "heavyset",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "thinning",
          "style": "straight"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "padded gambeson",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_130d6f96",
          "year": 91,
          "description": "[Year 91] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_ee5e83fc",
          "year": 100,
          "description": "[Year 100] Started a bitter blood feud with Helga Frostbeard.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_85a2c5c3",
          "year": 102,
          "description": "[Year 102] Discovered The Iron Pendant in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ce6a2796",
          "year": 106,
          "description": "[Year 106] Started a bitter blood feud with Caius Starfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_5cb35464",
          "year": 108,
          "description": "[Year 108] Had a child named Milica Brightmere with Aldwyn Ashbrook.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_af776753",
          "year": 109,
          "description": "[Year 109] Started a bitter blood feud with Kael Ravenwood.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_12c2dfb3",
          "year": 110,
          "description": "[Year 110] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "1e54ddb9d178": "hates",
        "9a9d5d5121e4": "loves",
        "69500d403cf0": "hates",
        "18fd2d225ba5": "child",
        "3b8c28679fd2": "hates"
      }
    },
    {
      "id": "e020fbe711e1",
      "name": "Mira Coldmere",
      "age": 33,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "green",
        "skinTone": "pale",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "long",
          "style": "shaved sides"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "leather trousers",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_039b0b79",
          "year": 93,
          "description": "[Year 93] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_7982f9b9",
          "year": 95,
          "description": "[Year 95] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "69500d403cf0",
      "name": "Caius Starfall",
      "age": 26,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "pale",
        "height": "average",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "brown",
          "length": "cropped",
          "style": "straight"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_edd8a1bd",
          "year": 108,
          "description": "[Year 108] Came of age and entered adulthood.",
          "type": "age_transition",
          "causedBy": null
        },
        {
          "id": "ev_dc80fdac",
          "year": 108,
          "description": "[Year 108] Started a bitter blood feud with Carwyn Swiftfoot.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_8ba3eba4",
          "year": 111,
          "description": "[Year 111] Fell deeply in love with Azhar Highkeep.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_6a28ff01",
          "year": 114,
          "description": "[Year 114] Discovered The Bone Manifesto in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_4fd3d8c1",
          "year": 118,
          "description": "[Year 118] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "ad6150a8c0ef": "parent",
        "f3cdd11c116c": "parent",
        "d9c35ddc0ed4": "hates",
        "767bccc0b60b": "loves"
      }
    },
    {
      "id": "c0acf96433a5",
      "name": "Oswin Ashveil",
      "age": 34,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "pale",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "long",
          "style": "shaved sides"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "wool cap",
          "torso": "wool tunic",
          "legs": "leather trousers",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_10448c24",
          "year": 95,
          "description": "[Year 95] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_f9f3689e",
          "year": 98,
          "description": "[Year 98] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "63eac30f4da7",
      "name": "Milica Dawnbringer",
      "age": 1,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "tan",
        "height": "very short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "black",
          "length": "cropped",
          "style": "tied back"
        },
        "facialHair": "none",
        "clothing": {
          "head": "leather hood",
          "torso": "wool tunic",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_87f6c051",
          "year": 98,
          "description": "[Year 98] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "1f57692d26c0": "parent",
        "da0d329ccf08": "parent"
      }
    },
    {
      "id": "65410dc8e524",
      "name": "Vanya Greymantle",
      "age": 13,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "olive",
        "height": "short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "chestnut",
          "length": "cropped",
          "style": "wavy"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "wool tunic",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_9d84e48c",
          "year": 126,
          "description": "[Year 126] Packed their belongings and migrated to coordinates X:26, Y:48.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_81143753",
          "year": 121,
          "description": "[Year 121] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "8bddbfbdeaf0": "parent",
        "9a9d5d5121e4": "parent"
      }
    },
    {
      "id": "e251e5f664f7",
      "name": "Milica Cindermere",
      "age": 39,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "olive",
        "height": "tall",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "long",
          "style": "curly"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "plate breastplate",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "fur-lined cloak"
        },
        "scars": [
          {
            "location": "lip",
            "type": "brand"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "29f717e6e82d",
          "name": "The Void Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the true names of stars. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 136,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 195,
          "value": 195
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_0ec5958b",
          "year": 136,
          "description": "[Year 136] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_dd8e7337",
          "year": 136,
          "description": "[Year 136] Discovered The Void Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_310a84ba",
          "year": 141,
          "description": "[Year 141] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_6773cccc",
          "year": 145,
          "description": "[Year 145] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_eace51f5",
            "year": 144,
            "description": "[Year 144] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Ingrid Starfall"
          }
        },
        {
          "id": "ev_a367bcdb",
          "year": 147,
          "description": "[Year 147] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "ad6150a8c0ef": "mourns"
      }
    },
    {
      "id": "0ca1abfafaef",
      "name": "Faelan Stoneheart",
      "age": 151,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "pale",
        "height": "tall",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "straight"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "silk robe",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "fur-lined cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "42465224be9f",
          "name": "The Obsidian Lantern",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 154,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 597,
          "value": 597
        },
        {
          "id": "230ef0e12a16",
          "name": "The Astral Urn",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it causes shadows to bend towards it.",
          "content": null,
          "creationYear": 181,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 778,
          "value": 778
        },
        {
          "id": "a9083a88d540",
          "name": "The Astral Idol",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 186,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 427,
          "value": 427
        },
        {
          "id": "dcb914ad80a7",
          "name": "The Void Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail forgotten blood magic. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 203,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 201,
          "value": 201
        },
        {
          "id": "5ed180738e91",
          "name": "The Void Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the true names of stars. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 209,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 553,
          "value": 553
        },
        {
          "id": "776cba77ae44",
          "name": "The Obsidian Urn",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 213,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 385,
          "value": 385
        },
        {
          "id": "d36b375e8182",
          "name": "The Astral Manifesto",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the anatomy of shadows. Scrawled frantically in the margins is a handwritten note: \"Do not trust the guards.\"",
          "creationYear": 245,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 210,
          "value": 210
        },
        {
          "id": "d814870133f8",
          "name": "The Ethereal Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 247,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 475,
          "value": 475
        },
        {
          "id": "47ba8192fda2",
          "name": "The Ethereal Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 187,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 144,
          "value": 144
        },
        {
          "id": "7994d2498f78",
          "name": "The Bone Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 201,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 212,
          "value": 212
        },
        {
          "id": "56937fe4cba5",
          "name": "The Bone Manifesto",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the anatomy of shadows. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 233,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 360,
          "value": 360
        }
      ],
      "quests": [],
      "history": [
        "[Year 150] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_86688c4b",
          "year": 150,
          "description": "[Year 150] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_51fb1a80",
          "year": 151,
          "description": "[Year 151] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_0021dd1d",
          "year": 154,
          "description": "[Year 154] Discovered The Obsidian Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_b7124413",
          "year": 176,
          "description": "[Year 176] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_0ee9b7d7",
          "year": 181,
          "description": "[Year 181] Discovered The Astral Urn in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_3f3d2e9f",
          "year": 182,
          "description": "[Year 182] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e294bbfe",
          "year": 186,
          "description": "[Year 186] Discovered The Astral Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_4b17e487",
          "year": 190,
          "description": "[Year 190] Started a bitter blood feud with Soraya Redmane.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_e9c00549",
          "year": 199,
          "description": "[Year 199] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_40c5a187",
          "year": 202,
          "description": "[Year 202] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_479c5cc4",
          "year": 203,
          "description": "[Year 203] Discovered The Void Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_04e2536b",
          "year": 209,
          "description": "[Year 209] Discovered The Void Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_69044e43",
          "year": 213,
          "description": "[Year 213] Discovered The Obsidian Urn in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_82e929b6",
          "year": 223,
          "description": "[Year 223] Started a bitter blood feud with Edwyn Swiftstream.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_7577eba5",
          "year": 231,
          "description": "[Year 231] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_7f232bb0",
          "year": 236,
          "description": "[Year 236] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_90bae2f0",
          "year": 243,
          "description": "[Year 243] Formed a strong bond with Ragnar Frostbeard.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_d57ca58e",
          "year": 245,
          "description": "[Year 245] Discovered The Astral Manifesto in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_cb064445",
          "year": 247,
          "description": "[Year 247] Discovered The Ethereal Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_e40e1efc",
          "year": 247,
          "description": "[Year 247] Inherited belongings from the late Milica Oakheart.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_517f308e",
            "year": 247,
            "description": "[Year 247] died of a sudden fever.",
            "type": "death",
            "actorName": "Milica Oakheart"
          }
        },
        {
          "id": "ev_d1044c65",
          "year": 248,
          "description": "[Year 248] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_517f308e",
            "year": 247,
            "description": "[Year 247] died of a sudden fever.",
            "type": "death",
            "actorName": "Milica Oakheart"
          }
        },
        {
          "id": "ev_2d581700",
          "year": 248,
          "description": "[Year 248] Formed a strong bond with Aldric Stoneheart.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_b2f64641",
          "year": 251,
          "description": "[Year 251] Fell deeply in love with Zara Redclaw.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_a424fa46",
          "year": 253,
          "description": "[Year 253] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_3aba17c5",
          "year": 259,
          "description": "[Year 259] Formed a strong bond with Sylas Cindermere.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_ef8d22ea",
          "year": 270,
          "description": "[Year 270] Packed their belongings and migrated to coordinates X:96, Y:98.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_482098e1",
          "year": 221,
          "description": "[Year 221] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "9731f595e2e5": "mourns",
        "fa1066bea5a9": "hates",
        "a79226c564c6": "hates",
        "617f7a3f5724": "likes",
        "22ff8a99b977": "likes",
        "b0514979004b": "loves",
        "989481e30380": "likes"
      }
    },
    {
      "id": "1cf153794d5a",
      "name": "Edwyn Stonewall",
      "age": 86,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "tan",
        "height": "average",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "white",
          "length": "cropped",
          "style": "shaved sides"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 150] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_50420ba3",
          "year": 154,
          "description": "[Year 154] Formed a strong bond with Edwyn Brightwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_abc5a0b7",
          "year": 156,
          "description": "[Year 156] Discovered The Void Crown in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_b11babcd",
          "year": 157,
          "description": "[Year 157] Discovered The Iron Codex in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_028de39c",
          "year": 165,
          "description": "[Year 165] Fell deeply in love with Zara Wolfmane.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_a1349401",
          "year": 171,
          "description": "[Year 171] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": null
        },
        {
          "id": "ev_7ce10929",
          "year": 171,
          "description": "[Year 171] Started a bitter blood feud with Brennan Ironwall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_6485d088",
          "year": 173,
          "description": "[Year 173] Fell deeply in love with Sable Lightbringer.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_bd10a300",
          "year": 174,
          "description": "[Year 174] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": null
        },
        {
          "id": "ev_00694060",
          "year": 181,
          "description": "[Year 181] Discovered The Ethereal Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_62ff7394",
          "year": 187,
          "description": "[Year 187] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ad3db2a5",
          "year": 191,
          "description": "[Year 191] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_062ff416",
          "year": 192,
          "description": "[Year 192] Discovered The Obsidian Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_bb5336e9",
          "year": 201,
          "description": "[Year 201] Formed a strong bond with Vesna Frostholm.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_aec8e3ae",
          "year": 208,
          "description": "[Year 208] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "0b8e60d601cf": "likes",
        "05833aa40fc5": "mourns",
        "53e66a131a2e": "hates",
        "5e04964461c3": "mourns",
        "a79226c564c6": "loves",
        "3f123634c41e": "likes"
      }
    },
    {
      "id": "0b8e60d601cf",
      "name": "Edwyn Brightwater",
      "age": 69,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "blue",
        "skinTone": "fair",
        "height": "average",
        "build": "stocky",
        "baldness": true,
        "hair": {
          "color": "grey",
          "length": "bald",
          "style": "wavy"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "iron helm",
          "torso": "plate breastplate",
          "legs": "plate greaves",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 150] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_ef936901",
          "year": 150,
          "description": "[Year 150] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_d5b250b7",
          "year": 151,
          "description": "[Year 151] Formed a strong bond with Faelan Stoneheart.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_85e60f7c",
          "year": 155,
          "description": "[Year 155] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_20a19336",
          "year": 160,
          "description": "[Year 160] Started a bitter blood feud with Zara Wolfmane.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_69813565",
          "year": 162,
          "description": "[Year 162] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_25fc4823",
          "year": 168,
          "description": "[Year 168] Started a bitter blood feud with Elowen Stormgate.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_4973330f",
          "year": 173,
          "description": "[Year 173] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_71263060",
          "year": 174,
          "description": "[Year 174] Discovered The Bone Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_31d71717",
          "year": 181,
          "description": "[Year 181] Started a bitter blood feud with Edwyn Swiftstream.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_29a26ffb",
          "year": 182,
          "description": "[Year 182] Fell deeply in love with Soraya Redmane.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_62ff7394",
          "year": 187,
          "description": "[Year 187] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_db1e1604",
          "year": 188,
          "description": "[Year 188] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "0ca1abfafaef": "likes",
        "05833aa40fc5": "hates",
        "33f378348755": "hates",
        "a79226c564c6": "hates",
        "fa1066bea5a9": "loves"
      }
    },
    {
      "id": "1dcd65a20ee5",
      "name": "Azhar Highwatch",
      "age": 34,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "brown",
        "height": "tall",
        "build": "heavyset",
        "baldness": true,
        "hair": {
          "color": "chestnut",
          "length": "cropped",
          "style": "braided"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_2779f4ef",
          "year": 151,
          "description": "[Year 151] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_42c4b803",
          "year": 151,
          "description": "[Year 151] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "53e66a131a2e",
      "name": "Brennan Ironwall",
      "age": 43,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "dark brown",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "red",
          "length": "short",
          "style": "curly"
        },
        "facialHair": "none",
        "clothing": {
          "head": "leather hood",
          "torso": "linen shirt",
          "legs": "leather trousers",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "right forearm",
            "motif": "skull"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_342c5910",
          "year": 169,
          "description": "[Year 169] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_8725c7b1",
          "year": 170,
          "description": "[Year 170] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_9fd44ab8",
          "year": 171,
          "description": "[Year 171] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_1636ddab",
          "year": 172,
          "description": "[Year 172] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_cb870323",
          "year": 175,
          "description": "[Year 175] Formed a strong bond with Edwyn Brightwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_a49b64f8",
          "year": 176,
          "description": "[Year 176] Was ousted from the Mayor's office by Faelan Stoneheart.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_b7124413",
            "year": 176,
            "description": "[Year 176] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Faelan Stoneheart"
          }
        },
        {
          "id": "ev_eada6a1e",
          "year": 181,
          "description": "[Year 181] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_4462e6ba",
          "year": 186,
          "description": "[Year 186] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "0b8e60d601cf": "likes"
      }
    },
    {
      "id": "fa1066bea5a9",
      "name": "Soraya Redmane",
      "age": 51,
      "role": "Bandit",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "pale",
        "height": "average",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "long",
          "style": "straight"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "wool cap",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "collarbone",
            "type": "ritual scar"
          }
        ]
      },
      "dead": true,
      "inventory": [
        {
          "id": "c77ad516af11",
          "name": "The Bone Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the lineage of the First Mayor. Scrawled frantically in the margins is a handwritten note: \"I hear the dirt breathing.\"",
          "creationYear": 174,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 378,
          "value": 378
        },
        {
          "id": "a7325a8c1bb2",
          "name": "The Void Dagger",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 188,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 119,
          "value": 119
        },
        {
          "id": "226b376a2ec0",
          "name": "The Void Signet",
          "type": "Jewelry",
          "description": "A piece of adornment that is freezing cold to the touch.",
          "content": null,
          "creationYear": 209,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 499,
          "value": 499
        },
        {
          "id": "e22ee66eca9a",
          "name": "The Bone Idol",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 213,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 560,
          "value": 560
        }
      ],
      "quests": [],
      "history": [
        "[Year 180] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_1fdffb14",
          "year": 182,
          "description": "[Year 182] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_ef20bba4",
          "year": 187,
          "description": "[Year 187] Started a bitter blood feud with Milica Oakheart.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_d6a57e93",
          "year": 188,
          "description": "[Year 188] Inherited belongings from the late Edwyn Brightwater.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_db1e1604",
            "year": 188,
            "description": "[Year 188] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Edwyn Brightwater"
          }
        },
        {
          "id": "ev_1a57cc82",
          "year": 188,
          "description": "[Year 188] Discovered The Void Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_7e601eaf",
          "year": 189,
          "description": "[Year 189] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_db1e1604",
            "year": 188,
            "description": "[Year 188] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Edwyn Brightwater"
          }
        },
        {
          "id": "ev_1eb875e2",
          "year": 190,
          "description": "[Year 190] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_3c6b3ca5",
          "year": 192,
          "description": "[Year 192] Started a bitter blood feud with Hilda Oakmere.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_d7f02914",
          "year": 197,
          "description": "[Year 197] Formed a strong bond with Edwyn Stonewall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_5e537894",
          "year": 202,
          "description": "[Year 202] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ce5aa084",
          "year": 203,
          "description": "[Year 203] Started a bitter blood feud with Edwyn Swiftstream.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_e746fce0",
          "year": 207,
          "description": "[Year 207] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_07990741",
          "year": 209,
          "description": "[Year 209] Discovered The Void Signet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_51b420da",
          "year": 213,
          "description": "[Year 213] Discovered The Bone Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_af524595",
          "year": 214,
          "description": "[Year 214] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "0b8e60d601cf": "mourns",
        "9731f595e2e5": "hates",
        "fa117f2b8197": "hates",
        "1cf153794d5a": "likes",
        "a79226c564c6": "hates"
      }
    },
    {
      "id": "9731f595e2e5",
      "name": "Milica Oakheart",
      "age": 97,
      "role": "Beggar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "olive",
        "height": "average",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "white",
          "length": "short",
          "style": "braided"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "torn rags",
          "feet": "bare",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 180] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_92750302",
          "year": 180,
          "description": "[Year 180] Fell deeply in love with Faelan Stoneheart.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_ebca8372",
          "year": 181,
          "description": "[Year 181] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c70e575f",
          "year": 182,
          "description": "[Year 182] Started a bitter blood feud with Thorvald Frostmane.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_5dd70f0f",
          "year": 187,
          "description": "[Year 187] Discovered The Ethereal Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_fd161d5d",
          "year": 197,
          "description": "[Year 197] Started a bitter blood feud with Edwyn Swiftstream.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_667a1c99",
          "year": 201,
          "description": "[Year 201] Discovered The Bone Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_1eadee8f",
          "year": 203,
          "description": "[Year 203] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e746fce0",
          "year": 207,
          "description": "[Year 207] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_0a4fb6ac",
          "year": 208,
          "description": "[Year 208] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_a2421739",
          "year": 221,
          "description": "[Year 221] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8d9a0c7b",
          "year": 223,
          "description": "[Year 223] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_12270e08",
          "year": 225,
          "description": "[Year 225] Formed a strong bond with Vesna Frostholm.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_0bfa3980",
          "year": 233,
          "description": "[Year 233] Discovered The Bone Manifesto in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_5e21f707",
          "year": 234,
          "description": "[Year 234] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_39e238cd",
          "year": 239,
          "description": "[Year 239] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_b0180b15",
          "year": 243,
          "description": "[Year 243] Started a bitter blood feud with Urist Swiftblade.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_34dd4235",
          "year": 246,
          "description": "[Year 246] Formed a strong bond with Ragnar Frostbeard.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_517f308e",
          "year": 247,
          "description": "[Year 247] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_86a8c37e",
          "year": 222,
          "description": "[Year 222] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "0ca1abfafaef": "loves",
        "d856f73250b3": "hates",
        "a79226c564c6": "hates",
        "3f123634c41e": "likes",
        "5c3e60e3d9e3": "hates",
        "617f7a3f5724": "likes"
      }
    },
    {
      "id": "a79226c564c6",
      "name": "Edwyn Swiftstream",
      "age": 82,
      "role": "Beggar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "tan",
        "height": "average",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "white",
          "length": "shoulder-length",
          "style": "tied back"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "wool cap",
          "torso": "tattered rags",
          "legs": "wool breeches",
          "feet": "sandals",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "5f8f77457da6",
          "name": "The Ethereal Chalice",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 200,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 707,
          "value": 707
        },
        {
          "id": "3f8819befb62",
          "name": "The Astral Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the anatomy of shadows. Scrawled frantically in the margins is a handwritten note: \"Do not trust the guards.\"",
          "creationYear": 200,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 232,
          "value": 232
        },
        {
          "id": "3714e5247148",
          "name": "The Void Crown",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 156,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 488,
          "value": 488
        },
        {
          "id": "abc322c8ef23",
          "name": "The Iron Codex",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail forgotten blood magic. Scrawled frantically in the margins is a handwritten note: \"Do not trust the guards.\"",
          "creationYear": 157,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 252,
          "value": 252
        },
        {
          "id": "cf869132c2a0",
          "name": "The Ethereal Idol",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it smells of ozone and dried blood.",
          "content": null,
          "creationYear": 181,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 577,
          "value": 577
        },
        {
          "id": "f82c3e150001",
          "name": "The Obsidian Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail a recipe for immortal soup. Scrawled frantically in the margins is a handwritten note: \"Do not trust the guards.\"",
          "creationYear": 192,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 514,
          "value": 514
        },
        {
          "id": "53ed1c4ff484",
          "name": "The Obsidian Codex",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the anatomy of shadows. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 218,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 248,
          "value": 248
        }
      ],
      "quests": [],
      "history": [
        "[Year 180] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_af66d137",
          "year": 181,
          "description": "[Year 181] Fell deeply in love with Edwyn Stonewall.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_5c5b3603",
          "year": 194,
          "description": "[Year 194] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_2cf829c2",
          "year": 197,
          "description": "[Year 197] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8965f492",
          "year": 200,
          "description": "[Year 200] Discovered The Astral Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_9d27d6f4",
          "year": 208,
          "description": "[Year 208] Inherited belongings from the late Edwyn Stonewall.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_aec8e3ae",
            "year": 208,
            "description": "[Year 208] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Edwyn Stonewall"
          }
        },
        {
          "id": "ev_cb3e70f0",
          "year": 209,
          "description": "[Year 209] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_aec8e3ae",
            "year": 208,
            "description": "[Year 208] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Edwyn Stonewall"
          }
        },
        {
          "id": "ev_d0252414",
          "year": 209,
          "description": "[Year 209] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_4aa4c24a",
          "year": 214,
          "description": "[Year 214] Formed a strong bond with Soraya Redmane.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_572158df",
          "year": 218,
          "description": "[Year 218] Discovered The Obsidian Codex in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_21c9e008",
          "year": 222,
          "description": "[Year 222] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_bc28fb6b",
          "year": 226,
          "description": "[Year 226] Fell deeply in love with Vesna Frostholm.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_1eb647b3",
          "year": 228,
          "description": "[Year 228] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_8ec363fc",
          "year": 229,
          "description": "[Year 229] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_5e22ccb5",
          "year": 236,
          "description": "[Year 236] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_d4da3e20",
          "year": 236,
          "description": "[Year 236] Inherited belongings from the late Vesna Frostholm.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_059df552",
            "year": 236,
            "description": "[Year 236] was killed by a wild beast.",
            "type": "death",
            "actorName": "Vesna Frostholm"
          }
        },
        {
          "id": "ev_86a8c37e",
          "year": 222,
          "description": "[Year 222] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "1cf153794d5a": "mourns",
        "fa1066bea5a9": "likes",
        "3f123634c41e": "loves"
      }
    },
    {
      "id": "d856f73250b3",
      "name": "Thorvald Frostmane",
      "age": 34,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "tan",
        "height": "tall",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "platinum",
          "length": "short",
          "style": "braided"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "wool cap",
          "torso": "padded gambeson",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_789ddb58",
          "year": 180,
          "description": "[Year 180] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_2bcbdebc",
          "year": 180,
          "description": "[Year 180] Formed a strong bond with Faelan Stoneheart.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_7e4134af",
          "year": 185,
          "description": "[Year 185] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "0ca1abfafaef": "likes"
      }
    },
    {
      "id": "3f123634c41e",
      "name": "Vesna Frostholm",
      "age": 85,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "green",
        "skinTone": "fair",
        "height": "tall",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "white",
          "length": "long",
          "style": "wavy"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "left hand",
            "type": "mole"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_513a0be6",
          "year": 183,
          "description": "[Year 183] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_3985b54e",
          "year": 186,
          "description": "[Year 186] Formed a strong bond with Edwyn Brightwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_ad494afb",
          "year": 192,
          "description": "[Year 192] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ab940fbe",
          "year": 200,
          "description": "[Year 200] Discovered The Ethereal Chalice in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_2004b8f7",
          "year": 209,
          "description": "[Year 209] Formed a strong bond with Edwyn Swiftstream.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_affc68f3",
          "year": 212,
          "description": "[Year 212] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_7171a191",
          "year": 216,
          "description": "[Year 216] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_907976ac",
          "year": 223,
          "description": "[Year 223] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_7dab03e7",
          "year": 234,
          "description": "[Year 234] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c42e8612",
          "year": 236,
          "description": "[Year 236] Inherited belongings from the late Edwyn Swiftstream.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_5e22ccb5",
            "year": 236,
            "description": "[Year 236] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Edwyn Swiftstream"
          }
        },
        {
          "id": "ev_059df552",
          "year": 236,
          "description": "[Year 236] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_86a8c37e",
          "year": 222,
          "description": "[Year 222] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "0b8e60d601cf": "likes",
        "a79226c564c6": "loves"
      }
    },
    {
      "id": "ba9fd68d23c9",
      "name": "Sigrun Starfall",
      "age": 30,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "tan",
        "height": "tall",
        "build": "lean",
        "baldness": true,
        "hair": {
          "color": "platinum",
          "length": "shoulder-length",
          "style": "shaved sides"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "wool cap",
          "torso": "wool tunic",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "d1f58da4a171",
          "name": "The Astral Band",
          "type": "Jewelry",
          "description": "A piece of adornment that is pulsing with a faint, sickly light.",
          "content": null,
          "creationYear": 195,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 277,
          "value": 277
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_39f6edfc",
          "year": 195,
          "description": "[Year 195] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_f1198d4a",
          "year": 195,
          "description": "[Year 195] Discovered The Astral Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_892d0e6f",
          "year": 197,
          "description": "[Year 197] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_b0bd7aec",
          "year": 199,
          "description": "[Year 199] Was ousted from the Mayor's office by Faelan Stoneheart.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_e9c00549",
            "year": 199,
            "description": "[Year 199] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Faelan Stoneheart"
          }
        },
        {
          "id": "ev_d3778520",
          "year": 200,
          "description": "[Year 200] Formed a strong bond with Edwyn Stonewall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_f1772baf",
          "year": 201,
          "description": "[Year 201] Started a bitter blood feud with Tanwen Highkeep.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_4c6881b3",
          "year": 202,
          "description": "[Year 202] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "1cf153794d5a": "likes",
        "dee87c2a1016": "hates"
      }
    },
    {
      "id": "70782032b7d4",
      "name": "Azhar Willowmere",
      "age": 43,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "olive",
        "height": "tall",
        "build": "heavyset",
        "baldness": true,
        "hair": {
          "color": "auburn",
          "length": "thinning",
          "style": "braided"
        },
        "facialHair": "none",
        "clothing": {
          "head": "leather hood",
          "torso": "padded gambeson",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "right forearm",
            "motif": "sun"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "79e560ee4201",
          "name": "The Void Signet",
          "type": "Jewelry",
          "description": "A piece of adornment that is heavy with ancient malice.",
          "content": null,
          "creationYear": 217,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 374,
          "value": 374
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_5c243b89",
          "year": 206,
          "description": "[Year 206] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_e9f3f758",
          "year": 217,
          "description": "[Year 217] Discovered The Void Signet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_062e06bc",
          "year": 218,
          "description": "[Year 218] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "8fdbee0fd0e3",
      "name": "Lyra Greymoor",
      "age": 54,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "fair",
        "height": "average",
        "build": "stocky",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "thinning",
          "style": "straight"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "leather hood",
          "torso": "linen shirt",
          "legs": "wool breeches",
          "feet": "sandals",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "neck",
            "type": "brand"
          },
          {
            "location": "right hand",
            "type": "ritual scar"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_f38a0354",
          "year": 217,
          "description": "[Year 217] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_f1cc2c92",
          "year": 217,
          "description": "[Year 217] Started a bitter blood feud with Vesna Frostholm.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f5bf1db3",
          "year": 236,
          "description": "[Year 236] Packed their belongings and migrated to coordinates X:94, Y:66.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_86a8c37e",
          "year": 222,
          "description": "[Year 222] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "3f123634c41e": "hates"
      }
    },
    {
      "id": "23fb02975ea2",
      "name": "Darius Oakshield",
      "age": 54,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "pale",
        "height": "average",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "shoulder-length",
          "style": "curly"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "crown",
          "torso": "plate breastplate",
          "legs": "chainmail chausses",
          "feet": "leather shoes",
          "accessory": "silk sash"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "57cc18f0067d",
          "name": "The Astral Band",
          "type": "Jewelry",
          "description": "A piece of adornment that is pulsing with a faint, sickly light.",
          "content": null,
          "creationYear": 232,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 500,
          "value": 500
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_4e94573a",
          "year": 220,
          "description": "[Year 220] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_96780228",
          "year": 222,
          "description": "[Year 222] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a49263f8",
          "year": 225,
          "description": "[Year 225] Formed a strong bond with Milica Oakheart.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_dbbddda4",
          "year": 229,
          "description": "[Year 229] Formed a strong bond with Lyra Greymoor.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_d397ecba",
          "year": 232,
          "description": "[Year 232] Discovered The Astral Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_e5f32405",
          "year": 233,
          "description": "[Year 233] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_616984f6",
          "year": 234,
          "description": "[Year 234] Started a bitter blood feud with Faelan Stoneheart.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_c01d110f",
          "year": 237,
          "description": "[Year 237] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_86a8c37e",
          "year": 222,
          "description": "[Year 222] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "9731f595e2e5": "likes",
        "8fdbee0fd0e3": "likes",
        "0ca1abfafaef": "hates"
      }
    },
    {
      "id": "5c3e60e3d9e3",
      "name": "Urist Swiftblade",
      "age": 39,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "pale",
        "height": "average",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "red",
          "length": "long",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_9316c642",
          "year": 237,
          "description": "[Year 237] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_201d1b53",
          "year": 238,
          "description": "[Year 238] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_992cdc53",
          "year": 239,
          "description": "[Year 239] Started a bitter blood feud with Faelan Stoneheart.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_0cae9622",
          "year": 241,
          "description": "[Year 241] Fell deeply in love with Lyra Ironwall.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_62f38697",
          "year": 243,
          "description": "[Year 243] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "0ca1abfafaef": "hates",
        "8706ab8ea4c3": "loves"
      }
    },
    {
      "id": "8706ab8ea4c3",
      "name": "Lyra Ironwall",
      "age": 43,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "tan",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "long",
          "style": "braided"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "wool tunic",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "silk sash"
        },
        "scars": [
          {
            "location": "right hand",
            "type": "pockmark"
          },
          {
            "location": "left cheek",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 240] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_8556fe45",
          "year": 244,
          "description": "[Year 244] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_62f38697",
            "year": 243,
            "description": "[Year 243] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Urist Swiftblade"
          }
        },
        {
          "id": "ev_20e62be0",
          "year": 245,
          "description": "[Year 245] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_84d7ea68",
          "year": 247,
          "description": "[Year 247] Discovered The Astral Grimoire in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_402aeaef",
          "year": 250,
          "description": "[Year 250] Formed a strong bond with Erik Greymoor.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_8112a7d3",
          "year": 251,
          "description": "[Year 251] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_32956c7b",
          "year": 255,
          "description": "[Year 255] Fell deeply in love with Nadir Grimsword.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_b768c582",
          "year": 259,
          "description": "[Year 259] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_727d8ffb",
          "year": 262,
          "description": "[Year 262] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_7fad1c8d",
          "year": 263,
          "description": "[Year 263] Formed a strong bond with Zara Redclaw.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_c47f76ba",
          "year": 264,
          "description": "[Year 264] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "5c3e60e3d9e3": "mourns",
        "e6db948c1a03": "likes",
        "d066d2593697": "loves",
        "b0514979004b": "likes"
      }
    },
    {
      "id": "688afc069fda",
      "name": "Azhar Ashfall",
      "age": 26,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "pale",
        "height": "tall",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "chestnut",
          "length": "shoulder-length",
          "style": "braided"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "iron helm",
          "torso": "padded gambeson",
          "legs": "leather trousers",
          "feet": "riding boots",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "forehead",
            "type": "brand"
          },
          {
            "location": "forehead",
            "type": "mole"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 250] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_c59d62bb",
          "year": 253,
          "description": "[Year 253] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "989481e30380": "loves"
      }
    },
    {
      "id": "e6db948c1a03",
      "name": "Erik Greymoor",
      "age": 60,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "pale",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "grey",
          "length": "shoulder-length",
          "style": "curly"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "none",
          "torso": "chainmail hauberk",
          "legs": "chainmail chausses",
          "feet": "riding boots",
          "accessory": "travel cloak"
        },
        "scars": [
          {
            "location": "neck",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "b91a1f94b02b",
          "name": "The Astral Crown",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 252,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 596,
          "value": 596
        },
        {
          "id": "6557484a5a22",
          "name": "The Iron Lantern",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it smells of ozone and dried blood.",
          "content": null,
          "creationYear": 265,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 402,
          "value": 402
        },
        {
          "id": "612b8f063d23",
          "name": "The Astral Scroll",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the true names of stars. Scrawled frantically in the margins is a handwritten note: \"Blood is the only currency.\"",
          "creationYear": 268,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 325,
          "value": 325
        }
      ],
      "quests": [],
      "history": [
        "[Year 250] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_815d768a",
          "year": 251,
          "description": "[Year 251] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_124a22b1",
          "year": 252,
          "description": "[Year 252] Discovered The Astral Crown in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_034263bd",
          "year": 256,
          "description": "[Year 256] Welcomed their child, Cedric Rockhollow.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_b22ca2eb",
          "year": 263,
          "description": "[Year 263] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_57765235",
            "year": 262,
            "description": "[Year 262] died of a sudden fever.",
            "type": "death",
            "actorName": "Fenwick Rockhollow"
          }
        },
        {
          "id": "ev_ceaed7e1",
          "year": 265,
          "description": "[Year 265] Discovered The Iron Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_5429c345",
          "year": 268,
          "description": "[Year 268] Discovered The Astral Scroll in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_797e3887",
          "year": 270,
          "description": "[Year 270] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_3c5032cc",
          "year": 278,
          "description": "[Year 278] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e1b263f3",
          "year": 279,
          "description": "[Year 279] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8e1e6e8a",
          "year": 282,
          "description": "[Year 282] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_78ba35ed",
          "year": 283,
          "description": "[Year 283] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_327dfebf",
          "year": 272,
          "description": "[Year 272] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "ba6c23231052": "mourns",
        "2fd8c7600971": "child"
      }
    },
    {
      "id": "9b63e5debcb8",
      "name": "Orik Winterborne",
      "age": 48,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "fair",
        "height": "tall",
        "build": "lean",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "thinning",
          "style": "shaved sides"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "16b51a57308e",
          "name": "The Astral Pendant",
          "type": "Jewelry",
          "description": "A piece of adornment that is pulsing with a faint, sickly light.",
          "content": null,
          "creationYear": 272,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 411,
          "value": 411
        }
      ],
      "quests": [],
      "history": [
        "[Year 250] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_0edecfd1",
          "year": 250,
          "description": "[Year 250] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_b5d4b815",
          "year": 253,
          "description": "[Year 253] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_53514f26",
          "year": 254,
          "description": "[Year 254] Started a bitter blood feud with Faelan Stoneheart.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_d6925d04",
          "year": 258,
          "description": "[Year 258] Was ousted from the Mayor's office by Zara Redclaw.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_2e14dea0",
            "year": 258,
            "description": "[Year 258] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Zara Redclaw"
          }
        },
        {
          "id": "ev_c23dd65f",
          "year": 265,
          "description": "[Year 265] Formed a strong bond with Cedric Rockhollow.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_563e7b01",
          "year": 266,
          "description": "[Year 266] Formed a strong bond with Erik Greymoor.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_baf7edb9",
          "year": 272,
          "description": "[Year 272] Discovered The Astral Pendant in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_1210edd2",
          "year": 275,
          "description": "[Year 275] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "0ca1abfafaef": "hates",
        "2fd8c7600971": "likes",
        "e6db948c1a03": "likes"
      }
    },
    {
      "id": "ba6c23231052",
      "name": "Fenwick Rockhollow",
      "age": 40,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "green",
        "skinTone": "dark brown",
        "height": "tall",
        "build": "stocky",
        "baldness": true,
        "hair": {
          "color": "red",
          "length": "thinning",
          "style": "braided"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "crown",
          "torso": "silk robe",
          "legs": "wool breeches",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": [
          {
            "location": "left hand",
            "type": "ritual scar"
          }
        ]
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 250] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_8ef973f9",
          "year": 251,
          "description": "[Year 251] Formed a strong bond with Lyra Ironwall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_26f89072",
          "year": 254,
          "description": "[Year 254] Fell deeply in love with Erik Greymoor.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_a8061719",
          "year": 256,
          "description": "[Year 256] Had a child named Cedric Rockhollow with Erik Greymoor.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_57765235",
          "year": 262,
          "description": "[Year 262] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "8706ab8ea4c3": "likes",
        "e6db948c1a03": "loves",
        "2fd8c7600971": "child"
      }
    },
    {
      "id": "989481e30380",
      "name": "Sylas Cindermere",
      "age": 30,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "blue",
        "skinTone": "tan",
        "height": "average",
        "build": "average",
        "baldness": true,
        "hair": {
          "color": "auburn",
          "length": "long",
          "style": "tied back"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "none",
          "torso": "padded gambeson",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 250] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_73bf4bea",
          "year": 253,
          "description": "[Year 253] Fell deeply in love with Azhar Ashfall.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_64e01811",
          "year": 254,
          "description": "[Year 254] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_c59d62bb",
            "year": 253,
            "description": "[Year 253] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Azhar Ashfall"
          }
        },
        {
          "id": "ev_2c7426f3",
          "year": 260,
          "description": "[Year 260] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "688afc069fda": "mourns"
      }
    },
    {
      "id": "79be39994486",
      "name": "Bjorn Frostholm",
      "age": 68,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "tan",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "grey",
          "length": "long",
          "style": "braided"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "silk robe",
          "legs": "chainmail chausses",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [
          {
            "location": "right forearm",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 280] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_29479561",
          "year": 287,
          "description": "[Year 287] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_cf53d50b",
          "year": 288,
          "description": "[Year 288] Fell deeply in love with Ragna Oakheart.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_013e6d18",
          "year": 299,
          "description": "[Year 299] Started a bitter blood feud with Freyja Brightwater.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_c488b1c9",
          "year": 300,
          "description": "[Year 300] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_af2285c9",
          "year": 302,
          "description": "[Year 302] Started a bitter blood feud with Nerys Stonecroft.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_a0298143",
          "year": 305,
          "description": "[Year 305] Started a bitter blood feud with Ragna Oakheart.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_0860058e",
          "year": 305,
          "description": "[Year 305] Inherited belongings from the late Ragna Oakheart.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_cbc1b65e",
            "year": 305,
            "description": "[Year 305] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Ragna Oakheart"
          }
        },
        {
          "id": "ev_e7fa94e9",
          "year": 312,
          "description": "[Year 312] Fell deeply in love with Brennan Stormwall.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_080ccfb5",
          "year": 321,
          "description": "[Year 321] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "90dc9829b57d": "hates",
        "b13e968135a0": "hates",
        "ea900a7d9559": "hates",
        "1b7c403b7f15": "loves"
      }
    },
    {
      "id": "66e0014c5462",
      "name": "Rashid Highwatch",
      "age": 35,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "olive",
        "height": "tall",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "chestnut",
          "length": "short",
          "style": "wavy"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "travel cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 280] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_41363fd5",
          "year": 281,
          "description": "[Year 281] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_5a5b5174",
          "year": 283,
          "description": "[Year 283] Was ousted from the Mayor's office by Tanwen Grimsword.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_89cad6dd",
            "year": 283,
            "description": "[Year 283] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Tanwen Grimsword"
          }
        },
        {
          "id": "ev_d929aff7",
          "year": 283,
          "description": "[Year 283] Discovered The Iron Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_a38eb1c5",
          "year": 286,
          "description": "[Year 286] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "cac0c9b78a94": "loves"
      }
    },
    {
      "id": "90dc9829b57d",
      "name": "Ragna Oakheart",
      "age": 42,
      "role": "Bandit",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "tan",
        "height": "tall",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "platinum",
          "length": "cropped",
          "style": "braided"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "torn rags",
          "feet": "sandals",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_79846651",
          "year": 286,
          "description": "[Year 286] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_9587a362",
          "year": 287,
          "description": "[Year 287] Started a bitter blood feud with Thrain Blackwood.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_c217cb75",
          "year": 290,
          "description": "[Year 290] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ddc4975c",
          "year": 293,
          "description": "[Year 293] Formed a strong bond with Hilda Wintershield.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_46a1fc0a",
          "year": 295,
          "description": "[Year 295] Discovered The Astral Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_1b77d4cb",
          "year": 301,
          "description": "[Year 301] Formed a strong bond with Freyja Brightwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_88a2f94c",
          "year": 302,
          "description": "[Year 302] Discovered The Iron Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_cbc1b65e",
          "year": 305,
          "description": "[Year 305] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "f8b87d457f8d": "hates",
        "79be39994486": "loves",
        "4bbab03e332d": "likes",
        "b13e968135a0": "likes"
      }
    },
    {
      "id": "b13e968135a0",
      "name": "Freyja Brightwater",
      "age": 55,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "pale",
        "height": "tall",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "cropped",
          "style": "shaved sides"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "wool cap",
          "torso": "silk robe",
          "legs": "wool breeches",
          "feet": "sandals",
          "accessory": "none"
        },
        "scars": [
          {
            "location": "left forearm",
            "type": "burn"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "f85ef5d74c17",
          "name": "The Iron Idol",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it causes shadows to bend towards it.",
          "content": null,
          "creationYear": 301,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 422,
          "value": 422
        },
        {
          "id": "b98a7f22bdcc",
          "name": "The Ethereal Dagger",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 311,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 105,
          "value": 105
        },
        {
          "id": "0e9fc9deb496",
          "name": "The Bone Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 313,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 127,
          "value": 127
        }
      ],
      "quests": [],
      "history": [
        "[Year 290] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_ce55475d",
          "year": 296,
          "description": "[Year 296] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c8de72d5",
          "year": 298,
          "description": "[Year 298] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a861a1bb",
          "year": 301,
          "description": "[Year 301] Discovered The Iron Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_12f89c28",
          "year": 302,
          "description": "[Year 302] Formed a strong bond with Hilda Wintershield.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_342ad611",
          "year": 311,
          "description": "[Year 311] Discovered The Ethereal Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_55778ce2",
          "year": 313,
          "description": "[Year 313] Discovered The Bone Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_08d4bb1d",
          "year": 315,
          "description": "[Year 315] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "4bbab03e332d": "likes"
      }
    },
    {
      "id": "4bbab03e332d",
      "name": "Hilda Wintershield",
      "age": 82,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "tan",
        "height": "tall",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "white",
          "length": "short",
          "style": "tied back"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "none",
          "torso": "wool tunic",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "silk sash"
        },
        "scars": [
          {
            "location": "left hand",
            "type": "burn"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "6f875b6a6ad6",
          "name": "The Obsidian Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 317,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 201,
          "value": 201
        },
        {
          "id": "34e3f1250f9c",
          "name": "The Obsidian Crown",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 337,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 634,
          "value": 634
        },
        {
          "id": "c5fb7867c5b4",
          "name": "The Crimson Dagger",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 347,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 119,
          "value": 119
        }
      ],
      "quests": [],
      "history": [
        "[Year 290] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_e4a37017",
          "year": 293,
          "description": "[Year 293] Started a bitter blood feud with Nerys Stonecroft.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_4488b905",
          "year": 303,
          "description": "[Year 303] Started a bitter blood feud with Freyja Brightwater.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_4038848e",
          "year": 317,
          "description": "[Year 317] Discovered The Obsidian Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_9f7175d2",
          "year": 320,
          "description": "[Year 320] Formed a strong bond with Tanwen Blackmere.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_5ce74d69",
          "year": 325,
          "description": "[Year 325] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_47620af2",
          "year": 328,
          "description": "[Year 328] Started a bitter blood feud with Brennan Stormwall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f89e73b6",
          "year": 338,
          "description": "[Year 338] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ab5621a3",
          "year": 341,
          "description": "[Year 341] Started a bitter blood feud with Corvin Stoneheart.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_e9b259a7",
          "year": 349,
          "description": "[Year 349] Inherited belongings from the late Branwen Coldmere.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_17ca3cda",
            "year": 349,
            "description": "[Year 349] died of a sudden fever.",
            "type": "death",
            "actorName": "Branwen Coldmere"
          }
        },
        {
          "id": "ev_4699169a",
          "year": 350,
          "description": "[Year 350] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_17ca3cda",
            "year": 349,
            "description": "[Year 349] died of a sudden fever.",
            "type": "death",
            "actorName": "Branwen Coldmere"
          }
        },
        {
          "id": "ev_1dfedb95",
          "year": 350,
          "description": "[Year 350] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "ea900a7d9559": "hates",
        "b13e968135a0": "hates",
        "a62916e61758": "likes",
        "8f2678ced78e": "mourns",
        "1b7c403b7f15": "hates",
        "8af6ccaab545": "hates"
      }
    },
    {
      "id": "a195d82bed63",
      "name": "Gunnar Thornback",
      "age": 23,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "green",
        "skinTone": "tan",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "auburn",
          "length": "shoulder-length",
          "style": "wavy"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "merchant coat",
          "legs": "linen skirt",
          "feet": "riding boots",
          "accessory": "silk sash"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 290] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_9053caf6",
          "year": 292,
          "description": "[Year 292] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "2a6ac788d843",
      "name": "Grom Deepforge",
      "age": 27,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "dark brown",
        "height": "average",
        "build": "muscular",
        "baldness": true,
        "hair": {
          "color": "dark brown",
          "length": "cropped",
          "style": "tied back"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "travel cloak"
        },
        "scars": [
          {
            "location": "left forearm",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_794a758a",
          "year": 301,
          "description": "[Year 301] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_a067d4f8",
          "year": 301,
          "description": "[Year 301] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "1b7c403b7f15",
      "name": "Brennan Stormwall",
      "age": 69,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "pale",
        "height": "average",
        "build": "average",
        "baldness": true,
        "hair": {
          "color": "grey",
          "length": "bald",
          "style": "braided"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wool cap",
          "torso": "wool tunic",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_d5be0d4f",
          "year": 309,
          "description": "[Year 309] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_92ea1dd9",
          "year": 310,
          "description": "[Year 310] Started a bitter blood feud with Bjorn Frostholm.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_97df628e",
          "year": 321,
          "description": "[Year 321] Inherited belongings from the late Bjorn Frostholm.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_080ccfb5",
            "year": 321,
            "description": "[Year 321] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Bjorn Frostholm"
          }
        },
        {
          "id": "ev_9a7fdc01",
          "year": 322,
          "description": "[Year 322] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_080ccfb5",
            "year": 321,
            "description": "[Year 321] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Bjorn Frostholm"
          }
        },
        {
          "id": "ev_c0afa8ce",
          "year": 323,
          "description": "[Year 323] Fell deeply in love with Tanwen Blackmere.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_88f266fc",
          "year": 324,
          "description": "[Year 324] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e3a2eb89",
          "year": 325,
          "description": "[Year 325] Started a bitter blood feud with Branwen Coldmere.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_d0aa156c",
          "year": 333,
          "description": "[Year 333] Formed a strong bond with Brennan Oakmere.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_f49b7628",
          "year": 334,
          "description": "[Year 334] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_41e687cd",
          "year": 340,
          "description": "[Year 340] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_6413331f",
          "year": 342,
          "description": "[Year 342] Was ousted from the Mayor's office by Corvin Stoneheart.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_a3e951d4",
            "year": 342,
            "description": "[Year 342] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Corvin Stoneheart"
          }
        },
        {
          "id": "ev_9c7fc3fb",
          "year": 343,
          "description": "[Year 343] Formed a strong bond with Corvin Stoneheart.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_c931192a",
          "year": 344,
          "description": "[Year 344] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "79be39994486": "mourns",
        "a62916e61758": "loves",
        "8f2678ced78e": "hates",
        "61a0353a1a23": "likes",
        "8af6ccaab545": "likes"
      }
    },
    {
      "id": "8f2678ced78e",
      "name": "Branwen Coldmere",
      "age": 56,
      "role": "Beggar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "fair",
        "height": "average",
        "build": "stocky",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "bald",
          "style": "straight"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "torn rags",
          "feet": "worn boots",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_bcc2a18e",
          "year": 313,
          "description": "[Year 313] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_2ddc21fc",
          "year": 322,
          "description": "[Year 322] Fell deeply in love with Hilda Wintershield.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_f321dabc",
          "year": 337,
          "description": "[Year 337] Discovered The Obsidian Crown in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_17717426",
          "year": 342,
          "description": "[Year 342] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e0b9b199",
          "year": 347,
          "description": "[Year 347] Discovered The Crimson Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_17ca3cda",
          "year": 349,
          "description": "[Year 349] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_4952835a",
          "year": 322,
          "description": "[Year 322] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "4bbab03e332d": "loves"
      }
    },
    {
      "id": "61a0353a1a23",
      "name": "Brennan Oakmere",
      "age": 31,
      "role": "Bandit",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "blue",
        "skinTone": "fair",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "blond",
          "length": "short",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 330] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_5ab8ae9d",
          "year": 330,
          "description": "[Year 330] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c99a8318",
          "year": 333,
          "description": "[Year 333] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "955318130786",
      "name": "Cedric Ashveil",
      "age": 26,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "pale",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "dark brown",
          "length": "long",
          "style": "tied back"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "iron helm",
          "torso": "plate breastplate",
          "legs": "chainmail chausses",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [
          {
            "location": "neck",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 330] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_c5710d22",
          "year": 333,
          "description": "[Year 333] Started a bitter blood feud with Lysander Coldmere.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_9b915b30",
          "year": 335,
          "description": "[Year 335] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_d1e341bc",
          "year": 336,
          "description": "[Year 336] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "b07a5337d7be": "hates"
      }
    },
    {
      "id": "b944994b3af5",
      "name": "Soraya Redmane",
      "age": 44,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "tan",
        "height": "tall",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "platinum",
          "length": "short",
          "style": "wavy"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "none",
          "torso": "padded gambeson",
          "legs": "leather trousers",
          "feet": "sandals",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 330] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_a9edd267",
          "year": 330,
          "description": "[Year 330] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_76ffa3db",
          "year": 343,
          "description": "[Year 343] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "8af6ccaab545",
      "name": "Corvin Stoneheart",
      "age": 48,
      "role": "Mayor",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "olive",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "long",
          "style": "curly"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "merchant coat",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "3057f4828d37",
          "name": "The Obsidian Chronicle",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the lineage of the First Mayor. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 349,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 265,
          "value": 265
        }
      ],
      "quests": [],
      "history": [
        "[Year 330] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_d605ce8e",
          "year": 335,
          "description": "[Year 335] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_54385072",
          "year": 338,
          "description": "[Year 338] Started a bitter blood feud with Lysander Coldmere.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_a1a1a480",
          "year": 340,
          "description": "[Year 340] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a3e951d4",
          "year": 342,
          "description": "[Year 342] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_99993d15",
          "year": 349,
          "description": "[Year 349] Discovered The Obsidian Chronicle in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_8ebd5af5",
          "year": 356,
          "description": "[Year 356] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "b07a5337d7be": "hates"
      }
    },
    {
      "id": "dcc9796e1348",
      "name": "Rowena Wolfmane",
      "age": 73,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "blue",
        "skinTone": "pale",
        "height": "tall",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "grey",
          "length": "long",
          "style": "straight"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "none",
          "torso": "merchant coat",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "d134f262a22a",
          "name": "The Astral Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 368,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 166,
          "value": 166
        },
        {
          "id": "1465bc64cecf",
          "name": "The Iron Band",
          "type": "Jewelry",
          "description": "A piece of adornment that is heavy with ancient malice.",
          "content": null,
          "creationYear": 388,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 661,
          "value": 661
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_ced9e748",
          "year": 354,
          "description": "[Year 354] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_dfb273aa",
          "year": 359,
          "description": "[Year 359] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_3fbb3f65",
          "year": 368,
          "description": "[Year 368] Discovered The Astral Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_d113b274",
          "year": 373,
          "description": "[Year 373] Formed a strong bond with Ulf Ironwood.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_780ecfee",
          "year": 380,
          "description": "[Year 380] Started a bitter blood feud with Nadir Blackthorn.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_42f753b8",
          "year": 383,
          "description": "[Year 383] Fell deeply in love with Faelan Thorngate.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_c84f925d",
          "year": 384,
          "description": "[Year 384] Welcomed their child, Hadrian Blackthorn.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_d023d1b3",
          "year": 385,
          "description": "[Year 385] Formed a strong bond with Aldwyn Ashfall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_c919c6de",
          "year": 388,
          "description": "[Year 388] Discovered The Iron Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_c8dd242f",
          "year": 389,
          "description": "[Year 389] Started a bitter blood feud with Faelan Thorngate.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_9bd06b02",
          "year": 390,
          "description": "[Year 390] Welcomed their child, Elowen Blackthorn.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_ed525bd7",
          "year": 391,
          "description": "[Year 391] Started a bitter blood feud with Aldwyn Ashfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f808a9a4",
          "year": 394,
          "description": "[Year 394] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_9ececf26",
          "year": 403,
          "description": "[Year 403] Formed a strong bond with Gunnar Rockhollow.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_d2544ae0",
          "year": 404,
          "description": "[Year 404] Packed their belongings and migrated to coordinates X:18, Y:48.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_72b584c2",
          "year": 373,
          "description": "[Year 373] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "2aae8d092648": "likes",
        "a76ccabdd3cf": "hates",
        "96afb7cf5d02": "hates",
        "75124e5b9a0e": "child",
        "632fa087a44f": "hates",
        "89f344ba6736": "child",
        "98ea0e908f99": "loves",
        "a1c9ddc0a023": "likes"
      }
    },
    {
      "id": "2aae8d092648",
      "name": "Ulf Ironwood",
      "age": 43,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "tan",
        "height": "tall",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "dark brown",
          "length": "short",
          "style": "shaved sides"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_35ed0de2",
          "year": 356,
          "description": "[Year 356] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_bfc3f7aa",
          "year": 363,
          "description": "[Year 363] Started a bitter blood feud with Elowen Cindermere.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_885cf52b",
          "year": 370,
          "description": "[Year 370] Discovered The Bone Codex in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_d3f43c50",
          "year": 371,
          "description": "[Year 371] Discovered The Obsidian Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ca6bfd7f",
          "year": 374,
          "description": "[Year 374] Discovered The Iron Manifesto in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_7272f9cb",
          "year": 378,
          "description": "[Year 378] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_36de39bf",
          "year": 379,
          "description": "[Year 379] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "51b046e31a22": "hates",
        "5e0c21541da3": "loves"
      }
    },
    {
      "id": "96afb7cf5d02",
      "name": "Faelan Thorngate",
      "age": 45,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "pale",
        "height": "tall",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "long",
          "style": "straight"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "merchant coat",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "silk sash"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_67fc10d1",
          "year": 374,
          "description": "[Year 374] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_9cbe04bd",
          "year": 375,
          "description": "[Year 375] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_cf1f22c0",
          "year": 382,
          "description": "[Year 382] Started a bitter blood feud with Nadir Blackthorn.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_dbadaf07",
          "year": 386,
          "description": "[Year 386] Formed a strong bond with Aldwyn Ashfall.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_d6397876",
          "year": 389,
          "description": "[Year 389] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "a76ccabdd3cf": "hates",
        "dcc9796e1348": "loves",
        "632fa087a44f": "likes"
      }
    },
    {
      "id": "9c6222820b7f",
      "name": "Selwyn Deepforge",
      "age": 36,
      "role": "Beggar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "olive",
        "height": "tall",
        "build": "muscular",
        "baldness": true,
        "hair": {
          "color": "red",
          "length": "short",
          "style": "braided"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "tattered rags",
          "legs": "wool breeches",
          "feet": "bare",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "86fe36702e06",
          "name": "The Crimson Chalice",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 381,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 527,
          "value": 527
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_21cb2793",
          "year": 378,
          "description": "[Year 378] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_f6a9d50d",
          "year": 379,
          "description": "[Year 379] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_cfee9f9e",
          "year": 381,
          "description": "[Year 381] Discovered The Crimson Chalice in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_f90b65da",
          "year": 385,
          "description": "[Year 385] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "632fa087a44f",
      "name": "Aldwyn Ashfall",
      "age": 44,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "green",
        "skinTone": "pale",
        "height": "tall",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "blond",
          "length": "long",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "padded gambeson",
          "legs": "leather trousers",
          "feet": "sandals",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_e58fabc6",
          "year": 381,
          "description": "[Year 381] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_e8c04cfb",
          "year": 387,
          "description": "[Year 387] Formed a strong bond with Faelan Thorngate.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_2dc01565",
          "year": 389,
          "description": "[Year 389] Discovered The Bone Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_3a98296f",
          "year": 390,
          "description": "[Year 390] Discovered The Void Amulet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_009f56cb",
          "year": 396,
          "description": "[Year 396] Started a bitter blood feud with Radovan Highkeep.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_ff1d4b14",
          "year": 397,
          "description": "[Year 397] Fell deeply in love with Gunnar Stonehelm.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_2b1edbe0",
          "year": 400,
          "description": "[Year 400] Formed a strong bond with Valdis Darkwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_68cf2e9f",
          "year": 402,
          "description": "[Year 402] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "96afb7cf5d02": "likes",
        "6d801c9b97a0": "hates",
        "4e4799ae1604": "loves",
        "98ea0e908f99": "likes"
      }
    },
    {
      "id": "75124e5b9a0e",
      "name": "Hadrian Blackthorn",
      "age": 14,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "tan",
        "height": "short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "black",
          "length": "cropped",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "padded gambeson",
          "legs": "leather trousers",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_a37f2b50",
          "year": 397,
          "description": "[Year 397] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "a76ccabdd3cf": "parent",
        "dcc9796e1348": "parent"
      }
    },
    {
      "id": "6d801c9b97a0",
      "name": "Radovan Highkeep",
      "age": 36,
      "role": "Beggar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "fair",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "auburn",
          "length": "long",
          "style": "curly"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wool cap",
          "torso": "tattered rags",
          "legs": "torn rags",
          "feet": "bare",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "e05d3cf41dd6",
          "name": "The Ethereal Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 399,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 449,
          "value": 449
        }
      ],
      "quests": [],
      "history": [
        "[Year 390] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_4397a9ca",
          "year": 394,
          "description": "[Year 394] Started a bitter blood feud with Nadir Blackthorn.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_e564f4ca",
          "year": 396,
          "description": "[Year 396] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a3dd4beb",
          "year": 399,
          "description": "[Year 399] Discovered The Ethereal Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_92e8cf40",
          "year": 404,
          "description": "[Year 404] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "a76ccabdd3cf": "hates"
      }
    },
    {
      "id": "4e4799ae1604",
      "name": "Gunnar Stonehelm",
      "age": 31,
      "role": "Mayor",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "olive",
        "height": "tall",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "long",
          "style": "wavy"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "veil",
          "torso": "silk robe",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "silk sash"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "left hand",
            "motif": "serpent"
          },
          {
            "location": "chest",
            "motif": "skull"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "579be36ed818",
          "name": "The Bone Blade",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 389,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 288,
          "value": 288
        },
        {
          "id": "9b5af9471e85",
          "name": "The Void Amulet",
          "type": "Jewelry",
          "description": "A piece of adornment that is whispering faintly when held near the ear.",
          "content": null,
          "creationYear": 390,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 602,
          "value": 602
        }
      ],
      "quests": [],
      "history": [
        "[Year 390] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_e564f4ca",
          "year": 396,
          "description": "[Year 396] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_14cefa87",
          "year": 399,
          "description": "[Year 399] Formed a strong bond with Radovan Highkeep.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_23676c94",
          "year": 402,
          "description": "[Year 402] Inherited belongings from the late Aldwyn Ashfall.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_68cf2e9f",
            "year": 402,
            "description": "[Year 402] died of a sudden fever.",
            "type": "death",
            "actorName": "Aldwyn Ashfall"
          }
        },
        {
          "id": "ev_16fd3a17",
          "year": 403,
          "description": "[Year 403] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_68cf2e9f",
            "year": 402,
            "description": "[Year 402] died of a sudden fever.",
            "type": "death",
            "actorName": "Aldwyn Ashfall"
          }
        },
        {
          "id": "ev_1c64c3e5",
          "year": 403,
          "description": "[Year 403] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_92e8cf40",
          "year": 404,
          "description": "[Year 404] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "632fa087a44f": "mourns",
        "6d801c9b97a0": "likes"
      }
    },
    {
      "id": "33b995656f93",
      "name": "Seren Ironspire",
      "age": 39,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "olive",
        "height": "average",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "shoulder-length",
          "style": "curly"
        },
        "facialHair": "none",
        "clothing": {
          "head": "iron helm",
          "torso": "chainmail hauberk",
          "legs": "chainmail chausses",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 390] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_dc5c6e07",
          "year": 403,
          "description": "[Year 403] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "98ea0e908f99",
      "name": "Valdis Darkwater",
      "age": 44,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "dark brown",
        "height": "average",
        "build": "lean",
        "baldness": true,
        "hair": {
          "color": "black",
          "length": "thinning",
          "style": "straight"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "none",
          "torso": "silk robe",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 390] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_14651b25",
          "year": 392,
          "description": "[Year 392] Formed a strong bond with Gunnar Stonehelm.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_fabac66e",
          "year": 397,
          "description": "[Year 397] Discovered The Bone Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ba034ffd",
          "year": 401,
          "description": "[Year 401] Fell deeply in love with Rowena Wolfmane.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_35b741e4",
          "year": 403,
          "description": "[Year 403] Discovered The Iron Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_5bad15a6",
          "year": 404,
          "description": "[Year 404] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_17b51b52",
          "year": 405,
          "description": "[Year 405] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": null
        },
        {
          "id": "ev_b873098c",
          "year": 405,
          "description": "[Year 405] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_90854f2f",
          "year": 408,
          "description": "[Year 408] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_cfab5896",
          "year": 408,
          "description": "[Year 408] Welcomed their child, Thrain Grimsword.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_61377d15",
          "year": 409,
          "description": "[Year 409] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "4e4799ae1604": "likes",
        "dcc9796e1348": "mourns",
        "07ce1a8944ac": "loves",
        "03e44cb7b6e9": "child"
      }
    },
    {
      "id": "6f2fc8d84b46",
      "name": "Alistair Rockhollow",
      "age": 25,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "brown",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "cropped",
          "style": "wavy"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "leather trousers",
          "feet": "sandals",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "chest",
            "motif": "serpent"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "a82bb90a639d",
          "name": "The Crimson Lantern",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 394,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 496,
          "value": 496
        }
      ],
      "quests": [],
      "history": [
        "[Year 390] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_4d88c676",
          "year": 394,
          "description": "[Year 394] Discovered The Crimson Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_b53764d6",
          "year": 395,
          "description": "[Year 395] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "e5bd0ceef653",
      "name": "Elara Embervane",
      "age": 30,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "tan",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "red",
          "length": "shoulder-length",
          "style": "straight"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "none",
          "torso": "silk robe",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "silk sash"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_605e241c",
          "year": 391,
          "description": "[Year 391] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_3bf94f66",
          "year": 393,
          "description": "[Year 393] Formed a strong bond with Valdis Darkwater.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_daab864f",
          "year": 394,
          "description": "[Year 394] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_257f118b",
          "year": 396,
          "description": "[Year 396] Formed a strong bond with Radovan Highkeep.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_c506ca84",
          "year": 397,
          "description": "[Year 397] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "98ea0e908f99": "likes",
        "6d801c9b97a0": "likes"
      }
    },
    {
      "id": "a1c9ddc0a023",
      "name": "Gunnar Rockhollow",
      "age": 49,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "brown",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "short",
          "style": "straight"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "wool cap",
          "torso": "leather vest",
          "legs": "linen skirt",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "2222c7716352",
          "name": "The Obsidian Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, forged in the heart of a dying star. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 393,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 322,
          "value": 322
        },
        {
          "id": "e1e950e35a1c",
          "name": "The Astral Signet",
          "type": "Jewelry",
          "description": "A piece of adornment that is freezing cold to the touch.",
          "content": null,
          "creationYear": 406,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 600,
          "value": 600
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_2baa8016",
          "year": 392,
          "description": "[Year 392] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_b16ad5a1",
          "year": 392,
          "description": "[Year 392] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_efba34f6",
          "year": 393,
          "description": "[Year 393] Discovered The Obsidian Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_a055068d",
          "year": 399,
          "description": "[Year 399] Started a bitter blood feud with Aldwyn Ashfall.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_6a326d13",
          "year": 400,
          "description": "[Year 400] Started a bitter blood feud with Seren Ironspire.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_0ea19efe",
          "year": 406,
          "description": "[Year 406] Discovered The Astral Signet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ee4ebf5a",
          "year": 407,
          "description": "[Year 407] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "632fa087a44f": "hates",
        "33b995656f93": "hates"
      }
    },
    {
      "id": "03e44cb7b6e9",
      "name": "Thrain Grimsword",
      "age": 11,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "olive",
        "height": "short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "black",
          "length": "cropped",
          "style": "curly"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "padded gambeson",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_94b1af33",
          "year": 418,
          "description": "[Year 418] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "07ce1a8944ac": "parent",
        "98ea0e908f99": "parent"
      }
    },
    {
      "id": "4d23cf3b52c0",
      "name": "Caspian Stonecroft",
      "age": 54,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "brown",
        "height": "average",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "cropped",
          "style": "braided"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "leather hood",
          "torso": "wool tunic",
          "legs": "linen skirt",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [
          {
            "location": "right forearm",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "b2db2ae28fb4",
          "name": "The Iron Chalice",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it smells of ozone and dried blood.",
          "content": null,
          "creationYear": 426,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 646,
          "value": 646
        },
        {
          "id": "30b0aa4035df",
          "name": "The Astral Idol",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 431,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 317,
          "value": 317
        },
        {
          "id": "5ed119c3755e",
          "name": "The Crimson Dagger",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 436,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 402,
          "value": 402
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_f47bcad8",
          "year": 409,
          "description": "[Year 409] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_05a7c6ff",
          "year": 409,
          "description": "[Year 409] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_4e7aadb4",
          "year": 410,
          "description": "[Year 410] Started a bitter blood feud with Halfdan Oakshield.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_f52f4732",
          "year": 417,
          "description": "[Year 417] Started a bitter blood feud with Dragan Marshborn.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_5fe6ce9b",
          "year": 418,
          "description": "[Year 418] Started a bitter blood feud with Leif Stormrider.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_96431c47",
          "year": 426,
          "description": "[Year 426] Discovered The Iron Chalice in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_1499448b",
          "year": 427,
          "description": "[Year 427] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a0f50ddc",
          "year": 431,
          "description": "[Year 431] Discovered The Astral Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_5c695b5a",
          "year": 432,
          "description": "[Year 432] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": null
        },
        {
          "id": "ev_71690cdc",
          "year": 434,
          "description": "[Year 434] Formed a strong bond with Brennan Frostholm.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_c12ee859",
          "year": 435,
          "description": "[Year 435] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_7f6556c6",
          "year": 436,
          "description": "[Year 436] Discovered The Crimson Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_4a20a300",
          "year": 442,
          "description": "[Year 442] Was ousted from the Mayor's office by Emric Stonebreaker.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_a35a903e",
            "year": 442,
            "description": "[Year 442] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Emric Stonebreaker"
          }
        },
        {
          "id": "ev_2a0e75ea",
          "year": 443,
          "description": "[Year 443] Packed their belongings and migrated to coordinates X:5, Y:18.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_76d6b5a0",
          "year": 423,
          "description": "[Year 423] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "7caec96e6941": "hates",
        "abb67ba2dac8": "mourns",
        "3996343f8ccc": "hates",
        "1b1b7de209d6": "hates",
        "a040a2454738": "likes"
      }
    },
    {
      "id": "abb67ba2dac8",
      "name": "Vex Stonecroft",
      "age": 52,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "tan",
        "height": "average",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "short",
          "style": "straight"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "98fe488df8e2",
          "name": "The Crimson Amulet",
          "type": "Jewelry",
          "description": "A piece of adornment that is whispering faintly when held near the ear.",
          "content": null,
          "creationYear": 415,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 516,
          "value": 516
        },
        {
          "id": "46588dba6021",
          "name": "The Bone Amulet",
          "type": "Jewelry",
          "description": "A piece of adornment that is whispering faintly when held near the ear.",
          "content": null,
          "creationYear": 418,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 364,
          "value": 364
        },
        {
          "id": "fbee4092a444",
          "name": "The Astral Idol",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it makes your eyes water.",
          "content": null,
          "creationYear": 430,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 316,
          "value": 316
        }
      ],
      "quests": [],
      "history": [
        "[Year 410] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_5282fcd6",
          "year": 412,
          "description": "[Year 412] Fell deeply in love with Caspian Stonecroft.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_32bafc55",
          "year": 413,
          "description": "[Year 413] Started a bitter blood feud with Sigrun Blackwood.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_57b2730f",
          "year": 414,
          "description": "[Year 414] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8f818368",
          "year": 415,
          "description": "[Year 415] Discovered The Crimson Amulet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_ea845a1a",
          "year": 418,
          "description": "[Year 418] Discovered The Bone Amulet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_6e9ec44c",
          "year": 420,
          "description": "[Year 420] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_0654f41d",
          "year": 423,
          "description": "[Year 423] Started a bitter blood feud with Leif Stormrider.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_3cd65e01",
          "year": 426,
          "description": "[Year 426] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_f41840e5",
          "year": 427,
          "description": "[Year 427] Started a bitter blood feud with Caspian Stonecroft.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_4564c54c",
          "year": 430,
          "description": "[Year 430] Discovered The Astral Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_32d80eac",
          "year": 431,
          "description": "[Year 431] Packed their belongings and migrated to coordinates X:37, Y:15.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_76d6b5a0",
          "year": 423,
          "description": "[Year 423] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "4d23cf3b52c0": "hates",
        "1c6d7007cfa4": "hates",
        "1b1b7de209d6": "hates"
      }
    },
    {
      "id": "1c6d7007cfa4",
      "name": "Sigrun Blackwood",
      "age": 48,
      "role": "Bandit",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "tan",
        "height": "average",
        "build": "lean",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "thinning",
          "style": "braided"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "none",
          "torso": "leather vest",
          "legs": "torn rags",
          "feet": "worn boots",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "55f2866b7034",
          "name": "The Obsidian Idol",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 411,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 562,
          "value": 562
        },
        {
          "id": "ce28b0dfeb41",
          "name": "The Void Blade",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 412,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 175,
          "value": 175
        },
        {
          "id": "500d1dfa65a0",
          "name": "The Void Lantern",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it causes shadows to bend towards it.",
          "content": null,
          "creationYear": 426,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 477,
          "value": 477
        },
        {
          "id": "76d8c9ad7272",
          "name": "The Iron Codex",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the true names of stars. Scrawled frantically in the margins is a handwritten note: \"Blood is the only currency.\"",
          "creationYear": 436,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 540,
          "value": 540
        }
      ],
      "quests": [],
      "history": [
        "[Year 410] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_84b313c2",
          "year": 410,
          "description": "[Year 410] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_2c6f72eb",
          "year": 411,
          "description": "[Year 411] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e6d97f2f",
          "year": 412,
          "description": "[Year 412] Formed a strong bond with Dragan Marshborn.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_f52f4732",
          "year": 417,
          "description": "[Year 417] Started a bitter blood feud with Dragan Marshborn.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_a724b969",
          "year": 423,
          "description": "[Year 423] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_2c31adc0",
          "year": 424,
          "description": "[Year 424] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_9194dbe6",
          "year": 425,
          "description": "[Year 425] Inherited belongings from the late Halfdan Oakshield.",
          "type": "inheritance",
          "causedBy": {
            "id": "ev_6d1f8864",
            "year": 425,
            "description": "[Year 425] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Halfdan Oakshield"
          }
        },
        {
          "id": "ev_d3cded75",
          "year": 426,
          "description": "[Year 426] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_6d1f8864",
            "year": 425,
            "description": "[Year 425] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Halfdan Oakshield"
          }
        },
        {
          "id": "ev_2a6206dd",
          "year": 426,
          "description": "[Year 426] Discovered The Void Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_280414d2",
          "year": 433,
          "description": "[Year 433] Fell deeply in love with Brennan Frostholm.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_daea02da",
          "year": 436,
          "description": "[Year 436] Discovered The Iron Codex in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_56b0002e",
          "year": 438,
          "description": "[Year 438] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_c07ac51f",
          "year": 438,
          "description": "[Year 438] Packed their belongings and migrated to coordinates X:94, Y:17.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_76d6b5a0",
          "year": 423,
          "description": "[Year 423] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "3996343f8ccc": "hates",
        "7caec96e6941": "mourns",
        "a040a2454738": "loves"
      }
    },
    {
      "id": "3996343f8ccc",
      "name": "Dragan Marshborn",
      "age": 41,
      "role": "Bandit",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "blue",
        "skinTone": "dark brown",
        "height": "average",
        "build": "average",
        "baldness": true,
        "hair": {
          "color": "brown",
          "length": "thinning",
          "style": "straight"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "torn rags",
          "feet": "bare",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "88a258d17f79",
          "name": "The Bone Mace",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 419,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 136,
          "value": 136
        },
        {
          "id": "d2d4da98bb61",
          "name": "The Iron Urn",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 430,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 494,
          "value": 494
        }
      ],
      "quests": [],
      "history": [
        "[Year 410] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_45a4407a",
          "year": 419,
          "description": "[Year 419] Discovered The Bone Mace in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_59828678",
          "year": 429,
          "description": "[Year 429] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_f1c331de",
          "year": 430,
          "description": "[Year 430] Discovered The Iron Urn in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_099c18f5",
          "year": 431,
          "description": "[Year 431] Packed their belongings and migrated to coordinates X:57, Y:20.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_de60c5c6",
          "year": 424,
          "description": "[Year 424] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "1b1b7de209d6",
      "name": "Leif Stormrider",
      "age": 30,
      "role": "Beggar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "fair",
        "height": "average",
        "build": "average",
        "baldness": false,
        "hair": {
          "color": "brown",
          "length": "long",
          "style": "wavy"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "linen shirt",
          "legs": "torn rags",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 410] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_baf71d75",
          "year": 412,
          "description": "[Year 412] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a357c6d8",
          "year": 423,
          "description": "[Year 423] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "7caec96e6941",
      "name": "Halfdan Oakshield",
      "age": 46,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "olive",
        "height": "tall",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "cropped",
          "style": "braided"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "wool tunic",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 410] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_cfbdc499",
          "year": 411,
          "description": "[Year 411] Discovered The Obsidian Idol in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_44fecd21",
          "year": 412,
          "description": "[Year 412] Discovered The Void Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_84bf749a",
          "year": 413,
          "description": "[Year 413] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_4f37b226",
          "year": 419,
          "description": "[Year 419] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_d3119ef7",
          "year": 420,
          "description": "[Year 420] Fell deeply in love with Sigrun Blackwood.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_849ee4ba",
          "year": 421,
          "description": "[Year 421] Formed a strong bond with Helga Oakheart.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_6d1f8864",
          "year": 425,
          "description": "[Year 425] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "1c6d7007cfa4": "loves",
        "f69058062b24": "likes"
      }
    },
    {
      "id": "f69058062b24",
      "name": "Helga Oakheart",
      "age": 51,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "green",
        "skinTone": "pale",
        "height": "tall",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "cropped",
          "style": "tied back"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "iron helm",
          "torso": "padded gambeson",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "bandolier"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "4886371fbeea",
          "name": "The Obsidian Chalice",
          "type": "Relic",
          "description": "A bizarre artifact from a bygone era. Just looking at it tastes like ash in the back of your throat.",
          "content": null,
          "creationYear": 422,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 742,
          "value": 742
        },
        {
          "id": "c565a1914ff1",
          "name": "The Bone Grimoire",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail forgotten blood magic. Scrawled frantically in the margins is a handwritten note: \"I hear the dirt breathing.\"",
          "creationYear": 432,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 301,
          "value": 301
        }
      ],
      "quests": [],
      "history": [
        "[Year 410] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_d43b9c09",
          "year": 417,
          "description": "[Year 417] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_7bdead4d",
          "year": 422,
          "description": "[Year 422] Discovered The Obsidian Chalice in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_54feaaa6",
          "year": 430,
          "description": "[Year 430] Started a bitter blood feud with Brennan Frostholm.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_3201b5be",
          "year": 432,
          "description": "[Year 432] Discovered The Bone Grimoire in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_bfb54846",
          "year": 433,
          "description": "[Year 433] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_13600d83",
          "year": 436,
          "description": "[Year 436] was killed by a wild beast.",
          "type": "death",
          "causedBy": null
        },
        {
          "id": "ev_de60c5c6",
          "year": 424,
          "description": "[Year 424] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "a040a2454738": "hates"
      }
    },
    {
      "id": "54b559faf79d",
      "name": "Sven Brightwater",
      "age": 46,
      "role": "Cultist",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "fair",
        "height": "average",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "short",
          "style": "shaved sides"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "veil",
          "torso": "linen shirt",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "none"
        },
        "scars": [
          {
            "location": "right cheek",
            "type": "pockmark"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_7421fc04",
          "year": 410,
          "description": "[Year 410] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_54a9227c",
          "year": 412,
          "description": "[Year 412] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_4f37b226",
          "year": 419,
          "description": "[Year 419] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_64a4a9c4",
          "year": 421,
          "description": "[Year 421] Fell deeply in love with Ragna Grimsword.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_4086977a",
          "year": 429,
          "description": "[Year 429] Packed their belongings and migrated to coordinates X:2, Y:64.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_76d6b5a0",
          "year": 423,
          "description": "[Year 423] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "07ce1a8944ac": "loves"
      }
    },
    {
      "id": "c30448f5bfe7",
      "name": "Hilda Highwatch",
      "age": 36,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "hazel",
        "skinTone": "tan",
        "height": "average",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "long",
          "style": "braided"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "leather hood",
          "torso": "padded gambeson",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_96965ec4",
          "year": 418,
          "description": "[Year 418] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_4a3dc4b2",
          "year": 419,
          "description": "[Year 419] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_f4121981",
          "year": 422,
          "description": "[Year 422] Formed a strong bond with Leif Stormrider.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_2050c585",
          "year": 426,
          "description": "[Year 426] Packed their belongings and migrated to coordinates X:7, Y:36.",
          "type": "migration",
          "causedBy": null
        },
        {
          "id": "ev_76d6b5a0",
          "year": 423,
          "description": "[Year 423] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {
        "1b1b7de209d6": "likes"
      }
    },
    {
      "id": "2fdba0363df9",
      "name": "Orik Marshvale",
      "age": 55,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "fair",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "streaked grey",
          "length": "short",
          "style": "shaved sides"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "veil",
          "torso": "merchant coat",
          "legs": "wool breeches",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "right shoulder",
            "motif": "wolf"
          }
        ],
        "marks": [
          {
            "location": "neck",
            "type": "birthmark"
          }
        ]
      },
      "dead": true,
      "inventory": [
        {
          "id": "be68c81b41b9",
          "name": "The Void Codex",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail forgotten blood magic. Scrawled frantically in the margins is a handwritten note: \"Do not trust the guards.\"",
          "creationYear": 440,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 391,
          "value": 391
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_bf988dc8",
          "year": 435,
          "description": "[Year 435] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_5bbc2beb",
          "year": 437,
          "description": "[Year 437] Formed a strong bond with Brennan Frostholm.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_d8b18449",
          "year": 440,
          "description": "[Year 440] Discovered The Void Codex in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_a5de6226",
          "year": 444,
          "description": "[Year 444] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_8d22e872",
          "year": 448,
          "description": "[Year 448] Started a bitter blood feud with Seren Goldmane.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_577d743a",
          "year": 457,
          "description": "[Year 457] Was ousted from the Mayor's office by Seren Goldmane.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_cf858131",
            "year": 457,
            "description": "[Year 457] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Seren Goldmane"
          }
        },
        {
          "id": "ev_1b19f343",
          "year": 459,
          "description": "[Year 459] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8294f721",
          "year": 467,
          "description": "[Year 467] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "a040a2454738": "likes",
        "63c7477fdbfb": "hates"
      }
    },
    {
      "id": "a2880d7b60f5",
      "name": "Emric Stonebreaker",
      "age": 57,
      "role": "Guard",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "tan",
        "height": "tall",
        "build": "average",
        "baldness": true,
        "hair": {
          "color": "streaked grey",
          "length": "bald",
          "style": "straight"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "leather hood",
          "torso": "plate breastplate",
          "legs": "chainmail chausses",
          "feet": "worn boots",
          "accessory": "leather belt"
        },
        "scars": [
          {
            "location": "left cheek",
            "type": "brand"
          },
          {
            "location": "neck",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "8306cb75b5fb",
          "name": "The Void Grimoire",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail the lineage of the First Mayor. Scrawled frantically in the margins is a handwritten note: \"The eclipse is a lie.\"",
          "creationYear": 457,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 162,
          "value": 162
        }
      ],
      "quests": [],
      "history": [
        "[Year 440] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_6e17bf26",
          "year": 441,
          "description": "[Year 441] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a35a903e",
          "year": 442,
          "description": "[Year 442] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_a505604f",
          "year": 444,
          "description": "[Year 444] Was ousted from the Mayor's office by Orik Marshvale.",
          "type": "power_seizure",
          "causedBy": {
            "id": "ev_a5de6226",
            "year": 444,
            "description": "[Year 444] Seized power and became the new Mayor.",
            "type": "power_seizure",
            "actorName": "Orik Marshvale"
          }
        },
        {
          "id": "ev_91994cd9",
          "year": 445,
          "description": "[Year 445] Started a bitter blood feud with Sylas Winterborne.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_a394982e",
          "year": 455,
          "description": "[Year 455] Started a bitter blood feud with Seren Goldmane.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_741eeee0",
          "year": 457,
          "description": "[Year 457] Discovered The Void Grimoire in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_d111dfb3",
          "year": 471,
          "description": "[Year 471] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ceaaed7b",
          "year": 472,
          "description": "[Year 472] Started a bitter blood feud with Freyja Lightbringer.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_9e695642",
          "year": 473,
          "description": "[Year 473] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "3de4989adcec": "hates",
        "63c7477fdbfb": "hates",
        "2d4beac9008c": "hates"
      }
    },
    {
      "id": "18f3fb8621be",
      "name": "Gwyn Ironspire",
      "age": 35,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "tan",
        "height": "tall",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "black",
          "length": "shoulder-length",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "none",
          "torso": "plate breastplate",
          "legs": "linen skirt",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [
          {
            "location": "left cheek",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 480] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_601e9377",
          "year": 483,
          "description": "[Year 483] Started a bitter blood feud with Tavros Brightmere.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_85c2c5a6",
          "year": 485,
          "description": "[Year 485] Fell deeply in love with Ragna Frostbeard.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_de045d04",
          "year": 487,
          "description": "[Year 487] Had a child named Valdis Ironspire with Ragna Frostbeard.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_4901baeb",
          "year": 488,
          "description": "[Year 488] Had a child named Oswin Ironspire with Ragna Frostbeard.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_cb6e84ff",
          "year": 493,
          "description": "[Year 493] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "7eee550510a1": "hates",
        "5691a33890f1": "loves",
        "7fa82e25a852": "child",
        "1625425fc371": "child"
      }
    },
    {
      "id": "b794b2002c7b",
      "name": "Zorya Wintershield",
      "age": 20,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "fair",
        "height": "average",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "blond",
          "length": "shoulder-length",
          "style": "straight"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "crown",
          "torso": "plate breastplate",
          "legs": "wool breeches",
          "feet": "riding boots",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 480] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_d27d9c7a",
          "year": 481,
          "description": "[Year 481] Formed a strong bond with Tavros Brightmere.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_24a79c82",
          "year": 482,
          "description": "[Year 482] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "7eee550510a1": "likes"
      }
    },
    {
      "id": "b08bf87dd0ff",
      "name": "Carwyn Redclaw",
      "age": 31,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "fair",
        "height": "average",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "dark brown",
          "length": "short",
          "style": "tied back"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "leather trousers",
          "feet": "sandals",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_b30b095a",
          "year": 482,
          "description": "[Year 482] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_2f6b157d",
          "year": 483,
          "description": "[Year 483] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "5691a33890f1",
      "name": "Ragna Frostbeard",
      "age": 66,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "black",
        "skinTone": "olive",
        "height": "tall",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "grey",
          "length": "short",
          "style": "braided"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "silk robe",
          "legs": "wool breeches",
          "feet": "riding boots",
          "accessory": "fur-lined cloak"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_b2c66516",
          "year": 484,
          "description": "[Year 484] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_22f9ded4",
          "year": 487,
          "description": "[Year 487] Welcomed their child, Valdis Ironspire.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_2d3b3613",
          "year": 488,
          "description": "[Year 488] Welcomed their child, Oswin Ironspire.",
          "type": "birth",
          "causedBy": null
        },
        {
          "id": "ev_776cf2ee",
          "year": 492,
          "description": "[Year 492] Discovered The Void Lantern in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_75f07342",
          "year": 494,
          "description": "[Year 494] Was heartbroken by the loss of their love.",
          "type": "grief",
          "causedBy": {
            "id": "ev_cb6e84ff",
            "year": 493,
            "description": "[Year 493] passed away peacefully in their sleep.",
            "type": "death",
            "actorName": "Gwyn Ironspire"
          }
        },
        {
          "id": "ev_d472dc34",
          "year": 495,
          "description": "[Year 495] Fell deeply in love with Seren Goldmane.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_53329e89",
          "year": 497,
          "description": "[Year 497] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_ad87a76a",
          "year": 499,
          "description": "[Year 499] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_a371237d",
          "year": 503,
          "description": "[Year 503] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_30e57a6d",
          "year": 512,
          "description": "[Year 512] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "18f3fb8621be": "mourns",
        "7fa82e25a852": "child",
        "1625425fc371": "child",
        "63c7477fdbfb": "loves"
      }
    },
    {
      "id": "7fa82e25a852",
      "name": "Valdis Ironspire",
      "age": 4,
      "role": "Child",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "grey",
        "skinTone": "olive",
        "height": "very short",
        "build": "slight",
        "baldness": true,
        "hair": {
          "color": "dark brown",
          "length": "cropped",
          "style": "braided"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "wool breeches",
          "feet": "worn boots",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_c1a33250",
          "year": 490,
          "description": "[Year 490] Died of a tragic childhood fever.",
          "type": "child_death",
          "causedBy": null
        }
      ],
      "memories": {
        "18f3fb8621be": "parent",
        "5691a33890f1": "parent"
      }
    },
    {
      "id": "62b1d4ac7682",
      "name": "Vesna Ironmantle",
      "age": 92,
      "role": "Cultist",
      "status": "Alive",
      "appearance": {
        "dead": false,
        "eyeColor": "amber",
        "skinTone": "olive",
        "height": "average",
        "build": "frail",
        "baldness": true,
        "hair": {
          "color": "white",
          "length": "bald",
          "style": "tied back"
        },
        "facialHair": "short beard",
        "clothing": {
          "head": "wool cap",
          "torso": "silk robe",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": false,
      "inventory": [
        {
          "id": "13935d145c7d",
          "name": "The Iron Halberd",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 488,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 225,
          "value": 225
        },
        {
          "id": "a6d5d645d318",
          "name": "The Bone Blade",
          "type": "Weapon",
          "description": "A brutal instrument of war, crafted by a mad blacksmith. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 495,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 107,
          "value": 107
        }
      ],
      "quests": [
        {
          "type": "Bounty",
          "title": "Eliminate Elowen Ironwood",
          "description": "My blood feud with Elowen Ironwood must end. Deal with them.",
          "target": "ea16a3e41448"
        }
      ],
      "history": [
        {
          "id": "ev_bb206f07",
          "year": 488,
          "description": "[Year 488] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_01a457b1",
          "year": 488,
          "description": "[Year 488] Discovered The Iron Halberd in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_9d85a5ee",
          "year": 492,
          "description": "[Year 492] Formed a strong bond with Gwyn Ironspire.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_c201e8c4",
          "year": 495,
          "description": "[Year 495] Discovered The Bone Blade in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_4e1d1b6c",
          "year": 498,
          "description": "[Year 498] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_d91bc895",
          "year": 516,
          "description": "[Year 516] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_7ea170c0",
          "year": 533,
          "description": "[Year 533] Started a bitter blood feud with Seren Goldmane.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_09d6c2ca",
          "year": 537,
          "description": "[Year 537] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8dfd9f2b",
          "year": 544,
          "description": "[Year 544] Started a bitter blood feud with Elowen Ironwood.",
          "type": "rivalry",
          "causedBy": null
        }
      ],
      "memories": {
        "18f3fb8621be": "likes",
        "63c7477fdbfb": "hates",
        "ea16a3e41448": "hates"
      }
    },
    {
      "id": "ea16a3e41448",
      "name": "Elowen Ironwood",
      "age": 89,
      "role": "Bandit",
      "status": "Alive",
      "appearance": {
        "dead": false,
        "eyeColor": "violet",
        "skinTone": "fair",
        "height": "average",
        "build": "frail",
        "baldness": false,
        "hair": {
          "color": "white",
          "length": "short",
          "style": "straight"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "wool cap",
          "torso": "leather vest",
          "legs": "torn rags",
          "feet": "sandals",
          "accessory": "rope belt"
        },
        "scars": [
          {
            "location": "forehead",
            "type": "burn"
          },
          {
            "location": "lip",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": false,
      "inventory": [
        {
          "id": "ada534696d9e",
          "name": "The Bone Amulet",
          "type": "Jewelry",
          "description": "A piece of adornment that is freezing cold to the touch.",
          "content": null,
          "creationYear": 516,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 240,
          "value": 240
        },
        {
          "id": "c6d773f3cd1e",
          "name": "The Bone Dagger",
          "type": "Weapon",
          "description": "A brutal instrument of war, pulled from the chest of a tyrant. It feels perfectly balanced, yet deeply unsettling.",
          "content": null,
          "creationYear": 523,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 392,
          "value": 392
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_1553b73f",
          "year": 497,
          "description": "[Year 497] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_8f2fe574",
          "year": 497,
          "description": "[Year 497] Formed a strong bond with Sigrid Thornback.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_0159eea4",
          "year": 502,
          "description": "[Year 502] Became a Guard.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_225c4536",
          "year": 511,
          "description": "[Year 511] Started a bitter blood feud with Sigrid Thornback.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_607abfc2",
          "year": 512,
          "description": "[Year 512] Formed a strong bond with Seren Goldmane.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_9a8b39f0",
          "year": 516,
          "description": "[Year 516] Discovered The Bone Amulet in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_a604498b",
          "year": 519,
          "description": "[Year 519] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_949ff4ef",
          "year": 523,
          "description": "[Year 523] Discovered The Bone Dagger in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_799340c0",
          "year": 525,
          "description": "[Year 525] Formed a strong bond with Oswin Ironspire.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_170e9c6e",
          "year": 538,
          "description": "[Year 538] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_9630bda7",
          "year": 541,
          "description": "[Year 541] Seized power and became the new Mayor.",
          "type": "power_seizure",
          "causedBy": null
        },
        {
          "id": "ev_9cedc005",
          "year": 547,
          "description": "[Year 547] Became a Bandit.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_8107cf8d",
          "year": 548,
          "description": "[Year 548] Formed a strong bond with Vesna Ironmantle.",
          "type": "friendship",
          "causedBy": null
        }
      ],
      "memories": {
        "4f39f5e7b6fa": "hates",
        "63c7477fdbfb": "likes",
        "1625425fc371": "likes",
        "62b1d4ac7682": "likes"
      }
    },
    {
      "id": "7517bc30e1af",
      "name": "Dragan Stonebreaker",
      "age": 62,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "pale grey",
        "skinTone": "pale",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "grey",
          "length": "cropped",
          "style": "shaved sides"
        },
        "facialHair": "braided beard",
        "clothing": {
          "head": "none",
          "torso": "wool tunic",
          "legs": "linen skirt",
          "feet": "sandals",
          "accessory": "rope belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_38f185de",
          "year": 510,
          "description": "[Year 510] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_4c5ef699",
          "year": 510,
          "description": "[Year 510] Formed a strong bond with Elowen Ironwood.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_095c97c6",
          "year": 511,
          "description": "[Year 511] Fell deeply in love with Oswin Ironspire.",
          "type": "romance",
          "causedBy": null
        },
        {
          "id": "ev_a6bf4dfb",
          "year": 514,
          "description": "[Year 514] Formed a strong bond with Sigrid Thornback.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_ed06d891",
          "year": 515,
          "description": "[Year 515] Discovered The Iron Ring in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_f3584629",
          "year": 519,
          "description": "[Year 519] Formed a strong bond with Vesna Ironmantle.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_8b407782",
          "year": 534,
          "description": "[Year 534] Started a bitter blood feud with Orik Oakheart.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_685b55ad",
          "year": 538,
          "description": "[Year 538] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "ea16a3e41448": "likes",
        "1625425fc371": "loves",
        "4f39f5e7b6fa": "likes",
        "62b1d4ac7682": "likes",
        "d35f54183fc1": "hates"
      }
    },
    {
      "id": "eb5fedae4476",
      "name": "Maeve Stormwall",
      "age": 62,
      "role": "Merchant",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "green",
        "skinTone": "brown",
        "height": "tall",
        "build": "lean",
        "baldness": true,
        "hair": {
          "color": "grey",
          "length": "bald",
          "style": "shaved sides"
        },
        "facialHair": "none",
        "clothing": {
          "head": "wool cap",
          "torso": "padded gambeson",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [
          {
            "location": "forehead",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [
        {
          "id": "71cfa4b2d2d3",
          "name": "The Obsidian Band",
          "type": "Jewelry",
          "description": "A piece of adornment that is pulsing with a faint, sickly light.",
          "content": null,
          "creationYear": 527,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 233,
          "value": 233
        }
      ],
      "quests": [],
      "history": [
        {
          "id": "ev_105936c6",
          "year": 518,
          "description": "[Year 518] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_99ff91ee",
          "year": 526,
          "description": "[Year 526] Started a bitter blood feud with Vesna Ironmantle.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_a2aa255c",
          "year": 527,
          "description": "[Year 527] Discovered The Obsidian Band in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        },
        {
          "id": "ev_e5a68bff",
          "year": 529,
          "description": "[Year 529] Became a Scholar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_e90c6d89",
          "year": 534,
          "description": "[Year 534] Became a Cultist.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_45825af9",
          "year": 535,
          "description": "[Year 535] Became a Beggar.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_fbac97b7",
          "year": 542,
          "description": "[Year 542] Became a Merchant.",
          "type": "career_shift",
          "causedBy": null
        },
        {
          "id": "ev_116b934c",
          "year": 545,
          "description": "[Year 545] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "62b1d4ac7682": "hates"
      }
    },
    {
      "id": "d35f54183fc1",
      "name": "Orik Oakheart",
      "age": 29,
      "role": "Citizen",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "brown",
        "skinTone": "ebony",
        "height": "tall",
        "build": "heavyset",
        "baldness": false,
        "hair": {
          "color": "auburn",
          "length": "short",
          "style": "tied back"
        },
        "facialHair": "goatee",
        "clothing": {
          "head": "wool cap",
          "torso": "linen shirt",
          "legs": "leather trousers",
          "feet": "worn boots",
          "accessory": "travel cloak"
        },
        "scars": [
          {
            "location": "neck",
            "type": "slash"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        {
          "id": "ev_d4c43e32",
          "year": 531,
          "description": "[Year 531] Arrived in town seeking a new life.",
          "type": "immigration",
          "causedBy": null
        },
        {
          "id": "ev_4c9f6010",
          "year": 534,
          "description": "[Year 534] Formed a strong bond with Elowen Ironwood.",
          "type": "friendship",
          "causedBy": null
        },
        {
          "id": "ev_3359a7b1",
          "year": 535,
          "description": "[Year 535] Started a bitter blood feud with Dragan Stonebreaker.",
          "type": "rivalry",
          "causedBy": null
        },
        {
          "id": "ev_45a7a081",
          "year": 540,
          "description": "[Year 540] passed away peacefully in their sleep.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {
        "ea16a3e41448": "likes",
        "7517bc30e1af": "hates"
      }
    },
    {
      "id": "067a448393a5",
      "name": "Elara Grimshaw",
      "age": 26,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "amber",
        "skinTone": "pale",
        "height": "tall",
        "build": "muscular",
        "baldness": false,
        "hair": {
          "color": "red",
          "length": "long",
          "style": "shaved sides"
        },
        "facialHair": "thin mustache",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "plate breastplate",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 550] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_9ac85f65",
          "year": 550,
          "description": "[Year 550] died of a sudden fever.",
          "type": "death",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "95a6ee707299",
      "name": "Declan Stoneheart",
      "age": 20,
      "role": "Scholar",
      "status": "Dead",
      "appearance": {
        "dead": true,
        "eyeColor": "violet",
        "skinTone": "pale",
        "height": "tall",
        "build": "heavyset",
        "baldness": true,
        "hair": {
          "color": "brown",
          "length": "cropped",
          "style": "straight"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "wide-brim hat",
          "torso": "plate breastplate",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [
          {
            "location": "back",
            "motif": "rose"
          }
        ],
        "marks": []
      },
      "dead": true,
      "inventory": [],
      "quests": [],
      "history": [
        "[Year 550] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_018d72bf",
          "year": 924,
          "description": "[Year 924] Assassinated by a mysterious traveler.",
          "type": "assassination",
          "causedBy": null
        }
      ],
      "memories": {

      }
    },
    {
      "id": "972f89a321e9",
      "name": "Darius Stonecroft",
      "age": 23,
      "role": "Scholar",
      "status": "Alive",
      "appearance": {
        "dead": false,
        "eyeColor": "blue",
        "skinTone": "olive",
        "height": "tall",
        "build": "lean",
        "baldness": false,
        "hair": {
          "color": "red",
          "length": "cropped",
          "style": "curly"
        },
        "facialHair": "stubble",
        "clothing": {
          "head": "none",
          "torso": "silk robe",
          "legs": "linen skirt",
          "feet": "leather shoes",
          "accessory": "leather belt"
        },
        "scars": [],
        "tattoos": [],
        "marks": []
      },
      "dead": false,
      "inventory": [],
      "quests": [
        {
          "type": "Fetch",
          "title": "Find any Tome",
          "description": "My research has stalled. I need any kind of Tome. I don't care who you have to steal it from to get it.",
          "target": "972f89a321e9",
          "itemType": "Tome"
        }
      ],
      "history": [
        "[Year 550] Arrived as a refugee seeking shelter."
      ],
      "memories": {

      }
    },
    {
      "id": "ca40b7e9e592",
      "name": "Brynn Greymantle",
      "age": 18,
      "role": "Merchant",
      "status": "Alive",
      "appearance": {
        "dead": false,
        "eyeColor": "pale grey",
        "skinTone": "ebony",
        "height": "average",
        "build": "stocky",
        "baldness": false,
        "hair": {
          "color": "dark brown",
          "length": "cropped",
          "style": "curly"
        },
        "facialHair": "full beard",
        "clothing": {
          "head": "leather hood",
          "torso": "padded gambeson",
          "legs": "wool breeches",
          "feet": "leather shoes",
          "accessory": "travel cloak"
        },
        "scars": [
          {
            "location": "right cheek",
            "type": "bite"
          }
        ],
        "tattoos": [],
        "marks": []
      },
      "dead": false,
      "inventory": [
        {
          "id": "6dbaf0f43ad8",
          "name": "The Astral Chronicle",
          "type": "Tome",
          "description": "An ancient, dust-covered text bound in strange, cold leather.",
          "content": "The pages detail a recipe for immortal soup. Scrawled frantically in the margins is a handwritten note: \"Do not trust the guards.\"",
          "creationYear": 550,
          "originSettlement": "world_X0_Y2",
          "historicalSignificance": [],
          "baseValue": 538,
          "value": 538
        }
      ],
      "quests": [],
      "history": [
        "[Year 550] Arrived as a refugee seeking shelter.",
        {
          "id": "ev_6a866fe5",
          "year": 550,
          "description": "[Year 550] Discovered The Astral Chronicle in the wilderness.",
          "type": "artifact_discovery",
          "causedBy": null
        }
      ],
      "memories": {

      }
    }
  ],
  "tileDescription": {
    "size": "small",
    "atmosphere": "peaceful",
    "walls": "timber palisade",
    "streets": "muddy cobblestone",
    "surroundings": "pine thicket",
    "landmark": "dried-up well",
    "buildings": [
      {
        "type": "hideout",
        "condition": "weathered"
      },
      {
        "type": "trading post",
        "condition": "weathered"
      },
      {
        "type": "cottage row",
        "condition": "weathered"
      },
      {
        "type": "library",
        "condition": "weathered"
      },
      {
        "type": "town hall",
        "condition": "weathered"
      },
      {
        "type": "hidden shrine",
        "condition": "weathered"
      },
      {
        "type": "guard tower",
        "condition": "weathered"
      },
      {
        "type": "schoolhouse",
        "condition": "weathered"
      },
      {
        "type": "makeshift shelter",
        "condition": "weathered"
      },
      {
        "type": "market square",
        "condition": "weathered"
      }
    ]
  }
}
```