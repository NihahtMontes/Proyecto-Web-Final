const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getSummary, getOccupancyData, getRevenueData, getTopRooms } = require('../controllers/dashboard.controller');

// C4: Definición de las 4 rutas requeridas por el Frontend Admin
router.get('/summary', protect, authorize('admin'), getSummary);
router.get('/occupancy', protect, authorize('admin'), getOccupancyData);
router.get('/revenue', protect, authorize('admin'), getRevenueData);
router.get('/top-rooms', protect, authorize('admin'), getTopRooms);

module.exports = router;