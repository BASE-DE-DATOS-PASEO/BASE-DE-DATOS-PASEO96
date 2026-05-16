import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías",
  description:
    "Explorá todas las categorías de Paseo 96: ropa de mujer, hombre, niños, calzado, accesorios y más.",
  openGraph: {
    title: "Categorías | Paseo 96",
    description:
      "Explorá todas las categorías de Paseo 96: ropa de mujer, hombre, niños, calzado y más.",
  },
};

export default function CategoriasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
