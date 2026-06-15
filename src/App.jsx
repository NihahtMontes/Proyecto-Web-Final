import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            
            {/* Ruta Privada: Solo accesible si estás logueado Y eres admin */}
            <Route 
              path="/admin" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;