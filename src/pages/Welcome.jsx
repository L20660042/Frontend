import React from "react";
import NavBar from "../components/NavBar";

// Iconos de lucide-react
import { BarChart3, LineChart, Smile, Frown, Meh, Brain } from "lucide-react";

// Componentes de shadcn/ui o personalizados
import EmotionDemo from "../components/EmotionDemo";
// ❗ Si no tienes el componente Image, usa directamente <img />
// import Image from '../components/ui/image'; // Comenta esta línea por ahora

import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Sección de bienvenida */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Comprende las emociones en texto y voz
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Nuestra IA avanzada analiza emociones en tiempo real, ayudándote a entender el sentimiento en
                    feedback de clientes, redes sociales y más.
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
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Saber Más
                  </Link>
                </div>
              </div>

              {/* Imagen destacada */}
              <img
                src="/emociones.jpg" // Cambia a la ruta de tu imagen o usa un enlace público si no tienes la imagen
                width={550}
                height={550}
                alt="Panel de Análisis de Emociones"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Análisis Avanzado de Emociones</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Nuestra plataforma utiliza IA de vanguardia para detectar y analizar emociones en texto, voz y
                  expresiones faciales.
                </p>
              </div>
            </div>

            {/* Cards de características */}
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Análisis de Sentimientos */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Análisis de Sentimientos</h3>
                <p className="text-center text-muted-foreground">
                  Detecta sentimientos positivos, negativos y neutros en texto con alta precisión.
                </p>
              </div>

              {/* Seguimiento de emociones */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Seguimiento de Emociones</h3>
                <p className="text-center text-muted-foreground">
                  Rastrea emociones a lo largo del tiempo para identificar tendencias y patrones en tus datos.
                </p>
              </div>

              {/* Análisis de expresiones faciales */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Smile className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Análisis de Expresiones Faciales</h3>
                <p className="text-center text-muted-foreground">
                  Analiza expresiones faciales en imágenes y video para detectar emociones.
                </p>
              </div>

              {/* Alertas de emociones negativas */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Frown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Alertas de Emociones Negativas</h3>
                <p className="text-center text-muted-foreground">
                  Recibe notificaciones cuando se detecten emociones negativas en el feedback de clientes.
                </p>
              </div>

              {/* Intensidad emocional */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Meh className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Intensidad Emocional</h3>
                <p className="text-center text-muted-foreground">
                  Mide la intensidad de las emociones para entender cuán fuertemente se expresan.
                </p>
              </div>

              {/* Insights impulsados por IA */}
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Insights Impulsados por IA</h3>
                <p className="text-center text-muted-foreground">
                  Obtén insights accionables basados en el análisis emocional de tus datos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo de emociones */}
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Prueba Nuestro Análisis de Emociones
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Ingresa algún texto a continuación para ver nuestro análisis de emociones en acción.
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
