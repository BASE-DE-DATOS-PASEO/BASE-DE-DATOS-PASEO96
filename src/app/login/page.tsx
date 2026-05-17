"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [loginError, setLoginError] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  async function loginConGoogle() {
    setLoadingGoogle(true);
    setLoginError("");
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) {
        setLoginError("No se pudo iniciar sesión con Google. Probá de nuevo en unos segundos.");
        setLoadingGoogle(false);
      }
    } catch {
      setLoginError("Error inesperado al conectar con Google.");
      setLoadingGoogle(false);
    }
  }

  return (
    <div className="min-h-screen v3-bg flex items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* Subtle decorative orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Top: back to home */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-[15px] font-extrabold tracking-[-0.02em] text-[#0A0A0A]"
          >
            PASEO <span className="text-[#3B82F6] ml-1">96</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-[#737373] hover:text-[#0A0A0A] transition-colors flex items-center gap-1"
          >
            Volver a la feria
            <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#0A0A0A]/06 rounded-3xl p-8 sm:p-10 shadow-[0_24px_60px_-20px_rgba(15,52,96,0.18),0_4px_8px_rgba(15,52,96,0.04)]">

          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
            <span className="w-5 h-px bg-[#3B82F6]" />
            Acceso
          </span>

          {/* Heading */}
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#0A0A0A] leading-tight">
            Iniciá sesión
          </h1>
          <p className="text-sm text-[#525252] mt-3 leading-relaxed">
            Accedé a tu puesto en Paseo 96 para cargar productos, ver
            estadísticas y gestionar tu plan.
          </p>

          {/* Google button */}
          <button
            onClick={loginConGoogle}
            disabled={loadingGoogle}
            className="mt-8 w-full flex items-center justify-center gap-3 bg-white border border-[#0A0A0A]/12 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-[#0A0A0A] hover:border-[#0A0A0A]/30 hover:bg-[#FAFAF7] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {loadingGoogle ? "Conectando..." : "Continuar con Google"}
          </button>

          {loginError && (
            <p role="alert" aria-live="polite" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-800">
              {loginError}
            </p>
          )}

          {/* Primera vez CTA */}
          <div className="mt-10 pt-6 border-t border-[#0A0A0A]/06 text-center">
            <p className="text-sm text-[#525252] mb-3">
              ¿Todavía no tenés puesto en Paseo 96?
            </p>
            <Link
              href="/planes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B82F6] hover:text-[#2F6EE0] transition-colors group"
            >
              Ver planes y sumate
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Admin footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A3A3A3]" />
          <p className="text-xs text-[#A3A3A3]">
            ¿Sos administrador?{" "}
            <span className="text-[#525252] font-semibold">
              Usá el Gmail admin configurado
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
