// ==========================================
// DATOS BASE — PASEO 96 PRE-SUPABASE
// ==========================================
// Este archivo ya no contiene datos falsos de la maqueta.
// Mantiene solamente tipos, planes, categorías base y arrays vacíos
// para probar estados reales antes de conectar Supabase.

// ── TIPOS ────────────────────────────────────────────────────

export type Categoria = {
  id: number;
  nombre: string;
  imagen: string;
  subcategorias: string[];
};

export type Puestero = {
  id: number;
  nombreResponsable: string;
  nombreComercial: string;
  fila: string;
  numeroPuesto: number;
  telefono: string;
  email: string;
  gmailAcceso: string;
  aceptaTransferencia: boolean;
  aceptaCambios: boolean;
  realizaEnvios: boolean;
  plan: "bronce" | "plata" | "oro";
  limiteProductos: number;
  productosActivos: number;
  estadoPago: "pagado" | "pendiente";
  estadoActividad: "activo" | "inactivo";
  fechaAlta: string;
  fechaProximoCobro: string;
  observaciones: string;
  color: string;
  logoIniciales: string;
  logoUrl?: string;     // URL del logo subido a Supabase Storage
  vistas?: number;      // Cantidad acumulada de visitas al puesto
  whatsapps?: number;   // Cantidad acumulada de clicks de WhatsApp
};

export type Producto = {
  id: number;
  nombre: string;
  imagenes: string[];
  categoriaId: number;
  subcategoria: string;
  precioMinorista: number;
  precioMayorista: number | null;
  precioAnterior: number | null;
  talleDesde: string;
  talleHasta: string;
  descripcion: string;
  puesteroId: number;
  visible: boolean;
  fechaCarga: string;
  vistas?: number;
  whatsapps?: number;
};

export type Egreso = {
  id: number;
  concepto: string;
  categoria: "publicidad" | "diseño" | "hosting" | "operativo" | "otros";
  monto: number;
  fecha: string;
  descripcion: string;
};

export type Solicitud = {
  id: number;
  nombreResponsable: string;
  nombreComercial: string;
  telefono: string;
  email: string;
  gmailAcceso: string;
  fila: string;
  numeroPuesto: number;
  planElegido: "bronce" | "plata" | "oro";
  metodoPago: "transferencia" | "efectivo";
  montoTransferido: number; // monto final a cobrar (con IVA si es transferencia)
  fechaSolicitud: string;
  comprobanteUrl: string | null;
  estado: "pendiente" | "aprobado" | "rechazado";
  observaciones: string;
};

// IVA argentino para pagos por transferencia.
export const IVA_TRANSFERENCIA = 0.21;
export function montoConIva(precio: number): number {
  return Math.round(precio * (1 + IVA_TRANSFERENCIA));
}

// ── CATEGORÍAS BASE ──────────────────────────────────────────
// Se mantienen como configuración inicial. Las imágenes quedan vacías
// para evitar seguir usando assets genéricos en la versión real.

export const initialCategorias: Categoria[] = [
  {
    id: 1,
    nombre: "Mujer",
    imagen: "",
    subcategorias: [
      "Jeans",
      "Pantalones",
      "Shorts y calzas",
      "Vestidos y polleras",
      "Remeras y camisas",
      "Buzos y sweaters",
      "Camperas",
      "Calzado",
      "Accesorios",
      "Deportiva",
      "Talles especiales",
      "Lencería y mallas",
    ],
  },
  {
    id: 2,
    nombre: "Hombre",
    imagen: "",
    subcategorias: [
      "Jeans",
      "Pantalones",
      "Bermudas y shorts",
      "Remeras",
      "Camisas",
      "Buzos y sweaters",
      "Camperas",
      "Calzado",
      "Accesorios",
      "Deportiva",
      "Talles especiales",
    ],
  },
  {
    id: 3,
    nombre: "Niños",
    imagen: "",
    subcategorias: [
      "Bebés",
      "Remeras y camisas",
      "Buzos",
      "Pantalones",
      "Camperas",
      "Calzado",
      "Vestidos y polleras",
      "Accesorios",
      "Juguetes",
    ],
  },
  {
    id: 4,
    nombre: "Otros",
    imagen: "",
    subcategorias: [
      "Perfumería y cosméticos",
      "Electrónica",
      "Juguetes",
      "Blanquería",
      "Bazar y hogar",
      "Mascotas",
      "Marroquinería",
    ],
  },
];

