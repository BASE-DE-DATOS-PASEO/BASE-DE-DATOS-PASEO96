"use client";

import Header from "@/components/admin/Header";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Store,
  X,
  Phone,
  MapPin,
  Package,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { preciosPlanes, formatPrecio } from "@/lib/mock-data";
import type { Puestero } from "@/lib/mock-data";

export default function PuesterosPage() {
  const { puesteros, productos, deletePuestero } = useStore();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPuestero, setEditingPuestero] = useState<Puestero | null>(null);

  const filtered = puesteros.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombreResponsable.toLowerCase().includes(q) ||
      p.nombreComercial.toLowerCase().includes(q) ||
      p.fila.toLowerCase().includes(q) ||
      p.numeroPuesto.toString().includes(q)
    );
  });

  const totalActivos = puesteros.filter((p) => p.estadoActividad === "activo").length;
  const totalPendientes = puesteros.filter((p) => p.estadoPago === "pendiente").length;

  function openEdit(p: Puestero) {
    setEditingPuestero(p);
    setShowForm(true);
  }

  function openNew() {
    setEditingPuestero(null);
    setShowForm(true);
  }

  return (
    <>
      <Header
        eyebrow="Vendedores"
        title="Puesteros"
        subtitle="Cada local activo en la feria. Gestionás plan, pago y datos de contacto."
        action={
          <button onClick={openNew} className="v3-admin-btn-accent">
            <Plus size={15} />
            <span className="hidden sm:inline">Nuevo puestero</span>
          </button>
        }
      />

      <div className="max-w-6xl px-5 sm:px-8 lg:px-12 py-8 sm:py-10">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Totales</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] mt-2 tabular-nums tracking-tight">
              {puesteros.length}
            </p>
          </div>
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Activos</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 mt-2 tabular-nums tracking-tight">
              {totalActivos}
            </p>
          </div>
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Pendientes</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 mt-2 tabular-nums tracking-tight">
              {totalPendientes}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Buscar por nombre, fila o número de puesto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-[#0A0A0A]/08 rounded-2xl text-[#0A0A0A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#0A0A0A] focus:shadow-[0_0_0_4px_rgba(10,10,10,0.04)] transition-all"
            />
          </div>
        </div>

        {/* Listado puesteros */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white p-16 text-center">
            <Store size={28} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-bold text-[#0A0A0A]">No se encontraron puesteros</p>
            <p className="text-sm text-[#737373] mt-1">Probá con otro nombre o número.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((p) => {
              const prods = productos.filter((pr) => pr.puesteroId === p.id);
              const isPaid = p.estadoPago === "pagado";
              const planLabel = p.plan.charAt(0).toUpperCase() + p.plan.slice(1);

              return (
                <button
                  key={p.id}
                  onClick={() => openEdit(p)}
                  className="group w-full text-left bg-white border border-[#0A0A0A]/06 rounded-2xl px-4 py-4 sm:px-5 hover:border-[#0A0A0A]/20 hover:shadow-[0_12px_36px_-12px_rgba(10,10,10,0.12)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_auto] gap-4 sm:items-center">

                    {/* Local + ubicación */}
                    <div className="flex items-center gap-3 min-w-0">
                      {p.logoUrl ? (
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-white relative shrink-0 ring-1 ring-[#0A0A0A]/08">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.logoUrl} alt={p.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.logoIniciales}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-[#0A0A0A] truncate text-[15px]">{p.nombreComercial}</p>
                        <p className="text-xs text-[#737373] truncate mt-0.5">
                          {p.nombreResponsable} <span className="text-[#A3A3A3]">·</span> Fila {p.fila} · Puesto {p.numeroPuesto}
                        </p>
                      </div>
                    </div>

                    {/* Plan + productos */}
                    <div className="flex items-center gap-3 sm:gap-2 sm:flex-col sm:items-start text-[11px] text-[#737373]">
                      <div className="flex items-center gap-2">
                        {p.plan === "oro" || p.plan === "plata" ? (
                          <span className="v3-admin-badge v3-admin-badge-premium">{planLabel}</span>
                        ) : (
                          <span className="v3-admin-badge v3-admin-badge-neutral">{planLabel}</span>
                        )}
                        <span className="tabular-nums">{formatPrecio(preciosPlanes[p.plan])}</span>
                      </div>
                      <span className="text-[10.5px] sm:mt-0.5 flex items-center gap-1">
                        <Package size={11} />
                        {prods.length} / {p.limiteProductos} productos
                      </span>
                    </div>

                    {/* Estado pago */}
                    <div className="flex items-center gap-2">
                      {isPaid ? (
                        <span className="v3-admin-badge v3-admin-badge-success">
                          <CheckCircle2 size={11} />
                          Al día
                        </span>
                      ) : (
                        <span className="v3-admin-badge v3-admin-badge-danger">
                          <AlertCircle size={11} />
                          Pendiente
                        </span>
                      )}
                      {p.estadoActividad === "inactivo" && (
                        <span className="v3-admin-badge v3-admin-badge-neutral">Inactivo</span>
                      )}
                    </div>

                    {/* Action icon */}
                    <div className="hidden sm:flex items-center justify-end gap-1.5 text-[#737373] group-hover:text-[#0A0A0A] transition-colors">
                      <span className="text-xs font-semibold">Editar</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal formulario */}
      {showForm && (
        <PuesteroForm
          puestero={editingPuestero}
          onClose={() => setShowForm(false)}
          onDelete={(id) => {
            deletePuestero(id);
            setShowForm(false);
          }}
        />
      )}
    </>
  );
}

/* ── Formulario v3 ── */

function PuesteroForm({
  puestero,
  onClose,
  onDelete,
}: {
  puestero: Puestero | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}) {
  const { addPuestero, updatePuestero } = useStore();
  const isEditing = !!puestero;

  const [nombreResponsable, setNombreResponsable] = useState(puestero?.nombreResponsable ?? "");
  const [nombreComercial, setNombreComercial] = useState(puestero?.nombreComercial ?? "");
  const [fila, setFila] = useState(puestero?.fila ?? "");
  const [numeroPuesto, setNumeroPuesto] = useState(puestero?.numeroPuesto ?? 1);
  const [telefono, setTelefono] = useState(puestero?.telefono ?? "");
  const [email, setEmail] = useState(puestero?.email ?? "");
  const [gmailAcceso, setGmailAcceso] = useState(puestero?.gmailAcceso ?? "");
  const [aceptaTransferencia, setAceptaTransferencia] = useState(puestero?.aceptaTransferencia ?? false);
  const [aceptaCambios, setAceptaCambios] = useState(puestero?.aceptaCambios ?? false);
  const [realizaEnvios, setRealizaEnvios] = useState(puestero?.realizaEnvios ?? false);
  const [plan, setPlan] = useState<"bronce" | "plata" | "oro">(puestero?.plan ?? "bronce");
  const [estadoPago, setEstadoPago] = useState<"pagado" | "pendiente">(puestero?.estadoPago ?? "pendiente");
  const [estadoActividad, setEstadoActividad] = useState<"activo" | "inactivo">(puestero?.estadoActividad ?? "activo");
  const [observaciones, setObservaciones] = useState(puestero?.observaciones ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave() {
    const today = new Date().toISOString().split("T")[0];
    const limiteProductos = plan === "oro" ? 20 : plan === "plata" ? 10 : 4;
    const initials = nombreComercial
      ? nombreComercial.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : nombreResponsable.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    const data = {
      nombreResponsable,
      nombreComercial,
      fila,
      numeroPuesto,
      telefono,
      email,
      gmailAcceso: gmailAcceso.trim().toLowerCase(),
      aceptaTransferencia,
      aceptaCambios,
      realizaEnvios,
      plan,
      limiteProductos,
      estadoPago,
      observaciones,
      productosActivos: puestero?.productosActivos ?? 0,
      estadoActividad,
      fechaAlta: puestero?.fechaAlta ?? today,
      fechaProximoCobro: puestero?.fechaProximoCobro ?? today,
      color: puestero?.color ?? "#3B82F6",
      logoIniciales: initials,
    };

    if (isEditing && puestero) {
      updatePuestero(puestero.id, data);
    } else {
      addPuestero(data);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-0 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:mx-4 sm:rounded-3xl border border-[#0A0A0A]/08">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#0A0A0A]/06 bg-white/95 backdrop-blur-md px-6 py-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
              {isEditing ? "Editar" : "Crear"}
            </span>
            <h3 className="text-xl font-bold text-[#0A0A0A] tracking-tight mt-0.5">
              {isEditing ? puestero.nombreComercial : "Nuevo puestero"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252]" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-8 p-6">

          {/* ── Datos ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Store size={14} className="text-[#0A0A0A]" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A0A0A]">
                Datos del puesto
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Responsable" required>
                <input value={nombreResponsable} onChange={(e) => setNombreResponsable(e.target.value)} placeholder="Ej: Carlos Méndez" className="v3-admin-input" />
              </Field>
              <Field label="Nombre del local">
                <input value={nombreComercial} onChange={(e) => setNombreComercial(e.target.value)} placeholder="Ej: Moda Urbana" className="v3-admin-input" />
              </Field>
            </div>
          </section>

          {/* ── Ubicación ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-[#0A0A0A]" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A0A0A]">
                Ubicación
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fila" required>
                <input value={fila} onChange={(e) => setFila(e.target.value)} placeholder="A" className="v3-admin-input" />
              </Field>
              <Field label="Número de puesto" required>
                <input type="number" value={numeroPuesto} onChange={(e) => setNumeroPuesto(Number(e.target.value))} className="v3-admin-input tabular-nums" />
              </Field>
            </div>
          </section>

          {/* ── Contacto ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Phone size={14} className="text-[#0A0A0A]" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A0A0A]">
                Contacto
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="WhatsApp" required>
                <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="5491155001234" className="v3-admin-input" />
              </Field>
              <Field label="Email (opcional)">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="v3-admin-input" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Gmail de acceso" required hint="Con este Gmail entra al panel /mi-puesto">
                  <input type="email" value={gmailAcceso} onChange={(e) => setGmailAcceso(e.target.value)} placeholder="local@gmail.com" className="v3-admin-input" />
                </Field>
              </div>
            </div>
          </section>

          {/* ── Plan y estado ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package size={14} className="text-[#0A0A0A]" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A0A0A]">
                Plan y estado
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <Field label="Plan" required>
                <select value={plan} onChange={(e) => setPlan(e.target.value as "bronce" | "plata" | "oro")} className="v3-admin-input">
                  <option value="bronce">Bronce · {formatPrecio(preciosPlanes.bronce)}</option>
                  <option value="plata">Plata · {formatPrecio(preciosPlanes.plata)}</option>
                  <option value="oro">Oro · {formatPrecio(preciosPlanes.oro)}</option>
                </select>
              </Field>
              <Field label="Pago">
                <select value={estadoPago} onChange={(e) => setEstadoPago(e.target.value as "pagado" | "pendiente")} className="v3-admin-input">
                  <option value="pagado">Al día</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </Field>
              <Field label="Actividad">
                <select value={estadoActividad} onChange={(e) => setEstadoActividad(e.target.value as "activo" | "inactivo")} className="v3-admin-input">
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo (oculto)</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <CheckPill checked={aceptaTransferencia} onChange={setAceptaTransferencia} label="Acepta transferencia" />
              <CheckPill checked={aceptaCambios} onChange={setAceptaCambios} label="Acepta cambios" />
              <CheckPill checked={realizaEnvios} onChange={setRealizaEnvios} label="Realiza envíos" />
            </div>
          </section>

          {/* ── Observaciones ── */}
          <section>
            <Field label="Observaciones internas">
              <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Notas sobre este puesto…" rows={2} className="v3-admin-input resize-none" />
            </Field>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#0A0A0A]/06 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          {isEditing && puestero ? (
            confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-rose-700 font-semibold">¿Seguro?</span>
                <button onClick={() => onDelete(puestero.id)} className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                  Sí, eliminar
                </button>
                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-xs font-semibold text-[#525252] hover:text-[#0A0A0A]">
                  No
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="v3-admin-btn-danger">
                <Trash2 size={14} />
                Eliminar
              </button>
            )
          ) : <span />}

          <div className="flex gap-2 sm:gap-3 sm:ml-auto">
            <button onClick={onClose} className="v3-admin-btn-ghost">Cancelar</button>
            <button onClick={handleSave} className="v3-admin-btn">
              {isEditing ? "Guardar cambios" : "Crear puestero"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
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

function CheckPill({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-lg border text-sm transition-all ${
      checked
        ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
        : "bg-white text-[#0A0A0A] border-[#0A0A0A]/10 hover:border-[#0A0A0A]/30"
    }`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
        checked ? "bg-white border-white" : "border-[#0A0A0A]/25"
      }`}>
        {checked && <span className="w-2 h-2 rounded-sm bg-[#0A0A0A]" />}
      </span>
      <span className="font-medium">{label}</span>
    </label>
  );
}
