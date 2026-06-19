import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomAPI } from "../../services/api";
import RoomCard from "../../components/ui/RoomCard";
import toast from "react-hot-toast";

export default function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const res = await roomAPI.getAll();

      const availableRooms = res.data.filter(
        (room) => room.status === "disponible"
      );

      setRooms(availableRooms);
    } catch {
      toast.error("Error al cargar habitaciones");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filterType && room.type?.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }

    if (filterPrice === "low" && room.pricePerNight > 200) return false;
    if (filterPrice === "high" && room.pricePerNight <= 200) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-5xl font-black text-white text-center mb-10">
        Nuestras Habitaciones
      </h1>

      <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center shadow-lg">
        <span className="text-emerald-400 font-bold">Filtrar por:</span>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full md:w-auto bg-gray-900 border border-gray-600 text-white p-2.5 rounded"
        >
          <option value="">Cualquier Tipo</option>
          <option value="estándar">Estándar</option>
          <option value="simple">Simple</option>
          <option value="doble">Doble</option>
          <option value="suite">Suite</option>
        </select>

        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="w-full md:w-auto bg-gray-900 border border-gray-600 text-white p-2.5 rounded"
        >
          <option value="">Cualquier Precio</option>
          <option value="low">Económicas menos de Bs. 200</option>
          <option value="high">Premium más de Bs. 200</option>
        </select>

        <button
          onClick={() => {
            setFilterType("");
            setFilterPrice("");
          }}
          className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded"
        >
          Limpiar Filtros
        </button>
      </div>

      {loading ? (
        <div className="text-center text-emerald-400 py-10">
          Cargando habitaciones...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onClick={() => navigate(`/habitaciones/${room._id}`)}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-10">
              No hay habitaciones disponibles.
            </p>
          )}
        </div>
      )}
    </div>
  );
}