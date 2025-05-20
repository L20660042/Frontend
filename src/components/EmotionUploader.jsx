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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/emotion-analysis/history?userId=${userId}`);
      setAnalyses(response.data);
    } catch (err) {
      console.error("Error al cargar análisis previos:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setText('');
      setEmotions(null);
      setDominantEmotion(null);
      setError(null);
    }
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
      formData.append('userId', getUserId());

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/emotion-analysis/analyze-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setText(response.data.data.text);
        setEmotions(response.data.data.emotions);
        setDominantEmotion(response.data.data.dominant_emotion);
        fetchAnalyses();
      } else {
        setError(response.data.error || "Error al analizar la imagen");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al conectar con el servidor");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionSummary = (dominantEmotion) => {
    const emotionDescriptions = {
      anger: "El texto muestra signos de enfado o frustración.",
      disgust: "El texto expresa rechazo o aversión hacia algo.",
      fear: "El texto refleja preocupación o miedo ante una situación.",
      joy: "El texto transmite felicidad y emociones positivas.",
      neutral: "El texto tiene un tono neutro sin emociones marcadas.",
      sadness: "El texto expresa tristeza o melancolía.",
      surprise: "El texto muestra asombro o sorpresa ante algo inesperado."
    };
    
    return emotionDescriptions[dominantEmotion] || "No se pudo determinar una descripción para esta emoción.";
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
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={analyzeImage}
            disabled={!imageFile || loading}
            className={`w-full py-2 px-4 rounded font-medium ${
              !imageFile || loading ? 'bg-gray-300' : 'bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Analizando...' : 'Analizar Imagen'}
          </button>

          {error && <div className="text-red-500 p-2 rounded bg-red-50">{error}</div>}
        </div>

        <div className="space-y-4">
          {text && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-bold mb-2">Texto detectado:</h3>
              <p className="whitespace-pre-line">{text}</p>
            </div>
          )}

          {dominantEmotion && (
            <div className="bg-white p-4 rounded shadow">
              <div className="text-center mb-4">
                <span className="text-5xl block mb-2">
                  {EMOTION_ICONS[dominantEmotion] || '❓'}
                </span>
                <h3 className="text-xl font-bold">
                  {dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
                </h3>
                <p className="text-sm text-gray-500">Emoción dominante</p>
                <p className="mt-2 text-sm">{getEmotionSummary(dominantEmotion)}</p>
              </div>

              <div className="space-y-2">
                {emotions && Object.entries(emotions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, score]) => (
                    <div key={emotion} className="flex items-center">
                      <span className="w-8 text-xl">
                        {EMOTION_ICONS[emotion] || '❓'}
                      </span>
                      <span className="w-32">
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded h-2.5">
                        <div
                          className="h-2.5 rounded bg-blue-500"
                          style={{ width: `${score * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-16 text-right">
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
        <h2 className="text-xl font-bold mb-4">Historial de Análisis</h2>
        {analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => (
              <div key={analysis._id} className="border rounded p-4">
                <div className="flex items-start mb-2">
                  <span className="text-2xl mr-2">
                    {EMOTION_ICONS[analysis.dominantEmotion] || '❓'}
                  </span>
                  <div>
                    <h4 className="font-medium">
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
                    className="w-full h-32 object-contain mb-2"
                  />
                )}
                <p className="text-sm line-clamp-3">{analysis.text}</p>
                <p className="text-xs text-gray-600 mt-2">
                  {getEmotionSummary(analysis.dominantEmotion)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay análisis previos</p>
        )}
      </div>
    </div>
  );
}