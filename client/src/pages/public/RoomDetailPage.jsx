import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { roomAPI } from "../../services/api";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const loadRoom = async () => {
      const res = await roomAPI.getById(id);
      setRoom(res.data);
    };

    loadRoom();
  }, [id]);

  if (!room) return <div className="p-8">Cargando habitación...</div>;

  const nights =
    startDate && endDate
      ? Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)))
      : 0;

  const total = nights * Number(room.pricePerNight || 0);

  const handleReserve = () => {
    if (!startDate || !endDate) {
      alert("Debe seleccionar Check In y Check Out.");
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">Habitación {room.number}</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {(room.images?.length ? room.images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945"]).map((image, index) => (
          <img key={index} src={image} alt="Habitación" className="w-full h-64 object-cover rounded-lg shadow" />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <p><b>Tipo:</b> {room.type}</p>
          <p><b>Capacidad:</b> {room.capacity} personas</p>
          <p><b>Precio:</b> Bs. {room.pricePerNight} por noche</p>
          <p className="mt-6">{room.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Reservar Habitación</h2>

          <label>Check In</label>
          <DatePicker selected={startDate} onChange={setStartDate} minDate={new Date()} className="w-full border rounded p-2 mb-5" />

          <label>Check Out</label>
          <DatePicker selected={endDate} onChange={setEndDate} minDate={startDate || new Date()} className="w-full border rounded p-2 mb-5" />

          <p>Noches: <b>{nights}</b></p>
          <p className="text-2xl font-bold text-green-600">Total: Bs. {total}</p>

          <button onClick={handleReserve} className="w-full bg-blue-600 text-white py-3 rounded mt-6">
            Reservar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}