const fs = require('fs');
const path = require('path');

try {
    const serverPath = path.join(__dirname, 'server.js');
    let serverCode = fs.readFileSync(serverPath, 'utf8');

    const targetPattern = /if \(cleanFlightId === 'EY401' && !custom_gate\) \{/;
    if (targetPattern.test(serverCode) && !serverCode.includes("cleanFlightId === 'QR829'")) {
        const insertion = `
  if (cleanFlightId === 'QR829' && !custom_gate) {
      console.log("Applying demo override for QR829 to Gate S111A");
      const walkTimes = await readCsv(WALK_TIME_CSV);
      const walkInfo = walkTimes.find(w => w.gate_zone === 'SAT-1');
      const walk_time_mins = walkInfo ? parseInt(walkInfo.walk_time_mins, 10) : 15;
      
      return res.json({
        flight_id: 'QR829',
        gate: 'S111A',
        boarding_time: '02:20',
        status: 'Scheduled',
        gate_node_id: 'Node_Gate_S101',
        walk_time_mins: walk_time_mins
      });
  }

  if (cleanFlightId === 'EY401' && !custom_gate) {`;
        
        serverCode = serverCode.replace(targetPattern, insertion);
        fs.writeFileSync(serverPath, serverCode);
        console.log("Updated server.js to mock QR829");
    } else {
        console.log("Pattern not found or already mocked.");
    }

} catch (error) {
    console.error("Error updating files:", error);
}
