const path = require('path');
const express = require('express');
const router = express.Router();
const { readCsv, MAP_NODES_CSV, STORE_CSV } = require('../services/dataService');
const { setNavigationGraph } = require('../services/flightService');

let navigationGraph = null;

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
    setNavigationGraph(graph);
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

// --- FEATURE 3: Indoor Navigation & Pathfinding Engine ---
router.get('/api/navigation-path', (req, res) => {
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


// --- PUBLIC FEATURE: Search Map Nodes ---
router.get('/api/search-node', async (req, res) => {
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



module.exports = router;



