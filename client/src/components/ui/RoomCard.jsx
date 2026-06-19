export default function RoomCard({ room, onClick }) {
  const image = room?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945";

  return (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:shadow-emerald-900/20 border border-gray-700 transition">
      <img src={image} alt={`Habitación ${room?.number}`} className="h-48 w-full object-cover" />

      <div className="p-5">
        <h3 className="text-xl font-bold text-white">
          Habitación {room?.number || "S/N"}
        </h3>

        <p className="text-sm text-gray-400 mt-1">{room?.type || "Estándar"}</p>

        <div className="mt-3 text-gray-300 space-y-1">
          <p>Capacidad: {room?.capacity || 1} personas</p>
          <p className="font-bold text-emerald-400">
            Bs. {room?.pricePerNight || 0}/noche
          </p>
          <p>Estado: {room?.status || "disponible"}</p>
        </div>

        <button
          type="button"
          onClick={() => onClick?.(room)}
          className="mt-4 w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-500 transition"
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}