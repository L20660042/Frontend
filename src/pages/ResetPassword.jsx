import { useState } from "react";
import { Button } from "../components/ui/Button";
import Navbar from "../components/NavBar";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Si el correo existe, recibirás instrucciones para restablecer la contraseña.");
      } else {
        setError(data.message || "Error al solicitar restablecimiento.");
      }
    } catch (err) {
      setError("Error de red. Intenta de nuevo más tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Restablecer contraseña
        </h2>
        <form onSubmit={handleResetRequest} className="space-y-4">
          <input
            type="email"
            value={email}
            placeholder="Correo electrónico"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Solicitar restablecimiento
          </Button>
          {message && <p className="text-green-600 text-center">{message}</p>}
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
