"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle, MapPin, Star, CreditCard, RefreshCw, Truck, Filter, ChevronDown } from "lucide-react";
import { usePublicStore } from "@/data/mock";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { trackingRepo } from "@/lib/db";
import { getPuesteroIdFromLocalId } from "@/lib/data-bridge";

export default function PuestoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { categorias, productos, getLocalById } = usePublicStore();
  const [orden, setOrden] = useState("relevantes");
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

  const local = getLocalById(id);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  // Track vista del puesto al abrir la página
  useEffect(() => {
    if (!local) return;
    const puesteroId = getPuesteroIdFromLocalId(id);
    if (puesteroId) trackingRepo.vistaPuestero(puesteroId);
  }, [id, local]);

  if (!local) {
    return (
      <div className="public-layout min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-pub-text-secondary text-lg mb-4">Puesto no encontrado</p>
            <Link href="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isPremium = local.plan === "plata" || local.plan === "oro";
  const allProducts = productos.filter((p) => p.localId === id);

  // Get unique categories for this store
  const storeCategorias = Array.from(new Set(allProducts.map((p) => p.categoriaId)))
    .map((catId) => categorias.find((c) => c.id === catId))
    .filter(Boolean);

  // Filter by category
  const filteredProducts = categoriaActiva
    ? allProducts.filter((p) => p.categoriaId === categoriaActiva)
    : allProducts;

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (orden === "menor") return a.precio - b.precio;
    if (orden === "mayor") return b.precio - a.precio;
    return 0;
  });

  const waMessage = encodeURIComponent(`Hola! Vi tu puesto "${local.nombre}" en Paseo 96 y quería consultarte.`);
  const waLink = `https://wa.me/${local.telefono}?text=${waMessage}`;

  return (
    <div className="public-layout min-h-screen">
      <Navbar />

      {/* Store header */}
      <div className={`pt-20 pb-8 ${isPremium ? (local.plan === "oro" ? "bg-gradient-to-b from-amber-50 to-[var(--color-pub-bg)]" : "bg-gradient-to-b from-slate-50 to-[var(--color-pub-bg)]") : "bg-[var(--color-pub-bg)]"}`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-pub-text-secondary hover:text-pub-primary text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Store info card */}
          <div ref={headerRef} className="reveal flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo */}
            {local.logoUrl ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg relative bg-white">
                <Image
                  src={local.logoUrl}
                  alt={local.nombre}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold text-white shrink-0 shadow-lg"
                style={{ backgroundColor: local.color }}
              >
                {local.logo}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-pub-primary">{local.nombre}</h1>
                {isPremium && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    local.plan === "oro"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    <Star className={`w-3.5 h-3.5 ${local.plan === "oro" ? "fill-amber-500" : "fill-slate-400"}`} />
                    Puesto destacado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-pub-text-secondary">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{local.ubicacion}</span>
              </div>
              <p className="text-sm text-pub-text-secondary mt-1">
                {allProducts.length} productos publicados
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  const puesteroId = getPuesteroIdFromLocalId(id);
                  if (puesteroId) trackingRepo.whatsappPuestero(puesteroId);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                Contactar
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="mt-6 flex flex-wrap gap-2">
            {local.aceptaTransferencia && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pub-border text-xs text-pub-text-secondary shadow-sm">
                <CreditCard className="w-3.5 h-3.5" /> Acepta transferencia
              </span>
            )}
            {local.aceptaCambios && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pub-border text-xs text-pub-text-secondary shadow-sm">
                <RefreshCw className="w-3.5 h-3.5" /> Acepta cambios
              </span>
            )}
            {local.realizaEnvios && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pub-border text-xs text-pub-text-secondary shadow-sm">
                <Truck className="w-3.5 h-3.5" /> Realiza envíos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaActiva(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoriaActiva === null
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-pub-text-secondary hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {storeCategorias.map((cat) => cat && (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
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

          {/* Sort */}
          <div className="flex items-center gap-3 shrink-0">
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

        {/* Products grid */}
        <div ref={gridRef} className="reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {sortedProducts.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-pub-text-secondary text-lg">
              {categoriaActiva ? "No hay productos en esta categoría" : "Este puesto aún no tiene productos publicados"}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
