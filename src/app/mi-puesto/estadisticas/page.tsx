"use client";

import {
  Eye,
  MessageCircle,
  TrendingUp,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import { useCurrentPuestero, useCurrentPuesteroProductos } from "@/lib/current-puestero";

export default function EstadisticasPage() {
  const puestero = useCurrentPuestero();
  const productos = useCurrentPuesteroProductos();

  const vistasPuesto = puestero?.vistas ?? 0;
  const whatsappsPuesto = puestero?.whatsapps ?? 0;

  const vistasProductos = productos.reduce((s, p) => s + (p.vistas ?? 0), 0);
  const whatsappsProductos = productos.reduce((s, p) => s + (p.whatsapps ?? 0), 0);

  const contactosTotales = whatsappsPuesto + whatsappsProductos;
  const totalVistas = vistasPuesto + vistasProductos;
  const tasaContacto = totalVistas > 0 ? Math.round((contactosTotales / totalVistas) * 100) : 0;

  const statsCards = [
    { label: "Visitas al puesto", value: vistasPuesto.toString(), icon: Eye, hint: "Vista del puesto desde la web", color: "text-[#0A0A0A]" },
    { label: "Consultas WhatsApp", value: contactosTotales.toString(), icon: MessageCircle, hint: "Clicks en el botón de WhatsApp", color: "text-emerald-600" },
    { label: "Productos vistos", value: vistasProductos.toString(), icon: ShoppingBag, hint: "Apertura de tus productos", color: "text-[#0A0A0A]" },
    { label: "Tasa de contacto", value: `${tasaContacto}%`, icon: TrendingUp, hint: "Vistas que se convierten en consulta", color: "text-[#3B82F6]" },
  ];

  const topProductos = [...productos]
    .filter((p) => (p.vistas ?? 0) > 0 || (p.whatsapps ?? 0) > 0)
    .sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0))
    .slice(0, 5);

  if (!puestero) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-10 text-center">
        <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Sin local activo</h1>
        <p className="text-sm text-[#525252] mt-2">
          Cuando tu solicitud sea aprobada vas a ver acá las estadísticas reales de tu puesto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Editorial header */}
      <section>
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
          <span className="w-5 h-px bg-[#3B82F6]" />
          Métricas
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-[1.05] text-[#0A0A0A]">
          Estadísticas
        </h1>
        <p className="text-[#525252] text-sm mt-2">
          Acumulado desde que tu puesto está activo.
        </p>
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="v3-stat-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">{s.label}</p>
                <Icon size={14} className="text-[#A3A3A3]" strokeWidth={1.8} />
              </div>
              <p className={`text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-[#737373] mt-2 leading-snug">{s.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Top products */}
      <section>
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
            <span className="w-5 h-px bg-[#525252]" />
            Ranking
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0A]">
            Productos más vistos
          </h2>
        </div>

        {topProductos.length > 0 ? (
          <div className="space-y-2">
            {topProductos.map((p, i) => {
              const vistas = p.vistas ?? 0;
              const wa = p.whatsapps ?? 0;
              const conv = vistas > 0 ? Math.round((wa / vistas) * 100) : 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#0A0A0A]/06"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-white text-sm font-bold shrink-0 tabular-nums">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-[#0A0A0A] truncate">{p.nombre}</p>
                    <p className="text-xs text-[#737373] mt-0.5 tabular-nums">
                      {vistas} vistas · {wa} consultas
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-extrabold text-[#3B82F6] tabular-nums tracking-tight">{conv}%</p>
                    <p className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#737373] mt-0.5">conversión</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white p-12 text-center">
            <BarChart3 size={28} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-bold text-[#0A0A0A]">Todavía sin datos</p>
            <p className="text-sm text-[#737373] mt-1 max-w-md mx-auto">
              Subí productos y compartí el link de tu puesto para que aparezcan vistas acá.
            </p>
          </div>
        )}
      </section>

      {/* Tip */}
      <div className="rounded-2xl bg-[#0A0A0A] text-white p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(circle at 90% 30%, rgba(59,130,246,0.35) 0%, transparent 55%)" }}
        />
        <div className="relative">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">Consejo</span>
          <p className="mt-2 text-base sm:text-lg font-semibold leading-snug">
            Cada vez que alguien abre tu puesto sumás una vista. Cada click en
            &quot;Consultar por WhatsApp&quot; suma una consulta.
          </p>
        </div>
      </div>
    </div>
  );
}
