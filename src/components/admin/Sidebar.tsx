"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ClipboardCheck,
  Tag,
  Package,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import clsx from "clsx";
import { useAuth, signOut } from "@/lib/auth";
import { useStore } from "@/store/useStore";

const mainMenu = [
  { label: "Inicio", href: "/admin", icon: Home },
];

const gestionMenu = [
  { label: "Solicitudes", href: "/admin/solicitudes", icon: ClipboardCheck },
  { label: "Puesteros", href: "/admin/puesteros", icon: Store },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Categorías", href: "/admin/categorias", icon: Tag },
];

const finanzasMenu = [
  { label: "Cobros", href: "/admin/cobros", icon: CalendarDays },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { puesteros, solicitudes } = useStore();

  const displayName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ")[0]
    : user?.email
      ? user.email.split("@")[0]
      : "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
  const puestosActivos = puesteros.filter((p) => p.estadoActividad === "activo").length;
  const cobrosPendientes = puesteros.filter((p) => p.estadoPago === "pendiente").length;

  const renderMenuGroup = (items: typeof mainMenu, badges?: Record<string, number>) => (
    <div className="space-y-0.5">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));
        const Icon = item.icon;
        const badge = badges?.[item.href];

        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={clsx(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              collapsed && "justify-center !px-0 !py-3",
              isActive
                ? "bg-white/06 text-white"
                : "text-white/55 hover:text-white hover:bg-white/04"
            )}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-[#3B82F6] rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            )}
            <Icon size={17} strokeWidth={isActive ? 2 : 1.6} className="shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className={clsx(
                    "min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums",
                    isActive
                      ? "bg-[#3B82F6] text-white"
                      : "bg-white/10 text-white/80 group-hover:bg-[#3B82F6] group-hover:text-white"
                  )}>
                    {badge}
                  </span>
                )}
              </>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ── DESKTOP — editorial dark sidebar ── */}
      <aside
        className={clsx(
          "fixed left-0 top-0 hidden h-screen md:flex flex-col z-50 bg-[#0A0A0A] text-white transition-[width] duration-300 ease-out border-r border-white/06",
          collapsed ? "w-[76px]" : "w-[272px]"
        )}
      >
        {/* ── Brand block ── */}
        <div className={clsx(
          "shrink-0 px-5 pt-6 pb-5 border-b border-white/08",
          collapsed && "px-3"
        )}>
          {!collapsed ? (
            <div className="flex items-center justify-between gap-2">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold tracking-[-0.02em] text-white">
                  PASEO <span className="text-[#3B82F6]">96</span>
                </span>
              </Link>
              <button
                onClick={() => onCollapse(true)}
                className="p-1.5 rounded-lg hover:bg-white/06 text-white/40 hover:text-white/80 transition-colors"
                aria-label="Colapsar sidebar"
              >
                <ChevronLeft size={15} />
              </button>
            </div>
          ) : (
            <Link href="/admin" className="block text-center">
              <span className="text-[17px] font-extrabold tracking-[-0.02em] text-[#3B82F6]">96</span>
            </Link>
          )}
          {!collapsed && (
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Panel administrador
            </p>
          )}
        </div>

        {/* ── Nav scrollable ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {/* Group: Principal */}
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Principal
              </p>
            )}
            {renderMenuGroup(mainMenu)}
          </div>

          {/* Group: Gestión */}
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Gestión
              </p>
            )}
            {renderMenuGroup(gestionMenu, {
              "/admin/solicitudes": solicitudesPendientes,
            })}
          </div>

          {/* Group: Finanzas */}
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Finanzas
              </p>
            )}
            {renderMenuGroup(finanzasMenu, {
              "/admin/cobros": cobrosPendientes,
            })}
          </div>

          {/* Mini stats (only expanded) */}
          {!collapsed && (
            <div>
              <p className="px-3 mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                En vivo
              </p>
              <div className="mx-1 rounded-2xl bg-white/04 border border-white/06 p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-white/55">Puestos activos</span>
                  <span className="text-xl font-extrabold tabular-nums tracking-tight">{puestosActivos}</span>
                </div>
                <div className="h-px bg-white/06" />
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-white/55">Pendientes</span>
                  <span className={clsx(
                    "text-xl font-extrabold tabular-nums tracking-tight",
                    cobrosPendientes > 0 ? "text-amber-300" : "text-emerald-300"
                  )}>
                    {cobrosPendientes}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* See site link */}
          {!collapsed && (
            <Link
              href="/"
              target="_blank"
              className="mx-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/04 transition-all duration-200 group"
            >
              <span>Ver sitio público</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </nav>

        {/* ── User footer ── */}
        <div className={clsx(
          "shrink-0 border-t border-white/08 p-3",
          collapsed && "px-2"
        )}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => onCollapse(false)}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/06 text-white/40 hover:text-white transition-colors"
                aria-label="Expandir sidebar"
              >
                <ChevronRight size={15} />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2F6EE0] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                {initial}
              </div>
              <button
                onClick={() => signOut()}
                title="Cerrar sesión"
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/06 text-white/40 hover:text-rose-300 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2F6EE0] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30 shrink-0">
                  {initial}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0A0A0A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-white/40 truncate">Administrador</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-rose-300 hover:bg-white/06 transition-colors"
              >
                <LogOut size={15} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE — bottom nav dark ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/06 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {[...mainMenu, ...gestionMenu, ...finanzasMenu].map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors",
                  isActive
                    ? "bg-[#3B82F6]/15 text-white"
                    : "text-white/50 hover:text-white"
                )}
              >
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.7} />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
