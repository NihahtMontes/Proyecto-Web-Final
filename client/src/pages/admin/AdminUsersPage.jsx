import { useEffect, useState } from "react";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    }
  };

  const getRoleColor = (role) => {
    if (role === "admin") return "bg-purple-900/50 text-purple-400 border-purple-700";
    if (role === "empleado") return "bg-blue-900/50 text-blue-400 border-blue-700";
    return "bg-emerald-900/50 text-emerald-400 border-emerald-700";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Gestión de Usuarios</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((u) => (
          <div key={u._id} className="bg-gray-800 border border-gray-700 p-6 rounded-xl flex flex-col items-center text-center shadow-lg hover:border-emerald-500/50 transition">
            {/* Avatar Placeholder */}
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 border-2 border-gray-600">
              <span className="text-2xl font-black text-gray-400">{u.name.charAt(0).toUpperCase()}</span>
            </div>
            
            <h3 className="text-lg font-bold text-white w-full truncate">{u.name}</h3>
            <p className="text-sm text-gray-400 w-full truncate mb-4">{u.email}</p>
            
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getRoleColor(u.role)}`}>
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}