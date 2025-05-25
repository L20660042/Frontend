import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white text-gray-900">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo + Nombre alineado a la izquierda */}
        <div className="flex items-center gap-2 font-bold">
          <Brain className="h-6 w-6 text-blue-600" />
          <span>Emotired</span>
        </div>

        {/* Menú horizontal y botones alineados a la derecha */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Menú horizontal solo en pantallas grandes */}
          <nav className="hidden md:flex gap-6">
            <Link
              to="/?scrollTo=caracteristicas"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Características
            </Link>
            <Link
              to="/?scrollTo=como-funciona"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Cómo Funciona
            </Link>
            <Link
              to="/"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Inicio
            </Link>
            <Link
              to="/?scrollTo=contacto"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contacto
            </Link>
          </nav>

          {/* Botones de sesión */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </div>

        {/* Botón menú móvil */}
        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

// Menú desplegable solo para móviles
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-800 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white border border-gray-200 rounded-md shadow-md p-4 flex flex-col gap-4">
          <Link
            to="/?scrollTo=caracteristicas"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium hover:underline"
          >
            Características
          </Link>
          <Link
            to="/?scrollTo=como-funciona"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium hover:underline"
          >
            Cómo Funciona
          </Link>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium hover:underline"
          >
            Inicio
          </Link>
          <Link
            to="/?scrollTo=contacto"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium hover:underline"
          >
            Contacto
          </Link>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Registrarse
          </Link>
        </div>
      )}
    </>
  );
}
