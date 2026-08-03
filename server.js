require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Trust the reverse proxy (Render load balancer) to get real client IPs
app.set('trust proxy', 1);

// ── Security Headers (Helmet) ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow CDN resources (Tailwind, Fonts, etc.)
  crossOriginEmbedderPolicy: false
}));

// ── CORS: Restrict to allowed origins ─────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://suvarnabhumi-smartmap.onrender.com,http://127.0.0.1:3000')
  .split(',')
  .map(o => o.trim());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman) but log them
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS: Origin not allowed'));
  },
  credentials: true
}));

// ── Rate Limiting ──────────────────────────────────────────────────
// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
// Strict limit for auth-sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ── File Upload: restrict to images only ──────────────────────────
const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXT  = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prod-' + uniqueSuffix + ext);
  }
});
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME.includes(file.mimetype) && ALLOWED_EXT.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, gif) are allowed.'), false);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// ── Static Files: serve only uploads directory (NOT root) ─────────
// Specific HTML/CSS/JS files are served via explicit routes below
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Serve specific static asset folders only
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve index.html at /index.html as well
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin.html at /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve store.html at /store
app.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, 'store.html'));
});

// Serve PANPURI Admin Dashboard at /panpuri-admin
app.get('/panpuri-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'panpuri_admin.html'));
});

// Serve store_directory.html
app.get('/store_directory.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'store_directory.html'));
});

// Serve store_selection.html
app.get('/store_selection.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'store_selection.html'));
});

// CSV Database Paths
const WALK_TIME_CSV = path.join(__dirname, 'walk_time_matrix.csv');
const STORE_CSV = path.join(__dirname, 'store_matrix.csv');
const MAP_NODES_CSV = path.join(__dirname, 'airport_map_nodes.csv');
const PRODUCT_MATRIX_CSV = path.join(__dirname, 'product_matrix.csv');

// --- CSV Helper Functions ---
async function readCsv(filePath) {
  let table = null;
  if (filePath.includes('walk_time_matrix')) table = 'walk_time_matrix';
  else if (filePath.includes('store_matrix')) table = 'store_matrix';
  else if (filePath.includes('airport_map_nodes')) table = 'airport_map_nodes';
  else if (filePath.includes('product_matrix')) table = 'product_matrix';
  else if (filePath.includes('panpuri_products')) table = 'panpuri_products';
  else if (filePath.includes('panpuri_orders')) table = 'panpuri_orders';
  else if (filePath.includes('panpuri_stock_logs')) table = 'panpuri_stock_logs';
  else if (filePath.includes('panpuri_spa_reservations')) table = 'panpuri_spa_reservations';
  else if (filePath.includes('flight_matrix')) table = 'flight_matrix';
  
  if (!table) return [];
  try {
    // Order panpuri_products by sort_order to preserve insertion order
    const orderClause = (table === 'panpuri_products') ? ' ORDER BY sort_order ASC NULLS LAST' : '';
    const res = await db.query('SELECT * FROM ' + table + orderClause);
    return res.rows;
  } catch(e) {
    console.error('DB Error reading', table, e);
    return [];
  }
}

// Helper to hash string for mock random selection
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// --- Indoor Navigation Graph & Pathfinding Setup ---
let navigationGraph = null;

// Parse the indoor navigation graph from CSV
async function loadNavigationGraph() {
  try {
    const rawNodes = await readCsv(MAP_NODES_CSV);
    const graph = {};

    // Initialize all nodes
    rawNodes.forEach(n => {
      const nodeId = n.node_id.trim();
      graph[nodeId] = {
        node_id: nodeId,
        name: n.name.trim(),
        x: parseFloat(n.x),
        y: parseFloat(n.y),
        concourse: n.concourse.trim(),
        type: n.type.trim(),
        neighbors: {}
      };
    });

    // Populate connections (undirected edges)
    rawNodes.forEach(n => {
      const nodeId = n.node_id.trim();
      const connStr = n.connections || '';
      if (connStr.trim()) {
        const connections = connStr.split(';');
        connections.forEach(conn => {
          if (conn.includes(':')) {
            const [neighborId, distStr] = conn.split(':');
            const neighbor = neighborId.trim();
            const dist = parseFloat(distStr);
            if (neighbor && !isNaN(dist) && graph[neighbor]) {
              graph[nodeId].neighbors[neighbor] = dist;
              graph[neighbor].neighbors[nodeId] = dist; // Ensure bidirectional
            }
          }
        });
      }
    });

    // Dynamically inject store nodes from store_matrix.csv
    const rawStores = await readCsv(STORE_CSV);
    rawStores.forEach(s => {
      const shopNodeId = s.graph_node_id.trim();
      const parentNodeId = s.parent_node_id.trim();
      const x = parseFloat(s.x);
      const y = parseFloat(s.y);
      
      let dist = 10;
      if (graph[parentNodeId]) {
        const dx = graph[parentNodeId].x - x;
        const dy = graph[parentNodeId].y - y;
        dist = Math.max(5, Math.round(Math.sqrt(dx * dx + dy * dy)));
      }
      
      graph[shopNodeId] = {
        node_id: shopNodeId,
        name: s.shop_name.trim(),
        x: x,
        y: y,
        concourse: graph[parentNodeId] ? graph[parentNodeId].concourse : 'D',
        type: 'store',
        neighbors: {}
      };
      
      if (graph[parentNodeId]) {
        graph[shopNodeId].neighbors[parentNodeId] = dist;
        graph[parentNodeId].neighbors[shopNodeId] = dist;
      }
    });

    navigationGraph = graph;
    console.log(`Loaded indoor navigation graph with ${Object.keys(graph).length} nodes.`);
  } catch (error) {
    console.error('Error loading navigation graph:', error);
  }
}

// Initialize graph
loadNavigationGraph();

// Dijkstra's Shortest Path Algorithm
function dijkstra(startNodeId, endNodeId) {
  if (!navigationGraph) {
    throw new Error('Graph is not loaded yet');
  }
  if (!navigationGraph[startNodeId]) {
    throw new Error(`Start node '${startNodeId}' not found in navigation graph.`);
  }
  if (!navigationGraph[endNodeId]) {
    throw new Error(`End node '${endNodeId}' not found in navigation graph.`);
  }

  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (const nodeId in navigationGraph) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentNodeId = null;
    for (const nodeId of unvisited) {
      if (currentNodeId === null || distances[nodeId] < distances[currentNodeId]) {
        currentNodeId = nodeId;
      }
    }

    if (currentNodeId === null || distances[currentNodeId] === Infinity) {
      break; // All remaining nodes are unreachable
    }

    if (currentNodeId === endNodeId) {
      break; // Reached target
    }

    unvisited.delete(currentNodeId);

    const neighbors = navigationGraph[currentNodeId].neighbors;
    for (const neighborId in neighbors) {
      if (!unvisited.has(neighborId)) continue;
      const weight = neighbors[neighborId];
      const alt = distances[currentNodeId] + weight;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentNodeId;
      }
    }
  }

  if (distances[endNodeId] === Infinity) {
    return null; // No path exists
  }

  // Trace back the shortest path
  const pathNodeIds = [];
  let current = endNodeId;
  while (current !== null) {
    pathNodeIds.unshift(current);
    current = previous[current];
  }

  const pathNodes = pathNodeIds.map(id => ({
    node_id: id,
    name: navigationGraph[id].name,
    x: navigationGraph[id].x,
    y: navigationGraph[id].y,
    concourse: navigationGraph[id].concourse,
    type: navigationGraph[id].type
  }));

  return {
    path: pathNodes,
    distance_meters: distances[endNodeId]
  };
}

// Helper to resolve gate name to its corresponding Node ID in the graph
function resolveGateToNode(gateName) {
  if (!navigationGraph) return null;
  const cleanGate = gateName.toUpperCase().replace(/\s+/g, '');
  
  // 1. Try exact match first
  for (const nodeId in navigationGraph) {
    const node = navigationGraph[nodeId];
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
    if (mappedNodeId && navigationGraph[mappedNodeId]) {
      return mappedNodeId;
    }
  }
  
  // 4. Fallback to check if it fits the Node_Gate_X format
  const fallbackId = `Node_Gate_${cleanGate}`;
  if (navigationGraph[fallbackId]) {
    return fallbackId;
  }
  
  return null;
}

// Helper to extract zone from gate code
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
  return 'D'; // default fallback Concourse D (central)
}

