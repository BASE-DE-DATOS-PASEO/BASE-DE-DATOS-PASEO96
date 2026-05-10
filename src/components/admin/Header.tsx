"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white/80 border-b border-border flex items-center justify-between px-8 backdrop-blur-xl">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ExternalLink size={15} />
        Ver sitio
      </Link>
    </header>
  );
}
