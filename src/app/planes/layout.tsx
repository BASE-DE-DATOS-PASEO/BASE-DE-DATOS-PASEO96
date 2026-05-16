import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes y precios",
  description:
    "Elegí tu plan en Paseo 96: Bronce, Plata u Oro. Publicá tus productos en la vidriera digital de la feria en La Plata.",
  openGraph: {
    title: "Planes y precios | Paseo 96",
    description:
      "Elegí tu plan en Paseo 96: Bronce, Plata u Oro. Publicá tus productos en la vidriera digital.",
  },
};

export default function PlanesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
