import { useState, useEffect } from "react";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
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
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ color: "#333", textAlign: "center", marginBottom: "1rem" }}>
        Restablecer contraseña
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #aaa",
            borderRadius: 4,
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={!token}
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: "1rem",
            cursor: token ? "pointer" : "not-allowed",
            opacity: token ? 1 : 0.6,
          }}
        >
          Restablecer
        </button>
      </form>
      {message && (
        <p style={{ color: "green", marginTop: "1rem", textAlign: "center" }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}
