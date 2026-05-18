"use client";

import Header from "@/components/admin/Header";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Mail,
  Package,
  Eye,
  EyeOff,
  Check,
  X,
  Truck,
  CreditCard,
  RefreshCw,
  Calendar,
  Edit2,
  Save,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPrecio } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export default function PuesteroDetalle() {
  const params = useParams();
  const router = useRouter();
  const { puesteros, productos, categorias, updatePuestero } = useStore();
  const id = Number(params.id);
  const puesto = puesteros.find((p) => p.id === id);

  const [showEdit, setShowEdit] = useState(false);

  if (!puesto) {
    return (
      <>
        <Header title="Puesto no encontrado" />
        <div className="p-4 text-center text-muted sm:p-8">
          <p>Este puesto no existe.</p>
          <Link href="/admin/puesteros" className="text-accent mt-4 inline-block">
            Volver al listado
          </Link>
        </div>
      </>
    );
  }

  const productosPuesto = productos.filter((p) => p.puesteroId === puesto.id);

  return (
    <>
      <Header title={puesto.nombreComercial} />
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/admin/puesteros")}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>

        {/* Header card */}
        <div className="mb-6 rounded-xl border border-[#0A0A0A]/06 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <Store size={28} className="text-accent" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {puesto.nombreComercial}
                </h2>
                <p className="text-muted text-sm">{puesto.nombreResponsable}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={clsx(
                      "flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
                      puesto.estadoActividad === "activo"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-[#FAFAF7] text-muted"
                    )}
                  >
                    {puesto.estadoActividad === "activo" ? (
                      <>
                        <Eye size={12} /> Activo
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Inactivo
                      </>
                    )}
                  </span>
                  <span
                    className={clsx(
                      "text-xs font-medium px-2.5 py-1 rounded-full",
                      puesto.estadoPago === "pagado"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-amber-400/10 text-amber-400"
                    )}
                  >
                    {puesto.estadoPago === "pagado" ? "Al día" : "Pago pendiente"}
                  </span>
                  <span
                    className={clsx(
                      "text-xs font-medium px-2.5 py-1 rounded-full",
                      puesto.plan === "oro"
                        ? "bg-amber-400/10 text-amber-500"
                        : puesto.plan === "plata"
                          ? "bg-slate-400/10 text-slate-500"
                          : "bg-amber-700/10 text-amber-700"
                    )}
                  >
                    Plan {puesto.plan.charAt(0).toUpperCase() + puesto.plan.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <Edit2 size={14} /> Editar puesto
            </button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3 lg:gap-6">
          {/* Datos */}
          <div className="bg-white border border-[#0A0A0A]/06 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Información</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <MapPin size={16} className="text-muted" />
                <span>
                  Fila {puesto.fila}, Puesto N° {puesto.numeroPuesto}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Phone size={16} className="text-muted" />
                <span>{puesto.telefono}</span>
              </div>
              {puesto.email && (
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Mail size={16} className="text-muted" />
                  <span>{puesto.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Calendar size={16} className="text-muted" />
                <span>Alta: {puesto.fechaAlta}</span>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="bg-white border border-[#0A0A0A]/06 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Servicios</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <CreditCard size={16} /> Transferencia
                </span>
                {puesto.aceptaTransferencia ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Check size={14} /> Sí
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#A3A3A3]">
                    <X size={14} /> No
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <RefreshCw size={16} /> Cambios
                </span>
                {puesto.aceptaCambios ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Check size={14} /> Sí
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#A3A3A3]">
                    <X size={14} /> No
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <Truck size={16} /> Envíos
                </span>
                {puesto.realizaEnvios ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Check size={14} /> Sí
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#A3A3A3]">
                    <X size={14} /> No
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Productos resumen */}
          <div className="bg-white border border-[#0A0A0A]/06 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Productos</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">
                {productosPuesto.length}
              </p>
              <p className="text-sm text-muted mt-1">
                de {puesto.limiteProductos} disponibles
              </p>
              <div className="w-full bg-[#FAFAF7] rounded-full h-3 mt-3">
                <div
                  className={clsx(
                    "h-3 rounded-full transition-all",
                    productosPuesto.length >= puesto.limiteProductos
                      ? "bg-red-400"
                      : productosPuesto.length >= puesto.limiteProductos * 0.7
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                  )}
                  style={{
                    width: `${Math.min(100, (productosPuesto.length / puesto.limiteProductos) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted mt-2">
                {puesto.limiteProductos - productosPuesto.length} lugares restantes
              </p>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {puesto.observaciones && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Nota interna:</span>{" "}
              {puesto.observaciones}
            </p>
          </div>
        )}

        {/* Productos del puesto */}
        <div className="bg-white border border-[#0A0A0A]/06 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Productos de este puesto
            </h3>
            <Link
              href="/admin/productos"
              className="text-sm text-accent hover:text-accent-hover font-medium"
            >
              + Agregar producto
            </Link>
          </div>
          {productosPuesto.length > 0 ? (
            <div className="divide-y divide-border">
              {productosPuesto.map((prod) => (
                <div
                  key={prod.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg bg-[#FAFAF7] overflow-hidden flex items-center justify-center shrink-0">
                      {prod.imagenes[0] ? (
                        <Image
                          src={prod.imagenes[0]}
                          alt={prod.nombre}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-muted" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {prod.nombre}
                      </p>
                      <p className="text-xs text-muted">
                        {categorias.find((c) => c.id === prod.categoriaId)?.nombre ?? "Sin categoría"} ·{" "}
                        {prod.subcategoria}
                        {prod.talleDesde &&
                          ` · Talles ${prod.talleDesde} a ${prod.talleHasta}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatPrecio(prod.precioMinorista)}
                    </p>
                    {prod.precioMayorista && (
                      <p className="text-xs text-muted">
                        Mayorista: {formatPrecio(prod.precioMayorista)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-muted text-sm">
              Este puesto no tiene productos cargados todavía
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de edición ── */}
      {showEdit && (
        <EditPuesteroModal
          puesto={puesto}
          onClose={() => setShowEdit(false)}
          onSave={(data) => {
            updatePuestero(puesto.id, data);
            setShowEdit(false);
          }}
        />
      )}
    </>
  );
}

// ── Modal de edición inline ───────────────────────────────────
import type { Puestero } from "@/lib/mock-data";

function EditPuesteroModal({
  puesto,
  onClose,
  onSave,
}: {
  puesto: Puestero;
  onClose: () => void;
  onSave: (data: Partial<Puestero>) => void;
}) {
  const [nombreComercial, setNombreComercial] = useState(puesto.nombreComercial);
  const [nombreResponsable, setNombreResponsable] = useState(puesto.nombreResponsable);
  const [telefono, setTelefono] = useState(puesto.telefono);
  const [email, setEmail] = useState(puesto.email);
  const [fila, setFila] = useState(puesto.fila);
  const [numeroPuesto, setNumeroPuesto] = useState(String(puesto.numeroPuesto));
  const [plan, setPlan] = useState<"bronce" | "plata" | "oro">(puesto.plan);
  const [estadoActividad, setEstadoActividad] = useState<"activo" | "inactivo">(puesto.estadoActividad);
  const [aceptaTransferencia, setAceptaTransferencia] = useState(puesto.aceptaTransferencia);
  const [aceptaCambios, setAceptaCambios] = useState(puesto.aceptaCambios);
  const [realizaEnvios, setRealizaEnvios] = useState(puesto.realizaEnvios);
  const [observaciones, setObservaciones] = useState(puesto.observaciones);

  const planLimites: Record<"bronce" | "plata" | "oro", number> = {
    bronce: 4,
    plata: 10,
    oro: 20,
  };

  function handleSave() {
    if (!nombreComercial.trim() || !nombreResponsable.trim()) return;
    onSave({
      nombreComercial: nombreComercial.trim(),
      nombreResponsable: nombreResponsable.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      fila: fila.trim().toUpperCase(),
      numeroPuesto: Number(numeroPuesto) || puesto.numeroPuesto,
      plan,
      limiteProductos: planLimites[plan],
      estadoActividad,
      aceptaTransferencia,
      aceptaCambios,
      realizaEnvios,
      observaciones: observaciones.trim(),
    });
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-[#FAFAF7] border border-[#0A0A0A]/12 rounded-lg text-foreground placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30";
  const labelClass = "text-xs font-medium text-[#737373] block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-[#0A0A0A]/06 bg-white px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-[#0A0A0A]">Editar puesto</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#A3A3A3] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          {/* Nombres */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre comercial *</label>
              <input className={inputClass} value={nombreComercial} onChange={(e) => setNombreComercial(e.target.value)} placeholder="Ej: Moda Urbana" />
            </div>
            <div>
              <label className={labelClass}>Responsable *</label>
              <input className={inputClass} value={nombreResponsable} onChange={(e) => setNombreResponsable(e.target.value)} placeholder="Nombre y apellido" />
            </div>
          </div>

          {/* Contacto */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Teléfono / WhatsApp</label>
              <input className={inputClass} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="549..." />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@ejemplo.com" />
            </div>
          </div>

          {/* Ubicación */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fila</label>
              <input className={inputClass} value={fila} onChange={(e) => setFila(e.target.value)} placeholder="A, B, C..." maxLength={3} />
            </div>
            <div>
              <label className={labelClass}>Número de puesto</label>
              <input className={inputClass} type="number" value={numeroPuesto} onChange={(e) => setNumeroPuesto(e.target.value)} min={1} />
            </div>
          </div>

          {/* Plan y estado */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Plan</label>
              <select
                className={inputClass}
                value={plan}
                onChange={(e) => setPlan(e.target.value as "bronce" | "plata" | "oro")}
              >
                <option value="bronce">Bronce — $44.990</option>
                <option value="plata">Plata — $74.990</option>
                <option value="oro">Oro — $104.990</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select
                className={inputClass}
                value={estadoActividad}
                onChange={(e) => setEstadoActividad(e.target.value as "activo" | "inactivo")}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <label className={labelClass}>Servicios</label>
            <div className="flex flex-wrap gap-3">
              {[
                { key: "aceptaTransferencia", label: "Transferencia", val: aceptaTransferencia, set: setAceptaTransferencia },
                { key: "aceptaCambios", label: "Cambios", val: aceptaCambios, set: setAceptaCambios },
                { key: "realizaEnvios", label: "Envíos", val: realizaEnvios, set: setRealizaEnvios },
              ].map(({ key, label, val, set }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set(!val)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    val
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-[#FAFAF7] border-[#0A0A0A]/12 text-[#737373]"
                  )}
                >
                  {val ? <Check size={14} /> : <X size={14} />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className={labelClass}>Nota interna</label>
            <textarea
              className={inputClass + " resize-none"}
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones internas..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col gap-2 rounded-b-2xl border-t border-[#0A0A0A]/06 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-[#737373] hover:text-[#525252] border border-[#0A0A0A]/12 rounded-lg hover:bg-[#FAFAF7] transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors shadow-sm"
          >
            <Save size={14} /> Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
