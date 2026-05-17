// ==========================================
// CAPA DE ACCESO A DATOS — Supabase
// Funciones CRUD para cada tabla + mappers snake_case ↔ camelCase
// ==========================================
import { supabase } from "./supabase";
import type {
  Puestero,
  Producto,
  Categoria,
  Solicitud,
  Egreso,
} from "./mock-data";

// ─── MAPPERS ────────────────────────────────────────────────

type PuesteroRow = {
  id: number;
  user_id: string | null;
  nombre_responsable: string;
  nombre_comercial: string;
  fila: string;
  numero_puesto: number;
  telefono: string;
  email: string;
  gmail_acceso: string;
  acepta_transferencia: boolean;
  acepta_cambios: boolean;
  realiza_envios: boolean;
  plan: "bronce" | "plata" | "oro";
  limite_productos: number;
  productos_activos: number;
  estado_pago: "pagado" | "pendiente";
  estado_actividad: "activo" | "inactivo";
  fecha_alta: string;
  fecha_proximo_cobro: string;
  observaciones: string;
  color: string;
  logo_iniciales: string;
  logo_url?: string;
  vistas?: number;
  whatsapps?: number;
};

function rowToPuestero(r: PuesteroRow): Puestero {
  return {
    id: r.id,
    nombreResponsable: r.nombre_responsable,
    nombreComercial: r.nombre_comercial,
    fila: r.fila,
    numeroPuesto: r.numero_puesto,
    telefono: r.telefono,
    email: r.email,
    gmailAcceso: r.gmail_acceso,
    aceptaTransferencia: r.acepta_transferencia,
    aceptaCambios: r.acepta_cambios,
    realizaEnvios: r.realiza_envios,
    plan: r.plan,
    limiteProductos: r.limite_productos,
    productosActivos: r.productos_activos,
    estadoPago: r.estado_pago,
    estadoActividad: r.estado_actividad,
    fechaAlta: r.fecha_alta,
    fechaProximoCobro: r.fecha_proximo_cobro,
    observaciones: r.observaciones,
    color: r.color,
    logoIniciales: r.logo_iniciales,
    logoUrl: r.logo_url ?? "",
    vistas: r.vistas ?? 0,
    whatsapps: r.whatsapps ?? 0,
  };
}

function puesteroToRow(p: Partial<Puestero>): Partial<PuesteroRow> {
  const out: Partial<PuesteroRow> = {};
  if (p.nombreResponsable !== undefined)   out.nombre_responsable = p.nombreResponsable;
  if (p.nombreComercial !== undefined)     out.nombre_comercial = p.nombreComercial;
  if (p.fila !== undefined)                out.fila = p.fila;
  if (p.numeroPuesto !== undefined)        out.numero_puesto = p.numeroPuesto;
  if (p.telefono !== undefined)            out.telefono = p.telefono;
  if (p.email !== undefined)               out.email = p.email;
  if (p.gmailAcceso !== undefined)         out.gmail_acceso = p.gmailAcceso;
  if (p.aceptaTransferencia !== undefined) out.acepta_transferencia = p.aceptaTransferencia;
  if (p.aceptaCambios !== undefined)       out.acepta_cambios = p.aceptaCambios;
  if (p.realizaEnvios !== undefined)       out.realiza_envios = p.realizaEnvios;
  if (p.plan !== undefined)                out.plan = p.plan;
  if (p.limiteProductos !== undefined)     out.limite_productos = p.limiteProductos;
  if (p.productosActivos !== undefined)    out.productos_activos = p.productosActivos;
  if (p.estadoPago !== undefined)          out.estado_pago = p.estadoPago;
  if (p.estadoActividad !== undefined)     out.estado_actividad = p.estadoActividad;
  if (p.fechaAlta !== undefined)           out.fecha_alta = p.fechaAlta;
  if (p.fechaProximoCobro !== undefined)   out.fecha_proximo_cobro = p.fechaProximoCobro;
  if (p.observaciones !== undefined)       out.observaciones = p.observaciones;
  if (p.color !== undefined)               out.color = p.color;
  if (p.logoIniciales !== undefined)       out.logo_iniciales = p.logoIniciales;
  if (p.logoUrl !== undefined)             out.logo_url = p.logoUrl;
  return out;
}

