const { spawn } = require('child_process');
const path = require('path');

async function runTests() {
  console.log("===========================================================");
  console.log("Starting test environment for Suvarnabhumi Smart Map API...");
  console.log("===========================================================");

  // Spawn the server process
  const serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
    stdio: 'inherit'
  });

  // Give the server 1.5 seconds to start up
  await new Promise(resolve => setTimeout(resolve, 1500));

  const BASE_URL = 'http://localhost:3000';
  let failed = false;

  try {
    // ----------------------------------------------------
    // TEST 1: Flight Status API
    // ----------------------------------------------------
    console.log("\n[TEST 1] Fetching status for flight TG679...");
    const res1 = await fetch(`${BASE_URL}/api/flight-status?flight_id=TG679`);
    if (!res1.ok) throw new Error(`HTTP error! status: ${res1.status}`);
    const data1 = await res1.json();
    
    console.log("Response payload:");
    console.log(JSON.stringify(data1, null, 2));
    
    if (data1.flight_id === 'TG679' && data1.walk_time_mins !== undefined && data1.gate_zone === 'D') {
      console.log("✅ TEST 1 PASSED: Flight status and walking time mapping resolved correctly.");
    } else {
      console.log("❌ TEST 1 FAILED: Invalid response payload.");
      failed = true;
    }

    // ----------------------------------------------------
    // TEST 2: Retail Search (Text Query & Detour Routing)
    // ----------------------------------------------------
    console.log("\n[TEST 2] Posting text search query 'perfume' with destination gate 'E2'...");
    const res2 = await fetch(`${BASE_URL}/api/search-store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'perfume',
        destination_gate: 'E2',
        from_node: 'Node_Passport_Control'
      })
    });
    if (!res2.ok) throw new Error(`HTTP error! status: ${res2.status}`);
    const data2 = await res2.json();

    console.log("Response (top result):");
    console.log(JSON.stringify(data2.results[0], null, 2));

    const panpuri = data2.results.find(r => r.store_id === 'store_panpuri');
    if (panpuri && panpuri.is_on_the_way) {
      console.log("✅ TEST 2 PASSED: 'Pañpuri' matched and identified as 'on-the-way' to Gate E2.");
    } else {
      console.log("❌ TEST 2 FAILED: 'Pañpuri' was not matched or not correctly evaluated as 'on-the-way'.");
      failed = true;
    }

    // ----------------------------------------------------
    // TEST 3: Retail Search (Visual Search Simulation)
    // ----------------------------------------------------
    console.log("\n[TEST 3] Posting visual search image 'starbucks_cup.png' with destination gate 'C1'...");
    
    // Simulate multipart form upload using standard Node FormData
    const formData = new FormData();
    const mockFile = new Blob(['mock binary data'], { type: 'image/png' });
    formData.append('image', mockFile, 'starbucks_cup.png');
    formData.append('destination_gate', 'C1');
    formData.append('from_node', 'Node_Passport_Control');

    const res3 = await fetch(`${BASE_URL}/api/search-store`, {
      method: 'POST',
      body: formData
    });
    if (!res3.ok) throw new Error(`HTTP error! status: ${res3.status}`);
    const data3 = await res3.json();

    console.log("Response (top result):");
    console.log(JSON.stringify(data3.results[0], null, 2));

    if (data3.results[0].store_id === 'store_starbucks') {
      console.log("✅ TEST 3 PASSED: Visual classifier successfully mapped 'starbucks_cup.png' to Starbucks Coffee.");
    } else {
      console.log("❌ TEST 3 FAILED: Image was not correctly classified.");
      failed = true;
    }

    // ----------------------------------------------------
    // TEST 4: Pathfinding Engine (Dijkstra Routing with waypoint)
    // ----------------------------------------------------
    console.log("\n[TEST 4] Calculating navigation path from Passport Control to Gate E2 with store waypoint Pañpuri...");
    const res4 = await fetch(
      `${BASE_URL}/api/navigation-path?from_node=Node_Passport_Control&to_node=Node_Gate_E2&waypoint_node=Node_Store_Panpuri`
    );
    if (!res4.ok) throw new Error(`HTTP error! status: ${res4.status}`);
    const data4 = await res4.json();

    console.log("Response routing summary:");
    console.log({
      from_node: data4.from_node,
      to_node: data4.to_node,
      waypoint_node: data4.waypoint_node,
      total_distance_meters: data4.total_distance_meters,
      walk_time_mins: data4.walk_time_mins,
      path_nodes: data4.path.map(n => n.node_id)
    });

    if (data4.path && data4.path.length > 0 && data4.total_distance_meters > 0) {
      console.log("✅ TEST 4 PASSED: Dijkstra path routing successfully resolved and returned.");
    } else {
      console.log("❌ TEST 4 FAILED: Graph routing calculation failed.");
      failed = true;
    }

  } catch (error) {
    console.error("Test runtime exception:", error);
    failed = true;
  } finally {
    console.log("\nShutting down Express server...");
    serverProcess.kill('SIGINT');

    // Give server process a brief moment to clean up
    await new Promise(resolve => setTimeout(resolve, 500));

    if (failed) {
      console.log("❌ SOME INTEGRATION TESTS FAILED.");
      process.exit(1);
    } else {
      console.log("🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY.");
      process.exit(0);
    }
  }
}

runTests();
