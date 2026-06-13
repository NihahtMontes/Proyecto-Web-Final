import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-10 text-white">
      <h1 className="text-3xl text-blue-400 font-bold mb-8">Dashboard ByteHotel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-400">Habitaciones Ocupadas</p>
          <span className="text-4xl font-bold">{stats?.ocupadas || 0}</span>
        </div>
        {/* Agrega más tarjetas aquí */}
      </div>
    </div>
  );
}