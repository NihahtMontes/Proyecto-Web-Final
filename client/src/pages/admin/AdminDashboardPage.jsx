import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardAPI } from "../../services/api";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await dashboardAPI.getSummary();
      setSummary(res.data);
    };
    loadDashboard();
  }, []);

  const cards = [
    { title: "Habitaciones", path: "/admin/rooms" },
    { title: "Reservas", path: "/admin/bookings" },
    { title: "Usuarios", path: "/admin/users" },
    { title: "Servicios", path: "/admin/services" },
    { title: "Limpieza", path: "/admin/cleaning" },
    { title: "Pagos", path: "/admin/payments" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Panel Administrador</h1>

      {summary && (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow text-center">
            <p className="text-gray-400 mb-1">Reservas</p>
            <h2 className="text-4xl font-black text-emerald-400">{summary.totalBookings}</h2>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow text-center">
            <p className="text-gray-400 mb-1">Habitaciones</p>
            <h2 className="text-4xl font-black text-emerald-400">{summary.totalRooms}</h2>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow text-center">
            <p className="text-gray-400 mb-1">Clientes</p>
            <h2 className="text-4xl font-black text-emerald-400">{summary.totalUsers}</h2>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow text-center">
            <p className="text-gray-400 mb-1">Ingresos</p>
            <h2 className="text-3xl font-black text-emerald-400">Bs. {summary.totalRevenue}</h2>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700 hover:border-emerald-500 hover:shadow-emerald-900/30 transition-all text-center group"
          >
            <h2 className="text-xl font-bold text-gray-300 group-hover:text-emerald-400 transition-colors">{card.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}