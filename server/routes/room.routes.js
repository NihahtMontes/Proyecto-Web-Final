const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus
} = require('../controllers/room.controller');

// Rutas públicas para clientes
router.get('/', getRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);

// Rutas protegidas para administración
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

// Ruta mixta: Admin y Empleado (para cuando terminen de limpiar)
router.patch('/:id/status', protect, authorize('admin', 'empleado'), updateRoomStatus);

module.exports = router;    