const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const User = require("../models/User");

const getSummary = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: "ocupado" });
    const totalUsers = await User.countDocuments({ role: "cliente" });
    const totalBookings = await Booking.countDocuments();

    const occupancyRate =
      totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const activeBookings = await Booking.countDocuments({
      status: { $in: ["pendiente", "confirmada", "en_curso"] },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["confirmada", "en_curso", "completada"] },
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenueResult = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["confirmada", "en_curso", "completada"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const ratingResult = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalRooms,
      occupiedRooms,
      totalUsers,
      totalBookings,
      occupancyRate,
      activeBookings,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      totalRevenue: totalRevenueResult[0]?.total || 0,
      averageRating: ratingResult[0]?.averageRating
        ? Number(ratingResult[0].averageRating.toFixed(1))
        : 0,
      totalReviews: ratingResult[0]?.totalReviews || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
      error: error.message,
    });
  }
};

const getOccupancyData = async (req, res) => {
  try {
    const occupancy = await Room.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
          occupied: {
            $sum: {
              $cond: [{ $eq: ["$status", "ocupado"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          type: "$_id",
          total: 1,
          occupied: 1,
          percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$occupied", { $max: ["$total", 1] }] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    res.json(occupancy);
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
      error: error.message,
    });
  }
};

const getRevenueData = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["confirmada", "en_curso", "completada"] },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
      error: error.message,
    });
  }
};

const getTopRooms = async (req, res) => {
  try {
    const topRooms = await Booking.aggregate([
      { $group: { _id: "$room", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $project: {
          count: 1,
          "room.number": 1,
          "room.type": 1,
        },
      },
    ]);

    res.json(topRooms);
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getOccupancyData,
  getRevenueData,
  getTopRooms,
};