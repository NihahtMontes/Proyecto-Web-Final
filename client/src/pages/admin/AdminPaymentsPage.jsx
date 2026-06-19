import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { paymentAPI } from "../../services/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);

  const loadPayments = async () => {
    const res = await paymentAPI.getAll();
    setPayments(res.data);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleVerify = async (id) => {
    try {
      await paymentAPI.verify(id);
      toast.success("Pago verificado");
      loadPayments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al verificar pago");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Gestión de Pagos</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
        {payments.length === 0 ? (
          <p className="text-gray-400">No hay pagos registrados.</p>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div key={payment._id} className="border border-gray-600 rounded-lg p-4 bg-gray-900/50">
                <p className="text-gray-300"><b>Monto:</b> <span className="text-emerald-400 font-bold">Bs. {payment.amount}</span></p>
                <p className="text-gray-300"><b>Método:</b> {payment.method}</p>
                <p className="text-gray-300"><b>Estado:</b> <span className="capitalize">{payment.status}</span></p>

                {payment.status !== "verificado" && (
                  <button
                    onClick={() => handleVerify(payment._id)}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded transition-colors"
                  >
                    Verificar pago
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}