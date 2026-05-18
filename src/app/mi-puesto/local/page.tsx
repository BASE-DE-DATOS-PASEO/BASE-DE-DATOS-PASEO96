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
  if (plan === "oro") return "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 border border-amber-300/50";
  if (plan === "plata") return "bg-[#FAFAF7] text-[#525252] border border-[#0A0A0A]/12";
  return "bg-[#FAFAF7] text-[#525252] border border-[#0A0A0A]/08";
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

  const inputClass = "v3-admin-input";

  if (!puestero) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-10 text-center">
        <Store size={26} className="text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Sin local activo</h1>
        <p className="text-sm text-[#525252] mt-2 max-w-xl mx-auto leading-relaxed">
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
    <div className="space-y-10">
      {/* Editorial header */}
      <section className="flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
            <span className="w-5 h-px bg-[#3B82F6]" />
            Configuración
          </span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-[1.05] text-[#0A0A0A]">
            Mi local
          </h1>
          <p className="text-[#525252] text-sm mt-2">
            Identidad, contacto y servicios de tu puesto.
          </p>
        </div>
        {!editing && (
          <button onClick={startEdit} className="v3-admin-btn-accent shrink-0">
            <Edit2 size={14} />
            <span className="hidden sm:inline">Editar datos</span>
          </button>
        )}
      </section>

      {/* ── MODO EDICIÓN ── */}
      {editing && (
        <div className="rounded-2xl border border-[#3B82F6]/30 bg-blue-50/40 p-6 space-y-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
              Editando información
            </h2>
            <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-blue-100 text-[#3B82F6] transition-colors" aria-label="Cancelar">
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
          <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-blue-200/40">
            <button onClick={cancelEdit} className="v3-admin-btn-ghost">Cancelar</button>
            <button onClick={saveEdit} className="v3-admin-btn">
              <Save size={14} />
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Left ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Identity */}
          <section className="rounded-2xl border border-[#0A0A0A]/06 bg-white p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252] mb-4">
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
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#737373]">Nombre comercial</p>
                  <p className="font-bold text-[#0A0A0A] text-xl tracking-tight mt-1">{puestero.nombreComercial}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#737373]">Responsable</p>
                  <p className="text-sm text-[#0A0A0A] mt-1">{puestero.nombreResponsable}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className={`v3-admin-badge ${(puestero.plan === "oro" || puestero.plan === "plata") ? "v3-admin-badge-premium" : "v3-admin-badge-neutral"}`}>
                    {puestero.plan === "oro" && <Crown size={11} />}
                    Plan {plan.nombre}
                  </span>
                  <span className={`v3-admin-badge ${puestero.estadoActividad === "activo" ? "v3-admin-badge-success" : "v3-admin-badge-neutral"}`}>
                    <CircleDot size={11} />
                    {puestero.estadoActividad === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Details grid */}
          <section className="rounded-2xl border border-[#0A0A0A]/06 bg-white p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252] mb-4">
              Datos del puesto
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {datosGrid.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAFAF7] border border-[#0A0A0A]/06 flex items-center justify-center mt-0.5 shrink-0">
                    <item.icon size={15} className="text-[#525252]" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#737373]">{item.label}</p>
                    <p className="text-sm font-semibold text-[#0A0A0A] mt-0.5 break-words">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section className="rounded-2xl border border-[#0A0A0A]/06 bg-white p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252] mb-4">
              Servicios ofrecidos
            </h2>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {servicios.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                    s.active
                      ? "bg-emerald-50 border-emerald-200/70"
                      : "bg-[#FAFAF7] border-[#0A0A0A]/06"
                  }`}
                >
                  <s.icon size={16} strokeWidth={1.8} className={s.active ? "text-emerald-700" : "text-[#A3A3A3]"} />
                  <span className={`text-sm font-semibold ${s.active ? "text-emerald-700" : "text-[#737373]"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right ── */}
        <div className="space-y-5">
          {/* Logo */}
          <section className="rounded-2xl border border-[#0A0A0A]/06 bg-white p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252] mb-4">
              Logo del local
            </h2>
            {puestero.logoUrl ? (
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white relative mb-3 ring-1 ring-[#0A0A0A]/08">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={puestero.logoUrl} alt={puestero.nombreComercial} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center text-white mb-3"
                style={{ backgroundColor: puestero.color }}
              >
                <span className="text-6xl font-extrabold tracking-tight">{puestero.logoIniciales}</span>
                <span className="text-xs text-white/70 mt-2 font-medium">{puestero.nombreComercial}</span>
              </div>
            )}
            <p className="text-[11px] text-[#737373] text-center">
              {puestero.logoUrl ? "Para cambiarlo, tocá Editar arriba." : "Tocá Editar arriba para subir tu logo."}
            </p>
          </section>

          {/* Next payment */}
          <section className="rounded-2xl bg-[#0A0A0A] text-white p-6 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle at 90% 30%, rgba(59,130,246,0.35) 0%, transparent 60%)" }}
            />
            <div className="relative">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#60A5FA]">Próximo cobro</span>
              <p className="text-3xl font-extrabold tracking-tight mt-2 tabular-nums">
                {formatFechaCorta(puestero.fechaProximoCobro)}
              </p>
              <p className="text-sm text-white/60 tabular-nums">
                {new Date(puestero.fechaProximoCobro).getFullYear()}
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-white/70">Plan {plan.nombre}</span>
                <span className="text-sm font-bold tabular-nums">{formatPrecio(plan.precio)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
