"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Optional kept for backwards compat — ignored */
  eyebrow?: string;
  /** Optional kept for backwards compat — ignored */
  titleAccent?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-30">
      <div className="px-6 sm:px-8 lg:px-10 py-5 sm:py-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#0F172A] tracking-[-0.01em] truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-[#64748B] mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <ExternalLink size={13} />
            Ver sitio
          </Link>
        </div>
      </div>
    </header>
  );
}