// Map IATA to ICAO for FlightAware
function mapIataToIcao(airline) {
  const mapping = {
    'TG': 'THA', // Thai Airways
    'VZ': 'TVJ', // Thai VietJet Air
    'PG': 'BKP', // Bangkok Airways
    'FD': 'AIQ', // Thai AirAsia
    'XJ': 'TAX', // Thai AirAsia X
    'DD': 'NOK', // Nok Air
    'SL': 'TLM', // Thai Lion Air
    'EK': 'UAE', // Emirates
    'SQ': 'SIA', // Singapore Airlines
    'QR': 'QTR', // Qatar Airways
    'CX': 'CPA', // Cathay Pacific
    'JL': 'JAL', // Japan Airlines
    'NH': 'ANA', // All Nippon Airways
    'KE': 'KAL', // Korean Air
    'CZ': 'CSN', // China Southern
    'MU': 'CES', // China Eastern
    'CA': 'CCA', // Air China
    'BR': 'EVA', // EVA Air
    'CI': 'CAL', // China Airlines
    'GF': 'GFA', // Gulf Air
    'EY': 'ETD', // Etihad Airways
    'TK': 'THY', // Turkish Airlines
    'LH': 'DLH', // Lufthansa
    'LX': 'SWR', // Swiss International Air Lines
    'OS': 'AUA', // Austrian Airlines
    'AF': 'AFR', // Air France
    'KL': 'KLM', // KLM
    'BA': 'BAW', // British Airways
    'QF': 'QFA', // Qantas
    'OZ': 'AAR', // Asiana Airlines
    'MH': 'MAS', // Malaysia Airlines
    'VN': 'HVN', // Vietnam Airlines
    '6E': 'IGO', // IndiGo
    'AI': 'AIC', // Air India
    'TR': 'TGW', // Scoot
    'JQ': 'JST', // Jetstar Airways
    '3K': 'JSA', // Jetstar Asia
    'JX': 'SJX', // Starlux Airlines
    'VJ': 'VJC', // VietJet Air
    'AK': 'AXM', // AirAsia Malaysia
    'QZ': 'AWQ', // AirAsia Indonesia
    'Z2': 'APG', // AirAsia Philippines
    'D7': 'XAX', // AirAsia X
    'WE': 'THD', // Thai Smile
    'WY': 'OAS', // Oman Air
    'KU': 'KAC', // Kuwait Airways
    'RJ': 'RJA', // Royal Jordanian
    'UL': 'ALK', // SriLankan Airlines
    'RA': 'RNA', // Nepal Airlines
    'BS': 'UBG', // US-Bangla Airlines
    'BG': 'BBC', // Biman Bangladesh
    'KB': 'DRK', // Drukair
    'B3': 'BTN', // Bhutan Airlines
    '8M': 'MMA', // Myanmar Airways International
    'UB': 'UBA', // Myanmar National Airlines
    'KR': 'KTC', // Cambodia Airways
    'LQ': 'LMR', // Lanmei Airlines
    'ZA': 'SWM', // Sky Angkor Airlines
    'PR': 'PAL', // Philippine Airlines
    '5J': 'CEB', // Cebu Pacific
    'GA': 'GIA', // Garuda Indonesia
    'ID': 'BTK', // Batik Air
    'OD': 'MXD', // Batik Air Malaysia
    'KC': 'KZR', // Air Astana
    'HY': 'UZB', // Uzbekistan Airways
    'LY': 'ELY', // El Al
    'UU': 'REU', // Air Austral
    'W5': 'IRM', // Mahan Air
    'FZ': 'FDB', // Flydubai
    'SV': 'SVA', // Saudia
    'ET': 'ETH', // Ethiopian Airlines
    'KQ': 'KQA', // Kenya Airways
    'AY': 'FIN', // Finnair
    'SU': 'AFL', // Aeroflot
    'S7': 'SBI', // S7 Airlines
    'ZH': 'CSZ', // Shenzhen Airlines
    'HO': 'DKH', // Juneyao Air
    '9C': 'CQH', // Spring Airlines
    'MF': 'CXA', // XiamenAir
    'HU': 'CHH', // Hainan Airlines
    '3U': 'CSC', // Sichuan Airlines
    'SC': 'CDG', // Shandong Airlines
    'JD': 'CBJ', // Beijing Capital Airlines
    '8L': 'LKE', // Lucky Air
    'NS': 'HBH', // Hebei Airlines
    'KY': 'KNA', // Kunming Airlines
    'QW': 'QDA', // Qingdao Airlines
    'DR': 'RLH', // Ruili Airlines
    'BK': 'OKA', // Okay Airways
    'TW': 'TWB', // T'way Air
    '7C': 'JJA', // Jeju Air
    'LJ': 'JNA', // Jin Air
    'BX': 'ABL', // Air Busan
    'RS': 'ASV', // Air Seoul
    'ZE': 'ESR', // Eastar Jet
    'HB': 'HGB', // Greater Bay Airlines
    'HX': 'CRK', // Hong Kong Airlines
    'UO': 'HKE', // Hong Kong Express
    'NX': 'AMU', // Air Macau
    'AE': 'MDA', // Mandarin Airlines
    'FM': 'CSH'  // Shanghai Airlines
  };
  return mapping[airline] || airline;
}

// Scrape live flight from FlightAware
async function scrapeFlightAwareData(flightId) {
  const cleanId = flightId.toUpperCase().replace(/\s+/g, '');
  const airline = cleanId.match(/^([A-Z]{2,3})/)?.[1] || '';
  const num = cleanId.substring(airline.length);

  const icaoAirline = mapIataToIcao(airline);
  const flightCode = `${icaoAirline}${num}`;

  const url = `https://flightaware.com/live/flight/${flightCode}`;
  console.log(`Scraping FlightAware for ${flightCode} via URL: ${url}`);

  try {
    const res = await axios.get(url, {
      timeout: 4000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = res.data;
    const scriptMatch = html.match(/var\s+trackpollBootstrap\s*=\s*({[\s\S]*?});/);
    if (!scriptMatch) {
      console.log("trackpollBootstrap not found in FlightAware page");
      return null;
    }

    const bootstrap = JSON.parse(scriptMatch[1]);
    const flightKeys = Object.keys(bootstrap.flights);
    if (flightKeys.length === 0) return null;

    const flightData = bootstrap.flights[flightKeys[0]];
    if (!flightData.activityLog || !flightData.activityLog.flights) return null;

    // Filter to flights departing from VTBS (Suvarnabhumi)
    const bkkFlights = flightData.activityLog.flights.filter(f => f.origin && f.origin.icao === 'VTBS');
    if (bkkFlights.length === 0) return null;

    const activeFlight = bkkFlights[0];
    
    // Find the first flight in history that has a gate code (fallback if active is null)
    let gate = null;
    for (const f of bkkFlights) {
      if (f.origin.gate) {
        gate = f.origin.gate;
        break;
      }
    }

    if (!gate) gate = 'TBD';

    // Get departure time
    let depEpoch = activeFlight.gateDepartureTimes.scheduled;
    if (activeFlight.gateDepartureTimes.estimated) {
      depEpoch = activeFlight.gateDepartureTimes.estimated;
    }

    // Format epoch to HH:MM in Asia/Bangkok
    let boardingTime = '20:25';
    if (depEpoch) {
      const date = new Date(depEpoch * 1000);
      const boardingDate = new Date((depEpoch - 40 * 60) * 1000);
      const bh = String(new Date(boardingDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })).getHours()).padStart(2, '0');
      const bm = String(new Date(boardingDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })).getMinutes()).padStart(2, '0');
      boardingTime = `${bh}:${bm}`;
    }

    // Check status
    let status = 'Scheduled';
    if (depEpoch) {
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

    console.log(`Successfully parsed FlightAware gate ${gate} and boarding time ${boardingTime} for ${flightId}`);
    return {
      flight_id: cleanId,
      gate: gate,
      boarding_time: boardingTime,
      status: status
    };

  } catch (err) {
    console.error("FlightAware scraping failed:", err.message);
  }
  return null;
}

// --- FEATURE 1: Dynamic Flight & Walk Time API ---
app.get('/api/flight-status', async (req, res) => {
  const { flight_id, custom_gate } = req.query;

  if (!flight_id) {
    return res.status(400).json({ error: 'flight_id query parameter is required.' });
  }

  
  const cleanFlightId = flight_id.toUpperCase().replace(/\s+/g, '');

  // --- DEMO OVERRIDE ---
  
  if ((cleanFlightId === 'TG679' || cleanFlightId === 'THA679') && !custom_gate) {
      console.log("Applying demo override for TG679 to Gate D4");
      return res.json({
        flight_id: 'TG679',
        gate: 'D4',
        boarding_time: '23:45',
        status: 'On Time',
        gate_node_id: 'Node_Gate_D4',
        walk_time_mins: 4
      });
  }

  if (cleanFlightId === 'EK385' && !custom_gate) {
      console.log("Applying demo override for EK385 to Gate S116");
      const walkTimes = await readCsv(WALK_TIME_CSV);
      const walkInfo = walkTimes.find(w => w.gate_zone === 'SAT-1');
      const walk_time_mins = walkInfo ? parseInt(walkInfo.walk_time_mins, 10) : 15;
      
      return res.json({
        flight_id: 'EK385',
        gate: 'S116',
        boarding_time: '01:45',
        status: 'Scheduled',
        gate_node_id: 'Node_Gate_S116',
        walk_time_mins: walk_time_mins
      });
  }

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


  try {
    let flightData = null;

    // 1. Try to fetch live flight details from FlightAware
    try {
      flightData = await scrapeFlightAwareData(cleanFlightId);
    } catch (scrapeErr) {
      console.log(`FlightAware scrape for flight status failed or timed out: ${scrapeErr.message}. Utilizing local dynamic simulation.`);
    }

    // 2. High-fidelity Dynamic Generator Fallback
    if (!flightData) {
      const airline = cleanFlightId.match(/^([A-Z]{2,3})/)?.[1] || 'TG';
      let gate = 'D4';

      // Generate dynamic status relative to server clock
      const now = new Date();
      const hash = Math.abs(hashString(cleanFlightId));
      const minsFromNow = 25 + (hash % 50); // Deterministic offset
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
      console.log(`Generated dynamic simulated flight data for ${cleanFlightId}: Gate ${gate}`);
    }

    // Override gate if custom gate is provided
    if (custom_gate) {
      flightData.gate = custom_gate.toUpperCase();
    }

    // 3. Map Gate to walk_time_matrix.csv
    const walkTimes = await readCsv(WALK_TIME_CSV);
    const gateZone = getZoneFromGate(flightData.gate);
    const walkInfo = walkTimes.find(w => w.gate_zone.toUpperCase() === gateZone.toUpperCase());

    const walk_time_mins = flightData.gate === 'TBD' ? 0 : (walkInfo ? parseInt(walkInfo.walk_time_mins, 10) : 10);
    const zone_description = flightData.gate === 'TBD' ? 'รอประกาศ (Gate TBD)' : (walkInfo ? walkInfo.description : 'Airport Gate Zone');
    const gateNodeId = flightData.gate === 'TBD' ? null : (resolveGateToNode(flightData.gate) || null);

    return res.json({
      flight_id: flightData.flight_id,
      gate: flightData.gate,
      gate_zone: gateZone,
      gate_node_id: gateNodeId,
      boarding_time: flightData.boarding_time,
      status: flightData.status,
      walk_time_mins: walk_time_mins,
      zone_description: zone_description,
      note: "Walking time estimated from Passport Control center."
    });

  } catch (error) {
    console.error('Flight Status API Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve flight status.', details: error.message });
  }
});

