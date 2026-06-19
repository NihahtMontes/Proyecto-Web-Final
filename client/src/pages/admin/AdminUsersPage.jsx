import { useEffect, useState } from "react";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "empleado",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch {
      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingUser) {
        await userAPI.update(editingUser._id, form);
        toast.success("Usuario actualizado");
      } else {
        await userAPI.create(form);
        toast.success("Usuario creado");
      }

      resetForm();
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      role: user.role,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;

    try {
      await userAPI.delete(id);
      toast.success("Usuario eliminado");
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al eliminar usuario");
    }
  };

  const getRoleColor = (role) => {
    if (role === "admin") return "text-purple-400";
    if (role === "empleado") return "text-blue-400";
    return "text-emerald-400";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Gestión de Usuarios
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8 grid md:grid-cols-2 gap-4"
      >
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-gray-900 text-white p-3 rounded"
          required
        />

        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-gray-900 text-white p-3 rounded"
          required
        />

        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="bg-gray-900 text-white p-3 rounded"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={editingUser ? "Nueva contraseña opcional" : "Contraseña"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-gray-900 text-white p-3 rounded w-full pr-12"
            required={!editingUser}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="bg-gray-900 text-white p-3 rounded"
        >
          <option value="cliente">Cliente</option>
          <option value="empleado">Empleado</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded px-5"
          >
            {loading ? "Guardando..." : editingUser ? "Actualizar" : "Crear usuario"}
          </button>

          {editingUser && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold rounded px-5"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-700 text-gray-300">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.phone || "Sin teléfono"}</td>
                <td className={`p-4 font-bold ${getRoleColor(user.role)}`}>
                  {user.role}
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}