const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'La reserva es obligatoria']
  },

  method: {
    type: String,
    enum: [
      'qr_simple',
      'tigo_money',
      'transferencia',
      'efectivo'
    ],
    required: [true, 'El método de pago es obligatorio']
  },

  amount: {
    type: Number,
    required: [true, 'El monto es obligatorio']
  },

  currency: {
    type: String,
    default: 'BOB'
  },

  status: {
    type: String,
    enum: [
      'pendiente',
      'completado',
      'fallido'
    ],
    default: 'pendiente'
  },

  transactionId: {
    type: String,
    default: ''
  },

  comprobante: {
    type: String,
    default: ''
  },

  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  verifiedAt: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);