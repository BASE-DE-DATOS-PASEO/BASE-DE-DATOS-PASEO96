"use client";

import { useEffect } from "react";

export default function MiPuestoError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Mi-Puesto Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-md text-center">
        <p className="text-4xl font-extrabold text-amber-500">Ups</p>
        <h1 className="mt-3 text-lg font-bold text-slate-800">Error al cargar tu puesto</h1>
        <p className="mt-2 text-sm text-slate-500">Probá recargando la página.</p>
        <button onClick={reset} className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          Reintentar
        </button>
      </div>
    </div>
  );
}
