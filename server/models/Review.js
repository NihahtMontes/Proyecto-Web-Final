const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },

  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'La reserva es obligatoria']
  },

  rating: {
    type: Number,
    required: [true, 'La calificación es obligatoria'],
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Un usuario solo puede calificar una vez por reserva
reviewSchema.index(
  { user: 1, booking: 1 },
  { unique: true }
);

module.exports = mongoose.model('Review', reviewSchema);