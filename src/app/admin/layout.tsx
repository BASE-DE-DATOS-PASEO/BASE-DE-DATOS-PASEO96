"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import { seguridadPreSupabase } from "@/lib/mock-data";
import { useSessionEmail } from "@/lib/pre-supabase-session";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const sessionEmail = useSessionEmail();
  const isAdmin = sessionEmail === seguridadPreSupabase.gmailAdmin;

  if (!isAdmin) {
    return (
      <div className="admin-layout min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-border p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-foreground">Acceso restringido</h1>
          <p className="text-sm text-muted mt-2">
            El panel de administración solo queda disponible para el Gmail admin configurado.
            Esta compuerta se reemplaza por Supabase Auth y políticas de rol.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main
        className={`sidebar-transition min-h-screen ${
          collapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
