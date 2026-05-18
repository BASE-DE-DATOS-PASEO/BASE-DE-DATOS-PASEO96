import { createClient } from "@supabase/supabase-js";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(
  "https://xrxphbbpjypytlmsnikr.supabase.co",
  SERVICE_KEY
);

// ── 30 CATEGORÍAS con imágenes reales ───────────────────────
const categorias = [
  { nombre: "Mujer", imagen: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600", subcategorias: ["Jeans", "Pantalones", "Remeras", "Vestidos", "Camperas"] },
  { nombre: "Hombre", imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600", subcategorias: ["Jeans", "Camisas", "Remeras", "Buzos", "Camperas"] },
  { nombre: "Niños", imagen: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600", subcategorias: ["Remeras", "Pantalones", "Buzos", "Vestidos", "Camperas"] },
  { nombre: "Calzado", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", subcategorias: ["Zapatillas", "Botas", "Sandalias", "Mocasines", "Deportivo"] },
  { nombre: "Deportiva", imagen: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600", subcategorias: ["Running", "Fitness", "Fútbol", "Natación", "Yoga"] },
  { nombre: "Accesorios", imagen: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600", subcategorias: ["Carteras", "Cinturones", "Relojes", "Lentes", "Gorras"] },
  { nombre: "Abrigos", imagen: "https://images.unsplash.com/photo-1544923246-77307dd270b5?w=600", subcategorias: ["Camperas", "Tapados", "Buzos", "Chalecos", "Pilotos"] },
  { nombre: "Lencería", imagen: "https://images.unsplash.com/photo-1617331140180-e8262094733a?w=600", subcategorias: ["Conjuntos", "Corpiños", "Bombachas", "Pijamas", "Medias"] },
  { nombre: "Jeans", imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600", subcategorias: ["Skinny", "Mom", "Wide Leg", "Boyfriend", "Recto"] },
  { nombre: "Bebés", imagen: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600", subcategorias: ["Bodies", "Enteritos", "Conjuntos", "Accesorios", "Calzado"] },
  { nombre: "Talles Especiales", imagen: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600", subcategorias: ["Remeras XL", "Pantalones XL", "Vestidos XL", "Camperas XL", "Buzos XL"] },
  { nombre: "Trajes", imagen: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600", subcategorias: ["Sacos", "Pantalones", "Chalecos", "Camisas", "Corbatas"] },
  { nombre: "Marroquinería", imagen: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", subcategorias: ["Mochilas", "Billeteras", "Carteras", "Bolsos", "Riñoneras"] },
  { nombre: "Perfumería", imagen: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600", subcategorias: ["Perfumes", "Colonias", "Body Splash", "Sets regalo", "Miniaturas"] },
  { nombre: "Cosméticos", imagen: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600", subcategorias: ["Maquillaje", "Skincare", "Labiales", "Sombras", "Bases"] },
  { nombre: "Electrónica", imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600", subcategorias: ["Auriculares", "Parlantes", "Cargadores", "Cables", "Fundas"] },
  { nombre: "Juguetes", imagen: "https://images.unsplash.com/photo-1558060318-c7b4e15e5e60?w=600", subcategorias: ["Peluches", "Didácticos", "Muñecas", "Autos", "Juegos mesa"] },
  { nombre: "Blanquería", imagen: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600", subcategorias: ["Sábanas", "Acolchados", "Almohadas", "Toallas", "Cortinas"] },
  { nombre: "Bazar", imagen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600", subcategorias: ["Tazas", "Vasos", "Platos", "Cubiertos", "Termos"] },
  { nombre: "Mascotas", imagen: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600", subcategorias: ["Ropa", "Correas", "Comederos", "Juguetes", "Camas"] },
  { nombre: "Hogar", imagen: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600", subcategorias: ["Decoración", "Organización", "Iluminación", "Alfombras", "Cuadros"] },
  { nombre: "Verano", imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", subcategorias: ["Mallas", "Ojotas", "Bermudas", "Musculosas", "Bikinis"] },
  { nombre: "Invierno", imagen: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=600", subcategorias: ["Bufandas", "Gorros", "Guantes", "Camperas", "Botas"] },
  { nombre: "Fitness", imagen: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600", subcategorias: ["Calzas", "Tops", "Shorts", "Zapatillas", "Accesorios"] },
  { nombre: "Casual", imagen: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600", subcategorias: ["Remeras", "Joggers", "Hoodies", "Sneakers", "Gorras"] },
  { nombre: "Elegante", imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600", subcategorias: ["Vestidos", "Camisas", "Blazers", "Zapatos", "Accesorios"] },
  { nombre: "Escolar", imagen: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", subcategorias: ["Guardapolvos", "Mochilas", "Útiles", "Zapatillas", "Uniformes"] },
  { nombre: "Outdoor", imagen: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600", subcategorias: ["Camperas", "Botas", "Mochilas", "Gorros", "Pantalones"] },
  { nombre: "Denim", imagen: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600", subcategorias: ["Camperas", "Jeans", "Polleras", "Shorts", "Camisas"] },
  { nombre: "Ofertas", imagen: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600", subcategorias: ["Liquidación", "2x1", "Outlet", "Últimos talles", "Temporada pasada"] },
];

// ── 30 PUESTEROS ficticios ──────────────────────────────────
const puesteros = [];
const nombres = [
  ["Laura", "Gómez"], ["Carlos", "Martínez"], ["Sofía", "Rodríguez"],
  ["Diego", "López"], ["Valentina", "Fernández"], ["Matías", "García"],
  ["Camila", "Sánchez"], ["Facundo", "Díaz"], ["Luciana", "Torres"],
  ["Nicolás", "Ramírez"], ["Florencia", "Herrera"], ["Santiago", "Moreno"],
  ["Agustina", "Romero"], ["Lucas", "Álvarez"], ["Julieta", "Gutiérrez"],
  ["Tomás", "Castro"], ["Martina", "Ríos"], ["Joaquín", "Medina"],
  ["Pilar", "Acosta"], ["Federico", "Peralta"], ["Renata", "Suárez"],
  ["Gonzalo", "Molina"], ["Catalina", "Vega"], ["Bruno", "Ortiz"],
  ["Milagros", "Silva"], ["Ignacio", "Navarro"], ["Abril", "Domínguez"],
  ["Ramiro", "Sosa"], ["Celeste", "Aguirre"], ["Ezequiel", "Cabrera"],
];
const comerciales = [
  "Fashion House", "Urban Trends", "Estilo Sur", "Moda Gaucha", "Ropa Linda",
  "La Boutique", "Trendy Shop", "Outlet 96", "Style Box", "Look Premium",
  "Vestir Bien", "Moda Express", "Top Fashion", "Elegance BA", "Street Wear",
  "Casual Zone", "Denim World", "Sport Life", "Kids Paradise", "Baby Store",
  "Accesorios Ya", "Perfume House", "Tech Store", "Juguetería Fun", "Blanq & Hogar",
  "Pet Lovers", "Bazar Total", "Cosméticos HD", "Calzados Pro", "Ofertas 96",
];
const colores = [
  "#e11d48", "#db2777", "#c026d3", "#9333ea", "#7c3aed",
  "#4f46e5", "#2563eb", "#0284c7", "#0891b2", "#0d9488",
  "#059669", "#16a34a", "#65a30d", "#ca8a04", "#d97706",
  "#ea580c", "#dc2626", "#64748b", "#475569", "#334155",
  "#f43f5e", "#a855f7", "#6366f1", "#3b82f6", "#06b6d4",
  "#14b8a6", "#22c55e", "#eab308", "#f97316", "#ef4444",
];
const filas = ["A", "B", "C", "D", "E", "F", "G", "H"];

for (let i = 0; i < 30; i++) {
  const [nombre, apellido] = nombres[i];
  const slug = `${nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}.${apellido.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`;
  puesteros.push({
    nombre_responsable: `${nombre} ${apellido}`,
    nombre_comercial: comerciales[i],
    fila: filas[i % filas.length],
    numero_puesto: i + 1,
    telefono: `+5491155${String(100000 + i).slice(-6)}`,
    email: `${slug}.test@gmail.com`,
    gmail_acceso: `${slug}.test@gmail.com`,
    acepta_transferencia: Math.random() > 0.3,
    acepta_cambios: Math.random() > 0.4,
    realiza_envios: Math.random() > 0.5,
    plan: ["bronce", "plata", "oro"][i % 3],
    limite_productos: [4, 10, 20][i % 3],
    productos_activos: 0,
    estado_pago: Math.random() > 0.2 ? "pagado" : "pendiente",
    estado_actividad: "activo",
    fecha_alta: "2025-01-15",
    fecha_proximo_cobro: "2025-07-01",
    observaciones: "",
    color: colores[i],
    logo_iniciales: `${nombre[0]}${apellido[0]}`,
  });
}

// ── 300 PRODUCTOS ───────────────────────────────────────────
// Pool de imágenes variadas por tipo de producto
const imagePool = {
  ropa: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400",
    "https://images.unsplash.com/photo-1434389677669-e08b4cda3e24?w=400",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400",
  ],
  calzado: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
  ],
  accesorios: [
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400",
  ],
  hogar: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400",
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
  ],
};

const productNames = {
  ropa: [
    "Remera Algodón Premium", "Pantalón Cargo Urbano", "Campera Puffer Liviana",
    "Buzo Oversize Unisex", "Vestido Midi Floral", "Jean Mom Tiro Alto",
    "Camisa Lino Verano", "Short Deportivo Dry-Fit", "Jogger Frisa Invierno",
    "Blazer Entallado", "Pollera Tableada", "Top Crop Algodón",
    "Hoodie Canguro Classic", "Chaleco Acolchado", "Piloto Impermeable",
    "Calza Deportiva Mujer", "Bermuda Gabardina", "Camiseta Térmica",
    "Tapado Largo Paño", "Enterito Jean", "Musculosa Básica",
    "Pantalón Palazzo", "Sweater Tejido Grueso", "Cardigan Largo",
    "Camisa Franela Leñador", "Jean Skinny Negro", "Jumpsuit Casual",
    "Conjunto Deportivo", "Kimono Estampado", "Trench Coat Clásico",
  ],
  calzado: [
    "Zapatilla Running Pro", "Bota Cuero Texana", "Sandalia Plataforma",
    "Mocasín Gamuza", "Zapatilla Urbana Retro", "Borcego Industrial",
    "Ojota Ergonómica", "Zapato Oxford Cuero", "Zapatilla Skate",
    "Bota Lluvia",
  ],
  accesorios: [
    "Mochila Urbana 25L", "Billetera Cuero RFID", "Riñonera Deportiva",
    "Reloj Analógico Classic", "Lentes Sol Polarizados", "Gorra Trucker",
    "Cinturón Cuero Liso", "Bufanda Lana Merino", "Bolso Tote Canvas",
    "Paraguas Automático",
  ],
  hogar: [
    "Juego Sábanas 200 Hilos", "Acolchado Microfibra", "Set Toallas x6",
    "Cortina Blackout", "Alfombra Pelo Largo", "Taza Cerámica Arte",
    "Termo Stanley 1L", "Set Cubiertos x24", "Organizador Tela",
    "Velador LED Moderno",
  ],
  tech: [
    "Auricular Bluetooth TWS", "Parlante Portátil 10W", "Cargador Inalámbrico",
    "Cable USB-C Reforzado", "Funda Silicona Premium", "Power Bank 10000mAh",
    "Smart Watch Deportivo", "Aro de Luz 26cm", "Trípode Celular",
    "Adaptador USB Hub",
  ],
};

const talles = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40", "42"];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function pickImages(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ── MAIN ────────────────────────────────────────────────────
async function main() {
  console.log("🧹 Limpiando datos previos...");
  await supabase.from("productos").delete().neq("id", 0);
  await supabase.from("puesteros").delete().neq("id", 0);
  await supabase.from("categorias").delete().neq("id", 0);
  console.log("  ✅ Limpio\n");

  // 1. Categorías
  console.log("📁 Insertando 30 categorías...");
  const { data: catRows, error: catErr } = await supabase
    .from("categorias")
    .insert(categorias)
    .select();
  if (catErr) { console.error("  Error:", catErr.message); process.exit(1); }
  console.log(`  ✅ ${catRows.length} categorías\n`);

  // 2. Puesteros
  console.log("👥 Insertando 30 puesteros...");
  const { data: puestRows, error: puestErr } = await supabase
    .from("puesteros")
    .insert(puesteros)
    .select();
  if (puestErr) { console.error("  Error:", puestErr.message); process.exit(1); }
  console.log(`  ✅ ${puestRows.length} puesteros\n`);

  // 3. 3000 Productos
  console.log("📦 Generando 3000 productos...");
  const productos = [];
  const types = Object.keys(productNames);

  for (let i = 0; i < 3000; i++) {
    const puestero = puestRows[i % puestRows.length];
    const cat = catRows[i % catRows.length];
    const subcat = pick(cat.subcategorias);

    // Decide image pool based on category
    let imgType = "ropa";
    const catName = cat.nombre.toLowerCase();
    if (catName.includes("calzado") || catName.includes("fitness")) imgType = "calzado";
    else if (catName.includes("accesorio") || catName.includes("marroquin") || catName.includes("perfum")) imgType = "accesorios";
    else if (catName.includes("hogar") || catName.includes("bazar") || catName.includes("blanq")) imgType = "hogar";
    else if (catName.includes("electr") || catName.includes("tech")) imgType = "tech";

    const namePool = productNames[imgType];
    const baseName = namePool[i % namePool.length];
    const suffix = i >= namePool.length ? ` V${Math.floor(i / namePool.length) + 1}` : "";

    const precioMin = rand(5000, 95000);
    const precioMay = Math.random() > 0.4 ? Math.round(precioMin * 0.75) : null;
    const precioAnt = Math.random() > 0.6 ? Math.round(precioMin * 1.25) : null;

    const tDesde = rand(0, talles.length - 3);
    const tHasta = rand(tDesde + 1, talles.length - 1);

    productos.push({
      puestero_id: puestero.id,
      categoria_id: cat.id,
      nombre: `${baseName}${suffix}`,
      imagenes: pickImages(imagePool[imgType], rand(1, 4)),
      subcategoria: subcat,
      precio_minorista: precioMin,
      precio_mayorista: precioMay,
      precio_anterior: precioAnt,
      talle_desde: talles[tDesde],
      talle_hasta: talles[tHasta],
      descripcion: `Producto de prueba para test de carga. Categoría: ${cat.nombre}. Alta calidad, envío a todo el país.`,
      visible: Math.random() > 0.1,
      fecha_carga: new Date(Date.now() - rand(0, 90) * 86400000).toISOString().split("T")[0],
    });
  }

  // Insert in batches of 50
  const BATCH = 50;
  let inserted = 0;
  for (let b = 0; b < productos.length; b += BATCH) {
    const batch = productos.slice(b, b + BATCH);
    const { error } = await supabase.from("productos").insert(batch);
    if (error) {
      console.error(`  Error batch ${b / BATCH + 1}:`, error.message);
      process.exit(1);
    }
    inserted += batch.length;
    console.log(`  ✅ Batch ${b / BATCH + 1}: ${batch.length} productos (total: ${inserted})`);
  }

  console.log(`\n🎉 LOAD TEST 3K COMPLETO:`);
  console.log(`   📁 ${catRows.length} categorías`);
  console.log(`   👥 ${puestRows.length} puesteros`);
  console.log(`   📦 ${inserted} productos`);
}

main().catch(console.error);
