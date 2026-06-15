import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function PrivateRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // Si no hay usuario logueado, lo mandamos al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige un rol específico (ej. 'admin') y el usuario no lo tiene, lo mandamos al Home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  // Si pasa las pruebas, renderiza el contenido protegido
  return children;
}