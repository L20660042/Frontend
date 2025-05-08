import React, { useState } from "react";

const mockResults = {
  Alegría: 63,
  Tristeza: 9,
  Enojo: 1,
  Miedo: 7,
  Sorpresa: 14,
  Neutral: 36,
};

const getDominantEmotion = (data) => {
  return Object.entries(data).sort((a, b) => b[1] - a[1])[0][0];
};

export default function EmotionUploader() {
  const [image, setImage] = useState(null);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [emotionResults, setEmotionResults] = useState(mockResults);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulamos un análisis de imagen (esto debería ser reemplazado por una llamada al backend)
      setImage(URL.createObjectURL(file)); // Visualizamos la imagen
      analyzeImage(file);
    }
  };

  const analyzeImage = (file) => {
    // Aquí realizarías la llamada a tu backend para analizar la imagen y obtener los resultados
    // Simulando el resultado con el mock
    setDominantEmotion(getDominantEmotion(mockResults));
    setEmotionResults(mockResults); // Aquí actualizarías con los resultados reales del backend
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">Analizar Emociones</h3>

      <div className="bg-gray-50 rounded-xl p-6 shadow-md border max-w-md mx-auto">
        <div className="mb-6">
          {/* Muestra la imagen seleccionada o tomada */}
          {image ? (
            <img src={image} alt="Imagen para análisis" className="mb-4 rounded-lg" />
          ) : (
            <div className="text-4xl mb-2">📸</div>
          )}

          {/* Formulario para subir o tomar una foto */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              capture="camera"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
          </div>

          {/* Resultado de la emoción dominante */}
          {dominantEmotion && (
            <div>
              <h4 className="text-2xl font-bold text-green-600">{dominantEmotion}</h4>
              <p className="text-sm text-gray-500">Emoción Dominante</p>
            </div>
          )}
        </div>

        {/* Mostrar los resultados del análisis */}
        {emotionResults && (
          <div className="space-y-3 text-left">
            {Object.entries(emotionResults).map(([emotion, percent]) => (
              <div key={emotion} className="flex items-center gap-4">
                <span className="w-24">{emotion}</span>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-10 text-right">{percent}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
