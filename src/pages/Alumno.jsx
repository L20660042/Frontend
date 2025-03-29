import React, { useState } from "react";
import {
  User,
  FolderKanban,
  Menu,
  X,
  LogOut,
  Brain,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// Componentes que ya tienes creados
import Profile from "../components/Profile";
import UploadProject from "../components/UploadProject";

export default function Dashboard() {
  const [view, setView] = useState("profile"); // por default, muestra el perfil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Cambia de vista y cierra el menú en móvil
  const handleViewChange = (selectedView) => {
    setView(selectedView);
    setIsMenuOpen(false);
  };

  // Cierra sesión
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-[rgb(31,65,155)] text-white p-3 shadow-xl border-b-2 border-[rgb(31,65,155)] fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo + Nombre alineado a la izquierda */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden mr-3">
              <Brain className="w-full h-full text-blue-600" />
            </div>
            <span className="text-base font-medium">EmotionSense</span> {/* Ajustamos el tamaño de texto */}
          </div>

          {/* Menú hamburguesa */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`md:w-64 bg-[rgb(31,65,155)] text-white p-4 border-r-2 border-white/20 fixed top-16 left-0 bottom-0 ${
          isMenuOpen ? "block" : "hidden"
        } md:block shadow-md`}
      >
        <nav className="space-y-4">
          {/* Perfil */}
          <button
            className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-white/10 w-full"
            onClick={() => handleViewChange("profile")}
          >
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </button>

          {/* Aplicación */}
          <button
            className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-white/10 w-full"
            onClick={() => handleViewChange("aplicacion")}
          >
            <FolderKanban className="w-5 h-5" />
            <span>Aplicación</span>
          </button>

          {/* Cerrar sesión */}
          <button
            className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-white/10 w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64 mt-16 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[rgb(31,65,155)]">
              {view === "profile"
                ? "Perfil"
                : view === "aplicacion"
                ? "Aplicación"
                : "Subir Proyecto"}
            </h2>
          </div>

          {/* Aquí renderizas el contenido de la vista */}
          {view === "profile" ? (
            <Profile />
          ) : view === "aplicacion" ? (
            <div>
              {/* CONTENIDO DE LA SECCIÓN APLICACIÓN */}
              <h3 className="text-xl font-bold text-[rgb(31,65,155)] mb-4">
                Bienvenido a la Aplicación
              </h3>
              <p className="text-gray-700">
                Aquí puedes mostrar los datos o funcionalidades de tu aplicación.
              </p>
              {/* Puedes meter aquí un componente o más código */}
            </div>
          ) : view === "uploadProject" ? (
            <UploadProject />
          ) : null}
        </div>
      </div>
    </div>
  );
}
