"use client";

import Image from "next/image";

// ==========================================
// LocalLogo — círculo con foto si hay, si no iniciales coloreadas
// ==========================================

interface LocalLogoProps {
  logoUrl?: string;
  iniciales: string;
  color: string;
  size?: number;        // px
  className?: string;
  textSize?: string;    // tailwind class (ej "text-base")
}

export default function LocalLogo({
  logoUrl,
  iniciales,
  color,
  size = 40,
  className = "",
  textSize,
}: LocalLogoProps) {
  const sty: React.CSSProperties = { width: size, height: size };

  if (logoUrl) {
    return (
      <div
        className={`relative rounded-full overflow-hidden bg-gray-100 shrink-0 ${className}`}
        style={sty}
      >
        <Image
          src={logoUrl}
          alt={iniciales}
          fill
          sizes={`${size}px`}
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  // Fallback: iniciales con color de marca
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold shrink-0 ${textSize ?? ""} ${className}`}
      style={{ ...sty, backgroundColor: color }}
    >
      {iniciales}
    </div>
  );
}
