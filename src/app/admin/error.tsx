"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-5xl font-extrabold text-red-500">Error</p>
        <h1 className="mt-4 text-xl font-bold text-slate-800">Error en el panel</h1>
        <p className="mt-2 text-sm text-slate-500">Ocurrió un error al cargar esta sección del panel de administración.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={reset} className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Reintentar
          </button>
          <Link href="/admin" className="inline-flex rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Volver al panel
          </Link>
        </div>
      </div>
    </div>
  );
}
