import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Puesto no encontrado",
  description:
    "El puesto que estás buscando no existe o ya no está disponible en Paseo 96.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://paseo96.com" },
};

export default function PuestoNotFound() {
  return (
    <div className="public-layout min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <p className="text-6xl font-extrabold text-blue-600">404</p>
          <h1 className="mt-4 text-2xl font-bold text-slate-800">
            Puesto no encontrado
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            El puesto que estás buscando no existe, fue dado de baja o ya no
            está disponible en Paseo 96.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              href="/categorias"
              className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Ver todos los puestos
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
