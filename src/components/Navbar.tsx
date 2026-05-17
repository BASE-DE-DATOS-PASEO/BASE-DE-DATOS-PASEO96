"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/categorias" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > 120 && y > lastScrollY.current + 8) {
        setHidden(true);
      } else if (y < lastScrollY.current - 4 || y < 80) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  return (
    <>
      {/* ============== DESKTOP/MOBILE: Floating glass capsule ============== */}
      <nav
        aria-label="Navegación principal"
        className={`v2-navbar ${scrolled ? "scrolled" : ""} ${hidden && !mobileOpen ? "nav-hidden" : ""}`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 pl-2 pr-2 sm:pr-4 py-1.5 group"
          >
            <div className="relative w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <ShoppingBag className="w-4 h-4 text-white" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/40" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 hidden sm:inline">
              PASEO <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">96</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 mx-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-blue-700 bg-blue-50/80"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 ml-1">
            <Link
              href="/planes"
              className="px-3.5 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-white/60 transition-all duration-300"
            >
              Vender en Paseo 96
            </Link>
            <Link
              href="/login"
              className="v2-btn-primary !py-2 !px-4 !text-sm"
            >
              <User className="w-3.5 h-3.5" />
              Iniciar sesión
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden v2-icon-btn !w-9 !h-9 !shadow-none !border-0 !bg-transparent hover:!bg-white/60"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile panel */}
      <div
        role="dialog"
        aria-label="Menú de navegación"
        aria-hidden={!mobileOpen}
        className={`v2-mobile-menu fixed top-0 right-0 bottom-0 z-[70] w-[280px] transform transition-transform duration-350 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/40">
          <span className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              PASEO <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">96</span>
            </span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-full hover:bg-white/60 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-3 pt-4 flex flex-col h-[calc(100%-65px)]">
          <div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-white/60 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pb-6 px-3 flex flex-col gap-2.5">
            <Link
              href="/planes"
              onClick={() => setMobileOpen(false)}
              className="v2-btn-ghost w-full"
            >
              Vender en Paseo 96
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="v2-btn-primary w-full"
            >
              <User className="w-4 h-4" />
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
