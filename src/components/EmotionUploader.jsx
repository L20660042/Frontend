// EmotionAnalyzer.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Obtenemos el ID del usuario desde el contexto o localStorage
const getUserId = () => {
  // En un escenario real, obtendrías esto del sistema de autenticación
  return localStorage.getItem('userId') || '64a2b7dc8f293ae5520e8f5e'; // ID de ejemplo
};

export default function EmotionAnalyzer() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState('');
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [emotionResults, setEmotionResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [activeTab, setActiveTab] = useState('image'); // 'image' o 'text'

  // Cargar análisis previos del usuario
  useEffect(() => {
    fetchUserAnalyses();
  }, []);

  const fetchUserAnalyses = async () => {
    try {
      const userId = getUserId();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/emotion-analysis/analyze/${userId}`);
      if (response.data.success) {
        setAnalyses(response.data.data);
      }
    } catch (err) {
      console.error("Error al cargar análisis previos:", err);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setDominantEmotion(null);
      setEmotionResults(null);
      setError(null);
    }
  };

  const analyzeContent = async () => {
    if ((activeTab === 'image' && !imageFile) || (activeTab === 'text' && !text.trim())) {
      setError(activeTab === 'image' 
        ? "Por favor selecciona una imagen primero" 
        : "Por favor escribe un texto primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (activeTab === 'image' && imageFile) {
        formData.append('image', imageFile);
      }
      if (activeTab === 'text' && text.trim()) {
        formData.append('text', text.trim());
      }
      formData.append('userId', getUserId());

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/emotion-analysis/analyze`, 
        formData, 
        {
          headers: {
            'Content-Type': activeTab === 'image' ? 'multipart/form-data' : 'application/json',
          },
        }
      );

      if (response.data.success) {
        const { emotionResults, dominantEmotion } = response.data.data;
        setEmotionResults(emotionResults);
        setDominantEmotion(dominantEmotion);
        
        // Actualizar la lista de análisis
        fetchUserAnalyses();
      } else {
        setError("Error al analizar el contenido");
      }
    } catch (err) {
      setError(`Error: ${err.message || "Ocurrió un problema al analizar"}`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar el ícono correspondiente a la emoción
  const getEmotionIcon = (emotion) => {
    const icons = {
      'joy': '😄',
      'happy': '😊',
      'sadness': '😢',
      'anger': '😠',
      'fear': '😨',
      'surprise': '😮',
      'neutral': '😐',
      'disgust': '🤢',
      'Alegría': '😄',
      'Tristeza': '😢',
      'Enojo': '😠',
      'Miedo': '😨',
      'Sorpresa': '😮',
      'Neutral': '😐',
    };
    return icons[emotion] || '❓';
  };

  // Normalizar nombres de emociones para consistencia
  const normalizeEmotionName = (emotion) => {
    const mapping = {
      'joy': 'Alegría',
      'happy': 'Alegría',
      'sadness': 'Tristeza',
      'anger': 'Enojo',
      'fear': 'Miedo',
      'surprise': 'Sorpresa',
      'neutral': 'Neutral',
      'disgust': 'Disgusto'
    };
    return mapping[emotion.toLowerCase()] || emotion;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Analizador de Emociones</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Panel de análisis */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-6 shadow-md border">
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'image' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('image')}
              >
                Analizar Imagen
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('text')}
              >
                Analizar Texto
              </button>
            </div>

            {activeTab === 'image' ? (
              <>
                {/* Muestra la imagen seleccionada */}
                <div className="border rounded-lg h-64 flex items-center justify-center overflow-hidden mb-4">
                  {image ? (
                    <img 
                      src={image} 
                      alt="Imagen para análisis" 
                      className="max-h-full object-contain" 
                    />
                  ) : (
                    <div className="text-4xl text-gray-300">📸</div>
                  )}
                </div>

                {/* Formulario para subir una imagen */}
                <div className="flex flex-col gap-3 mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </>
            ) : (
              <div className="mb-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribe un texto para analizar emociones..."
                  className="w-full p-3 border rounded h-40"
                />
              </div>
            )}

            <button
              onClick={analyzeContent}
              disabled={
                (activeTab === 'image' && !imageFile) || 
                (activeTab === 'text' && !text.trim()) || 
                loading
              }
              className={`py-2 px-4 rounded font-medium w-full ${
                ((activeTab === 'image' && !imageFile) || 
                (activeTab === 'text' && !text.trim()) || 
                loading)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Analizando...' : 'Analizar Emociones'}
            </button>
            
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            {/* Resultado del análisis */}
            {dominantEmotion && emotionResults && (
              <div className="border-t pt-4 mt-4">
                <div className="mb-4 text-center">
                  <div className="text-5xl mb-2">
                    {getEmotionIcon(dominantEmotion)}
                  </div>
                  <h4 className="text-2xl font-bold text-green-600">
                    {normalizeEmotionName(dominantEmotion)}
                  </h4>
                  <p className="text-sm text-gray-500">Emoción Dominante</p>
                </div>

                {/* Gráfico de emociones */}
                <div className="space-y-3">
                  {Object.entries(emotionResults)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, percent]) => (
                      <div key={emotion} className="flex items-center gap-2">
                        <span className="w-6 text-center">
                          {getEmotionIcon(emotion)}
                        </span>
                        <span className="w-20">
                          {normalizeEmotionName(emotion)}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded h-2">
                          <div
                            className="bg-blue-600 h-2 rounded"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="w-10 text-right">
                          {percent.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historial de análisis */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-6 shadow-md border">
            <h3 className="text-xl font-bold mb-4 text-center">Historial de Análisis</h3>
            
            {analyses.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay análisis previos disponibles
              </p>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {analyses.map((analysis) => (
                  <div key={analysis._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {getEmotionIcon(analysis.dominantEmotion)}
                      </span>
                      <div>
                        <h4 className="font-medium">
                          {normalizeEmotionName(analysis.dominantEmotion)}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(analysis.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {analysis.imageUrl ? (
                      <div className="h-20 overflow-hidden rounded border">
                        <img 
                          src={analysis.imageUrl} 
                          alt="Análisis" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border text-sm text-gray-700 overflow-hidden">
                        <p className="line-clamp-3">
                          {analysis.text || "Texto no disponible"}
                        </p>
                      </div>
                    )}
                    
                    {analysis.emotionResults && (
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                        {Object.entries(analysis.emotionResults)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 4)
                          .map(([emotion, percent]) => (
                            <div key={emotion} className="flex items-center gap-1">
                              <span>{getEmotionIcon(emotion)}</span>
                              <span className="truncate">
                                {normalizeEmotionName(emotion)}
                              </span>
                              <span className="ml-auto font-medium">
                                {percent.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}