// Limpia toda la data para entregar la web vacía al cliente.
// Solo deja las 4 categorías base (sin fotos).
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

const CATEGORIAS_BASE = [
  {
    nombre: "Mujer",
    imagen: "",
    subcategorias: ["Jeans", "Pantalones", "Remeras", "Vestidos", "Camperas"],
  },
  {
    nombre: "Hombre",
    imagen: "",
    subcategorias: ["Jeans", "Camisas", "Remeras", "Buzos", "Camperas"],
  },
  {
    nombre: "Niños",
    imagen: "",
    subcategorias: ["Remeras", "Pantalones", "Buzos", "Vestidos", "Camperas"],
  },
  {
    nombre: "Calzado",
    imagen: "",
    subcategorias: ["Zapatillas", "Botas", "Sandalias", "Mocasines", "Deportivo"],
  },
];

async function main() {
  console.log("🧹 Limpiando datos para lanzamiento…\n");

  console.log("  ▸ Borrando productos…");
  await supabase.from("productos").delete().neq("id", 0);

  console.log("  ▸ Borrando puesteros…");
  await supabase.from("puesteros").delete().neq("id", 0);

  console.log("  ▸ Borrando solicitudes (historial de emails)…");
  await supabase.from("solicitudes").delete().neq("id", 0);

  console.log("  ▸ Borrando egresos…");
  await supabase.from("egresos").delete().neq("id", 0);

  console.log("  ▸ Borrando categorías existentes…");
  await supabase.from("categorias").delete().neq("id", 0);

  console.log("\n📁 Insertando 4 categorías base (sin fotos)…");
  const { data: catRows, error: catErr } = await supabase
    .from("categorias")
    .insert(CATEGORIAS_BASE)
    .select();
  if (catErr) {
    console.error("  Error:", catErr.message);
    process.exit(1);
  }
  console.log(`  ✅ ${catRows.length} categorías\n`);

  console.log("🎉 DB LIMPIA para producción:");
  console.log("   📁 4 categorías (Mujer, Hombre, Niños, Calzado) — sin fotos");
  console.log("   👥 0 puesteros");
  console.log("   📦 0 productos");
  console.log("   📋 0 solicitudes (historial de emails vacío)");
  console.log("");
  console.log("   El home pública sigue mostrando el mosaico del hero");
  console.log("   con fotos hardcodeadas (no depende de la DB).");
}

main().catch(console.error);
