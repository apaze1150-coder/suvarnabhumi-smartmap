const axios = require('axios');
const path = require('path');
const db = require('../db');
const { readCsv, hashString, WALK_TIME_CSV } = require('./dataService');

// In a real scenario, this would be an injected dependency or fetched from mapService
let mockNavigationGraph = null;
function setNavigationGraph(graph) {
    mockNavigationGraph = graph;
}

function resolveGateToNode(gateName, graph = mockNavigationGraph) {
  if (!graph) return null;
  const cleanGate = gateName.toUpperCase().replace(/\s+/g, '');
  
  // 1. Try exact match first
  for (const nodeId in graph) {
    const node = graph[nodeId];
    if (node.type === 'gate') {
      const nodeGateCode = nodeId.replace('Node_Gate_', '').toUpperCase();
      const nodeNameClean = node.name.toUpperCase().replace(/\s+/g, '');
      if (nodeId.toUpperCase() === cleanGate ||
          nodeGateCode === cleanGate ||
          nodeNameClean === cleanGate ||
          nodeNameClean.includes(cleanGate)) {
        return nodeId;
      }
    }
  }
  
  // 2. Handle Special SAT-1 case
  if (cleanGate.startsWith('SAT') || cleanGate.startsWith('S1')) {
    return 'Node_Gate_S101';
  }
  
  // 3. Fallback based on Concourse letter prefix for gates (A-G)
  const match = cleanGate.match(/^([A-G])/);
  if (match) {
    const concourseLetter = match[1];
    const concourseGateMapping = {
      'A': 'Node_Gate_A1',
      'B': 'Node_Gate_B1',
      'C': 'Node_Gate_C1',
      'D': 'Node_Gate_D4',
      'E': 'Node_Gate_E2',
      'F': 'Node_Gate_F2',
      'G': 'Node_Gate_G2'
    };
    const mappedNodeId = concourseGateMapping[concourseLetter];
    if (mappedNodeId && graph[mappedNodeId]) {
      return mappedNodeId;
    }
  }
  
  // 4. Fallback to check if it fits the Node_Gate_X format
  const fallbackId = `Node_Gate_${cleanGate}`;
  if (graph[fallbackId]) {
    return fallbackId;
  }
  
  return null;
}

function getZoneFromGate(gate) {
  if (!gate) return 'D';
  const upper = gate.toUpperCase().replace(/\s+/g, '');
  if (upper.startsWith('SAT-1') || upper.startsWith('S1')) {
    return 'SAT-1';
  }
  const match = upper.match(/^([A-G])/);
  if (match) {
    return match[1];
  }
  return 'D'; 
}

function mapIataToIcao(airline) {
  const mapping = {
    'TG': 'THA', 'VZ': 'TVJ', 'PG': 'BKP', 'FD': 'AIQ', 'XJ': 'TAX',
    'DD': 'NOK', 'SL': 'TLM', 'EK': 'UAE', 'SQ': 'SIA', 'QR': 'QTR',
    'CX': 'CPA', 'JL': 'JAL', 'NH': 'ANA', 'KE': 'KAL', 'CZ': 'CSN',
    'MU': 'CES', 'CA': 'CCA', 'BR': 'EVA', 'CI': 'CAL', 'GF': 'GFA',
    'EY': 'ETD', 'TK': 'THY', 'LH': 'DLH', 'LX': 'SWR', 'OS': 'AUA',
    'AF': 'AFR', 'KL': 'KLM', 'BA': 'BAW', 'QF': 'QFA', 'OZ': 'AAR'
  };
  return mapping[airline] || airline;
}

async function scrapeFlightAwareData(flightId) {
  const cleanId = flightId.toUpperCase().replace(/\s+/g, '');
  const airline = cleanId.match(/^([A-Z]{2,3})/)?.[1] || '';
  const num = cleanId.substring(airline.length);

  const icaoAirline = mapIataToIcao(airline);
  const flightCode = `${icaoAirline}${num}`;

  const url = `https://flightaware.com/live/flight/${flightCode}`;

  try {
    const res = await axios.get(url, {
      timeout: 4000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = res.data;
    const scriptMatch = html.match(/var\s+trackpollBootstrap\s*=\s*({[\s\S]*?});/);
    if (!scriptMatch) return null;

    const bootstrap = JSON.parse(scriptMatch[1]);
    const flightKeys = Object.keys(bootstrap.flights);
    if (flightKeys.length === 0) return null;

    const flightData = bootstrap.flights[flightKeys[0]];
    if (!flightData.activityLog || !flightData.activityLog.flights) return null;

    const bkkFlights = flightData.activityLog.flights.filter(f => f.origin && f.origin.icao === 'VTBS');
    if (bkkFlights.length === 0) return null;

    const activeFlight = bkkFlights[0];
    
    let gate = null;
    for (const f of bkkFlights) {
      if (f.origin.gate) {
        gate = f.origin.gate;
        break;
      }
    }

    if (!gate) gate = 'TBD';

    let depEpoch = activeFlight.gateDepartureTimes.scheduled;
    if (activeFlight.gateDepartureTimes.estimated) {
      depEpoch = activeFlight.gateDepartureTimes.estimated;
    }

    let boardingTime = '20:25';
    let status = 'Scheduled';

    if (depEpoch) {
      const date = new Date(depEpoch * 1000);
      const boardingDate = new Date((depEpoch - 40 * 60) * 1000);
      const bh = String(new Date(boardingDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })).getHours()).padStart(2, '0');
      const bm = String(new Date(boardingDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })).getMinutes()).padStart(2, '0');
      boardingTime = `${bh}:${bm}`;

      const nowEpoch = Math.floor(Date.now() / 1000);
      const minsDiff = (depEpoch - nowEpoch) / 60;
      if (minsDiff < 0) {
        status = 'Departed';
      } else if (minsDiff <= 15) {
        status = 'Final Call';
      } else if (minsDiff <= 45) {
        status = 'Boarding';
      }
    }

    return {
      flight_id: cleanId,
      gate: gate,
      boarding_time: boardingTime,
      status: status
    };

  } catch (err) {
    throw err;
  }
}

