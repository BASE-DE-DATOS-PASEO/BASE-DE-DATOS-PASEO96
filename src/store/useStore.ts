// ==========================================
// ZUSTAND STORE — CACHE LOCAL + SUPABASE
// El store mantiene una caché en memoria y sincroniza con Supabase.
// Las mutaciones son optimistas: actualizan el estado al toque y luego
// confirman con la base de datos. Si falla, se loguea el error.
// ==========================================

import { create } from "zustand";
import {
  type Puestero,
  type Producto,
  type Categoria,
  type Egreso,
  type Solicitud,
  planConfig,
} from "@/lib/mock-data";
import {
  puesterosRepo,
  productosRepo,
  categoriasRepo,
  egresosRepo,
  solicitudesRepo,
} from "@/lib/db";

// ── State shape ──────────────────────────────────────────────
interface StoreState {
  // Data
  puesteros: Puestero[];
  productos: Producto[];
  categorias: Categoria[];
  egresos: Egreso[];
  solicitudes: Solicitud[];

  // Estado de carga
  loaded: boolean;
  loading: boolean;
  loadAll: () => Promise<void>;

  // ── Puesteros CRUD ─────────────────────────────────────────
  addPuestero: (p: Omit<Puestero, "id">) => void;
  updatePuestero: (id: number, data: Partial<Puestero>) => void;
  deletePuestero: (id: number) => void;

  // ── Productos CRUD ─────────────────────────────────────────
  addProducto: (p: Omit<Producto, "id">) => void;
  updateProducto: (id: number, data: Partial<Producto>) => void;
  deleteProducto: (id: number) => void;

  // ── Categorías CRUD ────────────────────────────────────────
  addCategoria: (c: Omit<Categoria, "id">) => void;
  updateCategoria: (id: number, data: Partial<Categoria>) => void;
  deleteCategoria: (id: number) => void;

  // ── Egresos CRUD ───────────────────────────────────────────
  addEgreso: (e: Omit<Egreso, "id">) => void;
  updateEgreso: (id: number, data: Partial<Egreso>) => void;
  deleteEgreso: (id: number) => void;

  // ── Cobros ─────────────────────────────────────────────────
  marcarPagado: (puesteroId: number) => void;

  // ── Solicitudes ────────────────────────────────────────────
  addSolicitud: (s: Omit<Solicitud, "id">) => Promise<boolean>;
  aprobarSolicitud: (id: number) => void;
  rechazarSolicitud: (id: number) => void;
}

// ── Colores disponibles para auto-asignar a nuevos puesteros ─
const COLORS_POOL = [
  "#1E40AF","#0F766E","#9333EA","#DC2626","#D97706",
  "#059669","#DB2777","#0E7490","#4338CA","#374151",
];
function pickColor(nombre: string): string {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash += nombre.charCodeAt(i);
  return COLORS_POOL[hash % COLORS_POOL.length];
}

// ── Helper para errores de DB ────────────────────────────────
function logErr(label: string, err: unknown) {
  console.error(`[store] ${label}:`, err);
}

