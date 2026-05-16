"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, X, MessageCircle, Tag, Ruler, ArrowRight, CreditCard, RefreshCw, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductoPublico, getLocalById, formatPrecio, getProductosByLocal, getRelatedProducts } from "@/data/mock";
import { trackingRepo } from "@/lib/db";
import { getProductoIdFromPublicId } from "@/lib/data-bridge";

interface ProductCardProps {
  producto: ProductoPublico;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const local = getLocalById(producto.localId);
  const [modalOpen, setModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Bloquea el scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [modalOpen]);

  // Cierra el modal con la tecla Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modalOpen]);

  // Trackeamos vista cuando se abre el modal del producto
  useEffect(() => {
    if (!modalOpen) return;
    const pid = getProductoIdFromPublicId(producto.id);
    if (pid) trackingRepo.vistaProducto(pid);
  }, [modalOpen, producto.id]);

  // Solo renderizamos el portal del lado del cliente (SSR-safe)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!local) return null;

  const isPremium = local.plan === "plata" || local.plan === "oro";
  const moreFromSeller = useMemo(() => getProductosByLocal(producto.localId).filter(p => p.id !== producto.id).slice(0, 6), [producto.localId, producto.id]);
  const related = useMemo(() => getRelatedProducts(producto, 6), [producto]);

  const waMessage = encodeURIComponent(`Hola! Vi "${producto.nombre}" en Paseo 96 y quería consultar si está disponible.`);
  const waLink = `https://wa.me/${local.telefono}?text=${waMessage}`;

