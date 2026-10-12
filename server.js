require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { apiLimiter } = require('./middlewares/rateLimiter');

const fs = require('fs');
const db = require('./db');

// Import combined routes
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Trust the reverse proxy (Render load balancer) to get real client IPs
app.set('trust proxy', 1);

// ── Security Headers (Helmet) ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// ── CORS: Restrict to allowed origins ─────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

// ── Rate Limiting ──────────────────────────────────────────────────
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ── Persistent Uploads (Serve from local disk or fallback to Supabase DB) ──
app.get('/uploads/:filename', async (req, res, next) => {
  const filename = path.basename(req.params.filename);
  const localPath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(localPath)) {
    return res.sendFile(localPath);
  }

  try {
    const result = await db.query('SELECT mime_type, data FROM uploaded_files WHERE filename = $1', [filename]);
    if (result.rows.length > 0) {
      const fileRow = result.rows[0];
      try {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        fs.writeFileSync(localPath, fileRow.data);
      } catch (writeErr) {
        console.warn('[Uploads Cache] Write error:', writeErr.message);
      }
      res.setHeader('Content-Type', fileRow.mime_type || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(fileRow.data);
    }
  } catch (dbErr) {
    console.error('[Uploads DB] Query error:', dbErr.message);
  }

  return res.status(404).send('Image not found');
});

// ── Static Files ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'favicon.ico')));

// Serve root-level files individually
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/icon-192.png', (req, res) => res.sendFile(path.join(__dirname, 'icon-192.png')));
app.get('/icon-512.png', (req, res) => res.sendFile(path.join(__dirname, 'icon-512.png')));
app.get('/icon-maskable-512.png', (req, res) => res.sendFile(path.join(__dirname, 'icon-maskable-512.png')));
app.get('/apple-touch-icon.png', (req, res) => res.sendFile(path.join(__dirname, 'apple-touch-icon.png')));
app.get('/index.css', (req, res) => res.sendFile(path.join(__dirname, 'index.css')));
app.get('/smartmap.html', (req, res) => res.sendFile(path.join(__dirname, 'smartmap.html')));

// ── Health Check ───────────────────────────────────────────────────
app.get('/ping', (req, res) => {
    res.status(200).send('OK');
});

// ── Routes ─────────────────────────────────────────────────────────
app.use('/', routes);

// ── GLOBAL API 404 HANDLER ─────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found: ' + req.method + ' ' + req.originalUrl });
});

// ── GLOBAL ERROR HANDLER ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error', type: err.type });
  } else {
    next(err);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
