"use client";

import {
  Crown,
  Image,
  Package,
  Video,
  MessageCircle,
  BarChart3,
  Star,
  Megaphone,
  Sparkles,
  ArrowRight,
  Check,
  Store,
} from "lucide-react";
import Link from "next/link";
import { useCurrentPuestero, useCurrentPuesteroProductos, useCurrentPlan } from "@/lib/current-puestero";
import { planConfig } from "@/lib/mock-data";

/* ── helpers ─────────────────────────────────────── */

function formatPrecio(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

function formatFechaLarga(iso: string) {
  const d = new Date(iso);
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
}

/* ── Plan gradient por tier ─────────────────────── */

const planTheme = {
  bronce: {
    gradient: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    iconBg: "bg-orange-400",
    badge: "bg-orange-200 text-orange-800",
    accent: "bg-orange-100 text-orange-600",
  },
  plata: {
    gradient: "from-slate-50 to-blue-50",
    border: "border-slate-200",
    iconBg: "bg-slate-500",
    badge: "bg-slate-200 text-slate-800",
    accent: "bg-slate-100 text-slate-600",
  },
  oro: {
    gradient: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    iconBg: "bg-amber-400",
    badge: "bg-amber-200 text-amber-800",
    accent: "bg-amber-100 text-amber-600",
  },
} as const;

/* ── Usage bar component ─────────────────────── */

function UsageBar({
  label,
  used,
  total,
  icon: Icon,
  color,
}: {
  label: string;
  used: number;
  total: number;
  icon: React.ElementType;
  color: string;
}) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const isNearLimit = pct >= 80;

  return (
    <div className="p-4 rounded-xl bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className={`text-sm font-bold ${isNearLimit ? "text-amber-600" : "text-gray-900"}`}>
          {used} / {total}
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isNearLimit && total > 0 && (
        <p className="text-xs text-amber-600 mt-1.5">
          Estás usando el {Math.round(pct)}% de tu límite
        </p>
      )}
    </div>
  );
}

/* ── Página ─────────────────────────────────────── */

