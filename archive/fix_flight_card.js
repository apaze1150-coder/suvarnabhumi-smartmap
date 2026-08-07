const fs = require('fs');
const cheerio = require('cheerio');

try {
    const indexPath = 'index.html';
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // 1. Fix the Right Section of the Flight Card
    // Look for the "Boarding" and "Gate D4" area
    const rightDiv = $('h4:contains("Boarding")').closest('.text-right');
    
    if (rightDiv.length > 0) {
        // Replace with new layout
        rightDiv.html(`
            <div id="flight-status-badge" class="flex items-center gap-2 justify-end mb-1">
                <span class="w-1.5 h-1.5 bg-[#d8aa3d] rounded-full animate-pulse"></span>
                <h4 id="flight-route-display" class="text-[#d8aa3d] text-xs md:text-sm font-bold uppercase tracking-widest italic">Boarding</h4>
            </div>
            <div class="flex items-baseline justify-end gap-1.5 mt-2">
                <p class="text-white/80 text-sm md:text-base font-semibold uppercase tracking-widest">Gate</p>
                <p id="flight-gate-display" class="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">D4</p>
            </div>
        `);
    }

    // 2. Fix the Navigate Section
    const navBtn = $('button:contains("Start")');
    if (navBtn.length > 0) {
        const navContainer = navBtn.closest('.bg-\\[\\#1a3355\\]');
        navContainer.attr('id', 'navigate-gate-btn-container');
        
        const walkText = navContainer.find('p:contains("4 Min Walk from here")');
        if (walkText.length > 0) {
            walkText.attr('id', 'flight-status-text');
        } else {
            // It might be '4-minute walk from here' according to the image text
            const walkText2 = navContainer.find('p').filter((i, el) => $(el).text().toLowerCase().includes('walk'));
            if (walkText2.length > 0) walkText2.attr('id', 'flight-status-text');
        }
        
        // Also fix the button onclick. It should trigger navigation on the map, not reload the page
        navBtn.attr('onclick', "showPage('map-view'); setTimeout(() => { document.getElementById('map-search-input').value = 'GATE ' + document.getElementById('flight-gate-display').innerText; searchMapLive(); }, 100); event.stopPropagation();");
    }

    fs.writeFileSync(indexPath, $.html());
    console.log("Flight card layout and bindings updated successfully.");

} catch (error) {
    console.error("Error during update:", error);
}
