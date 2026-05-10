// ==========================================
// PUENTE DE DATOS: Admin → Público
// Convierte los datos del store (formato admin) a formato público.
// Cuando se conecte Supabase, este archivo se adapta y todo sigue funcionando.
// ==========================================

import type { Puestero, Producto, Categoria } from "./mock-data";

// ── Tipos públicos ───────────────────────────────────────────

export type PlanTipo = "bronce" | "plata" | "oro";

export interface CategoriaPublica {
  id: string;
  nombre: string;
  imagen: string;
  cantidadLocales: number;
}

export interface LocalPublico {
  id: string;
  nombre: string;
  ubicacion: string;
  logo: string;          // iniciales (fallback)
  logoUrl?: string;      // URL del logo subido (si existe)
  color: string;
  plan: PlanTipo;
  telefono: string;
  aceptaTransferencia: boolean;
  aceptaCambios: boolean;
  realizaEnvios: boolean;
}

export interface ProductoPublico {
  id: string;
  nombre: string;
  precio: number;
  precioAnterior?: number;
  precioMayorista?: number;
  imagenes: string[];
  localId: string;
  categoriaId: string;
  subCategoria?: string;
  talleDesde?: string;
  talleHasta?: string;
  descripcion?: string;
}

// ── Plan mapping ─────────────────────────────────────────────
function mapPlan(plan: "bronce" | "plata" | "oro"): PlanTipo {
  return plan;
}

// ── Slug dinámico desde el nombre de la categoría ────────────
// Genera un ID de URL limpio a partir del nombre.
// "Niños" → "ninos", "Mujer" → "mujer", "Mi Categoría" → "mi-categoria"
// Funciona con cualquier categoría nueva que Jere cree en el admin.
export function slugify(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Puestero → LocalPublico ──────────────────────────────────
export function puesteroToLocal(p: Puestero): LocalPublico {
  return {
    id: `l${p.id}`,
    nombre: p.nombreComercial,
    ubicacion: `Fila ${p.fila}, Puesto ${p.numeroPuesto}`,
    logo: p.logoIniciales,
    logoUrl: p.logoUrl || undefined,
    color: p.color,
    plan: mapPlan(p.plan),
    telefono: p.telefono,
    aceptaTransferencia: p.aceptaTransferencia,
    aceptaCambios: p.aceptaCambios,
    realizaEnvios: p.realizaEnvios,
  };
}

// ── Producto (admin) → ProductoPublico ───────────────────────
// Recibe el array de categorias para generar el slug dinámicamente.
export function productoToPublico(p: Producto, categorias: Categoria[]): ProductoPublico {
  const cat = categorias.find((c) => c.id === p.categoriaId);
  return {
    id: `p${p.id}`,
    nombre: p.nombre,
    precio: p.precioMinorista,
    precioAnterior: p.precioAnterior ?? undefined,
    precioMayorista: p.precioMayorista ?? undefined,
    imagenes: p.imagenes,
    localId: `l${p.puesteroId}`,
    categoriaId: cat ? slugify(cat.nombre) : "otros",
    subCategoria: p.subcategoria,
    talleDesde: p.talleDesde || undefined,
    talleHasta: p.talleHasta || undefined,
    descripcion: p.descripcion || undefined,
  };
}

// ── Helper: ¿El puestero está visible al público? ────────────
// Reglas: estado_actividad activo + sin mora >5 días.
const DIAS_TOLERANCIA_MORA = 5;

export function diasDeAtraso(p: Puestero): number {
  if (p.estadoPago === "pagado") return 0;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const cobro = new Date(p.fechaProximoCobro);
  cobro.setHours(0, 0, 0, 0);
  const diff = Math.floor((hoy.getTime() - cobro.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function estaEnMora(p: Puestero): boolean {
  return diasDeAtraso(p) > DIAS_TOLERANCIA_MORA;
}

export function esVisiblePublicamente(p: Puestero): boolean {
  return p.estadoActividad === "activo" && !estaEnMora(p);
}

// ── Categoria (admin) → CategoriaPublica ─────────────────────
export function categoriaToPublica(
  cat: Categoria,
  puesteros: Puestero[],
  productos: Producto[]
): CategoriaPublica {
  // Count unique visible puesteros that have visible products in this category
  const puesteroIds = new Set(
    productos
      .filter((p) => p.categoriaId === cat.id && p.visible)
      .map((p) => p.puesteroId)
  );
  const activeCount = [...puesteroIds].filter((pid) =>
    puesteros.some((pu) => pu.id === pid && esVisiblePublicamente(pu))
  ).length;

  return {
    id: slugify(cat.nombre),
    nombre: cat.nombre,
    imagen: cat.imagen || "",
    cantidadLocales: activeCount,
  };
}

// ── Batch converters ─────────────────────────────────────────

export function getLocalesFromPuesteros(puesteros: Puestero[]): LocalPublico[] {
  return puesteros
    .filter(esVisiblePublicamente)
    .map(puesteroToLocal);
}

export function getProductosPublicos(
  productos: Producto[],
  categorias: Categoria[],
  puesteros: Puestero[] = []
): ProductoPublico[] {
  // Solo visibles + de un puestero NO en mora (si nos pasan la lista)
  const puesterosVisibles = new Set(
    puesteros.filter(esVisiblePublicamente).map((p) => p.id)
  );
  return productos
    .filter((p) => p.visible)
    .filter((p) => puesteros.length === 0 || puesterosVisibles.has(p.puesteroId))
    .map((p) => productoToPublico(p, categorias));
}

export function getCategoriasPublicas(
  categorias: Categoria[],
  puesteros: Puestero[],
  productos: Producto[]
): CategoriaPublica[] {
  return categorias.map((c) => categoriaToPublica(c, puesteros, productos));
}

// ── Reverse lookup helpers ───────────────────────────────────

export function getPuesteroIdFromLocalId(localId: string): number | null {
  const num = parseInt(localId.replace("l", ""), 10);
  return isNaN(num) ? null : num;
}

export function getProductoIdFromPublicId(productoId: string): number | null {
  const num = parseInt(productoId.replace("p", ""), 10);
  return isNaN(num) ? null : num;
}
