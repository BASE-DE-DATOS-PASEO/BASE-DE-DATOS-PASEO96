"use client";

import Header from "@/components/admin/Header";
import { useState } from "react";
import {
  Store,
  MapPin,
  CheckCircle2,
  MessageCircle,
  TrendingUp,
  EyeOff,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { preciosPlanes, formatPrecio } from "@/lib/mock-data";
import { diasDeAtraso, estaEnMora } from "@/lib/data-bridge";
import clsx from "clsx";
import Counter from "@/components/Counter";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function CobrosPage() {
  const { puesteros, marcarPagado } = useStore();
  const today = new Date();
  const [filtro, setFiltro] = useState<"todos" | "pendiente" | "pagado" | "vencido">("todos");

  const puestosConCobro = puesteros
    .map((p) => {
      const fecha = new Date(p.fechaProximoCobro);
      const isVencido = fecha < today && p.estadoPago === "pendiente";
      return { ...p, fechaCobro: fecha, isVencido };
    })
    .sort((a, b) => a.fechaCobro.getTime() - b.fechaCobro.getTime());

  const pagados = puestosConCobro.filter((p) => p.estadoPago === "pagado");
  const pendientes = puestosConCobro.filter(
    (p) => p.estadoPago === "pendiente" && !p.isVencido
  );
  const vencidos = puestosConCobro.filter((p) => p.isVencido);

  const ingresosDelMes = pagados.reduce(
    (sum, p) => sum + preciosPlanes[p.plan],
    0
  );
  const porCobrar = [...pendientes, ...vencidos].reduce(
    (sum, p) => sum + preciosPlanes[p.plan],
    0
  );

  const filtered =
    filtro === "todos"
      ? puestosConCobro
      : filtro === "vencido"
      ? vencidos
      : filtro === "pendiente"
      ? pendientes
      : pagados;

  const tabs = [
    { key: "todos", label: "Todos", count: puestosConCobro.length },
    { key: "pendiente", label: "Por cobrar", count: pendientes.length },
    { key: "vencido", label: "Vencidos", count: vencidos.length },
    { key: "pagado", label: "Pagados", count: pagados.length },
  ] as const;

  const whatsappLink = (telefono: string, nombre: string, monto: number) => {
    const msg = encodeURIComponent(
      `Hola ${nombre}, te recuerdo que tenés pendiente el cobro del mes de Paseo 96 (${formatPrecio(monto)}). Gracias!`
    );
    const tel = telefono.replace(/\D/g, "");
    return `https://wa.me/${tel}?text=${msg}`;
  };

  return (
    <>
      <Header
        eyebrow={`${MESES[today.getMonth()]} ${today.getFullYear()}`}
        title="Cobros"
        titleAccent="del mes."
        subtitle="Quién pagó, quién te debe, y cuánto falta entrar."
      />

      <div className="max-w-5xl px-5 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-10">

        {/* ── Hero: Cobrado este mes — rico ── */}
        <div className="rounded-3xl bg-[#0A0A0A] text-white p-8 sm:p-10 relative overflow-hidden">
          {/* Glow background */}
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 85% 20%, rgba(16,185,129,0.42) 0%, transparent 60%), " +
                "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(59,130,246,0.15) 0%, transparent 60%)",
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 items-end">
            <div className="lg:col-span-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                Cobrado este mes · {MESES[today.getMonth()]}
              </span>
              <p className="mt-3 text-[64px] sm:text-[80px] lg:text-[96px] font-extrabold tracking-[-0.045em] tabular-nums leading-[0.9]">
                {ingresosDelMes > 0 ? (
                  <Counter value={ingresosDelMes} duration={1600} prefix="$ " />
                ) : (
                  <span className="text-white/30">$ 0</span>
                )}
              </p>
              <p className="mt-4 text-sm text-white/60 max-w-md leading-relaxed">
                Suma de los planes pagados al día. Se actualiza cuando marcás
                pagado a un puestero.
              </p>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="rounded-2xl bg-white/06 border border-white/08 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">Pagaron</span>
                </div>
                <p className="text-3xl font-extrabold tabular-nums tracking-tight">
                  <Counter value={pagados.length} duration={1000} />
                  <span className="text-white/40 ml-2 text-2xl">/ {puestosConCobro.length}</span>
                </p>
                <p className="text-[10px] text-white/50 mt-1">puesteros</p>
              </div>
              <div className="rounded-2xl bg-white/06 border border-white/08 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={11} className="text-emerald-300" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">Faltan entrar</span>
                </div>
                <p className="text-2xl font-extrabold tabular-nums tracking-tight">
                  {formatPrecio(porCobrar)}
                </p>
                <p className="text-[10px] text-white/50 mt-1">si cobrás todo</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mini stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Por cobrar</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 mt-2 tabular-nums tracking-tight">
              {pendientes.length}
            </p>
            <p className="text-xs text-[#737373] mt-1">aún no pagaron</p>
          </div>
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Vencidos</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-rose-600 mt-2 tabular-nums tracking-tight">
              {vencidos.length}
            </p>
            <p className="text-xs text-[#737373] mt-1">deben hace tiempo</p>
          </div>
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Faltan entrar</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] mt-2 tabular-nums tracking-tight">
              {formatPrecio(porCobrar)}
            </p>
            <p className="text-xs text-[#737373] mt-1">si cobrás todo</p>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFiltro(tab.key)}
              className={clsx(
                "shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] rounded-full transition-all",
                filtro === tab.key
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-white border border-[#0A0A0A]/08 text-[#525252] hover:text-[#0A0A0A] hover:border-[#0A0A0A]/25"
              )}
            >
              {tab.label} <span className="ml-1 opacity-60 tabular-nums">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── Lista ── */}
        <div className="space-y-2.5">
          {filtered.map((puesto) => {
            const isPaid = puesto.estadoPago === "pagado";
            const monto = preciosPlanes[puesto.plan];
            const planLabel = puesto.plan.charAt(0).toUpperCase() + puesto.plan.slice(1);
            return (
              <div
                key={puesto.id}
                className={clsx(
                  "bg-white border rounded-2xl px-4 py-4 sm:px-5 transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(10,10,10,0.10)]",
                  puesto.isVencido
                    ? "border-rose-200/70"
                    : isPaid
                    ? "border-[#0A0A0A]/06"
                    : "border-[#0A0A0A]/06"
                )}
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_auto] gap-4 sm:items-center">

                  {/* Info del puesto */}
                  <div className="flex items-center gap-3 min-w-0">
                    {puesto.logoUrl ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-white relative shrink-0 ring-1 ring-[#0A0A0A]/08">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={puesto.logoUrl} alt={puesto.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: puesto.color }}
                      >
                        {puesto.logoIniciales}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-[#0A0A0A] truncate text-[15px]">
                          {puesto.nombreComercial}
                        </p>
                        {estaEnMora(puesto) && (
                          <span className="v3-admin-badge v3-admin-badge-danger">
                            <EyeOff size={10} /> Productos ocultos
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#737373] mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> F{puesto.fila} · P{puesto.numeroPuesto}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#A3A3A3]" />
                        <span className="truncate">{puesto.nombreResponsable}</span>
                        <span className="w-1 h-1 rounded-full bg-[#A3A3A3]" />
                        <span className="font-semibold">{planLabel}</span>
                        {diasDeAtraso(puesto) > 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[#A3A3A3]" />
                            <span className="text-rose-700 font-bold tabular-nums">
                              {diasDeAtraso(puesto)} días atrasado
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Monto + fecha */}
                  <div className="flex sm:flex-col items-baseline sm:items-start gap-2 sm:gap-0">
                    <p className="text-xl font-extrabold text-[#0A0A0A] tabular-nums tracking-tight">
                      {formatPrecio(monto)}
                    </p>
                    <p className={clsx(
                      "text-xs font-semibold tabular-nums",
                      puesto.isVencido ? "text-rose-600" : "text-[#737373]"
                    )}>
                      {puesto.fechaCobro.toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    {isPaid ? (
                      <span className="v3-admin-badge v3-admin-badge-success">
                        <CheckCircle2 size={11} />
                        Pagado
                      </span>
                    ) : (
                      <>
                        <a
                          href={whatsappLink(puesto.telefono, puesto.nombreResponsable, monto)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                          title="Recordar por WhatsApp"
                        >
                          <MessageCircle size={13} />
                          WhatsApp
                        </a>
                        <button
                          onClick={() => marcarPagado(puesto.id)}
                          className="v3-admin-btn !py-2 !px-3 !text-xs"
                        >
                          Marcar pagado
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-[#0A0A0A]/15">
              <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-bold text-[#0A0A0A]">No hay cobros con ese filtro</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
