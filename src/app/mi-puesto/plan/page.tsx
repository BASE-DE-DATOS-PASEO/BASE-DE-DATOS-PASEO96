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
    <div className="p-5 rounded-2xl bg-white border border-[#0A0A0A]/06">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-[#737373]" strokeWidth={1.8} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">{label}</span>
        </div>
        <span className={`text-xs font-bold tabular-nums ${isNearLimit ? "text-amber-600" : "text-[#0A0A0A]"}`}>
          {used} / {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#0A0A0A]/06 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isNearLimit && total > 0 && (
        <p className="text-[11px] text-amber-700 font-semibold mt-2">
          Usando {Math.round(pct)}% de tu límite
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
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-10 text-center">
        <Crown size={26} className="text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Sin plan activo</h1>
        <p className="text-sm text-[#525252] mt-2 max-w-xl mx-auto leading-relaxed">
          El plan queda asociado al puesto cuando Jere aprueba la solicitud.
        </p>
        <Link href="/planes" className="v3-admin-btn-accent mt-5 inline-flex">
          Ver planes
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Editorial header */}
      <section>
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
          <span className="w-5 h-px bg-[#3B82F6]" />
          Suscripción
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-[1.05] text-[#0A0A0A]">
          Tu plan <span className="text-[#3B82F6]">{plan.nombre}</span>
        </h1>
        <p className="text-[#525252] text-sm mt-2">
          Cuánto usás, qué incluye y cómo te comparás con los otros planes.
        </p>
      </section>

      {/* Current plan card — editorial dark */}
      <section className="rounded-2xl bg-[#0A0A0A] text-white p-6 sm:p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background: currentPlanKey === "oro"
              ? "radial-gradient(circle at 85% 25%, rgba(245,158,11,0.4) 0%, transparent 55%)"
              : "radial-gradient(circle at 85% 25%, rgba(59,130,246,0.45) 0%, transparent 55%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Plan actual</span>
              <span className={`v3-admin-badge ${puestero.estadoPago === "pagado" ? "v3-admin-badge-success" : "v3-admin-badge-warning"}`}>
                {puestero.estadoPago === "pagado" ? "Al día" : "Pendiente"}
              </span>
            </div>
            <h2 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-[-0.04em]">
              {plan.nombre}
            </h2>
            <p className="text-sm text-white/60 mt-3">
              Se renueva el <strong className="text-white">{formatFechaLarga(puestero.fechaProximoCobro)}</strong>
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">{formatPrecio(plan.precio)}</p>
            <p className="text-sm text-white/60 mt-1">por mes</p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
            <span className="w-5 h-px bg-[#525252]" />
            Consumo
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0A]">
            Uso de tu plan
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <UsageBar label="Publicaciones" used={productos.length} total={plan.maxPublicaciones} icon={Package} color="bg-[#3B82F6]" />
          <UsageBar label="Fotos totales" used={fotosUsadas} total={plan.maxFotosTotal} icon={Image} color="bg-emerald-500" />
          <UsageBar label="Videos" used={0} total={plan.maxVideos} icon={Video} color="bg-purple-500" />
          <UsageBar label="Consultas WhatsApp" used={0} total={999} icon={MessageCircle} color="bg-green-500" />
        </div>
      </section>

      {/* Features included */}
      <section>
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
            <span className="w-5 h-px bg-[#525252]" />
            Beneficios
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0A]">
            Lo que incluye
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div key={f.label} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#0A0A0A]/06">
              <div className="w-9 h-9 rounded-xl bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-500/20">
                <f.icon size={15} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A0A0A]">{f.label}</p>
                <p className="text-xs text-[#737373] mt-0.5 leading-snug">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare plans */}
      <section>
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
            <span className="w-5 h-px bg-[#525252]" />
            Comparativa
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0A]">
            Los tres planes
          </h2>
        </div>

        <div className="bg-white border border-[#0A0A0A]/06 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0A0A0A]/08 bg-[#FAFAF7]">
                  <th className="text-left py-4 px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#737373]">Característica</th>
                  {(["bronce", "plata", "oro"] as const).map((key) => {
                    const isCurrent = puestero.plan === key;
                    return (
                      <th
                        key={key}
                        className={`text-center py-4 px-3 text-[10px] font-bold uppercase tracking-[0.12em] ${
                          isCurrent ? "text-[#0A0A0A] bg-blue-50/50" : "text-[#737373]"
                        }`}
                      >
                        {planConfig[key].nombre} {isCurrent && "★"}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A0A0A]/06">
                {[
                  { feature: "Precio mensual", get: (k: "bronce" | "plata" | "oro") => formatPrecio(planConfig[k].precio) },
                  { feature: "Publicaciones", get: (k: "bronce" | "plata" | "oro") => String(planConfig[k].maxPublicaciones) },
                  { feature: "Fotos totales", get: (k: "bronce" | "plata" | "oro") => String(planConfig[k].maxFotosTotal) },
                  { feature: "Videos", get: (k: "bronce" | "plata" | "oro") => planConfig[k].maxVideos > 0 ? String(planConfig[k].maxVideos) : "—" },
                  { feature: "Publicación destacada", get: (k: "bronce" | "plata" | "oro") => planConfig[k].publicacionDestacada ? true : "—" },
                  { feature: "Publicidad + Video", get: (k: "bronce" | "plata" | "oro") => planConfig[k].publicidadVideo ? true : "—" },
                  { feature: "IA en imágenes", get: (k: "bronce" | "plata" | "oro") => planConfig[k].iaImagenes ? true : "—" },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3.5 px-5 text-[#0A0A0A] font-medium">{row.feature}</td>
                    {(["bronce", "plata", "oro"] as const).map((key) => {
                      const val = row.get(key);
                      const isCurrent = puestero.plan === key;
                      return (
                        <td
                          key={key}
                          className={`text-center py-3.5 px-3 tabular-nums ${isCurrent ? "bg-blue-50/50 font-bold text-[#0A0A0A]" : "text-[#525252]"}`}
                        >
                          {val === true ? (
                            <Check size={15} className="inline text-emerald-600" />
                          ) : val === "—" ? (
                            <span className="text-[#A3A3A3]">—</span>
                          ) : (
                            <span>{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#0A0A0A]/06 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAFAF7]">
            <p className="text-sm text-[#525252]">¿Querés cambiar de plan?</p>
            <Link href="/planes" className="v3-admin-btn-accent">
              Ver todos los planes
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
