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
      <aside
        className={clsx(
          "fixed left-0 top-0 hidden h-screen bg-white md:flex flex-col z-50 sidebar-transition border-r border-border",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-foreground">
              PASEO <span className="text-accent blue-glow">96</span>
            </span>
          )}
          {collapsed && (
            <span className="text-lg font-bold tracking-tight text-accent blue-glow mx-auto">96</span>
          )}
          {!collapsed && (
            <button
              onClick={() => onCollapse(true)}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-muted transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-accent text-white font-semibold shadow-lg shadow-accent/20"
                    : "text-gray-500 hover:text-foreground hover:bg-blue-50"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={clsx("px-4 py-4 border-t border-border shrink-0", collapsed && "px-2")}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => onCollapse(false)}
                className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-blue-50 text-muted transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => signOut()}
                title="Cerrar sesión"
                className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-blue-50 text-muted hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20 shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{displayName}</p>
                  <p className="text-[11px] text-muted truncate">Administrador</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted hover:text-red-500 hover:bg-blue-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden">
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
                    ? "bg-accent text-white"
                    : "text-gray-500 hover:bg-blue-50 hover:text-foreground"
                )}
              >
                <Icon size={17} strokeWidth={isActive ? 2.4 : 1.7} />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
