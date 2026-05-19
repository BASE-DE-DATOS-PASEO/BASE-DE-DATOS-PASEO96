import { ImageResponse } from "next/og";

// Next.js renderiza esta función a /opengraph-image (PNG 1200x630) en build.
// Sirve como og:image por defecto para todas las páginas que heredan del root.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Paseo 96 — Feria en La Plata";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            borderRadius: 32,
            background: "rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.25)",
            fontSize: 84,
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          96
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textAlign: "center",
          }}
        >
          Paseo 96
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
            marginTop: 18,
            textAlign: "center",
          }}
        >
          Tu vidriera digital en la feria
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            marginTop: 38,
            textAlign: "center",
          }}
        >
          Ropa, calzado y accesorios en La Plata
        </div>
      </div>
    ),
    { ...size }
  );
}
