const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth.middleware");

const {
  getRooms,
  getAvailableRooms,
  getOccupiedDates,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
} = require("../controllers/room.controller");

// Rutas públicas
router.get("/", getRooms);
router.get("/available", getAvailableRooms);
router.get("/:id/occupied-dates", getOccupiedDates);
router.get("/:id", getRoomById);

// Rutas protegidas admin
router.post("/", protect, authorize("admin"), createRoom);
router.put("/:id", protect, authorize("admin"), updateRoom);
router.delete("/:id", protect, authorize("admin"), deleteRoom);

// Admin y empleado
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "empleado"),
  updateRoomStatus
);

module.exports = router;