// --- FEATURE 2: AI Retail Search & Waypoint Routing API ---
app.all('/api/search-store', upload.single('image'), async (req, res) => {
  const query = (req.body && req.body.query) || req.query.q || req.query.query;
  const destination_gate = (req.body && req.body.destination_gate) || req.query.destination_gate;
  const from_node = (req.body && req.body.from_node) || req.query.from_node;
  const startNodeId = from_node || 'Node_Intersection_D';

  try {
    const stores = await readCsv(STORE_CSV);
    
    let productMatrix = [];
    if (fs.existsSync(PRODUCT_MATRIX_CSV)) {
      productMatrix = await readCsv(PRODUCT_MATRIX_CSV);
    }

    // Resolve gate if provided
    let gateNodeId = null;
    let directDist = 0;
    if (destination_gate) {
      gateNodeId = resolveGateToNode(destination_gate);
      if (gateNodeId && navigationGraph[gateNodeId]) {
        const directPathResult = dijkstra(startNodeId, gateNodeId);
        if (directPathResult) {
          directDist = directPathResult.distance_meters;
        }
      }
    }

    // AI Query Matching (Text + Visual)
    const scoredStores = [];
    for (const store of stores) {
      let score = 0;
      let matchReason = '';

      let matchedProducts = [];
      if (productMatrix && productMatrix.length > 0) {
        // Link by SHOP_NUMBER instead of STORE_ID
        matchedProducts = productMatrix.filter(p => (p.SHOP_NUMBER && p.SHOP_NUMBER.trim() === store.shop_number?.trim()) || (p.STORE_ID === 'PANPURI' && store.shop_name === 'PANPURI'));
      }

      if (req.file) {
        // Visual search based on file metadata/name
        score = scoreStoreForImage(store, req.file.originalname);
        matchReason = score > 50 ? 'AI Visual Match (High Confidence)' : 'AI Visual Match (Low Confidence)';
      } else if (query) {
        // Semantic text search
        score = scoreStoreForQuery(store, query);
        matchReason = 'AI Keyword Relevance Match';
        
        const qLower = query.toLowerCase();
        let productScore = 0;
        matchedProducts.forEach(p => {
           if ((p.PRODUCT_NAME && p.PRODUCT_NAME.toLowerCase().includes(qLower)) ||
               (p.TARGET_TAGS && p.TARGET_TAGS.toLowerCase().includes(qLower))) {
               productScore += 85;
           }
        });
        if (productScore > 0) {
           score += productScore;
           matchReason = 'AI Keyword Relevance Match (Product Match)';
        }
      } else {
        // Return all with neutral score if nothing provided
        score = 10;
        matchReason = 'Default Listing';
      }

      if (score > 0) {
        const storeNodeId = store.graph_node_id || store.node_id;
        let detourDistance = Infinity;
        let is_on_the_way = false;
        let waypointPath = null;
        let directStorePath = null;

        if (navigationGraph[storeNodeId]) {
          // Calculate direct path to store
          directStorePath = dijkstra(startNodeId, storeNodeId);

          // Calculate detour routing cost if gate is provided
          if (gateNodeId && navigationGraph[gateNodeId]) {
            const path1 = dijkstra(startNodeId, storeNodeId);
            const path2 = dijkstra(storeNodeId, gateNodeId);

            if (path1 && path2) {
              const totalDistWithStore = path1.distance_meters + path2.distance_meters;
              detourDistance = totalDistWithStore - directDist;
              is_on_the_way = detourDistance <= 150;
              
              const combinedPath = [...path1.path];
              path2.path.forEach((n, idx) => {
                if (idx > 0) combinedPath.push(n);
              });
              waypointPath = combinedPath;
            }
          }
        }

        const resolvedConcourse = store.concourse || (navigationGraph[storeNodeId] ? navigationGraph[storeNodeId].concourse : 'D');

        scoredStores.push({
          shop_number: store.shop_number || null,
          shop_name: store.shop_name || store.brand_name,
          brand_name: store.brand_name || store.shop_name, // fallback
          shop_image: store.shop_image || `${store.store_id}.jpg`,
          category: store.category || 'Duty Free',
          brands_available: store.brands_available || store.brand_name,
          store_id: store.store_id || `store_shop_${store.shop_number}`,
          concourse: resolvedConcourse,
          connected_gates: store.connected_gates ? store.connected_gates.split('|') : [resolvedConcourse + '1', resolvedConcourse + '2'],
          node_id: storeNodeId,
          coordinates: { x: parseFloat(store.x), y: parseFloat(store.y) },
          best_sellers: store.best_sellers ? store.best_sellers.split(';') : ['Best Seller 1', 'Best Seller 2'],
          promotions: store.promotions ? store.promotions.split(';') : ['Special Offer'],
          ai_match_score: score,
          ai_match_reason: matchReason,
          products: matchedProducts,
          
          // Direct path coordinates & info
          path: directStorePath ? directStorePath.path : null,
          distance_meters: directStorePath ? directStorePath.distance_meters : 0,
          walk_time_mins: directStorePath ? parseFloat((directStorePath.distance_meters / (1.2 * 60)).toFixed(1)) : 0,

          // Detour logic for backward compatibility
          detour_distance_meters: detourDistance,
          is_on_the_way: is_on_the_way,
          waypoint_path: waypointPath
        });
      }
    }

    // --- Node Search Integration (Gates, Restrooms, etc.) ---
    const allNodes = await readCsv(MAP_NODES_CSV);
    const searchNodes = allNodes.filter(n => n.type !== 'intersection' && n.type !== 'corridor');
    
    for (const node of searchNodes) {
      if (!query && !req.file) continue;
      const qLower = (query || '').toLowerCase().trim();
      const nodeName = (node.name || '').toLowerCase();
      const nodeType = (node.type || '').toLowerCase();
      
      let nodeScore = 0;
      let matchReason = '';

      if (qLower && (nodeName === qLower || nodeType === qLower)) {
        nodeScore = 100;
        matchReason = 'Exact Amenity Match';
      } else if (qLower && (nodeName.includes(qLower) || nodeType.includes(qLower))) {
        nodeScore = 50;
        matchReason = 'Partial Amenity Match';
      } else if (qLower === 'ห้องน้ำ' && nodeType.includes('restroom')) {
        nodeScore = 100;
        matchReason = 'Thai Keyword Match';
      } else if (qLower === 'ห้องสูบบุหรี่' && nodeType.includes('smoking')) {
        nodeScore = 100;
        matchReason = 'Thai Keyword Match';
      } else if (qLower === 'ร้านอาหาร' && nodeType.includes('restaurant')) {
        nodeScore = 100;
        matchReason = 'Thai Keyword Match';
      }

      if (nodeScore > 0) {
        let directNodePath = null;
        if (navigationGraph[node.node_id]) {
           directNodePath = dijkstra(startNodeId, node.node_id);
        }

        scoredStores.push({
          shop_number: node.node_id,
          shop_name: node.name,
          brand_name: node.name,
          shop_image: node.image_url || null, // Image support
          icon: node.icon || null, // Icon support
          category: node.type.charAt(0).toUpperCase() + node.type.slice(1),
          brands_available: 'Amenity / Facility',
          store_id: node.node_id,
          concourse: node.concourse,
          connected_gates: [],
          node_id: node.node_id,
          coordinates: { x: parseFloat(node.x), y: parseFloat(node.y) },
          best_sellers: [],
          promotions: [],
          ai_match_score: nodeScore,
          ai_match_reason: matchReason,
          products: [],
          path: directNodePath ? directNodePath.path : null,
          distance_meters: directNodePath ? directNodePath.distance_meters : 0,
          walk_time_mins: directNodePath ? parseFloat((directNodePath.distance_meters / (1.2 * 60)).toFixed(1)) : 0,
          detour_distance_meters: Infinity,
          is_on_the_way: false,
          waypoint_path: null,
          is_amenity_node: true // Flag for frontend
        });
      }
    }

    // Sort by AI Match Score descending, then by walking distance ascending
    scoredStores.sort((a, b) => {
      if (b.ai_match_score !== a.ai_match_score) {
        return b.ai_match_score - a.ai_match_score;
      }
      return a.distance_meters - b.distance_meters;
    });

    return res.json({
      query: query || (req.file ? `Image: ${req.file.originalname}` : 'None'),
      visual_search: !!req.file,
      destination_gate: destination_gate || null,
      resolved_gate_node: gateNodeId,
      direct_path_meters: directDist,
      results: scoredStores
    });

  } catch (error) {
    console.error('Retail Search API Error:', error);
    return res.status(500).json({ error: 'Search failed.', details: error.message });
  }
});

// Scoring functions for Feature 2 matching
function scoreStoreForQuery(store, query) {
  let q = query.toLowerCase().trim();
  let score = 0;

  // Map common Chinese terms to English equivalents
  if (q.includes('药') || q.includes('药店')) q = 'pharmacy';
  else if (q.includes('纪念品') || q.includes('伴手礼') || q.includes('特产')) q = 'souvenir';
  else if (q.includes('化妆品') || q.includes('护肤品')) q = 'skincare';
  else if (q.includes('香水')) q = 'perfume';
  else if (q.includes('免税')) q = 'duty free';

  const shopName = (store.shop_name || store.brand_name || '').toLowerCase();
  const category = (store.category || '').toLowerCase();
  const brands = (store.brands_available || store.brand_name || '').toLowerCase();
  const aiKeywords = (store.AI_KEYWORDS || '').toLowerCase();
  const heroProducts = (store.TOP_HERO_PRODUCTS || '').toLowerCase();
  const promoTags = (store.PROMOTION_TAGS || '').toLowerCase();
  const shopNumber = (store.shop_number || store.UNIT_ID || '').toLowerCase();

  if (shopName === q || category === q || shopNumber === q) {
    score += 100;
  } else if (shopName.includes(q) || category.includes(q) || shopNumber.includes(q)) {
    score += 50;
  }

  // Brands list is semicolon separated: "Chanel; Dior; Estee Lauder"
  const brandList = brands.split(';').map(b => b.trim().toLowerCase());
  if (brandList.includes(q)) {
    score += 100;
  } else {
    // Check partial match for any brand
    for (const b of brandList) {
      if (b.includes(q)) {
        score += 40;
        break;
      }
    }
  }

  if (aiKeywords.includes(q)) score += 80;
  if (heroProducts.includes(q)) score += 70;
  if (promoTags.includes(q)) score += 60;

  // Special category handling
  if (q === 'perfume') {
    if (category.includes('perfume') || brands.includes('perfume') || shopName.includes('perfume') || brands.includes('panpuri') || brands.includes('chanel')) {
      score += 100;
    }
  }

  return score;
}