  return (
    <>
      {/* Card */}
      <div
        onClick={() => { setModalOpen(true); setActiveImg(0); }}
        className={`product-card-animate group cursor-pointer rounded-xl overflow-hidden ${
          isPremium
            ? local.plan === "oro"
              ? "premium-card-glow bg-gradient-to-b from-amber-50/80 to-white border border-amber-300/60"
              : "premium-card-glow bg-gradient-to-b from-slate-50/80 to-white border border-slate-300/60"
            : "bg-white border border-pub-border hover:shadow-lg hover:border-gray-200"
        }`}
      >
        {/* Local name header */}
        <div className={`px-3 py-2 flex items-center gap-2 ${isPremium ? (local.plan === "oro" ? "border-b border-amber-100" : "border-b border-slate-100") : "border-b border-gray-50"}`}>
          {local.logoUrl ? (
            <div className="w-5 h-5 rounded-full overflow-hidden bg-white shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={local.logoUrl} alt={local.nombre} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
              style={{ backgroundColor: local.color }}
            >
              {local.logo}
            </div>
          )}
          <span className="text-xs font-medium text-pub-text-secondary truncate">
            {local.nombre}
          </span>
          {isPremium && (
            <div className={`ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
              local.plan === "oro"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              <Star className={`w-2.5 h-2.5 ${local.plan === "oro" ? "fill-amber-500" : "fill-slate-400"}`} />
              <span className="text-[9px] font-semibold">Destacado</span>
            </div>
          )}
        </div>

        {/* Product image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
          {producto.imagenes[0] ? (
            <Image
              src={producto.imagenes[0]}
              alt={producto.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="text-gray-300 text-xs font-medium">Sin foto</div>
          )}
          {/* Sutil gradient al hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            aria-label="Me gusta"
            className={`btn-press absolute bottom-2 right-2 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-250 hover:bg-white hover:scale-110 ${
              liked ? "bg-white opacity-100 scale-100" : "bg-white/80 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
            }`}
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-pub-text-secondary"}`} />
          </button>
        </div>

        {/* Product info */}
        <div className="px-3 py-2.5">
          <h3 className="text-sm font-medium text-pub-text leading-tight line-clamp-2 min-h-[2.5rem]">
            {producto.nombre}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-pub-primary">
              {formatPrecio(producto.precio)}
            </span>
            {producto.precioAnterior && (
              <span className="text-xs text-pub-text-secondary line-through">
                {formatPrecio(producto.precioAnterior)}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-pub-text-secondary">
            <MapPin className="w-3 h-3" />
            <span className="text-[11px]">{local.ubicacion}</span>
          </div>
        </div>
      </div>

      {/* ===== PRODUCT DETAIL MODAL — renderizado en <body> via Portal ===== */}
      {modalOpen && mounted && createPortal(
        <>
          <div
            className="modal-backdrop fixed inset-0 z-[80] bg-black/80 backdrop-blur-md"
            onClick={() => setModalOpen(false)}
          />
          <div role="dialog" aria-modal="true" aria-label="Detalle de producto" className="modal-content fixed inset-0 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-[90] bg-white sm:rounded-2xl overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] ring-1 ring-black/5 flex flex-col md:max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Cerrar detalle"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
            >
              <X className="w-5 h-5 text-pub-text-secondary" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              {/* Image gallery */}
              <div className="relative">
                <div className="relative aspect-[4/3] sm:aspect-[3/2] bg-gray-50 overflow-hidden flex items-center justify-center">
                  {producto.imagenes[activeImg] ? (
                    <Image
                      src={producto.imagenes[activeImg]}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="text-gray-300 text-sm font-medium">Sin foto</div>
                  )}
                </div>
                {/* Image nav arrows */}
                {producto.imagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg(i => i === 0 ? producto.imagenes.length - 1 : i - 1)}
                      aria-label="Imagen anterior"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImg(i => i === producto.imagenes.length - 1 ? 0 : i + 1)}
                      aria-label="Imagen siguiente"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                {/* Thumbnails */}
                {producto.imagenes.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {producto.imagenes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        aria-label={`Ver imagen ${i + 1}`}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? "bg-white w-5" : "bg-white/60"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="p-5">
                {/* Store badge */}
                <div className="flex items-center gap-2 mb-3">
                  <Link
                    href={`/puesto/${producto.localId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    {local.logoUrl ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={local.logoUrl} alt={local.nombre} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                        style={{ backgroundColor: local.color }}
                      >
                        {local.logo}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-pub-text hover:text-blue-600 transition-colors">{local.nombre}</p>
                      <p className="text-xs text-pub-text-secondary">{local.ubicacion}</p>
                    </div>
                  </Link>
                  {isPremium && (
                    <span className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      local.plan === "oro"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      <Star className={`w-3 h-3 ${local.plan === "oro" ? "fill-amber-500" : "fill-slate-400"}`} />
                      Puesto destacado
                    </span>
                  )}
                </div>

                {/* Product name */}
                <h2 className="text-xl font-bold text-pub-text">{producto.nombre}</h2>

                {/* Prices */}
                <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl font-extrabold text-pub-primary">
                    {formatPrecio(producto.precio)}
                  </span>
                  {producto.precioAnterior && (
                    <span className="text-base text-pub-text-secondary line-through">
                      {formatPrecio(producto.precioAnterior)}
                    </span>
                  )}
                  {producto.precioAnterior && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      -{Math.round((1 - producto.precio / producto.precioAnterior) * 100)}%
                    </span>
                  )}
                </div>
                {producto.precioMayorista && (
                  <p className="mt-1 text-sm text-pub-text-secondary">
                    Precio por mayor: <span className="font-semibold text-pub-text">{formatPrecio(producto.precioMayorista)}</span>
                  </p>
                )}

                {/* WhatsApp CTA */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    const pid = getProductoIdFromPublicId(producto.id);
                    if (pid) trackingRepo.whatsappProducto(pid);
                  }}
                  className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Consultar por WhatsApp
                </a>
                <p className="mt-2 text-center text-xs text-pub-text-secondary">
                  Se abrirá un chat directo con {local.nombre}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-100 my-5" />

                {/* Product details */}
                <h3 className="text-base font-bold text-pub-text mb-3">Detalle de producto</h3>
                <div className="space-y-2.5">
                  {producto.talleDesde && producto.talleHasta && (
                    <div className="flex items-center gap-2.5 text-sm text-pub-text-secondary">
                      <Ruler className="w-4 h-4 shrink-0" />
                      <span><span className="font-medium text-pub-text">Talles</span> Del {producto.talleDesde} al {producto.talleHasta}</span>
                    </div>
                  )}
                  {producto.descripcion && (
                    <div className="flex items-start gap-2.5 text-sm text-pub-text-secondary">
                      <Tag className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{producto.descripcion}</span>
                    </div>
                  )}
                </div>

                {/* Store services */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {local.aceptaTransferencia && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs text-pub-text-secondary">
                      <CreditCard className="w-3.5 h-3.5" /> Acepta transferencia
                    </span>
                  )}
                  {local.aceptaCambios && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs text-pub-text-secondary">
                      <RefreshCw className="w-3.5 h-3.5" /> Acepta cambios
                    </span>
                  )}
                  {local.realizaEnvios && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs text-pub-text-secondary">
                      <Truck className="w-3.5 h-3.5" /> Realiza envíos
                    </span>
                  )}
                </div>

                {/* More from this seller */}
                {moreFromSeller.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 my-5" />
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-pub-text">Más de {local.nombre}</h3>
                      <Link
                        href={`/puesto/${producto.localId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Ver todo <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                      {moreFromSeller.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setActiveImg(0); /* scroll to top */ }}
                          className="shrink-0 w-24"
                        >
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                            {p.imagenes[0] ? (
                              <Image src={p.imagenes[0]} alt={p.nombre} fill sizes="96px" className="object-cover" />
                            ) : (
                              <span className="text-[10px] text-gray-300">Sin foto</span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-pub-text leading-tight line-clamp-2">{p.nombre}</p>
                          <p className="text-xs font-semibold text-pub-primary">{formatPrecio(p.precio)}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Related products */}
                {related.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 my-5" />
                    <h3 className="text-base font-bold text-pub-text mb-3">También te puede interesar</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                      {related.map(p => (
                        <div key={p.id} className="shrink-0 w-24">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                            {p.imagenes[0] ? (
                              <Image src={p.imagenes[0]} alt={p.nombre} fill sizes="96px" className="object-cover" />
                            ) : (
                              <span className="text-[10px] text-gray-300">Sin foto</span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-pub-text leading-tight line-clamp-2">{p.nombre}</p>
                          <p className="text-xs font-semibold text-pub-primary">{formatPrecio(p.precio)}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
