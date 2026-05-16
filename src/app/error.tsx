"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Paseo96 Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-5xl font-extrabold text-red-500">Error</p>
        <h1 className="mt-4 text-xl font-bold text-slate-800">Algo salió mal</h1>
        <p className="mt-2 text-sm text-slate-500">Ocurrió un error inesperado. Intentá de nuevo.</p>
        <button onClick={reset} className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
