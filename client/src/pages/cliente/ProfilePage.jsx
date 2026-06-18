import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { authAPI } from "../../services/api";

import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function ProfilePage() {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
    });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile =
    async () => {
      try {
        const response =
          await authAPI.getMe();

        setUser(
          response.data
        );

        setFormData({
          name:
            response.data.name || "",
          phone:
            response.data.phone || "",
        });
      } catch {
        toast.error(
          "Error al cargar perfil"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleProfileUpdate =
    async (e) => {
      e.preventDefault();

      try {
        /*
          Aquí irá:
          await userAPI.updateProfile(...)
        */

        setUser({
          ...user,
          ...formData,
        });

        setEditing(false);

        toast.success(
          "Perfil actualizado"
        );
      } catch {
        toast.error(
          "Error al actualizar"
        );
      }
    };

  const handlePasswordChange =
    async (e) => {
      e.preventDefault();

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        toast.error(
          "Las contraseñas no coinciden"
        );
        return;
      }

      try {
        /*
          Aquí irá:
          await authAPI.changePassword(...)
        */

        toast.success(
          "Contraseña actualizada"
        );

        setShowPasswordModal(
          false
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch {
        toast.error(
          "Error al cambiar contraseña"
        );
      }
    };

  if (loading)
    return (
      <LoadingSpinner />
    );

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Mi Perfil
      </h1>

      <div className="bg-white rounded-lg shadow p-6">

        {!editing ? (
          <>
            <div className="space-y-4">

              <div>
                <p className="font-semibold">
                  Nombre
                </p>

                <p>
                  {user?.name}
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Email
                </p>

                <p>
                  {user?.email}
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Teléfono
                </p>

                <p>
                  {user?.phone ||
                    "No registrado"}
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Rol
                </p>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {user?.role}
                </span>
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setEditing(true)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Editar Perfil
              </button>

              <button
                onClick={() =>
                  setShowPasswordModal(
                    true
                  )
                }
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cambiar Contraseña
              </button>

            </div>
          </>
        ) : (
          <form
            onSubmit={
              handleProfileUpdate
            }
          >
            <div className="mb-4">

              <label className="block mb-1">
                Nombre
              </label>

              <input
                type="text"
                value={
                  formData.name
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

            </div>

            <div className="mb-4">

              <label className="block mb-1">
                Teléfono
              </label>

              <input
                type="text"
                value={
                  formData.phone
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

            </div>

            <div className="flex gap-2">

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditing(false)
                }
                className="border px-4 py-2 rounded"
              >
                Cancelar
              </button>

            </div>

          </form>
        )}

      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4">
              Cambiar Contraseña
            </h2>

            <form
              onSubmit={
                handlePasswordChange
              }
            >

              <input
                type="password"
                placeholder="Contraseña actual"
                value={
                  passwordData.currentPassword
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-3"
              />

              <input
                type="password"
                placeholder="Nueva contraseña"
                value={
                  passwordData.newPassword
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-3"
              />

              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={
                  passwordData.confirmPassword
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-4"
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordModal(
                      false
                    )
                  }
                  className="border px-4 py-2 rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}