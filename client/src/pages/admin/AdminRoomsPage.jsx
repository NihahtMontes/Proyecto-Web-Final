import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { roomAPI } from "../../services/api";

const initialForm = {
  number: "",
  type: "estándar",
  pricePerNight: "",
  capacity: 2,
  description: "",
  status: "disponible",
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadRooms = async () => {
    try {
      const res = await roomAPI.getAll();
      setRooms(res.data);
    } catch {
      toast.error("Error al cargar habitaciones");
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingRoom(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingRoom) {
        await roomAPI.update(editingRoom._id, form);
        toast.success("Habitación actualizada");
      } else {
        await roomAPI.create(form);
        toast.success("Habitación creada");
      }

      resetForm();
      loadRooms();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error al guardar habitación"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);

    setForm({
      number: room.number,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      description: room.description || "",
      status: room.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar habitación?")) return;

    try {
      await roomAPI.delete(id);
      toast.success("Habitación eliminada");
      loadRooms();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error al eliminar habitación"
      );
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await roomAPI.updateStatus(id, status);
      toast.success("Estado actualizado");
      loadRooms();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error al actualizar estado"
      );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Gestión de Habitaciones
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8"
      >
        <h2 className="text-2xl text-white font-bold mb-4">
          {editingRoom ? "Editar Habitación" : "Nueva Habitación"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Número"
            value={form.number}
            onChange={(e) =>
              setForm({ ...form, number: Number(e.target.value) })
            }
            className="bg-gray-900 text-white p-3 rounded"
            required
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="bg-gray-900 text-white p-3 rounded"
          >
            <option value="estándar">Estándar</option>
            <option value="suite">Suite</option>
            <option value="premium">Premium</option>
          </select>

          <input
            type="number"
            placeholder="Precio"
            value={form.pricePerNight}
            onChange={(e) =>
              setForm({
                ...form,
                pricePerNight: Number(e.target.value),
              })
            }
            className="bg-gray-900 text-white p-3 rounded"
            required
          />

          <input
            type="number"
            placeholder="Capacidad"
            value={form.capacity}
            onChange={(e) =>
              setForm({
                ...form,
                capacity: Number(e.target.value),
              })
            }
            className="bg-gray-900 text-white p-3 rounded"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="bg-gray-900 text-white p-3 rounded"
          >
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
            <option value="sucio">Sucio</option>
            <option value="limpieza">Limpieza</option>
          </select>

          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="bg-gray-900 text-white p-3 rounded"
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded"
          >
            {editingRoom ? "Actualizar" : "Crear"}
          </button>

          {editingRoom && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-gray-800 border border-gray-700 p-6 rounded-xl"
          >
            <p className="text-white">
              <b>Habitación:</b> {room.number}
            </p>

            <p className="text-white">
              <b>Tipo:</b> {room.type}
            </p>

            <p className="text-emerald-400 font-bold">
              Bs. {room.pricePerNight}
            </p>

            <p className="text-white">
              <b>Capacidad:</b> {room.capacity}
            </p>

            <p className="text-white">
              <b>Estado:</b> {room.status}
            </p>

            <select
              className="w-full mt-3 bg-gray-900 text-white p-2 rounded"
              value={room.status}
              onChange={(e) =>
                changeStatus(room._id, e.target.value)
              }
            >
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="sucio">Sucio</option>
              <option value="limpieza">Limpieza</option>
            </select>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(room)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(room._id)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}