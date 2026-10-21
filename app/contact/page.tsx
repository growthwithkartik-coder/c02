import type { Metadata } from "next";
import { Mail, MessageCircle, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/hero/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact", description: "Contact CO2 customer care — orders, products, made-to-order formulas and partnerships.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <PageHero kicker="Contact" title="Write to us —" italic="we read everything." crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} compact />
      <section className="container-site pb-section">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ul className="space-y-8">
              <li><p className="eyebrow text-taupe">Email</p><a href={`mailto:${site.contact.email}`} className="mt-2 flex items-center gap-3 font-display text-2xl hover:text-gold-deep"><Mail className="h-5 w-5" strokeWidth={1.3} />{site.contact.email}</a></li>
              <li><p className="eyebrow text-taupe">Phone</p><a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="mt-2 flex items-center gap-3 font-display text-2xl hover:text-gold-deep"><Phone className="h-5 w-5" strokeWidth={1.3} />{site.contact.phone}</a></li>
              <li><p className="eyebrow text-taupe">WhatsApp</p><a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-3 font-display text-2xl hover:text-gold-deep"><MessageCircle className="h-5 w-5" strokeWidth={1.3} />Message us</a></li>
              <li><p className="eyebrow text-taupe">Hours</p><p className="mt-2 flex items-center gap-3 text-ink-soft"><Clock className="h-5 w-5" strokeWidth={1.3} />{site.contact.hours}</p></li>
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
