require('dotenv').config();
const db = require('./db');

async function setupTables() {
  console.log('Connecting and creating restaurant_matrix...');
  await db.query(`
    CREATE TABLE IF NOT EXISTS restaurant_matrix (
      id SERIAL PRIMARY KEY,
      restaurant_id VARCHAR(50) UNIQUE,
      name VARCHAR(255) NOT NULL,
      image_url TEXT DEFAULT 'default.jpg',
      category VARCHAR(100) DEFAULT 'Restaurant',
      concourse VARCHAR(20) DEFAULT 'D',
      floor VARCHAR(20) DEFAULT '4',
      x BIGINT DEFAULT 500,
      y BIGINT DEFAULT 250,
      graph_node_id VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('Creating service_matrix...');
  await db.query(`
    CREATE TABLE IF NOT EXISTS service_matrix (
      id SERIAL PRIMARY KEY,
      service_id VARCHAR(50) UNIQUE,
      name VARCHAR(255) NOT NULL,
      image_url TEXT DEFAULT 'default.jpg',
      category VARCHAR(100) DEFAULT 'Airport information',
      concourse VARCHAR(20) DEFAULT 'D',
      floor VARCHAR(20) DEFAULT '4',
      x BIGINT DEFAULT 500,
      y BIGINT DEFAULT 250,
      graph_node_id VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('Creating lounge_matrix...');
  await db.query(`
    CREATE TABLE IF NOT EXISTS lounge_matrix (
      id SERIAL PRIMARY KEY,
      lounge_id VARCHAR(50) UNIQUE,
      name VARCHAR(255) NOT NULL,
      image_url TEXT DEFAULT 'default.jpg',
      category VARCHAR(100) DEFAULT 'Lounge',
      concourse VARCHAR(20) DEFAULT 'D',
      floor VARCHAR(20) DEFAULT '4',
      x BIGINT DEFAULT 500,
      y BIGINT DEFAULT 250,
      graph_node_id VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Check counts & seed if empty
  const restCount = await db.query('SELECT count(*) FROM restaurant_matrix');
  if (parseInt(restCount.rows[0].count) === 0) {
    console.log('Seeding restaurant_matrix...');
    await db.query(`
      INSERT INTO restaurant_matrix (restaurant_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description)
      VALUES 
        ('REST-01', 'McDonald''s', 'cutlery.png', 'Fast Food', 'F', '4', 814, 217, 'Node_F', 'Burgers, fries, fast food 24 hours'),
        ('REST-02', 'Taste of Thailand', 'cutlery.png', 'Thai Food', 'D', '4', 380, 215, 'Node_Concourse_D_West', 'Authentic Thai street food & dining'),
        ('REST-03', 'Starbucks Coffee', 'cutlery.png', 'Cafe & Bakery', 'D', '4', 620, 220, 'Node_Concourse_D_East', 'Premium coffee, snacks & pastries')
      ON CONFLICT (restaurant_id) DO NOTHING;
    `);
  }

  const servCount = await db.query('SELECT count(*) FROM service_matrix');
  if (parseInt(servCount.rows[0].count) === 0) {
    console.log('Seeding service_matrix...');
    await db.query(`
      INSERT INTO service_matrix (service_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description)
      VALUES 
        ('SRV-INFO-01', 'Airport Information East', 'information.png', 'Airport information', 'C', '4', 224, 230, 'Node_information_east', 'Airport flight info, directional assistance, terminal guides'),
        ('SRV-INFO-02', 'Airport Information West', 'information.png', 'Airport information', 'D', '4', 758, 218, 'Node_information_west', 'Airport flight info, directional assistance, terminal guides'),
        ('SRV-EXCH-01', 'Currency Exchange East', 'exchange-rate.png', 'Currency exchange', 'C', '4', 214, 214, 'Node_Exchage rate_east', 'Foreign exchange, cash withdrawal, multi-currency services'),
        ('SRV-EXCH-02', 'Currency Exchange West', 'exchange-rate.png', 'Currency exchange', 'E', '4', 774, 230, 'Node_exchage rate_west', 'Foreign exchange, cash withdrawal, multi-currency services'),
        ('SRV-VAT-01', 'VAT Refund East', 'vat_refund.png', 'VAT refund', 'D', '4', 266, 215, 'Node_Vat refund_East', 'Tourist VAT refund inspection & customs stamp'),
        ('SRV-VAT-02', 'VAT Refund West', 'vat_refund.png', 'VAT refund', 'D', '4', 715, 215, 'Node_Vat refund_West', 'Tourist VAT refund inspection & customs stamp')
      ON CONFLICT (service_id) DO NOTHING;
    `);
  }

  const loungeCount = await db.query('SELECT count(*) FROM lounge_matrix');
  if (parseInt(loungeCount.rows[0].count) === 0) {
    console.log('Seeding lounge_matrix...');
    await db.query(`
      INSERT INTO lounge_matrix (lounge_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description)
      VALUES 
        ('LNG-01', 'Coral Executive Lounge', 'lounge.png', 'Pay-per-use Lounge', 'D', '3', 335, 192, 'Node_Lounge_D1', 'Premium relaxing lounge, refreshments, showers & Wi-Fi'),
        ('LNG-02', 'Miracle Lounge Concourse D', 'lounge.png', 'Miracle Lounge', 'D', '3', 600, 195, 'Node_Concourse_D_East', 'Complimentary dining, bar, quiet rest area'),
        ('LNG-03', 'Royal Silk Lounge', 'lounge.png', 'Royal Silk Lounge', 'D', '3', 500, 185, 'Node_Passport_Control', 'THAI Airways Royal Silk Business class lounge')
      ON CONFLICT (lounge_id) DO NOTHING;
    `);
  }

  console.log('Setup finished successfully!');
  process.exit(0);
}

setupTables().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
