import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/ui/RoomCard";

export default function RoomsPage() {
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] =
    useState("");

  const [capacityFilter, setCapacityFilter] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const rooms = [
    {
      _id: 1,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      number: "101",
      type: "Simple",
      pricePerNight: 250,
      capacity: 2,
      status: "Disponible",
    },
    {
      _id: 2,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      number: "202",
      type: "Doble",
      pricePerNight: 450,
      capacity: 4,
      status: "Disponible",
    },
    {
      _id: 3,
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      number: "303",
      type: "Suite",
      pricePerNight: 850,
      capacity: 6,
      status: "Disponible",
    },
    {
      _id: 4,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      number: "404",
      type: "Suite Premium",
      pricePerNight: 1200,
      capacity: 8,
      status: "Disponible",
    },
  ];

  const filteredRooms =
    rooms.filter((room) => {
      const typeOk =
        !typeFilter ||
        room.type === typeFilter;

      const capacityOk =
        !capacityFilter ||
        room.capacity >=
          Number(capacityFilter);

      const minOk =
        !minPrice ||
        room.pricePerNight >=
          Number(minPrice);

      const maxOk =
        !maxPrice ||
        room.pricePerNight <=
          Number(maxPrice);

      return (
        typeOk &&
        capacityOk &&
        minOk &&
        maxOk
      );
    });

  const handleViewRoom = (
    room
  ) => {
    navigate(
      `/habitaciones/${room._id}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Habitaciones
      </h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* FILTROS */}

        <div className="bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold mb-4">
            Filtros
          </h2>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">
              Todos los tipos
            </option>

            <option value="Simple">
              Simple
            </option>

            <option value="Doble">
              Doble
            </option>

            <option value="Suite">
              Suite
            </option>

            <option value="Suite Premium">
              Suite Premium
            </option>
          </select>

          <select
            value={capacityFilter}
            onChange={(e) =>
              setCapacityFilter(
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">
              Capacidad
            </option>

            <option value="2">
              2 Personas
            </option>

            <option value="4">
              4 Personas
            </option>

            <option value="6">
              6 Personas
            </option>

            <option value="8">
              8 Personas
            </option>
          </select>

          <input
            type="number"
            placeholder="Precio mínimo"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-3"
          />

          <input
            type="number"
            placeholder="Precio máximo"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                e.target.value
              )
            }
            className="w-full border p-2 rounded"
          />
        </div>

        {/* HABITACIONES */}

        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map(
              (room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onClick={
                    handleViewRoom
                  }
                />
              )
            )}
          </div>

          {filteredRooms.length ===
            0 && (
            <div className="bg-white p-8 rounded-lg shadow text-center mt-6">
              <p className="text-gray-500">
                No se encontraron
                habitaciones con los
                filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}