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
  Plus,
  Tag,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { preciosPlanes } from "@/lib/mock-data";
import Link from "next/link";
import Counter from "@/components/Counter";
import { useAuth } from "@/lib/auth";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { puesteros, productos, solicitudes, categorias } = useStore();
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente");

  const puestosActivos = puesteros.filter((p) => p.estadoActividad === "activo");
  const pendientesPago = puesteros.filter((p) => p.estadoPago === "pendiente");

  const ingresosDelMes = puesteros
    .filter((p) => p.estadoPago === "pagado")
    .reduce((sum, p) => sum + preciosPlanes[p.plan], 0);

  const productosVisibles = productos.filter((p) => p.visible).length;

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
        texto: <>{puesto?.nombreComercial ?? "Alguien"} cargó <strong className="text-[#0A0A0A] font-bold">&quot;{p.nombre}&quot;</strong></>,
        fecha: p.fechaCarga,
        icon: Package,
      };
    }),
    ...ultimosPuesteros.map((p) => ({
      tipo: "puestero" as const,
      texto: <><strong className="text-[#0A0A0A] font-bold">{p.nombreComercial}</strong> se dio de alta · Plan {p.plan.charAt(0).toUpperCase() + p.plan.slice(1)}</>,
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

  const now = new Date();
  const fechaHoy = `${DIAS[now.getDay()]} ${now.getDate()} de ${MESES[now.getMonth()]}`;
  const fechaHoyCapital = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  const formatPrecio = (n: number) => `$ ${n.toLocaleString("es-AR")}`;

  return (
    <>
      <Header
        eyebrow={`Hoy · ${fechaHoyCapital}`}
        title={`Hola, ${displayName}`}
        titleAccent="bienvenido."
        subtitle="Esto es lo que pasa hoy en Paseo 96."
      />

      <div className="max-w-6xl px-5 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-12">

        {/* ═══════════════════════════════════════════════════════════
            HERO — Cobrado del mes con depth + glow azul + sparkline
            ═══════════════════════════════════════════════════════════ */}
        <section className="relative rounded-3xl bg-[#0A0A0A] text-white p-8 sm:p-10 overflow-hidden">
          {/* Animated glow background */}
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 90% 0%, rgba(59,130,246,0.35) 0%, transparent 60%), " +
                "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(96,165,250,0.18) 0%, transparent 60%)",
            }}
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-end">
            {/* Left — big number */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">
                  Cobrado este mes
                </span>
                <span className="text-[10px] font-semibold text-white/50">
                  · {MESES[now.getMonth()].charAt(0).toUpperCase() + MESES[now.getMonth()].slice(1)}
                </span>
              </div>

              <p className="text-[64px] sm:text-[88px] lg:text-[104px] font-extrabold tracking-[-0.045em] tabular-nums leading-[0.9]">
                {ingresosDelMes > 0 ? (
                  <Counter value={ingresosDelMes} duration={1600} prefix="$ " />
                ) : (
                  <span className="text-white/30">$ 0</span>
                )}
              </p>

              <p className="mt-4 text-sm text-white/60 max-w-md leading-relaxed">
                Suma de los planes pagados al día. Se actualiza cuando marcás pagado a un puestero.
              </p>
            </div>

            {/* Right — meta strip */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/06 border border-white/08 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">Activos</span>
                  </div>
                  <p className="text-3xl font-extrabold tabular-nums tracking-tight">
                    <Counter value={puestosActivos.length} duration={1000} />
                  </p>
                  <p className="text-[10px] text-white/50 mt-1">puesteros</p>
                </div>
                <div className="rounded-2xl bg-white/06 border border-white/08 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">Deben</span>
                  </div>
                  <p className="text-3xl font-extrabold tabular-nums tracking-tight">
                    <Counter value={pendientesPago.length} duration={1000} />
                  </p>
                  <p className="text-[10px] text-white/50 mt-1">este mes</p>
                </div>
              </div>

              <Link
                href="/admin/cobros"
                className="group inline-flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white text-[#0A0A0A] hover:bg-white/95 transition-all duration-200 font-semibold text-sm hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(255,255,255,0.2)]"
              >
                Ver detalle de cobros
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PENDIENTE DE TU ATENCIÓN
            ═══════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-5">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
              <span className="w-5 h-px bg-[#525252]" />
              Pendiente de tu atención
            </span>
            <span className="text-[11px] font-medium text-[#737373] tabular-nums">
              {solicitudesPendientes.length + pendientesPago.length} ítems
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Solicitudes pendientes */}
            <Link
              href="/admin/solicitudes"
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                solicitudesPendientes.length > 0
                  ? "bg-white border-[#0A0A0A]/06 hover:border-amber-300 hover:shadow-[0_16px_40px_-12px_rgba(245,158,11,0.18)] hover:-translate-y-1"
                  : "bg-emerald-50/40 border-emerald-200/60"
              }`}
            >
              {solicitudesPendientes.length > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
              )}
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    solicitudesPendientes.length > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {solicitudesPendientes.length > 0 ? (
                      <ClipboardCheck size={20} strokeWidth={1.8} />
                    ) : (
                      <CheckCircle2 size={20} strokeWidth={1.8} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {solicitudesPendientes.length > 0 ? (
                      <>
                        <p className="text-base font-bold text-[#0A0A0A] leading-snug">
                          <span className="text-amber-700 tabular-nums">{solicitudesPendientes.length}</span> solicitudes nuevas
                        </p>
                        <p className="text-sm text-[#525252] mt-1 leading-relaxed">
                          Puesteros que quieren sumarse a la feria. Revisá el comprobante y aprobá.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-bold text-[#0A0A0A] leading-snug">
                          Todo al día
                        </p>
                        <p className="text-sm text-[#525252] mt-1 leading-relaxed">
                          No hay solicitudes pendientes para revisar.
                        </p>
                      </>
                    )}
                  </div>
                  <ArrowUpRight size={15} className="text-[#737373] group-hover:text-[#0A0A0A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-2" />
                </div>
              </div>
            </Link>

            {/* Cobros pendientes */}
            <Link
              href="/admin/cobros"
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                pendientesPago.length > 0
                  ? "bg-white border-[#0A0A0A]/06 hover:border-rose-300 hover:shadow-[0_16px_40px_-12px_rgba(244,63,94,0.18)] hover:-translate-y-1"
                  : "bg-emerald-50/40 border-emerald-200/60"
              }`}
            >
              {pendientesPago.length > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-500" />
              )}
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    pendientesPago.length > 0
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {pendientesPago.length > 0 ? (
                      <AlertCircle size={20} strokeWidth={1.8} />
                    ) : (
                      <CheckCircle2 size={20} strokeWidth={1.8} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {pendientesPago.length > 0 ? (
                      <>
                        <p className="text-base font-bold text-[#0A0A0A] leading-snug">
                          <span className="text-rose-700 tabular-nums">{pendientesPago.length}</span> puesteros te deben
                        </p>
                        <p className="text-sm text-[#525252] mt-1 leading-relaxed">
                          Mandales un WhatsApp o marcalos como pagados manualmente.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-bold text-[#0A0A0A] leading-snug">
                          Todos pagaron
                        </p>
                        <p className="text-sm text-[#525252] mt-1 leading-relaxed">
                          Nadie te debe este mes. Buen laburo.
                        </p>
                      </>
                    )}
                  </div>
                  <ArrowUpRight size={15} className="text-[#737373] group-hover:text-[#0A0A0A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-2" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            QUICK ACTIONS
            ═══════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-5">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
              <span className="w-5 h-px bg-[#525252]" />
              Atajos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Nuevo puestero", icon: Store, href: "/admin/puesteros" },
              { label: "Nuevo producto", icon: Package, href: "/admin/productos" },
              { label: "Nueva categoría", icon: Tag, href: "/admin/categorias" },
              { label: "Ver cobros", icon: CalendarDays, href: "/admin/cobros" },
            ].map(({ label, icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-start gap-3 p-4 rounded-2xl bg-white border border-[#0A0A0A]/06 hover:border-[#0A0A0A]/25 hover:shadow-[0_10px_24px_-8px_rgba(10,10,10,0.10)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FAFAF7] border border-[#0A0A0A]/06 flex items-center justify-center text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white group-hover:border-[#0A0A0A] transition-all">
                  <Icon size={16} strokeWidth={1.8} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-bold text-[#0A0A0A]">{label}</span>
                  <Plus size={14} className="text-[#737373] group-hover:text-[#0A0A0A] group-hover:rotate-90 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            NÚMEROS DEL MOMENTO
            ═══════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-5">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
              <span className="w-5 h-px bg-[#525252]" />
              Números del momento
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Puestos activos */}
            <div className="rounded-2xl bg-white border border-[#0A0A0A]/06 p-5 hover:shadow-[0_12px_28px_-12px_rgba(10,10,10,0.10)] hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">
                  Puestos activos
                </span>
                <Store size={14} className="text-[#A3A3A3] group-hover:text-[#0A0A0A] transition-colors" strokeWidth={1.8} />
              </div>
              <p className="text-4xl font-extrabold text-[#0A0A0A] tabular-nums tracking-tight">
                <Counter value={puestosActivos.length} duration={1000} />
              </p>
              <p className="text-[11px] text-[#737373] mt-2">
                de <span className="tabular-nums font-semibold text-[#525252]">{puesteros.length}</span> totales
              </p>
            </div>

            {/* Productos en línea */}
            <div className="rounded-2xl bg-white border border-[#0A0A0A]/06 p-5 hover:shadow-[0_12px_28px_-12px_rgba(10,10,10,0.10)] hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">
                  Productos en línea
                </span>
                <Package size={14} className="text-[#A3A3A3] group-hover:text-[#0A0A0A] transition-colors" strokeWidth={1.8} />
              </div>
              <p className="text-4xl font-extrabold text-[#3B82F6] tabular-nums tracking-tight">
                <Counter value={productosVisibles} duration={1200} />
              </p>
              <p className="text-[11px] text-[#737373] mt-2">
                visibles en la web
              </p>
            </div>

            {/* Categorías */}
            <div className="rounded-2xl bg-white border border-[#0A0A0A]/06 p-5 hover:shadow-[0_12px_28px_-12px_rgba(10,10,10,0.10)] hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">
                  Categorías
                </span>
                <Tag size={14} className="text-[#A3A3A3] group-hover:text-[#0A0A0A] transition-colors" strokeWidth={1.8} />
              </div>
              <p className="text-4xl font-extrabold text-[#0A0A0A] tabular-nums tracking-tight">
                <Counter value={categorias.length} duration={900} />
              </p>
              <p className="text-[11px] text-[#737373] mt-2">
                rubros en el catálogo
              </p>
            </div>

            {/* Al día */}
            <div className="rounded-2xl bg-white border border-[#0A0A0A]/06 p-5 hover:shadow-[0_12px_28px_-12px_rgba(16,185,129,0.18)] hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">
                  Pagaron el mes
                </span>
                <CheckCircle2 size={14} className="text-emerald-500" strokeWidth={1.8} />
              </div>
              <p className="text-4xl font-extrabold text-emerald-600 tabular-nums tracking-tight">
                <Counter value={puesteros.filter((p) => p.estadoPago === "pagado").length} duration={1100} />
              </p>
              <p className="text-[11px] text-[#737373] mt-2">
                {formatPrecio(ingresosDelMes)} acumulado
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            ACTIVIDAD RECIENTE
            ═══════════════════════════════════════════════════════════ */}
        <section className="rounded-2xl bg-white border border-[#0A0A0A]/06 overflow-hidden">
          <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-[#0A0A0A]/06 flex items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
                <span className="w-5 h-px bg-[#525252]" />
                Bitácora
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[#0A0A0A] tracking-tight">
                Últimas novedades
              </h3>
            </div>
            <Sparkles size={16} className="text-[#A3A3A3]" />
          </div>

          {actividad.length > 0 ? (
            <div className="px-6 sm:px-8 py-2">
              {actividad.map((a, i) => {
                const Icon = a.icon;
                const isLast = i === actividad.length - 1;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 py-4 ${!isLast ? "border-b border-[#0A0A0A]/04" : ""}`}
                  >
                    {/* Timeline marker */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FAFAF7] border border-[#0A0A0A]/08 flex items-center justify-center">
                        <Icon size={14} className="text-[#0A0A0A]" strokeWidth={1.8} />
                      </div>
                      {!isLast && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-px h-4 bg-[#0A0A0A]/06" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#525252] leading-relaxed">{a.texto}</p>
                      <p className="text-[11px] text-[#A3A3A3] mt-1 flex items-center gap-1.5">
                        <Clock size={10} />
                        {new Date(a.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 sm:px-8 py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FAFAF7] border border-[#0A0A0A]/06 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={20} className="text-[#A3A3A3]" strokeWidth={1.5} />
              </div>
              <p className="text-base font-bold text-[#0A0A0A]">
                Sin actividad reciente
              </p>
              <p className="text-sm text-[#737373] mt-1 max-w-sm mx-auto">
                Cuando un puestero se sume o cargue productos vas a verlo acá.
              </p>
              <Link
                href="/admin/puesteros"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#3B82F6] hover:text-[#2F6EE0] transition-colors group"
              >
                Empezar invitando un puestero
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </section>

        {/* Quick footer info */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-[#A3A3A3] font-medium">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={11} />
            Datos en vivo · sincronizados con Supabase
          </span>
          <span>Paseo 96 · v1.0</span>
        </div>
      </div>
    </>
  );
}
