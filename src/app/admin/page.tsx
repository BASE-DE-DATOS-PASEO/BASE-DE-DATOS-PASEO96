"use client";

import Header from "@/components/admin/Header";
import {
  ClipboardCheck,
  AlertCircle,
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
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { puesteros, productos, solicitudes, categorias } = useStore();
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente");

  const puestosActivos = puesteros.filter((p) => p.estadoActividad === "activo");
  const pendientesPago = puesteros.filter((p) => p.estadoPago === "pendiente");
  const pagados = puesteros.filter((p) => p.estadoPago === "pagado");

  const ingresosDelMes = pagados.reduce((sum, p) => sum + preciosPlanes[p.plan], 0);
  const productosVisibles = productos.filter((p) => p.visible).length;

  const ultimosProductos = [...productos]
    .sort((a, b) => new Date(b.fechaCarga).getTime() - new Date(a.fechaCarga).getTime())
    .slice(0, 3);

  const ultimosPuesteros = [...puesteros]
    .sort((a, b) => new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime())
    .slice(0, 2);

  const actividad = [
    ...ultimosProductos.map((p) => {
      const puesto = puesteros.find((pu) => pu.id === p.puesteroId);
      return {
        tipo: "producto" as const,
        texto: `${puesto?.nombreComercial ?? "Alguien"} cargó "${p.nombre}"`,
        fecha: p.fechaCarga,
        icon: Package,
      };
    }),
    ...ultimosPuesteros.map((p) => ({
      tipo: "puestero" as const,
      texto: `${p.nombreComercial} se dio de alta · Plan ${p.plan.charAt(0).toUpperCase() + p.plan.slice(1)}`,
      fecha: p.fechaAlta,
      icon: Store,
    })),
  ]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  const displayName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ")[0]
    : user?.email
      ? user.email.split("@")[0]
      : "Admin";

  const formatPrecio = (n: number) => `$${n.toLocaleString("es-AR")}`;

  return (
    <>
      <Header
        title={`Hola, ${displayName}`}
        subtitle="Esto es lo que pasa hoy en Paseo 96."
      />

      <div className="max-w-6xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            label="Cobrado este mes"
            value={formatPrecio(ingresosDelMes)}
            hint={`${pagados.length} de ${puesteros.length} pagaron`}
            icon={TrendingUp}
            valueColor="text-[#0F172A]"
          />
          <Kpi
            label="Puestos activos"
            value={String(puestosActivos.length)}
            hint={`de ${puesteros.length} totales`}
            icon={Store}
            valueColor="text-[#0F172A]"
          />
          <Kpi
            label="Productos visibles"
            value={String(productosVisibles)}
            hint={`${productos.length} cargados`}
            icon={Package}
            valueColor="text-[#0F172A]"
          />
          <Kpi
            label="Categorías"
            value={String(categorias.length)}
            hint="en el catálogo"
            icon={ClipboardCheck}
            valueColor="text-[#0F172A]"
          />
        </div>

        {/* Pendiente atención */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Solicitudes */}
          <Link
            href="/admin/solicitudes"
            className="group flex items-center gap-4 p-5 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#CBD5E1] hover:shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all"
          >
            <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
              solicitudesPendientes.length > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {solicitudesPendientes.length > 0 ? (
                <ClipboardCheck size={18} strokeWidth={1.8} />
              ) : (
                <CheckCircle2 size={18} strokeWidth={1.8} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#0F172A]">
                {solicitudesPendientes.length > 0
                  ? `${solicitudesPendientes.length} solicitudes nuevas`
                  : "Sin solicitudes pendientes"}
              </p>
              <p className="text-[12.5px] text-[#64748B] mt-0.5">
                {solicitudesPendientes.length > 0
                  ? "Revisar comprobantes y aprobar"
                  : "Todo al día con los nuevos puesteros"}
              </p>
            </div>
            <ArrowRight size={15} className="text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          {/* Cobros */}
          <Link
            href="/admin/cobros"
            className="group flex items-center gap-4 p-5 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#CBD5E1] hover:shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all"
          >
            <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
              pendientesPago.length > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {pendientesPago.length > 0 ? (
                <AlertCircle size={18} strokeWidth={1.8} />
              ) : (
                <CheckCircle2 size={18} strokeWidth={1.8} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#0F172A]">
                {pendientesPago.length > 0
                  ? `${pendientesPago.length} puesteros adeudan`
                  : "Todos pagaron este mes"}
              </p>
              <p className="text-[12.5px] text-[#64748B] mt-0.5">
                {pendientesPago.length > 0
                  ? "Mandales un WhatsApp o marcalos como pagados"
                  : "Sin cobros pendientes"}
              </p>
            </div>
            <ArrowRight size={15} className="text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              Actividad reciente
            </h3>
            {actividad.length > 0 && (
              <span className="text-[11.5px] text-[#94A3B8]">Últimos eventos</span>
            )}
          </div>

          {actividad.length > 0 ? (
            <div className="divide-y divide-[#F1F5F9]">
              {actividad.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors">
                    <div className="w-8 h-8 rounded-md bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-[#475569]" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#334155] truncate">{a.texto}</p>
                    </div>
                    <span className="text-[11.5px] text-[#94A3B8] shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(a.fecha).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-[13.5px] text-[#64748B]">
                Sin actividad reciente
              </p>
              <p className="text-[12px] text-[#94A3B8] mt-1">
                Cuando un puestero se sume o cargue productos vas a verlo acá.
              </p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

/* ── Kpi small ── */

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  valueColor = "text-[#0F172A]",
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  valueColor?: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#CBD5E1] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11.5px] font-medium text-[#64748B]">{label}</p>
        <Icon size={13} className="text-[#94A3B8]" strokeWidth={1.8} />
      </div>
      <p className={`text-[22px] font-semibold tabular-nums tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-[11.5px] text-[#94A3B8] mt-1">{hint}</p>
    </div>
  );
}