function scoreStoreForImage(store, filename) {
  const fn = filename.toLowerCase();
  const shopName = (store.shop_name || store.brand_name || '').toLowerCase();
  const storeId = store.store_id || '';

  // Check matching keywords in filename
  if (fn.includes('coffee') || fn.includes('starbucks') || fn.includes('cup') || fn.includes('mug')) {
    if (shopName.includes('starbucks') || storeId === 'store_starbucks') return 100;
  }
  if (fn.includes('perfume') || fn.includes('fragrance') || fn.includes('bottle') || fn.includes('panpuri') || fn.includes('scent')) {
    if (shopName.includes('panpuri') || storeId === 'store_panpuri') return 95;
    if (shopName.includes('chanel') || storeId === 'store_chanel') return 80;
  }
  if (fn.includes('bag') || fn.includes('shopping') || fn.includes('pick') || fn.includes('gift')) {
    if (shopName.includes('king power') || storeId === 'store_king_power') return 90;
    if (shopName.includes('chanel') || storeId === 'store_chanel') return 60;
  }
  if (fn.includes('medicine') || fn.includes('pill') || fn.includes('balm') || fn.includes('boots') || fn.includes('aspirin')) {
    if (shopName.includes('boots') || storeId === 'store_boots') return 100;
  }
  if (fn.includes('food') || fn.includes('mango') || fn.includes('dish') || fn.includes('padthai')) {
    if (shopName.includes('mango tree') || storeId === 'store_mango_tree') return 100;
  }

  // Consistent hash classification fallback
  const hash = Math.abs(hashString(fn));
  if (storeId) {
    const storeIds = ['store_panpuri', 'store_king_power', 'store_boots', 'store_starbucks', 'store_chanel', 'store_mango_tree'];
    const matchedIdx = hash % storeIds.length;
    if (storeIds[matchedIdx] === storeId) {
      return 75; // high hash match score
    }
  }

  return 10 + (hash % 15);
}

// --- FEATURE 3: Indoor Navigation & Pathfinding Engine ---
app.get('/api/navigation-path', (req, res) => {
  const { from_node, to_node, waypoint_node } = req.query;

  if (!from_node || !to_node) {
    return res.status(400).json({ error: 'from_node and to_node parameters are required.' });
  }

  try {
    // Speed constant: 1.2 meters per second (approx 72 meters per minute)
    const WALKING_SPEED_MPS = 1.2;

    if (!waypoint_node) {
      // Direct Dijkstra path
      const result = dijkstra(from_node, to_node);
      if (!result) {
        return res.status(404).json({ error: `No path could be found between '${from_node}' and '${to_node}'.` });
      }

      const walkTimeMins = parseFloat((result.distance_meters / (WALKING_SPEED_MPS * 60)).toFixed(1));

      return res.json({
        from_node: from_node,
        to_node: to_node,
        has_waypoint: false,
        total_distance_meters: result.distance_meters,
        walk_time_mins: walkTimeMins,
        path: result.path
      });
    } else {
      // Waypoint Routing: Path 1 (From -> Waypoint) and Path 2 (Waypoint -> To)
      const path1 = dijkstra(from_node, waypoint_node);
      if (!path1) {
        return res.status(404).json({ error: `Could not find route from start '${from_node}' to retail waypoint '${waypoint_node}'.` });
      }

      const path2 = dijkstra(waypoint_node, to_node);
      if (!path2) {
        return res.status(404).json({ error: `Could not find route from retail waypoint '${waypoint_node}' to destination '${to_node}'.` });
      }

      // Combine paths and remove duplicate intersection node at the boundary
      const combinedPath = [...path1.path];
      path2.path.forEach((n, idx) => {
        if (idx > 0) combinedPath.push(n);
      });

      const totalDistance = path1.distance_meters + path2.distance_meters;
      const walkTimeMins = parseFloat((totalDistance / (WALKING_SPEED_MPS * 60)).toFixed(1));

      return res.json({
        from_node: from_node,
        to_node: to_node,
        waypoint_node: waypoint_node,
        has_waypoint: true,
        total_distance_meters: totalDistance,
        walk_time_mins: walkTimeMins,
        segment1_distance_meters: path1.distance_meters,
        segment2_distance_meters: path2.distance_meters,
        path: combinedPath
      });
    }
  } catch (error) {
    console.error('Pathfinding Engine Error:', error);
    return res.status(500).json({ error: 'Routing calculation failed.', details: error.message });
  }
});

// --- ADMIN FEATURE: CRUD Operations on store_matrix.csv ---

// Helper function to save stores to csv (synchronously to match existing pattern)
async function saveStoresToCsvSync(stores) {
  try {
    await db.query('TRUNCATE store_matrix');
    for (let row of stores) {
      await db.query('INSERT INTO store_matrix (shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, "AI_KEYWORDS", "TOP_HERO_PRODUCTS", "PROMOTION_TAGS") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [row.shop_number, row.shop_name, row.shop_image, row.category, row.brands_available, row.graph_node_id, Number(row.x)||0, Number(row.y)||0, row.parent_node_id, row.store_id, row.AI_KEYWORDS, row.TOP_HERO_PRODUCTS, row.PROMOTION_TAGS]);
    }
  } catch(e) { console.error('Error saving stores to DB:', e); }
}

// POST /api/admin/upload-image - Upload a shop image
app.post('/api/admin/upload-image', upload.single('image'), (req, res) => {
  const { password } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const relativePath = `/uploads/${req.file.filename}`;
  return res.json({ success: true, filename: req.file.filename, path: relativePath });
});

// GET /api/admin/stores - Read all stores
app.get('/api/admin/stores', async (req, res) => {
  const { password } = req.query;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }
  try {
    const stores = await readCsv(STORE_CSV);
    const parsed = stores.map(s => ({
      ...s,
      shop_number: s.shop_number ? s.shop_number.toString() : ''
    }));
    return res.json(parsed);
  } catch (error) {
    console.error('[Admin] Error reading stores:', error);
    return res.status(500).json({ error: 'Failed to read database.', details: error.message });
  }
});

// POST /api/admin/stores - Create a store
app.post('/api/admin/stores', async (req, res) => {
  const { password, shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    
    let resolvedShopNum = (shop_number || '').trim();
    if (!resolvedShopNum) {
      let nextShopNum = 1;
      if (stores.length > 0) {
        const numbers = stores.map(s => parseInt(s.shop_number.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
        nextShopNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      }
      resolvedShopNum = `DE${nextShopNum}`;
    }

    const newStore = {
      shop_number: resolvedShopNum,
      shop_name: (shop_name || '').trim(),
      shop_image: (shop_image || 'default.jpg').trim(),
      category: (category || 'Duty Free').trim(),
      brands_available: (brands_available || '').trim(),
      graph_node_id: (graph_node_id || `Node_Shop_${resolvedShopNum}`).trim(),
      x: (x !== undefined && x !== '') ? x.toString() : '500',
      y: (y !== undefined && y !== '') ? y.toString() : '250',
      parent_node_id: (parent_node_id || 'Node_Intersection_D').trim(),
      store_id: (store_id || `store_shop_${resolvedShopNum}`).trim()
    };

    stores.push(newStore);
    
    // Save to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Created Shop ${resolvedShopNum}: ${newStore.shop_name}`);

    // Reload navigation graph
    await loadNavigationGraph();

    return res.json({ success: true, store: newStore });
  } catch (error) {
    console.error('[Admin] Error creating store:', error);
    return res.status(500).json({ error: 'Failed to create store.', details: error.message });
  }
});

// PUT /api/admin/stores/:shop_number - Update a store
app.put('/api/admin/stores/:shop_number', async (req, res) => {
  const shopNumStr = req.params.shop_number.trim();
  const { password, shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    const idx = stores.findIndex(s => s.shop_number.toString().trim() === shopNumStr);
    if (idx === -1) {
      return res.status(404).json({ error: `Shop number ${shopNumStr} not found in database.` });
    }

    // Update store details
    if (shop_number !== undefined) stores[idx].shop_number = shop_number.trim();
    if (shop_name !== undefined) stores[idx].shop_name = shop_name.trim();
    if (shop_image !== undefined) stores[idx].shop_image = shop_image.trim();
    if (category !== undefined) stores[idx].category = category.trim();
    if (brands_available !== undefined) stores[idx].brands_available = brands_available.trim();
    if (graph_node_id !== undefined) stores[idx].graph_node_id = graph_node_id.trim();
    if (x !== undefined) stores[idx].x = x.toString();
    if (y !== undefined) stores[idx].y = y.toString();
    if (parent_node_id !== undefined) stores[idx].parent_node_id = parent_node_id.trim();
    if (store_id !== undefined) stores[idx].store_id = store_id.trim();

    // Save to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Updated Shop ${shopNumStr}`);

    // Reload navigation graph
    await loadNavigationGraph();

    return res.json({ success: true, store: stores[idx] });
  } catch (error) {
    console.error('[Admin] Error updating store:', error);
    return res.status(500).json({ error: 'Failed to update store.', details: error.message });
  }
});

// DELETE /api/admin/stores/:shop_number - Delete a store
app.delete('/api/admin/stores/:shop_number', async (req, res) => {
  const shopNumStr = req.params.shop_number.trim();
  const { password } = req.body;
  const checkPassword = password || req.query.password;

  if (checkPassword !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    const idx = stores.findIndex(s => s.shop_number.toString().trim() === shopNumStr);
    if (idx === -1) {
      return res.status(404).json({ error: `Shop number ${shopNumStr} not found in database.` });
    }

    const deletedStore = stores.splice(idx, 1)[0];

    // Save to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Deleted Shop ${shopNumStr}: ${deletedStore.shop_name}`);

    // Reload navigation graph
    await loadNavigationGraph();

    return res.json({ success: true, shop_number: shopNumStr });
  } catch (error) {
    console.error('[Admin] Error deleting store:', error);
    return res.status(500).json({ error: 'Failed to delete store.', details: error.message });
  }
});

// --- PUBLIC FEATURE: Search Map Nodes ---
app.get('/api/search-node', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter (q).' });
  }

  try {
    const nodes = await readCsv(MAP_NODES_CSV);
    const searchQuery = query.trim().toLowerCase();
    
    // Thai keyword mapping
    let mappedType = '';
    if (searchQuery.includes('ห้องน้ำ') || searchQuery.includes('厕所') || searchQuery.includes('洗手间') || searchQuery.includes('卫生间')) mappedType = 'restroom';
    else if (searchQuery.includes('ร้านอาหาร') || searchQuery.includes('餐厅') || searchQuery.includes('饭店') || searchQuery.includes('餐饮')) mappedType = 'restaurant';
    else if (searchQuery.includes('ธนาคาร') || searchQuery.includes('แลกเงิน') || searchQuery.includes('换钱') || searchQuery.includes('银行') || searchQuery.includes('兑换')) mappedType = 'bank';
    else if (searchQuery.includes('สูบบุหรี่') || searchQuery.includes('吸烟室') || searchQuery.includes('抽烟')) mappedType = 'smoking';
    
    // Find matching nodes (case-insensitive search in name or node_id or type)
    const matchedNodes = nodes.filter(node => 
        (node.name && node.name.toLowerCase().includes(searchQuery)) || 
        (node.node_id && node.node_id.toLowerCase().includes(searchQuery)) ||
        (node.type && node.type.toLowerCase().includes(searchQuery)) ||
        (mappedType !== '' && node.type && node.type.toLowerCase() === mappedType)
    );

    if (matchedNodes.length > 0) {
      return res.json({ success: true, nodes: matchedNodes });
    } else {
      return res.status(404).json({ success: false, error: 'Node not found.' });
    }
  } catch (error) {
    console.error('Error in /api/search-node:', error);
    return res.status(500).json({ error: 'Failed to search nodes.' });
  }
});


