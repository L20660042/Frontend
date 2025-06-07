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

  if (loading) return <p className="text-center text-gray-600">Cargando usuarios...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h3 className="text-3xl font-semibold text-blue-700 mb-6">Usuarios Registrados</h3>

      {/* Success and error messages */}
      {successMessage && (
        <p className="bg-green-200 text-green-800 p-2 rounded-md text-center mb-4">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="bg-red-200 text-red-800 p-2 rounded-md text-center mb-4">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              {Object.keys(users[0] || {}).map((key) => (
                <th key={key} className="py-2 px-4 border-b">{key.toUpperCase()}</th>
              ))}
              <th className="py-2 px-4 border-b">CONTRASEÑA</th>
              <th className="py-2 px-4 border-b">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-100">
                {Object.entries(user).map(([key, value]) => (
                  <td key={key} className="py-2 px-4">
                    {key === "rol" ? (
                      <select
                        value={editedUsers[user._id]?.[key] ?? value}
                        onChange={(e) =>
                          handleEditChange(user._id, key, e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded w-full"
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
                <td className="py-2 px-4">
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
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleSave(user._id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
