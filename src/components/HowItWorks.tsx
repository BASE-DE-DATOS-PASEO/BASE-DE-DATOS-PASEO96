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
  const [progress, setProgress] = useState(0); // 0 to 1 within the section

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

      // Each step takes 1/3 of the scrollable area
      const stepIdx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
      setActiveStep(stepIdx);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Top progress line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/8">
          <div
            className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 z-10 w-full">

          {/* Header — always visible */}
          <div className="grid grid-cols-12 gap-6 lg:gap-12 mb-12 sm:mb-16">
            <div className="col-span-12 lg:col-span-7">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
                <span className="w-6 h-px bg-[#60A5FA]" />
                Cómo funciona
              </span>
              <h2 className="mt-4 text-[36px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-[-0.045em] leading-[0.95]">
                Tres pasos.<br />
                <span className="italic font-light text-[#60A5FA]">Sin vueltas.</span>
              </h2>
            </div>
          </div>

          {/* Steps stack — only one visible at a time */}
          <div className="relative min-h-[40vh]">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.num}
                  className="absolute inset-0 grid grid-cols-12 gap-6 lg:gap-12 transition-all duration-700 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : (idx < activeStep ? "translateY(-40px)" : "translateY(40px)"),
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  {/* Left: big number + icon (visible logo) */}
                  <div className="col-span-12 md:col-span-5 lg:col-span-5 flex items-start gap-6 md:flex-col md:gap-6">
                    {/* Big number — solid color, no gradient */}
                    <span className="text-[20vw] sm:text-[140px] lg:text-[180px] font-extrabold tracking-[-0.05em] leading-[0.85] text-[#3B82F6] block">
                      {step.num}
                    </span>

                    {/* Icon box — big and visible */}
                    <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#3B82F6] flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(59,130,246,0.7)] mt-2 md:mt-0">
                      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.6} />
                    </div>
                  </div>

                  {/* Right: text */}
                  <div className="col-span-12 md:col-span-7 lg:col-span-7 flex flex-col justify-center">
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-5 sm:mb-6">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-white/70 max-w-xl">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom: step dots */}
          <div className="mt-auto absolute bottom-12 sm:bottom-16 left-5 sm:left-8 lg:left-12 right-5 sm:right-8 lg:right-12">
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
              <span className="ml-3 text-xs font-semibold tabular-nums text-white/40">
                {String(activeStep + 1).padStart(2, "0")} <span className="text-white/20">/ {String(steps.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
