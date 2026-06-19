import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { paymentAPI } from "../../services/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const loadPayments = async () => {
    const params = {};

    if (statusFilter) params.status = statusFilter;
    if (methodFilter) params.method = methodFilter;

    const res = await paymentAPI.getAll(params);
    setPayments(res.data);
  };

  useEffect(() => {
    loadPayments();
  }, [statusFilter, methodFilter]);

  const handleVerify = async (id) => {
    try {
      await paymentAPI.verify(id);
      toast.success("Pago verificado");
      loadPayments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al verificar pago");
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case "qr_simple":
        return "QR Bancario";
      case "tigo_money":
        return "Tigo Money";
      case "transferencia":
        return "Transferencia";
      case "efectivo":
        return "Efectivo";
      default:
        return method;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-8 text-white text-center">
        Gestión de Pagos
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-600 text-white p-3 rounded-lg"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="verificado">Verificado</option>
          <option value="fallido">Fallido</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="bg-gray-900 border border-gray-600 text-white p-3 rounded-lg"
        >
          <option value="">Todos los métodos</option>
          <option value="qr_simple">QR Bancario</option>
          <option value="tigo_money">Tigo Money</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>

        <button
          onClick={() => {
            setStatusFilter("");
            setMethodFilter("");
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-lg"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
        {payments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No hay pagos registrados.
          </p>
        ) : (
          <div className="grid gap-5">
            {payments.map((payment) => {
              const booking = payment.booking;
              const user = booking?.user;
              const room = booking?.room;

              return (
                <div
                  key={payment._id}
                  className="border border-gray-600 rounded-xl p-5 bg-gray-900/50"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300">
                    <p>
                      <b className="text-gray-400">Cliente:</b>
                      <br />
                      {user?.name || "Sin cliente"}
                    </p>

                    <p>
                      <b className="text-gray-400">Habitación:</b>
                      <br />#{room?.number || "S/N"} {room?.type || ""}
                    </p>

                    <p>
                      <b className="text-gray-400">Método:</b>
                      <br />
                      {getMethodLabel(payment.method)}
                    </p>

                    <p>
                      <b className="text-gray-400">Monto:</b>
                      <br />
                      <span className="text-emerald-400 font-bold">
                        Bs. {payment.amount}
                      </span>
                    </p>

                    <p>
                      <b className="text-gray-400">Estado:</b>
                      <br />
                      <span
                        className={
                          payment.status === "verificado"
                            ? "text-emerald-400 font-bold"
                            : "text-yellow-400 font-bold"
                        }
                      >
                        {payment.status}
                      </span>
                    </p>

                    <p>
                      <b className="text-gray-400">Reserva:</b>
                      <br />
                      {booking?.status || "Sin estado"}
                    </p>

                    <p>
                      <b className="text-gray-400">Comprobante:</b>
                      <br />
                      {payment.comprobante ? (
                        <a
                          href={payment.comprobante}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline"
                        >
                          Ver comprobante
                        </a>
                      ) : (
                        <span className="text-red-400">No subido</span>
                      )}
                    </p>
                  </div>

                  {payment.status !== "verificado" && (
                    <button
                      onClick={() => handleVerify(payment._id)}
                      className="mt-5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-bold"
                    >
                      Verificar pago
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}