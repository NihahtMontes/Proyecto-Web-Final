import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData =
    location.state || {};

  const room =
    bookingData.room || {
      number: "101",
      type: "Suite",
      pricePerNight: 350,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    };

  const nights =
    bookingData.nights || 1;

  const [paymentMethod,
    setPaymentMethod] =
    useState("qr");

  const [services,
    setServices] =
    useState([]);

  const availableServices = [
    {
      id: 1,
      name: "Desayuno",
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

  const toggleService = (
    service
  ) => {
    const exists =
      services.find(
        (s) =>
          s.id === service.id
      );

    if (exists) {
      setServices(
        services.filter(
          (s) =>
            s.id !== service.id
        )
      );
    } else {
      setServices([
        ...services,
        service,
      ]);
    }
  };

  const servicesTotal =
    services.reduce(
      (acc, item) =>
        acc + item.price,
      0
    );

  const roomTotal =
    room.pricePerNight *
    nights;

  const total =
    roomTotal +
    servicesTotal;

  const confirmBooking =
    async () => {
      try {
        toast.success(
          "Reserva creada correctamente"
        );

        navigate(
          "/mis-reservas"
        );
      } catch (error) {
        toast.error(
          "Error al crear reserva"
        );
      }
    };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Confirmar Reserva
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white shadow rounded-lg p-5">

          <img
            src={room.image}
            alt={room.type}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />

          <h2 className="text-xl font-bold">
            Habitación {room.number}
          </h2>

          <p className="text-gray-600">
            {room.type}
          </p>

          <p className="mt-2">
            Check In:
            {" "}
            {bookingData.checkIn ||
              "2026-06-20"}
          </p>

          <p>
            Check Out:
            {" "}
            {bookingData.checkOut ||
              "2026-06-21"}
          </p>

          <p>
            Noches:
            {" "}
            {nights}
          </p>

        </div>

        <div className="bg-white shadow rounded-lg p-5">

          <h2 className="text-xl font-bold mb-4">
            Servicios Adicionales
          </h2>

          {availableServices.map(
            (service) => (
              <label
                key={service.id}
                className="flex justify-between border p-3 rounded mb-2"
              >
                <div>
                  <input
                    type="checkbox"
                    onChange={() =>
                      toggleService(
                        service
                      )
                    }
                  />
                  <span className="ml-2">
                    {service.name}
                  </span>
                </div>

                <span>
                  Bs.
                  {" "}
                  {service.price}
                </span>

              </label>
            )
          )}

          <hr className="my-4" />

          <h2 className="font-bold mb-2">
            Método de Pago
          </h2>

          <div className="space-y-2">

            <label className="block">
              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "qr"
                }
                onChange={() =>
                  setPaymentMethod(
                    "qr"
                  )
                }
              />
              <span className="ml-2">
                QR Simple
              </span>
            </label>

            <label className="block">
              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "tigo"
                }
                onChange={() =>
                  setPaymentMethod(
                    "tigo"
                  )
                }
              />
              <span className="ml-2">
                Tigo Money
              </span>
            </label>

            <label className="block">
              <input
                type="radio"
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
              <span className="ml-2">
                Transferencia
              </span>
            </label>

            <label className="block">
              <input
                type="radio"
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
              <span className="ml-2">
                Efectivo
              </span>
            </label>

          </div>

          <div className="mt-4 border rounded p-4">

            {paymentMethod ===
              "qr" && (
              <div>
                <p>
                  Escanee este QR
                  con la app de su banco.
                </p>

                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ByteHotel"
                  alt="QR"
                  className="mt-3"
                />
              </div>
            )}

            {paymentMethod ===
              "tigo" && (
              <div>
                <p>
                  Número Tigo Money:
                </p>

                <strong>
                  76012345
                </strong>
              </div>
            )}

            {paymentMethod ===
              "transferencia" && (
              <div>
                <p>
                  Banco Mercantil
                </p>

                <p>
                  Cuenta:
                  4012345678
                </p>

                <input
                  type="file"
                  className="mt-3"
                />
              </div>
            )}

            {paymentMethod ===
              "efectivo" && (
              <div>
                <p>
                  Pago en recepción.
                </p>
              </div>
            )}

          </div>

          <div className="mt-6 border-t pt-4">

            <p>
              Habitación:
              {" "}
              Bs.
              {" "}
              {roomTotal}
            </p>

            <p>
              Servicios:
              {" "}
              Bs.
              {" "}
              {servicesTotal}
            </p>

            <h3 className="text-2xl font-bold mt-2">
              Total:
              {" "}
              Bs.
              {" "}
              {total}
            </h3>

          </div>

          <button
            onClick={
              confirmBooking
            }
            className="w-full bg-green-600 text-white py-3 rounded mt-6"
          >
            Confirmar Reserva
          </button>

        </div>

      </div>

    </div>
  );
}