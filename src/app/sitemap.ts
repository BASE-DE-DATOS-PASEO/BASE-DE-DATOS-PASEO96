import type { MetadataRoute } from "next";
import { initialCategorias } from "@/lib/mock-data";
import { slugify } from "@/lib/data-bridge";

const BASE_URL = "https://paseo96.com";

// El sitemap se re-genera en cada deploy. Si Supabase está configurado,
// incluimos todos los puesteros y categorías reales. Si no, devolvemos
// al menos las categorías base + las páginas estáticas.
type PuesteroPublicoRow = {
  id: number;
  estado_actividad?: string;
};

async function fetchPuesteroIds(): Promise<number[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return [];

  try {
    const res = await fetch(
      `${url}/rest/v1/puesteros_publicos?select=id,estado_actividad`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        // Sin caché agresiva — el sitemap se construye en build,
        // pero igual queremos datos frescos si se regenera bajo demanda.
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as PuesteroPublicoRow[];
    return data
      .filter((p) => !p.estado_actividad || p.estado_actividad === "activo")
      .map((p) => p.id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/categorias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/planes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Categorías — usamos las base como fallback. Slugify garantiza que
  // generamos las mismas URLs que usan los componentes públicos.
  const categoriasEntries: MetadataRoute.Sitemap = initialCategorias.map(
    (cat) => ({
      url: `${BASE_URL}/categorias/${slugify(cat.nombre)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  // Puesteros — desde la vista pública de Supabase.
  const puesteroIds = await fetchPuesteroIds();
  const puesterosEntries: MetadataRoute.Sitemap = puesteroIds.map((id) => ({
    url: `${BASE_URL}/puesto/l${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoriasEntries, ...puesterosEntries];
}
