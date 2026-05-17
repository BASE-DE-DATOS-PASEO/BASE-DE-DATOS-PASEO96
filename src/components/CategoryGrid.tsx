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
      className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      {/* Section header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="fluid-h2 font-bold text-gray-900">Explorá por categorías</h2>
        <Link
          href="/categorias"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
          className={`hidden sm:flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Fade left */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-2 no-scrollbar snap-x snap-mandatory"
        >
          {categorias.map((cat) => {
            const catInfo = catIconMap[cat.nombre] ?? fallbackIcon;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                aria-label={`Ver categoría ${cat.nombre}`}
                className="btn-press group relative shrink-0 snap-start overflow-hidden rounded-2xl bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 w-[44vw] sm:w-[230px] aspect-[3/4]"
              >
                {cat.imagen ? (
                  <Image
                    src={cat.imagen}
                    alt={cat.nombre}
                    fill
                    sizes="(max-width: 640px) 44vw, 230px"
                    className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.12]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/85" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`shrink-0 w-8 h-8 rounded-full ${catInfo.bg} flex items-center justify-center shadow-sm`}
                      >
                        {catInfo.icon}
                      </div>
                      <div className="min-w-0 text-left">
                        <h3 className="text-white font-semibold text-sm leading-tight truncate drop-shadow">
                          {cat.nombre}
                        </h3>
                        <p className="text-white/70 text-xs">{cat.cantidadLocales} locales</p>
                      </div>
                    </div>
                    <div className="shrink-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
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
          className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Más categorías"
          className={`hidden sm:flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
