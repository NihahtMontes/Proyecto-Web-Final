import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bookingAPI } from "../../services/api";
import BookingCard from "../../components/ui/BookingCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingAPI.cancel(id);
      toast.success("Reserva cancelada");
      loadBookings();
    } catch {
      toast.error("Error al cancelar");
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(5);
    setComment("");
  };

  const submitReview = async () => {
    try {
      await bookingAPI.createReview(selectedBooking._id, {
        rating,
        comment,
      });

      toast.success("Calificación enviada");
      closeReviewModal();
      loadBookings();
    } catch {
      toast.error("Error al calificar");
    }
  };

  if (loading) return <LoadingSpinner />;

  const groups = [
    { key: "pendiente", title: "Pendientes" },
    { key: "completada", title: "Completadas" },
    { key: "confirmada", title: "Confirmadas" },
    { key: "cancelada", title: "Canceladas" },
  ];

  const getByStatus = (status) =>
    bookings.filter((booking) => booking.status === status);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-bold text-white text-center mb-10">
        Mis Reservas
      </h1>

      {bookings.length === 0 ? (
        <EmptyState message="No tienes reservas registradas" />
      ) : (
        <div className="space-y-12">
          {groups.map((group) => {
            const items = getByStatus(group.key);

            if (items.length === 0) return null;

            return (
              <section key={group.key}>
                <h2 className="text-3xl font-bold text-white mb-5 border-b border-gray-700 pb-3">
                  {group.title}
                </h2>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {items.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={handleCancel}
                      onReview={() => openReviewModal(booking)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
          <div className="bg-white border-4 border-emerald-500 p-7 rounded-xl w-full max-w-md text-gray-900 shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-5 text-center text-slate-900">
              Calificar Reserva
            </h2>

            <label className="block mb-2 text-gray-800 font-bold">
              Estrellas
            </label>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border-2 border-gray-400 text-gray-900 bg-white p-3 rounded-lg mb-4 focus:border-emerald-500 focus:outline-none"
            >
              <option value={1}>1 estrella</option>
              <option value={2}>2 estrellas</option>
              <option value={3}>3 estrellas</option>
              <option value={4}>4 estrellas</option>
              <option value={5}>5 estrellas</option>
            </select>

            <label className="block mb-2 text-gray-800 font-bold">
              Comentario
            </label>

            <textarea
              rows="4"
              placeholder="Escribe tu comentario"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-2 border-gray-400 text-gray-900 bg-white p-3 rounded-lg mb-5 focus:border-emerald-500 focus:outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeReviewModal}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-lg font-bold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={submitReview}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg font-bold"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}