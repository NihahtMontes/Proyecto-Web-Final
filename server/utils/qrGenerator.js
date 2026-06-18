const QRCode = require("qrcode");

const generateBCBQR = async (paymentData = {}) => {
  const bookingId = paymentData.bookingId || "";
  const amount = Number(paymentData.amount || 0);

  if (!bookingId) {
    throw new Error("bookingId requerido para generar QR");
  }

  if (!amount || amount <= 0) {
    throw new Error("Monto inválido para generar QR");
  }

  const qrText = [
    "BCB",
    process.env.BANK_NIT || "",
    bookingId,
    amount.toFixed(2),
    new Date().toISOString().split("T")[0],
    process.env.BANK_ACCOUNT_NUMBER || "",
    process.env.BANK_ACCOUNT_HOLDER || "",
    "BOB",
  ].join("|");

  const qrDataURL = await QRCode.toDataURL(qrText);

  return { qrText, qrDataURL };
};

module.exports = { generateBCBQR };