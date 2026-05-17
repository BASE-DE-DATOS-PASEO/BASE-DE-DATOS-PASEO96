"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { usePublicStore } from "@/data/mock";
import { useInView } from "@/hooks/useInView";

export default function FeaturedStalls() {
  const { locales, getProductosByLocal } = usePublicStore();
  const headerRef = useInView<HTMLDivElement>();
  const gridRef = useInView<HTMLDivElement>({ threshold: 0.05 });

  // Top 3 puestos premium (oro primero, después plata), con al menos 1 producto
  const featured = useMemo(() => {
    const planWeight = (plan?: string) => plan === "oro" ? 2 : plan === "plata" ? 1 : 0;
    return [...locales]
      .filter((l) => l.plan === "oro" || l.plan === "plata")
      .filter((l) => getProductosByLocal(l.id).length >= 1)
      .sort((a, b) => {
        const w = planWeight(b.plan) - planWeight(a.plan);
        if (w !== 0) return w;
        return getProductosByLocal(b.id).length - getProductosByLocal(a.id).length;
      })
      .slice(0, 3);
  }, [locales, getProductosByLocal]);

  if (featured.length === 0) return null;

  return (
    <section id="puesteros" className="relative w-full py-16 sm:py-24">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="flex items-end justify-between gap-6 mb-12 v3-reveal">
          <div>
            <span className="v3-eyebrow mb-4">Puestos destacados</span>
            <h2 className="mt-3 v3-display text-[40px] sm:text-[56px] lg:text-[68px]">
              Los favoritos<br />
              <span className="text-[#3B82F6]">de la feria.</span>
            </h2>
          </div>
          <Link href="/categorias" className="v3-btn-link hidden sm:inline-flex mb-4">
            Ver todos los puestos
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 puesteros */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 v3-reveal-stagger">
          {featured.map((local, idx) => {
            const productos = getProductosByLocal(local.id).slice(0, 3);
            return (
              <Link
                key={local.id}
                href={`/puesto/${local.id}`}
                className="group block"
              >
                {/* Big product image (the first product) */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F2F2EE] mb-5">
                  {productos[0]?.imagenes[0] && (
                    <Image
                      src={productos[0].imagenes[0]}
                      alt={local.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}

                  {/* Index number */}
                  <div className="absolute top-5 left-5 text-white text-[11px] font-bold uppercase tracking-[0.18em] drop-shadow-md">
                    {String(idx + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
                  </div>

                  {/* Premium badge */}
                  <div className="absolute top-5 right-5">
                    <span className={`v3-premium-badge !backdrop-blur-sm ${
                      local.plan === "oro"
                        ? "!bg-amber-50/95 !text-amber-900"
                        : "!bg-white/95 !text-slate-700"
                    }`}>
                      Plan {local.plan === "oro" ? "Oro" : "Plata"}
                    </span>
                  </div>

                  {/* Stall info overlay bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-white text-xl font-bold leading-tight truncate">
                          {local.nombre}
                        </h3>
                        <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {local.ubicacion}
                        </p>
                      </div>
                      <div className="shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowUpRight className="w-4 h-4 text-[#0A0A0A]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini product strip (next 2 products) */}
                <div className="grid grid-cols-2 gap-2">
                  {productos.slice(1, 3).map((p) => (
                    <div
                      key={p.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-[#F2F2EE]"
                    >
                      {p.imagenes[0] && (
                        <Image
                          src={p.imagenes[0]}
                          alt={p.nombre}
                          fill
                          sizes="(max-width: 768px) 50vw, 17vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                    </div>
                  ))}
                  {productos.length < 3 && (
                    <div className="aspect-square rounded-lg bg-[#F2F2EE] flex items-center justify-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
                        + más
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
