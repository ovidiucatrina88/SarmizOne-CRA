import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

type GlowVariant = "navy" | "purple" | "emerald";

const variantMap: Record<GlowVariant, string> = {
  navy: "from-[#1b2747]/80 via-[#141c33]/90 to-[#0c101d]/95",
  purple: "from-[#302452]/80 via-[#201636]/90 to-[#0f0a1a]/95",
  emerald: "from-[#103e35]/85 via-[#0b2d26]/90 to-[#051612]/95",
};

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: GlowVariant;
  compact?: boolean;
  blur?: boolean;
}

export function GlowCard({
  children,
  variant = "navy",
  compact = false,
  blur = true,
  className,
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br shadow-[0_40px_120px_rgba(5,8,25,0.55)]",
        variantMap[variant],
        className,
      )}
      {...props}
    >
      {blur && <div className="pointer-events-none absolute inset-0 opacity-60 blur-3xl" />}
      <div className={cn("relative", compact ? "px-4 py-3 sm:px-5 sm:py-4" : "p-6 sm:p-8")}>{children}</div>
    </div>
  );
}
