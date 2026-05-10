"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * Carga inicial de la base de datos al iniciar la app.
 * Se monta una sola vez en el root layout y dispara loadAll().
 */
export default function StoreInit() {
  const loadAll = useStore((s) => s.loadAll);
  const loaded = useStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) loadAll();
  }, [loaded, loadAll]);

  return null;
}
