import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [editing, setEditing] =
    useState(false);

  const [showPasswordModal,
    setShowPasswordModal] =
    useState(false);

  const [user,
    setUser] = useState({
      name: "Carlos Flores",
      email: "carlos@gmail.com",
      phone: "70000000",
      role: "cliente",
    });

  const [passwordData,
    setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const handleSave = () => {
    setEditing(false);

    toast.success(
      "Perfil actualizado"
    );
  };

  const handlePasswordChange =
    () => {

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        toast.error(
          "Las contraseñas no coinciden"
        );
        return;
      }

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
    };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="bg-white rounded-lg shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          Mi Perfil
        </h1>

        <div className="space-y-4">

          <div>
            <label className="font-semibold">
              Nombre
            </label>

            <input
              type="text"
              value={user.name}
              disabled={!editing}
              onChange={(e) =>
                setUser({
                  ...user,
                  name:
                    e.target.value,
                })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border p-2 rounded mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">
              Teléfono
            </label>

            <input
              type="text"
              value={user.phone}
              disabled={!editing}
              onChange={(e) =>
                setUser({
                  ...user,
                  phone:
                    e.target.value,
                })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">
              Rol
            </label>

            <div className="mt-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {user.role}
              </span>
            </div>
          </div>

        </div>

        <div className="flex gap-3 mt-6">

          {!editing ? (
            <button
              onClick={() =>
                setEditing(true)
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Editar Perfil
            </button>
          ) : (
            <button
              onClick={
                handleSave
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Guardar Cambios
            </button>
          )}

          <button
            onClick={() =>
              setShowPasswordModal(
                true
              )
            }
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Cambiar Contraseña
          </button>

        </div>

      </div>

      {showPasswordModal && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="text-2xl font-bold mb-4">
              Cambiar Contraseña
            </h2>

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
                onClick={() =>
                  setShowPasswordModal(
                    false
                  )
                }
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={
                  handlePasswordChange
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Actualizar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}