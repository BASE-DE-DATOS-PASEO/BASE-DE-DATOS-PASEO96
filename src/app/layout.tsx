import type { Metadata } from "next";
import "./globals.css";
import StoreInit from "@/components/StoreInit";

export const metadata: Metadata = {
  title: "Paseo 96 — Tu vidriera digital en la feria",
  description: "Descubrí todos los locales y productos de Paseo 96. Ropa, calzado, accesorios y más. Contactá directo al vendedor por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreInit />
        {children}
      </body>
    </html>
  );
}
