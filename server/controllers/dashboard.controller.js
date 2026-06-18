const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
const Payment = require("../models/Payment");

const getSummary = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalUsers = await User.countDocuments({ role: "cliente" });
    const totalEmployees = await User.countDocuments({ role: "empleado" });

    const availableRooms = await Room.countDocuments({ status: "disponible" });
    const cleaningRooms = await Room.countDocuments({ status: "limpieza" });
    const dirtyRooms = await Room.countDocuments({ status: "sucio" });
    const occupiedRooms = await Room.countDocuments({ status: "ocupada" });

    const payments = await Payment.find({
      status: { $in: ["completado", "verificado"] },
    });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    res.json({
      totalBookings,
      totalRooms,
      totalUsers,
      totalEmployees,
      totalRevenue,
      roomStats: {
        available: availableRooms,
        occupied: occupiedRooms,
        cleaning: cleaningRooms,
        dirty: dirtyRooms,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo resumen",
      error: error.message,
    });
  }
};

const getOccupancy = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const unavailable = await Room.countDocuments({
      status: { $in: ["ocupada", "limpieza", "sucio"] },
    });

    const percentage =
      totalRooms === 0 ? 0 : Math.round((unavailable / totalRooms) * 100);

    res.json({ totalRooms, unavailable, percentage });
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo ocupación",
      error: error.message,
    });
  }
};

const getRevenue = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: { $in: ["completado", "verificado"] },
    }).sort("-createdAt");

    const total = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    res.json({ total, payments });
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo ingresos",
      error: error.message,
    });
  }
};

const getTopRooms = async (req, res) => {
  try {
    const rooms = await Booking.aggregate([
      { $group: { _id: "$room", totalBookings: { $sum: 1 } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
    ]);

    await Room.populate(rooms, {
      path: "_id",
      select: "number type pricePerNight",
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo habitaciones populares",
      error: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getOccupancy,
  getRevenue,
  getTopRooms,
  getDashboardStats: getSummary,
};