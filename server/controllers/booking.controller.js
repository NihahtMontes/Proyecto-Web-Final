const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Service = require("../models/Service");

const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      room,
      checkIn,
      checkOut,
      paymentMethod = "qr_simple",
      services = [],
    } = req.body;

    const finalRoomId = roomId || room;

    if (!finalRoomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const roomData = await Room.findById(finalRoomId);

    if (!roomData) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: "Fechas inválidas" });
    }

    const existingBooking = await Booking.findOne({
      room: finalRoomId,
      status: { $in: ["pendiente", "confirmada", "en_curso"] },
      checkIn: { $lt: outDate },
      checkOut: { $gt: inDate },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "La habitación ya está reservada en esas fechas",
      });
    }

    let servicesTotal = 0;
    const formattedServices = [];

    for (const item of services) {
      const serviceId =
        typeof item === "string"
          ? item
          : item.service?._id || item.service || item.serviceId || item._id;

      if (!serviceId) continue;

      const service = await Service.findById(serviceId);

      if (service) {
        const quantity = Number(item.quantity || 1);

        servicesTotal += Number(service.price || 0) * quantity;

        formattedServices.push({
          service: service._id,
          quantity,
        });
      }
    }

    const pricePerNight = Number(roomData.pricePerNight || roomData.price || 0);

    if (!pricePerNight) {
      return res.status(400).json({
        message: "La habitación no tiene precio configurado",
      });
    }

    const basePrice = pricePerNight * nights;
    const totalPrice = basePrice + servicesTotal;

    const booking = await Booking.create({
      user: req.user._id,
      room: finalRoomId,
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

    res.status(201).json(booking);
  } catch (error) {
    console.error("ERROR CREATE BOOKING:", error);

    res.status(500).json({
      message: "Error creando reserva",
      error: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("room")
    .populate("services.service")
    .sort("-createdAt");

  res.json(bookings);
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status: "cancelada" },
    { new: true }
  );

  if (!booking) {
    return res.status(404).json({ message: "Reserva no encontrada" });
  }

  res.json(booking);
};

const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("room", "number type pricePerNight status")
    .populate("services.service")
    .sort("-createdAt");

  res.json(bookings);
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!booking) {
    return res.status(404).json({ message: "Reserva no encontrada" });
  }

  res.json(booking);
};

const createReview = async (req, res) => {
  res.json({ message: "Review registrado" });
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  createReview,
};