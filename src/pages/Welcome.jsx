// welcome.jsx
import React from "react";
import {
  PenLine,
  Palette,
  Brain,
  BarChart3,
  FileText,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Introducción */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Analiza emociones en ortografía y dibujos
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Nuestra plataforma detecta emociones ocultas en la forma de escribir y dibujar. Usa inteligencia artificial para revelar estados como ansiedad, alegría, inseguridad o creatividad a partir de ortografía y trazos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    to="#caracteristicas"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-primary px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/80"
                  >
                    Ver características
                  </Link>
                </div>
              </div>

              <img
                src={`${process.env.PUBLIC_URL}/emociones.jpg`}
                width={550}
                height={550}
                alt="Análisis emocional"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/550x550/3b82f6/ffffff?text=Emoci%C3%B3nIA";
                }}
              />
            </div>
          </div>
        </section>

        {/* Características */}
        <section id="caracteristicas" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Características
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  IA Emocional para Escritura y Dibujo
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Nuestra tecnología detecta señales emocionales en errores ortográficos, estilos de escritura, trazos, colores y formas presentes en dibujos.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Ortografía emocional */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <PenLine className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Ortografía emocional</h3>
                <p className="text-center text-muted-foreground">
                  Analiza errores y estilo de escritura para inferir emociones como estrés, inseguridad o urgencia.
                </p>
              </div>

              {/* Dibujo emocional */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dibujos emocionales</h3>
                <p className="text-center text-muted-foreground">
                  Detecta emociones en trazos, colores, presión y formas en dibujos y garabatos.
                </p>
              </div>

              {/* Procesamiento cognitivo */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">IA especializada</h3>
                <p className="text-center text-muted-foreground">
                  Algoritmos entrenados en psicología gráfica y escritura para interpretar estados mentales.
                </p>
              </div>

              {/* Reportes visuales */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Reportes visuales</h3>
                <p className="text-center text-muted-foreground">
                  Obtén gráficas y resúmenes visuales que muestran las emociones detectadas en tus textos o dibujos.
                </p>
              </div>

              {/* Análisis de manuscritos */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Análisis de manuscritos</h3>
                <p className="text-center text-muted-foreground">
                  Escanea documentos escritos a mano para detectar señales emocionales y patrones gráficos.
                </p>
              </div>

              {/* Evaluación gráfica */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Evaluación gráfica</h3>
                <p className="text-center text-muted-foreground">
                  Reconoce gestos gráficos relacionados con emociones como agresividad, tristeza o alegría.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Funciona */}
        <section id="como-funciona" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  ¿Cómo Funciona?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Nuestro sistema de análisis utiliza técnicas avanzadas de inteligencia artificial que procesan tanto textos como imágenes. La IA examina errores ortográficos, patrones en la escritura y el estilo de los dibujos para determinar las emociones subyacentes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Contacto
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Si tienes alguna pregunta o deseas más información sobre nuestro servicio, no dudes en contactarnos.
                </p>
                <p className="text-muted-foreground">Correo: <a href="mailto:l20660042@matehuala.tecnm.mx" className="text-primary">l20660042@matehuala.tecnm.mx</a></p>
                <p className="text-muted-foreground">Teléfono: <a href="tel:+4881749435" className="text-primary">4881749435</a></p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
