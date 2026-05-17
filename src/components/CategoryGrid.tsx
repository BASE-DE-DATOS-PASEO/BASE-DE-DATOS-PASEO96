"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User, Sparkles, MoreHorizontal, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { usePublicStore } from "@/data/mock";

interface CategoryGridProps {
  onCategorySelect: (catId: string) => void;
}

const catIconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  Mujer: { icon: <User className="w-3.5 h-3.5 text-white" />, bg: "bg-blue-500" },
  Hombre: { icon: <User className="w-3.5 h-3.5 text-white" />, bg: "bg-blue-600" },
  Niños: { icon: <Sparkles className="w-3.5 h-3.5 text-white" />, bg: "bg-blue-400" },
  Otros: { icon: <MoreHorizontal className="w-3.5 h-3.5 text-white" />, bg: "bg-blue-700" },
};

const fallbackIcon = { icon: <Tag className="w-3.5 h-3.5 text-white" />, bg: "bg-gray-500" };

export default function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  const { categorias } = usePublicStore();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    checkScrollButtons();
    el.addEventListener("scroll", checkScrollButtons, { passive: true });
    const ro = new ResizeObserver(checkScrollButtons);
    ro.observe(el);
    window.addEventListener("resize", checkScrollButtons);
    return () => {
      el.removeEventListener("scroll", checkScrollButtons);
      ro.disconnect();
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [checkScrollButtons, categorias.length]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scrollea aprox. el ancho visible (1 página de tarjetas)
    const amount = Math.max(280, el.clientWidth * 0.85);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section
      id="categorias"
      className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 v2-mesh-section"
    >
      {/* Section header */}
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="v2-section-eyebrow mb-3">Catálogo curado</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl v2-display">
            Explorá por <span className="v2-display-accent">categorías</span>
          </h2>
        </div>
        <Link
          href="/categorias"
          className="v2-btn-ghost !py-2 !px-4 !text-sm hidden sm:inline-flex"
        >
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal slider */}
      <div className="relative">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="Categorías anteriores"
          className={`v2-icon-btn hidden sm:flex absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-20 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Fade left */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F4F7FC] via-[#F4F7FC]/70 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 no-scrollbar snap-x snap-mandatory"
        >
          {categorias.map((cat) => {
            const catInfo = catIconMap[cat.nombre] ?? fallbackIcon;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                aria-label={`Ver categoría ${cat.nombre}`}
                className="group relative shrink-0 snap-start overflow-hidden rounded-[1.75rem] cursor-pointer w-[48vw] sm:w-[240px] aspect-[3/4] border border-white/60 shadow-[0_8px_30px_-8px_rgba(15,52,96,0.18),0_2px_4px_rgba(15,52,96,0.04)] hover:shadow-[0_24px_60px_-14px_rgba(59,130,246,0.35),0_8px_16px_rgba(59,130,246,0.12)] hover:-translate-y-2 transition-all duration-500 ease-out bg-gradient-to-br from-slate-100 via-white to-blue-50"
              >
                {cat.imagen && (
                  <Image
                    src={cat.imagen}
                    alt={cat.nombre}
                    fill
                    sizes="(max-width: 640px) 48vw, 240px"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent transition-opacity duration-500 group-hover:from-slate-950/90" />

                {/* Inner glass highlight */}
                <div className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/20 pointer-events-none" />

                {/* Glass info panel at bottom */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="v2-glass-strong rounded-2xl px-3.5 py-3 flex items-center justify-between gap-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`shrink-0 w-9 h-9 rounded-xl ${catInfo.bg} flex items-center justify-center shadow-md`}>
                        {catInfo.icon}
                      </div>
                      <div className="min-w-0 text-left">
                        <h3 className="text-slate-900 font-bold text-sm leading-tight truncate">
                          {cat.nombre}
                        </h3>
                        <p className="text-slate-500 text-[11px] font-medium">{cat.cantidadLocales} locales</p>
                      </div>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-blue-500/30">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fade right */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F4F7FC] via-[#F4F7FC]/70 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Más categorías"
          className={`v2-icon-btn hidden sm:flex absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-20 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