type ProductoRow = {
  id: number;
  puestero_id: number;
  categoria_id: number | null;
  nombre: string;
  imagenes: string[];
  subcategoria: string;
  precio_minorista: number;
  precio_mayorista: number | null;
  precio_anterior: number | null;
  talle_desde: string;
  talle_hasta: string;
  descripcion: string;
  visible: boolean;
  fecha_carga: string;
  vistas?: number;
  whatsapps?: number;
};

function rowToProducto(r: ProductoRow): Producto {
  return {
    id: r.id,
    puesteroId: r.puestero_id,
    categoriaId: r.categoria_id ?? 0,
    nombre: r.nombre,
    imagenes: r.imagenes ?? [],
    subcategoria: r.subcategoria,
    precioMinorista: Number(r.precio_minorista),
    precioMayorista: r.precio_mayorista !== null ? Number(r.precio_mayorista) : null,
    precioAnterior: r.precio_anterior !== null ? Number(r.precio_anterior) : null,
    talleDesde: r.talle_desde,
    talleHasta: r.talle_hasta,
    descripcion: r.descripcion,
    visible: r.visible,
    fechaCarga: r.fecha_carga,
    vistas: r.vistas ?? 0,
    whatsapps: r.whatsapps ?? 0,
  };
}

function productoToRow(p: Partial<Producto>): Partial<ProductoRow> {
  const out: Partial<ProductoRow> = {};
  if (p.puesteroId !== undefined)      out.puestero_id = p.puesteroId;
  if (p.categoriaId !== undefined)     out.categoria_id = p.categoriaId || null;
  if (p.nombre !== undefined)          out.nombre = p.nombre;
  if (p.imagenes !== undefined)        out.imagenes = p.imagenes;
  if (p.subcategoria !== undefined)    out.subcategoria = p.subcategoria;
  if (p.precioMinorista !== undefined) out.precio_minorista = p.precioMinorista;
  if (p.precioMayorista !== undefined) out.precio_mayorista = p.precioMayorista;
  if (p.precioAnterior !== undefined)  out.precio_anterior = p.precioAnterior;
  if (p.talleDesde !== undefined)      out.talle_desde = p.talleDesde;
  if (p.talleHasta !== undefined)      out.talle_hasta = p.talleHasta;
  if (p.descripcion !== undefined)     out.descripcion = p.descripcion;
  if (p.visible !== undefined)         out.visible = p.visible;
  if (p.fechaCarga !== undefined)      out.fecha_carga = p.fechaCarga;
  return out;
}

type CategoriaRow = {
  id: number;
  nombre: string;
  imagen: string;
  subcategorias: string[];
};

function rowToCategoria(r: CategoriaRow): Categoria {
  return {
    id: r.id,
    nombre: r.nombre,
    imagen: r.imagen ?? "",
    subcategorias: r.subcategorias ?? [],
  };
}

type SolicitudRow = {
  id: number;
  nombre_responsable: string;
  nombre_comercial: string;
  telefono: string;
  email: string;
  gmail_acceso: string;
  fila: string;
  numero_puesto: number;
  plan_elegido: "bronce" | "plata" | "oro";
  metodo_pago?: "transferencia" | "efectivo";
  monto_transferido: number;
  fecha_solicitud: string;
  comprobante_url: string | null;
  estado: "pendiente" | "aprobado" | "rechazado";
  observaciones: string;
};

function rowToSolicitud(r: SolicitudRow): Solicitud {
  return {
    id: r.id,
    nombreResponsable: r.nombre_responsable,
    nombreComercial: r.nombre_comercial,
    telefono: r.telefono,
    email: r.email,
    gmailAcceso: r.gmail_acceso,
    fila: r.fila,
    numeroPuesto: r.numero_puesto,
    planElegido: r.plan_elegido,
    metodoPago: r.metodo_pago ?? "transferencia",
    montoTransferido: Number(r.monto_transferido),
    fechaSolicitud: r.fecha_solicitud,
    comprobanteUrl: r.comprobante_url,
    estado: r.estado,
    observaciones: r.observaciones,
  };
}

