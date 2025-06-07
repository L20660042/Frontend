import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, User, Mail, Lock, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card2";
import { Button } from "../components/ui/button2";

export default function ProfilePage() {
  const [user, setUser] = useState({
    nombre: "",
    correo: "",
  });

  const [newNombre, setNewNombre] = useState("");
  const [newCorreo, setNewCorreo] = useState("");
  const [newPase, setNewPase] = useState(""); // Este es el campo para cambiar la contraseña
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Hook para redirigir

  // Obtener los datos del usuario desde el backend o localStorage
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data); // Guardamos los datos del usuario
        setNewNombre(data.nombre);
        setNewCorreo(data.correo);
      } else {
        const errorData = await response.json();
        console.error("Error al obtener los datos del perfil:", errorData.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  // Actualizar los datos del usuario
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token no encontrado en localStorage");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: newNombre || undefined,
          correo: newCorreo || undefined,
          pase: newPase || undefined, // Solo enviamos la nueva contraseña si fue ingresada
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

        setNewPase(""); // Limpiar el campo de contraseña
      } else {
        alert(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener el rol del usuario
  const userRole = JSON.parse(localStorage.getItem("user"))?.role || "USUARIO"; // Asumimos que el rol está en localStorage

  // Redirigir al Dashboard correspondiente
  const handleGoBack = () => {
    if (userRole === "ADMIN") {
      navigate("/Admin");  // Redirige a la pantalla de Admin
    } else {
      navigate("/Usuario");  // Redirige a la pantalla de Usuario
    }
  };

  useEffect(() => {
    fetchUserData(); // Llamamos a la API para cargar los datos del perfil
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-4 hover:bg-blue-50"
              onClick={handleGoBack}  // Llamamos a la función para redirigir
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver Atrás
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mi Perfil
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-800">Información Personal</CardTitle>
            <p className="text-gray-600">Actualiza tu información de perfil</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 uppercase tracking-wide">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 text-gray-800 bg-white/80"
                  placeholder="Ingresa tu nombre completo"
                  value={newNombre || user.nombre}
                  onChange={(e) => setNewNombre(e.target.value)} // Permite modificar el nombre
                />
              </div>
            </div>

            {/* Campo Correo */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 uppercase tracking-wide">
                <Mail className="w-4 h-4 mr-2 text-purple-500" />
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300 text-gray-800 bg-white/80"
                  placeholder="tu@email.com"
                  value={newCorreo || user.correo}
                  onChange={(e) => setNewCorreo(e.target.value)} // Permite modificar el correo
                />
              </div>
            </div>

            {/* Campo Nueva Contraseña */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 uppercase tracking-wide">
                <Lock className="w-4 h-4 mr-2 text-pink-500" />
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all duration-300 text-gray-800 bg-white/80"
                  placeholder="Deja en blanco para mantener la actual"
                  value={newPase}
                  onChange={(e) => setNewPase(e.target.value)} // Permite cambiar la contraseña
                />
              </div>
            </div>

            {/* Información Actual */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-2">Información Actual:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Nombre:</span> {user.nombre || "No especificado"}
                </p>
                <p>
                  <span className="font-medium">Correo:</span> {user.correo || "No especificado"}
                </p>
              </div>
            </div>

            {/* Botón Guardar */}
            <div className="pt-6">
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Save className="w-5 h-5 mr-2" />
                    GUARDAR CAMBIOS
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
    </div>
  );
}
