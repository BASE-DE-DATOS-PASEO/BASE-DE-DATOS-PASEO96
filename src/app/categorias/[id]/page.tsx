"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Filter, ChevronDown } from "lucide-react";
import { usePublicStore } from "@/data/mock";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CategoriaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { categorias, productos, getLocalById } = usePublicStore();
  const [orden, setOrden] = useState("relevantes");

  const categoria = categorias.find((c) => c.id === id);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  if (!categoria) {
    return (
      <div className="public-layout min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-pub-text-secondary text-lg mb-4">Categoría no encontrada</p>
          <Link href="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const productosFiltrados = productos.filter((p) => p.categoriaId === id);

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
    <div className="public-layout min-h-screen">
      <Navbar />

      {/* Category hero */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        {categoria.imagen ? (
          <Image
            src={categoria.imagen}
            alt={categoria.nombre}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 max-w-[1280px] mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{categoria.nombre}</h1>
          <p className="text-white/60 text-sm mt-1">{productosOrdenados.length} productos</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort */}
        <div ref={headerRef} className="reveal flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-pub-text-secondary" />
            <span className="text-sm text-pub-text-secondary">Ordenar:</span>
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

        {/* Products */}
        <div ref={gridRef} className="reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {productosOrdenados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>

        {productosOrdenados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-pub-text-secondary text-lg">No hay productos en esta categoría</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
