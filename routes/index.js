const path = require('path');
const express = require('express');
const router = express.Router();

const pagesRoutes = require('./pages');
const flightsRoutes = require('./flights');
const navigationRoutes = require('./navigation');
const storesRoutes = require('./stores');
const nodesRoutes = require('./nodes');
const dashboardRoutes = require('./dashboard');
const ordersRoutes = require('./orders');
const productsRoutes = require('./products');
const stockRoutes = require('./stock');
const storeSettingsRoutes = require('./storeSettings');
const flightOverridesRoutes = require('./flightOverrides');

// Use pages as root since they define /admin, /store, etc.
router.use('/', pagesRoutes);
router.use('/', storeSettingsRoutes);
router.use('/', flightsRoutes);
router.use('/', flightOverridesRoutes);
router.use('/', navigationRoutes);
router.use('/', storesRoutes);
router.use('/', nodesRoutes);
router.use('/', dashboardRoutes);
router.use('/', ordersRoutes);
router.use('/', productsRoutes);
router.use('/', stockRoutes);

module.exports = router;

