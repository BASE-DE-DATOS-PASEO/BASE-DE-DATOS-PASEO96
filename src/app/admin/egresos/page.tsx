"use client";

import Header from "@/components/admin/Header";
import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  TrendingDown,
  Wallet,
  Calendar,
  Tag as TagIcon,
} from "lucide-react";
import clsx from "clsx";
import type { Egreso } from "@/lib/mock-data";
import { categoriasEgreso, formatPrecio } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function categoriaInfo(value: string) {
  return (
    categoriasEgreso.find((c) => c.value === value) ?? {
      value,
      label: value,
      color: "bg-gray-100 text-muted",
    }
  );
}

export default function EgresosPage() {
  const { egresos, deleteEgreso } = useStore();
  const today = new Date();

  const [search, setSearch] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Egreso | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const egresosOrdenados = [...egresos].sort((a, b) =>
    a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0
  );

  const filtered = egresosOrdenados.filter((e) => {
    const matchSearch =
      e.concepto.toLowerCase().includes(search.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(search.toLowerCase());
    const matchCat = filtroCategoria === "todas" || e.categoria === filtroCategoria;
    return matchSearch && matchCat;
  });

  const totalGeneral = egresos.reduce((sum, e) => sum + e.monto, 0);
  const totalMes = egresos
    .filter((e) => {
      const d = new Date(e.fecha);
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    })
    .reduce((sum, e) => sum + e.monto, 0);
  const totalFiltrado = filtered.reduce((sum, e) => sum + e.monto, 0);

  const egresoAEliminar = confirmDeleteId
    ? egresos.find((e) => e.id === confirmDeleteId) ?? null
    : null;

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(e: Egreso) {
    setEditing(e);
    setShowForm(true);
  }

  return (
    <>
      <Header
        title="Egresos"
        subtitle="Gastos del negocio. Publicidad, hosting, diseño, operativos."
        action={
          <button onClick={openNew} className="v3-admin-btn-accent">
            <Plus size={14} />
            <span className="hidden sm:inline">Nuevo egreso</span>
          </button>
        }
      />

      <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#CBD5E1] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11.5px] font-medium text-[#64748B]">Este mes</p>
              <TrendingDown size={13} className="text-rose-500" strokeWidth={1.8} />
            </div>
            <p className="text-[22px] font-semibold text-rose-600 tabular-nums tracking-tight">
              {formatPrecio(totalMes)}
            </p>
            <p className="text-[11.5px] text-[#94A3B8] mt-1">
              {MESES[today.getMonth()]} {today.getFullYear()}
            </p>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#CBD5E1] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11.5px] font-medium text-[#64748B]">Total histórico</p>
              <Wallet size={13} className="text-[#94A3B8]" strokeWidth={1.8} />
            </div>
            <p className="text-[22px] font-semibold text-[#0F172A] tabular-nums tracking-tight">
              {formatPrecio(totalGeneral)}
            </p>
            <p className="text-[11.5px] text-[#94A3B8] mt-1">
              {egresos.length} {egresos.length === 1 ? "egreso" : "egresos"}
            </p>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#CBD5E1] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11.5px] font-medium text-[#64748B]">Filtrado</p>
              <TagIcon size={13} className="text-[#94A3B8]" strokeWidth={1.8} />
            </div>
            <p className="text-[22px] font-semibold text-[#0F172A] tabular-nums tracking-tight">
              {formatPrecio(totalFiltrado)}
            </p>
            <p className="text-[11.5px] text-[#94A3B8] mt-1">
              {filtered.length} en la vista
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar por concepto o descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[13.5px] bg-white border border-[#E2E8F0] rounded-md text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar bg-[#F1F5F9] p-1 rounded-md w-fit">
            <button
              onClick={() => setFiltroCategoria("todas")}
              className={clsx(
                "shrink-0 px-3 py-1.5 text-[12.5px] font-medium rounded transition-all",
                filtroCategoria === "todas"
                  ? "bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                  : "text-[#64748B] hover:text-[#0F172A]"
              )}
            >
              Todas
            </button>
            {categoriasEgreso.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFiltroCategoria(cat.value)}
                className={clsx(
                  "shrink-0 px-3 py-1.5 text-[12.5px] font-medium rounded transition-all",
                  filtroCategoria === cat.value
                    ? "bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {filtered.length > 0 ? (
          <div className="bg-white border border-[#0A0A0A]/06 rounded-2xl overflow-hidden">
            {/* Header tabla — desktop */}
            <div className="hidden sm:grid grid-cols-[110px_1fr_140px_140px_88px] gap-3 px-5 py-3 border-b border-[#0A0A0A]/06 bg-[#FAFAF7] text-[11px] font-bold uppercase tracking-[0.12em] text-[#737373]">
              <span>Fecha</span>
              <span>Concepto</span>
              <span>Categoría</span>
              <span className="text-right">Monto</span>
              <span className="text-right">Acciones</span>
            </div>

            <ul className="divide-y divide-[#0A0A0A]/06">
              {filtered.map((e) => {
                const cat = categoriaInfo(e.categoria);
                const fecha = new Date(e.fecha);
                const fechaCorta = fecha.toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "short",
                });
                return (
                  <li
                    key={e.id}
                    className="grid grid-cols-1 sm:grid-cols-[110px_1fr_140px_140px_88px] gap-3 px-5 py-4 hover:bg-[#FAFAF7] transition-colors"
                  >
                    {/* Fecha */}
                    <div className="flex items-center gap-1.5 text-[13px] text-[#525252] tabular-nums">
                      <Calendar size={12} className="text-[#94A3B8] sm:hidden" />
                      <span className="font-medium">{fechaCorta}</span>
                    </div>

                    {/* Concepto + descripción */}
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#0A0A0A] truncate">
                        {e.concepto}
                      </p>
                      {e.descripcion && (
                        <p className="text-[12px] text-[#737373] truncate mt-0.5">
                          {e.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Categoría */}
                    <div className="flex items-center">
                      <span
                        className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold",
                          cat.color
                        )}
                      >
                        {cat.label}
                      </span>
                    </div>

                    {/* Monto */}
                    <div className="flex items-center sm:justify-end">
                      <p className="text-[15px] font-extrabold text-[#0A0A0A] tabular-nums tracking-tight">
                        {formatPrecio(e.monto)}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 sm:justify-end">
                      <button
                        onClick={() => openEdit(e)}
                        className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252] hover:text-[#0A0A0A] transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(e.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 text-[#525252] hover:text-rose-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white py-16 text-center">
            <Wallet size={32} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-bold text-[#0A0A0A]">
              {egresos.length === 0 ? "Sin egresos cargados" : "Sin resultados"}
            </p>
            <p className="text-sm text-[#737373] mt-1">
              {egresos.length === 0
                ? "Cargá el primer egreso para empezar"
                : "Probá cambiar el filtro o la búsqueda"}
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <EgresoForm
          egreso={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {egresoAEliminar && (
        <ConfirmDeleteModal
          title="¿Borrar este egreso?"
          message={`¿Seguro que querés borrar “${egresoAEliminar.concepto}” por ${formatPrecio(
            egresoAEliminar.monto
          )}? No se puede deshacer.`}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            deleteEgreso(egresoAEliminar.id);
            setConfirmDeleteId(null);
          }}
        />
      )}
    </>
  );
}

/* ── Formulario ── */

function EgresoForm({
  egreso,
  onClose,
}: {
  egreso: Egreso | null;
  onClose: () => void;
}) {
  const { addEgreso, updateEgreso } = useStore();
  const isEditing = !!egreso;

  const [concepto, setConcepto] = useState(egreso?.concepto ?? "");
  const [categoria, setCategoria] = useState<Egreso["categoria"]>(
    egreso?.categoria ?? "operativo"
  );
  const [monto, setMonto] = useState<string>(
    egreso?.monto !== undefined ? String(egreso.monto) : ""
  );
  const [fecha, setFecha] = useState(
    egreso?.fecha ?? new Date().toISOString().split("T")[0]
  );
  const [descripcion, setDescripcion] = useState(egreso?.descripcion ?? "");
  const [submitting, setSubmitting] = useState(false);

  const montoNum = Number(monto);
  const canSave =
    concepto.trim().length > 0 && montoNum > 0 && fecha.length > 0 && !submitting;

  function handleSave() {
    if (!canSave) return;
    setSubmitting(true);
    const payload: Omit<Egreso, "id"> = {
      concepto: concepto.trim(),
      categoria,
      monto: montoNum,
      fecha,
      descripcion: descripcion.trim(),
    };
    if (isEditing) {
      updateEgreso(egreso.id, payload);
    } else {
      addEgreso(payload);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-0 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:mx-4 sm:rounded-3xl border border-[#0A0A0A]/08">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#0A0A0A]/06 bg-white/95 backdrop-blur-md px-6 py-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
              {isEditing ? "Editar" : "Crear"}
            </span>
            <h3 className="text-xl font-bold text-[#0A0A0A] tracking-tight mt-0.5 truncate max-w-xs">
              {isEditing ? egreso.concepto : "Nuevo egreso"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252]"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Concepto */}
          <Field label="Concepto" required>
            <input
              type="text"
              value={concepto}
              onChange={(ev) => setConcepto(ev.target.value)}
              placeholder="Ej: Publicidad Instagram"
              className="v3-admin-input"
            />
          </Field>

          {/* Fecha + Categoría */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Fecha" required>
              <input
                type="date"
                value={fecha}
                onChange={(ev) => setFecha(ev.target.value)}
                className="v3-admin-input"
              />
            </Field>
            <Field label="Categoría" required>
              <select
                value={categoria}
                onChange={(ev) =>
                  setCategoria(ev.target.value as Egreso["categoria"])
                }
                className="v3-admin-input"
              >
                {categoriasEgreso.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Monto */}
          <Field label="Monto" required>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#737373] font-semibold">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={monto}
                onChange={(ev) => setMonto(ev.target.value)}
                placeholder="0"
                className="v3-admin-input pl-8 tabular-nums"
              />
            </div>
          </Field>

          {/* Descripción */}
          <Field label="Descripción" hint="Detalle opcional">
            <textarea
              value={descripcion}
              onChange={(ev) => setDescripcion(ev.target.value)}
              placeholder="Notas, proveedor, número de factura…"
              rows={3}
              className="v3-admin-input resize-none"
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#0A0A0A]/06 px-6 py-4 flex items-center justify-end gap-2 sm:gap-3">
          <button onClick={onClose} className="v3-admin-btn-ghost">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="v3-admin-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? "Guardar cambios" : "Crear egreso"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#525252] block mb-1.5">
        {label} {required && <span className="text-[#3B82F6]">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-[#A3A3A3] block mt-1">{hint}</span>}
    </label>
  );
}

function ConfirmDeleteModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-egreso-title"
        className="relative mx-0 w-full max-w-sm rounded-t-3xl bg-white shadow-2xl sm:mx-4 sm:rounded-2xl border border-[#0A0A0A]/08"
      >
        <div className="px-6 pt-6 pb-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-3">
            <Trash2 size={18} className="text-rose-600" />
          </div>
          <h3
            id="confirm-delete-egreso-title"
            className="text-lg font-bold text-[#0A0A0A] tracking-tight"
          >
            {title}
          </h3>
          <p className="text-sm text-[#525252] mt-1.5 leading-relaxed">{message}</p>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#0A0A0A]/06 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
          <button onClick={onCancel} className="v3-admin-btn-ghost">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
          >
            Sí, borrar
          </button>
        </div>
      </div>
    </div>
  );
}
