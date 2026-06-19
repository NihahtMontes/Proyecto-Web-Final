const CleaningTask = require("../models/CleaningTask");
const Room = require("../models/Room");
const User = require("../models/User");

const getMyTasks = async (req, res) => {
  try {
    const tasks = await CleaningTask.find({ employee: req.user._id })
      .populate("room", "number type status")
      .sort("-createdAt");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener tus tareas",
      error: error.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const tasks = await CleaningTask.find(query)
      .populate("room", "number type status")
      .populate("employee", "name email")
      .sort("-createdAt");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener todas las tareas",
      error: error.message,
    });
  }
};

const assignTask = async (req, res) => {
  try {
    const { roomId, employeeId } = req.body;

    const room = await Room.findById(roomId);

    if (!room || room.status !== "sucio") {
      return res.status(400).json({
        message: "La habitación no existe o no requiere limpieza",
      });
    }

    const employee = await User.findById(employeeId);

    if (!employee || employee.role !== "empleado") {
      return res.status(400).json({
        message: "El usuario asignado no es un empleado válido",
      });
    }

    const activeTask = await CleaningTask.findOne({
      room: roomId,
      status: { $in: ["pendiente", "en_progreso"] },
    });

    if (activeTask) {
      return res.status(400).json({
        message: "Esta habitación ya tiene una orden de limpieza activa",
      });
    }

    const task = await CleaningTask.create({
      room: roomId,
      employee: employeeId,
      status: "pendiente",
    });

    room.status = "limpieza";
    await room.save();

    const populatedTask = await CleaningTask.findById(task._id)
      .populate("room", "number type status")
      .populate("employee", "name email");

    res.status(201).json(populatedTask);
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
      return res.status(403).json({
        message: "No autorizado o tarea no encontrada",
      });
    }

    if (task.status !== "pendiente") {
      return res.status(400).json({
        message: "La tarea debe estar pendiente para iniciarla",
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
      return res.status(403).json({
        message: "No autorizado o tarea no encontrada",
      });
    }

    if (task.status !== "en_progreso") {
      return res.status(400).json({
        message: "La tarea debe estar en progreso para completarla",
      });
    }

    task.status = "completada";
    task.completedAt = Date.now();
    await task.save();

    await Room.findByIdAndUpdate(task.room, {
      status: "disponible",
    });

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