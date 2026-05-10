"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve `true` si el usuario tiene activada la preferencia de
 * "reducir movimiento" en su sistema operativo. Usar para evitar
 * animaciones en componentes que no se pueden cubrir solo con CSS
 * (ej: parallax, number tickers).
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
