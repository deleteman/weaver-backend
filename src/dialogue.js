// src/dialogue.js
const tracery = require('tracery-grammar');
const { log } = require('./logger');
const { MEMORY_STATES } = require('./history');

function talkTo(npc, topic, rng) {
    const npcId = npc.identity ? npc.identity.id : undefined;
    log('dialogue:talkTo', { npcId, topic });
    tracery.setRng(rng);

    if (npc.status === "Dead") {
        log('dialogue:talkTo:dead', { npcId });
        return "(No response. They are dead.)";
    }

    let responseTemplate = "";

    if (topic === "yourself") {
        responseTemplate = "#intro#. I get by as a #role#.";
    } else if (npc.knowledge.memories[topic]) {
        const memoryType = npc.knowledge.memories[topic];
        log('dialogue:memory-response', { npcId: npc.identity.id, topic, memoryType });
        
	// Handle the expanded memory types
        if (memoryType === MEMORY_STATES.HATES) {
            responseTemplate = "#anger# I despise #subject#! We have a blood feud.";
        } else if (memoryType === MEMORY_STATES.LIKES) {
            responseTemplate = "#subject#? #friendly# Good person.";
        } else if (memoryType === MEMORY_STATES.LOVES) {
            responseTemplate = "#subject#... #romantic# I would do anything for them.";
        } else if (memoryType === MEMORY_STATES.MOURNS) {
            responseTemplate = "#subject#... #sadness# I miss them every single day.";
        } else if (memoryType === MEMORY_STATES.CHILD) {
            responseTemplate = "#subject# is my blood. #pride#";
        } else if (memoryType === MEMORY_STATES.PARENT) {
            responseTemplate = "Ah, #subject#. They raised me. #respect#";
        }
    } else {
        responseTemplate = "#confusion# #subject#? #idk#.";
    }

    const rules = {
	"sadness": ["*wipes away a tear*", "They were taken from me too soon.", "My heart aches for them."],
        "pride": ["I'm so proud of them.", "They are my legacy.", "I'd protect them with my life."],
        "respect": ["I owe them everything.", "A strict but fair parent.", "They taught me well."],
        "origin": [responseTemplate],
        "intro": ["I'm #name#", "The name is #name#", "They call me #name#"],
        "role": [npc.currentRole || "humble citizen"],
        "name": [npc.identity.name],
        "subject": [topic],
        "anger": ["Don't say that name!", "Ugh.", "*spits*"],
        "friendly": ["Ah, an old friend!", "I'd trust them with my life.", "We go way back."],
        "romantic": ["*sighs wistfully*", "Light of my life.", "My heart belongs to them."],
        "confusion": ["Hmm.", "Who?", "*scratches head*"],
        "idk": ["Never heard of them", "Doesn't ring a bell", "Can't say I know them"]
    };

    const grammar = tracery.createGrammar(rules);
    return grammar.flatten("#origin#");
}

module.exports = { talkTo };
