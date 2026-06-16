import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error(
        "Complete todos los campos"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error(
        "Las contraseñas no coinciden"
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await register(
          formData.name,
          formData.email,
          formData.password
        );

      toast.success(
        "Registro exitoso"
      );

      const role =
        response.user?.role;

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
        error?.response?.data
          ?.message ||
          "Error al registrarse"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Crear Cuenta
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
          >
            {loading
              ? "Registrando..."
              : "Registrarse"}
          </button>

        </form>

        <p className="text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-600"
          >
            Iniciar sesión
          </Link>
        </p>

      </div>

    </div>
  );
}