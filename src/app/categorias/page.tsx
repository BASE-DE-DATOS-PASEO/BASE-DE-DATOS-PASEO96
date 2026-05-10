"use client";

import Link from "next/link";
import Image from "next/image";
import { usePublicStore } from "@/data/mock";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CategoriasPage() {
  const { categorias } = usePublicStore();
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="public-layout min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="reveal mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-pub-primary mb-2">
            Categorías
          </h1>
          <p className="text-pub-text-secondary text-sm sm:text-base">
            Explorá todos los rubros de Paseo 96
          </p>
        </div>

        <div ref={gridRef} className="reveal-stagger reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100"
            >
              {cat.imagen ? (
                <Image
                  src={cat.imagen}
                  alt={cat.nombre}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-white font-semibold text-base sm:text-lg leading-tight">
                  {cat.nombre}
                </h2>
                <p className="text-white/60 text-xs mt-1">
                  {cat.cantidadLocales} locales
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
