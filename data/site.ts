/* ------------------------------------------------------------------
   CO2 — site configuration
   Everything a non-developer may need to change lives here.
   Values marked TODO should be confirmed before launch.
------------------------------------------------------------------- */

export const site = {
  name: "CO2",
  legalName: "DemiGod House LLP", // TODO confirm: seller of record (Razorpay account holder)
  tagline: "Cosmetics, Made Personal",
  description:
    "CO2 is a personalized beauty brand: tell us what you need, discover a routine made around you, try travel sizes, and personalize products and packaging — or shop ready-made skin, hair, body and lip care.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en_IN",
  currency: "INR" as const,

  contact: {
    // customer-care inbox — dev@demigodhouse.com (Oct 2026); TODO confirm the number
    email: "dev@demigodhouse.com",
    phone: "+91 83558 97803",
    whatsapp: "918355897803",
    hours: "Mon – Sat, 10:00 – 19:00 IST",
    address: "DemiGod House LLP, India",
  },

  social: {
    // TODO add the real CO2 handles; empty strings are hidden in the UI
    instagram: "",
    instagramHandle: "@co2.cosmetics",
    facebook: "",
    youtube: "",
    pinterest: "",
  },

  commerce: {
    freeShippingThreshold: 999,
    shippingFee: 79,
    codAvailable: false,
    dispatchDays: "1–2 working days",
    deliveryDays: "3–7 working days across India",
    returnWindowDays: 7,
    // Discount codes are validated on the server too (lib/cart.ts)
    discountCodes: {
      WELCOME10: { type: "percent", value: 10, label: "10% off your first order" },
    } as Record<string, { type: "percent" | "flat"; value: number; label: string }>,
  },

  /* Campaign character. No CO2 model photography was supplied, so the
     homepage uses an original illustrated "CO2 Muse". To use a real
     campaign face, add the image to /public/characters and set the path
     below (transparent PNG/WebP, portrait, facing right works best). */
  campaign: {
    heroCharacter: null as string | null, // e.g. "/characters/hero-face.webp"
    glossCharacter: null as string | null, // e.g. "/characters/gloss-face.webp"
  },

  upi: {
    payee: "DemiGod House LLP",
    qr: "/brand/upi-qr-demigod-house-llp.png",
  },
};

/* Main navigation. `dept` opens that department's mega menu; `mega`
   opens a special panel; `highlight` styles the Make It Yours pill. */
export type NavItem = {
  label: string;
  href: string;
  highlight?: boolean;
  dept?: "skin" | "hair" | "body" | "lips";
  mega?: "shop" | "combos" | "miy";
  /** hide on narrower desktop widths to keep the bar on one line */
  wide?: boolean;
};
export const nav: NavItem[] = [
  { label: "Home", href: "/", wide: true },
  { label: "Shop All", href: "/shop", mega: "shop" },
  { label: "Skincare", href: "/shop/skin", dept: "skin" },
  { label: "Hair Care", href: "/shop/hair", dept: "hair" },
  { label: "Body Care", href: "/shop/body", dept: "body" },
  { label: "Lips", href: "/shop/lips", dept: "lips" },
  { label: "Combos", href: "/combos", mega: "combos", wide: true },
  { label: "Customization", href: "/customization", wide: true },
  { label: "Services", href: "/services" },
  { label: "Make It Yours", href: "/make-it-yours", highlight: true, mega: "miy" },
  { label: "Our Story", href: "/about", wide: true },
];

/** Announcement bar — rotates through these. Brand lines only; offers are
 *  added here when they are real (the shipping threshold and code below are). */
export const announcements = [
  "Beauty, made personal",
  "Prices on request · as per customization",
  "Discover a routine made around you",
  `Free shipping across India over ₹999`,
  "Your skin is unique — your skincare should be too",
  "Find your routine before you find your product",
  "WELCOME10 — 10% off your first order",
];

export const footerNav = {
  brand: [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Our Philosophy", href: "/about#philosophy" },
    { label: "Make It Yours", href: "/make-it-yours" },
    { label: "Sampling Studio", href: "/sampling" },
    { label: "Contact Us", href: "/contact" },
  ],
  shop: [
    { label: "Shop All", href: "/shop" },
    { label: "Skincare", href: "/shop/skin" },
    { label: "Hair Care", href: "/shop/hair" },
    { label: "Body Care", href: "/shop/body" },
    { label: "Lips", href: "/shop/lips" },
    { label: "Customize Your Product", href: "/customization" },
    { label: "Combos", href: "/combos" },
    { label: "Travel Sizes", href: "/sampling#travel-sizes" },
  ],
  care: [
    { label: "FAQs", href: "/faq" },
    { label: "Contact Support", href: "/contact" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Refunds Policy", href: "/returns" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  discover: [
    { label: "Ingredient Guide", href: "/ingredients" },
    { label: "Customization Guide", href: "/guides/customization" },
    { label: "Sampling Guide", href: "/guides/sampling" },
    { label: "Product Care", href: "/guides/product-care" },
    { label: "Popular Products", href: "/shop/bestsellers" },
  ],
};
