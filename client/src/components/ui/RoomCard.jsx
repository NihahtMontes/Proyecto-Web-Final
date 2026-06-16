export default function RoomCard({
  room,
  onClick,
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">

      <img
        src={
          room.image ||
          "https://placehold.co/600x400"
        }
        alt={room.number}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">

        <div className="flex justify-between items-center mb-2">

          <h3 className="font-bold text-lg">
            Habitación {room.number}
          </h3>

          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
            {room.type}
          </span>

        </div>

        <p className="text-gray-600 mb-2">
          Capacidad: {room.capacity} personas
        </p>

        <p className="text-xl font-bold text-green-600 mb-3">
          Bs. {room.pricePerNight}/noche
        </p>

        <span
          className={`inline-block px-2 py-1 rounded text-sm mb-3 ${
            room.status === "available"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {room.status}
        </span>

        <button
          onClick={() => onClick(room)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ver detalle
        </button>

      </div>

    </div>
  );
}