
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

## improv-6: items from merchants don't have descriptions and tomes (both in the wild and from merchants) should have much richer texts to show when reading them. Also, other items should have richer descriptions so player can inspect all of them.

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
{...}
```