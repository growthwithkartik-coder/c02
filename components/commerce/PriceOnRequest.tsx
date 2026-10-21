import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { cn, PRICE_ON_REQUEST_LABEL, PRICE_ON_REQUEST_NOTE } from "@/lib/utils";

/* Prices are not listed on the site (Oct 2026). Every item and service is
   quoted on request, as per the customer's customization. Every "Request
   price" / "Request pricing" button opens WhatsApp on the site's existing
   number (site.contact.whatsapp) with a pre-filled quote request naming the
   product or service. wa.me opens the WhatsApp app on mobile and WhatsApp
   Web / Desktop on a computer. */

/** WhatsApp chat with a pre-filled price-quote request for `item`. */
export function priceWhatsAppHref(item?: string) {
  const what = item?.trim();
  const text = what
    ? `Hello CO2, I'd like a price quote for: ${what}. (Price as per my customization.) Please share the details.`
    : "Hello CO2, I'd like a price quote (as per my customization). Please share the details.";
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** The written request form on /customization, prefilled with the item (secondary option). */
export function priceRequestHref(item?: string) {
  return item ? `/customization?item=${encodeURIComponent(item)}#request` : "/customization#request";
}

/** Inline "Price on request · as per customization" label. */
export function PriceOnRequestTag({ className, short = false }: { className?: string; short?: boolean }) {
  return (
    <span className={cn("text-taupe", className)} data-price-on-request>
      {PRICE_ON_REQUEST_LABEL}
      {!short && <span className="opacity-80"> · {PRICE_ON_REQUEST_NOTE.toLowerCase()}</span>}
    </span>
  );
}

/** "Request price" button → WhatsApp. */
export function WhatsAppPriceButton({ item, label = "Request price", className }: { item?: string; label?: string; className?: string }) {
  return (
    <a href={priceWhatsAppHref(item)} target="_blank" rel="noopener noreferrer" className={className} data-whatsapp-price>
      <MessageCircle className="h-4 w-4" aria-hidden /> {label}
    </a>
  );
}

/** Primary WhatsApp price request + secondary written request form. */
export function RequestPriceButtons({ item, className, dark = false, size = "lg" }: { item?: string; className?: string; dark?: boolean; size?: "sm" | "lg" }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <WhatsAppPriceButton item={item} className={cn("btn flex-1", size === "lg" ? "btn-lg" : "btn-sm", dark ? "btn-gold" : "btn-primary")} />
      <Link href={priceRequestHref(item)} className={cn("btn", size === "lg" ? "btn-lg" : "btn-sm", dark ? "btn-outline-light" : "btn-outline")}>
        Request form
      </Link>
    </div>
  );
}

/** A full panel: label, one-line explanation and both CTAs. */
export function PriceOnRequestPanel({ item, className, dark = false }: { item?: string; className?: string; dark?: boolean }) {
  return (
    <div className={cn("border p-5", dark ? "border-bone/15 bg-bone/5 text-bone" : "border-line bg-bone-2/60", className)} data-price-pending-panel>
      <p className={cn("font-display text-2xl", dark ? "text-bone" : "text-ink")}>{PRICE_ON_REQUEST_LABEL}</p>
      <p className={cn("mt-1 text-sm leading-relaxed", dark ? "text-bone/65" : "text-ink-soft")}>
        {PRICE_ON_REQUEST_NOTE} — the price depends on the size, formula, packaging and quantity you choose. Tap &ldquo;Request price&rdquo; to get a quote on WhatsApp.
      </p>
      <RequestPriceButtons item={item} dark={dark} className="mt-4" />
    </div>
  );
}
