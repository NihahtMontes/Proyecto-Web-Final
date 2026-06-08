const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    // Si envían ?role=empleado en la URL, filtramos por eso
    const query = req.query.role ? { role: req.query.role } : {};
    
    // .select('-password') asegura que NUNCA enviemos las contraseñas al frontend
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // El modelo User de Alejandro debería tener un pre-save que hashea la contraseña
    const user = await User.create({ name, email, password, role, phone });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Evitar que el admin activo se elimine a sí mismo
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Acción denegada: No puedes eliminar tu propia cuenta' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = { getUsers, createUser, deleteUser };