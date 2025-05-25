import React, { useState, useEffect } from "react";
import axios from "axios";

const API_CONFIG = {
  ML_SERVICE_TEXT:
    process.env.REACT_APP_ML_API || "https://web-production-7a2d.up.railway.app",
  ML_SERVICE_DRAWING:
    process.env.REACT_APP_DRAWING_API ||
    "https://serviciodibujo-production.up.railway.app",
  BACKEND:
    process.env.REACT_APP_BACKEND_API ||
    "https://backend-production-e954.up.railway.app",
};

const EMOTION_ICONS = {
  anger: "😠",
  disgust: "🤢",
  fear: "😨",
  joy: "😄",
  neutral: "😐",
  sadness: "😢",
  surprise: "😮",
};

export default function EmotionUploader() {
  const [mode, setMode] = useState("text"); // 'text' or 'drawing'
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState(null);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    resetResults();
  }, [mode]);

  const resetResults = () => {
    setText("");
    setEmotions(null);
    setDominantEmotion(null);
    setError(null);
    setSaveStatus(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Solo se aceptan JPEG o PNG");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError(`Imagen demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máx: 3MB`);
      return;
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));
    resetResults();
  };

  const getAnalyzeEndpoint = () => {
    return mode === "text"
      ? `${API_CONFIG.ML_SERVICE_TEXT}/analyze-image`
      : `${API_CONFIG.ML_SERVICE_DRAWING}/analyze-drawing`;
  };

  const getSaveEndpoint = () => {
    return mode === "text"
      ? `${API_CONFIG.BACKEND}/analysis/save`
      : `${API_CONFIG.BACKEND}/drawing-analysis/save`;
  };

  const analyzeImage = async () => {
    if (!imageFile || loading) return;

    setLoading(true);
    setError(null);
    setSaveStatus(null);

    try {
      // 1. Send image to ML microservice
      const formData = new FormData();
      formData.append("file", imageFile);

      const mlResponse = await axios.post(getAnalyzeEndpoint(), formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      if (!mlResponse.data?.success) {
        throw new Error(mlResponse.data?.error || "Error en el análisis");
      }

      const analysisData = mlResponse.data.data;
      const textResult = mode === "text" ? analysisData.text || "" : "";
      const emotionsResult = analysisData.emotions;
      const dominantResult = analysisData.dominant_emotion;

      setText(textResult);
      setEmotions(emotionsResult);
      setDominantEmotion(dominantResult);

      // 2. Save to backend DB
      await axios.post(
        getSaveEndpoint(),
        {
          imageUrl: image,
          text: textResult,
          emotions: emotionsResult,
          dominantEmotion: dominantResult,
          mode: mode,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      setSaveStatus("Guardado correctamente");
    } catch (err) {
      console.error(err);
      let msg = "Error al procesar la imagen";
      if (err.response) {
        msg = err.response.data?.error || `Error ${err.response.status}`;
      } else if (err.code === "ECONNABORTED") {
        msg = "Tiempo de espera agotado";
      }
      setError(msg);
      setSaveStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionSummary = (emotion) => {
    const descriptions = {
      anger: "Contenido con signos de enfado",
      disgust: "Expresa rechazo o aversión",
      fear: "Refleja preocupación o miedo",
      joy: "Transmite emociones positivas",
      neutral: "Tono neutro",
      sadness: "Expresa tristeza",
      surprise: "Muestra asombro",
    };
    return descriptions[emotion] || "Emoción no clasificada";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Mode Switch */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode("text")}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            mode === "text" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          type="button"
        >
          Analizar Escritura
        </button>
        <button
          onClick={() => setMode("drawing")}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            mode === "drawing" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          type="button"
        >
          Analizar Dibujo
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50 mb-4">
        {image ? (
          <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-gray-500">
            {mode === "text" ? "Selecciona una imagen con texto" : "Selecciona una imagen de dibujo"}
          </span>
        )}
      </div>

      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleImageChange}
        className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
        disabled={loading}
      />

      <button
        onClick={analyzeImage}
        disabled={!imageFile || loading}
        className={`w-full py-3 px-4 rounded-md font-medium ${
          !imageFile || loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading
          ? "Procesando..."
          : mode === "text"
          ? "Analizar Imagen"
          : "Analizar Dibujo"}
      </button>

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {saveStatus && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200 mt-4">
          <p className="text-green-600">{saveStatus}</p>
        </div>
      )}

      {dominantEmotion && emotions && (
        <div className="mt-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <div className="text-center mb-4">
            <span className="text-5xl block mb-2">{EMOTION_ICONS[dominantEmotion] || "❓"}</span>
            <h3 className="text-xl font-bold">
              {dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
            </h3>
            <p className="text-sm text-gray-500 mt-2">{getEmotionSummary(dominantEmotion)}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Distribución:</h4>
            {Object.entries(emotions)
              .sort(([, a], [, b]) => b - a)
              .map(([emotion, score]) => (
                <div key={emotion} className="flex items-center">
                  <span className="w-8 text-xl">{EMOTION_ICONS[emotion]}</span>
                  <span className="w-28">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-blue-500" style={{ width: `${score * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm">{(score * 100).toFixed(0)}%</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {mode === "text" && text && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
          <h3 className="font-bold mb-2">Texto detectado:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}
