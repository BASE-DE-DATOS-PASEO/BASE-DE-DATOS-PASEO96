"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Filter, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { usePublicStore } from "@/data/mock";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridProps {
  busqueda: string;
  categoriaActiva: string | null;
  onCategoriaChange: (cat: string | null) => void;
}

// Productos visibles por página (≈10 filas × 6 columnas en desktop)
const PAGE_SIZE = 60;

export default function ProductGrid({ busqueda, categoriaActiva, onCategoriaChange }: ProductGridProps) {
  const { productos, categorias, getLocalById } = usePublicStore();
  const [orden, setOrden] = useState("relevantes");
  const [loading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ── Slider de categorías ───────────────────────────────────
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

  // Reset visible count when filters change
  const handleCategoriaChange = useCallback((cat: string | null) => {
    setVisibleCount(PAGE_SIZE);
    onCategoriaChange(cat);
  }, [onCategoriaChange]);

  // Filter & sort (memoized for perf with large datasets)
  const productosOrdenados = useMemo(() => {
    // Filter by category
    let filtered = categoriaActiva
      ? productos.filter((p) => p.categoriaId === categoriaActiva)
      : productos;

    // Filter by search query
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

    // Sort: premium first, then by selected order
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
    <section className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <span className="v2-section-eyebrow mb-3">{busqueda ? "Búsqueda" : "Catálogo completo"}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl v2-display">
            {busqueda ? (
              <>Resultados <span className="v2-display-accent">para “{busqueda}”</span></>
            ) : (
              <>Todos los <span className="v2-display-accent">productos</span></>
            )}
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">
            {productosOrdenados.length.toLocaleString("es-AR")} productos encontrados
            {hayMas && (
              <span className="text-blue-600 ml-1">
                · mostrando {productosVisibles.length}
              </span>
            )}
          </p>
        </div>

        {/* Sort dropdown — glass style */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <Filter className="w-4 h-4" />
            <span>Ordenar:</span>
          </div>
          <div className="relative">
            <select
              value={orden}
              onChange={(e) => { setOrden(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="v2-glass-soft appearance-none rounded-full pl-5 pr-10 py-2.5 text-sm font-medium text-slate-800 focus:outline-none cursor-pointer hover:bg-white/80 transition-colors"
            >
              <option value="relevantes">Más relevantes</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category filter slider — glass chips */}
      <div className="relative mb-10">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="Categorías anteriores"
          className={`v2-icon-btn !w-9 !h-9 absolute left-0 top-1/2 -translate-y-1/2 z-10 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Fade left */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-[#F4F7FC] via-[#F4F7FC]/70 to-transparent pointer-events-none z-[5] transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="flex gap-2.5 overflow-x-auto scroll-smooth px-2 py-2 no-scrollbar"
        >
          <button
            type="button"
            onClick={() => handleCategoriaChange(null)}
            className={`v2-chip shrink-0 ${categoriaActiva === null ? "v2-chip-active" : ""}`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoriaChange(cat.id)}
              className={`v2-chip shrink-0 ${categoriaActiva === cat.id ? "v2-chip-active" : ""}`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Fade right */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-[#F4F7FC] via-[#F4F7FC]/70 to-transparent pointer-events-none z-[5] transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Más categorías"
          className={`v2-icon-btn !w-9 !h-9 absolute right-0 top-1/2 -translate-y-1/2 z-10 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : productosVisibles.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))
        }
      </div>

      {/* Ver más — glass + progress bar */}
      {!loading && hayMas && (
        <div className="mt-14 flex flex-col items-center gap-4">
          <div className="w-full max-w-sm h-2 rounded-full overflow-hidden bg-white/60 backdrop-blur-sm border border-white/80 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              style={{ width: `${(visibleCount / productosOrdenados.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Mostrando <span className="font-bold text-slate-700">{productosVisibles.length}</span> de <span className="font-bold text-slate-700">{productosOrdenados.length}</span>
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="v2-btn-primary group !py-3.5 !px-8 !text-sm"
          >
            Ver más productos
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* All loaded message */}
      {!loading && !hayMas && productosOrdenados.length > PAGE_SIZE && (
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Mostrando todos los {productosOrdenados.length} productos ✨
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && productosOrdenados.length === 0 && (
        <div className="text-center py-20 v2-glass rounded-3xl">
          <p className="text-slate-500 text-lg">
            {busqueda
              ? `No se encontraron productos para “${busqueda}”`
              : "No hay productos en esta categoría"}
          </p>
        </div>
      )}
    </section>
  );
}
