// ==========================================
// HOOK: PUESTERO ACTUAL (simulación de sesión)
// ==========================================
// Hoy simula el "usuario logueado" devolviendo el primer puestero activo.
// Cuando conectemos Supabase Auth, este archivo se reemplaza por
// una consulta real al usuario autenticado. El resto de la app
// no cambia: sigue usando useCurrentPuestero() y punto.
// ==========================================

import { useStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";
import { planConfig, type Puestero } from "@/lib/mock-data";
import { useSessionEmail } from "@/lib/pre-supabase-session";

export function useCurrentPuestero(): Puestero | null {
  const sessionEmail = useSessionEmail();
  return useStore(
    (s) =>
      s.puesteros.find(
        (p) => p.gmailAcceso === sessionEmail && p.estadoActividad === "activo"
      ) ?? null
  );
}

export function useCurrentPuesteroProductos() {
  const sessionEmail = useSessionEmail();
  return useStore(
    useShallow((s) => {
      const current = s.puesteros.find(
        (p) => p.gmailAcceso === sessionEmail && p.estadoActividad === "activo"
      );
      if (!current) return [];
      return s.productos.filter((p) => p.puesteroId === current.id);
    })
  );
}

// Devuelve la config del plan del puestero actual (límites, features, etc)
export function useCurrentPlan() {
  const puestero = useCurrentPuestero();
  return planConfig[puestero?.plan ?? "bronce"];
}
