import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", auth: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiamos el error al escribir
    setErrors({ ...errors, [e.target.name]: "", auth: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { email: "", password: "", auth: "" };
    let hasError = false;

    if (!formData.email) { newErrors.email = "El correo es obligatorio"; hasError = true; }
    if (!formData.password) { newErrors.password = "La contraseña es obligatoria"; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await login(formData.email, formData.password);
      toast.success("Bienvenido");
      const role = response.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "empleado") navigate("/limpieza");
      else navigate("/");
    } catch (error) {
      setErrors({ ...newErrors, auth: "Correo o contraseña incorrectos" });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Iniciar Sesión</h1>
        
        {errors.auth && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
            {errors.auth}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-900 border text-white p-3 rounded focus:ring-2 focus:outline-none transition-colors ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-emerald-500"
              }`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-gray-900 border text-white p-3 rounded focus:ring-2 focus:outline-none transition-colors ${
                errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-emerald-500"
              }`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded transition-colors mt-2">
            Ingresar
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          ¿No tienes cuenta? <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold ml-1">Registrarse</Link>
        </p>
      </div>
    </div>
  );
}