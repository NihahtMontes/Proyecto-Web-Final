import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { roomAPI } from "../../services/api";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);

  const loadRooms = async () => {
    const res = await roomAPI.getAll();
    setRooms(res.data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const changeStatus = async (id, status) => {
    await roomAPI.updateStatus(id, status);
    toast.success("Estado actualizado");
    loadRooms();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Habitaciones</h1>

      <div className="grid gap-4">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white p-5 rounded-xl shadow">
            <p><b>Habitación:</b> {room.number}</p>
            <p><b>Tipo:</b> {room.type}</p>
            <p><b>Precio:</b> Bs. {room.pricePerNight}</p>
            <p><b>Estado:</b> {room.status}</p>

            <select
              className="border p-2 rounded mt-3"
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