import { useState } from "react";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
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
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Solicitar restablecimiento de contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
          Enviar enlace de restablecimiento
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
