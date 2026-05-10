"use client";

import { useEffect, useRef } from "react";

/**
 * Observa el elemento y le agrega la clase `revealed` cuando entra al viewport.
 * - Respeta `prefers-reduced-motion` (aparece al instante).
 * - Trigger un poco antes de que entre (rootMargin negativo).
 * - Una sola vez — se desconecta después de revelar.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respetar preferencia de usuario: sin animación.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      {
        threshold,
        // Trigger un poco antes de que entre completamente.
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
