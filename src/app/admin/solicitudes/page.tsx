"use client";

import Header from "@/components/admin/Header";
import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock,
  Phone,
  Mail,
  MapPin,
  Crown,
  CreditCard,
  FileText,
  Banknote,
  Wallet,
  Store,
  Calendar,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "@/store/useStore";
import type { Solicitud } from "@/lib/mock-data";
import { createComprobanteSignedUrl } from "@/lib/storage";

/* ── Helpers ─────────────────────────────────────────────── */

function formatPrecio(n: number) {
  return `$ ${n.toLocaleString("es-AR")}`;
}

function formatFecha(iso: string) {
  const [, m, d] = iso.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} de ${meses[parseInt(m) - 1]}`;
}

function planColor(plan: "bronce" | "plata" | "oro") {
  if (plan === "oro") return "bg-amber-100 text-amber-800 border-amber-200";
  if (plan === "plata") return "bg-blue-100 text-blue-800 border-blue-200";
  return "bg-orange-100 text-orange-800 border-orange-200";
}

/* ── Página ──────────────────────────────────────────────── */

export default function SolicitudesPage() {
  const { solicitudes, puesteros, aprobarSolicitud, rechazarSolicitud } = useStore();
  const [detalle, setDetalle] = useState<Solicitud | null>(null);

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const aprobadas = solicitudes.filter((s) => s.estado === "aprobado").length;
  const rechazadas = solicitudes.filter((s) => s.estado === "rechazado").length;

  function aprobar(id: number) {
    aprobarSolicitud(id); // crea el puestero en el store automáticamente
    setDetalle(null);
  }

  function rechazar(id: number) {
    rechazarSolicitud(id);
    setDetalle(null);
  }

  return (
    <>
      <Header
        title="Solicitudes"
        subtitle="Puesteros nuevos que quieren sumarse a la feria."
      />
      <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">

        {/* KPIs simples */}
        <div className="grid grid-cols-3 gap-3">
          <KpiSmall label="Pendientes" value={pendientes.length} hint="esperan aprobación" icon={Clock} valueColor="text-amber-600" />
          <KpiSmall label="Aprobadas" value={aprobadas} hint="este mes" icon={Check} valueColor="text-emerald-600" />
          <KpiSmall label="Rechazadas" value={rechazadas} hint="este mes" icon={X} valueColor="text-rose-600" />
        </div>

        {/* Aviso info */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-[#3B82F6] shrink-0 mt-0.5" strokeWidth={2} />
          <div className="flex-1 text-[13px]">
            <p className="font-semibold text-[#0F172A]">Cómo funciona</p>
            <p className="text-[#475569] mt-0.5 leading-relaxed">
              Cuando alguien se anota y te transfiere, aparece acá. Revisás el comprobante,
              verificás que la plata entró en Lemon Cash, y aprobás. Recién ahí el puestero puede subir productos.
            </p>
          </div>
        </div>

        {/* Listado header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">
            Solicitudes pendientes
          </h2>
          {pendientes.length > 0 && (
            <span className="text-[12px] text-[#64748B] tabular-nums shrink-0">
              {pendientes.length} {pendientes.length === 1 ? "ítem" : "ítems"}
            </span>
          )}
        </div>

        {pendientes.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Check size={20} className="text-emerald-600" strokeWidth={2.2} />
            </div>
            <p className="text-[14px] font-semibold text-[#0F172A]">
              Estás al día
            </p>
            <p className="text-[12.5px] text-[#64748B] mt-1 max-w-sm mx-auto">
              No hay solicitudes pendientes por ahora.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendientes.map((s) => (
              (() => {
                const gmailEnUso = puesteros.some((p) => p.gmailAcceso === s.gmailAcceso);
                const puestoEnUso = puesteros.some(
                  (p) => p.fila.toLowerCase() === s.fila.toLowerCase() && p.numeroPuesto === s.numeroPuesto
                );
                // Solo exigimos comprobante en transferencia. En efectivo Jere
                // verifica físicamente la entrega de plata antes de aprobar.
                const faltaComprobante =
                  s.metodoPago === "transferencia" && !s.comprobanteUrl;
                const requiereRevision = gmailEnUso || puestoEnUso || faltaComprobante;

                return (
              <div
                key={s.id}
                className="v3-admin-card p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  {/* Avatar + datos principales */}
                  <div className="flex flex-1 items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shrink-0">
                      {s.nombreComercial.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{s.nombreComercial}</h3>
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                            planColor(s.planElegido)
                          )}
                        >
                          {s.planElegido === "oro" && <Crown size={10} />}
                          Plan {s.planElegido.charAt(0).toUpperCase() + s.planElegido.slice(1)}
                        </span>
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                            s.metodoPago === "efectivo"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          )}
                        >
                          {s.metodoPago === "efectivo" ? <Wallet size={10} /> : <Banknote size={10} />}
                          {s.metodoPago === "efectivo" ? "Efectivo" : "Transferencia"}
                        </span>
                      </div>
                      <p className="text-sm text-muted mt-0.5">{s.nombreResponsable}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> Fila {s.fila} · Puesto {s.numeroPuesto}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {s.telefono}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {s.gmailAcceso}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {formatFecha(s.fechaSolicitud)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Monto + acciones */}
                  <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted">
                        {s.metodoPago === "efectivo" ? "Efectivo" : "Transferencia (con IVA)"}
                      </p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatPrecio(s.montoTransferido)}
                      </p>
                    </div>
                  </div>
                </div>

                {requiereRevision && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <p className="font-semibold">Revisar antes de aprobar</p>
                    <ul className="mt-1 list-disc pl-5 text-xs space-y-0.5">
                      {gmailEnUso && <li>Este Gmail ya está vinculado a otro puesto.</li>}
                      {puestoEnUso && <li>La fila y número de puesto ya están ocupados.</li>}
                      {faltaComprobante && <li>No hay comprobante de transferencia cargado.</li>}
                    </ul>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="mt-4 flex flex-col gap-2 border-t border-[#0A0A0A]/06 pt-4 sm:flex-row sm:items-center">
                  <button
                    onClick={() => setDetalle(s)}
                    className="v3-admin-btn-ghost"
                  >
                    <FileText size={14} />
                    Ver detalle + comprobante
                  </button>
                  <button
                    onClick={() => aprobar(s.id)}
                    disabled={requiereRevision}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:ml-auto"
                  >
                    <Check size={14} />
                    Aprobar
                  </button>
                  <button
                    onClick={() => rechazar(s.id)}
                    className="v3-admin-btn-danger"
                  >
                    <X size={14} />
                    Rechazar
                  </button>
                </div>
              </div>
                );
              })()
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {detalle && (
        <div className="fixed inset-0 bg-[#0A0A0A]/40 z-[100] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto border border-[#0A0A0A]/08">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[#0A0A0A]/06 bg-white/95 backdrop-blur-md">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
                  Solicitud
                </span>
                <h3 className="text-xl font-bold text-[#0A0A0A] tracking-tight mt-0.5 truncate max-w-xs">
                  {detalle.nombreComercial}
                </h3>
              </div>
              <button
                onClick={() => setDetalle(null)}
                className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252] transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Datos del responsable */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Datos del puestero
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <Store size={14} className="text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted text-xs">Local</p>
                      <p className="font-medium text-foreground">{detalle.nombreComercial}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3.5" />
                    <div>
                      <p className="text-muted text-xs">Responsable</p>
                      <p className="font-medium text-foreground">{detalle.nombreResponsable}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={14} className="text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted text-xs">Ubicación</p>
                      <p className="font-medium text-foreground">Fila {detalle.fila} · Puesto {detalle.numeroPuesto}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone size={14} className="text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted text-xs">Teléfono</p>
                      <a href={`https://wa.me/${detalle.telefono.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">
                        {detalle.telefono}
                      </a>
                    </div>
                  </div>
                  {detalle.email && (
                    <div className="flex gap-2">
                      <Mail size={14} className="text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-muted text-xs">Email</p>
                        <p className="font-medium text-foreground">{detalle.email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Mail size={14} className="text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted text-xs">Gmail de acceso</p>
                      <p className="font-medium text-foreground">{detalle.gmailAcceso}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan y monto */}
              <div className="rounded-xl bg-[#FAFAF7] p-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Plan y pago
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted">Plan + método</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                          planColor(detalle.planElegido)
                        )}
                      >
                        {detalle.planElegido === "oro" && <Crown size={10} />}
                        Plan {detalle.planElegido.charAt(0).toUpperCase() + detalle.planElegido.slice(1)}
                      </span>
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                          detalle.metodoPago === "efectivo"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {detalle.metodoPago === "efectivo" ? <Wallet size={10} /> : <Banknote size={10} />}
                        {detalle.metodoPago === "efectivo" ? "Efectivo" : "Transferencia"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">
                      {detalle.metodoPago === "efectivo"
                        ? "A cobrar en efectivo"
                        : "Monto transferido (con IVA)"}
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatPrecio(detalle.montoTransferido)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comprobante o aviso de efectivo */}
              {detalle.metodoPago === "transferencia" ? (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Comprobante de transferencia
                  </p>
                  <ComprobanteBox key={detalle.comprobanteUrl ?? "sin-comprobante"} path={detalle.comprobanteUrl} />
                  <p className="text-xs text-muted mt-2">
                    Verificá en Lemon Cash que el monto entró antes de aprobar.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Pago en efectivo
                  </p>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <div className="flex items-start gap-2">
                      <Wallet size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Coordinar entrega</p>
                        <p className="text-xs text-emerald-800 mt-1">
                          Esta solicitud es por <strong>pago en efectivo</strong>. Hablá por WhatsApp con el puestero, recibí la plata en mano y recién ahí aprobá la solicitud.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Observaciones */}
              {detalle.observaciones && (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Observaciones
                  </p>
                  <p className="text-sm text-foreground bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    {detalle.observaciones}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center gap-2 p-6 border-t border-[#0A0A0A]/06 bg-white">
              <button
                onClick={() => rechazar(detalle.id)}
                className="flex-1 v3-admin-btn-danger"
              >
                <X size={16} />
                Rechazar
              </button>
              <button
                onClick={() => aprobar(detalle.id)}
                disabled={
                  (detalle.metodoPago === "transferencia" && !detalle.comprobanteUrl) ||
                  puesteros.some((p) => p.gmailAcceso === detalle.gmailAcceso) ||
                  puesteros.some(
                    (p) => p.fila.toLowerCase() === detalle.fila.toLowerCase() && p.numeroPuesto === detalle.numeroPuesto
                  )
                }
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <Check size={16} />
                Aprobar y activar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── KPI helper ── */
function KpiSmall({
  label,
  value,
  hint,
  icon: Icon,
  valueColor,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ElementType;
  valueColor: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#CBD5E1] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11.5px] font-medium text-[#64748B]">{label}</p>
        <Icon size={13} className="text-[#94A3B8]" strokeWidth={1.8} />
      </div>
      <p className={`text-[22px] font-semibold tabular-nums tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-[11.5px] text-[#94A3B8] mt-1">{hint}</p>
    </div>
  );
}

function ComprobanteBox({ path }: { path: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const directUrl = path && /^https?:\/\//.test(path) ? path : null;

  useEffect(() => {
    let alive = true;

    if (!path || directUrl) return;

    createComprobanteSignedUrl(path)
      .then((signedUrl) => {
        if (alive) setUrl(signedUrl);
      })
      .catch((err) => {
        console.error("[admin] comprobante signed url", err);
        if (alive) setError("No se pudo abrir el comprobante. Revisá las políticas de Storage.");
      });

    return () => {
      alive = false;
    };
  }, [path, directUrl]);

  const displayUrl = directUrl ?? url;

  return (
    <div className="rounded-xl border-2 border-dashed border-[#0A0A0A]/12 bg-[#FAFAF7] p-8 text-center">
      <CreditCard size={32} className="text-[#A3A3A3] mx-auto mb-2" />
      {!path ? (
        <p className="text-sm font-medium text-foreground">Sin comprobante</p>
      ) : displayUrl ? (
        <a
          href={displayUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Abrir comprobante
        </a>
      ) : (
        <p className="text-sm font-medium text-foreground">
          {error || "Preparando comprobante..."}
        </p>
      )}
      <p className="text-xs text-muted mt-1">
        {path ? "El enlace privado dura 10 minutos." : "Todavía no se cargó archivo."}
      </p>
    </div>
  );
}
