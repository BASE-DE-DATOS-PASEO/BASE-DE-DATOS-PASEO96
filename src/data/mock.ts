// ==========================================
// DATOS PÚBLICOS — DERIVADOS DEL STORE
// Todo se genera automáticamente desde el store (admin)
// via data-bridge. Cero datos hardcodeados.
// ==========================================

import { useStore } from "@/store/useStore";
import {
  puesteroToLocal,
  productoToPublico,
  categoriaToPublica,
  getPuesteroIdFromLocalId,
  slugify,
  esVisiblePublicamente,
  type PlanTipo,
  type CategoriaPublica,
  type LocalPublico,
  type ProductoPublico,
} from "@/lib/data-bridge";

// ── Re-export types for backward compat ──────────────────────
export type { PlanTipo, CategoriaPublica, LocalPublico, ProductoPublico };

// ── Reactive getters (read from store snapshot) ──────────────
// These read the current store state. Components that use them
// inside render will get the latest data.

function getState() {
  return useStore.getState();
}

// ── CATEGORÍAS ───────────────────────────────────────────────

function getCategorias(): CategoriaPublica[] {
  const { categorias, puesteros, productos } = getState();
  return categorias.map((c) => categoriaToPublica(c, puesteros, productos));
}

// ── LOCALES ──────────────────────────────────────────────────

function getLocales(): LocalPublico[] {
  const { puesteros } = getState();
  return puesteros
    .filter((p) => p.estadoActividad === "activo")
    .map(puesteroToLocal);
}

// ── PRODUCTOS ────────────────────────────────────────────────

function getProductos(): ProductoPublico[] {
  const { productos, categorias } = getState();
  return productos
    .filter((p) => p.visible)
    .map((p) => productoToPublico(p, categorias));
}

// Slug helper re-exportado para componentes que lo necesiten
export { slugify };

// ── FUNCIONES HELPER ─────────────────────────────────────────

export function getLocalById(id: string): LocalPublico | undefined {
  return getLocales().find((l) => l.id === id);
}

export function formatPrecio(precio: number): string {
  return `$ ${precio.toLocaleString("es-AR")}`;
}

export function getProductosByLocal(localId: string): ProductoPublico[] {
  return getProductos().filter((p) => p.localId === localId);
}

export function getRelatedProducts(
  producto: ProductoPublico,
  limit: number = 4
): ProductoPublico[] {
  const all = getProductos();

  const sameLocalAndCategory = all.filter(
    (p) =>
      p.id !== producto.id &&
      p.categoriaId === producto.categoriaId &&
      p.localId === producto.localId
  );

  const sameCategory = all.filter(
    (p) =>
      p.id !== producto.id &&
      p.categoriaId === producto.categoriaId &&
      p.localId !== producto.localId
  );

  const sameLocal = all.filter(
    (p) =>
      p.id !== producto.id &&
      p.localId === producto.localId &&
      p.categoriaId !== producto.categoriaId
  );

  const combined = [...sameLocalAndCategory, ...sameCategory, ...sameLocal];

  const seen = new Set<string>();
  const unique: ProductoPublico[] = [];
  for (const p of combined) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      unique.push(p);
    }
    if (unique.length >= limit) break;
  }

  return unique;
}

// ── Reverse lookup ───────────────────────────────────────────

export { getPuesteroIdFromLocalId };

// ── usePublicStore — Hook reactivo centralizado ───────────────
// LA PIEZA CLAVE para Supabase: todos los componentes públicos
// consumen datos a través de este hook. Cuando integremos Supabase,
// solo hay que cambiar este hook — nada más en la app.
//
// Retorna datos en formato público (CategoriaPublica, ProductoPublico,
// LocalPublico) siempre frescos desde el store de Zustand.
//
export function usePublicStore() {
  const { categorias: adminCats, puesteros, productos: adminProds } = useStore();

  // Set de puesteros visibles públicamente (activos + sin mora >5 días)
  const puesterosVisiblesIds = new Set(
    puesteros.filter(esVisiblePublicamente).map((p) => p.id)
  );

  // Categorías públicas derivadas del store admin
  const categorias: CategoriaPublica[] = adminCats.map((c) =>
    categoriaToPublica(c, puesteros, adminProds)
  );

  // Productos públicos — solo los visibles + de puesteros NO en mora
  const productos: ProductoPublico[] = adminProds
    .filter((p) => p.visible && puesterosVisiblesIds.has(p.puesteroId))
    .map((p) => productoToPublico(p, adminCats));

  // Locales públicos — solo activos + sin mora
  const locales: LocalPublico[] = puesteros
    .filter(esVisiblePublicamente)
    .map(puesteroToLocal);

  // Lookup reactivo de local por ID público ("l1", "l2", etc.)
  function getLocalById(id: string): LocalPublico | undefined {
    return locales.find((l) => l.id === id);
  }

  // Productos de un local específico
  function getProductosByLocal(localId: string): ProductoPublico[] {
    return productos.filter((p) => p.localId === localId);
  }

  // Productos relacionados a un producto (mismo local+cat > misma cat > mismo local)
  function getRelatedProducts(producto: ProductoPublico, limit = 4): ProductoPublico[] {
    const sameLocalAndCat = productos.filter(
      (p) => p.id !== producto.id && p.categoriaId === producto.categoriaId && p.localId === producto.localId
    );
    const sameCat = productos.filter(
      (p) => p.id !== producto.id && p.categoriaId === producto.categoriaId && p.localId !== producto.localId
    );
    const sameLocal = productos.filter(
      (p) => p.id !== producto.id && p.localId === producto.localId && p.categoriaId !== producto.categoriaId
    );
    const combined = [...sameLocalAndCat, ...sameCat, ...sameLocal];
    const seen = new Set<string>();
    const unique: ProductoPublico[] = [];
    for (const p of combined) {
      if (!seen.has(p.id)) { seen.add(p.id); unique.push(p); }
      if (unique.length >= limit) break;
    }
    return unique;
  }

  return { categorias, productos, locales, getLocalById, getProductosByLocal, getRelatedProducts };
}
