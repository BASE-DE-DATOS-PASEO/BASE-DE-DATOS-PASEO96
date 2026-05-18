"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import { useAuth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="v3-admin-bg min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#0A0A0A] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="v3-admin-bg min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-[#0A0A0A]/06 p-10 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
            <span className="w-6 h-px bg-[#3B82F6]" />
            Restringido
          </span>
          <h1 className="mt-4 text-2xl font-bold text-[#0A0A0A] tracking-tight">Acceso solo administradores</h1>
          <p className="text-sm text-[#525252] mt-3">
            Este panel requiere iniciar sesión con el Gmail autorizado.
          </p>
          <Link
            href="/login"
            className="v3-admin-btn-accent mt-6 inline-flex"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="v3-admin-bg pb-20 md:pb-0">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main
        className={`transition-[margin] duration-200 ease-out min-h-screen ${
          collapsed ? "md:ml-[64px]" : "md:ml-[240px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
