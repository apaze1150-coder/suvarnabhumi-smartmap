require('dotenv').config();
const db = require('./db');
const fs = require('fs');
const path = require('path');

async function setupDB() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS flight_override (
                flight_id VARCHAR(50) PRIMARY KEY,
                gate VARCHAR(50) NOT NULL,
                boarding_time VARCHAR(20),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.query(createTableQuery);
        console.log('✅ Table flight_override is ready.');

        // Also try to migrate existing flight_override.csv if table is empty
        const res = await db.query('SELECT COUNT(*) FROM flight_override');
        if (parseInt(res.rows[0].count) === 0) {
            console.log('Table is empty. Migrating existing flight_override.csv...');
            const csvPath = path.join(__dirname, 'flight_override.csv');
            if (fs.existsSync(csvPath)) {
                const data = fs.readFileSync(csvPath, 'utf8');
                const rows = data.split('\n').slice(1);
                for (let row of rows) {
                    if (row.trim()) {
                        const [id, gate, time] = row.split(',');
                        if (id && gate) {
                            await db.query(
                                'INSERT INTO flight_override (flight_id, gate, boarding_time) VALUES ($1, $2, $3)',
                                [id.trim(), gate.trim(), time ? time.trim() : null]
                            );
                        }
                    }
                }
                console.log('✅ Migrated CSV data to database.');
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Error setting up DB:', err);
        process.exit(1);
    }
}

setupDB();
