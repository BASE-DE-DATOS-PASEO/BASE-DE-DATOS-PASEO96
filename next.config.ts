import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fija el root del workspace para evitar que Turbopack tome un lockfile ajeno de ~/
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Imágenes externas del mock (Unsplash) + futura integración con Supabase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
    // Sirve AVIF/WebP con fallback automático — ahorro real de bytes.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