// ── Store ────────────────────────────────────────────────────
export const useStore = create<StoreState>((set, get) => ({
  puesteros: [],
  productos: [],
  categorias: [],
  egresos: [],
  solicitudes: [],

  loaded: false,
  loading: false,

  loadAll: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const safeList = async <T>(label: string, loader: () => Promise<T[]>): Promise<T[]> => {
        try {
          return await loader();
        } catch (err) {
          logErr(label, err);
          return [];
        }
      };

      const [puesteros, productos, categorias, egresos, solicitudes] = await Promise.all([
        safeList("puesterosRepo.list", () => puesterosRepo.list()),
        safeList("productosRepo.list", () => productosRepo.list()),
        safeList("categoriasRepo.list", () => categoriasRepo.list()),
        safeList("egresosRepo.list", () => egresosRepo.list()),
        safeList("solicitudesRepo.list", () => solicitudesRepo.list()),
      ]);
      set({ puesteros, productos, categorias, egresos, solicitudes, loaded: true, loading: false });
    } catch (err) {
      logErr("loadAll", err);
      set({ loading: false });
    }
  },

  // ── Puesteros ──────────────────────────────────────────────
  addPuestero: (p) => {
    puesterosRepo
      .insert(p)
      .then((created) => set((s) => ({ puesteros: [...s.puesteros, created] })))
      .catch((err) => logErr("addPuestero", err));
  },

  updatePuestero: (id, data) => {
    set((s) => ({
      puesteros: s.puesteros.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
    puesterosRepo.update(id, data).catch((err) => logErr("updatePuestero", err));
  },

  deletePuestero: (id) => {
    set((s) => ({ puesteros: s.puesteros.filter((p) => p.id !== id) }));
    puesterosRepo.delete(id).catch((err) => logErr("deletePuestero", err));
  },

  // ── Productos ──────────────────────────────────────────────
  addProducto: (p) => {
    productosRepo
      .insert(p)
      .then((created) => set((s) => ({ productos: [...s.productos, created] })))
      .catch((err) => logErr("addProducto", err));
  },

  updateProducto: (id, data) => {
    set((s) => ({
      productos: s.productos.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
    productosRepo.update(id, data).catch((err) => logErr("updateProducto", err));
  },

  deleteProducto: (id) => {
    set((s) => ({ productos: s.productos.filter((p) => p.id !== id) }));
    productosRepo.delete(id).catch((err) => logErr("deleteProducto", err));
  },

  // ── Categorías ─────────────────────────────────────────────
  addCategoria: (c) => {
    categoriasRepo
      .insert(c)
      .then((created) => set((s) => ({ categorias: [...s.categorias, created] })))
      .catch((err) => logErr("addCategoria", err));
  },

  updateCategoria: (id, data) => {
    set((s) => ({
      categorias: s.categorias.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
    categoriasRepo.update(id, data).catch((err) => logErr("updateCategoria", err));
  },

  deleteCategoria: (id) => {
    set((s) => ({ categorias: s.categorias.filter((c) => c.id !== id) }));
    categoriasRepo.delete(id).catch((err) => logErr("deleteCategoria", err));
  },

  // ── Egresos ────────────────────────────────────────────────
  addEgreso: (e) => {
    egresosRepo
      .insert(e)
      .then((created) => set((s) => ({ egresos: [...s.egresos, created] })))
      .catch((err) => logErr("addEgreso", err));
  },

  updateEgreso: (id, data) => {
    set((s) => ({
      egresos: s.egresos.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
    egresosRepo.update(id, data).catch((err) => logErr("updateEgreso", err));
  },

  deleteEgreso: (id) => {
    set((s) => ({ egresos: s.egresos.filter((e) => e.id !== id) }));
    egresosRepo.delete(id).catch((err) => logErr("deleteEgreso", err));
  },

  // ── Cobros ─────────────────────────────────────────────────
  marcarPagado: (puesteroId) => {
    const puestero = get().puesteros.find((p) => p.id === puesteroId);
    if (!puestero) return;
    const d = new Date(puestero.fechaProximoCobro);
    d.setMonth(d.getMonth() + 1);
    const fechaProximoCobro = d.toISOString().split("T")[0];
    const patch: Partial<Puestero> = { estadoPago: "pagado", fechaProximoCobro };
    set((s) => ({
      puesteros: s.puesteros.map((p) => (p.id === puesteroId ? { ...p, ...patch } : p)),
    }));
    puesterosRepo.update(puesteroId, patch).catch((err) => logErr("marcarPagado", err));
  },

  // ── Solicitudes ────────────────────────────────────────────
  addSolicitud: async (solicitud) => {
    const gmailAcceso = solicitud.gmailAcceso.trim().toLowerCase();
    const st = get();
    const gmailYaActivo = st.puesteros.some((p) => p.gmailAcceso === gmailAcceso);
    const solicitudAbierta = st.solicitudes.some(
      (s) => s.gmailAcceso === gmailAcceso && s.estado === "pendiente"
    );
    if (gmailYaActivo || solicitudAbierta) return false;

    try {
      const created = await solicitudesRepo.insert({ ...solicitud, gmailAcceso });
      set((s) => ({ solicitudes: [...s.solicitudes, created] }));
      return true;
    } catch (err) {
      logErr("addSolicitud", err);
      return false;
    }
  },

  rechazarSolicitud: (id) => {
    set((s) => ({
      solicitudes: s.solicitudes.map((sol) =>
        sol.id === id ? { ...sol, estado: "rechazado" as const } : sol
      ),
    }));
    solicitudesRepo.update(id, { estado: "rechazado" }).catch((err) => logErr("rechazarSolicitud", err));
  },

  aprobarSolicitud: (id) => {
    const s = get();
    const sol = s.solicitudes.find((x) => x.id === id);
    if (!sol) return;
    const gmailEnUso = s.puesteros.some((p) => p.gmailAcceso === sol.gmailAcceso);
    const puestoEnUso = s.puesteros.some(
      (p) => p.fila.toLowerCase() === sol.fila.toLowerCase() && p.numeroPuesto === sol.numeroPuesto
    );
    if (gmailEnUso || puestoEnUso) return;
    // Si el método es transferencia, hace falta comprobante. Si es efectivo, se aprueba directo.
    const metodoPago = (sol as Solicitud).metodoPago ?? "transferencia";
    if (metodoPago === "transferencia" && !sol.comprobanteUrl) return;

    const hoy = new Date().toISOString().split("T")[0];
    const proximoCobro = (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().split("T")[0];
    })();

    const cfg = planConfig[sol.planElegido];
    const iniciales = sol.nombreComercial
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");

    const nuevoPuestero: Omit<Puestero, "id"> = {
      nombreResponsable: sol.nombreResponsable,
      nombreComercial: sol.nombreComercial,
      fila: sol.fila,
      numeroPuesto: sol.numeroPuesto,
      telefono: sol.telefono,
      email: sol.email,
      gmailAcceso: sol.gmailAcceso,
      aceptaTransferencia: false,
      aceptaCambios: false,
      realizaEnvios: false,
      plan: sol.planElegido,
      limiteProductos: cfg.maxPublicaciones,
      productosActivos: 0,
      estadoPago: "pagado",
      estadoActividad: "activo",
      fechaAlta: hoy,
      fechaProximoCobro: proximoCobro,
      observaciones: sol.observaciones,
      color: pickColor(sol.nombreComercial),
      logoIniciales: iniciales || sol.nombreComercial.slice(0, 2).toUpperCase(),
    };

    // Optimista local
    set((st) => ({
      solicitudes: st.solicitudes.map((s2) =>
        s2.id === id ? { ...s2, estado: "aprobado" as const } : s2
      ),
    }));

    // Persistir: insert puestero + update solicitud
    Promise.all([
      puesterosRepo.insert(nuevoPuestero),
      solicitudesRepo.update(id, { estado: "aprobado" }),
    ])
      .then(([created]) => {
        set((st) => ({ puesteros: [...st.puesteros, created] }));
      })
      .catch((err) => logErr("aprobarSolicitud", err));
  },
}));