function solicitudToRow(s: Partial<Solicitud>): Partial<SolicitudRow> {
  const out: Partial<SolicitudRow> = {};
  if (s.nombreResponsable !== undefined) out.nombre_responsable = s.nombreResponsable;
  if (s.nombreComercial !== undefined)   out.nombre_comercial = s.nombreComercial;
  if (s.telefono !== undefined)          out.telefono = s.telefono;
  if (s.email !== undefined)             out.email = s.email;
  if (s.gmailAcceso !== undefined)       out.gmail_acceso = s.gmailAcceso;
  if (s.fila !== undefined)              out.fila = s.fila;
  if (s.numeroPuesto !== undefined)      out.numero_puesto = s.numeroPuesto;
  if (s.planElegido !== undefined)       out.plan_elegido = s.planElegido;
  if (s.montoTransferido !== undefined)  out.monto_transferido = s.montoTransferido;
  if (s.fechaSolicitud !== undefined)    out.fecha_solicitud = s.fechaSolicitud;
  if (s.comprobanteUrl !== undefined)    out.comprobante_url = s.comprobanteUrl;
  if (s.estado !== undefined)            out.estado = s.estado;
  if (s.observaciones !== undefined)     out.observaciones = s.observaciones;
  if (s.metodoPago !== undefined)        out.metodo_pago = s.metodoPago;
  return out;
}

type EgresoRow = {
  id: number;
  concepto: string;
  categoria: "publicidad" | "diseño" | "hosting" | "operativo" | "otros";
  monto: number;
  fecha: string;
  descripcion: string;
};

function rowToEgreso(r: EgresoRow): Egreso {
  return {
    id: r.id,
    concepto: r.concepto,
    categoria: r.categoria,
    monto: Number(r.monto),
    fecha: r.fecha,
    descripcion: r.descripcion,
  };
}

// ─── PUESTEROS ──────────────────────────────────────────────
export const puesterosRepo = {
  async list(): Promise<Puestero[]> {
    const { data, error } = await supabase.from("puesteros").select("*").order("id", { ascending: true });
    if (error) throw error;
    return (data as PuesteroRow[]).map(rowToPuestero);
  },
  async insert(p: Omit<Puestero, "id">): Promise<Puestero> {
    const { data, error } = await supabase.from("puesteros").insert(puesteroToRow(p)).select().single();
    if (error) throw error;
    return rowToPuestero(data as PuesteroRow);
  },
  async update(id: number, p: Partial<Puestero>): Promise<Puestero> {
    const { data, error } = await supabase.from("puesteros").update(puesteroToRow(p)).eq("id", id).select().single();
    if (error) throw error;
    return rowToPuestero(data as PuesteroRow);
  },
  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("puesteros").delete().eq("id", id);
    if (error) throw error;
  },
};

// ─── PRODUCTOS ──────────────────────────────────────────────
export const productosRepo = {
  async list(): Promise<Producto[]> {
    // Supabase limita a 1000 rows por query — paginamos para traer todo
    const PAGE = 1000;
    let all: ProductoRow[] = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      all = all.concat(data as ProductoRow[]);
      if (data.length < PAGE) break;
      from += PAGE;
    }
    return all.map(rowToProducto);
  },
  async insert(p: Omit<Producto, "id">): Promise<Producto> {
    const { data, error } = await supabase.from("productos").insert(productoToRow(p)).select().single();
    if (error) throw error;
    return rowToProducto(data as ProductoRow);
  },
  async update(id: number, p: Partial<Producto>): Promise<Producto> {
    const { data, error } = await supabase.from("productos").update(productoToRow(p)).eq("id", id).select().single();
    if (error) throw error;
    return rowToProducto(data as ProductoRow);
  },
  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) throw error;
  },
};

