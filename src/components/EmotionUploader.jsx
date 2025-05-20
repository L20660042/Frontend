import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración de endpoints
const API_CONFIG = {
  BACKEND: 'https://backend-production-e954.up.railway.app',
  ML_SERVICE: 'https://microservice-ia-production-b7cf.up.railway.app'
};

const getUserId = () => {
  return localStorage.getItem('userId') || 'default-user-id';
};

const EMOTION_ICONS = {
  anger: '😠',
  disgust: '🤢',
  fear: '😨',
  joy: '😄',
  neutral: '😐',
  sadness: '😢',
  surprise: '😮'
};

export default function EmotionUploader() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState('');
  const [emotions, setEmotions] = useState(null);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [apiStatus, setApiStatus] = useState({
    backend: 'unknown',
    mlService: 'unknown'
  });

  // Verificar estado de los APIs
  useEffect(() => {
    checkApiStatus();
    fetchAnalyses();
  }, []);

  const checkApiStatus = async () => {
    try {
      // Verificar backend principal
      await axios.get(`${API_CONFIG.BACKEND}/health`);
      setApiStatus(prev => ({...prev, backend: 'healthy'}));
    } catch (err) {
      setApiStatus(prev => ({...prev, backend: 'unavailable'}));
      console.error("Backend no disponible:", err);
    }

    try {
      // Verificar microservicio
      await axios.get(`${API_CONFIG.ML_SERVICE}/health`);
      setApiStatus(prev => ({...prev, mlService: 'healthy'}));
    } catch (err) {
      setApiStatus(prev => ({...prev, mlService: 'unavailable'}));
      console.error("Microservicio no disponible:", err);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const userId = getUserId();
      const response = await axios.get(`${API_CONFIG.BACKEND}/api/history`, {
        params: { userId },
        validateStatus: (status) => status < 500 // No marcar como error si es 404
      });
      
      if (response.status === 200) {
        setAnalyses(response.data);
      } else {
        console.log("Endpoint /api/history no encontrado, usando almacenamiento local");
        const localAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
        setAnalyses(localAnalyses);
      }
    } catch (err) {
      console.error("Error al cargar análisis:", err);
      setError("No se pudo cargar el historial");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones estrictas
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 4 * 1024 * 1024; // 4MB

    if (!validTypes.includes(file.type)) {
      setError(`Formato no soportado. Use JPEG o PNG (recibido: ${file.type})`);
      return;
    }

    if (file.size > maxSize) {
      setError(`Imagen demasiado grande (${(file.size/1024/1024).toFixed(1)}MB). Máximo 4MB`);
      return;
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setText('');
    setEmotions(null);
    setDominantEmotion(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (apiStatus.mlService !== 'healthy') {
      setError("El servicio de análisis no está disponible");
      return;
    }

    if (!imageFile) {
      setError("Seleccione una imagen válida");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convertir imagen a formato compatible
      const compressedImage = await compressImage(imageFile);
      
      const formData = new FormData();
      formData.append('file', compressedImage); // Prueba con 'file' o 'image'
      formData.append('userId', getUserId());

      // Encabezados específicos para el microservicio
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-API-Key': 'tu-api-key-si-es-necesario' // Añadir si requiere autenticación
        },
        timeout: 15000
      };

      const response = await axios.post(
        `${API_CONFIG.ML_SERVICE}/analyze-image`,
        formData,
        config
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || "Respuesta inválida del servidor");
      }

      // Guardar análisis localmente
      const newAnalysis = {
        _id: Date.now().toString(),
        text: response.data.data.text,
        emotions: response.data.data.emotions,
        dominantEmotion: response.data.data.dominant_emotion,
        createdAt: new Date().toISOString(),
        imageUrl: image
      };

      setAnalyses(prev => {
        const updated = [newAnalysis, ...prev];
        localStorage.setItem('analyses', JSON.stringify(updated));
        return updated;
      });

      setText(response.data.data.text);
      setEmotions(response.data.data.emotions);
      setDominantEmotion(response.data.data.dominant_emotion);

    } catch (err) {
      console.error("Error completo:", {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });

      let errorMsg = "Error al analizar la imagen";
      if (err.response) {
        errorMsg = err.response.data?.detail || 
                 err.response.data?.message || 
                 `Error del servidor (${err.response.status})`;
      } else if (err.message.includes('timeout')) {
        errorMsg = "El servidor tardó demasiado en responder";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Función para comprimir imágenes
  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (file.size <= 1 * 1024 * 1024) { // Si ya es menor a 1MB
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.7);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const getEmotionSummary = (emotion) => {
    const descriptions = {
      anger: "Contenido con signos de enfado o frustración.",
      disgust: "Expresa rechazo o aversión hacia algo.",
      fear: "Refleja preocupación o miedo.",
      joy: "Transmite emociones positivas.",
      neutral: "Tono neutro sin emociones marcadas.",
      sadness: "Expresa tristeza o melancolía.",
      surprise: "Muestra asombro ante algo inesperado."
    };
    return descriptions[emotion] || "Emoción no clasificada.";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Status de APIs */}
      <div className="mb-4 flex gap-4 text-sm">
        <span>Backend: 
          <span className={`ml-2 font-medium ${
            apiStatus.backend === 'healthy' ? 'text-green-600' : 'text-red-600'
          }`}>
            {apiStatus.backend === 'healthy' ? 'Disponible' : 'No disponible'}
          </span>
        </span>
        <span>Microservicio: 
          <span className={`ml-2 font-medium ${
            apiStatus.mlService === 'healthy' ? 'text-green-600' : 'text-red-600'
          }`}>
            {apiStatus.mlService === 'healthy' ? 'Disponible' : 'No disponible'}
          </span>
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-6">Analizador de Emociones</h1>

      {/* Resto del código de interfaz... */}
      {/* ... (mantener el mismo JSX de renderizado que tenías antes) ... */}
    </div>
  );
}