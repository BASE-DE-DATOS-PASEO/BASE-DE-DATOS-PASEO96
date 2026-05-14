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
      <Header title="Solicitudes de alta" />
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card p-5 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-amber-500" />
              <p className="text-xs text-muted font-medium uppercase tracking-wider">Pendientes</p>
            </div>
            <p className="text-3xl font-bold text-amber-500">{pendientes.length}</p>
            <p className="text-xs text-muted mt-2">esperando tu aprobación</p>
          </div>
          <div className="stat-card p-5 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Check size={14} className="text-emerald-500" />
              <p className="text-xs text-muted font-medium uppercase tracking-wider">Aprobadas</p>
            </div>
            <p className="text-3xl font-bold text-emerald-500">{aprobadas}</p>
            <p className="text-xs text-muted mt-2">este mes</p>
          </div>
          <div className="stat-card p-5 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <X size={14} className="text-red-500" />
              <p className="text-xs text-muted font-medium uppercase tracking-wider">Rechazadas</p>
            </div>
            <p className="text-3xl font-bold text-red-500">{rechazadas}</p>
            <p className="text-xs text-muted mt-2">este mes</p>
          </div>
        </div>

        {/* Aviso informativo */}
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4">
          <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold">Cómo funciona</p>
            <p className="mt-0.5 text-blue-800">
              Cuando alguien se anota y te transfiere, aparece acá. Revisás el comprobante, verificás que la plata entró, y aprobás. Recién ahí el puestero puede subir productos.
            </p>
          </div>
        </div>

        {/* Listado */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Solicitudes pendientes
        </h2>

        {pendientes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center sm:p-12">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Check size={24} className="text-emerald-500" />
            </div>
            <p className="font-semibold text-foreground">¡Estás al día!</p>
            <p className="text-sm text-muted mt-1">No hay solicitudes pendientes por ahora.</p>
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
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
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
                <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                  <button
                    onClick={() => setDetalle(s)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <FileText size={14} />
                    Ver detalle + comprobante
                  </button>
                  <button
                    onClick={() => aprobar(s.id)}
                    disabled={requiereRevision}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 sm:ml-auto"
                  >
                    <Check size={14} />
                    Aprobar
                  </button>
                  <button
                    onClick={() => rechazar(s.id)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-foreground">Detalle de la solicitud</h3>
              <button
                onClick={() => setDetalle(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
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
              <div className="rounded-xl bg-gray-50 p-4">
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

            <div className="flex items-center gap-2 p-6 border-t border-gray-100">
              <button
                onClick={() => rechazar(detalle.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
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
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
      <CreditCard size={32} className="text-gray-400 mx-auto mb-2" />
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
