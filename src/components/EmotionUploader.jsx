import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Upload,
  FileText,
  ImageIcon,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  History,
  Brain,
} from "lucide-react";
import axios from "axios";
import { Button } from "../components/ui/button2";

const API_CONFIG = {
  ML_SERVICE_TEXT: process.env.REACT_APP_ML_API || "https://web-production-7a2d.up.railway.app",
  ML_SERVICE_DRAWING: process.env.REACT_APP_DRAWING_API || "https://serviciodibujo-production.up.railway.app",
  BACKEND: process.env.REACT_APP_BACKEND_API || "https://backend-production-e954.up.railway.app",
};

export default function EmotionUploader() {
  const [mode, setMode] = useState("text");
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState("checking");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkServiceStatus();
  }, [mode]);

  const checkServiceStatus = async () => {
    try {
      setServiceStatus("checking");
      const url = mode === "text" ? API_CONFIG.ML_SERVICE_TEXT : API_CONFIG.ML_SERVICE_DRAWING;
      const res = await axios.get(`${url}/health`, { timeout: 10000 });
      setServiceStatus(res.data.model_loaded ? "available" : "loading");
    } catch {
      setServiceStatus("unavailable");
      setError("Servicio no disponible");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return setError("Solo se aceptan imágenes JPEG o PNG");
    }
    if (file.size > 3 * 1024 * 1024) {
      return setError("Tamaño máximo: 3MB");
    }
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setError(null);
  };

  const analyzeImage = async () => {
    if (!imageFile || loading) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const url = mode === "text" ? API_CONFIG.ML_SERVICE_TEXT : API_CONFIG.ML_SERVICE_DRAWING;
      const endpoint = mode === "text" ? "/analyze-image" : "/analyze-drawing";

      const response = await axios.post(`${url}${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      const { emotions, dominant_emotion, text, emotional_advice } = response.data.data;

      // 🧠 GUARDAR EN BACKEND
      try {
        await axios.post(`${API_CONFIG.BACKEND}/analysis/save`, {
          imageUrl: image,
          text: mode === "text" ? text : "",
          emotions,
          dominantEmotion: dominant_emotion,
        }, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });
      } catch (e) {
        console.warn("No se pudo guardar en el backend", e);
      }

      navigate("/Usuario/resultados", {
        state: {
          mode,
          image,
          emotions,
          dominantEmotion: dominant_emotion,
          text: mode === "text" ? text : "",
          advice: emotional_advice,
        },
      });
    } catch {
      setError("Error al analizar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-md p-4 rounded-xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Brain className="text-blue-600 w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Detector de Emociones
            </h1>
            <p className="text-sm text-gray-500">Análisis inteligente con IA</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {serviceStatus === "available" && (
            <span className="text-green-600 font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" /> Servicio Activo
            </span>
          )}
          {serviceStatus === "checking" && (
            <span className="text-blue-600 font-medium flex items-center">
              <Clock className="w-4 h-4 animate-spin mr-1" /> Verificando...
            </span>
          )}
          {serviceStatus === "unavailable" && (
            <span className="text-red-600 font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> Servicio Inactivo
            </span>
          )}

          <Link to="/Usuario/historial">
            <Button variant="outline" className="flex items-center gap-2 hover:bg-indigo-50">
              <History className="w-4 h-4" />
              Historial
            </Button>
          </Link>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-md border border-blue-100 flex space-x-2">
          <button
            onClick={() => setMode("text")}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition ${
              mode === "text"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Analizar Texto
          </button>
          <button
            onClick={() => setMode("drawing")}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition ${
              mode === "drawing"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Analizar Dibujo
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center mb-4">
          <AlertCircle className="w-4 h-4 inline-block mr-2" />
          {error}
        </div>
      )}

      {/* Upload Card */}
      <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border text-center space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Subir Imagen con {mode === "text" ? "Texto" : "Dibujo"}
        </h2>

        <label className="block border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-400 transition">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Upload className="text-white w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700">Arrastra una imagen con {mode === "text" ? "texto" : "dibujo"}</p>
            <p className="text-xs text-gray-500">o haz clic para seleccionar</p>
            <p className="text-xs text-gray-400">Formatos: JPEG, PNG • Máximo: 3MB</p>
          </div>
          <input type="file" onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png" />
        </label>

        {image && <img src={image} alt="preview" className="max-h-64 mx-auto rounded-lg shadow-md" />}

        <Button
          onClick={analyzeImage}
          disabled={!imageFile || loading || serviceStatus !== "available"}
          className={`w-full py-3 text-lg font-semibold rounded-xl shadow-md ${
            !imageFile || loading || serviceStatus !== "available"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Analizando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              Analizar {mode === "text" ? "Texto" : "Dibujo"}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
