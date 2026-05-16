"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Camera } from "lucide-react";
import { uploadProductoImage } from "@/lib/storage";

// ==========================================
// PhotoUploader — sube una sola foto a Supabase Storage
// ==========================================
// Uso:
//   <PhotoUploader value={url} onChange={setUrl} folder="categorias" />
// El componente maneja: file picker, preview, upload, errores.
// Devuelve la URL pública vía onChange().

interface PhotoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;          // ej "categorias" o "productos/martin"
  label?: string;
  className?: string;
}

export function PhotoUploader({ value, onChange, folder, label, className }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const url = await uploadProductoImage(file, folder);
      onChange(url);
    } catch (err) {
      console.error("[PhotoUploader] upload failed", err);
      setError("No se pudo subir. Probá otra foto.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-muted mb-2">{label}</label>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {value ? (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
          <Image src={value} alt="preview" fill sizes="400px" className="object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            aria-label="Quitar foto"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full bg-white/90 text-xs font-medium text-gray-800 border border-gray-200 hover:bg-white shadow-sm"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Subiendo…</span>
            </>
          ) : (
            <>
              <Camera className="w-7 h-7" />
              <span className="text-sm font-medium">Tocá para subir foto</span>
              <span className="text-xs text-gray-400">JPG, PNG o WEBP · máx 10 MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}

// ==========================================
// PhotosUploader — sube hasta `max` fotos
// ==========================================

interface PhotosUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  max?: number;
  label?: string;
}

export function PhotosUploader({ values, onChange, folder, max = 5, label }: PhotosUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const fotos = values.filter((u) => u && u.trim());
  const slotsLibres = Math.max(0, max - fotos.length);

  async function handleFiles(files: FileList) {
    const arr = Array.from(files).slice(0, slotsLibres);
    if (arr.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const urls = await Promise.all(arr.map((f) => uploadProductoImage(f, folder)));
      onChange([...fotos, ...urls]);
    } catch (err) {
      console.error("[PhotosUploader] upload failed", err);
      setError("No se pudieron subir todas las fotos. Probá de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(idx: number) {
    onChange(fotos.filter((_, i) => i !== idx));
  }

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted">{label}</label>
          <span className="text-xs text-muted">{fotos.length} / {max}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
        }}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {fotos.map((url, i) => (
          <div key={url + i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200 group">
            <Image src={url} alt={`foto ${i + 1}`} fill sizes="120px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              aria-label="Quitar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
                Portada
              </span>
            )}
          </div>
        ))}

        {slotsLibres > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-[11px] font-medium mt-1">Agregar</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      {fotos.length === 0 && <p className="text-xs text-gray-400 mt-2 text-center">Subí hasta {max} fotos. La primera será la portada.</p>}
    </div>
  );
}