export default function MiPlanPage() {
  const puestero = useCurrentPuestero();
  const plan = useCurrentPlan();
  const productos = useCurrentPuesteroProductos();
  const currentPlanKey = puestero?.plan ?? "bronce";
  const theme = planTheme[currentPlanKey];

  const fotosUsadas = productos.reduce((sum, p) => sum + p.imagenes.length, 0);

  // Features del plan actual
  const features = [
    { icon: MessageCircle, label: "WhatsApp Empresa", desc: "Botón de contacto directo", incluido: plan.whatsappEmpresa },
    { icon: Image, label: `${plan.maxFotosTotal} fotos totales`, desc: `${plan.maxFotosPorPublicacion} fotos por publicación`, incluido: true },
    { icon: Package, label: `${plan.maxPublicaciones} publicaciones`, desc: "Máximo de productos activos", incluido: true },
    { icon: Video, label: `${plan.maxVideos} videos`, desc: "Mostrá tus productos en movimiento", incluido: plan.maxVideos > 0 },
    { icon: Store, label: "Logo de local", desc: "Tu marca visible en la página", incluido: plan.logoLocal },
    { icon: BarChart3, label: "Estadísticas avanzadas", desc: "Vistas, consultas y más", incluido: plan.estadisticasAvanzadas },
    { icon: Star, label: "Publicación destacada", desc: "Tus productos aparecen primero", incluido: plan.publicacionDestacada },
    { icon: Megaphone, label: "Publicidad + Video", desc: "Promoción en redes de Paseo 96", incluido: plan.publicidadVideo },
    { icon: Sparkles, label: "IA en imágenes", desc: "Mejora automática de fotos", incluido: plan.iaImagenes },
  ].filter((f) => f.incluido);

  if (!puestero) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Crown size={26} className="text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Sin plan activo</h1>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          El plan queda asociado al puesto cuando Jere aprueba la solicitud.
          Esta pantalla ya está preparada para mostrar límites y beneficios reales.
        </p>
        <Link
          href="/planes"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Ver planes
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Mi Plan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestioná tu suscripción y controlá el uso de tu plan
        </p>
      </div>

      {/* Current plan card */}
      <section className={`rounded-2xl border-2 ${theme.border} bg-gradient-to-br ${theme.gradient} shadow-sm p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center`}>
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">Plan {plan.nombre}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${theme.badge}`}>
                  {puestero.estadoPago === "pagado" ? "Activo" : "Pendiente"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">
                Tu plan se renueva el <strong>{formatFechaLarga(puestero.fechaProximoCobro)}</strong>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{formatPrecio(plan.precio)}</p>
            <p className="text-sm text-gray-500">/mes</p>
          </div>
        </div>
      </section>

      {/* Usage section */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Uso de tu plan</h2>
        <p className="text-xs text-gray-500 mb-5">Así va tu consumo este mes</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <UsageBar label="Publicaciones" used={productos.length} total={plan.maxPublicaciones} icon={Package} color="bg-blue-500" />
          <UsageBar label="Fotos totales" used={fotosUsadas} total={plan.maxFotosTotal} icon={Image} color="bg-emerald-500" />
          <UsageBar label="Videos" used={0} total={plan.maxVideos} icon={Video} color="bg-purple-500" />
          <UsageBar label="Consultas WhatsApp" used={0} total={999} icon={MessageCircle} color="bg-green-500" />
        </div>
      </section>

      {/* Features included */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Lo que incluye tu plan</h2>
        <p className="text-xs text-gray-500 mb-5">Todas las funcionalidades del Plan {plan.nombre}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
              <div className={`w-8 h-8 rounded-lg ${theme.accent} flex items-center justify-center shrink-0 mt-0.5`}>
                <f.icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare plans */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Comparar planes</h2>
        <p className="text-xs text-gray-500 mb-5">Mirá las diferencias entre los 3 planes</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 pr-4 font-medium text-gray-500">Característica</th>
                {(["bronce", "plata", "oro"] as const).map((key) => {
                  const isCurrent = puestero.plan === key;
                  return (
                    <th
                      key={key}
                      className={`text-center py-3 px-3 font-semibold ${
                        isCurrent ? "text-blue-600 bg-blue-50 rounded-t-lg" : "text-gray-700"
                      }`}
                    >
                      {planConfig[key].nombre} {isCurrent && "★"}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { feature: "Precio", get: (k: "bronce" | "plata" | "oro") => formatPrecio(planConfig[k].precio) },
                { feature: "Publicaciones", get: (k: "bronce" | "plata" | "oro") => String(planConfig[k].maxPublicaciones) },
                { feature: "Fotos totales", get: (k: "bronce" | "plata" | "oro") => String(planConfig[k].maxFotosTotal) },
                { feature: "Videos", get: (k: "bronce" | "plata" | "oro") => planConfig[k].maxVideos > 0 ? String(planConfig[k].maxVideos) : "—" },
                { feature: "Destacado", get: (k: "bronce" | "plata" | "oro") => planConfig[k].publicacionDestacada ? true : "—" },
                { feature: "Publicidad + Video", get: (k: "bronce" | "plata" | "oro") => planConfig[k].publicidadVideo ? true : "—" },
                { feature: "IA en imágenes", get: (k: "bronce" | "plata" | "oro") => planConfig[k].iaImagenes ? true : "—" },
              ].map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 pr-4 text-gray-700">{row.feature}</td>
                  {(["bronce", "plata", "oro"] as const).map((key) => {
                    const val = row.get(key);
                    const isCurrent = puestero.plan === key;
                    return (
                      <td
                        key={key}
                        className={`text-center py-3 px-3 ${isCurrent ? "bg-blue-50" : ""}`}
                      >
                        {val === true ? (
                          <Check size={16} className="inline text-emerald-500" />
                        ) : val === "—" ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <span className="font-medium text-gray-900">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
          <p className="text-sm text-gray-500">¿Querés cambiar de plan?</p>
          <Link
            href="/planes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ver todos los planes
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
