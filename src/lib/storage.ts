import { supabase } from "@/lib/supabase";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function extensionFor(file: File) {
  const byMime = EXT_BY_MIME[file.type];
  if (byMime) return byMime;
  return file.name.split(".").pop()?.toLowerCase() || "bin";
}

function createStoragePath(folder: string, file: File) {
  const safeFolder = normalizeName(folder) || "uploads";
  const safeName = normalizeName(file.name.replace(/\.[^.]+$/, "")) || "archivo";
  const stamp = new Date().toISOString().slice(0, 10);
  const random = crypto.randomUUID();
  return `${safeFolder}/${stamp}-${random}-${safeName}.${extensionFor(file)}`;
}

export async function uploadProductoImage(file: File, folder: string) {
  const path = createStoragePath(folder, file);
  const { error } = await supabase.storage.from("productos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("productos").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadComprobante(file: File, folder: string) {
  const path = createStoragePath(folder, file);
  const { error } = await supabase.storage.from("comprobantes").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;
  return path;
}

export async function createComprobanteSignedUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("comprobantes")
    .createSignedUrl(path, 60 * 10);

  if (error) throw error;
  return data.signedUrl;
}
