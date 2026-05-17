"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Store, BarChart3, Crown, LogOut, Clock, XCircle } from "lucide-react";
import { useCurrentPuestero } from "@/lib/current-puestero";
import { useAuth, signOut } from "@/lib/auth";
import { useStore } from "@/store/useStore";

const tabs = [
  { label: "Productos", href: "/mi-puesto", icon: Package },
  { label: "Mi Local", href: "/mi-puesto/local", icon: Store },
  { label: "Estadísticas", href: "/mi-puesto/estadisticas", icon: BarChart3 },
  { label: "Mi Plan", href: "/mi-puesto/plan", icon: Crown },
];

export default function MiPuestoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const puestero = useCurrentPuestero();
  const { email } = useAuth();
  const solicitud = useStore((s) =>
    s.solicitudes.find((sol) => sol.gmailAcceso === email)
  );
  const hasAccess = !!puestero;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Top navbar — v3 minimal */}
      <header className="sticky top-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#0A0A0A]/06">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            className="text-[15px] font-extrabold tracking-[-0.02em] text-[#0A0A0A]"
          >
            PASEO <span className="text-[#3B82F6]">96</span>
          </Link>

          {/* Center: section eyebrow */}
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
            Mi puesto
          </span>

          {/* Right: Store info + logout */}
          <div className="flex items-center gap-3">
            {puestero ? (
              <div className="flex items-center gap-2.5">
                {puestero.logoUrl ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-white relative ring-1 ring-[#0A0A0A]/08">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={puestero.logoUrl} alt={puestero.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ring-1 ring-[#0A0A0A]/08"
                    style={{ backgroundColor: puestero.color }}
                  >
                    {puestero.logoIniciales}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-semibold text-[#0A0A0A]">
                  {puestero.nombreComercial}
                </span>
              </div>
            ) : (
              <span className="hidden sm:block text-sm font-semibold text-amber-700">
                Sin puesto activo
              </span>
            )}
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#737373] hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/04 transition-colors ml-1"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <nav className="flex gap-1 -mb-px overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-[#0A0A0A] text-[#0A0A0A]"
                      : "border-transparent text-[#737373] hover:text-[#0A0A0A] hover:border-[#0A0A0A]/20"
                  }`}
                >
                  <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {hasAccess ? (
          children
        ) : (
          <AccessState email={email} solicitud={solicitud} />
        )}
      </main>
    </div>
  );
}

function AccessState({
  email,
  solicitud,
}: {
  email: string;
  solicitud:
    | {
        estado: "pendiente" | "aprobado" | "rechazado";
        nombreComercial: string;
        planElegido: "bronce" | "plata" | "oro";
      }
    | undefined;
}) {
  if (!email) {
    return (
      <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Iniciá sesión para entrar a tu puesto</h1>
        <p className="text-sm text-[#525252] mt-2">
          El acceso se habilita con el Gmail que Jere aprueba para cada puesto.
        </p>
        <Link href="/login" className="v3-admin-btn-accent mt-5 inline-flex">
          Ir al login
        </Link>
      </div>
    );
  }

  if (solicitud?.estado === "pendiente") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-10 text-center">
        <Clock className="w-10 h-10 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Tu solicitud está pendiente</h1>
        <p className="text-sm text-[#525252] mt-2 max-w-xl mx-auto leading-relaxed">
          {solicitud.nombreComercial} todavía necesita aprobación manual. Jere debe verificar
          el comprobante, el Gmail de acceso y el puesto físico antes de activar la cuenta.
        </p>
      </div>
    );
  }

  if (solicitud?.estado === "rechazado") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-10 text-center">
        <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Solicitud rechazada</h1>
        <p className="text-sm text-[#525252] mt-2 max-w-xl mx-auto leading-relaxed">
          Este Gmail tiene una solicitud rechazada. Comunicate con Jere para corregir los datos
          o cargar una solicitud nueva.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-10 text-center">
      <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Gmail sin puesto aprobado</h1>
      <p className="text-sm text-[#525252] mt-2 max-w-xl mx-auto leading-relaxed">
        {email} no está vinculado a un puesto activo. Cuando Jere apruebe la solicitud,
        esta sección va a mostrar productos, local, estadísticas y plan.
      </p>
      <Link href="/planes" className="v3-admin-btn-accent mt-5 inline-flex">
        Crear solicitud
      </Link>
    </div>
  );
}
