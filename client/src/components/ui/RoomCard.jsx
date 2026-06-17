export default function RoomCard({ room, onClick }) {
  const image = room?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img src={image} alt={`Habitación ${room?.number}`} className="h-48 w-full object-cover" />

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">
          Habitación {room?.number || "S/N"}
        </h3>

        <p className="text-sm text-gray-500 mt-1">{room?.type || "Estándar"}</p>

        <div className="mt-3 text-gray-700 space-y-1">
          <p>Capacidad: {room?.capacity || 1} personas</p>
          <p className="font-bold text-blue-600">
            Bs. {room?.pricePerNight || 0}/noche
          </p>
          <p>Estado: {room?.status || "disponible"}</p>
        </div>

        <button
          type="button"
          onClick={() => onClick?.(room)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}