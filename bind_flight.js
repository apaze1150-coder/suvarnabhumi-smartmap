const fs = require('fs');
const cheerio = require('cheerio');

try {
    const indexPath = 'index.html';
    const indexHTML = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(indexHTML);

    // 1. Flight Tracker Binding
    // Find the H3 with TG679
    $('h3:contains("TG679")').attr('id', 'flight-number-display');
    
    // Find the Departure Gate "D4"
    $('p.text-3xl:contains("D4")').attr('id', 'flight-gate-display');
    
    // Find "Boarding" text
    $('span:contains("Boarding")').attr('id', 'flight-boarding-display');
    
    // Find "12 MIN" text
    $('p.text-xl:contains("12 MIN")').attr('id', 'flight-status-text');
    
    // Find the badge containing the green dot and "Boarding"
    $('span:contains("Boarding")').parent().attr('id', 'flight-status-badge');

    // Remove the window.location.href='smartmap.html' from the flight card
    const flightCard = $('h3#flight-number-display').closest('.cursor-pointer[onclick="window.location.href=\'smartmap.html\'"]');
    if (flightCard.length) {
        flightCard.attr('onclick', "showPage('map-view'); setTimeout(() => { document.getElementById('map-search-input').value = 'GATE ' + document.getElementById('flight-gate-display').innerText; searchMapLive(); }, 100);");
    }

    // 2. Flight Input Binding
    const flightInput = $('input[placeholder="E.G. TG679"]');
    if (flightInput.length) {
        flightInput.attr('id', 'flight-input');
        flightInput.attr('onkeyup', "if(event.key === 'Enter') { trackFlightLive(null, true); }");
        
        const trackBtn = flightInput.next('button');
        if (trackBtn.length) {
            trackBtn.attr('onclick', "trackFlightLive(null, true);");
        }
    }

    fs.writeFileSync(indexPath, $.html());
    console.log("Flight tracker bindings updated successfully.");

} catch (error) {
    console.error("Error during flight bind:", error);
}
