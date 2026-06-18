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
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando el correo de confirmación:', error);
  }
};

const sendCheckInReminder = async (userEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Recordatorio de Check-In - ByteHotel',
      text: `Hola. Te recordamos que tu fecha de ingreso está cerca. Detalles de tu estadía: ${JSON.stringify(bookingDetails)}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando el recordatorio de check-in:', error);
  }
};

const sendCheckOutReminder = async (userEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Recordatorio de Check-Out - ByteHotel',
      text: `Hola. Te recordamos que tu fecha de salida se cumple hoy. Por favor coordina tu salida. Detalles: ${JSON.stringify(bookingDetails)}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando el recordatorio de check-out:', error);
  }
};

const sendReviewInvitation = async (userEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '¡Cuéntanos tu experiencia! - ByteHotel',
      text: `Gracias por hospedarte en ByteHotel. Nos encantaría recibir tu opinión sobre tu estadía. Detalles: ${JSON.stringify(bookingDetails)}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando la invitación de reseña:', error);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCheckInReminder,
  sendCheckOutReminder,
  sendReviewInvitation
};