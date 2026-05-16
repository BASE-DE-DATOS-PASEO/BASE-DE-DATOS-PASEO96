import Link from "next/link";
import { MapPin, Clock } from "lucide-react";

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/categorias" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A2E] text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold tracking-tight text-white">
                PASEO
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-blue-400">
                96
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Tu vidriera virtual de la feria. Explorá productos cargados por
              los puestos, compará precios y contactá directo al vendedor por
              WhatsApp.
            </p>

          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Links rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Ubicación
            </h3>
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400 leading-relaxed">
                <a
                  href="https://maps.app.goo.gl/LYHKp8cYvXCzowhs5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Paseo Del Compra Del Sur, La Plata, Buenos Aires
                </a>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Horarios
            </h3>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400 leading-relaxed">
                Jueves, Sábado, Domingo y feriados: 10:30 - 20:30<br />
                Lunes, Martes, Miércoles y Viernes: Cerrado
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-xs text-gray-500">
            &copy; 2026 Paseo 96. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
