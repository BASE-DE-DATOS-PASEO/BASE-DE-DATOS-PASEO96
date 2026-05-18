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
import { useStore } from "@/store/useStore";

const menuItems = [
  { label: "Inicio", href: "/admin", icon: Home },
  { label: "Solicitudes", href: "/admin/solicitudes", icon: ClipboardCheck },
  { label: "Puesteros", href: "/admin/puesteros", icon: Store },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Categorías", href: "/admin/categorias", icon: Tag },
  { label: "Cobros", href: "/admin/cobros", icon: CalendarDays },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { solicitudes } = useStore();

  const displayName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ")[0]
    : user?.email
      ? user.email.split("@")[0]
      : "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente").length;

  return (
    <>
      {/* ── DESKTOP ── */}
      <aside
        className={clsx(
          "fixed left-0 top-0 hidden h-screen md:flex flex-col z-50 bg-white border-r border-[#E5E7EB] transition-[width] duration-200 ease-out",
          collapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        {/* Brand */}
        <div className={clsx(
          "shrink-0 h-[57px] flex items-center justify-between border-b border-[#E5E7EB]",
          collapsed ? "px-4" : "px-5"
        )}>
          {!collapsed ? (
            <>
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#3B82F6] flex items-center justify-center text-white text-[11px] font-bold">
                  P
                </div>
                <span className="text-[14px] font-semibold text-[#0F172A] tracking-tight">
                  Paseo 96
                </span>
              </Link>
              <button
                onClick={() => onCollapse(true)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                aria-label="Colapsar"
              >
                <ChevronLeft size={14} />
              </button>
            </>
          ) : (
            <Link href="/admin" className="mx-auto">
              <div className="w-7 h-7 rounded-md bg-[#3B82F6] flex items-center justify-center text-white text-[11px] font-bold">
                P
              </div>
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            const showBadge = item.href === "/admin/solicitudes" && solicitudesPendientes > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors mb-0.5",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-[#F1F5F9] text-[#0F172A]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                )}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.6} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {showBadge && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#3B82F6] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                        {solicitudesPendientes}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer — user */}
        <div className={clsx(
          "shrink-0 border-t border-[#E5E7EB] p-2",
        )}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => onCollapse(false)}
                className="w-full flex items-center justify-center p-2 rounded-md text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                aria-label="Expandir"
              >
                <ChevronRight size={14} />
              </button>
              <div className="w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-[11px] font-semibold">
                {initial}
              </div>
              <button
                onClick={() => signOut()}
                title="Cerrar sesión"
                className="w-full flex items-center justify-center p-2 rounded-md text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md group">
              <div className="w-7 h-7 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#0F172A] truncate">{displayName}</p>
                <p className="text-[11px] text-[#94A3B8] truncate">Admin</p>
              </div>
              <button
                onClick={() => signOut()}
                title="Cerrar sesión"
                className="p-1.5 rounded-md text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 md:hidden">
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
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 py-1.5 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-[#3B82F6] bg-[#EFF6FF]"
                    : "text-[#64748B] hover:text-[#0F172A]"
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
