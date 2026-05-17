import { Search, MessageCircle, Store } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <Search className="w-5 h-5" strokeWidth={1.5} />,
    title: "Explorá la feria",
    desc: "Navegá por categorías, puestos destacados o buscá lo que necesitás. Todos los productos cargados por los propios vendedores.",
  },
  {
    num: "02",
    icon: <MessageCircle className="w-5 h-5" strokeWidth={1.5} />,
    title: "Hablás por WhatsApp",
    desc: "Cada producto te conecta directo al puesto. Sin intermediarios, sin comisiones ocultas. Coordinás lo que necesites con el vendedor.",
  },
  {
    num: "03",
    icon: <Store className="w-5 h-5" strokeWidth={1.5} />,
    title: "Pasás por el puesto",
    desc: "Te acercás al Paseo, retirás tu compra y la pagás como prefieras. La feria de siempre, ahora también desde tu casa.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative w-full py-20 sm:py-28 v3-border-b">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="grid grid-cols-12 gap-6 lg:gap-12 mb-16 sm:mb-20">
          <div className="col-span-12 lg:col-span-5">
            <span className="v3-eyebrow mb-4">Cómo funciona</span>
            <h2 className="mt-3 v3-display text-[40px] sm:text-[56px] lg:text-[64px]">
              Tres pasos.<br />
              <span className="v3-display-italic text-[#737373]">Sin vueltas.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-[15px] sm:text-base leading-relaxed text-[#525252] max-w-md">
              Paseo 96 es la vidriera digital de los puestos del Paseo del Sur en
              La Plata. No vendemos nada nosotros: solo conectamos a quienes buscan
              con los vendedores reales de la feria.
            </p>
          </div>
        </div>

        {/* 3 steps in row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#0A0A0A]/06 v3-border-t">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#FAFAF7] p-8 sm:p-10 lg:p-12 flex flex-col gap-6 group transition-colors duration-300 hover:bg-white"
            >
              {/* Top row — icon + number */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full border border-[#0A0A0A]/12 flex items-center justify-center text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white group-hover:border-[#0A0A0A] transition-all duration-300">
                  {step.icon}
                </div>
                <span className="v3-section-num">{step.num}</span>
              </div>

              {/* Title + description */}
              <div className="mt-4 flex-1 flex flex-col gap-3">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A] leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#525252]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
