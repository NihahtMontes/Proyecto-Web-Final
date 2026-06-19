import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Complete todos los campos");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      setLoading(true);
      const response = await register(formData.name, formData.email, formData.password);
      toast.success("Registro exitoso");
      const role = response.user?.role;
      if (role === "admin") navigate("/admin");
      else if (role === "empleado") navigate("/limpieza");
      else navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded transition-colors mt-2">
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold ml-1">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}