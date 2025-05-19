import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GestionarUsuarios() {
  const [users, setUsers] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error al obtener los usuarios");
      setLoading(false);
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditedUsers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const updates = editedUsers[id];
      await axios.patch(`${process.env.REACT_APP_API_URL}/users/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, ...updates } : user
        )
      );

      setEditedUsers((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      setSuccessMessage("Usuario actualizado correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Error al guardar los cambios");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold text-[rgb(31,65,155)]">
        Usuarios Registrados
      </h3>

      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            {Object.keys(users[0] || {}).map((key) => (
              <th key={key} className="border-b-2 border-gray-300 text-left py-2">
                {key.toUpperCase()}
              </th>
            ))}
            <th className="border-b-2 border-gray-300 text-left py-2">CONTRASEÑA</th>
            <th className="border-b-2 border-gray-300 text-left py-2">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              {Object.entries(user).map(([key, value]) => (
                <td key={key} className="py-2">
                  {key === "rol" ? (
                    <select
                      value={editedUsers[user._id]?.[key] ?? value}
                      onChange={(e) =>
                        handleEditChange(user._id, key, e.target.value)
                      }
                      className="border border-gray-300 p-1 rounded"
                    >
                      <option value="USUARIO">Usuario</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editedUsers[user._id]?.[key] ?? value}
                      onChange={(e) =>
                        handleEditChange(user._id, key, e.target.value)
                      }
                      className="w-full border border-gray-300 p-1 rounded"
                    />
                  )}
                </td>
              ))}
              <td className="py-2">
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={editedUsers[user._id]?.pase || ""}
                  onChange={(e) =>
                    handleEditChange(user._id, "pase", e.target.value)
                  }
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </td>
              <td className="py-2">
                <button
                  onClick={() => handleSave(user._id)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
