import { useState } from "react";
import toast from "react-hot-toast";
import { cleaningAPI } from "../../services/api";

export default function AdminCleaningPage() {
  const [roomNumber, setRoomNumber] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await cleaningAPI.create({
        roomNumber,
        employeeEmail,
        instructions,
      });

      toast.success("Orden de limpieza creada");
      setRoomNumber("");
      setEmployeeEmail("");
      setInstructions("");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error al crear orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Órdenes de Limpieza</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="mb-4">Asignar limpieza a empleado.</p>

        <form onSubmit={handleCreate} className="grid gap-4 max-w-md">
          <input
            className="border p-3 rounded"
            placeholder="Habitación ej: 101"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />

          <input
            className="border p-3 rounded"
            placeholder="Empleado ej: empleado@bytehotel.com"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            required
          />

          <textarea
            className="border p-3 rounded"
            placeholder="Instrucciones"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear orden de limpieza"}
          </button>
        </form>
      </div>
    </div>
  );
}