import Link from "next/link";
import { ArrowRight, ClipboardCheck, FlaskConical, Globe2, MessageCircle, Package, Palette, Scale } from "lucide-react";
import { Reveal } from "@/components/animations/motion";
import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
import { services, type Service, type ServiceIcon } from "@/data/services";
import { cn } from "@/lib/utils";

const ICONS: Record<ServiceIcon, typeof Package> = {
  package: Package,
  palette: Palette,
  scale: Scale,
  flask: FlaskConical,
  clipboard: ClipboardCheck,
  globe: Globe2,
};

export function ServiceIconMark({ icon, className, dark }: { icon: ServiceIcon; className?: string; dark?: boolean }) {
  const Icon = ICONS[icon];
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid h-14 w-14 shrink-0 place-items-center rounded-full border",
        dark ? "border-gold-light/40 bg-gold-light/10 text-gold-light" : "border-gold/40 bg-gold/10 text-gold-deep",
        className,
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={1.3} />
    </span>
  );
}

export function ServicePriceButton({ service, className, dark, solid = true }: { service: Pick<Service, "title">; className?: string; dark?: boolean; solid?: boolean }) {
  return (
    <a
      href={priceWhatsAppHref(`${service.title} (CO2 service)`)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("btn btn-sm", solid ? (dark ? "btn-gold" : "btn-primary") : dark ? "btn-outline-light" : "btn-outline", className)}
      data-whatsapp-price
      aria-label={`Request pricing for ${service.title} on WhatsApp`}
    >
      <MessageCircle className="h-4 w-4" aria-hidden /> Request pricing
    </a>
  );
}

/** Homepage block — all six services visible at once, no tabs or dropdowns. */
export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-stone py-section text-ink scroll-mt-[var(--nav-h)]" aria-labelledby="services-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(40%_60%_at_85%_10%,rgba(184,148,84,.14),transparent_70%)]" />
      <div className="container-site relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold-deep">Our services</p>
            <h2 id="services-title" className="mt-5 font-display text-display-md">
              From pack to paperwork — <span className="italic text-gold-deep">expert support</span> for your product.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-ink-soft">Beyond our own range, CO2 helps brands and makers bring cosmetic products to market: packaging, compliance, quality and export — under one roof.</p>
            <Link href="/services" className="link-underline mt-5 inline-flex items-center gap-2 text-sm text-ink hover:text-gold-deep">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 3) * 0.08} className="group flex flex-col bg-bone p-7 transition-colors hover:bg-bone-2 md:p-9">
              <div className="flex items-start justify-between gap-4">
                <ServiceIconMark icon={s.icon} />
                <span className="font-display text-5xl leading-none text-taupe/30">{s.n}</span>
              </div>
              <p className="mt-8 text-[0.6875rem] uppercase tracking-[0.18em] text-gold-deep">{s.kicker}</p>
              <h3 className="mt-2 font-display text-[1.85rem] leading-[1.05] md:text-[2.1rem]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.summary}</p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                <ServicePriceButton service={s} />
                <Link href={`/services#${s.id}`} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-taupe hover:text-gold-deep">
                  Details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
