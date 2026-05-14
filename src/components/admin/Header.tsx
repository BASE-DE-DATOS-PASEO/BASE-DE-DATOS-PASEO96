"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Header({ title }: { title: string }) {
  return (
    <header className="min-h-16 bg-white/80 border-b border-border flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 backdrop-blur-xl">
      <h1 className="min-w-0 truncate text-lg sm:text-xl font-semibold text-foreground">{title}</h1>
      <Link
        href="/"
        target="_blank"
        className="flex shrink-0 items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ExternalLink size={15} />
        <span className="hidden sm:inline">Ver sitio</span>
      </Link>
    </header>
  );
}
