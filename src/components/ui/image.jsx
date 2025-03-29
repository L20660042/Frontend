// src/components/ui/image.jsx
const Image = ({ src, alt, width = 300, height = 300 }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ borderRadius: '12px', objectFit: 'cover' }}
    />
  );
};

export default Image; 
