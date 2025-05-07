import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmotionUploader() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [userName, setUserName] = useState(""); // Estado para almacenar el nombre del usuario

  // Obtener el nombre del usuario (puedes modificarlo según tu lógica, por ejemplo, desde el localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.nombre); // Almacena el nombre del usuario
        } else {
          console.error("Error al obtener los datos del perfil");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!userName) {
      alert('Por favor, asegúrate de que el usuario esté logueado.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('user', userName); // Usa el nombre del usuario en lugar de un valor fijo

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL_IA}/emotion/upload`, formData, { withCredentials: true });
      setResult(res.data);
    } catch (error) {
      console.error('Error al subir la imagen:', error.response || error.message);
      alert('Hubo un error al procesar la imagen. Intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange} />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Analizar emoción
      </button>
      {result && (
        <div>
          <p><strong>Emoción detectada:</strong> {result.emotion}</p>
          <pre>{JSON.stringify(result.details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default EmotionUploader;