async function fetchFlightStatus(flight_id, custom_gate) {
  if (!flight_id) {
    throw new Error('flight_id is required');
  }

  const cleanFlightId = flight_id.toUpperCase().replace(/\s+/g, '');

  // 1. Check DB Override
  try {
    const res = await db.query('SELECT * FROM flight_override WHERE flight_id = $1 OR flight_id = $2', [cleanFlightId, cleanFlightId.replace('TG', 'THA')]); // simplified for logic
    if (res.rows.length > 0 && !custom_gate) {
      const override = res.rows[0];
      const walkTimes = await readCsv(WALK_TIME_CSV);
      const gateZone = getZoneFromGate(override.gate);
      const walkInfo = walkTimes.find(w => w.gate_zone.toUpperCase() === gateZone.toUpperCase());
      const walk_time_mins = override.gate === 'TBD' ? 0 : (walkInfo ? parseInt(walkInfo.walk_time_mins, 10) : 10);
      
      return {
        flight_id: override.flight_id,
        gate: override.gate,
        boarding_time: override.boarding_time || '00:00',
        status: 'Scheduled',
        gate_node_id: override.gate === 'TBD' ? null : resolveGateToNode(override.gate),
        walk_time_mins: walk_time_mins,
        zone_description: walkInfo ? walkInfo.description : 'Airport Gate Zone',
        gate_zone: gateZone,
        note: "Data overridden by Admin."
      };
    }
  } catch (e) {
    console.error('Failed to read override:', e.message);
  }

  let flightData = null;

  try {
    flightData = await scrapeFlightAwareData(cleanFlightId);
  } catch (scrapeErr) {
    console.log(`FlightAware scrape failed: ${scrapeErr.message}. Utilizing local dynamic simulation.`);
  }

  if (!flightData || flightData.gate === null) {
    const airline = cleanFlightId.match(/^([A-Z]{2,3})/)?.[1] || 'TG';
    const hash = Math.abs(hashString(cleanFlightId));
    
    const possibleGates = ['D4', 'D5', 'D6', 'C1', 'C2', 'C3', 'E1', 'E2', 'F1', 'F2', 'G1', 'S111', 'S112', 'S114', 'S116'];
    let gate = possibleGates[hash % possibleGates.length];

    const now = new Date();
    const minsFromNow = 25 + (hash % 50); 
    const boardingTimeObj = new Date(now.getTime() + minsFromNow * 60 * 1000);
    
    const hh = String(boardingTimeObj.getHours()).padStart(2, '0');
    const mm = String(boardingTimeObj.getMinutes()).padStart(2, '0');

    let status = 'Scheduled';
    if (minsFromNow <= 15) {
      status = 'Final Call';
    } else if (minsFromNow <= 45) {
      status = 'Boarding';
    }

    flightData = {
      flight_id: cleanFlightId,
      gate: gate,
      boarding_time: `${hh}:${mm}`,
      status: status
    };
  }

  if (custom_gate) {
    flightData.gate = custom_gate.toUpperCase();
  }

  const walkTimes = await readCsv(WALK_TIME_CSV);
  const gateZone = getZoneFromGate(flightData.gate);
  const walkInfo = walkTimes.find(w => w.gate_zone.toUpperCase() === gateZone.toUpperCase());

  const walk_time_mins = flightData.gate === 'TBD' ? 0 : (walkInfo ? parseInt(walkInfo.walk_time_mins, 10) : 10);
  const zone_description = flightData.gate === 'TBD' ? 'รอประกาศ (Gate TBD)' : (walkInfo ? walkInfo.description : 'Airport Gate Zone');
  const gateNodeId = flightData.gate === 'TBD' ? null : resolveGateToNode(flightData.gate);

  return {
    flight_id: flightData.flight_id,
    gate: flightData.gate,
    gate_zone: gateZone,
    gate_node_id: gateNodeId,
    boarding_time: flightData.boarding_time,
    status: flightData.status,
    walk_time_mins: walk_time_mins,
    zone_description: zone_description,
    note: "Walking time estimated from Passport Control center."
  };
}

module.exports = {
  fetchFlightStatus,
  scrapeFlightAwareData,
  resolveGateToNode,
  getZoneFromGate,
  mapIataToIcao,
  setNavigationGraph
};
