import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md";

const base = "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

// Component polish (Fase 2E): primary in terracotta piena, secondary sobria
// con bordo, ghost per azioni minori, link come testo elegante sottolineato
// — nessuna variante ha ombre pesanti o gradienti "da SaaS".
const variants: Record<Variant, string> = {
  primary: "rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
  secondary:
    "rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]",
  ghost: "rounded-[var(--radius-md)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-subtle)]",
  link: "text-[var(--color-accent-text)] underline underline-offset-4 decoration-1 hover:text-[var(--color-accent-hover)] px-0 h-auto",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], variant !== "link" && sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], variant !== "link" && sizes[size], className)}>
      {children}
    </Link>
  );
}
