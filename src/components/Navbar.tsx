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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 navbar-glass ${
          scrolled ? "scrolled" : ""
        } ${hidden && !mobileOpen ? "nav-hidden" : ""}`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2 shrink-0 btn-press">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                PASEO <span className="text-blue-600">96</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors duration-200 group ${
                      isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute left-0 -bottom-1 w-full h-[2px] bg-blue-600 rounded-full transition-transform duration-300 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <Link
                href="/planes"
                className="btn-press px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Vender en Paseo 96
              </Link>
              <Link
                href="/login"
                className="btn-press flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-600/20"
              >
                <User className="w-4 h-4" />
                Iniciar sesión
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors btn-press"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] mobile-menu-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile panel */}
      <div
        role="dialog"
        aria-label="Menú de navegación"
        aria-hidden={!mobileOpen}
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[280px] mobile-menu-panel transform transition-transform duration-350 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-pub-border">
          <span className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              PASEO <span className="text-blue-600">96</span>
            </span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors btn-press"
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
                className="flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pb-6 px-3 flex flex-col gap-2">
            <Link
              href="/planes"
              onClick={() => setMobileOpen(false)}
              className="btn-press flex items-center justify-center w-full border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Vender en Paseo 96
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="btn-press flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
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
