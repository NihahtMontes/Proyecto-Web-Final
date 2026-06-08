const CleaningTask = require('../models/CleaningTask');
const Room = require('../models/Room');

const getMyTasks = async (req, res) => {
  try {
    const tasks = await CleaningTask.find({ employee: req.user._id })
      .populate('room', 'number type status')
      .sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus tareas', error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const tasks = await CleaningTask.find(query)
      .populate('room', 'number type status')
      .populate('employee', 'name email')
      .sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las tareas', error: error.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const { roomId, employeeId } = req.body;

    const room = await Room.findById(roomId);
    if (!room || room.status !== 'sucio') {
      return res.status(400).json({ message: 'La habitación no existe o no requiere limpieza' });
    }

    const task = await CleaningTask.create({
      room: roomId,
      employee: employeeId,
      status: 'pendiente'
    });

    // Actualizamos la habitación para indicar que está en proceso de limpieza
    room.status = 'limpieza';
    await room.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar la tarea', error: error.message });
  }
};

const startTask = async (req, res) => {
  try {
    const task = await CleaningTask.findById(req.params.id);
    if (!task || task.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado o tarea no encontrada' });
    }

    task.status = 'en_progreso';
    task.startedAt = Date.now();
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar la tarea', error: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await CleaningTask.findById(req.params.id);
    if (!task || task.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado o tarea no encontrada' });
    }

    task.status = 'completada';
    task.completedAt = Date.now();
    await task.save();

    // La habitación vuelve a estar lista para nuevos clientes
    await Room.findByIdAndUpdate(task.room, { status: 'disponible' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al completar la tarea', error: error.message });
  }
};

module.exports = { getMyTasks, getAllTasks, assignTask, startTask, completeTask };