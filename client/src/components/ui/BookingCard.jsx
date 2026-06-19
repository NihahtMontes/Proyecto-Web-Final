export default function BookingCard({ booking, onCancel, onReview }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente": return "bg-yellow-900/50 text-yellow-400 border border-yellow-700";
      case "confirmada": return "bg-blue-900/50 text-blue-400 border border-blue-700";
      case "completada": return "bg-emerald-900/50 text-emerald-400 border border-emerald-700";
      case "cancelada": return "bg-red-900/50 text-red-400 border border-red-700";
      default: return "bg-gray-700 text-gray-300 border border-gray-600";
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-white">
          Habitación #{booking.roomNumber}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 text-gray-300">
        <p><strong className="text-gray-400">Check In:</strong> {booking.checkIn}</p>
        <p><strong className="text-gray-400">Check Out:</strong> {booking.checkOut}</p>
        <p><strong className="text-gray-400">Total:</strong> <span className="text-emerald-400 font-bold">Bs. {booking.totalPrice}</span></p>
      </div>

      <div className="flex gap-2 mt-4">
        {booking.status === "pendiente" && (
          <button onClick={() => onCancel(booking._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition">
            Cancelar
          </button>
        )}
        {booking.status === "completada" && !booking.review && (
          <button onClick={() => onReview(booking)} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500 transition">
            Calificar
          </button>
        )}
      </div>
    </div>
  );
}