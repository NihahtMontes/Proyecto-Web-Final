const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Service = require('../models/Service');
const { sendBookingConfirmation } = require('../utils/email');

const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, services, paymentMethod } = req.body;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      return res.status(400).json({ message: 'La fecha de salida debe ser mayor a la de entrada' });
    }

    const room = await Room.findById(roomId);
    if (!room || room.status !== 'disponible') {
      return res.status(400).json({ message: 'La habitación no está disponible' });
    }

    // Calcular noches
    const diffTime = Math.abs(outDate - inDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calcular precio base
    const basePrice = room.pricePerNight * nights;

    // Calcular servicios adicionales
    let servicesTotal = 0;
    let formattedServices = [];
    
    if (services && services.length > 0) {
      for (let item of services) {
        const serviceDB = await Service.findById(item.serviceId);
        if (serviceDB) {
          servicesTotal += serviceDB.price * item.quantity;
          formattedServices.push({ service: serviceDB._id, quantity: item.quantity });
        }
      }
    }

    const totalPrice = basePrice + servicesTotal;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: inDate,
      checkOut: outDate,
      nights,
      basePrice,
      servicesTotal,
      totalPrice,
      services: formattedServices,
      paymentMethod,
      status: 'pendiente'
    });

    // Cambiar el estado de la habitación a ocupado
    room.status = 'ocupado';
    await room.save();

    // Enviar correo (no detenemos la ejecución si falla el correo)
    sendBookingConfirmation(req.user.email, booking).catch(console.error);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'number type')
      .populate('services.service', 'name price');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'number type images')
      .populate('services.service', 'name')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta reserva' });
    }
    if (booking.status !== 'pendiente') {
      return res.status(400).json({ message: 'Solo se pueden cancelar reservas pendientes' });
    }

    booking.status = 'cancelada';
    await booking.save();

    // Liberar la habitación
    await Room.findByIdAndUpdate(booking.room, { status: 'disponible' });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { status, room, user } = req.query;
    let query = {};
    if (status) query.status = status;
    if (room) query.room = room;
    if (user) query.user = user;

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('room', 'number type')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las reservas', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

    // Si la reserva se marca como completada, ensuciamos el cuarto para el empleado
    if (status === 'completada') {
      await Room.findByIdAndUpdate(booking.room, { status: 'sucio' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado', error: error.message });
  }
};

// Implementación simple de reseñas ligada a la reserva
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const Review = require('../models/Review');

    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    if (booking.status !== 'completada') {
      return res.status(400).json({ message: 'Solo puedes calificar estadías completadas' });
    }

    const reviewExists = await Review.findOne({ user: req.user._id, booking: booking._id });
    if (reviewExists) {
      return res.status(400).json({ message: 'Ya calificaste esta reserva' });
    }

    const review = await Review.create({
      user: req.user._id,
      booking: booking._id,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reseña', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  createReview
};