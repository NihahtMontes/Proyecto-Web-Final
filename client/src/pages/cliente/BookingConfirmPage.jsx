import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingAPI } from "../../services/api";

const formatDate = (date) => {
  if (!date) return "Sin fecha";
  return new Date(date).toLocaleDateString("es-ES");
};

export default function BookingConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const room = state?.room || null;
  const checkIn = state?.checkIn || null;
  const checkOut = state?.checkOut || null;
  const roomId = room?._id || room?.id;

  const calculatedNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const nights = state?.nights || calculatedNights;

  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [tigoData, setTigoData] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const services = [
    { id: 1, name: "Desayuno Buffet", price: 50 },
    { id: 2, name: "Transporte", price: 80 },
    { id: 3, name: "Lavandería", price: 30 },
  ];

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const basePrice = (room?.pricePerNight || 0) * nights;
  const servicesPrice = selectedServices.reduce((acc, item) => acc + item.price, 0);
  const total = basePrice + servicesPrice;

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);

    if (method === "qr") {
      setQrData({
        qrImage: null,
        message: "QR disponible después de crear la reserva",
      });
    }

    if (method === "tigo") {
      setTigoData({
        number: "70000000",
        amount: total,
      });
    }
  };

  const handleConfirm = async () => {
    try {
      if (!roomId) {
        toast.error("La habitación no tiene ID válido");
        return;
      }

      setLoading(true);

      await bookingAPI.create({
        room: roomId,
        roomId,
        checkIn,
        checkOut,
        services: selectedServices,
        paymentMethod,
        totalPrice: total,
        total,
      });

      toast.success("Reserva creada correctamente");
      navigate("/mis-reservas");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error al reservar");
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white shadow rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            No hay datos de reserva
          </h1>
          <p className="text-gray-500 mb-5">
            Selecciona una habitación antes de confirmar.
          </p>
          <button
            onClick={() => navigate("/habitaciones")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Ver habitaciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Confirmar Reserva
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <img
            src={
              room?.image ||
              room?.images?.[0] ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945"
            }
            alt={`Habitación ${room?.number || ""}`}
            className="w-full h-72 object-cover"
          />

          <div className="p-6 space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              Habitación {room?.number || "S/N"}
            </h2>

            <p className="text-gray-600">
              Tipo: <span className="font-medium">{room?.type || "Estándar"}</span>
            </p>

            <p className="text-gray-600">
              Check-In: <span className="font-medium">{formatDate(checkIn)}</span>
            </p>

            <p className="text-gray-600">
              Check-Out: <span className="font-medium">{formatDate(checkOut)}</span>
            </p>

            <p className="text-gray-600">
              Noches: <span className="font-medium">{nights}</span>
            </p>

            <p className="text-blue-600 text-xl font-bold">
              Bs. {room?.pricePerNight || 0} / noche
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Servicios adicionales</h3>

            <div className="space-y-3">
              {services.map((service) => (
                <label
                  key={service.id}
                  className="flex justify-between items-center border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                >
                  <span>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedServices.some((s) => s.id === service.id)}
                      onChange={() => toggleService(service)}
                    />
                    {service.name}
                  </span>

                  <span className="font-semibold">Bs. {service.price}</span>
                </label>
              ))}
            </div>

            <hr className="my-5" />

            <div className="space-y-2 text-gray-700">
              <p>Base: Bs. {basePrice}</p>
              <p>Servicios: Bs. {servicesPrice}</p>
              <p className="text-2xl font-bold text-blue-600">
                Total: Bs. {total}
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl p-6 mt-5">
            <h3 className="font-bold text-lg mb-4">Método de Pago</h3>

            <div className="space-y-3">
              {[
                ["qr", "QR Bancario"],
                ["tigo", "Tigo Money"],
                ["transferencia", "Transferencia"],
                ["efectivo", "Efectivo"],
              ].map(([value, label]) => (
                <label key={value} className="block">
                  <input
                    type="radio"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => handlePaymentChange(value)}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>

            {paymentMethod === "qr" && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <p className="mb-3">Escanee este QR con la app de su banco.</p>
                <p className="text-sm text-gray-500">
                  {qrData?.message || "QR disponible después de confirmar la reserva"}
                </p>
              </div>
            )}

            {paymentMethod === "tigo" && (
              <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                <p>Transfiera Bs. {total} por Tigo Money.</p>
                <p>Número: {tigoData?.number || "70000000"}</p>
                <p>Monto: Bs. {tigoData?.amount || total}</p>
              </div>
            )}

            {paymentMethod === "transferencia" && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <p className="font-semibold">Banco Unión</p>
                <p>Cuenta: 123456789</p>
                <p>Titular: ByteHotel</p>
                <input type="file" className="mt-3" />
              </div>
            )}

            {paymentMethod === "efectivo" && (
              <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                Puede pagar directamente en recepción del hotel.
              </div>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Procesando..." : "Confirmar Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}