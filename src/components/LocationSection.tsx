"use client";

import { MapPin, Clock, Navigation } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function LocationSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="ubicacion" className="w-full py-16 sm:py-20 bg-[var(--color-pub-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-pub-text)] tracking-tight mb-3">
            ¿Dónde estamos?
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-pub-text-secondary)]">
            Visitanos en la feria
          </p>
        </div>

        {/* Card */}
        <div ref={sectionRef} className="reveal max-w-[900px] mx-auto rounded-2xl border border-[var(--color-pub-border)] bg-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Info side */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-pub-text)] mb-1">
                    Dirección
                  </h3>
                  <p className="text-sm text-[var(--color-pub-text-secondary)] leading-relaxed">
                    Paseo Del Compra Del Sur, La Plata, Buenos Aires
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-pub-text)] mb-1">
                    Horarios
                  </h3>
                  <p className="text-sm text-[var(--color-pub-text-secondary)] leading-relaxed">
                    Jueves, Sábado, Domingo y feriados: 10:30 - 20:30<br />
                    Lunes, Martes, Miércoles y Viernes: Cerrado
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--color-pub-text-secondary)] leading-relaxed border-t border-[var(--color-pub-border)] pt-6">
                Paseo 96 es la vidriera digital de la feria. A medida que los
                puestos se sumen, vas a poder ver sus productos, precios y
                formas de contacto en un solo lugar.
              </p>
            </div>

            {/* Google Maps embed */}
            <div className="relative min-h-[280px] lg:min-h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.5!2d-57.8959083!3d-34.9395961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDU2JzIyLjkiUyA1N8KwNTMnNDUuMyJX!5e0!3m2!1ses-419!2sar!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "280px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full lg:rounded-r-2xl"
              />
              <a
                href="https://maps.app.goo.gl/LYHKp8cYvXCzowhs5"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
