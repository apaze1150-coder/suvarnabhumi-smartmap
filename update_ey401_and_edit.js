const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

try {
    // 1. Update index.html to add edit button
    const indexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    const gateContainer = $('#flight-gate-display').parent();
    if (gateContainer.length > 0 && gateContainer.find('button').length === 0) {
        gateContainer.addClass('group relative cursor-pointer');
        // Actually, let's just make clicking the gate container trigger editGateManual
        gateContainer.attr('onclick', 'editGateManual(); event.stopPropagation();');
        gateContainer.attr('title', 'Click to edit Gate');
        
        gateContainer.append(`
            <button class="text-white/40 group-hover:text-white transition-colors p-1 active:scale-95 duration-150">
                <span class="material-symbols-outlined text-sm md:text-base">edit</span>
            </button>
        `);
        fs.writeFileSync(indexPath, $.html());
        console.log("Updated index.html to add edit button");
    }

    // 2. Update server.js to mock EY401 -> C6
    const serverPath = path.join(__dirname, 'server.js');
    let serverCode = fs.readFileSync(serverPath, 'utf8');

    // Add mock logic for EY401
    const targetPattern = /const cleanFlightId = flight_id\.toUpperCase\(\)\.replace\(\/\\s\+\/g, ''\);/;
    if (targetPattern.test(serverCode) && !serverCode.includes("cleanFlightId === 'EY401'")) {
        const insertion = `
  const cleanFlightId = flight_id.toUpperCase().replace(/\\s+/g, '');

  // --- DEMO OVERRIDE ---
  if (cleanFlightId === 'EY401' && !custom_gate) {
      console.log("Applying demo override for EY401 to Gate C6");
      const walkTimes = await readCsv(WALK_TIME_CSV);
      const walkInfo = walkTimes.find(w => w.gate_zone === 'C');
      const walk_time_mins = walkInfo ? parseInt(walkInfo.walk_time_mins, 10) : 7;
      
      return res.json({
        flight_id: 'EY401',
        gate: 'C6',
        boarding_time: '02:30',
        status: 'Scheduled',
        gate_node_id: 'Node_Gate_C6',
        walk_time_mins: walk_time_mins
      });
  }
  // ---------------------
`;
        serverCode = serverCode.replace(targetPattern, insertion);
        fs.writeFileSync(serverPath, serverCode);
        console.log("Updated server.js to mock EY401");
    }

} catch (error) {
    console.error("Error updating files:", error);
}
