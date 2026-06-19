import { useEffect, useState } from "react";
import { roomAPI } from "../../services/api";
import RoomCard from "../../components/ui/RoomCard";
import toast from "react-hot-toast";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const res = await roomAPI.getAll();
      setRooms(res.data);
    } catch (error) {
      toast.error("Error al cargar habitaciones");
    } finally {
      setLoading(false);
    }
  };

  // Lógica de filtrado
  const filteredRooms = rooms.filter(room => {
    if (filterType && room.type.toLowerCase() !== filterType.toLowerCase()) return false;
    if (filterPrice) {
      if (filterPrice === "low" && room.pricePerNight > 200) return false;
      if (filterPrice === "high" && room.pricePerNight <= 200) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-3xl font-black text-white mb-6">Nuestras Habitaciones</h1>

      {/* Barra de Filtros Horizontal */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center shadow-lg">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-emerald-400 font-bold">Filtrar por:</span>
        </div>
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full md:w-auto bg-gray-900 border border-gray-600 text-white p-2.5 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="">Cualquier Tipo</option>
          <option value="simple">Simple</option>
          <option value="doble">Doble</option>
          <option value="suite">Suite</option>
        </select>

        <select 
          value={filterPrice} 
          onChange={(e) => setFilterPrice(e.target.value)}
          className="w-full md:w-auto bg-gray-900 border border-gray-600 text-white p-2.5 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="">Cualquier Precio</option>
          <option value="low">Económicas (Menos de Bs. 200)</option>
          <option value="high">Premium (Más de Bs. 200)</option>
        </select>

        <button 
          onClick={() => { setFilterType(""); setFilterPrice(""); }}
          className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded transition"
        >
          Limpiar Filtros
        </button>
      </div>

      {loading ? (
        <div className="text-center text-emerald-400 py-10">Cargando habitaciones...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-10">No se encontraron habitaciones con esos filtros.</p>
          )}
        </div>
      )}
    </div>
  );
}