export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-6">
        Panel de <span className="text-emerald-400">Administración</span>
      </h1>
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
        <p className="text-gray-400">
          Bienvenido al centro de control. Si estás viendo esto, significa que tu inicio de sesión y validación de roles funcionan a la perfección.
        </p>
      </div>
    </div>
  );
}