require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { apiLimiter } = require('./middlewares/rateLimiter');

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

// ── Static Files ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve root-level files individually
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/icon-192.png', (req, res) => res.sendFile(path.join(__dirname, 'icon-192.png')));
app.get('/icon-512.png', (req, res) => res.sendFile(path.join(__dirname, 'icon-512.png')));
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
