"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    question: "¿Cómo compro un producto?",
    answer:
      "La compra no se realiza dentro del sitio. Cuando encontrás un producto que te interesa, tocás el botón de WhatsApp y te comunicás directamente con el vendedor. El precio, la disponibilidad, los envíos y la forma de pago se coordinan entre vos y el puesto.",
  },
  {
    question: "¿Los precios están actualizados?",
    answer:
      "Los precios son actualizados por el equipo de Paseo 96 en base a la información que envía cada puesto. Te recomendamos confirmar precio y stock directamente con el vendedor al momento de consultar.",
  },
  {
    question: "¿Hacen envíos?",
    answer:
      "Depende de cada puesto. Algunos vendedores realizan envíos y otros solo venden de forma presencial. Esa información aparece en la ficha de cada producto. Consultá con el vendedor para coordinar.",
  },
  {
    question: "¿Puedo pagar con transferencia?",
    answer:
      "Algunos puestos aceptan transferencia bancaria y otros trabajan solo con efectivo. Esta información se indica en cada ficha de producto. Confirmá el método de pago directamente con el vendedor.",
  },
  {
    question: "¿Qué es Paseo 96?",
    answer:
      "Paseo 96 es una plataforma digital que funciona como vidriera virtual de la feria. Los distintos puestos exhiben sus productos en una misma página web para que puedas descubrir lo que ofrecen, ver precios y contactar al vendedor directamente.",
  },
  {
    question: "¿Cómo puedo tener mi puesto en Paseo 96?",
    answer:
      "Si tenés un puesto en la feria y querés aparecer en la plataforma, escribinos por WhatsApp o Instagram. Tenemos tres planes: Bronce ($44.990/mes), Plata ($74.990/mes) y Oro ($104.990/mes). Te explicamos los beneficios de cada uno y nos encargamos de cargar tus productos.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const listRef = useScrollReveal<HTMLDivElement>();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 sm:py-20 bg-[var(--color-pub-bg)]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-pub-text)] tracking-tight mb-3">
            Preguntas frecuentes
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-pub-text-secondary)]">
            Resolvé tus dudas sobre Paseo 96
          </p>
        </div>

        {/* Accordion */}
        <div ref={listRef} className="reveal-stagger reveal space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-[var(--color-pub-border)] bg-white overflow-hidden transition-shadow duration-200 hover:shadow-sm"
              >
                <button
                  id={`faq-question-${index}`}
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-sm sm:text-[15px] font-semibold text-[var(--color-pub-text)]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-pub-text-secondary)] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="grid transition-all duration-300 ease-in-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-sm text-[var(--color-pub-text-secondary)] leading-relaxed">
                      {faq.answer}
                    </p>
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
