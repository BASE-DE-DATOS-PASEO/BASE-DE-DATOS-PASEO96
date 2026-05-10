"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { usePublicStore } from "@/data/mock";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ProductGridProps {
  busqueda: string;
  categoriaActiva: string | null;
  onCategoriaChange: (cat: string | null) => void;
}

export default function ProductGrid({ busqueda, categoriaActiva, onCategoriaChange }: ProductGridProps) {
  const { productos, categorias, getLocalById } = usePublicStore();
  const [orden, setOrden] = useState("relevantes");
  const [loading, setLoading] = useState(true);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>(0.05);

  // Simulate initial loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Filter by category
  let productosFiltrados = categoriaActiva
    ? productos.filter((p) => p.categoriaId === categoriaActiva)
    : productos;

  // Filter by search query
  if (busqueda.trim()) {
    const q = busqueda.toLowerCase().trim();
    productosFiltrados = productosFiltrados.filter((p) => {
      const local = getLocalById(p.localId);
      return (
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
        (local && local.nombre.toLowerCase().includes(q))
      );
    });
  }

  // Sort: premium first, then by selected order
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
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

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header with filters */}
      <div ref={headerRef} className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="fluid-h2 font-bold text-pub-primary">
            {busqueda ? `Resultados para "${busqueda}"` : "Todos los productos"}
          </h2>
          <p className="text-pub-text-secondary text-sm mt-0.5">
            {productosOrdenados.length} productos encontrados
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
              onChange={(e) => setOrden(e.target.value)}
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

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => onCategoriaChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
            onClick={() => onCategoriaChange(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              categoriaActiva === cat.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-pub-text-secondary hover:bg-gray-200"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Product grid — fade-in suave al entrar al viewport */}
      <div
        ref={gridRef}
        className="reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
      >
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : productosOrdenados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))
        }
      </div>

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
