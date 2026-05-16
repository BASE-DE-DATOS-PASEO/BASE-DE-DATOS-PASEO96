"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Crown,
  Upload,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  Clock,
  Banknote,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { datosTransferencia, planConfig, montoConIva } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { uploadComprobante } from "@/lib/storage";

/* ── Config de planes ──────────────────────────────────── */

const planesConfig = {
  bronce: {
    nombre: "Bronce",
    precio: planConfig.bronce.precio,
    color: "from-orange-400 to-amber-500",
    badge: "bg-orange-100 text-orange-800",
    features: ["WhatsApp Empresa", "20 fotos totales", "4 publicaciones", "Logo de local"],
  },
  plata: {
    nombre: "Plata",
    precio: planConfig.plata.precio,
    color: "from-blue-500 to-blue-700",
    badge: "bg-blue-100 text-blue-800",
    features: ["WhatsApp Empresa", "50 fotos totales", "10 publicaciones", "Publicidad + Video", "Destacado"],
  },
  oro: {
    nombre: "Oro",
    precio: planConfig.oro.precio,
    color: "from-amber-400 to-yellow-500",
    badge: "bg-amber-100 text-amber-800",
    features: ["WhatsApp Empresa", "100 fotos totales", "20 publicaciones", "5 videos", "Destacado", "IA en imágenes"],
  },
} as const;

type PlanKey = keyof typeof planesConfig;
type Metodo = "transferencia" | "efectivo";

