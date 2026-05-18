import { createClient } from "@supabase/supabase-js";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) { console.error("Falta SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

const supabase = createClient(
  "https://xrxphbbpjypytlmsnikr.supabase.co",
  SERVICE_KEY
);

// ── 4 CATEGORÍAS curadas con fotos premium ─────────────────
const categorias = [
  {
    nombre: "Mujer",
    imagen: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    subcategorias: ["Jeans", "Pantalones", "Remeras", "Vestidos", "Camperas"],
  },
  {
    nombre: "Hombre",
    imagen: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85",
    subcategorias: ["Jeans", "Camisas", "Remeras", "Buzos", "Camperas"],
  },
  {
    nombre: "Niños",
    imagen: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900&q=85",
    subcategorias: ["Remeras", "Pantalones", "Buzos", "Vestidos", "Camperas"],
  },
  {
    nombre: "Calzado",
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85",
    subcategorias: ["Zapatillas", "Botas", "Sandalias", "Mocasines", "Deportivo"],
  },
];

// ── 6 PUESTEROS premium ────────────────────────────────────
const puesteros = [
  {
    nombre_responsable: "Sofía Rodríguez",
    nombre_comercial: "Atelier Sofía",
    fila: "A", numero_puesto: 1,
    telefono: "+5492215100001", email: "sofia.atelier@test.com", gmail_acceso: "sofia.atelier@test.com",
    acepta_transferencia: true, acepta_cambios: true, realiza_envios: true,
    plan: "oro", limite_productos: 20, productos_activos: 0,
    estado_pago: "pagado", estado_actividad: "activo",
    fecha_alta: "2025-01-10", fecha_proximo_cobro: "2025-07-01",
    observaciones: "", color: "#3B82F6", logo_iniciales: "AS",
  },
  {
    nombre_responsable: "Matías López",
    nombre_comercial: "Urban North",
    fila: "B", numero_puesto: 8,
    telefono: "+5492215100002", email: "matias.urban@test.com", gmail_acceso: "matias.urban@test.com",
    acepta_transferencia: true, acepta_cambios: true, realiza_envios: false,
    plan: "oro", limite_productos: 20, productos_activos: 0,
    estado_pago: "pagado", estado_actividad: "activo",
    fecha_alta: "2025-01-12", fecha_proximo_cobro: "2025-07-01",
    observaciones: "", color: "#0A0A0A", logo_iniciales: "UN",
  },
  {
    nombre_responsable: "Camila Fernández",
    nombre_comercial: "Pequeños Mundos",
    fila: "C", numero_puesto: 15,
    telefono: "+5492215100003", email: "camila.kids@test.com", gmail_acceso: "camila.kids@test.com",
    acepta_transferencia: true, acepta_cambios: true, realiza_envios: true,
    plan: "plata", limite_productos: 10, productos_activos: 0,
    estado_pago: "pagado", estado_actividad: "activo",
    fecha_alta: "2025-02-01", fecha_proximo_cobro: "2025-07-01",
    observaciones: "", color: "#EC4899", logo_iniciales: "PM",
  },
  {
    nombre_responsable: "Diego Sosa",
    nombre_comercial: "Calzados Argentinos",
    fila: "D", numero_puesto: 22,
    telefono: "+5492215100004", email: "diego.calzado@test.com", gmail_acceso: "diego.calzado@test.com",
    acepta_transferencia: true, acepta_cambios: false, realiza_envios: true,
    plan: "plata", limite_productos: 10, productos_activos: 0,
    estado_pago: "pagado", estado_actividad: "activo",
    fecha_alta: "2025-02-15", fecha_proximo_cobro: "2025-07-01",
    observaciones: "", color: "#92400E", logo_iniciales: "CA",
  },
  {
    nombre_responsable: "Laura Martín",
    nombre_comercial: "Lumière",
    fila: "E", numero_puesto: 29,
    telefono: "+5492215100005", email: "laura.lumiere@test.com", gmail_acceso: "laura.lumiere@test.com",
    acepta_transferencia: true, acepta_cambios: true, realiza_envios: true,
    plan: "bronce", limite_productos: 4, productos_activos: 0,
    estado_pago: "pagado", estado_actividad: "activo",
    fecha_alta: "2025-03-01", fecha_proximo_cobro: "2025-07-01",
    observaciones: "", color: "#7C3AED", logo_iniciales: "LU",
  },
  {
    nombre_responsable: "Federico Castro",
    nombre_comercial: "Casual Studio",
    fila: "F", numero_puesto: 36,
    telefono: "+5492215100006", email: "fede.casual@test.com", gmail_acceso: "fede.casual@test.com",
    acepta_transferencia: true, acepta_cambios: true, realiza_envios: false,
    plan: "bronce", limite_productos: 4, productos_activos: 0,
    estado_pago: "pagado", estado_actividad: "activo",
    fecha_alta: "2025-03-15", fecha_proximo_cobro: "2025-07-01",
    observaciones: "", color: "#059669", logo_iniciales: "CS",
  },
];

// ── 20 PRODUCTOS curados con fotos top ─────────────────────
// Estructura: cat=índice de categoria, puestero=índice de puestero
const productosBase = [
  // ─── MUJER (5) ───
  { cat: 0, puestero: 0, nombre: "Blazer Entallado Lino", precio: 87990, anterior: 109990, sub: "Camperas",
    fotos: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85", "https://images.unsplash.com/photo-1551798507-629020c81463?w=800&q=85"],
    talleD: "S", talleH: "L", desc: "Blazer entallado de lino premium, ideal para look formal o casual elegante." },
  { cat: 0, puestero: 4, nombre: "Vestido Midi Estampado", precio: 64500, anterior: 79900, sub: "Vestidos",
    fotos: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=85", "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800&q=85"],
    talleD: "XS", talleH: "L", desc: "Vestido midi con estampado floral, perfecto para temporada media." },
  { cat: 0, puestero: 0, nombre: "Jean Mom Tiro Alto", precio: 49990, anterior: null, sub: "Jeans",
    fotos: ["https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=85"],
    talleD: "26", talleH: "32", desc: "Jean mom tiro alto, calce relajado y cintura cómoda." },
  { cat: 0, puestero: 4, nombre: "Remera Algodón Premium", precio: 23990, anterior: 29990, sub: "Remeras",
    fotos: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=85"],
    talleD: "S", talleH: "XL", desc: "Remera básica de algodón pima 100%. Calce holgado moderno." },
  { cat: 0, puestero: 0, nombre: "Sweater Tejido Oversize", precio: 78500, anterior: null, sub: "Camperas",
    fotos: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85"],
    talleD: "Único", talleH: "Único", desc: "Sweater oversize tejido a mano, lana merino superior." },

  // ─── HOMBRE (5) ───
  { cat: 1, puestero: 1, nombre: "Camisa Lino Casual", precio: 56990, anterior: 69990, sub: "Camisas",
    fotos: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=85", "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=85"],
    talleD: "S", talleH: "XL", desc: "Camisa de lino, ideal verano. Calce regular." },
  { cat: 1, puestero: 5, nombre: "Buzo Hoodie Premium", precio: 67900, anterior: 89900, sub: "Buzos",
    fotos: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=85", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85"],
    talleD: "M", talleH: "XXL", desc: "Buzo con capucha, frisa interior, calidad premium." },
  { cat: 1, puestero: 1, nombre: "Jean Recto Clásico", precio: 54900, anterior: null, sub: "Jeans",
    fotos: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=85"],
    talleD: "30", talleH: "42", desc: "Jean recto clásico, denim 100% algodón." },
  { cat: 1, puestero: 5, nombre: "Remera Oversize Negra", precio: 27500, anterior: 34900, sub: "Remeras",
    fotos: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85"],
    talleD: "S", talleH: "XL", desc: "Remera oversize en negro absoluto, algodón pesado 240g." },
  { cat: 1, puestero: 1, nombre: "Campera Bomber Cuero", precio: 145900, anterior: 189900, sub: "Camperas",
    fotos: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85", "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=85"],
    talleD: "S", talleH: "XL", desc: "Campera bomber de cuero genuino, forro acolchado." },

  // ─── NIÑOS (5) ───
  { cat: 2, puestero: 2, nombre: "Conjunto Verano Niña", precio: 38990, anterior: 49990, sub: "Vestidos",
    fotos: ["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=85", "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=85"],
    talleD: "2", talleH: "8", desc: "Conjunto remera + short, algodón liviano para verano." },
  { cat: 2, puestero: 2, nombre: "Buzo Frisa Estampado", precio: 32990, anterior: null, sub: "Buzos",
    fotos: ["https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=800&q=85"],
    talleD: "4", talleH: "12", desc: "Buzo con frisa interior, estampados divertidos." },
  { cat: 2, puestero: 2, nombre: "Pantalón Cargo Niño", precio: 28900, anterior: 36900, sub: "Pantalones",
    fotos: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=85"],
    talleD: "4", talleH: "14", desc: "Pantalón cargo resistente, perfecto para el día a día." },
  { cat: 2, puestero: 2, nombre: "Remera Manga Larga Algodón", precio: 19990, anterior: null, sub: "Remeras",
    fotos: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=85"],
    talleD: "2", talleH: "10", desc: "Remera manga larga 100% algodón, varios colores." },
  { cat: 2, puestero: 2, nombre: "Campera Inflable Niño", precio: 54900, anterior: 72900, sub: "Camperas",
    fotos: ["https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=800&q=85"],
    talleD: "4", talleH: "14", desc: "Campera inflable liviana, perfecta para el frío." },

  // ─── CALZADO (5) ───
  { cat: 3, puestero: 3, nombre: "Zapatilla Urbana Premium", precio: 96900, anterior: 124900, sub: "Zapatillas",
    fotos: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=85"],
    talleD: "36", talleH: "44", desc: "Zapatilla urbana de cuero, suela de goma reforzada." },
  { cat: 3, puestero: 3, nombre: "Bota Texana Cuero", precio: 134900, anterior: null, sub: "Botas",
    fotos: ["https://images.unsplash.com/photo-1608256246200-53e8b47b2dc1?w=800&q=85"],
    talleD: "36", talleH: "44", desc: "Bota texana de cuero genuino, hecha en Argentina." },
  { cat: 3, puestero: 3, nombre: "Sandalia Cuero Trenzada", precio: 47900, anterior: 59900, sub: "Sandalias",
    fotos: ["https://images.unsplash.com/photo-1604001307862-2d953b875079?w=800&q=85"],
    talleD: "35", talleH: "41", desc: "Sandalia trenzada de cuero suave, ideal verano." },
  { cat: 3, puestero: 3, nombre: "Mocasín Gamuza Hombre", precio: 78900, anterior: 96900, sub: "Mocasines",
    fotos: ["https://images.unsplash.com/photo-1614252369475-531eba835f4f?w=800&q=85"],
    talleD: "39", talleH: "45", desc: "Mocasín de gamuza, calce cómodo y elegante." },
  { cat: 3, puestero: 3, nombre: "Zapatilla Running Pro", precio: 119900, anterior: 149900, sub: "Deportivo",
    fotos: ["https://images.unsplash.com/photo-1542219550-37153d387c27?w=800&q=85", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=85"],
    talleD: "37", talleH: "46", desc: "Zapatilla running profesional con amortiguación premium." },
];

// ── MAIN ───────────────────────────────────────────────────
async function main() {
  console.log("🧹 Limpiando datos previos...");
  await supabase.from("productos").delete().neq("id", 0);
  await supabase.from("puesteros").delete().neq("id", 0);
  await supabase.from("categorias").delete().neq("id", 0);
  console.log("  ✅ DB vacía\n");

  console.log("📁 Insertando 4 categorías curadas...");
  const { data: catRows, error: catErr } = await supabase
    .from("categorias").insert(categorias).select();
  if (catErr) { console.error(catErr); process.exit(1); }
  console.log(`  ✅ ${catRows.length} categorías\n`);

  console.log("👥 Insertando 6 puesteros premium...");
  const { data: puestRows, error: puestErr } = await supabase
    .from("puesteros").insert(puesteros).select();
  if (puestErr) { console.error(puestErr); process.exit(1); }
  console.log(`  ✅ ${puestRows.length} puesteros\n`);

  console.log("📦 Insertando 20 productos curados...");
  const productos = productosBase.map((p) => ({
    puestero_id: puestRows[p.puestero].id,
    categoria_id: catRows[p.cat].id,
    nombre: p.nombre,
    imagenes: p.fotos,
    subcategoria: p.sub,
    precio_minorista: p.precio,
    precio_mayorista: Math.round(p.precio * 0.75),
    precio_anterior: p.anterior,
    talle_desde: p.talleD,
    talle_hasta: p.talleH,
    descripcion: p.desc,
    visible: true,
    fecha_carga: new Date().toISOString().split("T")[0],
  }));

  const { error: prodErr } = await supabase.from("productos").insert(productos);
  if (prodErr) { console.error(prodErr); process.exit(1); }
  console.log(`  ✅ ${productos.length} productos\n`);

  console.log("🎉 CURATED SEED COMPLETO:");
  console.log(`   📁 ${catRows.length} categorías`);
  console.log(`   👥 ${puestRows.length} puesteros`);
  console.log(`   📦 ${productos.length} productos premium`);
}

main().catch(console.error);
