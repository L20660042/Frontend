import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmotionUploader = () => {
  // [Mantén todo el código del componente que te mostré anteriormente]
  // Solo asegúrate de actualizar las URLs de las API:
  
  const handleUpload = async () => {
    // ...
    const endpoint = analysisType === 'drawing' 
      ? 'emotion/upload' 
      : 'emotion/analyze-text';
    
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_IA}/${endpoint}`, 
      analysisType === 'drawing' ? formData : { text: image, user: userName },
      { withCredentials: true }
    );
    // ...
  };

  // Resto del componente...
};

export default EmotionUploader;