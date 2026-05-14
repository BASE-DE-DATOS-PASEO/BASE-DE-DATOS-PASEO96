"use client";

import Header from "@/components/admin/Header";
import { useState } from "react";
import {
  Store,
  MapPin,
  CheckCircle2,
  DollarSign,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { preciosPlanes, formatPrecio } from "@/lib/mock-data";
import { diasDeAtraso, estaEnMora } from "@/lib/data-bridge";
import clsx from "clsx";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function CobrosPage() {
  const { puesteros, marcarPagado } = useStore();
  const today = new Date();
  const [filtro, setFiltro] = useState<"todos" | "pendiente" | "pagado" | "vencido">("todos");

  // Enriquecer con estado de vencimiento
  const puestosConCobro = puesteros
    .map((p) => {
      const fecha = new Date(p.fechaProximoCobro);
      const isVencido = fecha < today && p.estadoPago === "pendiente";
      return { ...p, fechaCobro: fecha, isVencido };
    })
    .sort((a, b) => a.fechaCobro.getTime() - b.fechaCobro.getTime());

  const pagados = puestosConCobro.filter((p) => p.estadoPago === "pagado");
  const pendientes = puestosConCobro.filter(
    (p) => p.estadoPago === "pendiente" && !p.isVencido
  );
  const vencidos = puestosConCobro.filter((p) => p.isVencido);

  // Ingresos del mes = suma de puesteros pagados × precio del plan
  const ingresosDelMes = pagados.reduce(
    (sum, p) => sum + preciosPlanes[p.plan],
    0
  );
  const porCobrar = [...pendientes, ...vencidos].reduce(
    (sum, p) => sum + preciosPlanes[p.plan],
    0
  );

  const filtered =
    filtro === "todos"
      ? puestosConCobro
      : filtro === "vencido"
      ? vencidos
      : filtro === "pendiente"
      ? pendientes
      : pagados;

  const tabs = [
    { key: "todos", label: "Todos", count: puestosConCobro.length },
    { key: "pendiente", label: "Por cobrar", count: pendientes.length },
    { key: "vencido", label: "Vencidos", count: vencidos.length },
    { key: "pagado", label: "Pagados", count: pagados.length },
  ] as const;

  // WhatsApp helper — arma un mensaje pre-armado
  const whatsappLink = (telefono: string, nombre: string, monto: number) => {
    const msg = encodeURIComponent(
      `Hola ${nombre}, te recuerdo que tenés pendiente el cobro del mes de Paseo 96 (${formatPrecio(
        monto
      )}). Gracias!`
    );
    const tel = telefono.replace(/\D/g, "");
    return `https://wa.me/${tel}?text=${msg}`;
  };

  return (
    <>
      <Header title="Cobros" />
      <div className="max-w-5xl p-4 sm:p-6 lg:p-8">
        {/* Encabezado */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Cobros del mes</h2>
          <p className="text-muted text-sm mt-1">
            Quién pagó y quién te debe en {MESES[today.getMonth()]}
          </p>
        </div>

        {/* ── Resumen del mes ── */}
        <div className="mb-4 flex flex-col items-start gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <DollarSign size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-emerald-800">Este mes entraron</p>
            <p className="text-2xl font-bold text-emerald-900 mt-0.5">
              {formatPrecio(ingresosDelMes)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-700 shrink-0 sm:ml-auto">
            <TrendingUp size={14} />
            <span className="font-semibold">
              {pagados.length} de {puestosConCobro.length} pagaron
            </span>
          </div>
        </div>

        {/* Mini stats: por cobrar */}
        <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-3">
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">
              Por cobrar
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {pendientes.length}
            </p>
            <p className="text-xs text-muted mt-0.5">aún no pagaron</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">
              Vencidos
            </p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {vencidos.length}
            </p>
            <p className="text-xs text-muted mt-0.5">deben hace tiempo</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">
              Faltan entrar
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatPrecio(porCobrar)}
            </p>
            <p className="text-xs text-muted mt-0.5">si cobrás todo</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-5 flex w-full gap-1 overflow-x-auto rounded-lg bg-gray-50 p-1 sm:w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFiltro(tab.key)}
              className={clsx(
                "shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                filtro === tab.key
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* ── Lista ── */}
        <div className="space-y-3">
          {filtered.map((puesto) => {
            const isPaid = puesto.estadoPago === "pagado";
            const monto = preciosPlanes[puesto.plan];
            return (
              <div
                key={puesto.id}
                className={clsx(
                  "flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between",
                  puesto.isVencido
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-100"
                )}
              >
                {/* Info del puesto */}
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      isPaid
                        ? "bg-emerald-50"
                        : puesto.isVencido
                        ? "bg-red-50"
                        : "bg-amber-50"
                    )}
                  >
                    <Store
                      size={18}
                      className={clsx(
                        isPaid
                          ? "text-emerald-500"
                          : puesto.isVencido
                          ? "text-red-500"
                          : "text-amber-500"
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate flex items-center gap-2">
                      {puesto.nombreComercial}
                      {estaEnMora(puesto) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">
                          🚫 Productos ocultos
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> F{puesto.fila} N°{puesto.numeroPuesto}
                      </span>
                      <span className="truncate">{puesto.nombreResponsable}</span>
                      <span
                        className={clsx(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                          puesto.plan === "oro"
                            ? "bg-amber-100 text-amber-700"
                            : puesto.plan === "plata"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-orange-100 text-orange-700"
                        )}
                      >
                        {puesto.plan.charAt(0).toUpperCase() + puesto.plan.slice(1)}
                      </span>
                      {diasDeAtraso(puesto) > 0 && (
                        <span className="text-red-600 font-semibold">
                          {diasDeAtraso(puesto)} días atrasado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Monto + acción */}
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="text-left sm:text-right">
                    <p
                      className={clsx(
                        "text-sm font-semibold",
                        puesto.isVencido ? "text-red-600" : "text-foreground"
                      )}
                    >
                      {puesto.fechaCobro.toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-muted">{formatPrecio(monto)}</p>
                  </div>

                  {isPaid ? (
                    <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 size={13} /> Pagado
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={whatsappLink(
                          puesto.telefono,
                          puesto.nombreResponsable,
                          monto
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                        title="Recordar por WhatsApp"
                      >
                        <MessageCircle size={13} /> WA
                      </a>
                      <button
                        onClick={() => marcarPagado(puesto.id)}
                        className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
                      >
                        Marcar pagado
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted text-sm py-12 rounded-2xl bg-white border border-gray-100">
            <CheckCircle2
              size={28}
              className="text-emerald-400 mx-auto mb-2"
            />
            No hay cobros con ese filtro
          </div>
        )}
      </div>
    </>
  );
}
