const CleaningTask = require("../models/CleaningTask");
const Room = require("../models/Room");
const User = require("../models/User");

const getMyTasks = async (req, res) => {
  const tasks = await CleaningTask.find({ employee: req.user._id })
    .populate("room", "number type status")
    .populate("employee", "name email role")
    .sort("-createdAt");

  res.json(tasks);
};

const getAllTasks = async (req, res) => {
  const tasks = await CleaningTask.find()
    .populate("room", "number type status")
    .populate("employee", "name email role")
    .sort("-createdAt");

  res.json(tasks);
};

const assignTask = async (req, res) => {
  try {
    const { roomId, employeeId, instructions } = req.body;

    if (!roomId || !employeeId) {
      return res.status(400).json({
        message: "Habitación y empleado son obligatorios",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    if (room.status !== "sucio") {
      return res.status(400).json({
        message: "Solo se puede asignar limpieza a habitaciones con estado sucio",
      });
    }

    const employee = await User.findById(employeeId);

    if (!employee || employee.role !== "empleado") {
      return res.status(400).json({
        message: "El usuario seleccionado no es empleado",
      });
    }

    const existingTask = await CleaningTask.findOne({
      room: roomId,
      status: { $in: ["pendiente", "en_progreso"] },
    });

    if (existingTask) {
      return res.status(400).json({
        message: "Ya existe una tarea pendiente o en progreso para esta habitación",
      });
    }

    const task = await CleaningTask.create({
      room: roomId,
      employee: employeeId,
      instructions: instructions || "",
      status: "pendiente",
    });

    room.status = "limpieza";
    await room.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error al asignar la tarea",
      error: error.message,
    });
  }
};

const startTask = async (req, res) => {
  try {
    const task = await CleaningTask.findById(req.params.id);

    if (!task || task.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (task.status !== "pendiente") {
      return res.status(400).json({
        message: "Solo se pueden iniciar tareas pendientes",
      });
    }

    task.status = "en_progreso";
    task.startedAt = Date.now();
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar la tarea",
      error: error.message,
    });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await CleaningTask.findById(req.params.id);

    if (!task || task.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (task.status !== "en_progreso") {
      return res.status(400).json({
        message: "Solo se pueden completar tareas en progreso",
      });
    }

    task.status = "completada";
    task.completedAt = Date.now();
    await task.save();

    await Room.findByIdAndUpdate(task.room, { status: "disponible" });

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error al completar la tarea",
      error: error.message,
    });
  }
};

module.exports = {
  getMyTasks,
  getAllTasks,
  assignTask,
  startTask,
  completeTask,
};