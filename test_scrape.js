const axios = require('axios');

function mapIataToIcao(airline) {
  const mapping = {
    'VZ': 'TVJ',
    'TG': 'THA',
    'PG': 'BKP',
    'EK': 'UAE',
    'SQ': 'SIA',
    'QR': 'QTR',
    'FD': 'AIQ',
    'AK': 'AXM',
    'WE': 'THD'
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
  console.log(`Scraping URL: ${url}`);

  try {
    const res = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = res.data;
    const scriptMatch = html.match(/var\s+trackpollBootstrap\s*=\s*({[\s\S]*?});/);
    if (!scriptMatch) {
      console.log("trackpollBootstrap not found in FlightAware page");
      // Let's print a small chunk of HTML to see what's there
      console.log("HTML length:", html.length);
      console.log("HTML snippet:", html.substring(0, 1000));
      return null;
    }

    const bootstrap = JSON.parse(scriptMatch[1]);
    const flightKeys = Object.keys(bootstrap.flights);
    if (flightKeys.length === 0) {
      console.log("No flights in bootstrap");
      return null;
    }

    const flightData = bootstrap.flights[flightKeys[0]];
    if (!flightData.activityLog || !flightData.activityLog.flights) {
      console.log("No activityLog or flights");
      return null;
    }

    const bkkFlights = flightData.activityLog.flights.filter(f => f.origin && f.origin.icao === 'VTBS');
    console.log("BKK flights found:", bkkFlights.length);
    if (bkkFlights.length === 0) {
      console.log("All flights:", flightData.activityLog.flights.map(f => `${f.origin?.icao} -> ${f.destination?.icao}`));
      return null;
    }

    const activeFlight = bkkFlights[0];
    let gate = null;
    for (const f of bkkFlights) {
      if (f.origin.gate) {
        gate = f.origin.gate;
        break;
      }
    }
    console.log("Parsed Gate:", gate);
    console.log("Departure times:", activeFlight.gateDepartureTimes);
  } catch (err) {
    console.error("Scraping failed with:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
    }
  }
}

scrapeFlightAwareData("TG679");
