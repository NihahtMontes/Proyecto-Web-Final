import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bookingAPI } from "../../services/api";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const res = await bookingAPI.getAll();
      setBookings(res.data);
    } catch (error) {
      toast.error("Error al cargar reservas");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      toast.success("Reserva actualizada");
      await loadBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al actualizar reserva");
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Reservas</h1>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-5 rounded-xl shadow">
            <p><b>Cliente:</b> {booking.user?.name || "Sin cliente"}</p>
            <p><b>Email:</b> {booking.user?.email || "Sin email"}</p>
            <p><b>Habitación:</b> {booking.room?.number || "Sin habitación"}</p>
            <p><b>Entrada:</b> {booking.checkIn?.slice(0, 10)}</p>
            <p><b>Salida:</b> {booking.checkOut?.slice(0, 10)}</p>
            <p><b>Total:</b> Bs. {booking.totalPrice}</p>
            <p><b>Estado:</b> {booking.status}</p>

            <div className="flex gap-3 mt-4">
              <button onClick={() => changeStatus(booking._id, "confirmada")} className="bg-green-600 text-white px-4 py-2 rounded">
                Confirmar
              </button>

              <button onClick={() => changeStatus(booking._id, "cancelada")} className="bg-red-600 text-white px-4 py-2 rounded">
                Cancelar
              </button>

              <button onClick={() => changeStatus(booking._id, "completada")} className="bg-blue-600 text-white px-4 py-2 rounded">
                Completar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}