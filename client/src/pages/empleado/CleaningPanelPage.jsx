import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  cleaningAPI,
} from "../../services/api";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

export default function CleaningPanelPage() {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadTasks =
    async () => {
      try {
        const response =
          await cleaningAPI.getMyTasks();

        setTasks(
          response.data
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Error al cargar tareas"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStart =
    async (id) => {
      try {
        await cleaningAPI.start(
          id
        );

        toast.success(
          "Limpieza iniciada"
        );

        loadTasks();
      } catch {
        toast.error(
          "Error al iniciar"
        );
      }
    };

  const handleComplete =
    async (id) => {
      try {
        await cleaningAPI.complete(
          id
        );

        toast.success(
          "Limpieza completada"
        );

        loadTasks();
      } catch {
        toast.error(
          "Error al completar"
        );
      }
    };

  if (loading)
    return (
      <LoadingSpinner />
    );

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Panel de Limpieza
      </h1>

      {tasks.length === 0 ? (
        <EmptyState
          message="No tienes tareas asignadas"
        />
      ) : (
        <div className="grid gap-4">

          {tasks.map(
            (task) => (
              <div
                key={task._id}
                className="bg-white shadow rounded-lg p-5"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="font-bold text-lg">
                      Habitación{" "}
                      {
                        task.room
                          ?.number
                      }
                    </h2>

                    <p className="text-gray-600">
                      Tipo:
                      {" "}
                      {
                        task.type
                      }
                    </p>

                    <p className="text-gray-600">
                      Estado:
                      {" "}
                      {
                        task.status
                      }
                    </p>

                  </div>

                  <div>

                    {task.status ===
                      "pendiente" && (
                      <button
                        onClick={() =>
                          handleStart(
                            task._id
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Iniciar Limpieza
                      </button>
                    )}

                    {task.status ===
                      "en_progreso" && (
                      <button
                        onClick={() =>
                          handleComplete(
                            task._id
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Completar Limpieza
                      </button>
                    )}

                    {task.status ===
                      "completada" && (
                      <span className="text-gray-500 font-medium">
                        Completada
                      </span>
                    )}

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}