// ── ARRANQUE LIMPIO ──────────────────────────────────────────

export const initialPuesteros: Puestero[] = [];
export const initialProductos: Producto[] = [];
export const initialSolicitudes: Solicitud[] = [];
export const initialEgresos: Egreso[] = [];

// ── PLANES ───────────────────────────────────────────────────

export const planConfig = {
  bronce: {
    nombre: "Bronce",
    precio: 44990,
    maxPublicaciones: 4,
    maxFotosPorPublicacion: 5,
    maxFotosTotal: 20,
    maxVideos: 0,
    whatsappEmpresa: true,
    logoLocal: true,
    estadisticasAvanzadas: true,
    publicacionDestacada: false,
    publicidadVideo: false,
    iaImagenes: false,
  },
  plata: {
    nombre: "Plata",
    precio: 74990,
    maxPublicaciones: 10,
    maxFotosPorPublicacion: 5,
    maxFotosTotal: 50,
    maxVideos: 0,
    whatsappEmpresa: true,
    logoLocal: true,
    estadisticasAvanzadas: true,
    publicacionDestacada: true,
    publicidadVideo: true,
    iaImagenes: false,
  },
  oro: {
    nombre: "Oro",
    precio: 104990,
    maxPublicaciones: 20,
    maxFotosPorPublicacion: 5,
    maxFotosTotal: 100,
    maxVideos: 5,
    whatsappEmpresa: true,
    logoLocal: true,
    estadisticasAvanzadas: true,
    publicacionDestacada: true,
    publicidadVideo: true,
    iaImagenes: true,
  },
} as const;

export type PlanKey = keyof typeof planConfig;

export const preciosPlanes: Record<PlanKey, number> = {
  bronce: planConfig.bronce.precio,
  plata: planConfig.plata.precio,
  oro: planConfig.oro.precio,
};

// ── CONFIGURACIÓN DE COBRO PRE-SUPABASE ──────────────────────

export const datosTransferencia = {
  alias: "Jeretalavera.LEMON",
  cbu: "0000168300000019911810",
  titular: "Jeremías Talavera",
  cuit: "20-46431423-8",
  banco: "Lemon Cash",
  whatsappAdmin: "5492215410783",
};

export const seguridadPreSupabase = {
  gmailAdmin: "paseodelsur96@gmail.com",
};

// ── EGRESOS ──────────────────────────────────────────────────

export const categoriasEgreso = [
  { value: "publicidad", label: "Publicidad", color: "bg-orange-400/10 text-orange-400" },
  { value: "diseño", label: "Diseño", color: "bg-pink-400/10 text-pink-400" },
  { value: "hosting", label: "Hosting / Tech", color: "bg-cyan-400/10 text-cyan-400" },
  { value: "operativo", label: "Operativo", color: "bg-violet-400/10 text-violet-400" },
  { value: "otros", label: "Otros", color: "bg-gray-100 text-muted" },
];

export const categoryImages: Record<number, string> = {};

// ── FUNCIONES HELPER ─────────────────────────────────────────

export function getCategoriaNombre(id: number): string {
  return initialCategorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";
}

export function formatPrecio(precio: number): string {
  return `$ ${precio.toLocaleString("es-AR")}`;
}

export function getPuesteroLabel(p: Puestero): string {
  return `${p.nombreComercial} — Fila ${p.fila}, Puesto ${p.numeroPuesto}`;
}
