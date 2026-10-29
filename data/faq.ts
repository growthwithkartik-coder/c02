import { site } from "./site";

const c = site.commerce;

export const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Prices",
    items: [
      { q: "Where can I see prices?", a: "Every ready-made product shows its full-size price and net weight on its card and product page. Where a travel size exists, its net weight and price are shown beside the full size." },
      { q: "What about customized products?", a: `Made-to-order formulas, custom packaging and bulk orders are priced on request, as per your customization. Use the request form on the Customization page, message us on WhatsApp (${site.contact.phone}) or email ${site.contact.email} — nothing is charged until you agree.` },
    ],
  },
  {
    group: "Products & ingredients",
    items: [
      { q: "Where do your ingredient lists come from?", a: "Every ingredient and claim on this site is taken from the text printed on the product's own pack. We don't publish percentages, certifications or clinical results that aren't on the pack." },
      { q: "Are CO2 products suitable for sensitive skin?", a: "Each product page lists the skin types it suits. If your skin is sensitive, patch-test a small amount on the inner arm for 24 hours before first use, and stop using any product that causes discomfort." },
      { q: "Are your products medical treatments?", a: "No. CO2 products are cosmetics. Words like “clarifying” or “anti-dandruff” describe the cosmetic purpose printed on the pack, not a medical treatment. For a skin or scalp condition, please see a dermatologist." },
      { q: "How should I store my products?", a: "Keep products closed, away from direct sunlight and heat. Keep bath bars dry between uses so they last longer." },
    ],
  },
  {
    group: "Customization",
    items: [
      { q: "How do made-to-order formulas work?", a: "Open Customize Your Product (or the Make It Yours builder), choose the formula options, size and packaging — container, colour and cap. After you order we confirm your formula by email, prepare it, and send it with a formula card. You can also send a customization request for sizes or packaging; nothing is charged until we confirm." },
      { q: "How long does a custom formula take?", a: "Most made-to-order formulas take 5–8 working days to prepare, plus delivery time." },
      { q: "Can I return a custom formula?", a: "Because each one is made for you, custom formulas can't be returned unless they arrive damaged or different from what you ordered. We're happy to adjust your next batch." },
    ],
  },
  {
    group: "Make It Yours",
    items: [
      { q: "How does Make It Yours work?", a: "Choose a category (Face & Skin, Hair, Body or Lips), answer a short consultation and see a suggested routine from CO2 products — before you buy anything. You can then personalize eligible products and their packaging in the builder." },
      { q: "Is my routine a diagnosis or a custom formula?", a: "Neither. It's a cosmetic recommendation from our range. A custom formula is only made when you build and order one, and we confirm it with you first." },
      { q: "What is an on-request formula?", a: "A formula we don't list yet (for example a body lotion or shampoo made your way). You send a request; we reply with what's possible, the price and the timeline. Nothing is charged until you accept." },
      { q: "Can I choose my packaging?", a: "Yes, for customizable products. Only containers, colours and caps made for that product are offered, and you can preview them in 3D." },
    ],
  },
  {
    group: "Sampling & combos",
    items: [
      { q: "Are samples free?", a: "No. Each travel size has its own listed price, and a sample set costs the sum of the travel sizes inside it." },
      { q: "Do combos include a discount?", a: "No — a combo costs the sum of its products' listed prices. If a combo offer runs, it will be stated with its terms." },
    ],
  },
  {
    group: "Orders & payment",
    items: [
      { q: "Which payment methods do you accept?", a: "Cards, UPI, net banking and popular wallets through Razorpay's secure checkout. You can also pay by scanning our UPI QR code at checkout." },
      { q: "Is cash on delivery available?", a: c.codAvailable ? "Yes, on eligible PIN codes." : "Not at the moment — all orders are prepaid." },
      { q: "Can I change or cancel my order?", a: `Write to ${site.contact.email} or WhatsApp us as soon as possible. Orders can be cancelled before dispatch — see the cancellation policy.` },
      { q: "Do you have discount codes?", a: "New subscribers to the CO2 letter receive an introductory code. Only one code can be used per order." },
    ],
  },
  {
    group: "Shipping & returns",
    items: [
      { q: "How much is shipping?", a: `Free on orders over ₹${c.freeShippingThreshold}. Otherwise a flat ₹${c.shippingFee}.` },
      { q: "How long does delivery take?", a: `Orders are dispatched in ${c.dispatchDays} and usually arrive in ${c.deliveryDays}.` },
      { q: "What is your returns policy?", a: `Unopened, unused products can be returned within ${c.returnWindowDays} days of delivery. Damaged or incorrect items are replaced free of charge — just send us a photo within 48 hours of delivery.` },
    ],
  },
];
