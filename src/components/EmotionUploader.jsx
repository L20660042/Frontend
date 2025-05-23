import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_CONFIG = {
  ML_SERVICE: process.env.REACT_APP_ML_API || 'https://microservice-ia-production-b7cf.up.railway.app',
  BACKEND: process.env.REACT_APP_BACKEND_API || 'https://backend-production-e954.up.railway.app'
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
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    checkMicroserviceStatus();
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BACKEND}/analysis/all`, {
        timeout: 5000
      });
      setAnalyses(response.data);
      localStorage.setItem('emotionAnalyses', JSON.stringify(response.data));
      setSaveStatus('loaded');
    } catch (e) {
      console.error("Error loading history:", e);
      const saved = localStorage.getItem('emotionAnalyses');
      if (saved) {
        setAnalyses(JSON.parse(saved));
        setSaveStatus('local');
      } else {
        setSaveStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkMicroserviceStatus = async () => {
    try {
      setServiceStatus('checking');
      const res = await axios.get(`${API_CONFIG.ML_SERVICE}/health`, {
        timeout: 5000
      });
      setServiceStatus(res.data.model_loaded ? 'available' : 'loading');
    } catch (err) {
      console.error("Status check failed:", err);
      setServiceStatus('unavailable');
      setError("Servicio no disponible. Intente más tarde.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError("Solo se aceptan JPEG o PNG");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError(`Imagen demasiado grande (${(file.size/1024/1024).toFixed(1)}MB). Máx: 3MB`);
      return;
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));
    resetResults();
  };

  const resetResults = () => {
    setText('');
    setEmotions(null);
    setDominantEmotion(null);
    setError(null);
    setSelectedAnalysis(null);
    setSaveStatus(null);
  };

  const analyzeImage = async () => {
    if (!imageFile || loading) return;

    setLoading(true);
    setError(null);
    setSaveStatus(null);

    try {
      // 1. Procesar imagen con ML
      const formData = new FormData();
      formData.append('file', imageFile);

      const mlResponse = await axios.post(
        `${API_CONFIG.ML_SERVICE}/analyze-image`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );

      if (!mlResponse.data?.success) {
        throw new Error(mlResponse.data?.error || "Error en el análisis");
      }

      const { text, emotions, dominant_emotion } = mlResponse.data.data;

      // 2. Guardar en backend
      try {
        const backendResponse = await axios.post(
          `${API_CONFIG.BACKEND}/analysis/save`,
          {
            imageUrl: image,
            text,
            emotions,
            dominantEmotion: dominant_emotion
          },
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // 3. Actualizar estado
        const newAnalysis = backendResponse.data;
        setAnalyses(prev => [newAnalysis, ...prev.slice(0, 9)]);
        setSaveStatus('saved');
        
        // 4. Mostrar resultados
        displayResults(text, emotions, dominant_emotion);
        
      } catch (backendError) {
        console.error("Backend save error:", backendError);
        // Fallback a localStorage
        const fallbackAnalysis = {
          _id: Date.now().toString(),
          imageUrl: image,
          text,
          emotions,
          dominantEmotion: dominant_emotion,
          date: new Date().toISOString()
        };
        setAnalyses(prev => [fallbackAnalysis, ...prev.slice(0, 9)]);
        localStorage.setItem('emotionAnalyses', JSON.stringify([fallbackAnalysis, ...analyses.slice(0, 9)]));
        setSaveStatus('local');
        displayResults(text, emotions, dominant_emotion);
      }

    } catch (err) {
      handleError(err);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysis = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BACKEND}/analysis/${id}`, {
        timeout: 5000
      });
      setSelectedAnalysis(response.data);
      displayResults(
        response.data.text,
        response.data.emotions,
        response.data.dominantEmotion
      );
      if (response.data.imageUrl) setImage(response.data.imageUrl);
    } catch (err) {
      console.error("Error loading analysis:", err);
      setError("No se pudo cargar el análisis");
    } finally {
      setLoading(false);
    }
  };

  const displayResults = (text, emotions, dominantEmotion) => {
    setText(text);
    setEmotions(emotions);
    setDominantEmotion(dominantEmotion);
  };

  const handleError = (err) => {
    console.error("Error:", err);
    
    let errorMsg = "Error al procesar la imagen";
    if (err.response) {
      errorMsg = err.response.data?.error || `Error ${err.response.status}`;
    } else if (err.code === 'ECONNABORTED') {
      errorMsg = "Tiempo de espera agotado";
    } else if (err.message.includes('network')) {
      errorMsg = "Error de conexión";
    }

    setError(errorMsg);
  };

  const getEmotionSummary = (emotion) => {
    const descriptions = {
      anger: "Contenido con signos de enfado",
      disgust: "Expresa rechazo o aversión",
      fear: "Refleja preocupación o miedo",
      joy: "Transmite emociones positivas",
      neutral: "Tono neutro",
      sadness: "Expresa tristeza",
      surprise: "Muestra asombro"
    };
    return descriptions[emotion] || "Emoción no clasificada";
  };

  const renderStatusBadge = () => {
    if (!saveStatus) return null;
    
    const statusConfig = {
      saved: { text: "Guardado en la nube", color: "bg-green-100 text-green-800" },
      local: { text: "Guardado localmente", color: "bg-yellow-100 text-yellow-800" },
      loaded: { text: "Datos cargados", color: "bg-blue-100 text-blue-800" },
      error: { text: "Error al guardar", color: "bg-red-100 text-red-800" }
    };

    return (
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusConfig[saveStatus].color}`}>
        {statusConfig[saveStatus].text}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Status Bars */}
      <div className="flex flex-col gap-2 mb-4">
        <div className={`p-3 rounded-md ${
          serviceStatus === 'available' ? 'bg-green-50 border-green-200' :
          serviceStatus === 'unavailable' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        } border`}>
          <p className="font-medium">
            Estado del servicio: 
            <span className={`ml-2 ${
              serviceStatus === 'available' ? 'text-green-600' :
              serviceStatus === 'unavailable' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {serviceStatus === 'available' ? 'Disponible' :
              serviceStatus === 'unavailable' ? 'No disponible' :
              'Verificando...'}
            </span>
          </p>
        </div>
        
        {saveStatus && (
          <div className="flex items-center p-3 rounded-md bg-gray-50 border border-gray-200">
            <p className="font-medium">Estado de almacenamiento:</p>
            {renderStatusBadge()}
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-6">Analizador de Emociones en Texto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50">
            {image ? (
              <img 
                src={image} 
                alt="Preview" 
                className="max-h-full max-w-full object-contain"
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
            className={`w-full py-3 px-4 rounded-md font-medium ${
              !imageFile || loading || serviceStatus !== 'available'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : 'Analizar Imagen'}
          </button>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {text && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Texto detectado:</h3>
                {saveStatus && renderStatusBadge()}
              </div>
              <p className="whitespace-pre-line bg-white p-2 rounded">{text}</p>
            </div>
          )}

          {dominantEmotion && (
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <span className="text-5xl block mb-2">
                  {EMOTION_ICONS[dominantEmotion] || '❓'}
                </span>
                <h3 className="text-xl font-bold">
                  {dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {getEmotionSummary(dominantEmotion)}
                </p>
              </div>

              {emotions && (
                <div className="space-y-2">
                  <h4 className="font-medium">Distribución:</h4>
                  {Object.entries(emotions)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center">
                        <span className="w-8 text-xl">{EMOTION_ICONS[emotion]}</span>
                        <span className="w-28">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-blue-500"
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm">
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

      {/* History Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Tus análisis recientes</h2>
        {analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => (
              <div 
                key={analysis._id} 
                className={`border rounded-md p-4 bg-white hover:shadow-md cursor-pointer transition-all ${
                  selectedAnalysis?._id === analysis._id ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
                }`}
                onClick={() => loadAnalysis(analysis._id)}
              >
                <div className="flex items-start mb-2">
                  <span className="text-2xl mr-2">
                    {EMOTION_ICONS[analysis.dominantEmotion]}
                  </span>
                  <div>
                    <h4 className="font-medium">
                      {analysis.dominantEmotion.charAt(0).toUpperCase() + 
                      analysis.dominantEmotion.slice(1)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(analysis.date).toLocaleString()}
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
                <p className="text-sm line-clamp-3">{analysis.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500">No hay análisis recientes</p>
          </div>
        )}
      </div>
    </div>
  );
}