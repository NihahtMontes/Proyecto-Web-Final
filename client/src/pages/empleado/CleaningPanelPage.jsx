import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cleaningAPI } from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

export default function CleaningPanelPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const response = await cleaningAPI.getMyTasks();
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStart = async (id) => {
    try {
      await cleaningAPI.start(id);
      toast.success("Limpieza iniciada");
      loadTasks();
    } catch {
      toast.error("Error al iniciar");
    }
  };

  const handleComplete = async (id) => {
    try {
      await cleaningAPI.complete(id);
      toast.success("Limpieza completada");
      loadTasks();
    } catch {
      toast.error("Error al completar");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-5xl font-bold text-white text-center mb-10">
        Panel de Limpieza
      </h1>

      {tasks.length === 0 ? (
        <EmptyState message="No tienes tareas asignadas" />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 border border-gray-700 shadow rounded-xl p-6"
            >
              <div className="flex justify-between gap-4 items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Habitación {task.room?.number || "S/N"}
                  </h2>

                  <p className="text-gray-300">
                    <b>Tipo:</b> {task.room?.type || "Sin tipo"}
                  </p>

                  <p className="text-gray-300">
                    <b>Estado:</b> {task.status}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    task.status === "pendiente"
                      ? "bg-yellow-900 text-yellow-300"
                      : task.status === "en_progreso"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-green-900 text-green-300"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="mt-5">
                {task.status === "pendiente" && (
                  <button
                    onClick={() => handleStart(task._id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded"
                  >
                    Iniciar Limpieza
                  </button>
                )}

                {task.status === "en_progreso" && (
                  <button
                    onClick={() => handleComplete(task._id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded"
                  >
                    Completar Limpieza
                  </button>
                )}

                {task.status === "completada" && (
                  <p className="text-green-400 font-bold">✓ Completada</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}