import { useEffect, useState } from "react";
import { paymentAPI } from "../../services/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      const res = await paymentAPI.getAll();
      setPayments(res.data);
    };

    loadPayments();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Pagos</h1>

      <div className="bg-white rounded-xl shadow p-6">
        {payments.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div key={payment._id} className="border rounded-lg p-4">
                <p><b>Monto:</b> {payment.amount}</p>
                <p><b>Método:</b> {payment.method}</p>
                <p><b>Estado:</b> {payment.status}</p>

                {payment.status !== "verificado" && (
                  <button
                    onClick={() => paymentAPI.verify(payment._id)}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
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