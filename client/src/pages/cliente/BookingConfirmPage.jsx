import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingAPI, serviceAPI } from "../../services/api";

export default function BookingConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const room = state?.room;
  const roomId = state?.roomId || room?._id;
  const checkIn = state?.checkIn;
  const checkOut = state?.checkOut;

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("qr_simple");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    serviceAPI.getAll().then((res) => setServices(res.data));
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    return Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const basePrice = Number(room?.pricePerNight || 0) * nights;
  const servicesPrice = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const total = basePrice + servicesPrice;

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await bookingAPI.create({
        roomId,
        checkIn,
        checkOut,
        paymentMethod,
        services: selectedServices.map((s) => ({
          service: s._id,
          quantity: 1,
        })),
      });

      toast.success("Reserva creada correctamente");
      navigate("/mis-reservas");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al reservar");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <div className="p-8">No hay datos de reserva.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Confirmar Reserva</h1>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold">Habitación {room.number}</h2>
        <p>Noches: {nights}</p>
        <p>Base: Bs. {basePrice}</p>

        <h3 className="font-bold mt-5 mb-3">Servicios adicionales</h3>
        {services.map((service) => (
          <label key={service._id} className="block border p-3 rounded mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedServices.some((s) => s._id === service._id)}
              onChange={() => toggleService(service)}
            />
            {service.name} - Bs. {service.price}
          </label>
        ))}

        <h3 className="font-bold mt-5 mb-3">Método de pago</h3>
        <select className="border p-3 rounded w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="qr_simple">QR Bancario</option>
          <option value="tigo_money">Tigo Money</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>

        <p className="text-2xl font-bold text-blue-600 mt-5">Total: Bs. {total}</p>

        <button disabled={loading} onClick={handleConfirm} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg">
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </button>
      </div>
    </div>
  );
}