"use client";

import Link from "next/link";
import { Check, X, MessageCircle, ArrowUpRight, Sparkles } from "lucide-react";
import { datosTransferencia } from "@/lib/mock-data";

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  variant: "bronce" | "plata" | "oro";
  eyebrow: string;
  highlight?: boolean;
  features: Feature[];
}

const plans: Plan[] = [
  {
    name: "Bronce",
    price: "$44.990",
    variant: "bronce",
    eyebrow: "Para empezar",
    features: [
      { text: "WhatsApp Empresa", included: true },
      { text: "4 publicaciones · 20 fotos totales", included: true },
      { text: "5 fotos por publicación", included: true },
      { text: "Logo de local", included: true },
      { text: "Estadísticas avanzadas", included: true },
      { text: "Videos", included: false },
      { text: "Publicación destacada", included: false },
      { text: "Publicidad + Video", included: false },
    ],
  },
  {
    name: "Plata",
    price: "$74.990",
    variant: "plata",
    eyebrow: "El más elegido",
    highlight: true,
    features: [
      { text: "WhatsApp Empresa", included: true },
      { text: "10 publicaciones · 50 fotos totales", included: true },
      { text: "5 fotos por publicación", included: true },
      { text: "Logo de local", included: true },
      { text: "Estadísticas avanzadas", included: true },
      { text: "Publicación destacada", included: true },
      { text: "Publicidad + Video en redes", included: true },
      { text: "Videos en productos", included: false },
    ],
  },
  {
    name: "Oro",
    price: "$104.990",
    variant: "oro",
    eyebrow: "Sin límites",
    features: [
      { text: "WhatsApp Empresa", included: true },
      { text: "20 publicaciones · 100 fotos totales", included: true },
      { text: "5 fotos por publicación + 5 videos", included: true },
      { text: "Logo de local", included: true },
      { text: "Estadísticas avanzadas", included: true },
      { text: "Publicación destacada", included: true },
      { text: "Publicidad + Video en redes", included: true },
      { text: "IA en imágenes (mejora automática)", included: true },
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const isHighlight = plan.highlight;
  const isOro = plan.variant === "oro";

  return (
    <div className={`relative flex flex-col rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${
      isHighlight
        ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-[0_24px_60px_-16px_rgba(10,10,10,0.35)] md:-translate-y-3 md:scale-[1.02] z-10"
        : "bg-white border-[#0A0A0A]/08 hover:border-[#0A0A0A]/20 hover:shadow-[0_16px_40px_-12px_rgba(10,10,10,0.12)] hover:-translate-y-1"
    }`}>

      {/* Top badge for highlighted */}
      {isHighlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold uppercase tracking-[0.15em] shadow-[0_8px_20px_-4px_rgba(59,130,246,0.5)]">
          <Sparkles size={10} className="fill-white" />
          {plan.eyebrow}
        </span>
      )}

      {/* Top oro accent */}
      {isOro && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[10px] font-bold uppercase tracking-[0.15em] shadow-[0_8px_20px_-4px_rgba(245,158,11,0.4)]">
          <Sparkles size={10} className="fill-amber-950" />
          {plan.eyebrow}
        </span>
      )}

      {/* Eyebrow for bronce */}
      {!isHighlight && !isOro && (
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${isHighlight ? "text-white/60" : "text-[#737373]"}`}>
          {plan.eyebrow}
        </span>
      )}

      {/* Plan name */}
      <h3 className={`mt-2 text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-none ${
        isHighlight ? "text-white" : "text-[#0A0A0A]"
      }`}>
        {plan.name}
      </h3>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-1">
        <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
          isHighlight ? "text-white" : "text-[#0A0A0A]"
        }`}>
          {plan.price}
        </span>
        <span className={`text-sm ${isHighlight ? "text-white/60" : "text-[#737373]"}`}>
          /mes
        </span>
      </div>

      {/* Divider */}
      <div className={`my-7 h-px ${isHighlight ? "bg-white/15" : "bg-[#0A0A0A]/08"}`} />

      {/* Features */}
      <ul className="flex flex-col gap-3.5 mb-10">
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-3">
            {feature.included ? (
              <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isHighlight
                  ? "bg-[#3B82F6]"
                  : isOro
                  ? "bg-amber-500"
                  : "bg-[#0A0A0A]"
              }`}>
                <Check size={11} className="text-white" strokeWidth={3} />
              </span>
            ) : (
              <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isHighlight ? "bg-white/10" : "bg-[#0A0A0A]/06"
              }`}>
                <X size={11} className={isHighlight ? "text-white/30" : "text-[#A3A3A3]"} strokeWidth={3} />
              </span>
            )}
            <span className={`text-sm leading-snug ${
              feature.included
                ? (isHighlight ? "text-white/90" : "text-[#0A0A0A]")
                : (isHighlight ? "text-white/40 line-through" : "text-[#A3A3A3] line-through")
            }`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={`/suscripcion/${plan.variant}`}
        className={`mt-auto group inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full font-bold text-sm transition-all duration-200 ${
          isHighlight
            ? "bg-white text-[#0A0A0A] hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(255,255,255,0.3)]"
            : isOro
            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:from-amber-500 hover:to-amber-600 hover:-translate-y-0.5 shadow-[0_8px_20px_-4px_rgba(245,158,11,0.4)]"
            : "bg-[#0A0A0A] text-white hover:bg-[#1F1F1F] hover:-translate-y-0.5"
        }`}
      >
        Elegir {plan.name}
        <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </Link>
    </div>
  );
}

