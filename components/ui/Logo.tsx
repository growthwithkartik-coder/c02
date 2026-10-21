import Image from "next/image";
import { cn } from "@/lib/utils";
import { versioned } from "@/lib/image-loader";

/* The official CO2 mark (gold infinity CO + green leaves + green 2).
   Never recoloured or redrawn — always the supplied artwork. */
export function Logo({ className, size = 44, priority = false }: { className?: string; size?: number; priority?: boolean }) {
  const w = Math.round((size * 431) / 360);
  return (
    <Image
      src={versioned("/brand/co2-logo-360.png")}
      alt="CO2"
      width={w}
      height={size}
      priority={priority}
      unoptimized
      className={cn("h-auto select-none", className)}
      style={{ width: w, height: size }}
    />
  );
}

/* Small CO2 molecule motif O=C=O used as a divider / loader. */
export function Molecule({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 120 24" className={cn("h-3 w-auto", className)} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M18 10.5h28M18 13.5h28M74 10.5h28M74 13.5h28" opacity=".7" />
      </g>
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" className={animate ? "animate-pulse" : ""} />
      <circle cx="60" cy="12" r="9" fill="currentColor" />
      <circle cx="108" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" className={animate ? "animate-pulse" : ""} />
    </svg>
  );
}
