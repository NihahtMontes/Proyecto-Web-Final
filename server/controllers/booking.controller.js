const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Service = require("../models/Service");
const { sendBookingConfirmation } = require("../utils/email");

// @desc Crear nueva reserva
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, services, paymentMethod } = req.body;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      return res.status(400).json({
        message: "La fecha de salida debe ser mayor a la de entrada",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "La habitación no existe",
      });
    }

    if (room.status === "mantenimiento") {
      return res.status(400).json({
        message: "La habitación está en mantenimiento y no se puede reservar",
      });
    }

  const overlappingBooking = await Booking.findOne({
  room: roomId,
  status: { $in: ["pendiente", "confirmada", "en_curso"] },
  checkIn: { $lt: outDate },
  checkOut: { $gt: inDate },
});

    if (overlappingBooking) {
      return res.status(400).json({
        message:
          "La habitación ya tiene una reserva que se solapa con las fechas seleccionadas",
      });
    }

    const diffTime = Math.abs(outDate - inDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const basePrice = Number(room.pricePerNight || 0) * nights;

    let servicesTotal = 0;
    const formattedServices = [];

    if (services && services.length > 0) {
      for (let item of services) {
        const serviceId = item.service || item.serviceId;
        const quantity = Number(item.quantity || 1);

        const serviceDB = await Service.findById(serviceId);

        if (serviceDB) {
          servicesTotal += Number(serviceDB.price || 0) * quantity;

          formattedServices.push({
            service: serviceDB._id,
            quantity,
          });
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
      status: "pendiente",
    });

    sendBookingConfirmation(req.user.email, booking).catch(console.error);

    const populatedBooking = await Booking.findById(booking._id)
      .populate("room", "number type")
      .populate("services.service", "name price");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la reserva",
      error: error.message,
    });
  }
};

// @desc Obtener reservas del usuario autenticado
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room", "number type images")
      .populate("services.service", "name price")
      .sort("-createdAt");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reservas",
      error: error.message,
    });
  }
};

// @desc Cancelar una reserva pendiente
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "No tienes permiso para cancelar esta reserva",
      });
    }

    if (booking.status !== "pendiente") {
      return res.status(400).json({
        message: "Solo se pueden cancelar reservas pendientes",
      });
    }

    booking.status = "cancelada";
    await booking.save();

    await Room.findByIdAndUpdate(booking.room, {
      status: "disponible",
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Error al cancelar la reserva",
      error: error.message,
    });
  }
};

// @desc Obtener todas las reservas Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, room, user } = req.query;

    const query = {};

    if (status) query.status = status;
    if (room) query.room = room;
    if (user) query.user = user;

    const bookings = await Booking.find(query)
      .populate("user", "name email")
      .populate("room", "number type")
      .populate("services.service", "name price")
      .sort("-createdAt");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener todas las reservas",
      error: error.message,
    });
  }
};

// @desc Actualizar estado de reserva
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Reserva no encontrada",
      });
    }

    if (status === "en_curso") {
      await Room.findByIdAndUpdate(booking.room, {
        status: "ocupado",
      });
    } else if (status === "completada") {
      await Room.findByIdAndUpdate(booking.room, {
        status: "sucio",
      });
    } else if (status === "cancelada") {
      await Room.findByIdAndUpdate(booking.room, {
        status: "disponible",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el estado",
      error: error.message,
    });
  }
};

// @desc Crear reseña
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const Review = require("../models/Review");

    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    if (booking.status !== "completada") {
      return res.status(400).json({
        message: "Solo puedes calificar estadías completadas",
      });
    }

    const reviewExists = await Review.findOne({
      user: req.user._id,
      booking: booking._id,
    });

    if (reviewExists) {
      return res.status(400).json({
        message: "Ya calificaste esta reserva",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      booking: booking._id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la reseña",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  createReview,
};