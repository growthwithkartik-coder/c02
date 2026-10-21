"use client";

import { usePathname } from "next/navigation";

/* Hides site chrome on focused routes (checkout). */
export function HideOnRoutes({ routes, children }: { routes: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  if (routes.some((r) => pathname === r || pathname.startsWith(r + "/"))) return null;
  return <>{children}</>;
}