function formatPrecio(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

/* ── Página ────────────────────────────────────────────── */

export default function SuscripcionPage() {
  const params = useParams();
  const planParam = (params?.plan as string)?.toLowerCase() as PlanKey;
  const validPlan = ["bronce", "plata", "oro"].includes(planParam);
  const planKey = validPlan ? planParam : "bronce";
  const plan = planesConfig[planKey];
  const addSolicitud = useStore((s) => s.addSolicitud);

  // Método de pago: null = todavía no eligió, hay que mostrar selector primero.
  const [metodo, setMetodo] = useState<Metodo | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [archivoSubido, setArchivoSubido] = useState<File | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [formError, setFormError] = useState("");

  // Formulario
  const [form, setForm] = useState({
    nombreResponsable: "",
    nombreComercial: "",
    telefono: "",
    email: "",
    gmailAcceso: "",
    fila: "",
    puesto: "",
  });

  // Monto final que paga el puestero según método
  const precioBase = plan.precio;
  const precioTransferencia = montoConIva(precioBase); // con 21% IVA
  const montoFinal =
    metodo === "transferencia" ? precioTransferencia : precioBase;

  if (!validPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 p-8 text-center shadow-xl">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Plan no encontrado</h1>
          <p className="text-sm text-gray-500 mt-2">Elegí uno de los planes disponibles para iniciar la solicitud.</p>
          <Link href="/planes" className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
            Volver a planes
          </Link>
        </div>
      </div>
    );
  }

  function copiar(texto: string, label: string) {
    navigator.clipboard.writeText(texto);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setArchivoSubido(file);
  }

  async function enviarSolicitud(e: React.FormEvent) {
    e.preventDefault();
    if (!metodo) return;
    if (metodo === "transferencia" && !archivoSubido) {
      setFormError("Subí el comprobante de transferencia antes de enviar.");
      return;
    }

    setEnviando(true);
    setFormError("");

    try {
      const comprobantePath =
        metodo === "transferencia" && archivoSubido
          ? await uploadComprobante(
              archivoSubido,
              `${form.fila.trim().toUpperCase()}-${form.puesto.trim()}-${form.gmailAcceso.trim()}`
            )
          : null;

      const ok = await addSolicitud({
      nombreResponsable: form.nombreResponsable.trim(),
      nombreComercial: form.nombreComercial.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      gmailAcceso: form.gmailAcceso.trim().toLowerCase(),
      fila: form.fila.trim().toUpperCase(),
      numeroPuesto: Number(form.puesto),
      planElegido: planKey,
      metodoPago: metodo,
      montoTransferido: montoFinal,
      fechaSolicitud: new Date().toISOString().split("T")[0],
      comprobanteUrl: comprobantePath,
      estado: "pendiente",
      observaciones:
        metodo === "transferencia"
          ? "Solicitud por transferencia (incluye 21% IVA). Verificar comprobante antes de aprobar."
          : "Solicitud por pago en efectivo. Coordinar entrega de plata con el puestero antes de aprobar.",
      });

      if (!ok) {
        setFormError("No se pudo guardar la solicitud. Revisá si ese Gmail ya tiene una solicitud pendiente o si Supabase está en modo desarrollo.");
        return;
      }

      setEnviado(true);
    } catch (err) {
      console.error("[suscripcion] enviarSolicitud", err);
      setFormError("No se pudo subir el comprobante o guardar la solicitud. Verificá los buckets y las políticas de Supabase.");
    } finally {
      setEnviando(false);
    }
  }

  const whatsappMsgTransfer = encodeURIComponent(
    `Hola Jere! Soy ${form.nombreResponsable || "..."} de ${form.nombreComercial || "..."}. Quiero sumarme al Plan ${plan.nombre} de Paseo 96. Ya hice la transferencia de ${formatPrecio(montoFinal)} (con IVA).`
  );
  const whatsappMsgEfectivo = encodeURIComponent(
    `Hola Jere! Soy ${form.nombreResponsable || "..."} de ${form.nombreComercial || "..."}. Quiero sumarme al Plan ${plan.nombre} de Paseo 96 pagando en efectivo (${formatPrecio(montoFinal)}). ¿Cuándo coordinamos la entrega?`
  );
  const whatsappMsg =
    metodo === "efectivo" ? whatsappMsgEfectivo : whatsappMsgTransfer;

  /* ── Pantalla de éxito ─────────────────────────────── */

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-100 shadow-xl p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-emerald-600" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            ¡Solicitud enviada!
          </h1>
          <p className="text-gray-600 mb-6">
            {metodo === "efectivo" ? (
              <>
                Le llegó tu solicitud a <strong>Jere</strong>. Coordiná la entrega del efectivo por WhatsApp y, una vez que la reciba, te aprueba el acceso al puesto.
              </>
            ) : (
              <>
                Ya le llegó tu comprobante a <strong>Jere</strong>. En las próximas horas te va a confirmar por WhatsApp y vas a poder empezar a cargar tus productos.
              </>
            )}
          </p>

          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 text-left mb-6">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">Qué pasa ahora</p>
                <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal ml-4">
                  {metodo === "efectivo" ? (
                    <>
                      <li>Coordinás con Jere por WhatsApp para entregar la plata</li>
                      <li>Jere recibe el efectivo</li>
                      <li>Aprueba tu solicitud desde el panel</li>
                      <li>Te llega un WhatsApp con el acceso a tu puesto</li>
                      <li>Subís tus productos y listo</li>
                    </>
                  ) : (
                    <>
                      <li>Jere verifica que la plata entró en la cuenta</li>
                      <li>Aprueba tu solicitud desde el panel</li>
                      <li>Te llega un WhatsApp con el acceso a tu puesto</li>
                      <li>Subís tus productos y listo</li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${datosTransferencia.whatsappAdmin}?text=${whatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={18} />
            {metodo === "efectivo" ? "Coordinar con Jere por WhatsApp" : "Avisar a Jere por WhatsApp"}
          </a>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Pantalla del selector de método (paso previo) ── */

  if (!metodo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/planes" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={16} />
              Volver a planes
            </Link>
            <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
              PASEO 96
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-semibold mb-4`}>
              {planParam === "oro" && <Crown size={14} />}
              Plan {plan.nombre} elegido
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              ¿Cómo querés pagar?
            </h1>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Elegí el método de pago. Jere recibe tu solicitud y la confirma cuando recibe la plata.
            </p>
          </div>

          {/* Tarjetas de método */}
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Transferencia */}
            <button
              type="button"
              onClick={() => setMetodo("transferencia")}
              className="text-left rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Banknote size={24} />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Más rápido
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Transferencia</h3>
              <p className="text-sm text-gray-500 mb-4">
                Transferí desde tu app de banco o billetera virtual.
              </p>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Plan {plan.nombre}</span>
                  <span className="text-gray-700">{formatPrecio(precioBase)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-amber-700 font-medium">+ IVA 21%</span>
                  <span className="text-amber-700 font-medium">
                    {formatPrecio(precioTransferencia - precioBase)}
                  </span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {formatPrecio(precioTransferencia)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                <span>Pagar por transferencia</span>
                <ArrowRight size={16} />
              </div>
            </button>

            {/* Efectivo */}
            <button
              type="button"
              onClick={() => setMetodo("efectivo")}
              className="text-left rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-emerald-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Wallet size={24} />
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Sin recargo
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Efectivo</h3>
              <p className="text-sm text-gray-500 mb-4">
                Coordinás con Jere y le entregás la plata en mano.
              </p>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Plan {plan.nombre}</span>
                  <span className="text-gray-700">{formatPrecio(precioBase)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-emerald-700 font-medium">Sin IVA</span>
                  <span className="text-emerald-700 font-medium">— —</span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {formatPrecio(precioBase)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-emerald-600 group-hover:gap-3 transition-all">
                <span>Pagar en efectivo</span>
                <ArrowRight size={16} />
              </div>
            </button>
          </div>

          {/* Aclaración */}
          <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
            <p className="text-xs text-amber-800">
              <strong>En cualquiera de las dos opciones</strong>, Jere tiene que aprobar tu solicitud antes de que puedas cargar productos. La aprobación llega por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Pantalla principal (pago + formulario) ────────── */

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <button
            onClick={() => setMetodo(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Cambiar método de pago
          </button>
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            PASEO 96
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header con resumen del plan */}
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-semibold mb-4`}>
            {planParam === "oro" && <Crown size={14} />}
            Plan {plan.nombre} ·{" "}
            {metodo === "transferencia" ? "Transferencia" : "Efectivo"}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {metodo === "transferencia"
              ? "Último paso: transferí y listo"
              : "Último paso: completá tus datos"}
          </h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            {metodo === "transferencia"
              ? "Hacé la transferencia, completá tus datos y subí el comprobante. Jere te confirma por WhatsApp en unas horas."
              : "Completá tus datos y coordinás con Jere la entrega del efectivo por WhatsApp."}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-5 lg:gap-6">
          {/* ── COLUMNA IZQUIERDA: Instrucciones de pago ── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Paso 1: Monto */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="font-semibold text-gray-900">
                  {metodo === "transferencia" ? "Monto a transferir" : "Monto a entregar en efectivo"}
                </h2>
              </div>
              <div className={`rounded-2xl bg-gradient-to-r ${plan.color} p-4 text-center text-white sm:p-6`}>
                <p className="text-sm opacity-90">
                  Plan {plan.nombre} — 1 mes
                  {metodo === "transferencia" && (
                    <span className="ml-1 font-medium">(incluye 21% IVA)</span>
                  )}
                </p>
                <p className="mt-2 text-3xl font-extrabold sm:text-5xl">{formatPrecio(montoFinal)}</p>
                {metodo === "transferencia" && (
                  <p className="text-xs opacity-90 mt-1">
                    Base {formatPrecio(precioBase)} + IVA{" "}
                    {formatPrecio(precioTransferencia - precioBase)}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {plan.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Paso 2: Datos bancarios o instrucciones efectivo */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="font-semibold text-gray-900">
                  {metodo === "transferencia"
                    ? "Transferí a esta cuenta"
                    : "Coordinar la entrega"}
                </h2>
              </div>

              {metodo === "transferencia" ? (
                <>
                  <div className="space-y-3">
                    <DatoBancario
                      label="Alias"
                      valor={datosTransferencia.alias}
                      destacado
                      copied={copied === "alias"}
                      onCopy={() => copiar(datosTransferencia.alias, "alias")}
                    />
                    <DatoBancario
                      label="CBU / CVU"
                      valor={datosTransferencia.cbu}
                      copied={copied === "cbu"}
                      onCopy={() => copiar(datosTransferencia.cbu, "cbu")}
                    />
                    <DatoBancario
                      label="Titular"
                      valor={datosTransferencia.titular}
                      copied={copied === "titular"}
                      onCopy={() => copiar(datosTransferencia.titular, "titular")}
                    />
                    <DatoBancario
                      label="CUIT"
                      valor={datosTransferencia.cuit}
                      copied={copied === "cuit"}
                      onCopy={() => copiar(datosTransferencia.cuit, "cuit")}
                    />
                    <DatoBancario
                      label="Banco / App"
                      valor={datosTransferencia.banco}
                      copied={copied === "banco"}
                      onCopy={() => copiar(datosTransferencia.banco, "banco")}
                    />
                  </div>

                  <div className="mt-4 flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>Importante:</strong> transferí el monto exacto ({formatPrecio(montoFinal)} con IVA). Si el importe no coincide, Jere no puede aprobar la solicitud.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5 text-sm text-emerald-900 space-y-3">
                    <p>
                      Para pagar en efectivo, después de enviar este formulario tenés que <strong>coordinar con Jere por WhatsApp</strong> dónde y cuándo le entregás la plata.
                    </p>
                    <p>
                      Una vez que Jere reciba el efectivo, te aprueba la solicitud desde el panel y te llega el acceso por WhatsApp.
                    </p>
                    <p className="text-xs text-emerald-800/80">
                      WhatsApp de Jere: <strong>+{datosTransferencia.whatsappAdmin}</strong>
                    </p>
                  </div>

                  <div className="mt-4 flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>Atención:</strong> Hasta que Jere no reciba la plata en mano, tu solicitud queda en pendiente y no podés cargar productos.
                    </p>
                  </div>
                </>
              )}
            </section>

            {/* Paso 3: Seguridad */}
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900 text-sm">Pago seguro y directo</p>
                  <p className="text-sm text-emerald-800 mt-1">
                    {metodo === "transferencia"
                      ? "La transferencia va directo a la cuenta de Jere, administrador de Paseo 96. Sin intermediarios ni comisiones."
                      : "La plata va directo a manos de Jere, administrador de Paseo 96. Sin intermediarios ni recargos."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ── COLUMNA DERECHA: Formulario ── */}
          <div className="lg:col-span-2">
            <form
              onSubmit={enviarSolicitud}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h2 className="font-semibold text-gray-900">Tus datos</h2>
              </div>

              <div className="space-y-3">
                <Campo
                  label="Tu nombre"
                  value={form.nombreResponsable}
                  onChange={(v) => setForm({ ...form, nombreResponsable: v })}
                  placeholder="Juan Pérez"
                  required
                />
                <Campo
                  label="Nombre del local"
                  value={form.nombreComercial}
                  onChange={(v) => setForm({ ...form, nombreComercial: v })}
                  placeholder="Moda Urbana"
                  required
                />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Campo
                    label="Fila"
                    value={form.fila}
                    onChange={(v) => setForm({ ...form, fila: v })}
                    placeholder="A"
                    required
                  />
                  <Campo
                    label="Puesto"
                    value={form.puesto}
                    onChange={(v) => setForm({ ...form, puesto: v })}
                    placeholder="12"
                    required
                  />
                </div>
                <Campo
                  label="WhatsApp"
                  value={form.telefono}
                  onChange={(v) => setForm({ ...form, telefono: v })}
                  placeholder="+54 9 221 ..."
                  required
                />
                <Campo
                  label="Gmail de acceso"
                  value={form.gmailAcceso}
                  onChange={(v) => setForm({ ...form, gmailAcceso: v })}
                  placeholder="tulocal@gmail.com"
                  type="email"
                  required
                />
                <Campo
                  label="Email (opcional)"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="tu@email.com"
                  type="email"
                />

                {/* Upload comprobante (solo transferencia) */}
                {metodo === "transferencia" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Comprobante de transferencia <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer">
                      <Upload size={16} />
                      {archivoSubido ? (
                        <span className="text-emerald-600 font-medium">✓ {archivoSubido.name}</span>
                      ) : (
                        "Subir captura / foto"
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleArchivo}
                        required
                      />
                    </label>
                  </div>
                )}
              </div>

              {formError && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full mt-5 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
              >
                {enviando ? "Enviando..." : "Enviar solicitud"}
                <Check size={18} />
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                {metodo === "transferencia"
                  ? "Jere verifica que la plata entró y te da el acceso por WhatsApp en unas horas."
                  : "Jere te contacta por WhatsApp para coordinar la entrega del efectivo."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Subcomponentes ─────────────────────────────────── */

function DatoBancario({
  label,
  valor,
  destacado = false,
  copied,
  onCopy,
}: {
  label: string;
  valor: string;
  destacado?: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl p-3 border ${
        destacado ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-100"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={`font-mono font-semibold truncate ${
            destacado ? "text-blue-900 text-lg" : "text-gray-900 text-sm"
          }`}
        >
          {valor}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ml-3 ${
          copied
            ? "bg-emerald-500 text-white"
            : destacado
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {copied ? (
          <>
            <Check size={14} />
            ¡Copiado!
          </>
        ) : (
          <>
            <Copy size={14} />
            Copiar
          </>
        )}
      </button>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
      />
    </div>
  );
}
