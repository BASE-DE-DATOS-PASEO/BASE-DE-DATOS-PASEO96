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

// Días y horario de apertura: Jueves(4), Sábado(6), Domingo(0) — 10:30 a 20:30
function calcIsOpen(): boolean {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  return [0, 4, 6].includes(day) && mins >= 630 && mins < 1230;
}

// Íconos para los chips de categoría — se asignan por nombre exacto,
// y cualquier categoría nueva que no esté acá obtiene el ícono genérico Tag.
const chipIconMap: Record<string, React.ReactNode> = {
  Mujer: <User className="w-3.5 h-3.5" />,
  Hombre: <User className="w-3.5 h-3.5" />,
  Niños: <Sparkles className="w-3.5 h-3.5" />,
  Otros: <MoreHorizontal className="w-3.5 h-3.5" />,
};

const featurePills = [
  {
    icon: <MessageCircle className="w-4 h-4" />,
    title: "Contacto directo",
    desc: "Hablá directamente con el vendedor",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: "Compras seguras",
    desc: "Consejos para una compra protegida",
  },
  {
    icon: <Users className="w-4 h-4" />,
    title: "Feria conectada",
    desc: "Productos cargados por cada puesto",
  },
  {
    icon: <HeartHandshake className="w-4 h-4" />,
    title: "Apoyá local",
    desc: "Comprá a vendedores de tu comunidad",
  },
];

export default function Hero({
  busqueda,
  onSearch,
  onCategorySelect,
  activeCategoryId,
  searchInputRef,
}: HeroProps) {
  const [isOpen, setIsOpen] = useState(calcIsOpen);
  // Categorías dinámicas desde el store — se actualizan cuando Jere crea/edita categorías
  const adminCategorias = useStore((s) => s.categorias);

  useEffect(() => {
    const id = setInterval(() => setIsOpen(calcIsOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white pt-16 sm:pt-18">
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-14">

        {/* ── Left column ── */}
        <div className="flex flex-col">
          {/* Badge dinámico */}
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <span className="relative flex w-2.5 h-2.5 shrink-0">
              {isOpen && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              )}
              <span className={`relative rounded-full w-2.5 h-2.5 ${isOpen ? "bg-green-500" : "bg-red-400"}`} />
            </span>
            <span className="text-sm font-medium text-gray-700">
              Paseo 96 — {isOpen ? "Feria abierta" : "Feria cerrada"}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-3xl font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Todo lo que buscás,
            <br />
            <span className="text-blue-600">está en Paseo 96</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-500 sm:mb-8 sm:text-lg">
            Explorá productos únicos, contactá directamente con vendedores por WhatsApp y más.
          </p>

          {/* Search bar */}
          <div className="mb-4 flex items-center rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-md sm:px-4 sm:py-3.5">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={busqueda}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="¿Qué buscás? Ej: zapatillas, camperas, carteras..."
              className="flex-1 ml-3 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent outline-none"
            />
            {busqueda && (
              <button
                onClick={() => onSearch("")}
                className="shrink-0 ml-2 text-gray-400 hover:text-gray-600 text-sm btn-press"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category chips — dinámicos: se generan desde el store */}
          <div className="-mx-4 mb-6 flex items-center gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mb-8 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <button
              onClick={() => onCategorySelect(null)}
              className={`btn-press flex shrink-0 items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !activeCategoryId && !busqueda
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
              }`}
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
                  className={`btn-press flex shrink-0 items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {chipIconMap[cat.nombre] ?? <Tag className="w-3.5 h-3.5" />}
                  {cat.nombre}
                </button>
              );
            })}
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {featurePills.map((pill) => (
              <div
                key={pill.title}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm mt-0.5">
                  {pill.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{pill.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{pill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — image ── */}
        <div className="hidden lg:block relative">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl shadow-blue-100/60">
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&h=1100&fit=crop&q=85"
              alt="Ropa en Paseo 96"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 50vw, 600px"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
