import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xrxphbbpjypytlmsnikr.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Categorías ──────────────────────────────────────────────
const categorias = [
  { nombre: "Mujer", imagen: "/categorias/CATEGORIAMUJER.jpg", subcategorias: ["Remeras", "Pantalones", "Vestidos", "Camperas", "Polleras"] },
  { nombre: "Hombre", imagen: "/categorias/CATEGORIAHOMBRE.jpg", subcategorias: ["Remeras", "Pantalones", "Buzos", "Camperas", "Bermudas"] },
  { nombre: "Calzado", imagen: "/categorias/CATEGORIACALZADO.jpg", subcategorias: ["Zapatillas", "Botas", "Sandalias", "Ojotas"] },
  { nombre: "Accesorios", imagen: "/categorias/CATEGORIAACCESORIOS.jpg", subcategorias: ["Carteras", "Cinturones", "Gorras", "Bijouterie"] },
  { nombre: "Niños", imagen: "/categorias/CATEGORIANIÑOS.jpg", subcategorias: ["Remeras", "Pantalones", "Conjuntos", "Camperas"] },
  { nombre: "Abrigo", imagen: "/categorias/CATEGORIAABRIGO.jpg", subcategorias: ["Camperas", "Buzos", "Sweaters", "Ponchos"] },
];

// ── Puesteros ficticios ─────────────────────────────────────
const puesteros = [
  { nombre_responsable: "Laura Gómez", nombre_comercial: "Moda Laura", fila: "A", numero_puesto: 1, telefono: "5492211234567", email: "laura.gomez.test@gmail.com", gmail_acceso: "laura.gomez.test@gmail.com", plan: "oro", color: "#1E40AF", logo_iniciales: "ML" },
  { nombre_responsable: "Carlos Martínez", nombre_comercial: "Urban Style", fila: "A", numero_puesto: 5, telefono: "5492211234568", email: "carlos.martinez.test@gmail.com", gmail_acceso: "carlos.martinez.test@gmail.com", plan: "plata", color: "#0F766E", logo_iniciales: "US" },
  { nombre_responsable: "Ana López", nombre_comercial: "Zapatería Express", fila: "B", numero_puesto: 3, telefono: "5492211234569", email: "ana.lopez.test@gmail.com", gmail_acceso: "ana.lopez.test@gmail.com", plan: "oro", color: "#9333EA", logo_iniciales: "ZE" },
  { nombre_responsable: "Diego Fernández", nombre_comercial: "DF Accesorios", fila: "B", numero_puesto: 7, telefono: "5492211234570", email: "diego.fernandez.test@gmail.com", gmail_acceso: "diego.fernandez.test@gmail.com", plan: "bronce", color: "#DC2626", logo_iniciales: "DF" },
  { nombre_responsable: "María Rodríguez", nombre_comercial: "Peques & Co", fila: "C", numero_puesto: 2, telefono: "5492211234571", email: "maria.rodriguez.test@gmail.com", gmail_acceso: "maria.rodriguez.test@gmail.com", plan: "plata", color: "#D97706", logo_iniciales: "PC" },
  { nombre_responsable: "Pablo Sánchez", nombre_comercial: "Abrigo Total", fila: "C", numero_puesto: 8, telefono: "5492211234572", email: "pablo.sanchez.test@gmail.com", gmail_acceso: "pablo.sanchez.test@gmail.com", plan: "oro", color: "#059669", logo_iniciales: "AT" },
  { nombre_responsable: "Lucía Herrera", nombre_comercial: "Tendencia Joven", fila: "D", numero_puesto: 4, telefono: "5492211234573", email: "lucia.herrera.test@gmail.com", gmail_acceso: "lucia.herrera.test@gmail.com", plan: "plata", color: "#DB2777", logo_iniciales: "TJ" },
  { nombre_responsable: "Martín Ruiz", nombre_comercial: "Ruiz Sport", fila: "D", numero_puesto: 10, telefono: "5492211234574", email: "martin.ruiz.test@gmail.com", gmail_acceso: "martin.ruiz.test@gmail.com", plan: "bronce", color: "#0E7490", logo_iniciales: "RS" },
  { nombre_responsable: "Sofía Torres", nombre_comercial: "Bella Moda", fila: "E", numero_puesto: 1, telefono: "5492211234575", email: "sofia.torres.test@gmail.com", gmail_acceso: "sofia.torres.test@gmail.com", plan: "oro", color: "#4338CA", logo_iniciales: "BM" },
  { nombre_responsable: "Nicolás Díaz", nombre_comercial: "Street Wear LP", fila: "E", numero_puesto: 6, telefono: "5492211234576", email: "nicolas.diaz.test@gmail.com", gmail_acceso: "nicolas.diaz.test@gmail.com", plan: "plata", color: "#374151", logo_iniciales: "SW" },
];

