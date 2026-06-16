import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !formData.email ||
        !formData.password
      ) {
        toast.error(
          "Complete todos los campos"
        );
        return;
      }

      try {
        const response =
          await login(
            formData.email,
            formData.password
          );

        toast.success(
          "Bienvenido"
        );

        const role =
          response.user.role;

        if (role === "admin") {
          navigate("/admin");
        } else if (
          role === "empleado"
        ) {
          navigate("/limpieza");
        } else {
          navigate("/");
        }
      } catch (error) {
        toast.error(
          "Credenciales incorrectas"
        );
      }
    };

  return (
    <div className="max-w-md mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Iniciar Sesión
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Ingresar
        </button>

      </form>

      <p className="mt-4 text-center">
        ¿No tienes cuenta?
        <Link
          to="/register"
          className="text-blue-600 ml-1"
        >
          Registrarse
        </Link>
      </p>

    </div>
  );
}