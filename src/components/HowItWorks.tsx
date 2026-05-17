"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MessageCircle, Store } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Explorá la feria",
    desc: "Navegá por categorías, puestos destacados o buscá lo que necesitás. Todos los productos cargados por los propios vendedores.",
  },
  {
    num: "02",
    icon: MessageCircle,
    title: "Hablás por WhatsApp",
    desc: "Cada producto te conecta directo al puesto. Sin intermediarios, sin comisiones ocultas. Coordinás con el vendedor.",
  },
  {
    num: "03",
    icon: Store,
    title: "Pasás por el puesto",
    desc: "Te acercás al Paseo, retirás tu compra y la pagás como prefieras. La feria de siempre, ahora también desde tu casa.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.min(1, Math.max(0, scrolled / total));
      setProgress(p);

      const stepIdx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
      setActiveStep(stepIdx);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] text-white"
      style={{ height: "300vh" }}
    >
      {/* Sticky container — locks to viewport while content changes */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">

        {/* Animated background blobs that follow active step */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-[60vw] aspect-square rounded-full blur-[140px] transition-all duration-[1200ms] ease-out"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)",
              top: activeStep === 0 ? "-15%" : activeStep === 1 ? "20%" : "55%",
              left: activeStep === 0 ? "-15%" : activeStep === 1 ? "45%" : "5%",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute w-[45vw] aspect-square rounded-full blur-[120px] transition-all duration-[1200ms] ease-out"
            style={{
              background: "radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 70%)",
              top: activeStep === 0 ? "55%" : activeStep === 1 ? "5%" : "-10%",
              right: activeStep === 0 ? "-5%" : activeStep === 1 ? "35%" : "55%",
              opacity: 0.6,
            }}
          />
        </div>

        {/* Top progress line — fills as you scroll through the whole section */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/8 z-20">
          <div
            className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 z-10 w-full">

          {/* Header — always visible */}
          <div className="mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
              <span className="w-6 h-px bg-[#60A5FA]" />
              Cómo funciona
            </span>
            <h2 className="mt-4 text-[36px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-[-0.045em] leading-[0.95]">
              Tres pasos.{" "}
              <span className="italic font-light text-[#60A5FA]">Sin vueltas.</span>
            </h2>
          </div>

          {/* Active step content — single render, fresh animation on change */}
          <div
            key={current.num}
            className="grid grid-cols-12 gap-6 lg:gap-12 items-center"
            style={{ animation: "v3-step-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both" }}
          >
            {/* Left: Giant number only */}
            <div className="col-span-12 md:col-span-5 lg:col-span-5">
              <span className="text-[28vw] sm:text-[180px] lg:text-[240px] font-extrabold tracking-[-0.05em] leading-[0.82] text-[#3B82F6] block">
                {current.num}
              </span>
            </div>

            {/* Right: Icon + Title + Description */}
            <div className="col-span-12 md:col-span-7 lg:col-span-7 flex flex-col gap-5 sm:gap-6">
              {/* Icon on top — small, clean */}
              <div className="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#3B82F6] items-center justify-center shadow-[0_16px_40px_-8px_rgba(59,130,246,0.6)]">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.7} />
              </div>

              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05]">
                {current.title}
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-white/70 max-w-xl">
                {current.desc}
              </p>
            </div>
          </div>

          {/* Bottom: clean progress bars (no count number to avoid clutter) */}
          <div className="absolute bottom-10 sm:bottom-14 left-5 sm:left-8 lg:left-12 right-5 sm:right-8 lg:right-12">
            <div className="flex items-center gap-3">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === activeStep
                      ? "w-16 bg-[#3B82F6]"
                      : i < activeStep
                      ? "w-10 bg-white/30"
                      : "w-10 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Keyframes for step swap animation */}
      <style jsx>{`
        @keyframes v3-step-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
