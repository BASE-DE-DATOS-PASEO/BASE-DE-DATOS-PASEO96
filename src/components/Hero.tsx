"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  LayoutGrid,
  User,
  Sparkles,
  MoreHorizontal,
  MessageCircle,
  Shield,
  Users,
  HeartHandshake,
  Tag,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { slugify } from "@/data/mock";

interface HeroProps {
  busqueda: string;
  onSearch: (query: string) => void;
  onCategorySelect: (catId: string | null) => void;
  activeCategoryId?: string | null;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

function calcIsOpen(): boolean {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  return [0, 4, 6].includes(day) && mins >= 630 && mins < 1230;
}

const chipIconMap: Record<string, React.ReactNode> = {
  Mujer: <User className="w-3.5 h-3.5" />,
  Hombre: <User className="w-3.5 h-3.5" />,
  Niños: <Sparkles className="w-3.5 h-3.5" />,
  Otros: <MoreHorizontal className="w-3.5 h-3.5" />,
};

const featurePills = [
  { icon: <MessageCircle className="w-4 h-4" />, title: "Contacto directo", desc: "Hablá directo con el vendedor" },
  { icon: <Shield className="w-4 h-4" />, title: "Compras seguras", desc: "Consejos para tu protección" },
  { icon: <Users className="w-4 h-4" />, title: "Feria conectada", desc: "Productos por cada puesto" },
  { icon: <HeartHandshake className="w-4 h-4" />, title: "Apoyá local", desc: "Vendedores de tu comunidad" },
];

export default function Hero({
  busqueda,
  onSearch,
  onCategorySelect,
  activeCategoryId,
  searchInputRef,
}: HeroProps) {
  const [isOpen, setIsOpen] = useState(calcIsOpen);
  const adminCategorias = useStore((s) => s.categorias);

  useEffect(() => {
    const id = setInterval(() => setIsOpen(calcIsOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden pt-28 sm:pt-32 pb-12 sm:pb-16">
      {/* Animated mesh background */}
      <div className="v2-mesh-hero" />

      {/* Floating decorative orbs (extra depth) */}
      <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 z-10">

        {/* ── Left column ── */}
        <div className="flex flex-col">
          {/* Live status badge */}
          <div className="v2-badge self-start mb-6">
            <span className="relative flex w-2.5 h-2.5 shrink-0">
              {isOpen && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              )}
              <span className={`relative rounded-full w-2.5 h-2.5 ${isOpen ? "bg-green-500" : "bg-rose-400"}`} />
            </span>
            <span>Paseo 96 — {isOpen ? "Feria abierta ahora" : "Feria cerrada"}</span>
          </div>

          {/* Title */}
          <h1 className="mb-5 text-[2.5rem] sm:text-6xl lg:text-[4.5rem] v2-display">
            Todo lo que buscás,
            <br />
            <span className="v2-display-accent">está en Paseo 96</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
            Explorá productos únicos, contactá directo a los vendedores por WhatsApp
            y descubrí lo mejor de la feria, sin salir de casa.
          </p>

          {/* Search bar — frosted glass capsule */}
          <div className="v2-search mb-6 flex items-center px-5 py-3.5 sm:py-4">
            <Search className="w-5 h-5 text-blue-500 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={busqueda}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="¿Qué buscás? Ej: zapatillas, camperas, carteras…"
              aria-label="Buscar productos"
              className="flex-1 ml-3 text-[15px] text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
            />
            {busqueda && (
              <button
                onClick={() => onSearch("")}
                className="shrink-0 ml-2 w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300/80 text-slate-500 hover:text-slate-700 text-xs flex items-center justify-center transition-colors"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="-mx-4 mb-8 flex items-center gap-2 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <button
              onClick={() => onCategorySelect(null)}
              className={`v2-chip ${!activeCategoryId && !busqueda ? "v2-chip-active" : ""}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Todos
            </button>
            {adminCategorias.map((cat) => {
              const catSlug = slugify(cat.nombre);
              const isActive = activeCategoryId === catSlug;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategorySelect(catSlug)}
                  className={`v2-chip ${isActive ? "v2-chip-active" : ""}`}
                >
                  {chipIconMap[cat.nombre] ?? <Tag className="w-3.5 h-3.5" />}
                  {cat.nombre}
                </button>
              );
            })}
          </div>

          {/* Feature pills (glass) */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {featurePills.map((pill) => (
              <div
                key={pill.title}
                className="v2-glass-soft flex items-start gap-3 p-3.5 rounded-2xl"
              >
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 mt-0.5">
                  {pill.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{pill.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{pill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — Floating image with glass frame ── */}
        <div className="hidden lg:block relative">
          {/* Background glow */}
          <div className="absolute -inset-8 bg-gradient-to-br from-blue-400/30 via-sky-300/20 to-blue-500/30 blur-3xl rounded-full" />

          {/* Main image card */}
          <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-blue-500/30 border border-white/40">
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&h=1100&fit=crop&q=85"
              alt="Ropa en Paseo 96"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 50vw, 600px"
            />
            {/* Glass overlay highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 pointer-events-none" />
            {/* Inner border */}
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/30 pointer-events-none" />
          </div>

          {/* Floating glass stat card */}
          <div className="absolute -bottom-6 -left-6 v2-glass-strong rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Productos únicos</p>
              <p className="text-lg font-bold text-slate-900 leading-tight">Cargados a diario</p>
            </div>
          </div>

          {/* Floating glass badge top-right */}
          <div className="absolute -top-4 -right-4 v2-glass-strong rounded-2xl px-4 py-3 flex items-center gap-2">
            <div className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative rounded-full w-2.5 h-2.5 bg-green-500" />
            </div>
            <span className="text-xs font-semibold text-slate-700">En vivo</span>
          </div>
        </div>

      </div>
    </section>
  );
}
