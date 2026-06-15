const mongoose = require('mongoose');

const cleaningTaskSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'La habitación es obligatoria']
  },

  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El empleado es obligatorio']
  },

  status: {
    type: String,
    enum: ['pendiente', 'en_progreso', 'completada'],
    default: 'pendiente'
  },

  startedAt: {
    type: Date
  },

  completedAt: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CleaningTask', cleaningTaskSchema);