import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const room = {
    _id: id,
    number: "101",
    type: "Suite",
    capacity: 4,
    pricePerNight: 500,
    status: "Disponible",
    description:
      "Habitación amplia con aire acondicionado, TV Smart y vista panorámica.",

    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    ],

    services: [
      "WiFi",
      "TV Smart",
      "Aire Acondicionado",
      "Desayuno",
      "Piscina",
    ],
  };

  const nights =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (endDate.getTime() -
              startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const total =
    nights * room.pricePerNight;

  const handleReserve = () => {
    if (!startDate || !endDate) {
      alert(
        "Debe seleccionar Check In y Check Out."
      );
      return;
    }

    navigate("/reservar", {
      state: {
        roomId: room._id,
        room,
        checkIn: startDate,
        checkOut: endDate,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      <h1 className="text-4xl font-bold mb-8">
        Habitación {room.number}
      </h1>

      {/* GALERÍA */}

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {room.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Habitación ${index + 1}`}
            className="w-full h-64 object-cover rounded-lg shadow"
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* INFORMACIÓN */}

        <div>

          <div className="flex gap-3 mb-4">

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {room.type}
            </span>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {room.status}
            </span>

          </div>

          <p className="mb-2">
            <strong>Capacidad:</strong>{" "}
            {room.capacity} personas
          </p>

          <p className="mb-2">
            <strong>Precio:</strong>{" "}
            Bs. {room.pricePerNight} por noche
          </p>

          <p className="text-gray-700 mt-6">
            {room.description}
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            Servicios
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            {room.services.map(
              (service, index) => (
                <li key={index}>
                  {service}
                </li>
              )
            )}
          </ul>

        </div>

        {/* RESERVA */}

        <div className="bg-white rounded-lg shadow-md p-6">

          <h2 className="text-2xl font-bold mb-6">
            Reservar Habitación
          </h2>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Check In
            </label>

            <DatePicker
              selected={startDate}
              onChange={(date) =>
                setStartDate(date)
              }
              minDate={new Date()}
              placeholderText="Seleccione fecha"
              className="w-full border rounded p-2"
            />

          </div>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Check Out
            </label>

            <DatePicker
              selected={endDate}
              onChange={(date) =>
                setEndDate(date)
              }
              minDate={
                startDate ||
                new Date()
              }
              placeholderText="Seleccione fecha"
              className="w-full border rounded p-2"
            />

          </div>

          <div className="border-t pt-4">

            <p className="mb-2">
              Noches:
              <strong>
                {" "}
                {nights}
              </strong>
            </p>

            <p className="text-2xl font-bold text-green-600">
              Total: Bs. {total}
            </p>

          </div>

          <button
            onClick={handleReserve}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded mt-6"
          >
            Reservar Ahora
          </button>

        </div>

      </div>

    </div>
  );
}