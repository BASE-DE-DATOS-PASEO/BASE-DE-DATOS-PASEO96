import Link from "next/link";
import { MapPin, Clock, ShoppingBag, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/categorias" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Mesh background */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(at 15% 20%, rgba(59, 130, 246, 0.35) 0px, transparent 50%), " +
            "radial-gradient(at 85% 80%, rgba(96, 165, 250, 0.20) 0px, transparent 55%), " +
            "radial-gradient(at 50% 50%, rgba(147, 197, 253, 0.10) 0px, transparent 60%)",
        }}
      />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                <ShoppingBag className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                PASEO <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">96</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Tu vidriera virtual de la feria. Explorá productos cargados por
              los puestos, compará precios y contactá directo al vendedor por
              WhatsApp.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-5">
              Links rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-5">
              Ubicación
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shrink-0">
                <MapPin className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                <a
                  href="https://maps.app.goo.gl/LYHKp8cYvXCzowhs5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Paseo Del Compra Del Sur,<br />La Plata, Buenos Aires
                </a>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-5">
              Horarios
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shrink-0">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="text-white font-semibold">Jue · Sáb · Dom</span><br />
                10:30 — 20:30 hs
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; 2026 Paseo 96. Todos los derechos reservados.
          </p>
          <p className="text-xs text-slate-500">
            Hecho con cuidado en La Plata 🇦🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
