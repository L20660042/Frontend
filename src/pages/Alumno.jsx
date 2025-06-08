import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Brain } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button2";

export default function EmotionDashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("authToken");  // Remueve el token de localStorage
    navigate("/login");  // Redirige al login  
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-200/20 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-yellow-200/20 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-lg relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src={`${process.env.PUBLIC_URL}/logotipo2.png`} // Imagen desde la carpeta public
                alt="EmoTrazos Logo"
                width={70}
                height={70}
                className="mr-4 drop-shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                EmoTrazos
              </h1>
              <p className="text-gray-600 text-sm mt-1">IA para analizar emociones en textos y dibujos mediante caligrafía</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full shadow-lg">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">¡Descubre el poder de las emociones en el arte!</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            EmoTrazos utiliza IA avanzada para analizar las emociones en textos y dibujos mediante la caligrafía.
          </p>
        </div>

        {/* Tarjetas de navegación principal */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Tarjeta Aplicación */}
          <Link to="/Usuario/aplicacion" className="text-blue-600">
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 border-0 cursor-pointer overflow-hidden relative h-[300px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center text-white relative z-10 flex flex-col justify-between">
                <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <Brain className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Aplicación EmoTrazos</h3>
                <p className="text-pink-100 text-lg leading-relaxed mb-6">
                  Analiza emociones y descubre las emociones ocultas en textos y dibujos.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Tarjeta Historial de Análisis */}
          <Link to="/Usuario/historial">
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-gradient-to-br from-teal-500 via-green-600 to-blue-600 border-0 cursor-pointer overflow-hidden relative h-[300px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center text-white relative z-10 flex flex-col justify-between">
                <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <Brain className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Historial de Análisis</h3>
                <p className="text-teal-100 text-lg leading-relaxed mb-6">
                  Consulta tu historial de análisis emocionales previos realizados en textos y dibujos.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Tarjeta Perfil */}
          <Link to="/perfil">
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 border-0 cursor-pointer overflow-hidden relative h-[300px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 text-center text-white relative z-10 flex flex-col justify-between">
                <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <User className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Mi Perfil</h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-6">
                  Personaliza tu experiencia.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Botón de Cerrar sesión */}
        <div className="flex justify-center mt-12">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 px-10 py-4 text-lg shadow-lg hover:shadow-xl group"
          >
            <LogOut className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Cerrar sesión</span>
          </Button>
        </div>
      </div>

      {/* Fondo decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
    </div>
  );
}
