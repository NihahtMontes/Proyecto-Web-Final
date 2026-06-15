const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getDashboardStats } = require('../controllers/dashboard.controller');

// Ruta exclusiva para el administrador
router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;