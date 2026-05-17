"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { usePublicStore } from "@/data/mock";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridProps {
  busqueda: string;
  categoriaActiva: string | null;
  onCategoriaChange: (cat: string | null) => void;
}

const PAGE_SIZE = 60;

export default function ProductGrid({ busqueda, categoriaActiva, onCategoriaChange }: ProductGridProps) {
  const { productos, categorias, getLocalById } = usePublicStore();
  const [orden, setOrden] = useState("relevantes");
  const [loading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Slider de categorías
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
    const amount = Math.max(240, el.clientWidth * 0.7);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleCategoriaChange = useCallback((cat: string | null) => {
    setVisibleCount(PAGE_SIZE);
    onCategoriaChange(cat);
  }, [onCategoriaChange]);

  const productosOrdenados = useMemo(() => {
    let filtered = categoriaActiva
      ? productos.filter((p) => p.categoriaId === categoriaActiva)
      : productos;

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const local = getLocalById(p.localId);
        return (
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
          (local && local.nombre.toLowerCase().includes(q))
        );
      });
    }

    return [...filtered].sort((a, b) => {
      const localA = getLocalById(a.localId);
      const localB = getLocalById(b.localId);
      const planWeight = (plan?: string) => plan === "oro" ? 2 : plan === "plata" ? 1 : 0;
      const aPremium = planWeight(localA?.plan);
      const bPremium = planWeight(localB?.plan);

      if (bPremium !== aPremium) return bPremium - aPremium;

      if (orden === "menor") return a.precio - b.precio;
      if (orden === "mayor") return b.precio - a.precio;
      return 0;
    });
  }, [productos, categoriaActiva, busqueda, orden, getLocalById]);

  const productosVisibles = productosOrdenados.slice(0, visibleCount);
  const hayMas = visibleCount < productosOrdenados.length;

  return (
    <section className="relative w-full py-16 sm:py-24">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header — eyebrow + display title + sort */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="v3-eyebrow mb-4">
              {busqueda ? "Búsqueda" : "Catálogo"}
            </span>
            <h2 className="mt-3 v3-display text-[40px] sm:text-[56px] lg:text-[68px]">
              {busqueda ? (
                <>Resultados<br /><span className="text-[#3B82F6]">para “{busqueda}”</span></>
              ) : (
                <>Todo en<br /><span className="text-[#3B82F6]">la feria.</span></>
              )}
            </h2>
          </div>
          <div className="flex sm:items-end">
            <div className="relative">
              <select
                value={orden}
                onChange={(e) => { setOrden(e.target.value); setVisibleCount(PAGE_SIZE); }}
                className="appearance-none bg-transparent border border-[#0A0A0A]/15 rounded-full pl-4 pr-9 py-2.5 text-sm font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] cursor-pointer hover:border-[#0A0A0A]/40 transition-colors"
              >
                <option value="relevantes">Más relevantes</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A0A0A] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category filter strip — NOT sticky (fixes the floating bar bug) */}
        <div className="relative mb-10">
          <button
            type="button"
            onClick={() => scrollBy("left")}
            aria-label="Anteriores"
            className={`v3-icon-btn !w-9 !h-9 absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 z-10 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FAFAF7] to-transparent pointer-events-none z-[5] transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={scrollerRef}
            className="flex gap-2 overflow-x-auto scroll-smooth py-1 no-scrollbar"
          >
            <button
              type="button"
              onClick={() => handleCategoriaChange(null)}
              className={`v3-chip shrink-0 ${categoriaActiva === null ? "v3-chip-active" : ""}`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoriaChange(cat.id)}
                className={`v3-chip shrink-0 ${categoriaActiva === cat.id ? "v3-chip-active" : ""}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div
            className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAFAF7] to-transparent pointer-events-none z-[5] transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          <button
            type="button"
            onClick={() => scrollBy("right")}
            aria-label="Siguientes"
            className={`v3-icon-btn !w-9 !h-9 absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 z-10 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : productosVisibles.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))
          }
        </div>

        {/* Ver más — slim progress bar (no numbers) + button */}
        {!loading && hayMas && (
          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="w-40 h-[2px] bg-[#0A0A0A]/08 relative overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-[#3B82F6] transition-all duration-700 rounded-full"
                style={{ width: `${(visibleCount / productosOrdenados.length) * 100}%` }}
              />
            </div>
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="v3-btn-primary"
            >
              Cargar más
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && !hayMas && productosOrdenados.length > PAGE_SIZE && (
          <div className="mt-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#737373]">
              Llegaste al final de la feria
            </p>
          </div>
        )}

        {!loading && productosOrdenados.length === 0 && (
          <div className="text-center py-20 v3-card">
            <p className="text-[#737373] text-base">
              {busqueda
                ? `No encontramos productos para “${busqueda}”`
                : "No hay productos en esta categoría todavía"}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
