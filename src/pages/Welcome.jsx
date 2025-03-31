import React, { useState } from "react";
import { BarChart3, LineChart, Smile, Frown, Brain, Menu, X } from "lucide-react";
import EmotionDemo from "../components/EmotionDemo";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 font-bold">
            <span>EmociónIA</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Inicio
          </Link>
          <Link to="#caracteristicas" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Características
          </Link>
          <Link to="#demo" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Demo
          </Link>
        </nav>
        
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container px-4 py-2 flex flex-col space-y-2">
            <Link 
              to="/" 
              className="py-2 px-4 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              to="#caracteristicas" 
              className="py-2 px-4 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Características
            </Link>
            <Link 
              to="#demo" 
              className="py-2 px-4 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Análisis emocional avanzado
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Nuestra plataforma utiliza inteligencia artificial para detectar y analizar emociones en texto e imágenes.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="#demo">
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80">
                      Probar Demo
                    </button>
                  </Link>
                  <Link
                    to="#caracteristicas"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Saber Más
                  </Link>
                </div>
              </div>

              <img
                src="/emociones.jpg"
                width={550}
                height={550}
                alt="Análisis de Emociones"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="caracteristicas" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Características
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Análisis Emocional Avanzado</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Nuestra plataforma utiliza inteligencia artificial para detectar y 
                  analizar emociones en texto e imágenes.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Estadísticas Detalladas</h3>
                <p className="text-center text-muted-foreground">
                  Obtén métricas precisas sobre la distribución de emociones en tus comentarios.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Tendencias Temporales</h3>
                <p className="text-center text-muted-foreground">
                  Visualiza cómo evolucionan las emociones en tus contenidos a lo largo del tiempo.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Smile className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Análisis de Imágenes</h3>
                <p className="text-center text-muted-foreground">
                  Detecta emociones en imágenes con nuestra tecnología de visión por computadora.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Frown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Detección de Texto</h3>
                <p className="text-center text-muted-foreground">
                  Identifica emociones expresadas en comentarios y publicaciones de texto.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">IA Especializada</h3>
                <p className="text-center text-muted-foreground">
                  Modelos entrenados específicamente para el análisis emocional en contenido digital.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Prueba Nuestro Analizador de Emociones
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Ingresa texto o sube una imagen para ver nuestro análisis emocional en acción.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl mt-8">
              <EmotionDemo />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}