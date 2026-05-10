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
} from "lucide-react";
import clsx from "clsx";

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

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen bg-white flex flex-col z-50 sidebar-transition border-r border-border",
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
          <button
            onClick={() => onCollapse(false)}
            className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-blue-50 text-muted transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20 shrink-0">
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Jere</p>
              <p className="text-[11px] text-muted truncate">Administrador</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
