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
      return res.status(400).json({ message: "Habitación y empleado son obligatorios" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "empleado") {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const task = await CleaningTask.create({
      room: roomId,
      employee: employeeId,
      instructions,
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
  const task = await CleaningTask.findById(req.params.id);

  if (!task || task.employee.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "No autorizado" });
  }

  task.status = "en_progreso";
  task.startedAt = Date.now();
  await task.save();

  res.json(task);
};

const completeTask = async (req, res) => {
  const task = await CleaningTask.findById(req.params.id);

  if (!task || task.employee.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "No autorizado" });
  }

  task.status = "completada";
  task.completedAt = Date.now();
  await task.save();

  await Room.findByIdAndUpdate(task.room, { status: "disponible" });

  res.json(task);
};

module.exports = {
  getMyTasks,
  getAllTasks,
  assignTask,
  startTask,
  completeTask,
};