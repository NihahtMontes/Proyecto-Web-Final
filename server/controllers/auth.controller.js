const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- Generador de Token ---
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role // <-- Volvemos a role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // <-- Volvemos a name y agregamos role

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'cliente' // Si no envían rol, por defecto es cliente
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ ALERTA: No se encontró ningún usuario con el correo: ${email}`);
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`❌ ALERTA: La contraseña es incorrecta para el usuario: ${email}`);
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    
    console.log(`✅ ÉXITO: Usuario ${email} logueado correctamente.`);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name, // <-- Volvemos a name
        email: user.email,
        role: user.role  // <-- Volvemos a role
      }
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ success: false, message: error.message });
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