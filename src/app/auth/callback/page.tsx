"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { setSessionEmail } from "@/lib/pre-supabase-session";
import { seguridadPreSupabase } from "@/lib/mock-data";
import { puesterosRepo, solicitudesRepo } from "@/lib/db";

// ==========================================
// Auth callback — recibe el retorno de Google OAuth
// ==========================================
// Cuando Google redirige acá, Supabase ya guardó la sesión.
// Leemos el email del user, lo seteamos en el store local y
// decidimos a dónde mandarlo (admin / mi-puesto / login).
// ==========================================

export default function AuthCallbackPage() {
  const [mensaje, setMensaje] = useState("Iniciando sesión…");

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      // Pequeña espera para que Supabase termine de procesar el #access_token
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session) {
        // No hay sesión → algo falló
        setMensaje("No se pudo iniciar sesión. Volvé a probar.");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
        return;
      }

      const email = (session.user.email ?? "").trim().toLowerCase();
      if (!email) {
        setMensaje("Tu cuenta de Google no tiene email visible. Probá con otra.");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
        return;
      }

      // Guardamos sesión local (compatibilidad con el flow existente)
      setSessionEmail(email);

      // Admin?
      if (email === seguridadPreSupabase.gmailAdmin.toLowerCase()) {
        window.location.href = "/admin";
        return;
      }

      // Puestero existente?
      try {
        const puesteros = await puesterosRepo.list();
        const tienePuesto = puesteros.find((p) => p.gmailAcceso.toLowerCase() === email);
        if (tienePuesto) {
          window.location.href = "/mi-puesto";
          return;
        }

        // Solicitud pendiente?
        const solicitudes = await solicitudesRepo.list();
        const tieneSolicitud = solicitudes.find((s) => s.gmailAcceso.toLowerCase() === email);
        if (tieneSolicitud) {
          window.location.href = "/mi-puesto";
          return;
        }
      } catch (err) {
        console.error("[callback] lookup", err);
      }

      // No tiene nada → mandamos a planes para que se anote
      setMensaje("Todavía no tenés puesto. Te llevamos a los planes.");
      setTimeout(() => { window.location.href = "/planes"; }, 1500);
    }

    resolve();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-sm text-slate-600">{mensaje}</p>
      </div>
    </div>
  );
}
