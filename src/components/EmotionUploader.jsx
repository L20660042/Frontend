import React, { useState, useEffect } from "react";
import axios from "axios";

const getUserId = () => {
  return localStorage.getItem('userId') || '64a2b7dc8f293ae5520e8f5e';
};

export default function EmotionAnalyzer() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [emotionResults, setEmotionResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyses, setAnalyses] = useState([]);

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
    if (!imageFile) {
      setError("Por favor selecciona una imagen primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('userId', getUserId());

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/emotion-analysis/analyze`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        const { emotionResults, dominantEmotion } = response.data.data;
        setEmotionResults(emotionResults);
        setDominantEmotion(dominantEmotion);
        fetchUserAnalyses();
      } else {
        setError("Error al analizar la imagen");
      }
    } catch (err) {
      setError(`Error: ${err.message || "Ocurrió un problema al analizar"}`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionIcon = (emotion) => {
    const icons = {
      'joy': '😄', 'happy': '😊', 'sadness': '😢', 'anger': '😠',
      'fear': '😨', 'surprise': '😮', 'neutral': '😐', 'disgust': '🤢',
      'Alegría': '😄', 'Tristeza': '😢', 'Enojo': '😠', 'Miedo': '😨',
      'Sorpresa': '😮', 'Neutral': '😐'
    };
    return icons[emotion] || '❓';
  };

  const normalizeEmotionName = (emotion) => {
    const mapping = {
      'joy': 'Alegría', 'happy': 'Alegría', 'sadness': 'Tristeza',
      'anger': 'Enojo', 'fear': 'Miedo', 'surprise': 'Sorpresa',
      'neutral': 'Neutral', 'disgust': 'Disgusto'
    };
    return mapping[emotion.toLowerCase()] || emotion;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Analizador de Emociones</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-6 shadow-md border">
            <div className="border rounded-lg h-64 flex items-center justify-center overflow-hidden mb-4">
              {image ? (
                <img src={image} alt="Imagen para análisis" className="max-h-full object-contain" />
              ) : (
                <div className="text-4xl text-gray-300">📸</div>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              onClick={analyzeContent}
              disabled={!imageFile || loading}
              className={`py-2 px-4 rounded font-medium w-full ${
                (!imageFile || loading)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Analizando...' : 'Analizar Emociones'}
            </button>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

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

                <div className="space-y-3">
                  {Object.entries(emotionResults)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, percent]) => (
                      <div key={emotion} className="flex items-center gap-2">
                        <span className="w-6 text-center">{getEmotionIcon(emotion)}</span>
                        <span className="w-20">{normalizeEmotionName(emotion)}</span>
                        <div className="flex-1 bg-gray-200 rounded h-2">
                          <div className="bg-blue-600 h-2 rounded" style={{ width: `${percent}%` }}></div>
                        </div>
                        <span className="w-10 text-right">{percent.toFixed(1)}%</span>
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
              <p className="text-center text-gray-500">No hay análisis previos disponibles</p>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {analyses.map((analysis) => (
                  <div key={analysis._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getEmotionIcon(analysis.dominantEmotion)}</span>
                      <div>
                        <h4 className="font-medium">{normalizeEmotionName(analysis.dominantEmotion)}</h4>
                        <p className="text-xs text-gray-500">{new Date(analysis.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="h-20 overflow-hidden rounded border">
                      <img src={analysis.imageUrl} alt="Análisis" className="w-full h-full object-cover" />
                    </div>
                    {analysis.emotionResults && (
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                        {Object.entries(analysis.emotionResults)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 4)
                          .map(([emotion, percent]) => (
                            <div key={emotion} className="flex items-center gap-1">
                              <span>{getEmotionIcon(emotion)}</span>
                              <span className="truncate">{normalizeEmotionName(emotion)}</span>
                              <span className="ml-auto font-medium">{percent.toFixed(1)}%</span>
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