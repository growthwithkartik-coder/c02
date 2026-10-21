"use client";

import { Sparkles } from "lucide-react";
import { useTryOn } from "./TryOnProvider";
import { cn } from "@/lib/utils";

/** "Try It On" — opens the virtual lip try-on with the given shade/product selected. */
export function TryOnButton({ shade, className, label = "Try It On", variant = "primary" }: { shade?: string; className?: string; label?: string; variant?: "primary" | "gold" | "outline" | "outline-light" | "light" }) {
  const { open } = useTryOn();
  return (
    <button type="button" onClick={() => open(shade)} className={cn("btn", `btn-${variant}`, className)} data-testid="try-it-on">
      <Sparkles className="h-4 w-4" aria-hidden /> {label}
    </button>
  );
}
