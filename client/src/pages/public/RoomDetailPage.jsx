import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { roomAPI } from "../../services/api";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const roomRes = await roomAPI.getById(id);
        const occupiedRes = await roomAPI.getOccupiedDates(id);

        setRoom(roomRes.data);
        setOccupiedDates(occupiedRes.data.map((date) => new Date(date)));
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar habitación");
      }
    };

    loadRoom();
  }, [id]);

  if (!room) {
    return <div className="p-8 text-white">Cargando habitación...</div>;
  }

  const nights =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        )
      : 0;

  const total = nights * Number(room.pricePerNight || 0);

  const handleStartDateChange = (date) => {
    setStartDate(date);

    if (endDate && date >= endDate) {
      setEndDate(null);
    }
  };

  const handleReserve = () => {
    if (!startDate || !endDate) {
      toast.error("Debe seleccionar Check In y Check Out");
      return;
    }

    navigate("/reservar", {
      state: {
        roomId: room._id,
        room,
        checkIn: startDate.toISOString(),
        checkOut: endDate.toISOString(),
        nights,
      },
    });
  };

  const image =
    room.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate("/habitaciones")}
        className="mb-8 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-semibold shadow-lg"
      >
        ← Volver a habitaciones
      </button>

      <h1 className="text-5xl font-bold text-white text-center mb-10">
        Habitación {room.number}
      </h1>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <img
            src={image}
            alt={`Habitación ${room.number}`}
            className="w-full h-80 object-cover rounded-xl shadow mb-8"
          />

          <div className="bg-gray-800 border-2 border-emerald-500 rounded-xl p-8 text-white text-center shadow-xl shadow-emerald-900/30">
            <p>
              <b>Tipo:</b> {room.type}
            </p>

            <p>
              <b>Capacidad:</b> {room.capacity} personas
            </p>

            <p>
              <b>Precio:</b> Bs. {room.pricePerNight} por noche
            </p>

            <p className="mt-4 text-gray-300">
              {room.description || "Sin descripción disponible"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border-4 border-emerald-500 shadow-2xl p-8 text-gray-900">
          <h2
            className="text-3xl font-extrabold mb-6 text-center"
            style={{ color: "#111827" }}
          >
            Reservar Habitación
          </h2>

          <label className="block font-semibold mb-2 text-gray-800">
            Check In
          </label>

          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            minDate={new Date()}
            excludeDates={occupiedDates}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de ingreso"
            className="w-full border-2 border-gray-400 text-gray-900 rounded-lg p-3 mb-5 focus:border-emerald-500 focus:outline-none"
          />

          <label className="block font-semibold mb-2 text-gray-800">
            Check Out
          </label>

          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            minDate={startDate || new Date()}
            excludeDates={occupiedDates}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de salida"
            className="w-full border-2 border-gray-400 text-gray-900 rounded-lg p-3 mb-5 focus:border-emerald-500 focus:outline-none"
          />

          <p className="text-gray-800">
            Noches: <b>{nights}</b>
          </p>

          <p className="text-3xl font-bold text-green-600 mt-3">
            Total: Bs. {total}
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Las fechas ocupadas aparecen deshabilitadas en el calendario.
          </p>

          <button
            onClick={handleReserve}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg mt-8 font-bold"
          >
            Reservar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}