// --- ADMIN FEATURE: CRUD Operations on airport_map_nodes.csv ---
async function saveNodesToCsvSync(nodes) {
  try {
    await db.query('TRUNCATE airport_map_nodes');
    for (let row of nodes) {
      await db.query('INSERT INTO airport_map_nodes (node_id, name, x, y, concourse, type, connections, icon, image_url, floor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [row.node_id, row.name, Number(row.x)||0, Number(row.y)||0, row.concourse, row.type, row.connections, row.icon, row.image_url, row.floor]);
    }
  } catch(e) { console.error('Error saving nodes to DB:', e); }
}

app.get('/api/admin/nodes', async (req, res) => {
  if (req.query.password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try { return res.json(await readCsv(MAP_NODES_CSV)); }
  catch (error) { return res.status(500).json({ error: 'Failed to read nodes database.' }); }
});

app.post('/api/admin/nodes', async (req, res) => {
  const { password, node_id, name, x, y, concourse, type, connections, icon, image_url, floor } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try {
    const nodes = await readCsv(MAP_NODES_CSV);
    if (nodes.find(n => n.node_id === node_id)) return res.status(400).json({ error: 'node_id already exists.' });
    const newNode = { node_id, name, x, y, concourse, type, connections, icon, image_url, floor };
    nodes.push(newNode);
    await saveNodesToCsvSync(nodes);
    await loadNavigationGraph();
    return res.json({ success: true, node: newNode });
  } catch (error) { return res.status(500).json({ error: 'Failed to create node.' }); }
});

app.put('/api/admin/nodes/:node_id', async (req, res) => {
  const { password, name, x, y, concourse, type, connections, icon, image_url, floor } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try {
    const nodes = await readCsv(MAP_NODES_CSV);
    const idx = nodes.findIndex(n => n.node_id === req.params.node_id);
    if (idx === -1) return res.status(404).json({ error: 'Node not found.' });
    if (name !== undefined) nodes[idx].name = name;
    if (x !== undefined) nodes[idx].x = x;
    if (y !== undefined) nodes[idx].y = y;
    if (concourse !== undefined) nodes[idx].concourse = concourse;
    if (type !== undefined) nodes[idx].type = type;
    if (connections !== undefined) nodes[idx].connections = connections;
    if (icon !== undefined) nodes[idx].icon = icon;
    if (image_url !== undefined) nodes[idx].image_url = image_url;
    if (floor !== undefined) nodes[idx].floor = floor;
    await saveNodesToCsvSync(nodes);
    await loadNavigationGraph();
    return res.json({ success: true, node: nodes[idx] });
  } catch (error) { return res.status(500).json({ error: 'Failed to update node.' }); }
});

app.delete('/api/admin/nodes/:node_id', async (req, res) => {
  const password = req.body.password || req.query.password;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try {
    const nodes = await readCsv(MAP_NODES_CSV);
    const idx = nodes.findIndex(n => n.node_id === req.params.node_id);
    if (idx === -1) return res.status(404).json({ error: 'Node not found.' });
    nodes.splice(idx, 1);
    await saveNodesToCsvSync(nodes);
    await loadNavigationGraph();
    return res.json({ success: true });
  } catch (error) { return res.status(500).json({ error: 'Failed to delete node.' }); }
});


// --- ADMIN FEATURE: Update Coordinates ---
app.post('/api/admin/update-coordinates', async (req, res) => {
  const { password, shop_number, x, y } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  const shopNum = (shop_number || '').toString().trim();
  const coordX = parseInt(x);
  const coordY = parseInt(y);

  if (!shopNum || isNaN(coordX) || isNaN(coordY)) {
    return res.status(400).json({ error: 'Invalid input parameters.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    const storeIdx = stores.findIndex(s => s.shop_number.toString().trim() === shopNum);
    if (storeIdx === -1) {
      return res.status(404).json({ error: `Shop number ${shopNum} not found in database.` });
    }

    // Update coordinates
    stores[storeIdx].x = coordX.toString();
    stores[storeIdx].y = coordY.toString();

    // Save back to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Updated Shop ${shopNum} coordinates to (${coordX}, ${coordY})`);

    // Reload navigation graph so Dijkstra path is updated instantly
    await loadNavigationGraph();

    return res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Error saving coordinates:', error);
    return res.status(500).json({ error: 'Failed to write data.', details: error.message });
  }
});



// --- ADMIN: Dashboard Stats (Dynamic) ---
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) {}
    
    let products = [];
    try { products = await readCsv(PRODUCTS_CSV); } catch(e) {}
    
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
        try { logs = await readCsv(STOCK_LOGS_CSV); } catch(e) {}
    }

    // 1. Sales & Order Comparison (TE3, TE1, TW4)
    const stores = ['te3', 'te1', 'tw4'];
    const salesByStore = { te3: 0, te1: 0, tw4: 0 };
    const ordersByStore = { te3: 0, te1: 0, tw4: 0 };
    
    orders.forEach(o => {
        const sid = (o.store_id || '').toLowerCase();
        if (stores.includes(sid)) {
            ordersByStore[sid]++;
            salesByStore[sid] += parseFloat(o.total_price || 0);
        }
    });

    // 2. Cross-Store Low Stock Alerts
    let lowStockAlerts = [];
    products.forEach(p => {
        let q1 = parseInt(p.Qty_Branch1) || 0;
        let q2 = parseInt(p.Qty_Branch2) || 0;
        let q3 = parseInt(p.Qty_Branch3) || 0;
        
        let branches = [];
        if(q1 < 5) branches.push('TE3');
        if(q2 < 5) branches.push('TE1');
        if(q3 < 5) branches.push('TW4');
        
        if (branches.length > 0) {
            lowStockAlerts.push({
                code: p.Code,
                name: p.Description,
                branches: branches,
                total: q1 + q2 + q3
            });
        }
    });
    // Sort by lowest total stock
    lowStockAlerts.sort((a,b) => a.total - b.total);
    lowStockAlerts = lowStockAlerts.slice(0, 10); // top 10 worst

    // 3. Top 5 Best Sellers (from Orders)
    const productSales = {};
    orders.forEach(o => {
        let items = [];
        try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json || '[]') : (o.items_json || []); } catch(e) {}
        items.forEach(item => {
            if(!productSales[item.product_code]) {
                productSales[item.product_code] = { code: item.product_code, name: item.name, qty: 0 };
            }
            productSales[item.product_code].qty += parseInt(item.qty || 0);
        });
    });
    
    let topSellers = Object.values(productSales).sort((a,b) => b.qty - a.qty).slice(0, 5);

    // 4. Stock Logs Stats
    const totalTransactions = logs.length;
    const recentReceipts = logs.filter(l => (l.transaction_type || '').toLowerCase().includes('receipt')).length;

    res.json({
        success: true,
        salesComparison: {
            stores: ['TE3 Flagship', 'TE1 EmQuartier', 'TW4 Boutique'],
            sales: [salesByStore.te3, salesByStore.te1, salesByStore.tw4],
            orders: [ordersByStore.te3, ordersByStore.te1, ordersByStore.tw4]
        },
        lowStockAlerts,
        topSellers,
        stockLogStats: {
            totalTransactions,
            recentReceipts
        }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// PANPURI PRE-ORDER SYSTEM
// ============================================================

const PRODUCTS_CSV = path.join(__dirname, 'panpuri_products.csv');
const ORDERS_CSV = path.join(__dirname, 'panpuri_orders.csv');
const STORE_SETTINGS_FILE = path.join(__dirname, 'store_settings.json');

// ── Passwords from Environment Variables ──────────────────────────
const ADMIN_PASSWORD     = process.env.ADMIN_PASSWORD     || '6515';
const STORE_CREDENTIALS = {
  'TE3': process.env.STORE_PASSWORD_TE3 || '6570',
  'TE1': process.env.STORE_PASSWORD_TE1 || '6515',
  'TW4': process.env.STORE_PASSWORD_TW4 || '6555'
};

// Store info for display
const STORE_INFO = {
  'TE3': { name: 'PANPURI Concourse D East (Gate 1-4)', location: 'Concourse D East, Level 4', zone: 'TE3' },
  'TE1': { name: 'PANPURI Concourse D East (Gate 1-2)', location: 'Concourse D East, Level 4', zone: 'TE1' },
  'TW4': { name: 'PANPURI Concourse D West (Gate 5-8)', location: 'Concourse D West, Level 4', zone: 'TW4' }
};

// --- CSV write helper for orders & products ---
async function writeCsvGeneric(filePath, rows, headers) {
  let table = null;
  if (filePath.includes('walk_time_matrix')) table = 'walk_time_matrix';
  else if (filePath.includes('store_matrix')) table = 'store_matrix';
  else if (filePath.includes('airport_map_nodes')) table = 'airport_map_nodes';
  else if (filePath.includes('product_matrix')) table = 'product_matrix';
  else if (filePath.includes('panpuri_products')) table = 'panpuri_products';
  else if (filePath.includes('panpuri_orders')) table = 'panpuri_orders';
  else if (filePath.includes('panpuri_stock_logs')) table = 'panpuri_stock_logs';
  else if (filePath.includes('panpuri_spa_reservations')) table = 'panpuri_spa_reservations';
  else if (filePath.includes('flight_matrix')) table = 'flight_matrix';
  
  if (!table) return;
  
  // Dedup logic based on primary key for products to prevent transaction aborts
  let dedupedRows = rows;
  if (table === 'panpuri_products' && rows && rows.length > 0) {
      const seen = new Set();
      dedupedRows = [];
      for (let r of rows) {
          if (!seen.has(r.Code)) {
              seen.add(r.Code);
              dedupedRows.push(r);
          } else {
              console.warn('[Admin] Skipping duplicate product Code:', r.Code);
          }
      }
  }
  
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE ' + table);
    if (!dedupedRows || dedupedRows.length === 0) {
      await client.query('COMMIT');
      return;
    }
    const cols = headers.map(h => '"' + h + '"').join(', ');
    for (let i = 0; i < dedupedRows.length; i++) {
      const row = dedupedRows[i];
      let vals = headers.map(h => {
        if (h === 'items_json' && typeof row[h] === 'string') return row[h];
        if (h === 'items_json' && typeof row[h] === 'object') return JSON.stringify(row[h]);
        return row[h];
      });
      let placeholders = headers.map((_, j) => '$' + (j+1)).join(', ');
      // For panpuri_products, also set sort_order to preserve position
      if (table === 'panpuri_products') {
        await client.query(
          'INSERT INTO ' + table + ' (' + cols + ', sort_order) VALUES (' + placeholders + ', $' + (headers.length + 1) + ')',
          [...vals, i + 1]
        );
      } else {
        await client.query('INSERT INTO ' + table + ' (' + cols + ') VALUES (' + placeholders + ')', vals);
      }
    }
    await client.query('COMMIT');
  } catch(e) { 
    await client.query('ROLLBACK');
    console.error('Error writing to table (Transaction Rolled Back) ' + table, e); 
  } finally {
    client.release();
  }
}

const PRODUCT_HEADERS = ['Code','Description','Reference','Category','Sub-Category','Scent','Price','Image','Qty_Branch1','Qty_Branch2','Qty_Branch3','Description_Customer','Scent_Notes','How_to_Use','Size'];
const ORDER_HEADERS = ['order_id','order_number','store_id','customer_name','flight_number','items_json','total_price','status','created_at','updated_at','staff_note'];

function getStoreSettings() {
  if (!fs.existsSync(STORE_SETTINGS_FILE)) {
    const defaults = { TE3: { accepting_orders: true }, TE1: { accepting_orders: true }, TW4: { accepting_orders: true } };
    fs.writeFileSync(STORE_SETTINGS_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try {
    return JSON.parse(fs.readFileSync(STORE_SETTINGS_FILE, 'utf8'));
  } catch(e) {
    return { TE3: { accepting_orders: true }, TE1: { accepting_orders: true }, TW4: { accepting_orders: true } };
  }
}

function saveStoreSettings(settings) {
  fs.writeFileSync(STORE_SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// --- Serve store.html staff portal ---
app.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, 'store.html'));
});

// GET /api/products - public, get all active products
app.get('/api/products', async (req, res) => {
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const filtered = products.filter(p => p.is_active !== 'false');
    const mappedProducts = filtered.map(p => ({
        ...p,
        product_id: p.Code || p.product_id, // fallback
        product_code: p.Code,
        product_name: p.Description,
        name: p.Description,
        description: p.Description,
        category: p.Category,
        sub_category: p['Sub-Category'],
        scent: p.Scent,
        price: p.Price,
        te3: p.Qty_Branch1,
        te1: p.Qty_Branch2,
        tw4: p.Qty_Branch3,
        qty_te3: p.Qty_Branch1,
        qty_te1: p.Qty_Branch2,
        qty_tw4: p.Qty_Branch3,
        image: p.Image,
        size: p.Size,
        Size: p.Size,
        description_customer: p.Description_Customer,
        Description_Customer: p.Description_Customer,
        scent_notes: p.Scent_Notes,
        Scent_Notes: p.Scent_Notes,
        how_to_use: p.How_to_Use,
        How_to_Use: p.How_to_Use,
        Scent: p.Scent,
        is_active: p.is_active !== 'false'
    }));
    res.json({ success: true, products: mappedProducts });
  } catch (err) {
    res.json({ success: false, error: err.message, products: [] });
  }
});

