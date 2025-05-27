import React, { useState } from "react";
import { User, PlusCircle, Table, Upload, Menu, X } from "lucide-react"; // Removed Brain import
import RegisterUser from "../components/Registro1"; // Componente para registrar usuario
import Profile from "../components/Profile"; // Componente para el perfil
import GestionarUsuarios from "../components/GestionarUsuarios"; // Componente para gestionar usuarios
import { useNavigate } from "react-router-dom"; // Para la navegación

export default function AdminDashboard() {
  const [view, setView] = useState("users"); // Controla la vista actual
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla el menú móvil
  const navigate = useNavigate(); // Navegación

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Elimina el token de autenticación
    navigate("/login"); // Redirige al inicio de sesión
    setIsMenuOpen(false); // Cierra el menú móvil
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[rgb(31,65,155)] text-white p-3 shadow-xl border-b-2 border-[rgb(31,65,155)] fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo + Nombre alineado a la izquierda */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden mr-3">
              <img
                src={`${process.env.PUBLIC_URL}/logotipo.png`}
                alt="Logotipo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base font-medium">EmoTrazos</span> {/* Nombre ajustado */}
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
          <button
            className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-white/10 w-full"
            onClick={() => {
              setView("profile");
              setIsMenuOpen(false);
            }}
          >
            <User className="w-5 h-5" />
            <span>Perfil</span>
          </button>
          <button
            className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-white/10 w-full"
            onClick={() => {
              setView("createUser");
              setIsMenuOpen(false);
            }}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Crear Usuario</span>
          </button>
          <button
            className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-white/10 w-full"
            onClick={() => {
              setView("users");
              setIsMenuOpen(false);
            }}
          >
            <Table className="w-5 h-5" />
            <span>Gestionar Usuarios</span>
          </button>
          <button
            className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-white/10 w-full"
            onClick={handleLogout}
          >
            <Upload className="w-5 h-5" />
            <span>Cerrar Sesión</span>
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
                : view === "createUser"
                ? "Crear Nuevo Usuario"
                : "Gestionar Usuarios"}
            </h2>
          </div>

          {/* Renderizar las vistas */}
          {view === "profile" && <Profile />}
          {view === "createUser" && <RegisterUser />}
          {view === "users" && <GestionarUsuarios />}
        </div>
      </div>
    </div>
  );
}
