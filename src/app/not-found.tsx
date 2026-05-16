import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-7xl font-extrabold text-blue-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">
          Página no encontrada
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
