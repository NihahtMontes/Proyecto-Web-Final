import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bookingAPI, paymentAPI } from "../../services/api";
import BookingCard from "../../components/ui/BookingCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    try {
      const bookingsRes = await bookingAPI.getMyBookings();
      const paymentsRes = await paymentAPI.getMyPayments();

      setBookings(bookingsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getPaymentByBooking = (bookingId) =>
    payments.find((payment) => {
      const paymentBookingId =
        typeof payment.booking === "object" ? payment.booking._id : payment.booking;

      return paymentBookingId === bookingId;
    });

  const handleCancel = async (id) => {
    try {
      await bookingAPI.cancel(id);
      toast.success("Reserva cancelada");
      loadData();
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
      await bookingAPI.createReview(selectedBooking._id, { rating, comment });
      toast.success("Calificación enviada");
      closeReviewModal();
      loadData();
    } catch {
      toast.error("Error al calificar");
    }
  };

  const openPaymentModal = async (booking) => {
    try {
      setSelectedPaymentBooking(booking);

      let response;

      if (booking.paymentMethod === "qr_simple") {
        response = await paymentAPI.generateQR({ bookingId: booking._id });
      } else if (booking.paymentMethod === "tigo_money") {
        response = await paymentAPI.registerTigoMoney({ bookingId: booking._id });
      } else {
        response = await paymentAPI.registerManualPayment({
          bookingId: booking._id,
          method: booking.paymentMethod,
        });
      }

      setPaymentInfo(response.data);
      setShowPaymentModal(true);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error al cargar pago");
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentInfo(null);
    setSelectedPaymentBooking(null);
    setComprobante(null);
  };

  const handleUploadComprobante = async () => {
    const paymentId = paymentInfo?.payment?._id;

    if (!paymentId) {
      toast.error("No se encontró el pago");
      return;
    }

    if (!comprobante) {
      toast.error("Selecciona una imagen del comprobante");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("comprobante", comprobante);

      await paymentAPI.uploadComprobante(paymentId, formData);

      toast.success("Comprobante subido correctamente");
      closePaymentModal();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error al subir comprobante");
    } finally {
      setUploading(false);
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
                      payment={getPaymentByBooking(booking._id)}
                      onCancel={handleCancel}
                      onReview={() => openReviewModal(booking)}
                      onPay={() => openPaymentModal(booking)}
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
              className="w-full border-2 border-gray-400 text-gray-900 bg-white p-3 rounded-lg mb-4"
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
              className="w-full border-2 border-gray-400 text-gray-900 bg-white p-3 rounded-lg mb-5"
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

      {showPaymentModal && selectedPaymentBooking && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
          <div className="bg-white border-4 border-emerald-500 p-7 rounded-xl w-full max-w-lg text-gray-900 shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-5 text-center text-slate-900">
              Pago de Reserva
            </h2>

            <p className="text-center mb-3">
              <b>Habitación:</b> {selectedPaymentBooking.room?.number}
            </p>

            <p className="text-center mb-5">
              <b>Total:</b> Bs. {selectedPaymentBooking.totalPrice}
            </p>

            {selectedPaymentBooking.paymentMethod === "qr_simple" &&
              paymentInfo?.qrCode && (
                <div className="text-center">
                  <p className="font-bold mb-3">Escanea el QR para pagar</p>
                  <img
                    src={paymentInfo.qrCode}
                    alt="QR de pago"
                    className="mx-auto max-w-xs border rounded-lg"
                  />
                </div>
              )}

            {selectedPaymentBooking.paymentMethod === "tigo_money" &&
              paymentInfo?.tigoData && (
                <div className="bg-emerald-50 border border-emerald-400 rounded-lg p-4">
                  <p><b>Número:</b> {paymentInfo.tigoData.number}</p>
                  <p><b>Titular:</b> {paymentInfo.tigoData.holder}</p>
                  <p><b>Monto:</b> Bs. {paymentInfo.tigoData.amount}</p>
                  <p><b>Concepto:</b> {paymentInfo.tigoData.concepto}</p>
                </div>
              )}

            {selectedPaymentBooking.paymentMethod === "transferencia" && (
              <div className="bg-blue-50 border border-blue-400 rounded-lg p-4 text-center">
                <p className="font-bold">Pago por transferencia registrado.</p>
                <p>Sube el comprobante para que el administrador lo verifique.</p>
              </div>
            )}

            {selectedPaymentBooking.paymentMethod === "efectivo" && (
              <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 text-center">
                <p className="font-bold">Pago en efectivo pendiente.</p>
                <p>Paga en recepción para que el administrador confirme la reserva.</p>
              </div>
            )}

            {["qr_simple", "tigo_money", "transferencia"].includes(
              selectedPaymentBooking.paymentMethod
            ) && (
              <div className="mt-6 border-2 border-gray-300 rounded-lg p-4">
                <label className="block font-bold text-gray-800 mb-2">
                  Subir comprobante
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setComprobante(e.target.files[0])}
                  className="w-full border border-gray-400 p-2 rounded bg-white text-gray-900"
                />

                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleUploadComprobante}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold disabled:opacity-60"
                >
                  {uploading ? "Subiendo..." : "Subir comprobante"}
                </button>
              </div>
            )}

            <button
              onClick={closePaymentModal}
              className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}