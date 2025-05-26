import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Mail, Key } from "lucide-react";
import { Button } from "../components/ui/Button";
import Navbar from "../components/NavBar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Por favor ingresa un correo válido");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // Usar la URL desde la variable de entorno
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: email, pase: password })
      });

      const data = await response.json();

      // Verificar respuesta
      if (response.ok && data.token && data.role) {
        // Almacenar el token y rol en el localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
      
        // Redirigir según el rol
        redirectBasedOnRole(data.role);
      } else {
        setErrorMessage(data.message || "Credenciales incorrectas o rol no encontrado.");
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error al intentar iniciar sesión. Intenta nuevamente.");
    }
  };

  // Función auxiliar para redirigir según el rol
  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "USUARIO":
        navigate("/Usuario");
        break;
      case "ADMIN":
        navigate("/Admin");
        break;
      default:
        setErrorMessage("No tienes permisos para acceder.");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative w-full">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="relative w-full">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Iniciar sesión
            </Button>
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
          </form>
          <div className="mt-4">
            <Link to="/registro" className="text-blue-600 hover:underline">
              <Button className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 mb-4">
                Crear cuenta
              </Button>
            </Link>
          </div>
          <p className="text-sm text-center text-gray-600 mt-4">
            <Link to="/reset-password" className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
