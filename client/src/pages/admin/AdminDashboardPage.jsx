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
      <h1 className="text-3xl font-bold mb-6">Panel Administrador</h1>

      {summary && (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <p>Reservas</p>
            <h2 className="text-3xl font-bold">{summary.totalBookings}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p>Habitaciones</p>
            <h2 className="text-3xl font-bold">{summary.totalRooms}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p>Clientes</p>
            <h2 className="text-3xl font-bold">{summary.totalUsers}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p>Ingresos</p>
            <h2 className="text-3xl font-bold">Bs. {summary.totalRevenue}</h2>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg border"
          >
            <h2 className="text-xl font-bold text-blue-600">{card.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}