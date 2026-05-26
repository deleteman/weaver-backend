
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

## ~~Improv-3: re-architect the solution to enable for infinite simulation, instead of capping at MAX_FUTURE_YEARS for performance reasons.~~

## Improv-4: Improve overall tests coverage

## Improv-5: npcs should have levels , we need to further define this.

## improv-6: items from merchants don't have descriptions and tomes (both in the wild and from merchants) should have much richer texts to show when reading them. Also, other items should have richer descriptions so player can inspect all of them.

## to-review-1: coods -12, -10 has a huge bloodlines information by the year 486:
Review the following json to understand if the factions created make sense. everybody seems to be dead anyway.

```json
{
    "coordinate": "world_X-12_Y-10",
    "factions": [
        {
            "id": "18f811183967",
            "name": "Marshborn",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 290,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 290
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a100a0a7f9d6",
            "name": "Deepwater",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 300,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 300
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "016ef496d47b",
            "name": "Marshborn",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 310,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 310
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "91b532e582cb",
            "name": "Nighthollow",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 310,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 310
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "4695633ac746",
            "name": "Goldhelm",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 310,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 310
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "dc6f9c84d7d0",
            "name": "Stormrider",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 310,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 310
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "109b6477533a",
            "name": "Deepwater",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 310,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 310
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6ab4cb2ff7a5",
            "name": "Ashveil",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 310,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 310
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c8c6c2a95091",
            "name": "Highkeep",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 320,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 320
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "4f7cdeedc8c9",
            "name": "Deepforge",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 320,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 320
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "207a8d94468e",
            "name": "Stormwall",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 320,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 320
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "486d40b270ca",
            "name": "Ironforge",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 320,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 320
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "e34f496bdbb1",
            "name": "Winterborne",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 320,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 320
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "40b120e25274",
            "name": "Thornback",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 320,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 320
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "f3720697d711",
            "name": "Stonebreaker",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 330,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 330
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "ea6de48810fe",
            "name": "Grimsword",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 330,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 330
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9c2afb4c7e43",
            "name": "Ironforge",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 330,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 330
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "316c0b27e317",
            "name": "Stonebreaker",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 330,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 330
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "bf44fbf16f8d",
            "name": "Greymantle",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 330,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 330
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "085d88898fb2",
            "name": "Redmane",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 330,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 330
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "5a141d508b60",
            "name": "Thornback",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 340,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 340
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d50095beb86c",
            "name": "Willowmere",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 340,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 340
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "5243bff76b26",
            "name": "Ashbrook",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 340,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 340
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "886f65c7d9b5",
            "name": "Hawkwood",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 340,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 340
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "aac650af841b",
            "name": "Frostholm",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 340,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 340
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "79e4434a9c24",
            "name": "Ashveil",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 340,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 340
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "888a301a50db",
            "name": "Silverbrook",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 350,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 350
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "cca459673d42",
            "name": "Deepwater",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 350,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 350
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "38f6d558dd1c",
            "name": "Ashbrook",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 350,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 350
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "45de9fb36544",
            "name": "Redclaw",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 350,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 350
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "268d9e6185e4",
            "name": "Redclaw",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 350,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 350
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "63f5f5d1226a",
            "name": "Redmane",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 350,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 350
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "355847876932",
            "name": "Crowfield",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "279e4c808f6b",
            "name": "Grimsword",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9055171b8289",
            "name": "Swiftblade",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "e3bc73b3b103",
            "name": "Wolfmane",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "f2ab6ea9eb34",
            "name": "Stonehelm",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "472aae7c4e38",
            "name": "Stormwall",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "f87fba0bfcb9",
            "name": "Coldwater",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "26e26d4d8258",
            "name": "Oakmere",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 360,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 360
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "1ab9eea3cb82",
            "name": "Lightbringer",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "fae1347b8bd1",
            "name": "Shadowcloak",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "de49ed93f0a0",
            "name": "Ironwall",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "744e893d18e8",
            "name": "Ironfist",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "767c18813ae7",
            "name": "Deepwater",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "4b21aec72081",
            "name": "Stonehelm",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9b44592809a5",
            "name": "Grimsword",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "3f5f8fdcc026",
            "name": "Deepwater",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 370,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 370
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "00af9023d7e5",
            "name": "Oakmere",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "801551e0a78d",
            "name": "Coldmere",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "b20558b8927d",
            "name": "Greymoor",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6224d4d09f82",
            "name": "Stormrider",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d0400cdef728",
            "name": "Swiftfoot",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "f36820317110",
            "name": "Ravenwood",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "edfc50db955a",
            "name": "Swiftstream",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6c8fd357049d",
            "name": "Brightmere",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 380,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 380
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "33737020d8a6",
            "name": "Swiftstream",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d7eb361db9af",
            "name": "Goldmane",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c1a27a004866",
            "name": "Rockhollow",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "2a6efe712956",
            "name": "Coldmere",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "551e14a899e6",
            "name": "Darkhollow",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "34c8f97b26cb",
            "name": "Dawnbringer",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "85d3ee8ab743",
            "name": "Frostholm",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "338aec9e1de7",
            "name": "Stormwall",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 390,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 390
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c7e8ae57f079",
            "name": "Coppergate",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "29df9db045bb",
            "name": "Coppergate",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "dc91b36dd71a",
            "name": "Lightbringer",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "76361ff77694",
            "name": "Thorngate",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "4dd3cf19ab59",
            "name": "Dawnbringer",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "5936211be2a0",
            "name": "Swiftfoot",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9e9c50bc5aa9",
            "name": "Ironmantle",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "732793d341ba",
            "name": "Stoneheart",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 400,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 400
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a9bbd3a8645a",
            "name": "Stormrider",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "62cf9844100e",
            "name": "Redclaw",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "47d4e684211f",
            "name": "Stonecroft",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d975747bc9d3",
            "name": "Grimshaw",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "be27a0ab8358",
            "name": "Ashfall",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "8d3297bf9104",
            "name": "Silverbrook",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "46b3d2887cd3",
            "name": "Wolfmane",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "365e22db1687",
            "name": "Swiftstream",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 410,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 410
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "3b9db1170506",
            "name": "Highwatch",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a6d214827ab1",
            "name": "Embervane",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "91452496f177",
            "name": "Blackmere",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a2a637158425",
            "name": "Blackwood",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "7f4c5a7470c7",
            "name": "Swiftstream",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "71046b5ff01e",
            "name": "Darkwater",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "bef4cfbc69f0",
            "name": "Stonehelm",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "5809efe50c5e",
            "name": "Oakheart",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 420,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 420
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a06c977158d8",
            "name": "Stoneheart",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "270d865fd4b6",
            "name": "Crowfield",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "2f8c45c74554",
            "name": "Hawkwood",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "4b8f045ca2ab",
            "name": "Brightwater",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6e297249754a",
            "name": "Shadowcloak",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c11947916230",
            "name": "Crowfield",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "3289797a0b0b",
            "name": "Coppergate",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6c2513b72107",
            "name": "Dawnbringer",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 430,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 430
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "ff63fc269c5c",
            "name": "Oakshield",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "04f33b220b1c",
            "name": "Winterborne",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "f0bd87789333",
            "name": "Ashfall",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c6d8f854cedd",
            "name": "Redmane",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "5f6a1e368314",
            "name": "Highwatch",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "fa4cf432a1ea",
            "name": "Winterborne",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "96dfe449b451",
            "name": "Willowmere",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a32b7adc3e04",
            "name": "Blackwood",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 440,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 440
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6857a473ff55",
            "name": "Crowfield",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "2874c517aa2e",
            "name": "Ashfall",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "98baa1b9f546",
            "name": "Greymoor",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "08c87dae6856",
            "name": "Ironfist",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9df245ff603e",
            "name": "Silverbrook",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "99d8c52a3c87",
            "name": "Frostmane",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c3d80efad68a",
            "name": "Highwatch",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "84f287262b90",
            "name": "Highwatch",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 450,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 450
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "3803dd29723a",
            "name": "Starfall",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "0fecf7af98cf",
            "name": "Ironforge",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "0ca9187a8030",
            "name": "Stonewall",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "26eef826dd83",
            "name": "Willowmere",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "2abc89183b99",
            "name": "Darkwater",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "f6cded0dea09",
            "name": "Shadowcloak",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6a45c3714de0",
            "name": "Winterborne",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "72af4431fd61",
            "name": "Stonehelm",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 460,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 460
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9e02b710b016",
            "name": "Swiftfoot",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "87dfb80c2dd7",
            "name": "Embervane",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "d285897d464b",
            "name": "Ironspire",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "4f51f61bf4c4",
            "name": "Ironwall",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "f2da16c71a90",
            "name": "Oakshield",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "43476ab10f42",
            "name": "Greymantle",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "4ca0f17373d0",
            "name": "Greymantle",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "fac6be56741f",
            "name": "Frostmane",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 470,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 470
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "33753023cc7e",
            "name": "Frostmane",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "ba9c16cf521d",
            "name": "Blackwood",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "33e506332b62",
            "name": "Ashbrook",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "1784961fe572",
            "name": "Ironspire",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "e61962c2a6fb",
            "name": "Coppergate",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "1d3e10e41fa1",
            "name": "Stonewall",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a9f3aa131504",
            "name": "Thornback",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "a61bb7997d8d",
            "name": "Oakshield",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 480,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 480
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "86b6ef8af9ec",
            "name": "Cindermere",
            "type": "ancestral_ally",
            "targetLineage": "b64785b88f2e",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "e91de839892e",
            "name": "Highwatch",
            "type": "blood_feud",
            "targetLineage": "b4a94cbaac99",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "b992e892e26b",
            "name": "Oakmere",
            "type": "blood_feud",
            "targetLineage": "c70ca86e25a2",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "6e590a0dcd70",
            "name": "Wolfmane",
            "type": "ancestral_reverence",
            "targetLineage": "aec5fb8227e8",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "0a9a1cd9cbd9",
            "name": "Wolfmane",
            "type": "blood_feud",
            "targetLineage": "f05791d44952",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9ba04059c922",
            "name": "Deepforge",
            "type": "ancestral_reverence",
            "targetLineage": "ab071a1dcf87",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "9d2f3abeaa0f",
            "name": "Brightwater",
            "type": "blood_feud",
            "targetLineage": "d99cae63830e",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        },
        {
            "id": "2d048b48865e",
            "name": "Marshvale",
            "type": "ancestral_ally",
            "targetLineage": "5819e5354a6f",
            "foundedYear": 490,
            "rootAncestor": {
                "npcId": "0b2770c2230f",
                "npcName": "Bofur Brightwater",
                "year": 490
            },
            "members": [
                {
                    "npcId": "f6c6273f6545",
                    "npcName": "Gwyn Lightbringer",
                    "currentRole": "Scholar",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "e4c946b4883a",
                    "npcName": "Helga Goldmane",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        }
                    ]
                },
                {
                    "npcId": "f3c125e7d325",
                    "npcName": "Zara Frostholm",
                    "currentRole": "Guard",
                    "status": "Dead",
                    "inheritanceChain": [
                        {
                            "npcId": "0b2770c2230f",
                            "npcName": "Bofur Brightwater",
                            "year": null,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f6c6273f6545",
                            "npcName": "Gwyn Lightbringer",
                            "year": 213,
                            "status": "Dead"
                        },
                        {
                            "npcId": "e4c946b4883a",
                            "npcName": "Helga Goldmane",
                            "year": 237,
                            "status": "Dead"
                        },
                        {
                            "npcId": "f3c125e7d325",
                            "npcName": "Zara Frostholm",
                            "year": 259,
                            "status": "Dead"
                        }
                    ]
                }
            ]
        }
    ]
}
```

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

## bug-8: dead npcs's age continues to increase when time passes.
Since age is now calculated, the dead npcs returned from the chunk data have their age still updated. dead npcs should not have their age updated, we might want to capture the year of death to calcuate proper age in the future(after they're dead)