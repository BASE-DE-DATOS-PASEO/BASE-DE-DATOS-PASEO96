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
  Crown,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { preciosPlanes, formatPrecio } from "@/lib/mock-data";
import type { Puestero } from "@/lib/mock-data";
import clsx from "clsx";

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
      <Header title="Puesteros" />
      <div className="p-8 max-w-6xl">
        {/* Resumen simple */}
        <div className="flex items-center gap-6 mb-8">
          <div>
            <p className="text-3xl font-bold text-foreground">{puesteros.length}</p>
            <p className="text-sm text-muted">puesteros totales</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-3xl font-bold text-emerald-500">
              {puesteros.filter((p) => p.estadoActividad === "activo").length}
            </p>
            <p className="text-sm text-muted">activos</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-3xl font-bold text-amber-500">
              {puesteros.filter((p) => p.estadoPago === "pendiente").length}
            </p>
            <p className="text-sm text-muted">con pago pendiente</p>
          </div>
        </div>

        {/* Buscador + botón */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre, fila o número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Nuevo puestero
          </button>
        </div>

        {/* Tabla simple */}
        <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider border-b border-gray-100 bg-gray-50">
            <div>Local</div>
            <div>Plan</div>
            <div>Pago</div>
            <div className="w-[120px] text-right">Acción</div>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map((p) => {
              const prods = productos.filter((pr) => pr.puesteroId === p.id);
              const isPaid = p.estadoPago === "pagado";
              return (
                <div
                  key={p.id}
                  className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors"
                >
                  {/* Local */}
                  <div className="flex items-center gap-3 min-w-0">
                    {p.logoUrl ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.logoUrl} alt={p.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.logoIniciales}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{p.nombreComercial}</p>
                      <p className="text-xs text-muted truncate">
                        {p.nombreResponsable} · Fila {p.fila} Puesto {p.numeroPuesto}
                      </p>
                      <p className="text-xs text-muted mt-0.5 sm:hidden">
                        {prods.length}/{p.limiteProductos} productos
                      </p>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                        p.plan === "oro"
                          ? "bg-amber-100 text-amber-700"
                          : p.plan === "plata"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-orange-100 text-orange-700"
                      )}
                    >
                      {p.plan === "oro" && <Crown size={12} />}
                      {p.plan.charAt(0).toUpperCase() + p.plan.slice(1)}
                    </span>
                    <span className="hidden md:inline text-xs text-muted">
                      {formatPrecio(preciosPlanes[p.plan])}
                    </span>
                  </div>

                  {/* Estado de pago */}
                  <div>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 size={12} />
                        Al día
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <AlertCircle size={12} />
                        Pendiente
                      </span>
                    )}
                  </div>

                  {/* Acción */}
                  <button
                    onClick={() => openEdit(p)}
                    className="w-full sm:w-[120px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
                  >
                    <Edit2 size={14} />
                    Ver / Editar
                  </button>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted text-sm">
              No se encontraron puesteros
            </div>
          )}
        </div>

        <p className="text-xs text-muted mt-4">
          Tocá <strong>Ver / Editar</strong> para cambiar cualquier dato del puestero: plan, estado de pago, contacto, servicios, etc.
        </p>
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

/* ── Formulario completo (el que ya tenía, ahora con eliminar) ── */

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold text-foreground">
            {isEditing ? `Editar: ${puestero.nombreComercial}` : "Nuevo puestero"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-50 text-muted">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Store size={16} className="text-accent" /> Datos del puesto
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Responsable *</label>
                <input type="text" value={nombreResponsable} onChange={(e) => setNombreResponsable(e.target.value)} placeholder="Ej: Carlos Méndez" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Nombre del local</label>
                <input type="text" value={nombreComercial} onChange={(e) => setNombreComercial(e.target.value)} placeholder="Ej: Moda Urbana" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-accent" /> Ubicación
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Fila *</label>
                <input type="text" value={fila} onChange={(e) => setFila(e.target.value)} placeholder="Ej: A" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Número *</label>
                <input type="number" value={numeroPuesto} onChange={(e) => setNumeroPuesto(Number(e.target.value))} placeholder="Ej: 12" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Phone size={16} className="text-accent" /> Contacto
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">WhatsApp *</label>
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="5491155001234" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Email (opcional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Gmail de acceso *</label>
                <input type="email" value={gmailAcceso} onChange={(e) => setGmailAcceso(e.target.value)} placeholder="local@gmail.com" className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package size={16} className="text-accent" /> Plan y estado
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Plan *</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value as "bronce" | "plata" | "oro")} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground">
                  <option value="bronce">Bronce · {formatPrecio(preciosPlanes.bronce)}</option>
                  <option value="plata">Plata · {formatPrecio(preciosPlanes.plata)}</option>
                  <option value="oro">Oro · {formatPrecio(preciosPlanes.oro)}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Pago</label>
                <select value={estadoPago} onChange={(e) => setEstadoPago(e.target.value as "pagado" | "pendiente")} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground">
                  <option value="pagado">Al día</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Actividad</label>
                <select value={estadoActividad} onChange={(e) => setEstadoActividad(e.target.value as "activo" | "inactivo")} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground">
                  <option value="activo">Activo (visible)</option>
                  <option value="inactivo">Inactivo (oculto)</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <input type="checkbox" checked={aceptaTransferencia} onChange={(e) => setAceptaTransferencia(e.target.checked)} className="w-4 h-4 rounded" />
                Acepta transferencia
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <input type="checkbox" checked={aceptaCambios} onChange={(e) => setAceptaCambios(e.target.checked)} className="w-4 h-4 rounded" />
                Acepta cambios
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <input type="checkbox" checked={realizaEnvios} onChange={(e) => setRealizaEnvios(e.target.checked)} className="w-4 h-4 rounded" />
                Realiza envíos
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Observaciones internas</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Notas sobre este puesto..." rows={2} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-foreground placeholder:text-muted resize-none" />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex items-center justify-between gap-3">
          {isEditing && puestero ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">¿Seguro?</span>
                <button
                  onClick={() => onDelete(puestero.id)}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Eliminar puestero
              </button>
            )
          ) : <span />}

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-muted border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-6 py-2.5 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg">
              {isEditing ? "Guardar cambios" : "Crear puestero"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
