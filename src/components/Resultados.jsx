import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "../components/ui/button2";
import { ArrowLeft, Brain, Download } from "lucide-react";
import html2pdf from "html2pdf.js";

const EMOTION_ICONS = {
  enojo: "😠",
  asco: "🤢",
  miedo: "😨",
  alegría: "😄",
  neutral: "😐",
  tristeza: "😢",
  sorpresa: "😮",
};

export default function Resultados() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef();

  if (!state) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">No se encontraron datos para mostrar.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Regresar
        </Button>
      </div>
    );
  }

  const { image, emotions, dominantEmotion, text, advice } = state;

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: `analisis_emocional_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border border-blue-100 p-6 space-y-6 relative">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <h1 className="text-xl font-bold text-indigo-700 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Resultado de Análisis Emocional
          </h1>

          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </Button>
        </div>

        <div ref={pdfRef} className="space-y-6">
          {image && (
            <div>
              <img
                src={image}
                className="w-full max-h-96 object-contain rounded-lg shadow-md border"
                alt="Imagen analizada"
              />
            </div>
          )}

          {text && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Texto Detectado:</h2>
              <p className="bg-gray-50 text-gray-800 p-4 rounded-lg border border-gray-200 shadow-inner">{text}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Emoción Dominante:</h2>
            <p className="text-3xl">
              {EMOTION_ICONS[dominantEmotion]}{" "}
              <span className="capitalize font-bold">{dominantEmotion}</span>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Consejo Emocional:</h2>
            <p className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 shadow-inner">
              {advice}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Distribución de Emociones:</h2>
            <ul className="space-y-2 mt-2">
              {Object.entries(emotions).map(([emotion, value]) => (
                <li
                  key={emotion}
                  className="flex justify-between px-4 py-2 bg-gray-50 rounded-lg border text-sm text-gray-700"
                >
                  <span>
                    {EMOTION_ICONS[emotion]}{" "}
                    <span className="capitalize">{emotion}</span>
                  </span>
                  <span className="font-medium">{(value * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