// GET /api/store/settings - public, check if stores are accepting orders
app.get('/api/store/settings', (req, res) => {
  const settings = getStoreSettings();
  res.json({ success: true, settings, stores: STORE_INFO });
});

// POST /api/store/settings - staff only, toggle accepting_orders
app.post('/api/store/settings', (req, res) => {
  const { store_id, password, accepting_orders } = req.body;
  const isGlobalAdmin = password === '6515';
  
  if (!isGlobalAdmin && (!STORE_CREDENTIALS[store_id] || STORE_CREDENTIALS[store_id] !== password)) {
    return res.status(403).json({ success: false, error: 'Invalid credentials' });
  }
  const settings = getStoreSettings();
  if (!settings[store_id]) settings[store_id] = {};
  settings[store_id].accepting_orders = accepting_orders;
  saveStoreSettings(settings);
  console.log(`[Store ${store_id}] accepting_orders set to ${accepting_orders} by ${isGlobalAdmin ? 'Admin' : 'Store Staff'}`);
  res.json({ success: true, settings });
});

// POST /api/orders - customer creates new order
app.post('/api/orders', async (req, res) => {
  try {
    const { store_id, customer_name, flight_number, items } = req.body;

    if (!store_id || !customer_name || !flight_number || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Missing required fields: store_id, customer_name, flight_number, items' });
    }

    // Check if store is accepting orders
    const settings = getStoreSettings();
    if (settings[store_id] && settings[store_id].accepting_orders === false) {
      return res.json({ success: false, error: 'ขณะนี้ร้านค้านี้ปิดรับ Order ชั่วคราว กรุณาลองใหม่ภายหลัง' });
    }

    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { orders = []; }

    const orderId = `ORD-${Date.now()}`;
    const orderNumber = `KP-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);

    const newOrder = {
      order_id: orderId,
      order_number: orderNumber,
      store_id: store_id,
      customer_name: customer_name.trim(),
      flight_number: flight_number.trim().toUpperCase(),
      items_json: JSON.stringify(items),
      total_price: total.toFixed(2),
      status: 'pending',
      created_at: now,
      updated_at: now,
      staff_note: ''
    };

    orders.push(newOrder);
    await writeCsvGeneric(ORDERS_CSV, orders, ORDER_HEADERS);
    console.log(`[Order] New order ${orderNumber} from ${customer_name} (${flight_number}) at store ${store_id}`);

    res.json({ success: true, order_number: orderNumber, order_id: orderId, total: total.toFixed(2) });
  } catch (err) {
    console.error('[Order] Error creating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/track/:order_number - customer track order
app.get('/api/orders/track/:order_number', async (req, res) => {
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { orders = []; }
    const order = orders.find(o => o.order_number === req.params.order_number);
    if (!order) return res.json({ success: false, error: 'ไม่พบหมายเลข Order นี้' });
    let itemsParsed = [];
    try { itemsParsed = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : (order.items_json || []); } catch(e) {}
    res.json({ success: true, order: { ...order, items: itemsParsed } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders/customer-cancel/:order_number - customer cancels their own order
app.post('/api/orders/customer-cancel/:order_number', async (req, res) => {
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { return res.json({ success: false, error: 'No orders found' }); }
    
    const idx = orders.findIndex(o => o.order_number === req.params.order_number);
    if (idx === -1) return res.json({ success: false, error: 'ไม่พบหมายเลข Order นี้' });
    
    if (orders[idx].status !== 'pending') {
      return res.json({ success: false, error: 'ไม่สามารถยกเลิกได้ (รับเรื่องหรือเตรียมของแล้ว)' });
    }
    
    orders[idx].status = 'cancelled';
    orders[idx].updated_at = new Date().toISOString();
    await writeCsvGeneric(ORDERS_CSV, orders, ORDER_HEADERS);
    
    console.log(`[Order] ${orders[idx].order_number} status → cancelled (by customer)`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders - staff/admin get all orders for their store
app.get('/api/orders', async (req, res) => {
  try {
    const { store_id, password } = req.query;
    let authorized = false;
    if (password === ADMIN_PASSWORD) authorized = true;
    if (store_id && STORE_CREDENTIALS[store_id] && STORE_CREDENTIALS[store_id] === password) authorized = true;
    if (!authorized) return res.status(403).json({ success: false, error: 'Unauthorized' });

    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { orders = []; }

    // Staff only sees their store's orders; admin sees all (unless they specify a store)
    const filtered = store_id
      ? orders.filter(o => o.store_id === store_id)
      : orders;

    // Parse items and reverse (newest first)
    const result = filtered.map(o => {
      let items = [];
      try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json) : (o.items_json || []); } catch(e) {}
      return { ...o, items };
    }).reverse();

    // Calculate total sales for all stores for Store Comparison
    const storeSales = {};
    orders.forEach(o => {
        if (o.status === 'cancelled') return;
        const sid = o.store_id;
        if (!storeSales[sid]) storeSales[sid] = 0;
        storeSales[sid] += parseFloat(o.total_price || 0);
    });

    res.json({ success: true, orders: result, storeSales: storeSales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/orders/:order_id - staff updates order status
app.put('/api/orders/:order_id', async (req, res) => {
  try {
    const { store_id, password, status, staff_note } = req.body;
    let authorized = false;
    if (password === ADMIN_PASSWORD) authorized = true;
    if (store_id && STORE_CREDENTIALS[store_id] && STORE_CREDENTIALS[store_id] === password) authorized = true;
    if (!authorized) return res.status(403).json({ success: false, error: 'Unauthorized' });

    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { return res.json({ success: false, error: 'No orders found' }); }

    const idx = orders.findIndex(o => o.order_id === req.params.order_id);
    if (idx === -1) return res.json({ success: false, error: 'Order not found' });

    const validStatuses = ['pending','confirmed','preparing','ready','cancelled','out_of_stock'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    orders[idx].status = status;
    orders[idx].updated_at = new Date().toISOString();
    if (staff_note !== undefined) orders[idx].staff_note = staff_note.toString().trim();

    await writeCsvGeneric(ORDERS_CSV, orders, ORDER_HEADERS);
    console.log(`[Order] ${orders[idx].order_number} status → ${status}`);

    let itemsParsed = [];
    try { itemsParsed = typeof orders[idx].items_json === 'string' ? JSON.parse(orders[idx].items_json) : (orders[idx].items_json || []); } catch(e) {}
    res.json({ success: true, order: { ...orders[idx], items: itemsParsed } });
  } catch (err) {
    console.error('[Order] Error updating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN: PANPURI Products CRUD ---

app.get('/api/admin/products', async (req, res) => {
  const { password } = req.query;
  const storePws = ['6570', '6515', '6555'];
  if (password !== ADMIN_PASSWORD && !storePws.includes(password)) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const mappedProducts = products.map(p => ({
        ...p, // keep original keys like Code, Description, Qty_Branch1
        product_id: p.Code || p.product_id,
        product_code: p.Code,
        product_name: p.Description,
        name: p.Description,
        description: p.Description,
        category: p.Category,
        sub_category: p['Sub-Category'],
        scent: p.Reference,
        price: p.Price,
        te3: p.Qty_Branch1,
        te1: p.Qty_Branch2,
        tw4: p.Qty_Branch3,
        qty_te3: p.Qty_Branch1,
        qty_te1: p.Qty_Branch2,
        qty_tw4: p.Qty_Branch3,
        image: p.Image,
        size: p.Size,
        Size: p.Size,
        // Fix: map Description_Customer, Scent_Notes, How_to_Use so frontend can read them
        description_customer: p.Description_Customer || '',
        Description_Customer: p.Description_Customer || '',
        scent_notes: p.Scent_Notes || '',
        Scent_Notes: p.Scent_Notes || '',
        how_to_use: p.How_to_Use || '',
        How_to_Use: p.How_to_Use || '',
        is_active: p.is_active !== 'false'
    }));
    res.json(mappedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products
app.post('/api/admin/products', async (req, res) => {
  const { password, Code, Description, Reference, Category, 'Sub-Category': SubCategory, Scent, Price, Qty_Branch1, Qty_Branch2, Qty_Branch3, Image, Size, Description_Customer, Scent_Notes, How_to_Use } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    let products = [];
    try { products = await readCsv(PRODUCTS_CSV); } catch(e) {}
    const newProduct = {
      Code: (Code || '').trim(),
      Description: (Description || '').trim(),
      Reference: (Reference || '').trim(),
      Category: (Category || '').trim(),
      'Sub-Category': (SubCategory || '').trim(),
      Price: (Price || '0').toString(),
      Image: (Image || '').trim(),
      Qty_Branch1: (Qty_Branch1 || '0').toString(),
      Qty_Branch2: (Qty_Branch2 || '0').toString(),
      Qty_Branch3: (Qty_Branch3 || '0').toString(),
      Size: (Size || '').trim(),
      Description_Customer: (Description_Customer || '').trim(),
      Scent_Notes: (Scent_Notes || '').trim(),
      How_to_Use: (How_to_Use || '').trim(),
      Scent: (Scent || '').trim()
    };
    products.push(newProduct);
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    console.log(`[Admin] Created product ${newProduct.Code}`);
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

let productsLock = false;
async function withProductsLock(fn) {
    while (productsLock) {
        await new Promise(r => setTimeout(r, 50));
    }
    productsLock = true;
    try {
        return await fn();
    } finally {
        productsLock = false;
    }
}

app.post('/api/admin/products/batch-update', async (req, res) => {
  const { password, updates, insertAfterCode } = req.body;
  // Fix: require password always - reject if missing or wrong
  if (!password || password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  if (!updates || typeof updates !== 'object') return res.status(400).json({ error: 'Invalid updates payload' });

  try {
    let updatedCount = 0;
    await withProductsLock(async () => {
      let products = [];
      try { products = await readCsv(PRODUCTS_CSV); } catch(e) {}
    
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }
    
    let updatedCount = 0;
    
    // First, process updates to existing records
    for (const code of Object.keys(updates)) {
      const changes = updates[code];
      let idx = -1;
      
      if (changes._originalIndex !== undefined) {
        idx = parseInt(changes._originalIndex);
      } else {
        idx = products.findIndex(p => p.Code === code);
      }
      
      console.log(`Updating code=${code}, idx=${idx}, products[idx].Code=${products[idx] ? products[idx].Code : 'undef'}`);
      
      if (idx !== -1 && idx < products.length) {
        // Log stock changes
        const storesMap = { Qty_Branch1: 'te3', Qty_Branch2: 'te1', Qty_Branch3: 'tw4' };
        for (const [qtyField, frontendField] of Object.entries(storesMap)) {
          const changedVal = changes[qtyField] !== undefined ? changes[qtyField] : changes[frontendField];
          
          if (changedVal !== undefined) {
            const oldQty = parseInt(products[idx][qtyField] || 0);
            const newQty = parseInt(changedVal);
            if (!isNaN(newQty) && oldQty !== newQty) {
              const diff = newQty - oldQty;
              logs.push({
                log_id: 'TXN-' + Date.now() + Math.floor(Math.random()*1000),
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                performed_by: 'Global Admin',
                transaction_type: diff > 0 ? 'GOODS RECEIPT' : (diff < 0 && Math.abs(diff) > 10 ? 'STOCK TRANSFER OUT' : 'Adjustment'),
                ref_no: `ADJ-${Math.floor(Math.random()*10000)}`,
                product_code: products[idx].Code,
                product_name: products[idx].Description,
                qty: diff.toString()
              });
            }
            products[idx][qtyField] = newQty.toString();
          }
        }

        // Update existing product
        if (changes.Description !== undefined) products[idx].Description = changes.Description.trim();
        if (changes.product_name !== undefined) products[idx].Description = changes.product_name.trim();
        if (changes.name !== undefined) products[idx].Description = changes.name.trim();
        
        if (changes.Reference !== undefined) products[idx].Reference = changes.Reference.trim();
        if (changes.Scent !== undefined) products[idx].Scent = changes.Scent.trim();
        
        if (changes.Category !== undefined) products[idx].Category = changes.Category.trim();
        if (changes.category !== undefined) products[idx].Category = changes.category.trim();
        if (changes['Sub-Category'] !== undefined) products[idx]['Sub-Category'] = changes['Sub-Category'].trim();
        if (changes.sub_category !== undefined) products[idx]['Sub-Category'] = changes.sub_category.trim();
        if (changes.Size !== undefined) products[idx].Size = changes.Size.trim();
        if (changes.size !== undefined) products[idx].Size = changes.size.trim();
        if (changes.Price !== undefined) products[idx].Price = changes.Price.toString();
        if (changes.price !== undefined) products[idx].Price = changes.price.toString();
        
        if (changes.Image !== undefined) products[idx].Image = changes.Image.trim();
        if (changes.image !== undefined) products[idx].Image = changes.image.trim();
        if (changes.Description_Customer !== undefined) products[idx].Description_Customer = changes.Description_Customer.trim();
        if (changes.Scent_Notes !== undefined) products[idx].Scent_Notes = changes.Scent_Notes.trim();
        if (changes.How_to_Use !== undefined) products[idx].How_to_Use = changes.How_to_Use.trim();
        if (changes.Code !== undefined && changes.Code.trim() !== '') products[idx].Code = changes.Code.trim(); // Handle Code change itself if applicable
        updatedCount++;
      } else {
        // Handle inserts if product doesn't exist (bulk import often mixes updates/inserts)
        const newProduct = {
          Code: (changes.Code || code).trim(),
          Description: (changes.Description || changes.product_name || changes.name || '').trim(),
          Reference: (changes.Reference || '').trim(),
          Category: (changes.Category || changes.category || '').trim(),
          'Sub-Category': (changes['Sub-Category'] || changes.sub_category || '').trim(),
          Scent: (changes.Scent || changes.scent || '').trim(),
          Price: (changes.Price || changes.price || '0').toString(),
          Image: (changes.Image || changes.image || '').trim(),
          Qty_Branch1: (changes.Qty_Branch1 || changes.te3 || '0').toString(),
          Qty_Branch2: (changes.Qty_Branch2 || changes.te1 || '0').toString(),
          Qty_Branch3: (changes.Qty_Branch3 || changes.tw4 || '0').toString(),
          Size: (changes.Size || changes.size || '').trim(),
          Description_Customer: (changes.Description_Customer || '').trim(),
          Scent_Notes: (changes.Scent_Notes || '').trim(),
          How_to_Use: (changes.How_to_Use || '').trim()
        };
        
        if (insertAfterCode) {
            const afterIdx = products.findIndex(p => p.Code === insertAfterCode);
            if (afterIdx !== -1) {
                products.splice(afterIdx + 1, 0, newProduct);
            } else {
                products.push(newProduct);
            }
        } else {
            products.push(newProduct);
        }
        updatedCount++;
      }
    }
    
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    await writeCsvGeneric(STOCK_LOGS_CSV, logs, STOCK_LOG_HEADERS);
    }); // end withProductsLock
    console.log(`[Admin] Batch updated ${updatedCount} products`);
    res.json({ success: true, updatedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products/reorder
app.post('/api/admin/products/reorder', async (req, res) => {
  const { password, orderedCodes } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  if (!orderedCodes || !Array.isArray(orderedCodes)) return res.status(400).json({ error: 'Invalid payload' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const newProducts = [];
    const prodMap = new Map();
    products.forEach(p => prodMap.set(p.Code, p));
    
    // Add in specified order
    orderedCodes.forEach(code => {
      if (prodMap.has(code)) {
        newProducts.push(prodMap.get(code));
        prodMap.delete(code);
      }
    });
    // Add any remaining products that weren't in the ordered list
    prodMap.forEach(p => newProducts.push(p));
    
    await writeCsvGeneric(PRODUCTS_CSV, newProducts, PRODUCT_HEADERS);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/admin/products/:Code', async (req, res) => {
  const { password, Description, Reference, Category, 'Sub-Category': SubCategory, Scent, Price, Qty_Branch1, Qty_Branch2, Qty_Branch3, Image, Size, Description_Customer, Scent_Notes, How_to_Use } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const idx = products.findIndex(p => p.Code === req.params.Code);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    if (Description !== undefined) products[idx].Description = Description.trim();
    if (Reference !== undefined) products[idx].Reference = Reference.trim();
    if (Category !== undefined) products[idx].Category = Category.trim();
    if (SubCategory !== undefined) products[idx]['Sub-Category'] = SubCategory.trim();
    if (Scent !== undefined) products[idx].Scent = Scent.trim();
    if (Price !== undefined) products[idx].Price = Price.toString();
    if (Qty_Branch1 !== undefined) products[idx].Qty_Branch1 = Qty_Branch1.toString();
    if (Qty_Branch2 !== undefined) products[idx].Qty_Branch2 = Qty_Branch2.toString();
    if (Qty_Branch3 !== undefined) products[idx].Qty_Branch3 = Qty_Branch3.toString();
    if (Image !== undefined) products[idx].Image = Image.trim();
    if (Size !== undefined) products[idx].Size = Size.trim();
    if (Description_Customer !== undefined) products[idx].Description_Customer = Description_Customer.trim();
    if (Scent_Notes !== undefined) products[idx].Scent_Notes = Scent_Notes.trim();
    if (How_to_Use !== undefined) products[idx].How_to_Use = How_to_Use.trim();
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    res.json({ success: true, product: products[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/products/:product_id
app.delete('/api/admin/products/:Code', async (req, res) => {
  const password = req.body?.password || req.query?.password;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const idx = products.findIndex(p => String(p.Code).trim() === String(req.params.Code).trim());
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    products.splice(idx, 1);
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products/upload-image - Upload product image
app.post('/api/admin/products/upload-image', upload.single('image'), (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(403).json({ success: false, error: 'Invalid password' });
  }
  
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image provided' });
  }

  // Construct URL path
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});


// --- ADMIN FEATURE: CRUD Operations on product_matrix.csv ---

function saveProductMatrixToCsvSync(products) {
  const headers = 'PRODUCT_ID,SHOP_NUMBER,PRODUCT_NAME,PRODUCT_IMAGE_FILENAME,PRICE_THB,TARGET_TAGS,IS_TOP_SELLER\n';
  const rows = products.map(p => {
    const escape = (val) => {
      if (val === undefined || val === null) return '""';
      let str = val.toString().replace(/"/g, '""');
      return `"${str}"`;
    };
    return `${escape(p.PRODUCT_ID)},${escape(p.SHOP_NUMBER)},${escape(p.PRODUCT_NAME)},${escape(p.PRODUCT_IMAGE_FILENAME)},${escape(p.PRICE_THB)},${escape(p.TARGET_TAGS)},${escape(p.IS_TOP_SELLER)}`;
  }).join('\n');
  fs.writeFileSync(PRODUCT_MATRIX_CSV, headers + rows, 'utf8');
}

// GET /api/admin/product_matrix
app.get('/api/admin/product_matrix', async (req, res) => {
  const { password } = req.query;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    let products = [];
    if (fs.existsSync(PRODUCT_MATRIX_CSV)) {
      products = await readCsv(PRODUCT_MATRIX_CSV);
    }
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to read database.' });
  }
});

// POST /api/admin/product_matrix
app.post('/api/admin/product_matrix', async (req, res) => {
  const { password, PRODUCT_ID, SHOP_NUMBER, PRODUCT_NAME, PRODUCT_IMAGE_FILENAME, PRICE_THB, TARGET_TAGS, IS_TOP_SELLER } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    let products = [];
    if (fs.existsSync(PRODUCT_MATRIX_CSV)) {
      products = await readCsv(PRODUCT_MATRIX_CSV);
    }
    let resolvedId = (PRODUCT_ID || '').trim();
    if (!resolvedId) {
      resolvedId = 'PROD_' + Date.now();
    }
    const newProd = {
      PRODUCT_ID: resolvedId,
      SHOP_NUMBER: (SHOP_NUMBER || '').trim(),
      PRODUCT_NAME: (PRODUCT_NAME || '').trim(),
      PRODUCT_IMAGE_FILENAME: (PRODUCT_IMAGE_FILENAME || '').trim(),
      PRICE_THB: (PRICE_THB || '').trim(),
      TARGET_TAGS: (TARGET_TAGS || '').trim(),
      IS_TOP_SELLER: (IS_TOP_SELLER || 'false').trim()
    };
    products.push(newProd);
    saveProductMatrixToCsvSync(products);
    return res.json({ success: true, product: newProd });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save database.' });
  }
});

// PUT /api/admin/product_matrix/:id
app.put('/api/admin/product_matrix/:id', async (req, res) => {
  const { password, SHOP_NUMBER, PRODUCT_NAME, PRODUCT_IMAGE_FILENAME, PRICE_THB, TARGET_TAGS, IS_TOP_SELLER } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    if (!fs.existsSync(PRODUCT_MATRIX_CSV)) return res.status(404).json({ error: 'No products found.' });
    let products = await readCsv(PRODUCT_MATRIX_CSV);
    const idx = products.findIndex(p => p.PRODUCT_ID === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found.' });
    
    products[idx].SHOP_NUMBER = SHOP_NUMBER !== undefined ? String(SHOP_NUMBER).trim() : products[idx].SHOP_NUMBER;
    products[idx].PRODUCT_NAME = PRODUCT_NAME !== undefined ? String(PRODUCT_NAME).trim() : products[idx].PRODUCT_NAME;
    products[idx].PRODUCT_IMAGE_FILENAME = PRODUCT_IMAGE_FILENAME !== undefined ? String(PRODUCT_IMAGE_FILENAME).trim() : products[idx].PRODUCT_IMAGE_FILENAME;
    products[idx].PRICE_THB = PRICE_THB !== undefined ? String(PRICE_THB).trim() : products[idx].PRICE_THB;
    products[idx].TARGET_TAGS = TARGET_TAGS !== undefined ? String(TARGET_TAGS).trim() : products[idx].TARGET_TAGS;
    products[idx].IS_TOP_SELLER = IS_TOP_SELLER !== undefined ? String(IS_TOP_SELLER).trim() : products[idx].IS_TOP_SELLER;
    
    saveProductMatrixToCsvSync(products);
    return res.json({ success: true, product: products[idx] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update database.' });
  }
});

// DELETE /api/admin/product_matrix/:id
app.delete('/api/admin/product_matrix/:id', async (req, res) => {
  const password = req.body?.password || req.query?.password;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    if (!fs.existsSync(PRODUCT_MATRIX_CSV)) return res.status(404).json({ error: 'No products found.' });
    let products = await readCsv(PRODUCT_MATRIX_CSV);
    const newProducts = products.filter(p => p.PRODUCT_ID !== req.params.id);
    if (newProducts.length === products.length) return res.status(404).json({ error: 'Product not found.' });
    
    saveProductMatrixToCsvSync(newProducts);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// --- ADMIN: View all orders ---
app.get('/api/admin/orders', async (req, res) => {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) {}
    const result = orders.map(o => {
      let items = [];
      try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json) : (o.items_json || []); } catch(e) {}
      return { ...o, items };
    }).reverse();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PANPURI ADMIN APIS
// ============================================================

const STOCK_LOGS_CSV = path.join(__dirname, 'panpuri_stock_logs.csv');
const STOCK_LOG_HEADERS = ['log_id','timestamp','performed_by','transaction_type','ref_no','product_code','product_name','qty'];

// Duplicate /api/admin/products route removed

app.get('/api/admin/stock-logs', async (req, res) => {
  try {
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }
    logs.reverse();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Removed duplicate batch-update route

// ============================================================
// PANPURI STAFF APIS
// ============================================================

app.post('/api/staff/stock-transaction', async (req, res) => {
  try {
    const { items, type, branch, ref_no } = req.body;
    if (!items || items.length === 0 || !type || !branch) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let products = await readCsv(PRODUCTS_CSV);
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }

    const branchKey = branch.toLowerCase();
    let qtyField = 'Qty_Branch1';
    if (branchKey === 'te1') qtyField = 'Qty_Branch2';
    if (branchKey === 'tw4') qtyField = 'Qty_Branch3';

    const multiplier = type === 'receipt' ? 1 : -1;
    const transTypeStr = type === 'receipt' ? 'GOODS RECEIPT' : 'STOCK TRANSFER OUT';
    const fallbackRef = `${type === 'receipt' ? 'RCV' : 'TRF'}-${Math.floor(Math.random()*10000)}`;

    for (const item of items) {
      const productIndex = products.findIndex(p => p.Code === item.product_code);
      if (productIndex !== -1) {
        const prod = products[productIndex];
        const oldQty = parseInt(prod[qtyField] || 0);
        const diff = parseInt(item.qty) * multiplier;
        const newQty = oldQty + diff;
        
        prod[qtyField] = newQty.toString();
        
        logs.push({
          log_id: 'TXN-' + Date.now() + Math.floor(Math.random()*1000),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          performed_by: 'Staff User',
          transaction_type: transTypeStr,
          ref_no: ref_no || `${branch.toUpperCase()}-${fallbackRef}`,
          product_code: prod.Code,
          product_name: prod.Description,
          qty: diff.toString()
        });
      }
    }

    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    await writeCsvGeneric(STOCK_LOGS_CSV, logs, STOCK_LOG_HEADERS);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/staff/stock-logs', async (req, res) => {
  try {
    const { branch } = req.query;
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }
    logs.reverse();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GLOBAL API 404 HANDLER
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found: ' + req.method + ' ' + req.originalUrl });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error', type: err.type });
  } else {
    next(err);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
