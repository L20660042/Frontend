"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus } from "lucide-react";
import NavBar from "../components/NavBar.jsx";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [fullName, setFullName] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const validatePasswords = () => {
    return password === confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/users/register", {
        correo: email,
        pase: password,
        nombre: fullName,
        rol: "USUARIO" // Puedes cambiar a "ADMIN" si quieres registrar admins
      });

      if (response.status === 201) {
        alert("Usuario registrado exitosamente");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col">
      <NavBar />

      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Correo electrónico */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirmar contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Nombre completo */}
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Mensaje de error */}
            {error && <p className="text-red-600 text-center">{error}</p>}

            {/* Botón de enviar */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Crear cuenta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
