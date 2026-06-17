import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ui/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import RoomsPage from "./pages/public/RoomsPage";
import RoomDetailPage from "./pages/public/RoomDetailPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

import BookingConfirmPage from "./pages/cliente/BookingConfirmPage";
import MyBookingsPage from "./pages/cliente/MyBookingsPage";
import ProfilePage from "./pages/cliente/ProfilePage";

import CleaningPanelPage from "./pages/empleado/CleaningPanelPage";

function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Panel Administrador
      </h1>
      <p className="text-gray-600">
        Bienvenido al panel de administración de ByteHotel.
      </p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/habitaciones" element={<RoomsPage />} />
        <Route path="/habitaciones/:id" element={<RoomDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/reservar"
          element={
            <ProtectedRoute allowedRoles={["cliente"]}>
              <BookingConfirmPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-reservas"
          element={
            <ProtectedRoute allowedRoles={["cliente"]}>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={["cliente", "empleado", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/limpieza"
          element={
            <ProtectedRoute allowedRoles={["empleado", "admin"]}>
              <CleaningPanelPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

        <Route
          path="*"
          element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold">Página no encontrada</h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;