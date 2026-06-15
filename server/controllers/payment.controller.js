const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { generateBCBQR } = require('../utils/qrGenerator');
const { uploadImage } = require('../utils/cloudinary');
const { sendBookingConfirmation } = require('../utils/email');

const generateQR = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Reserva no encontrada o no autorizada' });
    }

    const payment = await Payment.create({
      booking: bookingId,
      method: 'qr_simple',
      amount: booking.totalPrice,
      status: 'pendiente'
    });

    const { qrDataURL } = await generateBCBQR({ bookingId, amount: booking.totalPrice });
    res.status(201).json({ payment, qrCode: qrDataURL });
  } catch (error) {
    res.status(500).json({ message: 'Error generando QR', error: error.message });
  }
};

const registerTigoMoney = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Reserva no autorizada' });
    }

    const payment = await Payment.create({
      booking: bookingId,
      method: 'tigo_money',
      amount: booking.totalPrice,
      status: 'pendiente'
    });

    res.status(201).json({ 
      payment, 
      tigoData: { 
        number: process.env.TIGO_MONEY_NUMBER, 
        holder: process.env.TIGO_MONEY_HOLDER, 
        amount: booking.totalPrice, 
        concepto: `Reserva ${bookingId}` 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registrando pago Tigo Money', error: error.message });
  }
};

const uploadComprobante = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });

    const payment = await Payment.findById(req.params.id).populate('booking');
    if (!payment || payment.booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Pago no autorizado' });
    }

    const imageUrl = await uploadImage(req.file.buffer);
    payment.comprobante = imageUrl;
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error subiendo comprobante', error: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    // Buscar los IDs de las reservas de este usuario
    const bookings = await Booking.find({ user: req.user._id }).select('_id');
    const bookingIds = bookings.map(b => b._id);
    
    const payments = await Payment.find({ booking: { $in: bookingIds } }).populate('booking');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo pagos', error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { status, method } = req.query;
    let query = {};
    if (status) query.status = status;
    if (method) query.method = method;

    const payments = await Payment.find(query).populate({
      path: 'booking',
      populate: { path: 'user room', select: 'name email number type' }
    }).sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo todos los pagos', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('booking');
    if (!payment || payment.status !== 'pendiente') {
      return res.status(400).json({ message: 'Pago no encontrado o ya procesado' });
    }

    // Confirmar pago
    payment.status = 'completado';
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = Date.now();
    await payment.save();

    // Confirmar reserva
    const booking = await Booking.findByIdAndUpdate(payment.booking._id, { status: 'confirmada' }).populate('user');

    // Enviar email de confirmación
    sendBookingConfirmation(booking.user.email, booking).catch(console.error);

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error verificando pago', error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('booking');
    if (!payment) return res.status(404).json({ message: 'Pago no encontrado' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo pago', error: error.message });
  }
};

module.exports = { generateQR, registerTigoMoney, uploadComprobante, getMyPayments, getAllPayments, verifyPayment, getPaymentById };