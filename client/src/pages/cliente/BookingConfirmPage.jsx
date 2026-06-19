import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingAPI, serviceAPI, paymentAPI } from "../../services/api";

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
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    serviceAPI.getAll().then((res) => setServices(res.data));
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    return Math.max(
      1,
      Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    );
  }, [checkIn, checkOut]);

  const basePrice = Number(room?.pricePerNight || 0) * nights;
  const servicesPrice = selectedServices.reduce(
    (sum, service) => sum + Number(service.price || 0),
    0
  );
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

      const bookingRes = await bookingAPI.create({
        roomId,
        checkIn,
        checkOut,
        paymentMethod,
        services: selectedServices.map((s) => ({
          service: s._id,
          quantity: 1,
        })),
      });

      const bookingId = bookingRes.data._id;
      let paymentRes;

      if (paymentMethod === "qr_simple") {
        paymentRes = await paymentAPI.generateQR({ bookingId });
      } else if (paymentMethod === "tigo_money") {
        paymentRes = await paymentAPI.registerTigoMoney({ bookingId });
      } else {
        paymentRes = await paymentAPI.registerManualPayment({
          bookingId,
          method: paymentMethod,
        });
      }

      setPaymentInfo(paymentRes.data);
      toast.success("Reserva creada. Completa el pago para confirmar.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al reservar");
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-white text-xl mb-5">No hay datos de reserva.</p>
        <button
          onClick={() => navigate("/habitaciones")}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-bold"
        >
          Volver a habitaciones
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/habitaciones")}
        className="mb-6 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-semibold"
      >
        ← Volver a habitaciones
      </button>

      <h1 className="text-5xl font-bold text-white text-center mb-10">
        Confirmar Reserva
      </h1>

      <div className="bg-white border-4 border-emerald-500 shadow-2xl rounded-xl p-8 text-black">
        <h2 className="text-3xl font-extrabold text-center mb-4 bg-emerald-200 py-3 rounded-lg text-slate-900">
          Habitación {room.number}
        </h2>

        <div className="text-center mb-6 text-slate-900 font-medium">
          <p className="text-xl">
            <b>Noches:</b> {nights}
          </p>
          <p className="text-xl mt-2">
            <b>Base:</b> Bs. {basePrice}
          </p>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4 text-center">
          Servicios adicionales
        </h3>

        <div className="grid gap-3">
          {services.map((service) => (
            <label
              key={service._id}
              className="flex items-center gap-3 border-2 border-gray-300 p-4 rounded-lg hover:border-emerald-500 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedServices.some((s) => s._id === service._id)}
                onChange={() => toggleService(service)}
              />
              <span className="font-medium">
                {service.name} - Bs. {service.price}
              </span>
            </label>
          ))}
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4 text-center">
          Método de pago
        </h3>

        <select
          className="border-2 border-emerald-500 text-black p-4 rounded-lg w-full bg-white font-medium"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          disabled={!!paymentInfo}
        >
          <option value="qr_simple">QR Bancario</option>
          <option value="tigo_money">Tigo Money</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>

        <p className="text-5xl font-extrabold text-blue-600 mt-6 text-center">
          Total: Bs. {total}
        </p>

        {!paymentInfo ? (
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/habitaciones")}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-lg font-bold"
            >
              Cancelar
            </button>

            <button
              disabled={loading}
              onClick={handleConfirm}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-lg font-bold disabled:opacity-60"
            >
              {loading ? "Procesando..." : "Confirmar Reserva"}
            </button>
          </div>
        ) : (
          <div className="mt-8 border-2 border-emerald-500 rounded-xl p-5 bg-emerald-50 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Pago pendiente
            </h3>

            {paymentMethod === "qr_simple" && paymentInfo.qrCode && (
              <>
                <p className="mb-3">Escanea este QR para pagar:</p>
                <img
                  src={paymentInfo.qrCode}
                  alt="QR de pago"
                  className="mx-auto max-w-xs border rounded-lg"
                />
              </>
            )}

            {paymentMethod === "tigo_money" && paymentInfo.tigoData && (
              <div className="text-left max-w-md mx-auto">
                <p><b>Número:</b> {paymentInfo.tigoData.number}</p>
                <p><b>Titular:</b> {paymentInfo.tigoData.holder}</p>
                <p><b>Monto:</b> Bs. {paymentInfo.tigoData.amount}</p>
                <p><b>Concepto:</b> {paymentInfo.tigoData.concepto}</p>
              </div>
            )}

            {paymentMethod === "transferencia" && (
              <p>
                Realiza la transferencia y luego sube el comprobante desde la sección de pagos.
              </p>
            )}

            {paymentMethod === "efectivo" && (
              <p>
                Paga en recepción. Un administrador verificará el pago.
              </p>
            )}

            <button
              onClick={() => navigate("/mis-reservas")}
              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
            >
              Ir a Mis Reservas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}