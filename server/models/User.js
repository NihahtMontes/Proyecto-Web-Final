const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6
  },

  role: {
    type: String,
    enum: ['cliente', 'empleado', 'admin'],
    default: 'cliente'
  },

  phone: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hashear contraseña antes de guardar
// Hashear contraseña antes de guardar (Versión Moderna y limpia)
userSchema.pre('save', async function () {
  // Si la contraseña no fue modificada, simplemente retornamos para salir de la función
  if (!this.isModified('password')) {
    return;
  }

  // Generamos el salt y hasheamos (sin next ni try/catch, Mongoose lo maneja)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparar contraseña ingresada con la almacenada
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);