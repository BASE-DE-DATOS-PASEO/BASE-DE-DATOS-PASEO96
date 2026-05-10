"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CounterProps = {
  value: number;
  /** ms — duración total de la animación. */
  duration?: number;
  /** Se aplica como prefijo, ej "$ ". */
  prefix?: string;
  /** Se aplica como sufijo, ej " kg". */
  suffix?: string;
  /** Si true, formatea con separador de miles es-AR. */
  format?: boolean;
  className?: string;
};

/**
 * Cuenta desde 0 hasta `value` cuando entra al viewport por primera vez.
 * Usa requestAnimationFrame con curva "easeOutExpo" para que desacelere al final.
 * Respeta `prefers-reduced-motion` (muestra el valor final directamente).
 */
export default function Counter({
  value,
  duration = 1200,
  prefix = "",
  suffix = "",
  format = true,
  className = "",
}: CounterProps) {
  const [display, setDisplay] = useState(0);
  const elRef = useRef<HTMLSpanElement | null>(null);
  const hasRun = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        const start = performance.now();
        const from = 0;
        const to = value;

        // easeOutExpo
        const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        const tick = (now: number) => {
          const elapsed = now - start;
          const t = Math.min(elapsed / duration, 1);
          const eased = ease(t);
          const current = Math.round(from + (to - from) * eased);
          setDisplay(current);
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(to);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, reduced]);

  const displayValue = reduced ? value : display;
  const formatted = format ? displayValue.toLocaleString("es-AR") : String(displayValue);

  return (
    <span ref={elRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