// ── Imágenes de Unsplash (públicas, sin API key) ────────────
const imgs = {
  mujer: [
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=600&fit=crop",
  ],
  hombre: [
    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&h=600&fit=crop",
  ],
  calzado: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop",
  ],
  accesorios: [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
  ],
  ninos: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=600&fit=crop",
  ],
  abrigo: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600&h=600&fit=crop",
  ],
};

const imgKeys = ["mujer", "hombre", "calzado", "accesorios", "ninos", "abrigo"];

// ── Productos (100) ─────────────────────────────────────────
const productNames = {
  mujer: [
    "Remera Oversize Blanca", "Jean Mom Celeste", "Vestido Floral Verano", "Campera Jean Clásica",
    "Top Crop Negro", "Pantalón Palazzo Beige", "Blazer Oversized Gris", "Remera Básica Pack x3",
    "Pollera Plisada Negra", "Body Manga Larga", "Calza Deportiva Premium", "Vestido Camisero Rayas",
    "Remera Estampada Vintage", "Jean Recto Negro", "Campera Bomber Rosa", "Cárdigan Largo Beige",
    "Short Jean Nevado", "Blusa Satinada Crema",
  ],
  hombre: [
    "Remera Lisa Algodón", "Jean Slim Oscuro", "Buzo Hoodie Negro", "Campera Puffer Azul",
    "Bermuda Cargo Verde", "Camisa Manga Corta", "Pantalón Jogger Gris", "Remera Estampada Urbana",
    "Jean Recto Clásico", "Buzo Canguro Bordo", "Campera Rompeviento", "Bermuda Jean Celeste",
    "Musculosa Deportiva", "Pantalón Chino Beige", "Chomba Polo Blanca", "Remera Térmica",
    "Campera Denim Vintage",
  ],
  calzado: [
    "Zapatilla Urbana Negra", "Bota Texana Marrón", "Sandalia Plataforma", "Ojota Slides",
    "Zapatilla Running Gris", "Borcego Cuero Negro", "Zapatilla Lona Blanca", "Mocasín Casual",
    "Zapatilla Chunky Beige", "Bota Chelsea Negra", "Sandalia Tiras Doradas", "Zapatilla Retro",
    "Zapato Oxford Marrón", "Zapatilla Skate", "Bota Lluvia", "Alpargata Clásica",
    "Zapatilla Plataforma",
  ],
  accesorios: [
    "Cartera Tote Negra", "Cinturón Cuero Marrón", "Gorra Trucker", "Collar Cadena Dorado",
    "Riñonera Deportiva", "Mochila Urbana Gris", "Pulsera Acero", "Lentes Sol Oversized",
    "Billetera Cuero", "Bandolera Mini Rosa", "Aros Argolla Grande", "Gorro Beanie Negro",
    "Bolso Viaje Lona", "Pañuelo Estampado", "Reloj Digital Sport", "Anillo Sello",
  ],
  ninos: [
    "Remera Dinosaurio", "Jean Elastizado Niña", "Conjunto Deportivo", "Campera Polar",
    "Vestido Unicornio", "Buzo Estampado", "Short Playa", "Remera Superhéroe",
    "Pantalón Jogger Kids", "Campera Impermeable", "Conjunto Invierno", "Body Bebé Pack x5",
    "Pijama Algodón", "Zapatilla Niño LED", "Vestido Fiesta", "Buzo Canguro Niña",
  ],
  abrigo: [
    "Campera Puffer Larga", "Buzo Polar Sherpa", "Sweater Lana Oversize", "Poncho Artesanal",
    "Campera Cuero Eco", "Buzo Canguro Algodón", "Chaleco Inflable", "Tapado Largo Paño",
    "Campera Softshell", "Buzo Hoodie Crop", "Sweater Cuello Alto", "Campera Denim Forrada",
    "Poncho Mapuche", "Chaleco Polar", "Parka Impermeable", "Buzo Oversize Fleece",
    "Campera Inflable Ultra",
  ],
};

