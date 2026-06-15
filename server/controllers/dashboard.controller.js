const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'cliente' });
    
    const availableRooms = await Room.countDocuments({ status: 'disponible' });
    const occupiedRooms = await Room.countDocuments({ status: 'ocupada' });
    const dirtyRooms = await Room.countDocuments({ status: 'sucio' });

    res.json({
      totalBookings,
      totalRooms,
      totalUsers,
      roomStats: {
        available: availableRooms,
        occupied: occupiedRooms,
        dirty: dirtyRooms
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo estadísticas del dashboard', error: error.message });
  }
};

module.exports = { getDashboardStats };