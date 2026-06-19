import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cleaningAPI, roomAPI, userAPI } from "../../services/api";

export default function AdminCleaningPage() {
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const roomsRes = await roomAPI.getAll();
    const usersRes = await userAPI.getAll();

    setRooms(roomsRes.data.filter((r) => r.status === "sucio"));
    setEmployees(usersRes.data.filter((u) => u.role === "empleado"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomId || !employeeId) {
      toast.error("Selecciona habitación y empleado");
      return;
    }

    try {
      setLoading(true);

      await cleaningAPI.assign({ roomId, employeeId });

      toast.success("Orden de limpieza creada");
      setRoomId("");
      setEmployeeId("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al crear orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-black mb-8 text-white">
        Órdenes de Limpieza
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow grid gap-4 max-w-xl"
      >
        <select
          className="bg-gray-900 border border-gray-600 text-white p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        >
          <option value="">Seleccionar habitación sucia</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              Habitación {room.number} - {room.type}
            </option>
          ))}
        </select>

        <select
          className="bg-gray-900 border border-gray-600 text-white p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          <option value="">Seleccionar empleado</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} - {emp.email}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Creando..." : "Crear orden de limpieza"}
        </button>
      </form>

      {rooms.length === 0 && (
        <p className="text-gray-400 mt-5">
          No hay habitaciones con estado sucio.
        </p>
      )}
    </div>
  );
}