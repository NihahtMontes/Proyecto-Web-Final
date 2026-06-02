const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'La habitación es obligatoria']
  },

  checkIn: {
    type: Date,
    required: [true, 'La fecha de ingreso es obligatoria']
  },

  checkOut: {
    type: Date,
    required: [true, 'La fecha de salida es obligatoria']
  },

  nights: {
    type: Number,
    required: [true, 'La cantidad de noches es obligatoria']
  },

  basePrice: {
    type: Number,
    required: [true, 'El precio base es obligatorio']
  },

  servicesTotal: {
    type: Number,
    default: 0
  },

  totalPrice: {
    type: Number,
    required: [true, 'El precio total es obligatorio']
  },

  services: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  status: {
    type: String,
    enum: [
      'pendiente',
      'confirmada',
      'en_curso',
      'completada',
      'cancelada'
    ],
    default: 'pendiente'
  },

  paymentMethod: {
    type: String,
    enum: [
      'qr_simple',
      'tigo_money',
      'transferencia',
      'efectivo'
    ],
    required: [true, 'El método de pago es obligatorio']
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);