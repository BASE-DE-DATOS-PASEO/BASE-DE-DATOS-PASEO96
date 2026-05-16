import { useStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";
import { planConfig, type Puestero } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

export function useCurrentPuestero(): Puestero | null {
  const { email } = useAuth();
  return useStore(
    (s) =>
      s.puesteros.find(
        (p) => p.gmailAcceso === email && p.estadoActividad === "activo"
      ) ?? null
  );
}

export function useCurrentPuesteroProductos() {
  const { email } = useAuth();
  return useStore(
    useShallow((s) => {
      const current = s.puesteros.find(
        (p) => p.gmailAcceso === email && p.estadoActividad === "activo"
      );
      if (!current) return [];
      return s.productos.filter((p) => p.puesteroId === current.id);
    })
  );
}

export function useCurrentPlan() {
  const puestero = useCurrentPuestero();
  return planConfig[puestero?.plan ?? "bronce"];
}
