import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  bookingAPI,
  paymentAPI,
} from "../../services/api";

export default function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    room,
    checkIn,
    checkOut,
    nights,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] =
    useState("efectivo");

  const [loading, setLoading] =
    useState(false);

  const [qrData, setQrData] =
    useState(null);

  const [tigoData, setTigoData] =
    useState(null);

  const services = [
    {
      id: 1,
      name: "Desayuno Buffet",
      price: 50,
    },
    {
      id: 2,
      name: "Transporte",
      price: 80,
    },
    {
      id: 3,
      name: "Lavandería",
      price: 30,
    },
  ];

  const [selectedServices, setSelectedServices] =
    useState([]);

  const toggleService = (service) => {
    const exists =
      selectedServices.find(
        (s) => s.id === service.id
      );

    if (exists) {
      setSelectedServices(
        selectedServices.filter(
          (s) => s.id !== service.id
        )
      );
    } else {
      setSelectedServices([
        ...selectedServices,
        service,
      ]);
    }
  };

  const basePrice =
    (room?.pricePerNight || 0) *
    (nights || 1);

  const servicesPrice =
    selectedServices.reduce(
      (acc, item) =>
        acc + item.price,
      0
    );

  const total =
    basePrice + servicesPrice;

  const generateQR =
    async () => {
      try {
        const response =
          await paymentAPI.generateQR({
            amount: total,
          });

        setQrData(
          response.data
        );
      } catch {
        toast.error(
          "No se pudo generar QR"
        );
      }
    };

  const generateTigo =
    async () => {
      try {
        const response =
          await paymentAPI.registerTigoMoney(
            {
              amount: total,
            }
          );

        setTigoData(
          response.data
        );
      } catch {
        toast.error(
          "No se pudo registrar Tigo Money"
        );
      }
    };

  const handleConfirm =
    async () => {
      try {
        setLoading(true);

        await bookingAPI.create({
          roomId: room?._id,
          checkIn,
          checkOut,
          services:
            selectedServices,
          paymentMethod,
          total,
        });

        toast.success(
          "Reserva creada"
        );

        navigate(
          "/mis-reservas"
        );
      } catch (error) {
        toast.error(
          "Error al reservar"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!room) {
    return (
      <div className="p-10 text-center">
        No hay datos de reserva.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Confirmar Reserva
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div>

          <img
            src={room.image}
            alt={room.number}
            className="w-full h-64 object-cover rounded-lg"
          />

          <h2 className="text-xl font-bold mt-4">
            Habitación {room.number}
          </h2>

          <p>{room.type}</p>

          <p>
            Check-In:
            {" "}
            {checkIn}
          </p>

          <p>
            Check-Out:
            {" "}
            {checkOut}
          </p>

          <p>
            Noches:
            {" "}
            {nights}
          </p>

        </div>

        <div>

          <div className="bg-white shadow rounded-lg p-5">

            <h3 className="font-bold text-lg mb-3">
              Servicios adicionales
            </h3>

            {services.map(
              (service) => (
                <label
                  key={service.id}
                  className="flex justify-between mb-2"
                >
                  <span>
                    <input
                      type="checkbox"
                      className="mr-2"
                      onChange={() =>
                        toggleService(
                          service
                        )
                      }
                    />

                    {service.name}
                  </span>

                  <span>
                    Bs. {service.price}
                  </span>
                </label>
              )
            )}

            <hr className="my-4" />

            <p>
              Base:
              {" "}
              Bs. {basePrice}
            </p>

            <p>
              Servicios:
              {" "}
              Bs. {servicesPrice}
            </p>

            <p className="text-2xl font-bold mt-3">
              Total:
              {" "}
              Bs. {total}
            </p>

          </div>

          <div className="bg-white shadow rounded-lg p-5 mt-5">

            <h3 className="font-bold text-lg mb-3">
              Método de Pago
            </h3>

            <div className="space-y-2">

              <label className="block">
                <input
                  type="radio"
                  value="qr"
                  checked={
                    paymentMethod ===
                    "qr"
                  }
                  onChange={() => {
                    setPaymentMethod(
                      "qr"
                    );
                    generateQR();
                  }}
                />
                {" "}
                QR Bancario
              </label>

              <label className="block">
                <input
                  type="radio"
                  value="tigo"
                  checked={
                    paymentMethod ===
                    "tigo"
                  }
                  onChange={() => {
                    setPaymentMethod(
                      "tigo"
                    );
                    generateTigo();
                  }}
                />
                {" "}
                Tigo Money
              </label>

              <label className="block">
                <input
                  type="radio"
                  value="transferencia"
                  checked={
                    paymentMethod ===
                    "transferencia"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "transferencia"
                    )
                  }
                />
                {" "}
                Transferencia
              </label>

              <label className="block">
                <input
                  type="radio"
                  value="efectivo"
                  checked={
                    paymentMethod ===
                    "efectivo"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "efectivo"
                    )
                  }
                />
                {" "}
                Efectivo
              </label>

            </div>

            {paymentMethod ===
              "qr" &&
              qrData && (
                <div className="mt-4">
                  <p>
                    Escanee el QR
                    desde su banco.
                  </p>

                  <img
                    src={
                      qrData.qrImage
                    }
                    alt="QR"
                    className="w-56"
                  />
                </div>
              )}

            {paymentMethod ===
              "tigo" &&
              tigoData && (
                <div className="mt-4">
                  <p>
                    Número:
                    {" "}
                    {
                      tigoData.number
                    }
                  </p>

                  <p>
                    Monto:
                    {" "}
                    Bs.
                    {
                      tigoData.amount
                    }
                  </p>
                </div>
              )}

            {paymentMethod ===
              "transferencia" && (
                <div className="mt-4">
                  <p>
                    Banco Unión
                  </p>

                  <p>
                    Cuenta:
                    123456789
                  </p>

                  <input
                    type="file"
                    className="mt-3"
                  />
                </div>
              )}

            {paymentMethod ===
              "efectivo" && (
                <div className="mt-4">
                  Puede pagar
                  directamente en
                  recepción.
                </div>
              )}

          </div>

          <button
            onClick={
              handleConfirm
            }
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading
              ? "Procesando..."
              : "Confirmar Reserva"}
          </button>

        </div>

      </div>

    </div>
  );
}