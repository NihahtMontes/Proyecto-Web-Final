const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- Generador de Token ---
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

// @desc    Registrar usuario
// FIX C1: Se elimina 'role' del req.body para evitar manipulación de cuentas Admin
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // C1 Fix: Ignoramos cualquier rol enviado

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    // C1 Fix: Forzamos de manera estricta que el rol sea 'cliente' en la base de datos
    const user = await User.create({
      name,
      email,
      password,
      role: 'cliente' 
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    // M6 Fix: No dejamos console.logs que expongan errores crudos o datos del req.body
    res.status(500).json({ success: false, message: 'Error en el servidor al registrar el usuario' });
  }
};

// @desc    Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    
    // M6 Fix: Garantizamos la ausencia de console.logs con credenciales/tokens en consola
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor al iniciar sesión' });
  }
};

const getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe };