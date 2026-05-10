"use client";

import {
  Eye,
  MessageCircle,
  TrendingUp,
  ShoppingBag,
  Users,
  BarChart3,
} from "lucide-react";
import { useCurrentPuestero, useCurrentPuesteroProductos } from "@/lib/current-puestero";

export default function EstadisticasPage() {
  const puestero = useCurrentPuestero();
  const productos = useCurrentPuesteroProductos();

  const vistasPuesto = puestero?.vistas ?? 0;
  const whatsappsPuesto = puestero?.whatsapps ?? 0;

  // Sumamos vistas y whatsapps de todos los productos del puestero
  const vistasProductos = productos.reduce((s, p) => s + (p.vistas ?? 0), 0);
  const whatsappsProductos = productos.reduce((s, p) => s + (p.whatsapps ?? 0), 0);

  // Contactos totales = WA del puesto + WA por producto
  const contactosTotales = whatsappsPuesto + whatsappsProductos;
  // Tasa de contacto: contactos / vistas (si no hay vistas, 0)
  const totalVistas = vistasPuesto + vistasProductos;
  const tasaContacto = totalVistas > 0 ? Math.round((contactosTotales / totalVistas) * 100) : 0;

  const statsCards = [
    {
      label: "Visitas al puesto",
      value: vistasPuesto.toString(),
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
      hint: "Veces que entraron a tu puesto desde la web",
    },
    {
      label: "Consultas WhatsApp",
      value: contactosTotales.toString(),
      icon: MessageCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      hint: "Clicks en el botón de WhatsApp",
    },
    {
      label: "Productos vistos",
      value: vistasProductos.toString(),
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-50",
      hint: "Veces que abrieron alguno de tus productos",
    },
    {
      label: "Tasa de contacto",
      value: `${tasaContacto}%`,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      hint: "Cuántas vistas terminan en consulta",
    },
  ];

  // Top productos (ordenados por vistas descendente)
  const topProductos = [...productos]
    .filter((p) => (p.vistas ?? 0) > 0 || (p.whatsapps ?? 0) > 0)
    .sort((a, b) => (b.vistas ?? 0) - (a.vistas ?? 0))
    .slice(0, 5);

  if (!puestero) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Sin local activo</h1>
        <p className="text-sm text-gray-600 mt-2">
          Cuando tu solicitud sea aprobada vas a ver acá las estadísticas reales de tu puesto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Acumulado desde que tu puesto está activo
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon size={20} className={s.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              <p className="text-[11px] text-gray-400 mt-2 leading-snug">{s.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Top products */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">Productos más vistos</h2>
        </div>
        <p className="text-xs text-gray-500 mb-5">
          Ranking por vistas y consultas
        </p>

        {topProductos.length > 0 ? (
          <div className="space-y-3">
            {topProductos.map((p, i) => {
              const vistas = p.vistas ?? 0;
              const wa = p.whatsapps ?? 0;
              const conv = vistas > 0 ? Math.round((wa / vistas) * 100) : 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.nombre}</p>
                    <p className="text-xs text-gray-500">
                      {vistas} vistas · {wa} consultas
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-blue-600">{conv}%</p>
                    <p className="text-xs text-gray-400">conversión</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <BarChart3 size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900">Todavía sin datos</p>
            <p className="text-xs text-gray-500 mt-1">
              Subí productos y compartí el link de tu puesto para que aparezcan vistas acá.
            </p>
          </div>
        )}
      </section>

      {/* Tip */}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
        <p className="text-sm font-semibold text-blue-800">Consejo</p>
        <p className="text-sm text-blue-700 mt-1">
          Cada vez que alguien abre uno de tus productos o el modal del puesto, sumás una vista.
          Cuando hacen click en &quot;Consultar por WhatsApp&quot; sumás una consulta.
        </p>
      </div>
    </div>
  );
}
