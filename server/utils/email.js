const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (userEmail, booking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Reserva Confirmada - ByteHotel",
      html: `
        <h2>Reserva Confirmada</h2>
        <p>Gracias por reservar en ByteHotel.</p>
        <p><b>Check In:</b> ${new Date(booking.checkIn).toLocaleDateString()}</p>
        <p><b>Check Out:</b> ${new Date(booking.checkOut).toLocaleDateString()}</p>
        <p><b>Total:</b> Bs. ${booking.totalPrice}</p>
      `,
    });
  } catch (error) {
    console.error("Error enviando confirmación:", error);
  }
};

const sendCheckInReminder = async (userEmail, booking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Recordatorio de Check In",
      html: `
        <h2>Tu estadía está por comenzar</h2>
        <p>Te esperamos mañana en ByteHotel.</p>
        <p>Habitación: ${booking.room?.number || ""}</p>
      `,
    });
  } catch (error) {
    console.error("Error enviando recordatorio:", error);
  }
};

const sendCheckOutReminder = async (userEmail, booking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Recordatorio de Check Out",
      html: `
        <h2>Tu salida es mañana</h2>
        <p>Gracias por hospedarte en ByteHotel.</p>
      `,
    });
  } catch (error) {
    console.error("Error enviando recordatorio:", error);
  }
};

const sendReviewInvitation = async (userEmail, booking) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "¿Cómo fue tu experiencia?",
      html: `
        <h2>Queremos conocer tu opinión</h2>
        <p>Déjanos una reseña sobre tu estadía en ByteHotel.</p>
      `,
    });
  } catch (error) {
    console.error("Error enviando invitación a reseña:", error);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCheckInReminder,
  sendCheckOutReminder,
  sendReviewInvitation,
};