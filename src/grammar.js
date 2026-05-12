// src/grammar.js
const tracery = require('tracery-grammar');

const rules = {
    "townName": ["#prefix##suffix#"],
    "prefix": ["Oak", "Iron", "Stone", "Gloom", "Ash", "River", "Frost", "Deep"],
    "suffix": ["haven", "ford", "keep", "gate", "watch", "fall", "wood", "hollow"],
    
    // NEW: First and Last name generation
    "npcName": ["#firstName# #lastName#"],
    "firstName": [
        "Urist", "Bofur", "Elara", "Lyra", "Sylas", "Grom", "Vanya", "Kael", "Thrain", "Faelan",
        "Orik", "Cora", "Darius", "Elowen",
        "Bjorn", "Sigrid", "Astrid", "Gunnar", "Freyja", "Ragnar", "Helga", "Ulf", "Sven", "Leif",
        "Ingrid", "Ivar", "Ragna", "Erik", "Thorvald", "Sigrun", "Halfdan", "Valdis", "Grimr", "Hilda",
        "Branwen", "Aldric", "Rowena", "Gareth", "Isolde", "Cedric", "Brynn", "Oswin", "Edwyn", "Rhys",
        "Seren", "Gwyn", "Caius", "Maeve", "Brennan", "Carwyn", "Alistair", "Fiona", "Callum", "Declan",
        "Sorcha", "Niamh",
        "Bogdan", "Mirela", "Stanko", "Zorya", "Radovan", "Vesna", "Milica", "Dragan",
        "Azhar", "Tariq", "Layla", "Rashid", "Zara", "Nadir", "Soraya", "Farid",
        "Nerys", "Tavros", "Mira", "Fenwick", "Hadwin", "Selwyn", "Aldwyn", "Corvin",
        "Lysander", "Evander", "Petra", "Sable", "Caspian", "Rowan", "Emric", "Tanwen",
        "Hadrian", "Vex"
    ],
    "lastName": [
        "Ironfist", "Stonebreaker", "Swiftstream", "Blackwood", "Shadowcloak", "Lightbringer",
        "Stormrider", "Ashfall", "Frostbeard", "Oakshield",
        "Ironforge", "Ironwall", "Ironwood", "Ironmantle", "Ironspire",
        "Stoneheart", "Stonewall", "Stonehelm", "Stonecroft",
        "Blackthorn", "Blackmere", "Blackveil",
        "Goldmane", "Goldhelm",
        "Silverbrook", "Silvertongue",
        "Darkhollow", "Darkwater",
        "Frostholm", "Frostmane",
        "Swiftblade", "Swiftfoot",
        "Grimshaw", "Grimsword",
        "Oakheart", "Oakmere",
        "Ashbrook", "Ashveil",
        "Thorngate", "Thornback",
        "Starfall", "Stormwall", "Stormgate",
        "Coldwater", "Coldmere",
        "Deepwater", "Deepforge",
        "Highwatch", "Highkeep",
        "Winterborne", "Wintershield",
        "Marshvale", "Marshborn",
        "Cindermere", "Rockhollow",
        "Wolfmane", "Ravenwood",
        "Willowmere", "Brightwater", "Brightmere",
        "Greymoor", "Greymantle",
        "Coppergate", "Redmane", "Redclaw",
        "Embervane", "Dawnbringer",
        "Nighthollow", "Hawkwood", "Crowfield"
    ],

    "npcDesc": ["A #build# #job# with #feature#."],
    "build": ["stout", "lanky", "muscular", "slender", "hunched", "imposing"],
    "job": ["blacksmith", "guard", "merchant", "thief", "noble", "farmer", "scholar"],
    "feature": ["a scarred face", "a booming voice", "shifty eyes", "a missing finger", "a warm smile", "a nervous twitch"]
};

function generateText(rng, rule) {
    tracery.setRng(rng);
    const grammar = tracery.createGrammar(rules);
    grammar.addModifiers(tracery.baseEngModifiers);
    return grammar.flatten(rule);
}

module.exports = { generateText };

