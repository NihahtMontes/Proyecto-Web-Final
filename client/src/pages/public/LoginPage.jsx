import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
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
      setLoading(true);

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
        navigate(
          "/admin"
        );
      } else if (
        role === "empleado"
      ) {
        navigate(
          "/empleado/limpieza"
        );
      } else {
        navigate(
          "/"
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Credenciales incorrectas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Iniciar Sesión
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            className="w-full border p-3 rounded mb-4"
          />

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            {loading
              ? "Ingresando..."
              : "Ingresar"}
          </button>

        </form>

        <p className="text-center mt-6">

          ¿No tienes cuenta?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Registrarse
          </Link>

        </p>

      </div>

    </div>
  );
}