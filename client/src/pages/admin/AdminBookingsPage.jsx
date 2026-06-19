import { useEffect, useState } from "react";
import { bookingAPI } from "../../services/api";
import toast from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await bookingAPI.getAll();
      setBookings(res.data);
    } catch (error) {
      toast.error("Error al cargar reservas");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      toast.success("Estado actualizado");
      loadBookings();
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Control de Reservas</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700 text-emerald-400 uppercase text-sm">
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Habitación</th>
              <th className="p-4 font-semibold">Check-In</th>
              <th className="p-4 font-semibold">Check-Out</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold text-center">Estado / Acción</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                <td className="p-4 font-medium text-white">{b.user?.name || "N/A"}</td>
                <td className="p-4">#{b.room?.number || b.room}</td>
                <td className="p-4">{new Date(b.checkIn).toLocaleDateString()}</td>
                <td className="p-4">{new Date(b.checkOut).toLocaleDateString()}</td>
                <td className="p-4 font-bold text-emerald-400">Bs. {b.totalPrice}</td>
                <td className="p-4 text-center">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className="bg-gray-900 border border-gray-600 text-white px-3 py-1.5 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}