import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cleaningAPI, roomAPI, userAPI } from "../../services/api";

export default function AdminCleaningPage() {
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [roomId, setRoomId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const roomsRes = await roomAPI.getAll();
      const usersRes = await userAPI.getAll();
      const tasksRes = await cleaningAPI.getAll(
        statusFilter ? { status: statusFilter } : {}
      );

      setRooms(roomsRes.data.filter((room) => room.status === "sucio"));
      setEmployees(usersRes.data.filter((user) => user.role === "empleado"));
      setTasks(tasksRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar datos de limpieza");
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

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

  const formatDate = (date) => {
    if (!date) return "No registrado";
    return new Date(date).toLocaleString("es-BO");
  };

  const getDuration = (task) => {
    if (!task.startedAt || !task.completedAt) return "No disponible";

    const start = new Date(task.startedAt);
    const end = new Date(task.completedAt);
    const minutes = Math.round((end - start) / 60000);

    return `${minutes} min`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-5xl font-bold mb-10 text-white text-center">
        Órdenes de Limpieza
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow grid gap-4 max-w-3xl mx-auto mb-10"
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
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name} - {employee.email}
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

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-600 text-white p-3 rounded-lg"
        >
          <option value="">Todas las órdenes</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_progreso">En progreso</option>
          <option value="completada">Completadas</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <p className="text-gray-400">No hay órdenes de limpieza registradas.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Habitación {task.room?.number || "S/N"}
              </h2>

              <p className="text-gray-300">
                <b>Tipo:</b> {task.room?.type || "Sin tipo"}
              </p>

              <p className="text-gray-300">
                <b>Empleado:</b> {task.employee?.name || "Sin empleado"}
              </p>

              <p className="text-gray-300">
                <b>Email:</b> {task.employee?.email || "Sin email"}
              </p>

              <p className="text-gray-300">
                <b>Estado:</b>{" "}
                <span className="text-emerald-400 font-bold">
                  {task.status}
                </span>
              </p>

              <p className="text-gray-300">
                <b>Inicio:</b> {formatDate(task.startedAt)}
              </p>

              <p className="text-gray-300">
                <b>Fin:</b> {formatDate(task.completedAt)}
              </p>

              <p className="text-gray-300">
                <b>Duración:</b> {getDuration(task)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}