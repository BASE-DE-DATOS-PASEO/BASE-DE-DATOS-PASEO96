"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { usePublicStore } from "@/data/mock";

interface HeroProps {
  onExplore: () => void;
}

function calcIsOpen(): boolean {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  return [0, 4, 6].includes(day) && mins >= 630 && mins < 1230;
}

export default function Hero({ onExplore }: HeroProps) {
  const [isOpen, setIsOpen] = useState(calcIsOpen);
  const { productos } = usePublicStore();

  useEffect(() => {
    const id = setInterval(() => setIsOpen(calcIsOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Imágenes fallback para el hero — siempre se muestran aunque la
  // DB esté vacía. Cuando hay productos reales con foto, se usan ellos.
  const HERO_FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=85",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85",
  ];

  // 4 imágenes para el mosaico (productos reales primero, fallback si vacío)
  const mosaicImages = useMemo(() => {
    const realImages = productos
      .filter((p) => p.imagenes && p.imagenes[0])
      .slice(0, 4)
      .map((p) => ({ src: p.imagenes[0], alt: p.nombre }));

    if (realImages.length >= 4) return realImages;

    // Completar con fallback si faltan
    return [
      ...realImages,
      ...HERO_FALLBACK_IMAGES.slice(realImages.length, 4).map((src, i) => ({
        src,
        alt: `Paseo 96 — feria ${i + 1}`,
      })),
    ];
  }, [productos]);

  return (
    <section className="relative w-full pt-24 sm:pt-28 pb-12 sm:pb-20 overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Top: status badge */}
        <div className="mb-8 sm:mb-12">
          <div className={`v3-status-badge ${isOpen ? "v3-status-open" : "v3-status-closed"}`}>
            <span className="v3-pulse-dot" aria-hidden />
            <span>{isOpen ? "Feria abierta ahora" : "Feria cerrada"}</span>
          </div>
        </div>

        {/* Main hero grid — asymmetric 7/5 split */}
        <div className="grid grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-end">

          {/* ── Left: Statement (7 cols) ── */}
          <div className="col-span-12 lg:col-span-7">
            <h1 className="v3-display text-[14vw] sm:text-[88px] lg:text-[112px] xl:text-[128px]">
              La feria
              <br />
              <span className="text-[#3B82F6]">de siempre,</span>
              <br />
              <span className="v3-display-italic text-[#737373]">a un clic.</span>
            </h1>

            <div className="mt-8 sm:mt-10 max-w-[460px] flex flex-col gap-7">
              <p className="text-[15px] sm:text-base leading-relaxed text-[#525252]">
                Recorré los puestos del Paseo 96 desde tu pantalla.
                Encontrá lo que buscás, escribile al vendedor por WhatsApp y
                pasá a retirar. Sin intermediarios, sin envíos, sin esperas.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onExplore}
                  className="v3-btn-accent"
                >
                  Explorar feria
                  <ArrowDownRight className="w-4 h-4" />
                </button>
                <a
                  href="#puesteros"
                  className="v3-btn-ghost"
                >
                  Ver puestos destacados
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: Mosaic of 4 products (5 cols) ── */}
          <div className="col-span-12 lg:col-span-5">
            <div className="relative w-full aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <div className="grid grid-cols-12 grid-rows-12 gap-3 h-full">

                {/* Card 1 — big (top-left) */}
                <div className="col-span-7 row-span-7 relative rounded-xl overflow-hidden bg-[#F2F2EE] group cursor-pointer" onClick={onExplore}>
                  <Image
                    src={mosaicImages[0].src}
                    alt={mosaicImages[0].alt}
                    fill
                    sizes="(max-width: 1024px) 60vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                    Lo último
                  </div>
                </div>

                {/* Card 2 — small (top-right) */}
                <div className="col-span-5 row-span-5 relative rounded-xl overflow-hidden bg-[#F2F2EE] group cursor-pointer" onClick={onExplore}>
                  <Image
                    src={mosaicImages[1].src}
                    alt={mosaicImages[1].alt}
                    fill
                    sizes="(max-width: 1024px) 40vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Card 3 — small (bottom-right top) */}
                <div className="col-span-5 row-span-7 col-start-8 row-start-6 relative rounded-xl overflow-hidden bg-[#F2F2EE] group cursor-pointer" onClick={onExplore}>
                  <Image
                    src={mosaicImages[2].src}
                    alt={mosaicImages[2].alt}
                    fill
                    sizes="(max-width: 1024px) 40vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Card 4 — small (bottom-left) */}
                <div className="col-span-7 row-span-5 col-start-1 row-start-8 relative rounded-xl overflow-hidden bg-[#F2F2EE] group cursor-pointer" onClick={onExplore}>
                  <Image
                    src={mosaicImages[3].src}
                    alt={mosaicImages[3].alt}
                    fill
                    sizes="(max-width: 1024px) 60vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating CTA on mosaic */}
                <button
                  onClick={onExplore}
                  aria-label="Explorar productos"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3B82F6] shadow-xl shadow-blue-500/40 flex items-center justify-center text-white hover:scale-110 hover:bg-[#2F6EE0] active:scale-95 transition-all z-10 group"
                >
                  <ArrowUpRight className="w-7 h-7 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
