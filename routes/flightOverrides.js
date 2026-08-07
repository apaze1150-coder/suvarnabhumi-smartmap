const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middlewares/upload');
const fs = require('fs');
const { parse } = require('csv-parser');

// 1. Get all overrides
router.get('/api/admin/flight-overrides', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM flight_override ORDER BY updated_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching flight overrides:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// 2. Add or update manual override
router.post('/api/admin/flight-overrides', async (req, res) => {
    const { flight_id, gate, boarding_time } = req.body;
    if (!flight_id || !gate) {
        return res.status(400).json({ success: false, error: 'flight_id and gate are required' });
    }
    
    try {
        const query = `
            INSERT INTO flight_override (flight_id, gate, boarding_time, updated_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (flight_id) 
            DO UPDATE SET gate = EXCLUDED.gate, boarding_time = EXCLUDED.boarding_time, updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;
        const result = await db.query(query, [flight_id.trim().toUpperCase(), gate.trim(), boarding_time || null]);
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating flight override:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// 3. Upload CSV batch override
router.post('/api/admin/flight-overrides/csv', upload.single('csv_file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No CSV file uploaded' });
    }
    
    const results = [];
    const csvParser = require('csv-parser');
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Clear existing and replace (or just upsert? Let's upsert to be safe)
                const client = await db.pool.connect();
                try {
                    await client.query('BEGIN');
                    for (const row of results) {
                        const flight_id = row.flight_id;
                        const gate = row.gate;
                        const boarding_time = row.boarding_time || null;
                        
                        if (flight_id && gate) {
                            await client.query(`
                                INSERT INTO flight_override (flight_id, gate, boarding_time, updated_at)
                                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                                ON CONFLICT (flight_id) DO UPDATE SET gate = EXCLUDED.gate, boarding_time = EXCLUDED.boarding_time, updated_at = CURRENT_TIMESTAMP
                            `, [flight_id.trim().toUpperCase(), gate.trim(), boarding_time]);
                        }
                    }
                    await client.query('COMMIT');
                    res.json({ success: true, message: 'CSV uploaded and processed successfully', count: results.length });
                } catch (err) {
                    await client.query('ROLLBACK');
                    throw err;
                } finally {
                    client.release();
                    // Clean up file
                    fs.unlinkSync(req.file.path);
                }
            } catch (error) {
                console.error('Error processing CSV override:', error);
                res.status(500).json({ success: false, error: 'Failed to process CSV' });
            }
        });
});

// 4. Delete an override
router.delete('/api/admin/flight-overrides/:flight_id', async (req, res) => {
    const flight_id = req.params.flight_id;
    try {
        const result = await db.query('DELETE FROM flight_override WHERE flight_id = $1 RETURNING *', [flight_id.toUpperCase()]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Override deleted' });
        } else {
            res.status(404).json({ success: false, error: 'Flight override not found' });
        }
    } catch (error) {
        console.error('Error deleting flight override:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
