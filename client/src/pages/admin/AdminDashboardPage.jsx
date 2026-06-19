import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardAPI } from "../../services/api";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [occupancy, setOccupancy] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [topRooms, setTopRooms] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const [summaryRes, occupancyRes, revenueRes, topRoomsRes] =
        await Promise.all([
          dashboardAPI.getSummary(),
          dashboardAPI.getOccupancy(),
          dashboardAPI.getRevenue(),
          dashboardAPI.getTopRooms(),
        ]);

      setSummary(summaryRes.data);
      setOccupancy(occupancyRes.data);
      setRevenue(revenueRes.data);
      setTopRooms(topRoomsRes.data);
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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-10 text-white text-center">
        Panel Administrador
      </h1>

      {summary && (
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <Stat title="Reservas" value={summary.totalBookings} />
          <Stat title="Activas" value={summary.activeBookings} />
          <Stat title="Habitaciones" value={summary.totalRooms} />
          <Stat title="Clientes" value={summary.totalUsers} />
          <Stat title="Ocupación" value={`${summary.occupancyRate}%`} />
          <Stat title="Ingresos mes" value={`Bs. ${summary.monthlyRevenue}`} />
          <Stat title="Ingresos total" value={`Bs. ${summary.totalRevenue}`} />
          <Stat title="Calificación" value={`${summary.averageRating} ⭐`} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <Box title="Ocupación por tipo">
          {occupancy.map((item) => (
            <Bar
              key={item.type}
              label={item.type}
              value={item.percentage}
              text={`${item.occupied}/${item.total}`}
            />
          ))}
        </Box>

        <Box title="Ingresos últimos meses">
          {revenue.map((item) => (
            <Bar
              key={`${item._id.year}-${item._id.month}`}
              label={`${item._id.month}/${item._id.year}`}
              value={Math.min(item.total / 100, 100)}
              text={`Bs. ${item.total}`}
            />
          ))}
        </Box>

        <Box title="Top habitaciones">
          {topRooms.map((item) => (
            <Bar
              key={item._id}
              label={`Hab. ${item.room?.number}`}
              value={Math.min(item.count * 20, 100)}
              text={`${item.count} reservas`}
            />
          ))}
        </Box>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="bg-gray-800 p-8 rounded-xl shadow border border-gray-700 hover:border-emerald-500 text-center"
          >
            <h2 className="text-2xl font-bold text-white">{card.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl text-center">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-3xl font-black text-emerald-400">{value}</h2>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Bar({ label, value, text }) {
  return (
    <div>
      <div className="flex justify-between text-gray-300 mb-1">
        <span>{label}</span>
        <span>{text}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-emerald-500 h-3 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}