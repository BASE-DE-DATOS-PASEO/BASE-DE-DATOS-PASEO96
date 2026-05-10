"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { seguridadPreSupabase } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { setSessionEmail } from "@/lib/pre-supabase-session";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const puesteros = useStore((s) => s.puesteros);
  const solicitudes = useStore((s) => s.solicitudes);
  const [email, setEmail] = useState("");
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
        console.error("[login] google", error);
        setLoginError("No se pudo iniciar sesión con Google. Probá de nuevo en unos segundos.");
        setLoadingGoogle(false);
      }
    } catch (err) {
      console.error("[login] google", err);
      setLoginError("Error inesperado al conectar con Google.");
      setLoadingGoogle(false);
    }
  }

  function resolverAcceso(rawEmail: string) {
    const normalized = rawEmail.trim().toLowerCase();
    if (normalized === seguridadPreSupabase.gmailAdmin) {
      setSessionEmail(normalized);
      window.location.href = "/admin";
      return;
    }

    const puesto = puesteros.find(
      (p) => p.gmailAcceso === normalized && p.estadoActividad === "activo"
    );

    if (puesto) {
      setSessionEmail(normalized);
      window.location.href = "/mi-puesto";
      return;
    }

    const solicitud = solicitudes.find((s) => s.gmailAcceso === normalized);
    if (solicitud) {
      setSessionEmail(normalized);
      window.location.href = "/mi-puesto";
      return;
    }

    setLoginError(
      "Ese Gmail no tiene una solicitud registrada ni un puesto aprobado."
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-tight">
                <span className="text-slate-800">PASEO</span>
                <span className="text-blue-600">&nbsp;96</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <h1 className="text-xl font-bold text-slate-800 text-center">
            Iniciá sesión
          </h1>
          <p className="text-sm text-slate-500 text-center mt-2 mb-8">
            Accedé a tu puesto para gestionar productos
          </p>

          {/* Google button */}
          <button
            onClick={loginConGoogle}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">o</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email / Password */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resolverAcceso(email);
            }}
            className="space-y-4"
          >
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError("");
                }}
                placeholder="tu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Contraseña"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-3 text-sm transition-all duration-200 shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              Iniciar sesión
            </button>
            {loginError && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {loginError}
              </p>
            )}
          </form>

          {/* Primera vez CTA */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-3">
              ¿Todavía no tenés puesto en Paseo 96?
            </p>
            <Link
              href="/planes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Ver planes y sumate
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Admin footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-400">
            ¿Sos administrador?{" "}
            <span className="text-slate-500 font-medium">
              Usá el Gmail admin configurado
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
