import { useEffect, useState } from "react";
import { serviceAPI } from "../../services/api";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  description: "",
  price: "",
  icon: "",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    try {
      const res = await serviceAPI.getAll();
      setServices(res.data);
    } catch {
      toast.error("Error al cargar servicios");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateForm = () => {
    setEditingService(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      icon: service.icon || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Nombre y precio son obligatorios");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        icon: formData.icon,
      };

      if (editingService) {
        await serviceAPI.update(editingService._id, payload);
        toast.success("Servicio actualizado");
      } else {
        await serviceAPI.create(payload);
        toast.success("Servicio creado");
      }

      closeForm();
      await loadServices();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al guardar servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white">Servicios Extra</h1>

        <button
          onClick={openCreateForm}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded transition"
        >
          + Nuevo Servicio
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 border border-gray-700 p-6 rounded-xl mb-8 grid gap-4"
        >
          <h2 className="text-2xl font-bold text-white">
            {editingService ? "Editar Servicio" : "Nuevo Servicio"}
          </h2>

          <input
            type="text"
            placeholder="Nombre del servicio"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-gray-900 border border-gray-600 text-white p-3 rounded"
          />

          <textarea
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="bg-gray-900 border border-gray-600 text-white p-3 rounded"
          />

          <input
            type="number"
            placeholder="Precio"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="bg-gray-900 border border-gray-600 text-white p-3 rounded"
          />

          <input
            type="text"
            placeholder="Icono. Ej: car, heart, wifi"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="bg-gray-900 border border-gray-600 text-white p-3 rounded"
          />

          <div className="flex gap-3">
            <button
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-gray-800 border border-gray-700 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-white">{s.name}</h3>
              <p className="text-sm text-gray-400">
                {s.description || "Sin descripción"}
              </p>
              <p className="text-sm text-gray-500">Icono: {s.icon || "N/A"}</p>
            </div>

            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <p className="text-lg font-black text-emerald-400">
                Bs. {s.price}
              </p>

              <button
                onClick={() => openEditForm(s)}
                className="text-white px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}