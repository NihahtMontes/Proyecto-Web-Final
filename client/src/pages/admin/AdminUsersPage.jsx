import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userAPI } from "../../services/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "empleado",
  });

  const loadUsers = async () => {
    const res = await userAPI.getAll();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userAPI.create(form);
      toast.success("Usuario creado");
      setForm({ name: "", email: "", password: "", phone: "", role: "empleado" });
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al crear usuario");
    }
  };

  const handleDelete = async (id) => {
    await userAPI.delete(id);
    toast.success("Usuario eliminado");
    loadUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow grid gap-4 max-w-xl mb-8">
        <input className="border p-3 rounded" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border p-3 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="border p-3 rounded" placeholder="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input className="border p-3 rounded" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <select className="border p-3 rounded" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
          <option value="cliente">Cliente</option>
        </select>

        <button className="bg-blue-600 text-white py-3 rounded-lg">
          Crear usuario
        </button>
      </form>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p><b>{user.name}</b></p>
              <p>{user.email}</p>
              <p>Rol: {user.role}</p>
            </div>

            <button onClick={() => handleDelete(user._id)} className="text-red-600">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}