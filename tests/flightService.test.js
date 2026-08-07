const { fetchFlightStatus } = require('../services/flightService');
const axios = require('axios');
const db = require('../db');
const dataService = require('../services/dataService');

// Mock dependencies
jest.mock('axios');
jest.mock('../db');
jest.mock('../services/dataService');

describe('flightService - fetchFlightStatus', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Default mock implementation for dataService
        dataService.hashString.mockImplementation(str => 12345);
        dataService.readCsv.mockResolvedValue([
            { gate_zone: 'D', walk_time_mins: '4', description: 'Concourse D Center Zone' },
            { gate_zone: 'S1', walk_time_mins: '15', description: 'SAT-1' }
        ]);
        dataService.WALK_TIME_CSV = 'mock_walk_time.csv';
    });

    test('Case 1: DB Override exists (Success)', async () => {
        // Mock DB to return an override
        db.query.mockResolvedValueOnce({
            rows: [{ flight_id: 'TG679', gate: 'D4', boarding_time: '23:45' }]
        });

        const result = await fetchFlightStatus('TG679');

        expect(result.flight_id).toBe('TG679');
        expect(result.gate).toBe('D4');
        expect(result.status).toBe('Scheduled');
        expect(result.gate_zone).toBe('D');
        expect(result.note).toBe('Data overridden by Admin.');
        
        // Ensure axios is NOT called if there is an override
        expect(axios.get).not.toHaveBeenCalled();
    });

    test('Case 2: FlightAware Success with Gate', async () => {
        // DB empty
        db.query.mockResolvedValueOnce({ rows: [] });

        // FlightAware HTML Mock
        const mockHtml = `
            var trackpollBootstrap = {
                "flights": {
                    "THA679-mock": {
                        "activityLog": {
                            "flights": [
                                {
                                    "origin": { "icao": "VTBS", "gate": "S118" },
                                    "gateDepartureTimes": { "scheduled": 1893456000 }
                                }
                            ]
                        }
                    }
                }
            };
        `;
        axios.get.mockResolvedValueOnce({ data: mockHtml });

        const result = await fetchFlightStatus('TG679');

        expect(result.gate).toBe('S118');
        expect(axios.get).toHaveBeenCalled();
    });

    test('Case 3: FlightAware returns NULL Gate (Edge Case)', async () => {
        // DB empty
        db.query.mockResolvedValueOnce({ rows: [] });

        const mockHtml = `
            var trackpollBootstrap = {
                "flights": {
                    "THA679-mock": {
                        "activityLog": {
                            "flights": [
                                {
                                    "origin": { "icao": "VTBS" },
                                    "gateDepartureTimes": { "scheduled": 1893456000 }
                                }
                            ]
                        }
                    }
                }
            };
        `;
        axios.get.mockResolvedValueOnce({ data: mockHtml });

        const result = await fetchFlightStatus('TG679');

        // It should fallback to dynamic simulation or TBD gracefully without throwing
        expect(result.gate).toBeDefined();
        // Since hash is 12345, 12345 % 15 = 0, which points to the first gate in possibleGates array ('D4' typically)
        // If it throws an error instead, the test will fail here.
    });

    test('Case 4: FlightAware API Fails (Edge Case)', async () => {
        // DB empty
        db.query.mockResolvedValueOnce({ rows: [] });

        // Simulate API timeout / failure
        axios.get.mockRejectedValueOnce(new Error('Network Timeout'));

        const result = await fetchFlightStatus('TG679');

        // Must not crash, should fallback to dynamic simulation
        expect(result.gate).toBeDefined();
        expect(result.status).toBeDefined();
    });

});
