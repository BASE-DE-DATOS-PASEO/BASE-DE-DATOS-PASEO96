"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User, Sparkles, MoreHorizontal, Tag } from "lucide-react";
import { usePublicStore } from "@/data/mock";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="categorias"
      className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      {/* Section header */}
      <div ref={headerRef} className="reveal mb-8 flex items-center justify-between">
        <h2 className="fluid-h2 font-bold text-gray-900">Explorá por categorías</h2>
        <Link
          href="/categorias"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="reveal-stagger reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        {categorias.map((cat) => {
          const catInfo = catIconMap[cat.nombre] ?? fallbackIcon;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              aria-label={`Ver categoría ${cat.nombre}`}
              className="btn-press group relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              {cat.imagen ? (
                <Image
                  src={cat.imagen}
                  alt={cat.nombre}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
                    <div className="min-w-0">
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
    </section>
  );
}
