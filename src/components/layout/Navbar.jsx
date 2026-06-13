import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => {
    // 1. Visitante (No autenticado)
    if (!user) {
      return (
        <>
          <Link to="/" className="text-gray-300 hover:text-emerald-400 transition">Inicio</Link>
          <Link to="/habitaciones" className="text-gray-300 hover:text-emerald-400 transition">Habitaciones</Link>
          <Link to="/login" className="text-gray-300 hover:text-emerald-400 transition">Ingresar</Link>
          <Link to="/register" className="bg-emerald-400 text-gray-950 px-4 py-2 rounded-lg font-bold hover:bg-emerald-300 transition text-center">Registrarse</Link>
        </>
      );
    }

    // 2. Cliente
    if (user.role === 'cliente') {
      return (
        <>
          <Link to="/" className="text-gray-300 hover:text-emerald-400 transition">Inicio</Link>
          <Link to="/habitaciones" className="text-gray-300 hover:text-emerald-400 transition">Habitaciones</Link>
          <Link to="/mis-reservas" className="text-gray-300 hover:text-emerald-400 transition">Mis Reservas</Link>
          <Link to="/perfil" className="text-gray-300 hover:text-emerald-400 transition">Mi Perfil</Link>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition text-left">Cerrar Sesión</button>
        </>
      );
    }

    // 3. Empleado
    if (user.role === 'empleado') {
      return (
        <>
          <Link to="/panel-limpieza" className="text-gray-300 hover:text-emerald-400 transition">Panel Limpieza</Link>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition text-left">Cerrar Sesión</button>
        </>
      );
    }

    // 4. Admin
    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin" className="text-gray-300 hover:text-emerald-400 transition">Dashboard</Link>
          <Link to="/admin/habitaciones" className="text-gray-300 hover:text-emerald-400 transition">Gestión Habitaciones</Link>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition text-left">Cerrar Sesión</button>
        </>
      );
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              Byte<span className="text-emerald-400">Hotel</span>
            </span>
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
            {user && (
              <span className="bg-gray-800 border border-gray-700 text-emerald-400 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold">
                {user.role}
              </span>
            )}
          </div>

          {/* Menú Hamburguesa (Móvil) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pt-2 pb-4 space-y-3 flex flex-col">
          {user && (
            <div className="text-xs text-gray-500 uppercase font-bold mb-2">Rol activo: {user.role}</div>
          )}
          <NavLinks />
        </div>
      )}
    </nav>
  );
}