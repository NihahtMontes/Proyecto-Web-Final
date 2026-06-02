const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');

// Configurar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// =========================
// Rutas que implementará Erick
// =========================

// const roomRoutes = require('./routes/room.routes');
// app.use('/api/rooms', roomRoutes);

// const bookingRoutes = require('./routes/booking.routes');
// app.use('/api/bookings', bookingRoutes);

// const cleaningRoutes = require('./routes/cleaning.routes');
// app.use('/api/cleaning', cleaningRoutes);

// const userRoutes = require('./routes/user.routes');
// app.use('/api/users', userRoutes);

// const serviceRoutes = require('./routes/service.routes');
// app.use('/api/services', serviceRoutes);

// const paymentRoutes = require('./routes/payment.routes');
// app.use('/api/payments', paymentRoutes);

// const dashboardRoutes = require('./routes/dashboard.routes');
// app.use('/api/dashboard', dashboardRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API funcionando'
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});