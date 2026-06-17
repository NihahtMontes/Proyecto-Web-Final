export default function AdminCleaningPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Órdenes de Limpieza</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="mb-4">Asignar limpieza a empleado.</p>

        <form className="grid gap-4 max-w-md">
          <input className="border p-3 rounded" placeholder="Habitación ej: 101" />
          <input className="border p-3 rounded" placeholder="Empleado ej: empleado@bytehotel.com" />
          <textarea className="border p-3 rounded" placeholder="Instrucciones" />

          <button
            type="button"
            className="bg-blue-600 text-white py-3 rounded-lg"
          >
            Crear orden de limpieza
          </button>
        </form>
      </div>
    </div>
  );
}