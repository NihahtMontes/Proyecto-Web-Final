export default function BookingCard({
  booking,
  onCancel,
  onReview,
}) {
  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";

      case "confirmada":
        return "bg-blue-100 text-blue-700";

      case "completada":
        return "bg-green-100 text-green-700";

      case "cancelada":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">

      <div className="flex justify-between items-center mb-3">

        <h3 className="font-bold text-lg">
          Habitación #{booking.roomNumber}
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>

      </div>

      <div className="space-y-2 text-gray-700">

        <p>
          <strong>Check In:</strong>{" "}
          {booking.checkIn}
        </p>

        <p>
          <strong>Check Out:</strong>{" "}
          {booking.checkOut}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          Bs. {booking.totalPrice}
        </p>

      </div>

      <div className="flex gap-2 mt-4">

        {booking.status ===
          "pendiente" && (
          <button
            onClick={() =>
              onCancel(
                booking._id
              )
            }
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cancelar
          </button>
        )}

        {booking.status ===
          "completada" &&
          !booking.review && (
            <button
              onClick={() =>
                onReview(
                  booking
                )
              }
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Calificar
            </button>
          )}

      </div>

    </div>
  );
}