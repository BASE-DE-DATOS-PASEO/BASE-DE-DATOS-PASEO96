"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { usePublicStore, formatPrecio } from "@/data/mock";

export default function FeaturedProducts() {
  const { productos, getLocalById } = usePublicStore();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Top 12 productos: priorizar puestos premium, luego más nuevos
  const featured = useMemo(() => {
    const planWeight = (plan?: string) => plan === "oro" ? 2 : plan === "plata" ? 1 : 0;
    return [...productos]
      .filter((p) => p.imagenes && p.imagenes[0])
      .sort((a, b) => {
        const la = getLocalById(a.localId);
        const lb = getLocalById(b.localId);
        const aWeight = planWeight(la?.plan);
        const bWeight = planWeight(lb?.plan);
        if (bWeight !== aWeight) return bWeight - aWeight;
        return 0;
      })
      .slice(0, 12);
  }, [productos, getLocalById]);

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
  }, [checkScrollButtons, featured.length]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(320, el.clientWidth * 0.7);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (featured.length === 0) return null;

  return (
    <section className="relative w-full py-16 sm:py-24 v3-border-b">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="v3-eyebrow mb-4">Edición del día</span>
            <h2 className="mt-3 v3-display text-[40px] sm:text-[56px] lg:text-[68px]">
              Lo nuevo<br />
              <span className="v3-display-italic text-[#737373]">en la feria</span>
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Anteriores"
              className={`v3-icon-btn ${canScrollLeft ? "" : "opacity-30 cursor-not-allowed"}`}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Siguientes"
              className={`v3-icon-btn ${canScrollRight ? "" : "opacity-30 cursor-not-allowed"}`}
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroller */}
        <div className="relative -mx-5 sm:-mx-8 lg:-mx-12">
          <div
            ref={scrollerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory px-5 sm:px-8 lg:px-12 pb-4"
          >
            {featured.map((producto, idx) => {
              const local = getLocalById(producto.localId);
              if (!local) return null;
              const isPremium = local.plan === "oro" || local.plan === "plata";

              return (
                <a
                  key={producto.id}
                  href={`/puesto/${producto.localId}`}
                  className="v3-product-card group shrink-0 snap-start w-[72vw] sm:w-[42vw] md:w-[320px]"
                >
                  {/* Image */}
                  <div className="v3-product-image relative aspect-[4/5]">
                    <div className="v3-product-image-inner absolute inset-0">
                      <Image
                        src={producto.imagenes[0]}
                        alt={producto.nombre}
                        fill
                        sizes="(max-width: 640px) 72vw, (max-width: 768px) 42vw, 320px"
                        className="object-cover"
                      />
                    </div>

                    {/* Number indicator top-left */}
                    <div className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white drop-shadow-md">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    {/* Premium badge top-right */}
                    {isPremium && (
                      <div className="absolute top-4 right-4">
                        <span className="v3-premium-badge !bg-white/95 !text-[#0A0A0A]">
                          {local.plan === "oro" ? "Oro" : "Plata"}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* Arrow on hover */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                      <ArrowUpRight className="w-4 h-4 text-[#0A0A0A]" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4 px-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#737373] mb-2">
                      <span className="truncate max-w-[140px]">{local.nombre}</span>
                      <span className="w-1 h-1 rounded-full bg-[#737373]/40" />
                      <span>{local.ubicacion}</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0A0A0A] leading-snug line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#0A0A0A] tracking-tight">
                        {formatPrecio(producto.precio)}
                      </span>
                      {producto.precioAnterior && (
                        <span className="text-xs text-[#A3A3A3] line-through">
                          {formatPrecio(producto.precioAnterior)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
