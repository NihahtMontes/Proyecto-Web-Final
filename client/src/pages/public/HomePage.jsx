import { Link } from "react-router-dom";
import {
  FaBed,
  FaWifi,
  FaUtensils,
  FaSwimmingPool,
} from "react-icons/fa";

import RoomCard from "../../components/ui/RoomCard";

export default function HomePage() {
  const popularRooms = [
    {
      _id: 1,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      number: "101",
      type: "Simple",
      pricePerNight: 250,
      capacity: 2,
      status: "Disponible",
    },
    {
      _id: 2,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      number: "202",
      type: "Doble",
      pricePerNight: 400,
      capacity: 4,
      status: "Disponible",
    },
    {
      _id: 3,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      number: "303",
      type: "Suite",
      pricePerNight: 800,
      capacity: 6,
      status: "Disponible",
    },
    {
      _id: 4,
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      number: "404",
      type: "Suite Premium",
      pricePerNight: 1200,
      capacity: 8,
      status: "Disponible",
    },
  ];

  const services = [
    { icon: <FaWifi size={46} />, title: "WiFi Gratis" },
    { icon: <FaUtensils size={46} />, title: "Restaurante" },
    { icon: <FaSwimmingPool size={46} />, title: "Piscina" },
    { icon: <FaBed size={46} />, title: "Habitaciones Premium" },
  ];

  return (
    <div>
      <section className="bg-blue-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenido a ByteHotel
          </h1>

          <p className="text-2xl mb-8">
            Reserva tu habitación de forma rápida y segura.
          </p>

          <Link
            to="/habitaciones"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100"
          >
            Ver Habitaciones
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Nuestros Servicios
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow text-center min-h-[180px] flex flex-col justify-center"
              >
                <div className="flex justify-center mb-5 text-blue-600">
                  {service.icon}
                </div>

                <h3 className="font-bold text-xl text-gray-900">
                  {service.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Habitaciones Populares
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}