import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { roomAPI } from "../../services/api";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRooms = async () => {
    try {
      const res = await roomAPI.getAll();
      setRooms(res.data);
    } catch (error) {
      toast.error("Error al cargar habitaciones");
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      setLoading(true);
      await roomAPI.updateStatus(id, status);
      toast.success("Estado actualizado");
      await loadRooms();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al actualizar estado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Gestión de Habitaciones</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div key={room._id} className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
            <div className="space-y-2 mb-4">
              <p className="text-gray-300"><b className="text-gray-400">Habitación:</b> {room.number}</p>
              <p className="text-gray-300"><b className="text-gray-400">Tipo:</b> {room.type}</p>
              <p className="text-gray-300"><b className="text-gray-400">Precio:</b> <span className="text-emerald-400 font-bold">Bs. {room.pricePerNight}</span></p>
              <p className="text-gray-300"><b className="text-gray-400">Estado actual:</b> {room.status}</p>
            </div>

            <select
              disabled={loading}
              className="w-full bg-gray-900 border border-gray-600 text-white p-2.5 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={room.status}
              onChange={(e) => changeStatus(room._id, e.target.value)}
            >
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="sucio">Sucio</option>
              <option value="limpieza">Limpieza</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}