const talles = [
  { desde: "S", hasta: "XL" },
  { desde: "36", hasta: "44" },
  { desde: "38", hasta: "46" },
  { desde: "XS", hasta: "XXL" },
  { desde: "1", hasta: "14" },
  { desde: "35", hasta: "45" },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function seed() {
  console.log("🌱 Insertando categorías...");
  const { data: catRows, error: catErr } = await supabase
    .from("categorias")
    .upsert(categorias, { onConflict: "nombre" })
    .select();
  if (catErr) {
    console.log("  Categorías ya existen, obteniendo...");
    const { data: existing } = await supabase.from("categorias").select("*");
    if (!existing?.length) {
      const { data: inserted, error: insErr } = await supabase.from("categorias").insert(categorias).select();
      if (insErr) { console.error("  Error categorías:", insErr.message); return; }
      var catFinal = inserted;
    } else {
      var catFinal = existing;
    }
  } else {
    var catFinal = catRows;
  }
  console.log(`  ✅ ${catFinal.length} categorías`);

  const catMap = {};
  catFinal.forEach(c => {
    const key = c.nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    catMap[key] = c.id;
  });

  console.log("👥 Insertando puesteros ficticios...");
  const pRows = puesteros.map(p => ({
    ...p,
    acepta_transferencia: Math.random() > 0.3,
    acepta_cambios: Math.random() > 0.4,
    realiza_envios: Math.random() > 0.5,
    limite_productos: p.plan === "oro" ? 20 : p.plan === "plata" ? 10 : 4,
    productos_activos: 0,
    estado_pago: "pagado",
    estado_actividad: "activo",
    fecha_alta: "2025-01-15",
    fecha_proximo_cobro: "2026-06-15",
    observaciones: "Puestero de prueba",
    logo_url: "",
  }));

  const { data: puesteroRows, error: pErr } = await supabase
    .from("puesteros")
    .insert(pRows)
    .select();
  if (pErr) { console.error("  Error puesteros:", pErr.message); return; }
  console.log(`  ✅ ${puesteroRows.length} puesteros`);

  console.log("📦 Generando 100 productos...");
  const catNames = ["mujer", "hombre", "calzado", "accesorios", "ninos", "abrigo"];
  const productos = [];
  let count = 0;

  while (count < 100) {
    for (const catName of catNames) {
      if (count >= 100) break;
      const names = productNames[catName];
      const catImgs = imgs[catName];
      const catKey = catName === "ninos" ? "ninos" : catName;
      const catId = catMap[catKey] || catMap[catName] || catFinal[0]?.id;

      const subcats = categorias.find(c =>
        c.nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") === catName
      )?.subcategorias || [];

      const name = names[count % names.length];
      const puestero = puesteroRows[count % puesteroRows.length];
      const numImgs = rand(1, 3);
      const imgArr = [];
      for (let i = 0; i < numImgs; i++) {
        imgArr.push(catImgs[(count + i) % catImgs.length]);
      }

      const precio = rand(8, 90) * 1000;
      const talle = pick(talles);

      productos.push({
        puestero_id: puestero.id,
        categoria_id: catId,
        nombre: name,
        imagenes: imgArr,
        subcategoria: pick(subcats) || "",
        precio_minorista: precio,
        precio_mayorista: Math.random() > 0.5 ? Math.round(precio * 0.7) : null,
        precio_anterior: Math.random() > 0.6 ? Math.round(precio * 1.3) : null,
        talle_desde: talle.desde,
        talle_hasta: talle.hasta,
        descripcion: `Producto de prueba para ${catName}. Excelente calidad, material premium.`,
        visible: true,
        fecha_carga: "2026-05-16",
      });
      count++;
    }
  }

  // Insertar en batches de 25
  for (let i = 0; i < productos.length; i += 25) {
    const batch = productos.slice(i, i + 25);
    const { error: prodErr } = await supabase.from("productos").insert(batch);
    if (prodErr) {
      console.error(`  Error batch ${i / 25 + 1}:`, prodErr.message);
    } else {
      console.log(`  ✅ Batch ${i / 25 + 1}: ${batch.length} productos insertados`);
    }
  }

  console.log("\n🎉 Seed completo: 6 categorías, 10 puesteros, 100 productos");
}

seed().catch(console.error);
