import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = {
  navegar: [
    { label: "Inicio", href: "/" },
    { label: "Categorías", href: "/categorias" },
    { label: "Vender en Paseo 96", href: "/planes" },
    { label: "Ingresar", href: "/login" },
  ],
  feria: [
    { label: "Cómo funciona", href: "/#como-funciona" },
    { label: "Puestos destacados", href: "/#puesteros" },
    { label: "Ubicación", href: "https://maps.app.goo.gl/LYHKp8cYvXCzowhs5", external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0A] text-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Top: PASEO + blue 96 chip */}
        <div className="py-14 sm:py-16 border-b border-white/08">
          <h2 className="text-[12vw] sm:text-[80px] lg:text-[104px] font-extrabold tracking-[-0.05em] leading-[0.9] text-white flex items-baseline gap-3 sm:gap-5">
            PASEO
            <span className="inline-flex items-center justify-center px-3 sm:px-5 py-1 bg-[#3B82F6] rounded-xl sm:rounded-2xl">
              96
            </span>
          </h2>
          <p className="mt-6 text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
            La vidriera digital de la feria del Paseo del Sur. Productos cargados por
            los puestos. Hablás directo. Comprás como siempre.
          </p>
        </div>

        {/* Middle: link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-12 gap-8 sm:gap-12 py-14 sm:py-16">

          {/* Navegar */}
          <div className="sm:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-6">
              Navegar
            </h3>
            <ul className="space-y-3">
              {links.navegar.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-white hover:text-white/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Feria */}
          <div className="sm:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-6">
              La feria
            </h3>
            <ul className="space-y-3">
              {links.feria.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[15px] text-white hover:text-white/60 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[15px] text-white hover:text-white/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div className="sm:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-6">
              Horarios
            </h3>
            <p className="text-[15px] leading-relaxed">
              Jueves<br />
              Sábado<br />
              Domingo
            </p>
            <p className="text-[15px] text-white/60 mt-3">
              10:30 — 20:30 hs
            </p>
          </div>

          {/* Ubicación */}
          <div className="sm:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-6">
              Dónde estamos
            </h3>
            <a
              href="https://maps.app.goo.gl/LYHKp8cYvXCzowhs5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] hover:text-white/60 transition-colors leading-relaxed"
            >
              Paseo del Sur<br />
              La Plata, Buenos Aires<br />
              Argentina
            </a>
          </div>

        </div>

        {/* Bottom: copyright */}
        <div className="py-8 border-t border-white/08 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © 2026 Paseo 96. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/40">
            Hecho con cuidado en La Plata 🇦🇷
          </p>
        </div>

      </div>
    </footer>
  );
}
