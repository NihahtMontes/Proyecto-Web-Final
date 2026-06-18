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

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminCleaningPage from "./pages/admin/AdminCleaningPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

function AdminPlaceholder({ title }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
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
            <ProtectedRoute allowedRoles={["empleado"]}>
              <CleaningPanelPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPlaceholder title="Gestión de Servicios" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cleaning"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCleaningPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;