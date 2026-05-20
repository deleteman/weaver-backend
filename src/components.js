// src/components.js
function Identity(name, type, id) {
    return { name, type, id };
}

function Location(x, y, parentId = null) {
    return { x, y, parentId };
}

function History() {
    return { events: [] };
}

function Knowledge() {
    return { memories: {} }; 
}

function Inventory() {
    return { items: [] }; 
}

function Quests() {
    return { offeredQuests: [] };
}

function Status(state = 'Alive') {
    return { state };
}

function Political(tier = 1, demographics = {}) {
    return { tier, demographics, stance: 'Balanced' };
}

function Diplomacy() {
    return { allies: [], colonies: [], suzerain: null };
}

function Memory() {
    return { memories: [], ancestralMemories: [] };
}

module.exports = { Identity, Location, History, Knowledge, Inventory, Quests, Status, Political, Diplomacy, Memory };