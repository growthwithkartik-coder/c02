/* ------------------------------------------------------------------
   CO2 — shared types
------------------------------------------------------------------- */

/** "made-personal" is used only by made-to-order formulas (data/custom-formulas.ts), never by catalogue products. */
export type CategoryId = "face" | "body" | "hair" | "lips" | "made-personal";

/** "price-pending": shown in the catalogue, but cannot be ordered until a real price is entered. */
export type Availability = "in-stock" | "low-stock" | "out-of-stock" | "made-to-order" | "price-pending";

export interface Benefit {
  title: string;
  text: string;
}

export interface Ingredient {
  name: string;
  note: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified?: boolean;
}

export interface Shade {
  name: string;
  hex: string;
  /** product photograph key showing this shade (multi-shade products) */
  image?: string;
}

export interface CustomFormula {
  vessel: string;
  fill: string;
  options: string[];
  faq: { q: string; a: string }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  type: string;
  shortDescription: string;
  description: string;
  lede: string;
  story: string[];
  benefits: Benefit[];
  ingredients: Ingredient[];
  keyIngredients: string[];
  howToUse: string[];
  size: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  cutout: string | null;
  availability: Availability | string;
  rating: number | null;
  reviewCount: number;
  reviews: Review[];
  tags: string[];
  badge: string | null;
  skinTypes: string[];
  texture: string;
  finish: string;
  forWho: string;
  specs: { label: string; value: string }[];
  shades: Shade[];
  bestSeller: boolean;
  featured: boolean;
  custom: CustomFormula | null;
  order: number;
}

export interface Category {
  id: CategoryId;
  label: string;
  title: string;
  description: string;
  hero: string; // campaign cutout or product image key
  types: { id: string; label: string }[];
}

export interface Collection {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  story: string;
  hero: string;
  tone: "dark" | "light";
  products: string[];
}

/* ---------------- cart ---------------- */

export interface CartLine {
  key: string; // slug + variant fingerprint
  slug: string;
  qty: number;
  shade?: string;
  options?: Record<string, string>;
  /** "sample" = travel size from the Sampling Studio (priced from data/sampling.ts) */
  size?: "full" | "sample";
  /** combo / sample-set name the line was added with (display only, never affects price) */
  bundle?: string;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number;
  appliedCode: string | null;
}

/* ---------------- orders ---------------- */

export type PaymentMethod = "razorpay" | "upi-qr";

export type PaymentStatus =
  | "created"
  | "pending"
  | "paid"
  | "failed"
  | "pending-verification";

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  slug: string;
  name: string;
  image: string | null;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  shade?: string;
  options?: Record<string, string>;
  size?: "full" | "sample";
  sizeLabel?: string;
  bundle?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  shipping: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode: string | null;
  shippingFee: number;
  total: number;
  currency: "INR";
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  upiReference?: string;
  notes?: string;
}
