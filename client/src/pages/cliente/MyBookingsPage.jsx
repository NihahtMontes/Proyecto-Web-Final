import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  bookingAPI,
} from "../../services/api";

import BookingCard from "../../components/ui/BookingCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

export default function MyBookingsPage() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showReviewModal, setShowReviewModal] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const loadBookings =
    async () => {
      try {
        const response =
          await bookingAPI.getMyBookings();

        setBookings(
          response.data
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Error al cargar reservas"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel =
    async (id) => {
      try {
        await bookingAPI.cancel(
          id
        );

        toast.success(
          "Reserva cancelada"
        );

        loadBookings();
      } catch {
        toast.error(
          "Error al cancelar"
        );
      }
    };

  const openReviewModal =
    (booking) => {
      setSelectedBooking(
        booking
      );

      setShowReviewModal(
        true
      );
    };

  const submitReview =
    async () => {
      try {
        await bookingAPI.createReview(
          selectedBooking._id,
          {
            rating,
            comment,
          }
        );

        toast.success(
          "Calificación enviada"
        );

        setShowReviewModal(
          false
        );

        loadBookings();
      } catch {
        toast.error(
          "Error al calificar"
        );
      }
    };

  if (loading)
    return (
      <LoadingSpinner />
    );

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Mis Reservas
      </h1>

      {bookings.length === 0 ? (
        <EmptyState
          message="No tienes reservas registradas"
        />
      ) : (
        <div className="grid gap-4">

          {bookings.map(
            (booking) => (
              <BookingCard
                key={
                  booking._id
                }
                booking={
                  booking
                }
                onCancel={
                  handleCancel
                }
                onReview={() =>
                  openReviewModal(
                    booking
                  )
                }
              />
            )
          )}

        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4">
              Calificar Reserva
            </h2>

            <label className="block mb-2">
              Estrellas
            </label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full border p-2 rounded mb-4"
            >
              <option value={1}>
                1
              </option>
              <option value={2}>
                2
              </option>
              <option value={3}>
                3
              </option>
              <option value={4}>
                4
              </option>
              <option value={5}>
                5
              </option>
            </select>

            <textarea
              rows="4"
              placeholder="Comentario"
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowReviewModal(
                    false
                  )
                }
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={
                  submitReview
                }
                className="bg-blue-600 text-white px-4 py-2 rounded"
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