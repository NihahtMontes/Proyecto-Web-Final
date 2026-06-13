export default function Login() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center font-sans">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm border border-gray-800 shadow-2xl">
        <h2 className="text-white text-2xl font-light mb-2">Bienvenido</h2>
        <p className="text-gray-500 mb-8">Ingresa tus credenciales</p>
        
        <form className="space-y-4">
          <input 
            type="email"
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-emerald-400 outline-none transition"
            placeholder="Correo electrónico"
          />
          <input 
            type="password"
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-emerald-400 outline-none transition"
            placeholder="Contraseña"
          />
          <button 
            type="submit"
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-bold py-3 rounded-lg transition duration-300"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}