/* Safe localStorage helpers — storage can be unavailable (private mode,
   blocked cookies), so every access is wrapped. */

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export const STORAGE_KEYS = {
  cart: "co2.cart.v1",
  code: "co2.cart.code.v1",
  wishlist: "co2.wishlist.v1",
  profile: "co2.profile.v1",
  orders: "co2.orders.v1",
  reviews: "co2.reviews.v1",
  intro: "co2.intro.seen",
  compare: "co2.compare.v1",
  consult: "co2.consult.v1",
  consultResult: "co2.consult.result.v1",
  tryOnShade: "co2.tryon.shade.v1",
} as const;
