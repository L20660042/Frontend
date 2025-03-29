import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Smile, Frown, Meh, Angry, Loader2 } from "lucide-react";

const analizarEmocion = async (texto) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alegria = Math.random() * 0.8;
      const tristeza = Math.random() * 0.5;
      const enojo = Math.random() * 0.3;
      const miedo = Math.random() * 0.2;
      const sorpresa = Math.random() * 0.4;
      const neutral = Math.random() * 0.6;

      const emociones = { alegria, tristeza, enojo, miedo, sorpresa, neutral };
      const dominante = Object.keys(emociones).reduce((a, b) =>
        emociones[a] > emociones[b] ? a : b
      );

      resolve({
        alegria,
        tristeza,
        enojo,
        miedo,
        sorpresa,
        neutral,
        dominante,
      });
    }, 1500);
  });
};

export default function EmotionDemo() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarAnalisis = async () => {
    if (!texto.trim()) return;

    setCargando(true);
    try {
      const analisis = await analizarEmocion(texto);
      setResultado(analisis);
    } catch (error) {
      console.error("Error al analizar el texto:", error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerIconoEmocion = (emocion) => {
    switch (emocion) {
      case "alegria":
        return <Smile className="h-8 w-8 text-green-500" />;
      case "tristeza":
        return <Frown className="h-8 w-8 text-blue-500" />;
      case "enojo":
        return <Angry className="h-8 w-8 text-red-500" />;
      case "neutral":
        return <Meh className="h-8 w-8 text-gray-500" />;
      default:
        return <Meh className="h-8 w-8 text-gray-500" />;
    }
  };



  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Ingresa algún texto para analizar las emociones..."
        className="min-h-[150px]"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <Button
        onClick={manejarAnalisis}
        disabled={!texto.trim() || cargando}
        className="w-full"
      >
        {cargando ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analizando...
          </>
        ) : (
          "Analizar Emociones"
        )}
      </Button>

      {resultado && (
        <div className="mt-6 rounded-lg border p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {obtenerIconoEmocion(resultado.dominante)}
              </div>
              <h3 className="text-xl font-bold capitalize">
                {resultado.dominante}
              </h3>
              <p className="text-sm text-muted-foreground">Emoción Dominante</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Alegría */}
            <ProgressBar nombre="Alegría" porcentaje={resultado.alegria} color="green" />
            {/* Tristeza */}
            <ProgressBar nombre="Tristeza" porcentaje={resultado.tristeza} color="blue" />
            {/* Enojo */}
            <ProgressBar nombre="Enojo" porcentaje={resultado.enojo} color="red" />
            {/* Miedo */}
            <ProgressBar nombre="Miedo" porcentaje={resultado.miedo} color="purple" />
            {/* Sorpresa */}
            <ProgressBar nombre="Sorpresa" porcentaje={resultado.sorpresa} color="yellow" />
            {/* Neutral */}
            <ProgressBar nombre="Neutral" porcentaje={resultado.neutral} color="gray" />
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ nombre, porcentaje, color }) {
  const porcentajeFormateado = `${Math.round(porcentaje * 100)}%`;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{nombre}</span>
        <span className="text-sm font-medium">{porcentajeFormateado}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className={`bg-${color}-500 h-2.5 rounded-full`}
          style={{ width: porcentajeFormateado }}
        ></div>
      </div>
    </div>
  );
}
