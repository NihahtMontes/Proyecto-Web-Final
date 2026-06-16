import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CleaningPanelPage() {
  const [tasks, setTasks] =
    useState([
      {
        _id: 1,
        roomNumber: "101",
        type: "Limpieza General",
        status: "pendiente",
      },
      {
        _id: 2,
        roomNumber: "203",
        type: "Cambio de Sábanas",
        status: "en_progreso",
      },
      {
        _id: 3,
        roomNumber: "305",
        type: "Limpieza Profunda",
        status: "completada",
      },
    ]);

  const startCleaning = (
    id
  ) => {
    const updated =
      tasks.map((task) =>
        task._id === id
          ? {
              ...task,
              status:
                "en_progreso",
            }
          : task
      );

    setTasks(updated);

    toast.success(
      "Limpieza iniciada"
    );
  };

  const completeCleaning =
    (id) => {
      const updated =
        tasks.map((task) =>
          task._id === id
            ? {
                ...task,
                status:
                  "completada",
              }
            : task
        );

      setTasks(updated);

      toast.success(
        "Limpieza completada"
      );
    };

  const getStatusBadge =
    (status) => {
      switch (status) {
        case "pendiente":
          return "bg-yellow-100 text-yellow-700";

        case "en_progreso":
          return "bg-blue-100 text-blue-700";

        case "completada":
          return "bg-green-100 text-green-700";

        default:
          return "bg-gray-100 text-gray-700";
      }
    };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Panel de Limpieza
      </h1>

      <div className="grid gap-4">

        {tasks.map((task) => (

          <div
            key={task._id}
            className="bg-white rounded-lg shadow p-5"
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-xl font-semibold">
                  Habitación {task.roomNumber}
                </h2>

                <p className="text-gray-600">
                  {task.type}
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
                  task.status
                )}`}
              >
                {task.status}
              </span>

            </div>

            <div className="mt-4">

              {task.status ===
                "pendiente" && (

                <button
                  onClick={() =>
                    startCleaning(
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
                    completeCleaning(
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
                  ✔ Completada
                </span>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
