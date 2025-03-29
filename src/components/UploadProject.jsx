import React, { useState } from "react";

export default function UploadProject() {
  const [formData, setFormData] = useState({
    name: "",
    schedule: "",
    description: "",
    location: "",
    organization: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Aquí puedes manejar el envío de datos
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-[rgb(31,65,155)] mb-4">Subir Proyecto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Nombre del Proyecto</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Escribe el nombre del proyecto"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Cronograma preliminar</label>
          <textarea
            name="schedule"
            value={formData.schedule}
            onChange={handleInputChange}
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Describe el cronograma"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Descripción de las actividades</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Describe las actividades"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Lugar donde se realizará</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Escribe el lugar"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Información de la organización</label>
          <textarea
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            className="w-full border-b-2 border-gray-300 focus:border-[rgb(31,65,155)] outline-none text-gray-800"
            placeholder="Describe la organización"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Imagen del Proyecto</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-gray-500 border-b-2 border-gray-300 focus:border-[rgb(31,65,155)]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[rgb(31,65,155)] text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Subir Proyecto
        </button>
      </form>
    </div>
  );
}
