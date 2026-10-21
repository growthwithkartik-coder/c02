import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/hero/PageHero";
import { Reveal } from "@/components/animations/motion";
import { ServiceIconMark, ServicePriceButton } from "@/components/sections/ServicesSection";
import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
import { services, servicesNote } from "@/data/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services — Packaging, Compliance, Quality & Export",
  description:
    "CO2 services: packaging consulting, packaging design, legal & regulatory compliance, quality assurance & product feasibility, regulatory compliance guidance, and export procedures & documentation support. Prices on request.",
  alternates: { canonical: "/services" },
};

const steps = [
  { n: "01", t: "Tell us about your product", b: "Share your product, market and timeline on WhatsApp or by email." },
  { n: "02", t: "Scope & quote", b: "We define the work together and send a quote — priced as per your requirements." },
  { n: "03", t: "We deliver", b: "Clear deliverables, regular updates and support until the work is done." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        dark
        kicker="CO2 Services"
        title="Expert support,"
        italic="from pack to paperwork."
        intro="Six services that help brands and makers bring cosmetic products to market — packaging, compliance, quality and export. Prices on request, as per the scope of work."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        image="24k-gold-face-elixir"
      >
        <div className="flex flex-wrap gap-3">
          <a href={priceWhatsAppHref("CO2 services")} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg" data-whatsapp-price>
            <MessageCircle className="h-4 w-4" aria-hidden /> Request pricing
          </a>
          <a href="#all-services" className="btn btn-outline-light btn-lg">See all six services</a>
        </div>
      </PageHero>

      {/* quick index — every service visible at a glance */}
      <nav id="all-services" aria-label="Services" className="relative z-20 scroll-mt-[var(--nav-h)] border-b md:sticky md:top-[var(--nav-h)] border-line bg-bone/95 backdrop-blur">
        <ul className="no-scrollbar container-site flex gap-2 overflow-x-auto py-3">
          {services.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} className="chip whitespace-nowrap">{s.n} · {s.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="container-site py-section" aria-label="Service details">
        <ol className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => {
            const dark = i % 3 === 1;
            return (
              <Reveal
                as="li"
                key={s.id}
                delay={(i % 2) * 0.06}
                className={cn("flex scroll-mt-[calc(var(--nav-h)+5rem)] flex-col border p-7 md:p-10", dark ? "border-carbon bg-carbon text-bone" : "border-line bg-bone-2/50")}
              >
                <span id={s.id} className="block scroll-mt-[calc(var(--nav-h)+5rem)]" aria-hidden />
                <div className="flex items-start justify-between gap-4">
                  <ServiceIconMark icon={s.icon} dark={dark} />
                  <span className={cn("font-display text-6xl leading-none", dark ? "text-bone/15" : "text-taupe/30")}>{s.n}</span>
                </div>
                <p className={cn("mt-8 eyebrow", dark ? "text-gold-light" : "text-gold-deep")}>{s.kicker}</p>
                <h2 className="mt-3 font-display text-[2rem] leading-[1.02] md:text-[2.6rem]">{s.title}</h2>
                <p className={cn("mt-4 leading-relaxed", dark ? "text-bone/70" : "text-ink-soft")}>{s.description}</p>
                <ul className={cn("mt-6 space-y-2.5 border-t pt-5 text-sm", dark ? "border-line-dark" : "border-line")}>
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", dark ? "text-gold-light" : "text-gold-deep")} strokeWidth={1.6} aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  <ServicePriceButton service={s} dark={dark} />
                  <span className={cn("text-xs", dark ? "text-bone/50" : "text-taupe")}>Price on request · as per scope</span>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <section className="bg-stone py-section" aria-labelledby="how">
        <div className="container-site">
          <p className="eyebrow text-ink-soft">How it works</p>
          <h2 id="how" className="mt-4 font-display text-display-sm">Simple, transparent, personal.</h2>
          <ol className="mt-10 grid gap-px bg-line md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="bg-stone p-7 md:p-8">
                <span className="font-display text-5xl leading-none text-taupe/40">{s.n}</span>
                <h3 className="mt-6 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.b}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href={priceWhatsAppHref("CO2 services")} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" data-whatsapp-price>
              <MessageCircle className="h-4 w-4" aria-hidden /> Request pricing on WhatsApp
            </a>
            <Link href="/contact" className="link-underline text-sm">Or contact us</Link>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-taupe">{servicesNote}</p>
        </div>
      </section>
    </>
  );
}
