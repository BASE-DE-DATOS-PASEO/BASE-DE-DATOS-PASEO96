"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, eyebrow, action }: HeaderProps) {
  return (
    <header className="border-b border-[#0A0A0A]/06 bg-[#FAFAF7]/85 backdrop-blur-md sticky top-0 z-30">
      <div className="px-5 sm:px-8 lg:px-12 py-5 sm:py-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6] mb-1.5">
              <span className="w-5 h-px bg-[#3B82F6]" />
              {eyebrow}
            </span>
          )}
          <h1 className="v3-admin-page-title truncate">{title}</h1>
          {subtitle && <p className="v3-admin-page-subtitle">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#525252] hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/04 transition-colors"
          >
            Ver sitio
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </header>
  );
}
