"use client";

import { Home, Grid3X3, Search, MapPin } from "lucide-react";

interface BottomNavProps {
  onSearchFocus: () => void;
}

export default function BottomNav({ onSearchFocus }: BottomNavProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav md:hidden">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-blue-600"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        <button
          onClick={() => scrollToSection("categorias")}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-pub-text-secondary"
        >
          <Grid3X3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Categorías</span>
        </button>
        <button
          onClick={onSearchFocus}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-pub-text-secondary"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Buscar</span>
        </button>
        <button
          onClick={() => scrollToSection("ubicacion")}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-pub-text-secondary"
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-medium">Ubicación</span>
        </button>
      </div>
    </nav>
  );
}
