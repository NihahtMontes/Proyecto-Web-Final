import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const renderLinks = () => {
    // NO autenticado
    if (!user) {
      return (
        <>
          <Link to="/">
            Home
          </Link>

          <Link to="/habitaciones">
            Habitaciones
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>
        </>
      );
    }

    // CLIENTE
    if (user.role === "cliente") {
      return (
        <>
          <Link to="/">
            Home
          </Link>

          <Link to="/habitaciones">
            Habitaciones
          </Link>

          <Link to="/mis-reservas">
            Mis Reservas
          </Link>

          <Link to="/perfil">
            Perfil
          </Link>

          <button
            onClick={logout}
            className="text-red-600"
          >
            Logout
          </button>
        </>
      );
    }

    // EMPLEADO
    if (user.role === "empleado") {
      return (
        <>
          <Link to="/limpieza">
            Panel Limpieza
          </Link>

          <button
            onClick={logout}
            className="text-red-600"
          >
            Logout
          </button>
        </>
      );
    }

    // ADMIN
    if (user.role === "admin") {
      return (
        <>
          <Link to="/admin/dashboard">
            Dashboard
          </Link>

          <Link to="/admin/rooms">
            Habitaciones
          </Link>

          <Link to="/admin/bookings">
            Reservas
          </Link>

          <Link to="/admin/users">
            Usuarios
          </Link>

          <Link to="/admin/services">
            Servicios
          </Link>

          <Link to="/admin/cleaning">
            Limpieza
          </Link>

          <Link to="/admin/payments">
            Pagos
          </Link>

          <button
            onClick={logout}
            className="text-red-600"
          >
            Logout
          </button>
        </>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          ByteHotel
        </Link>

        {/* Desktop */}

        <div className="hidden md:flex gap-6 items-center">
          {renderLinks()}
        </div>

        {/* Botón móvil */}

        <button
          className="md:hidden text-2xl"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          ☰
        </button>

      </div>

      {/* Menú móvil */}

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
          {renderLinks()}
        </div>
      )}

    </nav>
  );
}