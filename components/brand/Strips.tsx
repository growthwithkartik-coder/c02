import Link from "next/link";
import { FlaskConical, Leaf, MessageCircle, PackageOpen, RotateCcw, ShieldCheck, Sparkles, Truck, type LucideIcon } from "lucide-react";
import { site } from "@/data/site";
import { sampling } from "@/data/sampling";
import { cn, money } from "@/lib/utils";

/* ------------------------------------------------------------------
   Benefit + trust strips. Every item here is backed by something real
   in the project:
   - free shipping threshold / fee     → data/site.ts commerce
   - secure payments                   → Razorpay (server-verified) + UPI QR
   - returns window                    → data/site.ts + /returns policy
   - ingredients listed                → every product has an ingredient list
   - travel sizes                      → data/sampling.ts
   - WhatsApp support                  → the real business number
   Deliberately NOT shown (not substantiated in the project): cruelty-free,
   "100% authentic", dermatologist-tested, natural/organic certifications.
------------------------------------------------------------------- */

type Item = { icon: LucideIcon; title: string; text: string; href?: string };

export function BenefitsStrip({ className, dark }: { className?: string; dark?: boolean }) {
  const items: Item[] = [
    { icon: Sparkles, title: "Personalized beauty", text: "Routines built from your answers", href: "/make-it-yours" },
    { icon: FlaskConical, title: "Ingredient transparency", text: "Key ingredients listed on every product", href: "/ingredients" },
    ...(sampling.enabled ? [{ icon: PackageOpen, title: "Travel-size sampling", text: "Try selected formulas small first", href: "/sampling" }] : []),
    { icon: Leaf, title: "Made to order", text: "Formulas confirmed with you before they're made", href: "/make-it-yours/build" },
  ];
  return <StripRow items={items} className={className} dark={dark} label="Why CO2" />;
}

export function TrustStrip({ className, dark }: { className?: string; dark?: boolean }) {
  const c = site.commerce;
  const items: Item[] = [
    { icon: Truck, title: `Free shipping over ${money(c.freeShippingThreshold)}`, text: `Otherwise ${money(c.shippingFee)} · ${c.deliveryDays}`, href: "/shipping" },
    { icon: ShieldCheck, title: "Secure payments", text: "Razorpay checkout or UPI — verified on our server", href: "/faq#orders-payment" },
    { icon: RotateCcw, title: `${c.returnWindowDays}-day returns`, text: "On unopened ready-made products · conditions apply", href: "/returns" },
    { icon: MessageCircle, title: "Real people on WhatsApp", text: site.contact.hours, href: `https://wa.me/${site.contact.whatsapp}` },
  ];
  return <StripRow items={items} className={className} dark={dark} label="Shopping with CO2" />;
}

function StripRow({ items, className, dark, label }: { items: Item[]; className?: string; dark?: boolean; label: string }) {
  return (
    <section aria-label={label} className={cn(dark ? "bg-carbon text-bone" : "border-y border-line bg-bone", className)}>
      <ul className="no-scrollbar container-site flex snap-x snap-mandatory gap-0 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible">
        {items.map((it, i) => {
          const Icon = it.icon;
          const inner = (
            <>
              <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full border", dark ? "border-line-dark text-gold-light" : "border-line text-gold-deep")}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.3} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.8125rem] font-medium uppercase tracking-[0.12em]">{it.title}</span>
                <span className={cn("mt-0.5 block text-xs", dark ? "text-bone/55" : "text-ink-soft")}>{it.text}</span>
              </span>
            </>
          );
          const cls = cn("flex min-w-[78%] snap-start items-center gap-4 py-6 pr-6 xs:min-w-[60%] sm:min-w-[45%] md:min-w-0", i > 0 && (dark ? "md:border-l md:border-line-dark md:pl-6" : "md:border-l md:border-line md:pl-6"));
          return (
            <li key={it.title} className={cls}>
              {it.href ? (
                it.href.startsWith("http") ? (
                  <a href={it.href} target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:opacity-80">{inner}</a>
                ) : (
                  <Link href={it.href} className="flex items-center gap-4 hover:opacity-80">{inner}</Link>
                )
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
