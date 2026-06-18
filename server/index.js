const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");

dotenv.config();

const connectDB = require("./config/db");
const startReviewReminderCron = require("./cron/reviewReminder");

const Booking = require("./models/Booking");
const Room = require("./models/Room");

const authRoutes = require("./routes/auth.routes");
const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const cleaningRoutes = require("./routes/cleaning.routes");
const userRoutes = require("./routes/user.routes");
const serviceRoutes = require("./routes/service.routes");
const paymentRoutes = require("./routes/payment.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cleaning", cleaningRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando" });
});

cron.schedule("1 0 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Booking.updateMany(
      {
        status: "confirmada",
        checkIn: { $lte: today },
        checkOut: { $gt: today },
      },
      { $set: { status: "en_curso" } }
    );

    console.log(`Cron check-in: ${result.modifiedCount}`);
  } catch (error) {
    console.error("Error cron check-in:", error);
  }
});

cron.schedule("2 0 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkouts = await Booking.find({
      status: "en_curso",
      checkOut: { $lte: today },
    });

    for (const booking of checkouts) {
      booking.status = "completada";
      await booking.save();

      await Room.findByIdAndUpdate(booking.room, {
        status: "sucio",
      });
    }

    console.log(`Cron check-out: ${checkouts.length}`);
  } catch (error) {
    console.error("Error cron check-out:", error);
  }
});

startReviewReminderCron();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});