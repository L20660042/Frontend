import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import {
  PenLine,
  Palette,
  Brain,
  BarChart3,
  FileText,
  Eye,
} from "lucide-react";
import Navbar from "../components/NavBar";

export default function Welcome() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    if (scrollTo) {
      scroller.scrollTo(scrollTo, {
        smooth: true,
        offset: -70,
        duration: 500,
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Introducción */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Análisis de emociones a partir de escritura y dibujos
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                  Nuestra plataforma utiliza inteligencia artificial avanzada para detectar emociones ocultas en la forma de escribir y dibujar. Analizamos patrones en la ortografía, el estilo de escritura, los trazos, colores y formas en dibujos para revelar estados emocionales como ansiedad, alegría, inseguridad y creatividad.
                </p>
              </div>

              <img
                src={`${process.env.PUBLIC_URL}/emociones.jpg`}
                width={550}
                height={550}
                alt="Análisis emocional"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/550x550/3b82f6/ffffff?text=Emoci%C3%B3nIA";
                }}
              />
            </div>
          </div>
        </section>

        {/* Características */}
        <section
          id="caracteristicas"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-12 max-w-[900px] mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-2">
                Características
              </h2>
              <h3 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                IA emocional para escritura y dibujo
              </h3>
            </div>

            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: <PenLine className="h-8 w-8 text-primary mb-3" />,
                  title: "Análisis emocional de escritura",
                  desc: "Detecta emociones basadas en errores ortográficos, estilos de letra y patrones gráficos en manuscritos.",
                },
                {
                  icon: <Palette className="h-8 w-8 text-primary mb-3" />,
                  title: "Análisis emocional de dibujos",
                  desc: "Evalúa emociones a partir de características visuales como grosor de trazos, colorido y complejidad de las formas.",
                },
                {
                  icon: <Brain className="h-8 w-8 text-primary mb-3" />,
                  title: "Modelos de IA especializados",
                  desc: "Algoritmos entrenados con psicología gráfica para interpretar estados emocionales y cognitivos.",
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-primary mb-3" />,
                  title: "Reportes visuales y resúmenes",
                  desc: "Generamos gráficos y resúmenes para visualizar las emociones detectadas en textos y dibujos.",
                },
                {
                  icon: <FileText className="h-8 w-8 text-primary mb-3" />,
                  title: "Escaneo y evaluación de manuscritos",
                  desc: "Permite analizar documentos escritos a mano para identificar señales emocionales.",
                },
                {
                  icon: <Eye className="h-8 w-8 text-primary mb-3" />,
                  title: "Reconocimiento de gestos gráficos",
                  desc: "Identifica expresiones emocionales como agresividad, tristeza o alegría a través del análisis del trazo.",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col items-start rounded-lg border border-input p-6 shadow-sm bg-background"
                >
                  <div>{icon}</div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-base">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo Funciona */}
        <section id="como-funciona" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  ¿Cómo funciona?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  El sistema procesa imágenes y textos mediante técnicas de IA que combinan análisis de contenido escrito y visual. Extraemos características de la escritura y los dibujos para determinar las emociones subyacentes, ofreciendo un enfoque integral y personalizado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section
          id="contacto"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Contacto
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Si deseas más información o tienes dudas, contáctanos:
                </p>
                <p className="text-muted-foreground">
                  Correo:{" "}
                  <a
                    href="mailto:l20660042@matehuala.tecnm.mx"
                    className="text-primary"
                  >
                    l20660042@matehuala.tecnm.mx
                  </a>
                </p>
                <p className="text-muted-foreground">
                  Teléfono:{" "}
                  <a href="tel:+4881749435" className="text-primary">
                    4881749435
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
