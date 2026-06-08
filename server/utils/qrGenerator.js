const QRCode = require('qrcode');

const generateBCBQR = async (paymentData) => {
  // Formato oficial BCB: BCB|NIT|FACTURA|AUTORIZACION|FECHA|MONTO|TOTAL|HASH
  // Adaptado a la estructura del README de ByteHotel
  const qrText = [
    'BCB',
    process.env.BANK_NIT,
    paymentData.bookingId, // Usamos el ID de reserva como referencia
    paymentData.amount.toFixed(2), // Monto con dos decimales
    new Date().toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
    process.env.BANK_ACCOUNT_NUMBER,
    process.env.BANK_ACCOUNT_HOLDER,
    'BOB'
  ].join('|');

  // Convierte el texto en una Data URL (imagen base64)
  const qrDataURL = await QRCode.toDataURL(qrText);
  return { qrText, qrDataURL };
};

module.exports = { generateBCBQR };