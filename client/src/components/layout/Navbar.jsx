import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderLinks = () => {
    // 1. Navegación para usuarios NO autenticados
    if (!user) {
      return (
        <>
          <Link to="/" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Home
          </Link>
          <Link to="/habitaciones" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Habitaciones
          </Link>
          <Link to="/login" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Login
          </Link>
          <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-md transition-all shadow-md shadow-emerald-950 text-center">
            Registrarse
          </Link>
        </>
      );
    }

    // 2. Navegación para rol ADMINISTRADOR
    if (user.role === "admin") {
      return (
        <>
          <Link to="/admin" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Dashboard
          </Link>
          <Link to="/admin/rooms" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Habitaciones
          </Link>
          <Link to="/admin/bookings" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Reservas
          </Link>
          <Link to="/admin/users" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Usuarios
          </Link>
          <Link to="/admin/services" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Servicios
          </Link>
          <Link to="/admin/cleaning" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Limpieza
          </Link>
          <Link to="/admin/payments" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Pagos
          </Link>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-md transition-all text-center">
            Salir
          </button>
        </>
      );
    }

    // 3. Navegación para rol EMPLEADO
    if (user.role === "empleado") {
      return (
        <>
          <Link to="/empleado/tareas" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
            Mis Tareas
          </Link>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-md transition-all text-center">
            Salir
          </button>
        </>
      );
    }

    // 4. Navegación para rol CLIENTE autenticado
    return (
      <>
        <Link to="/" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
          Home
        </Link>
        <Link to="/habitaciones" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
          Habitaciones
        </Link>
        <Link to="/mis-reservas" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors py-2">
          Mis Reservas
        </Link>
        <span className="text-emerald-400 font-semibold py-2">
          Hola, {user.name}
        </span>
        <button onClick={handleLogout} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-md transition-all shadow-md shadow-emerald-950">
          Cerrar Sesión
        </button>
      </>
    );
  };

  return (
    <nav className="bg-gray-950 border-b border-gray-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black tracking-wider text-white">
              BYTE<span className="text-emerald-500">HOTEL</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {renderLinks()}
          </div>

          {/* Mobile Hamburguer Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 px-4 pt-2 pb-4 space-y-2 flex flex-col">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
}