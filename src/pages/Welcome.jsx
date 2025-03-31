import React from "react";
import NavBar from "../components/NavBar";
import { BarChart3, LineChart, Smile, Frown, Meh, Brain, Menu, X } from "lucide-react";
import EmotionDemo from "../components/EmotionDemo";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Welcome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-[rgb(31,65,155)] text-white p-3 shadow-xl border-b-2 border-[rgb(31,65,155)] fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <span className="text-lg font-medium">EmotionSense</span>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <NavBar />
      <main className="flex-1 mt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  Analiza emociones en comentarios e imágenes
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Nuestra IA analiza comentarios e imágenes para ofrecer estadísticas sobre emociones.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="#demo" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80">
                    Probar Demo
                  </Link>
                  <Link to="#caracteristicas" className="border border-input bg-background px-8 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    Saber Más
                  </Link>
                </div>
              </div>
              <img src="/emociones.jpg" width={550} height={550} alt="Panel de Análisis de Emociones" className="mx-auto aspect-video rounded-xl object-cover sm:w-full lg:order-last" />
            </div>
          </div>
        </section>

        <section id="caracteristicas" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Análisis Avanzado de Emociones</h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl">
                Nuestra plataforma utiliza IA para analizar emociones en comentarios e imágenes.
              </p>
            </div>
            <div className="grid max-w-5xl mx-auto gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: BarChart3, title: "Análisis de Sentimientos", desc: "Detecta sentimientos positivos, negativos y neutros en comentarios." },
                { icon: LineChart, title: "Seguimiento de Emociones", desc: "Rastrea emociones para identificar tendencias en comentarios." },
                { icon: Smile, title: "Análisis de Expresiones", desc: "Detecta emociones en imágenes con alta precisión." },
                { icon: Frown, title: "Alertas de Emociones Negativas", desc: "Recibe notificaciones de emociones negativas en comentarios." },
                { icon: Meh, title: "Intensidad Emocional", desc: "Mide la intensidad de las emociones expresadas en texto e imágenes." },
                { icon: Brain, title: "Insights Impulsados por IA", desc: "Obtén análisis detallados sobre las emociones en tu contenido." }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-center text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Prueba Nuestro Análisis de Emociones
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl">
              Ingresa un comentario o imagen para ver el análisis de emociones en acción.
            </p>
            <div className="mx-auto max-w-3xl mt-8">
              <EmotionDemo />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
