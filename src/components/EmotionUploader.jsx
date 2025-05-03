import React, { useState } from 'react';
import axios from 'axios';

function EmotionUploader() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('user', 'usuario123'); // cambia esto por tu ID real

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/emotion/upload`, formData);
    setResult(res.data);
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
        Analizar emoción
      </button>
      {result && (
        <div>
          <p><strong>Emoción detectada:</strong> {result.emotion}</p>
          <pre>{JSON.stringify(result.details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default EmotionUploader;
