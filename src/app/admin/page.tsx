"use client";

import Header from "@/components/admin/Header";
import {
  ClipboardCheck,
  AlertCircle,
  DollarSign,
  ArrowRight,
  Store,
  Package,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { preciosPlanes } from "@/lib/mock-data";
import Link from "next/link";
import Counter from "@/components/Counter";
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { puesteros, productos, solicitudes } = useStore();
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente");

  const puestosActivos = puesteros.filter((p) => p.estadoActividad === "activo");
  const pendientesPago = puesteros.filter((p) => p.estadoPago === "pendiente");

  // Ingresos del mes (puesteros pagados × precio de su plan)
  const ingresosDelMes = puesteros
    .filter((p) => p.estadoPago === "pagado")
    .reduce((sum, p) => sum + preciosPlanes[p.plan], 0);

  // Actividad reciente — derivada del state real
  const ultimosProductos = [...productos]
    .sort((a, b) => new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime())
    .slice(0, 3);

  const ultimosPuesteros = [...puesteros]
    .sort((a, b) => new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime())
    .slice(0, 2);

  // Mezcla ordenada por fecha (productos cargados + puesteros nuevos)
  const actividad = [
    ...ultimosProductos.map((p) => {
      const puesto = puesteros.find((pu) => pu.id === p.puesteroId);
      return {
        tipo: "producto" as const,
        texto: `${puesto?.nombreComercial ?? "Alguien"} cargó "${p.nombre}"`,
        fecha: p.fechaCarga,
        icon: Package,
        color: "text-blue-600 bg-blue-50",
      };
    }),
    ...ultimosPuesteros.map((p) => ({
      tipo: "puestero" as const,
      texto: `${p.nombreComercial} se dio de alta (Plan ${p.plan.charAt(0).toUpperCase() + p.plan.slice(1)})`,
      fecha: p.fechaAlta,
      icon: Store,
      color: "text-emerald-600 bg-emerald-50",
    })),
  ]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  return (
    <>
      <Header title="Inicio" />
      <div className="max-w-5xl p-4 sm:p-6 lg:p-8">
        {/* Saludo */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Hola, {user?.user_metadata?.full_name ? user.user_metadata.full_name.split(" ")[0] : user?.email ? user.email.split("@")[0] : "Admin"} 👋</h2>
          <p className="text-muted text-sm mt-1">
            Esto es lo que necesitás ver hoy
          </p>
        </div>

        {/* ── Bandeja: qué hacer ahora ── */}
        <div className="space-y-3 mb-10">
          {/* Solicitudes pendientes */}
          <Link
            href="/admin/solicitudes"
            className="btn-press flex flex-col items-start gap-4 rounded-2xl bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/40 sm:flex-row sm:items-center sm:p-5 border border-gray-100 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <ClipboardCheck size={22} className="text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                Tenés <span className="text-amber-600">{solicitudesPendientes.length} solicitudes</span> nuevas
              </p>
              <p className="text-sm text-muted mt-0.5">
                Puesteros que quieren sumarse. Revisá el comprobante y aprobá.
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-600 transition-transform group-hover:translate-x-1 sm:ml-auto">
              Revisar
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Cobros pendientes */}
          <Link
            href="/admin/cobros"
            className="btn-press flex flex-col items-start gap-4 rounded-2xl bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg hover:shadow-red-100/40 sm:flex-row sm:items-center sm:p-5 border border-gray-100 group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                <span className="text-red-600">
                  <Counter value={pendientesPago.length} duration={900} /> puesteros
                </span>{" "}
                te deben este mes
              </p>
              <p className="text-sm text-muted mt-0.5">
                Mandales un WhatsApp o marcalos como pagados.
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-red-600 transition-transform group-hover:translate-x-1 sm:ml-auto">
              Ver cobros
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Total del mes */}
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-100/40 sm:flex-row sm:items-center sm:p-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <DollarSign size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-emerald-800">Este mes entraron</p>
              <p className="text-2xl font-bold text-emerald-900 mt-0.5">
                <Counter value={ingresosDelMes} duration={1400} prefix="$ " />
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-700 shrink-0 sm:ml-auto">
              <TrendingUp size={14} />
              <span className="font-semibold">
                <Counter value={puestosActivos.length} duration={1000} /> puesteros activos
              </span>
            </div>
          </div>
        </div>

        {/* ── Mini resumen ── */}
        <div className="grid grid-cols-1 gap-3 mb-10 sm:grid-cols-3">
          <div className="p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">Puestos activos</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              <Counter value={puestosActivos.length} duration={1000} />
            </p>
            <p className="text-xs text-muted mt-0.5">de {puesteros.length} totales</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">Productos</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              <Counter value={productos.length} duration={1200} />
            </p>
            <p className="text-xs text-muted mt-0.5">cargados en la web</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all duration-300">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">Al día</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              <Counter value={puesteros.filter((p) => p.estadoPago === "pagado").length} duration={1100} />
            </p>
            <p className="text-xs text-muted mt-0.5">puesteros pagaron</p>
          </div>
        </div>

        {/* ── Actividad reciente ── */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h3 className="font-semibold text-foreground mb-1">Últimas novedades</h3>
          <p className="text-xs text-muted mb-5">Lo que pasó en los últimos días</p>

          {actividad.length > 0 ? (
            <div className="space-y-3">
              {actividad.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 last:pb-0 border-b border-gray-50 last:border-0">
                    <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{a.texto}</p>
                      <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(a.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted text-sm">
              <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
              Todo tranquilo, no hay novedades
            </div>
          )}
        </div>
      </div>
    </>
  );
}
