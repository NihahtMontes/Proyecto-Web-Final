const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth.middleware");

const {
  getSummary,
  getOccupancy,
  getRevenue,
  getTopRooms,
  getDashboardStats,
} = require("../controllers/dashboard.controller");

router.get("/stats", protect, authorize("admin"), getDashboardStats);
router.get("/summary", protect, authorize("admin"), getSummary);
router.get("/occupancy", protect, authorize("admin"), getOccupancy);
router.get("/revenue", protect, authorize("admin"), getRevenue);
router.get("/top-rooms", protect, authorize("admin"), getTopRooms);

module.exports = router;