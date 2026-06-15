const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambiar si deciden usar Outlook u otro
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Confirmación de Reserva - ByteHotel',
      text: `Tu reserva ha sido confirmada. Detalles: ${JSON.stringify(bookingDetails)}`,
      // Aquí más adelante puedes armar un HTML bonito
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando el correo de confirmación:', error);
  }
};

const sendCheckInReminder = async (userEmail, bookingDetails) => {
  // Lógica similar para el recordatorio de check-in
};

const sendCheckOutReminder = async (userEmail, bookingDetails) => {
  // Lógica similar para el recordatorio de check-out
};

const sendReviewInvitation = async (userEmail, bookingDetails) => {
  // Lógica similar para pedir calificación al terminar
};

module.exports = {
  sendBookingConfirmation,
  sendCheckInReminder,
  sendCheckOutReminder,
  sendReviewInvitation
};