"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePublicStore } from "@/data/mock";

interface CategoryGridProps {
  onCategorySelect: (catId: string) => void;
}

// Bento layout: primero un hero card, los siguientes en grilla regular
export default function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  const { categorias } = usePublicStore();

  // Mostramos las primeras 7 (1 hero + 6 regulares). Si hay menos, se adapta.
  const heroCat = categorias[0];
  const regularCats = categorias.slice(1, 7);

  if (!heroCat) return null;

  return (
    <section
      id="categorias"
      className="relative w-full py-16 sm:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <span className="v3-eyebrow mb-4">Categorías</span>
            <h2 className="mt-3 v3-display text-[40px] sm:text-[56px] lg:text-[68px]">
              Encontrá<br />
              <span className="text-[#3B82F6]">por rubro.</span>
            </h2>
          </div>
          <Link href="/categorias" className="v3-btn-link hidden sm:inline-flex mb-4">
            Ver todas las categorías
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento grid: 12 cols total */}
        <div className="grid grid-cols-12 gap-4 sm:gap-5">

          {/* Hero card — 6 cols, full height */}
          <button
            onClick={() => onCategorySelect(heroCat.id)}
            className="col-span-12 md:col-span-6 md:row-span-2 group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-auto bg-[#F2F2EE] text-left"
          >
            {heroCat.imagen && (
              <Image
                src={heroCat.imagen}
                alt={heroCat.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
              <h3 className="text-white text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                {heroCat.nombre}
              </h3>
              <div className="shrink-0 w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </button>

          {/* Regular cards — 6 cards in 3x2 grid (within the other 6 cols on desktop) */}
          {regularCats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-2xl aspect-[3/4] md:aspect-square bg-[#F2F2EE] text-left"
            >
              {cat.imagen && (
                <Image
                  src={cat.imagen}
                  alt={cat.nombre}
                  fill
                  sizes="(max-width: 768px) 50vw, 17vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                <h3 className="text-white text-base sm:text-lg font-bold tracking-tight leading-tight truncate min-w-0">
                  {cat.nombre}
                </h3>
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-md shadow-blue-500/40">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </button>
          ))}

        </div>

        {/* Mobile "Ver todas" link */}
        <div className="mt-8 sm:hidden">
          <Link href="/categorias" className="v3-btn-link">
            Ver todas las categorías
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
