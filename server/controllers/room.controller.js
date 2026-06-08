const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Obtener todas las habitaciones con filtros
const getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity } = req.query;
    let query = {};

    if (type) query.type = type;
    if (capacity) query.capacity = { $gte: Number(capacity) };
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(query).populate('services');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener habitaciones', error: error.message });
  }
};

// Lógica de disponibilidad cruzada con reservas
const getAvailableRooms = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Las fechas de check-in y check-out son obligatorias' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // 1. Buscar reservas que se solapen con estas fechas
    // Solapamiento: La reserva empieza antes de que el cliente salga Y termina después de que el cliente entre.
    const overlappingBookings = await Booking.find({
      status: { $in: ['confirmada', 'en_curso'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    // 2. Extraer los IDs de las habitaciones ocupadas en esas fechas
    const bookedRoomIds = overlappingBookings.map(booking => booking.room);

    // 3. Buscar habitaciones que estén 'disponibles' y cuyo ID no esté en la lista de ocupadas
    const availableRooms = await Room.find({
      status: 'disponible',
      _id: { $nin: bookedRoomIds }
    }).populate('services');

    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar disponibilidad', error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('services');
    if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la habitación', error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const roomExists = await Room.findOne({ number: req.body.number });
    if (roomExists) {
      return res.status(400).json({ message: 'El número de habitación ya existe' });
    }

    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la habitación', error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la habitación', error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    // Verificamos que no tenga reservas activas antes de borrar
    const activeBookings = await Booking.findOne({ 
      room: req.params.id, 
      status: { $in: ['pendiente', 'confirmada', 'en_curso'] } 
    });

    if (activeBookings) {
      return res.status(400).json({ message: 'No se puede eliminar: la habitación tiene reservas activas' });
    }

    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
    res.json({ message: 'Habitación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la habitación', error: error.message });
  }
};

const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado de la habitación', error: error.message });
  }
};

module.exports = {
  getRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus
};