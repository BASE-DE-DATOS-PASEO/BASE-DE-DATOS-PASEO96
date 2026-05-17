"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, UserCircle2 } from "lucide-react";

interface NavbarProps {
  /** Optional persistent search (only shown when wired up from a page) */
  searchValue?: string;
  onSearchChange?: (q: string) => void;
  onSearchSubmit?: () => void;
}

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/categorias" },
];

export default function Navbar({ searchValue, onSearchChange, onSearchSubmit }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const hasSearch = onSearchChange !== undefined;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > 200 && y > lastScrollY.current + 8) {
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
        aria-label="Navegación principal"
        className={`v3-navbar fixed top-0 left-0 right-0 z-50 ${scrolled ? "scrolled" : ""} ${hidden && !mobileOpen ? "nav-hidden" : ""}`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-4 sm:gap-8 h-16">
            {/* Logo — pure wordmark */}
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-[17px] font-extrabold tracking-[-0.02em] text-[#0A0A0A]">
                PASEO <span className="text-[#3B82F6]">96</span>
              </span>
            </Link>

            {/* Desktop: nav links */}
            <div className="hidden md:flex items-center gap-1 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                      isActive
                        ? "text-[#0A0A0A]"
                        : "text-[#737373] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Persistent search (center, takes remaining space) */}
            {hasSearch ? (
              <div className="flex-1 max-w-md mx-auto hidden sm:block">
                <form
                  onSubmit={(e) => { e.preventDefault(); onSearchSubmit?.(); }}
                  className="v3-search"
                >
                  <Search className="w-4 h-4 text-[#737373] shrink-0" />
                  <input
                    type="text"
                    value={searchValue ?? ""}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Buscar productos…"
                    aria-label="Buscar productos"
                    className="flex-1 ml-2.5 text-sm text-[#0A0A0A] placeholder:text-[#737373] bg-transparent outline-none"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => onSearchChange?.("")}
                      className="ml-2 text-[#737373] hover:text-[#0A0A0A] text-xs"
                      aria-label="Limpiar búsqueda"
                    >
                      ✕
                    </button>
                  )}
                </form>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <Link
                href="/planes"
                className="px-4 py-2 text-sm font-semibold text-[#0A0A0A] rounded-full border border-[#0A0A0A]/15 hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition-all"
              >
                Vender en Paseo 96
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#3B82F6] rounded-full hover:bg-[#2F6EE0] transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/30"
              >
                <UserCircle2 className="w-4 h-4" />
                Ingresar
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 -mr-1 flex items-center justify-center rounded-full hover:bg-[#0A0A0A]/5 transition-colors"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              <Menu className="w-5 h-5 text-[#0A0A0A]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[#0A0A0A]/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile panel */}
      <div
        role="dialog"
        aria-label="Menú de navegación"
        aria-hidden={!mobileOpen}
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[300px] bg-[#FAFAF7] border-l border-[#0A0A0A]/10 transform transition-transform duration-350 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#0A0A0A]/10">
          <span className="text-[15px] font-extrabold tracking-[-0.02em] text-[#0A0A0A]">
            PASEO<span className="font-light italic text-[#525252]">/</span>96
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#0A0A0A]/5 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-[#0A0A0A]" />
          </button>
        </div>

        <div className="px-3 pt-4 flex flex-col h-[calc(100%-81px)]">
          <div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-5 py-3.5 text-[15px] font-medium text-[#0A0A0A] hover:bg-[#0A0A0A]/5 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/planes"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-5 py-3.5 text-[15px] font-medium text-[#737373] hover:bg-[#0A0A0A]/5 rounded-lg transition-colors duration-200"
            >
              Vender en Paseo 96
            </Link>
          </div>
          <div className="mt-auto pb-6 px-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-[#3B82F6] text-white font-semibold text-[15px] hover:bg-[#2F6EE0] transition-colors shadow-lg shadow-blue-500/25"
            >
              <UserCircle2 className="w-4 h-4" />
              Ingresar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
