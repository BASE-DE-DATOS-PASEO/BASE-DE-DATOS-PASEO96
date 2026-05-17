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
} from "lucide-react";
import clsx from "clsx";
import { useAuth, signOut } from "@/lib/auth";

const menuItems = [
  { label: "Inicio", href: "/admin", icon: Home },
  { label: "Solicitudes", href: "/admin/solicitudes", icon: ClipboardCheck },
  { label: "Puesteros", href: "/admin/puesteros", icon: Store },
  { label: "Categorías", href: "/admin/categorias", icon: Tag },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Cobros", href: "/admin/cobros", icon: CalendarDays },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ")[0]
    : user?.email
      ? user.email.split("@")[0]
      : "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* ── DESKTOP — dark editorial sidebar ── */}
      <aside
        className={clsx(
          "v3-admin-sidebar fixed left-0 top-0 hidden h-screen md:flex flex-col z-50 transition-[width] duration-300 ease-out",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 shrink-0 border-b border-white/06">
          {!collapsed ? (
            <Link href="/admin" className="text-[15px] font-extrabold tracking-[-0.02em] text-white">
              PASEO <span className="text-[#3B82F6]">96</span>
            </Link>
          ) : (
            <Link href="/admin" className="text-[15px] font-extrabold tracking-[-0.02em] text-[#3B82F6] mx-auto">
              96
            </Link>
          )}
          {!collapsed && (
            <button
              onClick={() => onCollapse(true)}
              className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors"
              aria-label="Colapsar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Admin label */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Panel
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "v3-admin-sidebar-item",
                  collapsed && "justify-center !px-0 !py-3",
                  isActive && "is-active"
                )}
              >
                <Icon size={17} strokeWidth={isActive ? 2 : 1.6} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer — user + logout */}
        <div className={clsx("px-3 py-4 shrink-0 border-t border-white/06", collapsed && "px-2")}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => onCollapse(false)}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors"
                aria-label="Expandir"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => signOut()}
                title="Cerrar sesión"
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/8 text-white/40 hover:text-rose-400 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2F6EE0] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/30 shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-white/45 truncate">Administrador</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/55 hover:text-rose-300 hover:bg-white/06 transition-colors"
              >
                <LogOut size={15} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE — bottom nav (dark) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/06 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {menuItems.map((item) => {
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
