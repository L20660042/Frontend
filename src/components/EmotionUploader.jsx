import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const userId = getUserId();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/history?userId=${userId}`);
      setAnalyses(response.data);
    } catch (err) {
      console.error("Error al cargar análisis previos:", err);
      setError("No se pudo cargar el historial de análisis");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError("Solo se permiten imágenes JPEG o PNG");
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede pesar más de 5MB");
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
    if (!imageFile) {
      setError("Por favor selecciona una imagen primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('user_id', getUserId());

      console.log("Enviando imagen al microservicio...");
      const response = await axios.post(
        'https://microservice-ia-production-b7cf.up.railway.app/analyze-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log("Respuesta del microservicio:", response.data);
      
      if (response.data.success) {
        setText(response.data.data.text);
        setEmotions(response.data.data.emotions);
        setDominantEmotion(response.data.data.dominant_emotion);
        fetchAnalyses();
      } else {
        setError(response.data.error || "Error al analizar la imagen");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      console.error("Detalles del error:", err.response?.data);
      
      let errorMessage = "Error al procesar la imagen";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 413) {
        errorMessage = "La imagen es demasiado grande";
      } else if (err.response?.status === 415) {
        errorMessage = "Formato de imagen no soportado";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionSummary = (emotion) => {
    const emotionDescriptions = {
      anger: "El texto muestra signos de enfado o frustración.",
      disgust: "El texto expresa rechazo o aversión hacia algo.",
      fear: "El texto refleja preocupación o miedo ante una situación.",
      joy: "El texto transmite felicidad y emociones positivas.",
      neutral: "El texto tiene un tono neutro sin emociones marcadas.",
      sadness: "El texto expresa tristeza o melancolía.",
      surprise: "El texto muestra asombro o sorpresa ante algo inesperado."
    };
    
    return emotionDescriptions[emotion] || "No se pudo determinar una descripción para esta emoción.";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Analizador de Emociones en Texto de Imágenes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center h-64">
            {image ? (
              <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-gray-400">Selecciona una imagen con texto</span>
            )}
          </div>

          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            disabled={loading}
          />

          <button
            onClick={analyzeImage}
            disabled={!imageFile || loading}
            className={`w-full py-2 px-4 rounded font-medium ${
              !imageFile || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </span>
            ) : 'Analizar Imagen'}
          </button>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200">
              <p className="text-red-600 font-medium">Error:</p>
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {text && (
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h3 className="font-bold mb-2 text-gray-700">Texto detectado:</h3>
              <p className="whitespace-pre-line text-gray-800">{text}</p>
            </div>
          )}

          {dominantEmotion && (
            <div className="bg-white p-4 rounded shadow border border-gray-200">
              <div className="text-center mb-4">
                <span className="text-5xl block mb-2">
                  {EMOTION_ICONS[dominantEmotion] || '❓'}
                </span>
                <h3 className="text-xl font-bold text-gray-800">
                  {dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
                </h3>
                <p className="text-sm text-gray-500">Emoción dominante</p>
                <p className="mt-2 text-sm text-gray-600">
                  {getEmotionSummary(dominantEmotion)}
                </p>
              </div>

              <div className="space-y-2">
                {emotions && Object.entries(emotions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, score]) => (
                    <div key={emotion} className="flex items-center">
                      <span className="w-8 text-xl">
                        {EMOTION_ICONS[emotion] || '❓'}
                      </span>
                      <span className="w-32 text-gray-700">
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-blue-500"
                          style={{ width: `${score * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-16 text-right text-gray-600 text-sm">
                        {(score * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Historial de Análisis</h2>
        {analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => (
              <div key={analysis._id} className="border rounded p-4 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start mb-2">
                  <span className="text-2xl mr-2">
                    {EMOTION_ICONS[analysis.dominantEmotion] || '❓'}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {analysis.dominantEmotion.charAt(0).toUpperCase() + 
                       analysis.dominantEmotion.slice(1)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(analysis.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {analysis.imageUrl && (
                  <img 
                    src={analysis.imageUrl} 
                    alt="Análisis previo" 
                    className="w-full h-32 object-contain mb-2 border rounded"
                  />
                )}
                <p className="text-sm text-gray-700 line-clamp-3">{analysis.text}</p>
                <p className="text-xs text-gray-600 mt-2">
                  {getEmotionSummary(analysis.dominantEmotion)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500">No hay análisis previos</p>
            <p className="text-sm text-gray-400 mt-1">Analiza una imagen para ver resultados aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}