import { useEffect, useState } from "react";
import { serviceAPI } from "../../services/api";
import toast from "react-hot-toast";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await serviceAPI.getAll();
      setServices(res.data);
    } catch (error) {
      toast.error("Error al cargar servicios");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Servicios Extra</h1>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded transition shadow-lg">
          + Nuevo Servicio
        </button>
      </div>

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s._id} className="bg-gray-800 border border-gray-700 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center shadow hover:shadow-emerald-900/20 transition">
            <div className="flex-1 text-center sm:text-left mb-4 sm:mb-0">
              <h3 className="text-xl font-bold text-white">{s.name}</h3>
              <p className="text-sm text-gray-400">{s.description || "Sin descripción"}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Precio</p>
                <p className="text-lg font-black text-emerald-400">Bs. {s.price}</p>
              </div>
              <button className="text-gray-400 hover:text-white px-3 py-1 bg-gray-700 rounded transition">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}