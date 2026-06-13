import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
        Descubre el confort en <br />
        <span className="text-emerald-400">ByteHotel</span>
      </h1>
      <p className="text-xl text-gray-400 mb-10 max-w-2xl">
        Gestiona tus reservas, explora nuestras habitaciones de lujo y disfruta de una experiencia inolvidable con nuestro sistema automatizado.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/habitaciones" 
          className="bg-emerald-400 text-gray-950 px-8 py-3 rounded-lg font-bold text-lg hover:bg-emerald-300 transition shadow-lg shadow-emerald-400/20"
        >
          Ver Habitaciones
        </Link>
        <Link 
          to="/login" 
          className="bg-gray-800 text-white border border-gray-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-700 transition"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}