// ─── CATEGORÍAS ─────────────────────────────────────────────
export const categoriasRepo = {
  async list(): Promise<Categoria[]> {
    const { data, error } = await supabase.from("categorias").select("*").order("id", { ascending: true });
    if (error) throw error;
    return (data as CategoriaRow[]).map(rowToCategoria);
  },
  async insert(c: Omit<Categoria, "id">): Promise<Categoria> {
    const { data, error } = await supabase
      .from("categorias")
      .insert({ nombre: c.nombre, imagen: c.imagen, subcategorias: c.subcategorias })
      .select().single();
    if (error) throw error;
    return rowToCategoria(data as CategoriaRow);
  },
  async update(id: number, c: Partial<Categoria>): Promise<Categoria> {
    const patch: Partial<CategoriaRow> = {};
    if (c.nombre !== undefined) patch.nombre = c.nombre;
    if (c.imagen !== undefined) patch.imagen = c.imagen;
    if (c.subcategorias !== undefined) patch.subcategorias = c.subcategorias;
    const { data, error } = await supabase.from("categorias").update(patch).eq("id", id).select().single();
    if (error) throw error;
    return rowToCategoria(data as CategoriaRow);
  },
  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("categorias").delete().eq("id", id);
    if (error) throw error;
  },
};

// ─── SOLICITUDES ────────────────────────────────────────────
export const solicitudesRepo = {
  async list(): Promise<Solicitud[]> {
    const { data, error } = await supabase.from("solicitudes").select("*").order("id", { ascending: true });
    if (error) throw error;
    return (data as SolicitudRow[]).map(rowToSolicitud);
  },
  async insert(s: Omit<Solicitud, "id">): Promise<Solicitud> {
    const { data, error } = await supabase.from("solicitudes").insert(solicitudToRow(s)).select().single();
    if (error) throw error;
    return rowToSolicitud(data as SolicitudRow);
  },
  async update(id: number, s: Partial<Solicitud>): Promise<Solicitud> {
    const { data, error } = await supabase.from("solicitudes").update(solicitudToRow(s)).eq("id", id).select().single();
    if (error) throw error;
    return rowToSolicitud(data as SolicitudRow);
  },
};

// ─── TRACKING (vistas + whatsapps) ──────────────────────────
// Llaman a RPC functions del SQL que incrementan contadores atómicamente.
// Si fallan no rompen la UX — solo loguean.
export const trackingRepo = {
  async vistaProducto(productoId: number) {
    const { error } = await supabase.rpc("track_vista_producto", { p_id: productoId });
    if (error) console.error("[track] vistaProducto", error);
  },
  async whatsappProducto(productoId: number) {
    const { error } = await supabase.rpc("track_whatsapp_producto", { p_id: productoId });
    if (error) console.error("[track] whatsappProducto", error);
  },
  async vistaPuestero(puesteroId: number) {
    const { error } = await supabase.rpc("track_vista_puestero", { p_id: puesteroId });
    if (error) console.error("[track] vistaPuestero", error);
  },
  async whatsappPuestero(puesteroId: number) {
    const { error } = await supabase.rpc("track_whatsapp_puestero", { p_id: puesteroId });
    if (error) console.error("[track] whatsappPuestero", error);
  },
};

// ─── EGRESOS ────────────────────────────────────────────────
export const egresosRepo = {
  async list(): Promise<Egreso[]> {
    const { data, error } = await supabase.from("egresos").select("*").order("id", { ascending: true });
    if (error) throw error;
    return (data as EgresoRow[]).map(rowToEgreso);
  },
  async insert(e: Omit<Egreso, "id">): Promise<Egreso> {
    const { data, error } = await supabase
      .from("egresos")
      .insert({ concepto: e.concepto, categoria: e.categoria, monto: e.monto, fecha: e.fecha, descripcion: e.descripcion })
      .select().single();
    if (error) throw error;
    return rowToEgreso(data as EgresoRow);
  },
  async update(id: number, e: Partial<Egreso>): Promise<Egreso> {
    const { data, error } = await supabase.from("egresos").update(e).eq("id", id).select().single();
    if (error) throw error;
    return rowToEgreso(data as EgresoRow);
  },
  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("egresos").delete().eq("id", id);
    if (error) throw error;
  },
};
