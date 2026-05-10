"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  RefreshCw,
  Truck,
  Crown,
  CircleDot,
  CalendarDays,
  Edit2,
  Save,
  X,
  Check,
  Store,
} from "lucide-react";
import { useCurrentPuestero, useCurrentPlan } from "@/lib/current-puestero";
import { useStore } from "@/store/useStore";
import { PhotoUploader } from "@/components/PhotoUploader";
import clsx from "clsx";

function formatPrecio(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

function formatFechaLarga(iso: string) {
  const d = new Date(iso);
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
}

function formatFechaCorta(iso: string) {
  const d = new Date(iso);
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d.getDate()} de ${meses[d.getMonth()]}`;
}

function planBadge(plan: "bronce" | "plata" | "oro") {
  if (plan === "oro") return "bg-amber-100 text-amber-700";
  if (plan === "plata") return "bg-slate-100 text-slate-700";
  return "bg-orange-100 text-orange-700";
}

export default function MiLocalPage() {
  const puestero = useCurrentPuestero();
  const plan = useCurrentPlan();
  const { updatePuestero } = useStore();
  const [editing, setEditing] = useState(false);

  // Form state
  const [nombreComercial, setNombreComercial] = useState(puestero?.nombreComercial ?? "");
  const [nombreResponsable, setNombreResponsable] = useState(puestero?.nombreResponsable ?? "");
  const [telefono, setTelefono] = useState(puestero?.telefono ?? "");
  const [email, setEmail] = useState(puestero?.email ?? "");
  const [logoUrl, setLogoUrl] = useState(puestero?.logoUrl ?? "");
  const [aceptaTransferencia, setAceptaTransferencia] = useState(puestero?.aceptaTransferencia ?? false);
  const [aceptaCambios, setAceptaCambios] = useState(puestero?.aceptaCambios ?? false);
  const [realizaEnvios, setRealizaEnvios] = useState(puestero?.realizaEnvios ?? false);

  function startEdit() {
    if (!puestero) return;
    // Reset form to current values each time we open
    setNombreComercial(puestero.nombreComercial);
    setNombreResponsable(puestero.nombreResponsable);
    setTelefono(puestero.telefono);
    setEmail(puestero.email);
    setLogoUrl(puestero.logoUrl ?? "");
    setAceptaTransferencia(puestero.aceptaTransferencia);
    setAceptaCambios(puestero.aceptaCambios);
    setRealizaEnvios(puestero.realizaEnvios);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    if (!puestero) return;
    if (!nombreComercial.trim() || !nombreResponsable.trim()) return;
    updatePuestero(puestero.id, {
      nombreComercial: nombreComercial.trim(),
      nombreResponsable: nombreResponsable.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      logoUrl,
      aceptaTransferencia,
      aceptaCambios,
      realizaEnvios,
    });
    setEditing(false);
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors";

  if (!puestero) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Store size={26} className="text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Sin local activo</h1>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          Cuando una solicitud sea aprobada, acá se van a editar el WhatsApp,
          la información visible del puesto y los servicios que ofrece.
        </p>
      </div>
    );
  }

  const datosGrid = [
    { icon: MapPin, label: "Ubicación", value: `Fila ${puestero.fila}, Puesto ${puestero.numeroPuesto}` },
    { icon: Phone, label: "Teléfono", value: puestero.telefono || "No registrado" },
    { icon: Mail, label: "Email", value: puestero.email || "No registrado" },
    { icon: CalendarDays, label: "Fecha de alta", value: formatFechaLarga(puestero.fechaAlta) },
  ];

  const servicios = [
    { icon: CreditCard, label: "Acepta transferencia", active: puestero.aceptaTransferencia },
    { icon: RefreshCw, label: "Acepta cambios", active: puestero.aceptaCambios },
    { icon: Truck, label: "Realiza envíos", active: puestero.realizaEnvios },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mi Local</h1>
          <p className="text-sm text-gray-500 mt-1">
            Información de tu puesto en Paseo 96
          </p>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Edit2 size={14} />
            Editar datos
          </button>
        )}
      </div>

      {/* ── MODO EDICIÓN ── */}
      {editing && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6 space-y-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-blue-900 uppercase tracking-wider">
              Editando información
            </h2>
            <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Logo del local */}
          <div className="max-w-xs">
            <PhotoUploader
              label="Logo del local (opcional)"
              value={logoUrl}
              onChange={setLogoUrl}
              folder={`logos/${puestero.fila}-${puestero.numeroPuesto}-${puestero.gmailAcceso}`}
            />
            <p className="text-xs text-gray-500 mt-2">
              Si no subís logo, se muestran las iniciales <strong>{puestero.logoIniciales}</strong> con tu color de marca.
            </p>
          </div>

          {/* Nombres */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Nombre comercial *
              </label>
              <input
                className={inputClass}
                value={nombreComercial}
                onChange={(e) => setNombreComercial(e.target.value)}
                placeholder="Ej: Moda Urbana"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Nombre del responsable *
              </label>
              <input
                className={inputClass}
                value={nombreResponsable}
                onChange={(e) => setNombreResponsable(e.target.value)}
                placeholder="Nombre y apellido"
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Teléfono / WhatsApp
              </label>
              <input
                className={inputClass}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="549112345678"
              />
              <p className="text-xs text-gray-400 mt-1">
                Sin espacios ni guiones. Ej: 5491155001234
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">
                Email
              </label>
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Servicios */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2.5">
              Servicios que ofrecés
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Acepta transferencia", icon: CreditCard, val: aceptaTransferencia, set: setAceptaTransferencia },
                { label: "Acepta cambios", icon: RefreshCw, val: aceptaCambios, set: setAceptaCambios },
                { label: "Realiza envíos", icon: Truck, val: realizaEnvios, set: setRealizaEnvios },
              ].map(({ label, icon: Icon, val, set }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => set(!val)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                    val
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  <Icon size={15} />
                  {label}
                  {val && <Check size={13} className="ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-blue-100">
            <button
              onClick={cancelEdit}
              className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Save size={14} />
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Identidad del local
            </h2>
            <div className="flex items-start gap-5">
              {puestero.logoUrl ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white relative shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={puestero.logoUrl} alt={puestero.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
                  style={{ backgroundColor: puestero.color }}
                >
                  {puestero.logoIniciales}
                </div>
              )}
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Nombre comercial</label>
                  <p className="font-semibold text-gray-900 text-lg">{puestero.nombreComercial}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Responsable</label>
                  <p className="text-sm text-gray-700">{puestero.nombreResponsable}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${planBadge(puestero.plan)}`}>
                    {puestero.plan === "oro" && <Crown size={12} />}
                    Plan {plan.nombre}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      puestero.estadoActividad === "activo"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <CircleDot size={12} />
                    {puestero.estadoActividad === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Details grid */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Datos del puesto
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {datosGrid.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mt-0.5">
                    <item.icon size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Servicios ofrecidos
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {servicios.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    s.active
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <s.icon
                    size={18}
                    className={s.active ? "text-emerald-600" : "text-gray-400"}
                  />
                  <span
                    className={`text-sm font-medium ${
                      s.active ? "text-emerald-700" : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right ── */}
        <div className="space-y-6">
          {/* Logo */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Logo del local
            </h2>
            {puestero.logoUrl ? (
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white relative mb-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={puestero.logoUrl} alt={puestero.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center text-white mb-4"
                style={{ backgroundColor: puestero.color }}
              >
                <span className="text-5xl font-bold">{puestero.logoIniciales}</span>
                <span className="text-xs text-white/70 mt-2">{puestero.nombreComercial}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 text-center">
              {puestero.logoUrl
                ? "Para cambiarlo, tocá Editar datos arriba."
                : "Tocá Editar datos arriba para subir tu logo."}
            </p>
          </section>

          {/* Next payment */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Próximo cobro
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {formatFechaCorta(puestero.fechaProximoCobro)}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(puestero.fechaProximoCobro).getFullYear()}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Plan {plan.nombre}</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatPrecio(plan.precio)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
