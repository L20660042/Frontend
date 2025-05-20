import React, { useState, useEffect } from "react";
import axios from "axios";

const getUserId = () => {
  return localStorage.getItem('userId') || 'default-user-id';
};

const EMOTION_COLORS = {
  anger: 'bg-red-100 text-red-800',
  disgust: 'bg-green-100 text-green-800',
  fear: 'bg-purple-100 text-purple-800',
  joy: 'bg-yellow-100 text-yellow-800',
  neutral: 'bg-gray-100 text-gray-800',
  sadness: 'bg-blue-100 text-blue-800',
  surprise: 'bg-pink-100 text-pink-800',
};

export default function EmotionAnalyzer() {
  const [text, setText] = useState('');
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [emotionResults, setEmotionResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [activeTab, setActiveTab] = useState('analyze');

  useEffect(() => {
    fetchUserAnalyses();
  }, []);

  const fetchUserAnalyses = async () => {
    try {
      const userId = getUserId();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/emotion-analysis/history?userId=${userId}`
      );
      if (response.data) {
        setAnalyses(response.data);
      }
    } catch (err) {
      console.error("Error al cargar análisis previos:", err);
    }
  };

  const analyzeText = async () => {
    if (!text || text.trim().length === 0) {
      setError("Por favor ingresa un texto primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/emotion-analysis/analyze`,
        { text, userId: getUserId() }
      );

      if (response.data.success) {
        const { emotions, dominantEmotion } = response.data.data;
        setEmotionResults(emotions);
        setDominantEmotion(dominantEmotion);
        fetchUserAnalyses();
      } else {
        setError(response.data.error || "Error al analizar el texto");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al conectar con el servidor");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionIcon = (emotion) => {
    const icons = {
      'joy': '😄',
      'anger': '😠',
      'sadness': '😢',
      'fear': '😨',
      'disgust': '🤢',
      'surprise': '😮',
      'neutral': '😐'
    };
    return icons[emotion.toLowerCase()] || '❓';
  };

  const normalizeEmotionName = (emotion) => {
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Analizador de Emociones en Texto</h1>

      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'analyze' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('analyze')}
        >
          Analizar Texto
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('history')}
        >
          Historial
        </button>
      </div>

      {activeTab === 'analyze' ? (
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresa el texto a analizar:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escribe aquí tu texto en inglés para analizar las emociones..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {text.length} caracteres (máx. 2000)
            </p>
          </div>

          <button
            onClick={analyzeText}
            disabled={!text || loading}
            className={`py-2 px-4 rounded font-medium w-full ${
              !text || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Analizando...' : 'Analizar Emociones'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {dominantEmotion && emotionResults && (
            <div className="mt-6 border-t pt-4">
              <div className="mb-6 text-center">
                <div className="text-5xl mb-2">
                  {getEmotionIcon(dominantEmotion)}
                </div>
                <h4 className="text-2xl font-bold text-gray-800">
                  {normalizeEmotionName(dominantEmotion)}
                </h4>
                <p className="text-sm text-gray-500">Emoción Dominante</p>
              </div>

              <div className="space-y-3">
                {Object.entries(emotionResults)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, percent]) => (
                    <div key={emotion} className="flex items-center gap-3">
                      <span className="w-8 text-center text-xl">
                        {getEmotionIcon(emotion)}
                      </span>
                      <span className="w-24">
                        {normalizeEmotionName(emotion)}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${EMOTION_COLORS[emotion] || 'bg-blue-500'}`}
                          style={{ width: `${percent * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-right font-medium">
                        {(percent * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <h3 className="text-xl font-bold mb-4">Tus Análisis Recientes</h3>
          {analyses.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No hay análisis previos disponibles
            </p>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {analyses.map((analysis) => (
                <div
                  key={analysis._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">
                      {getEmotionIcon(analysis.dominantEmotion)}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">
                          {normalizeEmotionName(analysis.dominantEmotion)}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(analysis.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                        {analysis.text}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(analysis.emotions)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 3)
                          .map(([emotion, score]) => (
                            <span
                              key={emotion}
                              className={`text-xs px-2 py-1 rounded-full ${EMOTION_COLORS[emotion] || 'bg-gray-100'}`}
                            >
                              {normalizeEmotionName(emotion)} {(score * 100).toFixed(0)}%
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}