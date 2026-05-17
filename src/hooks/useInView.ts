"use client";

import { useEffect, useRef } from "react";

/**
 * Toggles "in-view" class on the element when it enters the viewport.
 * Used by v3 scroll-reveal animations.
 *
 * - Respects prefers-reduced-motion (adds class immediately).
 * - One-shot by default: stops observing after entering.
 */
export function useInView<T extends HTMLElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const { threshold = 0.15, rootMargin = "0px 0px -8% 0px", once = true } = opts ?? {};
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      el.classList.add("in-view");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove("in-view");
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
