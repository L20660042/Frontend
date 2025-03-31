import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Camera } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({
    nombre: "",
    correo: "",
    rol: "",
  });

  const [newNombre, setNewNombre] = useState("");
  const [newCorreo, setNewCorreo] = useState("");
  const [newPase, setNewPase] = useState("");

  // Obtener los datos del usuario
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setNewNombre(data.nombre);
        setNewCorreo(data.correo);
      } else {
        console.error("Error al obtener los datos del perfil");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  // Actualizar los datos del usuario
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: newNombre || undefined,
          correo: newCorreo || undefined,
          pase: newPase || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Perfil actualizado correctamente");

        // Actualiza el estado con los nuevos datos
        setUser((prev) => ({
          ...prev,
          nombre: newNombre || prev.nombre,
          correo: newCorreo || prev.correo,
        }));

        setNewPase("");
      } else {
        alert(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <img
          src="/image/perfil.png"
          alt="Imagen de perfil"
          className="w-32 h-32 rounded-full object-cover"
        />
        <Button className="absolute bottom-0 right-0 bg-[rgb(31,65,155)] text-white p-2 rounded-full">
          <Camera className="w-5 h-5" />
        </Button>
      </div>

      {/* Información del perfil */}
      <p className="text-lg text-gray-800 font-semibold mb-2">
        {user.rol ? `Rol: ${user.rol}` : "Rol no especificado"}
      </p>

      {/* Formulario de perfil */}
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <p className="text-sm text-gray-400 uppercase">Nombre</p>
          <input
            type="text"
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Tu nombre"
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400 uppercase">Correo</p>
          <input
            type="email"
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Tu correo"
            value={newCorreo}
            onChange={(e) => setNewCorreo(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-400 uppercase">Nueva contraseña</p>
          <input
            type="password"
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Nueva contraseña"
            value={newPase}
            onChange={(e) => setNewPase(e.target.value)}
          />
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-[rgb(31,65,155)] text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={handleUpdate}
          >
            GUARDAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
