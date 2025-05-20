import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_CONFIG = {
  ML_SERVICE: 'https://microservice-ia-production-b7cf.up.railway.app'
};

const getUserId = () => {
  const storedId = localStorage.getItem('userId');
  if (!storedId) {
    const newId = `user-${Date.now()}`;
    localStorage.setItem('userId', newId);
    return newId;
  }
  return storedId;
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
  const [serviceStatus, setServiceStatus] = useState('checking');

  useEffect(() => {
    const savedAnalyses = JSON.parse(localStorage.getItem('emotionAnalyses') || '[]');
    setAnalyses(savedAnalyses);
    checkMicroserviceStatus();
  }, []);

  const checkMicroserviceStatus = async () => {
    try {
      await axios.get(`${API_CONFIG.ML_SERVICE}/health`, {
        timeout: 3000
      });
      setServiceStatus('available');
    } catch (err) {
      console.log("Estado del microservicio:", err.message);
      setServiceStatus('unavailable');
      setError("El servicio de análisis no está disponible temporalmente");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = {
      'image/jpeg': true,
      'image/png': true,
      'image/jpg': true
    };

    if (!validTypes[file.type]) {
      setError("Formato no soportado. Use imágenes JPEG o PNG");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError(`La imagen es muy grande (${(file.size/1024/1024).toFixed(1)}MB). Máximo 3MB`);
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
    if (serviceStatus !== 'available') {
      setError("El servicio de análisis no está disponible");
      return;
    }

    if (!imageFile) {
      setError("Debes seleccionar una imagen primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const optimizedFile = await optimizeImage(imageFile);
      
      const formData = new FormData();
      formData.append('file', optimizedFile); // Cambiado de 'image' a 'file' para coincidir con el backend
      
      const response = await axios.post(
        `${API_CONFIG.ML_SERVICE}/analyze-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          timeout: 20000
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.error || "Respuesta inesperada del servidor");
      }

      const newAnalysis = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: response.data.data?.text || '',
        emotions: response.data.data?.emotions || {},
        dominantEmotion: response.data.data?.dominant_emotion || 'neutral',
        imageUrl: image
      };

      setAnalyses(prev => {
        const updated = [newAnalysis, ...prev.slice(0, 9)];
        localStorage.setItem('emotionAnalyses', JSON.stringify(updated));
        return updated;
      });

      setText(newAnalysis.text);
      setEmotions(newAnalysis.emotions);
      setDominantEmotion(newAnalysis.dominantEmotion);

    } catch (err) {
      console.error("Error completo:", {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });

      let errorMsg = "Error al procesar la imagen";
      if (err.response) {
        errorMsg = err.response.data?.error || 
                  `Error del servidor (${err.response.status})`;
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = "El servidor tardó demasiado en responder";
      } else if (err.message.includes('network')) {
        errorMsg = "Problema de conexión. Verifica tu internet";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      if (file.size <= 1 * 1024 * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.75);
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
      <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200">
        <p className="font-medium text-blue-800">
          Estado del servicio: 
          <span className={`ml-2 ${
            serviceStatus === 'available' ? 'text-green-600' : 'text-red-600'
          }`}>
            {serviceStatus === 'available' ? 'Disponible' : 'No disponible'}
          </span>
        </p>
        {serviceStatus !== 'available' && (
          <p className="text-sm text-blue-700 mt-1">
            {serviceStatus === 'checking' 
              ? "Verificando estado del servicio..." 
              : "El servicio de análisis podría estar temporalmente fuera de línea. Por favor intenta más tarde."}
          </p>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-6">Analizador de Emociones en Texto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50">
            {image ? (
              <img 
                src={image} 
                alt="Preview" 
                className="max-h-full max-w-full object-contain"
                onError={() => setError("Error al cargar la imagen")}
              />
            ) : (
              <span className="text-gray-500">Selecciona una imagen con texto</span>
            )}
          </div>

          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading || serviceStatus !== 'available'}
          />

          <button
            onClick={analyzeImage}
            disabled={!imageFile || loading || serviceStatus !== 'available'}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              !imageFile || loading || serviceStatus !== 'available'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando imagen...
              </span>
            ) : 'Analizar Imagen'}
          </button>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="font-medium text-red-700">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {text && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-bold mb-2 text-gray-800">Texto detectado:</h3>
              <p className="whitespace-pre-line text-gray-800 bg-white p-2 rounded">{text}</p>
            </div>
          )}

          {dominantEmotion && (
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
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

              {emotions && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Distribución de emociones:</h4>
                  {Object.entries(emotions)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center">
                        <span className="w-8 text-xl">
                          {EMOTION_ICONS[emotion] || '❓'}
                        </span>
                        <span className="w-28 text-gray-700">
                          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-blue-500"
                            style={{ width: `${score * 100}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-right text-gray-600 text-sm">
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tus análisis recientes</h2>
        {analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow">
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
                      {new Date(analysis.date).toLocaleDateString()}
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
            <p className="text-gray-500">No hay análisis recientes</p>
            <p className="text-sm text-gray-400 mt-1">Analiza una imagen para ver resultados aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}