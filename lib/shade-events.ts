/* Product-page shade sync. The shade picker (ProductPurchase) announces the
   chosen shade; the gallery shows that shade's photograph and the try-on
   panel opens on that shade. A window event keeps the three components
   independent (they render in different parts of a server page). */

export const SHADE_EVENT = "co2:shade";

export interface ShadeEventDetail {
  slug: string;
  shade: string;
  image?: string;
}

export function announceShade(detail: ShadeEventDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ShadeEventDetail>(SHADE_EVENT, { detail }));
}

export function onShade(slug: string, cb: (d: ShadeEventDetail) => void) {
  const h = (e: Event) => {
    const d = (e as CustomEvent<ShadeEventDetail>).detail;
    if (d?.slug === slug) cb(d);
  };
  window.addEventListener(SHADE_EVENT, h);
  return () => window.removeEventListener(SHADE_EVENT, h);
}
