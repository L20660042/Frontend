import React from "react";

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
  const dominant = getDominantEmotion(mockResults);

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">Analizar Emociones</h3>

      <div className="bg-gray-50 rounded-xl p-6 shadow-md border max-w-md mx-auto">
        <div className="mb-6">
          <div className="text-4xl mb-2">😊</div>
          <h4 className="text-2xl font-bold text-green-600">{dominant}</h4>
          <p className="text-sm text-gray-500">Emoción Dominante</p>
        </div>

        <div className="space-y-3 text-left">
          {Object.entries(mockResults).map(([emotion, percent]) => (
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
      </div>
    </div>
  );
}
