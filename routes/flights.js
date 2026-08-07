const express = require('express');
const router = express.Router();
const { fetchFlightStatus } = require('../services/flightService');

router.get('/api/flight-status', async (req, res) => {
  const { flight_id, custom_gate } = req.query;

  if (!flight_id) {
    return res.status(400).json({ error: 'flight_id query parameter is required.' });
  }

  try {
    const flightData = await fetchFlightStatus(flight_id, custom_gate);
    return res.json(flightData);
  } catch (error) {
    console.error('Flight Status API Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve flight status.', details: error.message });
  }
});

module.exports = router;
