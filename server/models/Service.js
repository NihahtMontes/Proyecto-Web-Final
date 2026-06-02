const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    unique: true,
    trim: true
  },

  description: {
    type: String,
    default: ''
  },

  price: {
    type: Number,
    required: [true, 'El precio del servicio es obligatorio']
  },

  icon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);