export default function PlanesPage() {
  const whatsappMessage = encodeURIComponent(
    "Hola! Quiero más información sobre los planes de Paseo 96."
  );
  const whatsappUrl = `https://wa.me/${datosTransferencia.whatsappAdmin}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen v3-bg">
      {/* Top minimal nav */}
      <header className="sticky top-0 z-50 bg-[#FAFAF7]/85 backdrop-blur-md border-b border-[#0A0A0A]/06">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-12 h-16">
          <Link href="/" className="text-[15px] font-extrabold tracking-[-0.02em] text-[#0A0A0A]">
            PASEO <span className="text-[#3B82F6]">96</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#737373] hover:text-[#0A0A0A] transition-colors"
            >
              Volver a la feria
              <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#0A0A0A] rounded-full hover:bg-[#1F1F1F] transition-all"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — editorial */}
      <section className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-12 sm:pb-16">
        {/* Decorative orbs */}
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
        <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
            <span className="w-5 h-px bg-[#3B82F6]" />
            Planes
          </span>
          <h1 className="mt-4 text-[10vw] sm:text-[64px] lg:text-[80px] font-extrabold tracking-[-0.045em] leading-[0.95] text-[#0A0A0A]">
            Elegí cómo querés{" "}
            <span className="text-[#3B82F6]">vender</span> en Paseo 96.
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#525252] max-w-xl">
            Tres planes, todos con WhatsApp directo y estadísticas reales.
            Pagás una vez por mes, sin comisiones por venta.
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="relative max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch pt-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <p className="text-center text-xs text-[#737373] mt-10">
          Sin contratos largos · Cambiás de plan cuando quieras · Cobrás siempre vos
        </p>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#0A0A0A]/06 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
                <span className="w-5 h-px bg-[#3B82F6]" />
                Hablemos
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] leading-[1.05] text-[#0A0A0A]">
                ¿Tenés dudas?<br />
                <span className="italic font-light text-[#737373]">Te ayudamos.</span>
              </h2>
              <p className="mt-5 text-base text-[#525252] leading-relaxed max-w-md">
                Escribinos por WhatsApp y te explicamos qué plan te conviene
                según tu puesto, tu rubro y cuántos productos manejás.
              </p>
            </div>
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-emerald-600 text-white font-bold text-sm transition-all hover:bg-emerald-700 hover:-translate-y-0.5 shadow-[0_12px_30px_-8px_rgba(16,185,129,0.4)]"
              >
                <MessageCircle size={18} />
                Contactanos por WhatsApp
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
