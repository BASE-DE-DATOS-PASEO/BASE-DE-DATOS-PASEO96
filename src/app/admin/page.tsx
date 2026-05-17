"use client";

import Header from "@/components/admin/Header";
import {
  ClipboardCheck,
  AlertCircle,
  ArrowUpRight,
  Store,
  Package,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { preciosPlanes } from "@/lib/mock-data";
import Link from "next/link";
import Counter from "@/components/Counter";
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { puesteros, productos, solicitudes } = useStore();
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente");

  const puestosActivos = puesteros.filter((p) => p.estadoActividad === "activo");
  const pendientesPago = puesteros.filter((p) => p.estadoPago === "pendiente");

  const ingresosDelMes = puesteros
    .filter((p) => p.estadoPago === "pagado")
    .reduce((sum, p) => sum + preciosPlanes[p.plan], 0);

  const ultimosProductos = [...productos]
    .sort((a, b) => new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime())
    .slice(0, 3);

  const ultimosPuesteros = [...puesteros]
    .sort((a, b) => new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime())
    .slice(0, 2);

  const actividad = [
    ...ultimosProductos.map((p) => {
      const puesto = puesteros.find((pu) => pu.id === p.puesteroId);
      return {
        tipo: "producto" as const,
        texto: `${puesto?.nombreComercial ?? "Alguien"} cargó "${p.nombre}"`,
        fecha: p.fechaCarga,
        icon: Package,
      };
    }),
    ...ultimosPuesteros.map((p) => ({
      tipo: "puestero" as const,
      texto: `${p.nombreComercial} se dio de alta (Plan ${p.plan.charAt(0).toUpperCase() + p.plan.slice(1)})`,
      fecha: p.fechaAlta,
      icon: Store,
    })),
  ]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  const displayName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ")[0]
    : user?.email
      ? user.email.split("@")[0]
      : "Admin";

  return (
    <>
      <Header
        eyebrow="Panel administrador"
        title={`Hola, ${displayName}`}
        subtitle="Esto es lo que necesitás ver hoy."
      />

      <div className="max-w-6xl px-5 sm:px-8 lg:px-12 py-8 sm:py-10">

        {/* ── Bandeja: qué hacer ahora ── */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252] mb-4">
            <span className="w-5 h-px bg-[#525252]" />
            Pendiente de tu atención
          </span>

          <div className="space-y-3">
            {/* Solicitudes pendientes */}
            <Link
              href="/admin/solicitudes"
              className="v3-stat-card group flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ClipboardCheck size={20} className="text-amber-600" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0A0A0A] text-base">
                  <span className="text-amber-700">{solicitudesPendientes.length}</span> solicitudes nuevas
                </p>
                <p className="text-sm text-[#525252] mt-0.5">
                  Puesteros que quieren sumarse. Revisá el comprobante y aprobá.
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#0A0A0A] transition-transform group-hover:translate-x-1 sm:ml-auto">
                Revisar
                <ArrowUpRight size={15} />
              </div>
            </Link>

            {/* Cobros pendientes */}
            <Link
              href="/admin/cobros"
              className="v3-stat-card group flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <AlertCircle size={20} className="text-rose-600" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0A0A0A] text-base">
                  <span className="text-rose-700">
                    <Counter value={pendientesPago.length} duration={900} />
                  </span>{" "}
                  puesteros te deben este mes
                </p>
                <p className="text-sm text-[#525252] mt-0.5">
                  Mandales un WhatsApp o marcalos como pagados.
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#0A0A0A] transition-transform group-hover:translate-x-1 sm:ml-auto">
                Ver cobros
                <ArrowUpRight size={15} />
              </div>
            </Link>
          </div>
        </div>

        {/* ── Highlight: ingresos del mes ── */}
        <div className="mb-12 rounded-2xl bg-[#0A0A0A] text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle background */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 90% 20%, rgba(59,130,246,0.45) 0%, transparent 55%)",
            }}
          />
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
                Cobrado este mes
              </span>
              <p className="mt-3 text-5xl sm:text-6xl font-extrabold tracking-[-0.04em] tabular-nums leading-none">
                <Counter value={ingresosDelMes} duration={1400} prefix="$ " />
              </p>
              <p className="mt-3 text-sm text-white/60">
                Suma de los planes pagados al día
              </p>
            </div>
            <div className="sm:text-right flex flex-col justify-end gap-2">
              <div className="inline-flex items-center gap-2 text-sm text-white/80 sm:justify-end">
                <TrendingUp size={15} className="text-[#60A5FA]" />
                <span className="font-semibold">
                  <Counter value={puestosActivos.length} duration={1000} /> puesteros activos
                </span>
              </div>
              <Link
                href="/admin/cobros"
                className="inline-flex sm:self-end items-center gap-1 text-xs font-semibold text-[#60A5FA] hover:text-white transition-colors"
              >
                Ver detalle de cobros
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── KPIs simples ── */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252] mb-4">
            <span className="w-5 h-px bg-[#525252]" />
            Números del momento
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="v3-stat-card">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Puestos activos</p>
              <p className="text-3xl font-extrabold tracking-tight text-[#0A0A0A] mt-2 tabular-nums">
                <Counter value={puestosActivos.length} duration={1000} />
              </p>
              <p className="text-xs text-[#737373] mt-1">de {puesteros.length} totales</p>
            </div>
            <div className="v3-stat-card">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Productos en línea</p>
              <p className="text-3xl font-extrabold tracking-tight text-[#0A0A0A] mt-2 tabular-nums">
                <Counter value={productos.length} duration={1200} />
              </p>
              <p className="text-xs text-[#737373] mt-1">cargados por puesteros</p>
            </div>
            <div className="v3-stat-card">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Al día</p>
              <p className="text-3xl font-extrabold tracking-tight text-emerald-600 mt-2 tabular-nums">
                <Counter value={puesteros.filter((p) => p.estadoPago === "pagado").length} duration={1100} />
              </p>
              <p className="text-xs text-[#737373] mt-1">puesteros pagaron el mes</p>
            </div>
          </div>
        </div>

        {/* ── Actividad reciente ── */}
        <div className="v3-admin-card p-6 sm:p-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
                <span className="w-5 h-px bg-[#525252]" />
                Actividad
              </span>
              <h3 className="mt-2 text-xl font-bold text-[#0A0A0A] tracking-tight">Últimas novedades</h3>
            </div>
          </div>

          {actividad.length > 0 ? (
            <div className="space-y-0">
              {actividad.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-4 border-b border-[#0A0A0A]/06 last:border-0 last:pb-0 first:pt-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#FAFAF7] border border-[#0A0A0A]/06 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={15} className="text-[#0A0A0A]" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0A0A0A] leading-snug">{a.texto}</p>
                      <p className="text-xs text-[#737373] mt-1 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(a.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-[#737373]">Todo tranquilo, no hay novedades</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
