import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/ui/RoomCard";
import { roomAPI } from "../../services/api";

export default function RoomsPage() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      const res = await roomAPI.getAll();
      setRooms(res.data);
    };

    loadRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const typeOk = !typeFilter || room.type === typeFilter;
    const capacityOk = !capacityFilter || room.capacity >= Number(capacityFilter);
    const minOk = !minPrice || room.pricePerNight >= Number(minPrice);
    const maxOk = !maxPrice || room.pricePerNight <= Number(maxPrice);

    return typeOk && capacityOk && minOk && maxOk;
  });

  const handleViewRoom = (room) => {
    navigate(`/habitaciones/${room._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Habitaciones</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Filtros</h2>

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full border p-2 rounded mb-3">
            <option value="">Todos los tipos</option>
            {[...new Set(rooms.map((r) => r.type))].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input type="number" placeholder="Capacidad mínima" value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} className="w-full border p-2 rounded mb-3" />
          <input type="number" placeholder="Precio mínimo" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border p-2 rounded mb-3" />
          <input type="number" placeholder="Precio máximo" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} onClick={handleViewRoom} />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow text-center mt-6">
              <p className="text-gray-500">No se encontraron habitaciones.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}