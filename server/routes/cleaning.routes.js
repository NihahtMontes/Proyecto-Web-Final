const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth.middleware");

const {
  getMyTasks,
  getAllTasks,
  assignTask,
  startTask,
  completeTask,
} = require("../controllers/cleaning.controller");

// EMPLEADO
router.get("/me", protect, authorize("empleado"), getMyTasks);
router.patch("/:id/start", protect, authorize("empleado"), startTask);
router.patch("/:id/complete", protect, authorize("empleado"), completeTask);

// ADMIN
router.get("/all", protect, authorize("admin"), getAllTasks);
router.post("/", protect, authorize("admin"), assignTask);
router.post("/assign", protect, authorize("admin"), assignTask);

module.exports = router;