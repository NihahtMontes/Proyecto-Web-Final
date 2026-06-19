const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const query = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(query).select("-password").sort("-createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "empleado", phone = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
    }

    if (!["cliente", "empleado", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });

    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      phone,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone = "", role, password } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Nombre, email y rol son obligatorios" });
    }

    if (!["cliente", "empleado", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const emailExists = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.params.id },
    });

    if (emailExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.name = name;
    user.email = email.toLowerCase().trim();
    user.phone = phone;
    user.role = role;

    if (password && password.trim() !== "") {
      user.password = password;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "No puedes eliminar tu propia cuenta" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };