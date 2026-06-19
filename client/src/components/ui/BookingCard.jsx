export default function BookingCard({ booking, payment, onCancel, onReview, onPay }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente": return "bg-yellow-900/50 text-yellow-400 border border-yellow-700";
      case "confirmada": return "bg-blue-900/50 text-blue-400 border border-blue-700";
      case "completada": return "bg-emerald-900/50 text-emerald-400 border border-emerald-700";
      case "cancelada": return "bg-red-900/50 text-red-400 border border-red-700";
      default: return "bg-gray-700 text-gray-300 border border-gray-600";
    }
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case "qr_simple": return "QR Bancario";
      case "tigo_money": return "Tigo Money";
      case "transferencia": return "Transferencia";
      case "efectivo": return "Efectivo";
      default: return "No definido";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Sin fecha";
    return new Date(date).toLocaleDateString("es-BO");
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-white">
          Habitación {booking.room?.number || "S/N"}
        </h3>

        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 text-gray-300">
        <p><strong className="text-gray-400">Tipo:</strong> {booking.room?.type || "Sin tipo"}</p>
        <p><strong className="text-gray-400">Check In:</strong> {formatDate(booking.checkIn)}</p>
        <p><strong className="text-gray-400">Check Out:</strong> {formatDate(booking.checkOut)}</p>
        <p><strong className="text-gray-400">Método de pago:</strong> {getPaymentLabel(booking.paymentMethod)}</p>

        <p>
          <strong className="text-gray-400">Estado pago:</strong>{" "}
          <span className={payment?.status === "verificado" ? "text-emerald-400" : "text-yellow-400"}>
            {payment?.status || "pendiente"}
          </span>
        </p>

        {payment?.comprobante && (
          <p>
            <strong className="text-gray-400">Comprobante:</strong>{" "}
            <a
              href={payment.comprobante}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              Ver comprobante
            </a>
          </p>
        )}

        <p>
          <strong className="text-gray-400">Total:</strong>{" "}
          <span className="text-emerald-400 font-bold">Bs. {booking.totalPrice}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {booking.status === "pendiente" && (
          <>
            <button
              onClick={() => onPay(booking)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Ver pago
            </button>

            <button
              onClick={() => onCancel(booking._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Cancelar
            </button>
          </>
        )}

        {booking.status === "completada" && !booking.review && (
          <button
            onClick={() => onReview(booking)}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500"
          >
            Calificar
          </button>
        )}
      </div>
    </div>
  );
}