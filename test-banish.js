// test-banish.js
async function testBanishFlow() {
    const startX = 888;
    const startY = 888;

    let playerState = {
        level: 5,
        xp: 0,
        reputation: 50,
        stats: { stealth: 10, strength: 10 },
        inventory: [],
        titles: {} // We will dynamically set this to Mayor
    };

    console.log(`1. 🌍 Fetching original town at X:${startX}, Y:${startY}...`);
    let res = await fetch(`http://localhost:3000/api/chunk/${startX}/${startY}`);
    let chunk = await res.json();
    const townName = chunk.town.name;
    
    // Find the first living citizen to banish
    const target = chunk.population.find(n => n.status === "Alive" && n.role !== "Mayor");
    if (!target) return console.log("No living citizens to banish!");

    console.log(`🏰 Town: ${townName} | Target to banish: ${target.name} (Age: ${target.age})`);

    // Hack: Give ourselves Mayor privileges so the backend approves the action
    playerState.titles[townName] = "Mayor";

    console.log(`\n2. 🛑 Banishing ${target.name}...`);
    res = await fetch('http://localhost:3000/api/action/banish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x: startX, y: startY, target: target.name, playerState
        })
    });
    
    let result = await res.json();
    console.log(`Response: ${result.message}`);

    // Use a Regex to extract the random coordinates from the success message
    const match = result.message.match(/X:(\d+), Y:(\d+)/);
    if (!match) return console.log("❌ Could not parse destination coordinates.");
    
    const destX = match[1];
    const destY = match[2];

    console.log(`\n3. 🔭 Scouting destination town at X:${destX}, Y:${destY}...`);
    res = await fetch(`http://localhost:3000/api/chunk/${destX}/${destY}`);
    let destChunk = await res.json();

    // Find our exile in the new town
    const exile = destChunk.population.find(n => n.name === target.name);
    
    if (exile) {
        console.log(`\n✅ EXILE FOUND in ${destChunk.town.name}!`);
        console.log(`   Name: ${exile.name}`);
        console.log(`   Age: ${exile.age}`);
        console.log(`   Role: ${exile.role} (Should be "Exile")`);
        console.log(`   Memories of Player: ${exile.memories['The Player']} (Should be "hates")`);
        console.log(`   History Events: ${exile.history.length} (Should be 0, no 50-year paradox!)`);
        
        if (exile.history.length > 0) {
             console.log("   History Log:", exile.history);
        } else {
             console.log("   History Log: [] (Clean slate in the new town!)");
        }
    } else {
        console.log("❌ Failed to find the exiled NPC in the destination town.");
    }
}

testBanishFlow();
