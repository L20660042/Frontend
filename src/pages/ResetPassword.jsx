import { useState, useEffect } from "react";
import Navbar from "../components/NavBar"; // adjust path as needed

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // window.location.hash example: "#/reset-password?token=abc123"
    const hash = window.location.hash;
    const queryString = hash.includes("?") ? hash.substring(hash.indexOf("?")) : "";
    const params = new URLSearchParams(queryString);
    const t = params.get("token");
    if (t) setToken(t);
    else setError("Token no proporcionado.");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Contraseña restablecida correctamente.");
      } else {
        setError(data.message || "Error al restablecer la contraseña.");
      }
    } catch (err) {
      setError("Error de red. Intenta de nuevo más tarde.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Restablecer contraseña</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!token}
              className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Restablecer
            </button>
          </form>
          {message && (
            <p className="text-green-600 text-center mt-4 font-semibold">{message}</p>
          )}
          {error && (
            <p className="text-red-600 text-center mt-4 font-semibold">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
