const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'El número de habitación es obligatorio'],
    unique: true
  },

  type: {
    type: String,
    enum: ['estándar', 'suite', 'premium'],
    required: [true, 'El tipo de habitación es obligatorio']
  },

  pricePerNight: {
    type: Number,
    required: [true, 'El precio por noche es obligatorio']
  },

  capacity: {
    type: Number,
    required: true,
    default: 2
  },

  description: {
    type: String,
    default: ''
  },

  images: {
    type: [String],
    default: []
  },

  status: {
    type: String,
    enum: ['disponible', 'ocupado', 'limpieza', 'sucio'],
    default: 'disponible'
  },

  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);