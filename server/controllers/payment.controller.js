const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { generateBCBQR } = require("../utils/qrGenerator");
const { uploadImage } = require("../utils/cloudinary");
const { sendBookingConfirmation } = require("../utils/email");

const createPayment = async (bookingId, method, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking || booking.user.toString() !== userId.toString()) {
    throw new Error("Reserva no encontrada o no autorizada");
  }

  const existing = await Payment.findOne({ booking: bookingId });

  if (existing) return { booking, payment: existing };

  const payment = await Payment.create({
    booking: bookingId,
    method,
    amount: booking.totalPrice,
    status: "pendiente",
  });

  return { booking, payment };
};

const generateQR = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const { booking, payment } = await createPayment(
      bookingId,
      "qr_simple",
      req.user._id
    );

    const { qrText, qrDataURL } = await generateBCBQR({
      bookingId,
      amount: booking.totalPrice,
    });

    res.status(201).json({ payment, qrCode: qrDataURL, qrText });
  } catch (error) {
    res.status(500).json({ message: "Error generando QR", error: error.message });
  }
};

const registerTigoMoney = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const { booking, payment } = await createPayment(
      bookingId,
      "tigo_money",
      req.user._id
    );

    res.status(201).json({
      payment,
      tigoData: {
        number: process.env.TIGO_MONEY_NUMBER || "70000000",
        holder: process.env.TIGO_MONEY_HOLDER || "ByteHotel",
        amount: booking.totalPrice,
        concepto: `Reserva ${bookingId}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registrando pago Tigo Money", error: error.message });
  }
};

const registerManualPayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;

    if (!["transferencia", "efectivo"].includes(method)) {
      return res.status(400).json({ message: "Método de pago inválido" });
    }

    const { payment } = await createPayment(bookingId, method, req.user._id);

    res.status(201).json({ payment });
  } catch (error) {
    res.status(500).json({ message: "Error registrando pago", error: error.message });
  }
};

const uploadComprobante = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se subió ningún archivo" });

    const payment = await Payment.findById(req.params.id).populate("booking");

    if (!payment || payment.booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Pago no autorizado" });
    }

    const imageUrl = await uploadImage(req.file.buffer);
    payment.comprobante = imageUrl;
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error subiendo comprobante", error: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).select("_id");
    const bookingIds = bookings.map((b) => b._id);

    const payments = await Payment.find({ booking: { $in: bookingIds } }).populate("booking");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pagos", error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find(req.query).populate({
      path: "booking",
      populate: { path: "user room", select: "name email number type" },
    }).sort("-createdAt");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo todos los pagos", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");

    if (!payment || payment.status !== "pendiente") {
      return res.status(400).json({ message: "Pago no encontrado o ya procesado" });
    }

    payment.status = "verificado";
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = Date.now();
    await payment.save();

    const booking = await Booking.findByIdAndUpdate(
      payment.booking._id,
      { status: "confirmada" },
      { new: true }
    ).populate("user");

    sendBookingConfirmation(booking.user.email, booking).catch(console.error);

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error verificando pago", error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");
    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pago", error: error.message });
  }
};

module.exports = {
  generateQR,
  registerTigoMoney,
  registerManualPayment,
  uploadComprobante,
  getMyPayments,
  getAllPayments,
  verifyPayment,
  getPaymentById,
};