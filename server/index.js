const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron'); // Importación de node-cron para tareas automáticas

const connectDB = require('./config/db');

// Modelos necesarios para las tareas programadas
const Booking = require('./models/Booking');
const Room = require('./models/Room');

// =========================
// Importación de Rutas
// =========================
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const cleaningRoutes = require('./routes/cleaning.routes');
const userRoutes = require('./routes/user.routes');
const serviceRoutes = require('./routes/service.routes');
const paymentRoutes = require('./routes/payment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Configurar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// =========================
// Montaje de Rutas
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cleaning', cleaningRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API funcionando'
  });
});

// =========================
// Tareas Programadas (Cron Jobs)
// =========================

// Cada día a las 00:01 - Auto check-in (Cambia reservas 'confirmada' a 'en_curso')
cron.schedule('1 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Booking.updateMany(
      { status: 'confirmada', checkIn: { $lte: today }, checkOut: { $gt: today } },
      { $set: { status: 'en_curso' } }
    );
    console.log(`Cron: Check-in automático ejecutado. Reservas actualizadas: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error en Cron Check-in:', error);
  }
});

// Cada día a las 00:02 - Auto check-out (Cambia reservas 'en_curso' a 'completada' y ensucia la habitación)
cron.schedule('2 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkouts = await Booking.find({ status: 'en_curso', checkOut: { $lte: today } });
    
    for (const booking of checkouts) {
      booking.status = 'completada';
      await booking.save();
      
      // La habitación pasa a estado sucio para que el empleado la vea en su panel
      await Room.findByIdAndUpdate(booking.room, { status: 'sucio' });
    }
    console.log(`Cron: Check-out automático ejecutado. Habitaciones liberadas: ${checkouts.length}`);
  } catch (error) {
    console.error('Error en Cron Check-out:', error);
  }
});

// =========================
// Inicialización del Servidor
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});