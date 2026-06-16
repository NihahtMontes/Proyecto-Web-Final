import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <h2 className="text-2xl font-bold text-red-600">
          No autorizado
        </h2>
      </div>
    );
  }

  return children;
}