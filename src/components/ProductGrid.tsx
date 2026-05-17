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
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="fluid-h2 font-bold text-pub-primary">
            {busqueda ? `Resultados para "${busqueda}"` : "Todos los productos"}
          </h2>
          <p className="text-pub-text-secondary text-sm mt-0.5">
            {productosOrdenados.length} productos encontrados
            {hayMas && (
              <span className="text-blue-500 ml-1">
                — mostrando {productosVisibles.length}
              </span>
            )}
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-pub-text-secondary">
            <Filter className="w-4 h-4" />
            <span>Ordenar:</span>
          </div>
          <div className="relative">
            <select
              value={orden}
              onChange={(e) => { setOrden(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="appearance-none bg-white border border-pub-border rounded-xl px-4 py-2 pr-9 text-sm text-pub-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="relevantes">Más relevantes</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pub-text-secondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category filter slider with arrows */}
      <div className="relative mb-8">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="Categorías anteriores"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-pub-text hover:bg-gray-50 transition-all duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Fade left */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none z-[5] transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto scroll-smooth px-2 py-1 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            type="button"
            onClick={() => handleCategoriaChange(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              categoriaActiva === null
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-pub-text-secondary hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoriaChange(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoriaActiva === cat.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-pub-text-secondary hover:bg-gray-200"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Fade right */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-[5] transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Más categorías"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-pub-text hover:bg-gray-50 transition-all duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : productosVisibles.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))
        }
      </div>

      {/* Ver más */}
      {!loading && hayMas && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(visibleCount / productosOrdenados.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-pub-text-secondary">
            Mostrando {productosVisibles.length} de {productosOrdenados.length} productos
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="group flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Ver más productos
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* All loaded message */}
      {!loading && !hayMas && productosOrdenados.length > PAGE_SIZE && (
        <div className="mt-8 text-center">
          <p className="text-sm text-pub-text-secondary">
            Mostrando todos los {productosOrdenados.length} productos
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && productosOrdenados.length === 0 && (
        <div className="text-center py-16">
          <p className="text-pub-text-secondary text-lg">
            {busqueda
              ? `No se encontraron productos para "${busqueda}"`
              : "No hay productos en esta categoría"}
          </p>
        </div>
      )}
    </section>
  );
}
