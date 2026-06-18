import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { serviceAPI } from "../../services/api";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const loadServices = async () => {
    try {
      const res = await serviceAPI.getAll();
      setServices(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await serviceAPI.create(form);

      toast.success("Servicio creado");

      setForm({
        name: "",
        description: "",
        price: "",
      });

      loadServices();
    } catch (error) {
      toast.error("Error al crear servicio");
    }
  };

  const handleDelete = async (id) => {
    try {
      await serviceAPI.delete(id);

      toast.success("Servicio eliminado");

      loadServices();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Gestión de Servicios
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 grid gap-4 max-w-xl"
      >
        <input
          className="border p-3 rounded"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <textarea
          className="border p-3 rounded"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="border p-3 rounded"
          placeholder="Precio"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        <button className="bg-blue-600 text-white py-3 rounded">
          Crear Servicio
        </button>
      </form>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <h3 className="font-bold">
                {service.name}
              </h3>

              <p>
                {service.description}
              </p>

              <p>
                Bs. {service.price}
              </p>
            </div>

            <button
              onClick={() =>
                handleDelete(service._id)
              }
              className="text-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}