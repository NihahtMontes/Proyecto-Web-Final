const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware");

const {
  generateQR,
  registerTigoMoney,
  registerManualPayment,
  uploadComprobante,
  getMyPayments,
  getAllPayments,
  verifyPayment,
  getPaymentById,
} = require("../controllers/payment.controller");

router.post("/generate-qr", protect, authorize("cliente"), generateQR);
router.post("/tigo-money", protect, authorize("cliente"), registerTigoMoney);
router.post("/manual", protect, authorize("cliente"), registerManualPayment);
router.post(
  "/:id/comprobante",
  protect,
  authorize("cliente"),
  upload.single("comprobante"),
  uploadComprobante
);

router.get("/me", protect, authorize("cliente"), getMyPayments);

router.get("/", protect, authorize("admin"), getAllPayments);
router.get("/:id", protect, authorize("admin"), getPaymentById);
router.post("/:id/verify", protect, authorize("admin"), verifyPayment);

module.exports = router;