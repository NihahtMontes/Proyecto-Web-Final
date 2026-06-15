import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Asegúrate de que esta ruta coincida con la ubicación de tu api.js
import { toast } from 'react-hot-toast'; // Para las notificaciones bonitas

export default function Login() {
  // 1. Creamos los estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Hook para redirigir al usuario después de loguearse
  const navigate = useNavigate();

// 3. La función mágica que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      // Usamos .trim() para limpiar espacios invisibles al inicio o final
      const cleanEmail = email.trim(); 
      
      const response = await api.post('/auth/login', { 
        email: cleanEmail, 
        password 
      });
      
      console.log("Respuesta del servidor:", response.data);
      
      // ¡AQUÍ GUARDAMOS EL TOKEN!
      localStorage.setItem('token', response.data.token);
      
      // (Opcional) Guardamos los datos del usuario si tu aplicación los requiere
      if(response.data.user) {
         localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      toast.success('¡Inicio de sesión exitoso!');
      
      // Redirigimos al admin
      navigate('/admin'); 

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center font-sans">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm border border-gray-800 shadow-2xl">
        <h2 className="text-white text-2xl font-light mb-2">Bienvenido</h2>
        <p className="text-gray-500 mb-8">Ingresa tus credenciales</p>
        
        {/* 4. Enlazamos el formulario con nuestra función */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email"
            value={email} // Conectado al estado
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado al escribir
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-emerald-400 outline-none transition"
            placeholder="Correo electrónico"
            required // Obliga a que no se envíe vacío
          />
          <input 
            type="password"
            value={password} // Conectado al estado
            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado al escribir
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-emerald-400 outline-none transition"
            placeholder="Contraseña"
            required // Obliga a que no se envíe vacío
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