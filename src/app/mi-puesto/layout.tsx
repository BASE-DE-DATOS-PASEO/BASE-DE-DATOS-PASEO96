"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Store, BarChart3, Crown, LogOut, Clock, XCircle } from "lucide-react";
import { useCurrentPuestero } from "@/lib/current-puestero";
import { clearSessionEmail, useSessionEmail } from "@/lib/pre-supabase-session";
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
  const sessionEmail = useSessionEmail();
  const solicitud = useStore((s) =>
    s.solicitudes.find((sol) => sol.gmailAcceso === sessionEmail)
  );
  const hasAccess = !!puestero;

  function logout() {
    clearSessionEmail();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-900 hover:text-blue-600 transition-colors"
          >
            PASEO 96
          </Link>

          {/* Center: Title */}
          <span className="hidden sm:block text-sm font-medium text-gray-500">
            Mi Puesto
          </span>

          {/* Right: Store info + logout */}
          <div className="flex items-center gap-3">
            {puestero ? (
              <div className="flex items-center gap-2">
                {puestero.logoUrl ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={puestero.logoUrl} alt={puestero.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: puestero.color }}
                  >
                    {puestero.logoIniciales}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {puestero.nombreComercial}
                </span>
              </div>
            ) : (
              <span className="hidden sm:block text-sm font-medium text-amber-600">
                Sin puesto activo
              </span>
            )}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {hasAccess ? (
          children
        ) : (
          <AccessState email={sessionEmail} solicitud={solicitud} />
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
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Iniciá sesión para entrar a tu puesto</h1>
        <p className="text-sm text-gray-500 mt-2">
          El acceso se habilita con el Gmail que Jere aprueba para cada puesto.
        </p>
        <Link href="/login" className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
          Ir al login
        </Link>
      </div>
    );
  }

  if (solicitud?.estado === "pendiente") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center">
        <Clock className="w-10 h-10 text-amber-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-900">Tu solicitud está pendiente</h1>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          {solicitud.nombreComercial} todavía necesita aprobación manual. Jere debe verificar
          el comprobante, el Gmail de acceso y el puesto físico antes de activar la cuenta.
        </p>
      </div>
    );
  }

  if (solicitud?.estado === "rechazado") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center">
        <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-900">Solicitud rechazada</h1>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          Este Gmail tiene una solicitud rechazada. Comunicate con Jere para corregir los datos
          o cargar una solicitud nueva.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-8 text-center">
      <h1 className="text-xl font-bold text-gray-900">Gmail sin puesto aprobado</h1>
      <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
        {email} no está vinculado a un puesto activo. Cuando Jere apruebe la solicitud,
        esta sección va a mostrar productos, local, estadísticas y plan.
      </p>
      <Link href="/planes" className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
        Crear solicitud
      </Link>
    </div>
  );
}
