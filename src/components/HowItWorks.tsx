"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MessageCircle, Store, ArrowDown } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <Search className="w-6 h-6" strokeWidth={1.6} />,
    title: "Explorá la feria",
    desc: "Navegá por categorías, puestos destacados o buscá lo que necesitás. Todos los productos cargados por los propios vendedores.",
  },
  {
    num: "02",
    icon: <MessageCircle className="w-6 h-6" strokeWidth={1.6} />,
    title: "Hablás por WhatsApp",
    desc: "Cada producto te conecta directo al puesto. Sin intermediarios, sin comisiones ocultas. Coordinás con el vendedor.",
  },
  {
    num: "03",
    icon: <Store className="w-6 h-6" strokeWidth={1.6} />,
    title: "Pasás por el puesto",
    desc: "Te acercás al Paseo, retirás tu compra y la pagás como prefieras. La feria de siempre, ahora también desde tu casa.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Watch each step entering viewport, set the active one
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(idx);
            el.classList.add("in-view");
          }
        },
        { threshold: 0.45, rootMargin: "0px 0px -20% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0A0A0A] text-white py-24 sm:py-32"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div
          className="absolute w-[55vw] aspect-square rounded-full blur-[120px] transition-all duration-[1500ms] ease-out"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
            top: activeStep === 0 ? "-10%" : activeStep === 1 ? "30%" : "60%",
            left: activeStep === 0 ? "-10%" : activeStep === 1 ? "50%" : "10%",
          }}
        />
        <div
          className="absolute w-[40vw] aspect-square rounded-full blur-[100px] transition-all duration-[1500ms] ease-out"
          style={{
            background: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)",
            top: activeStep === 0 ? "60%" : activeStep === 1 ? "10%" : "-10%",
            right: activeStep === 0 ? "-5%" : activeStep === 1 ? "40%" : "60%",
          }}
        />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 z-10">

        {/* Header */}
        <div className="grid grid-cols-12 gap-6 lg:gap-12 mb-20">
          <div className="col-span-12 lg:col-span-6">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
              <span className="w-6 h-px bg-[#60A5FA]" />
              Cómo funciona
            </span>
            <h2 className="mt-4 text-[44px] sm:text-[64px] lg:text-[80px] font-extrabold tracking-[-0.045em] leading-[0.95]">
              Tres pasos.<br />
              <span className="italic font-light text-[#60A5FA]">Sin vueltas.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex flex-col justify-end gap-5">
            <p className="text-[15px] sm:text-base leading-relaxed text-white/70 max-w-md">
              Paseo 96 es la vidriera digital de los puestos del Paseo del Sur en
              La Plata. No vendemos nada nosotros: solo conectamos a quienes buscan
              con los vendedores reales de la feria.
            </p>
            <div className="flex items-center gap-2 text-white/40">
              <ArrowDown className="w-4 h-4 animate-bounce" />
              <span className="text-xs font-medium">Seguí scrolleando</span>
            </div>
          </div>
        </div>

        {/* Sticky 3 steps reveal — each takes full viewport on scroll */}
        <div className="relative">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={step.num}
                ref={(el) => { stepRefs.current[idx] = el; }}
                className="v3-step-card relative min-h-[80vh] flex items-center"
              >
                <div className="grid grid-cols-12 gap-6 lg:gap-16 w-full">

                  {/* Left: Number + Icon */}
                  <div className="col-span-12 md:col-span-5 lg:col-span-4 flex items-start gap-6 md:flex-col md:gap-8">
                    <span
                      className="v3-step-num text-[18vw] sm:text-[160px] lg:text-[200px] font-extrabold tracking-[-0.05em] leading-[0.85] block"
                      style={{
                        background: isActive
                          ? "linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)"
                          : "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {step.num}
                    </span>

                    <div className="v3-step-icon shrink-0 mt-2 md:mt-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? "bg-[#3B82F6] text-white shadow-2xl shadow-blue-500/50"
                          : "bg-white/8 text-white/50 border border-white/15"
                      }`}>
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {/* Right: Text */}
                  <div className="v3-step-content col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6 flex flex-col justify-center">
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-6">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-white/70 max-w-xl">
                      {step.desc}
                    </p>

                    {/* Progress indicator at bottom */}
                    <div className="mt-10 flex items-center gap-3">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          className={`h-[2px] rounded-full transition-all duration-500 ${
                            i === idx
                              ? "w-12 bg-[#3B82F6]"
                              : i < idx
                              ? "w-8 bg-white/30"
                              : "w-8 bg-white/10"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs font-semibold tabular-nums text-white/40">
                        {String(idx + 1).padStart(2, "0")} <span className="text-white/20">/ {String(steps.length).padStart(2, "0")}</span>
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
