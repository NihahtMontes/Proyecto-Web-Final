const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  createReview
} = require('../controllers/booking.controller');

// Rutas para Clientes
router.post('/', protect, authorize('cliente'), createBooking);
router.get('/me', protect, authorize('cliente'), getMyBookings);
router.patch('/:id/cancel', protect, authorize('cliente'), cancelBooking);
router.post('/:id/review', protect, authorize('cliente'), createReview);

// Rutas para Administradores
router.get('/all', protect, authorize('admin'), getAllBookings);
router.patch('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;