import Link from "next/link";
import { Instagram, Mail, MessageCircle, Phone, Facebook, Youtube } from "lucide-react";
import { Logo, Molecule } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { PopularLinks } from "@/components/footer/PopularLinks";
import { footerNav, site } from "@/data/site";

/* Footer: popular links (dynamic from the catalogue) → four link columns,
   newsletter with consent copy, real contact details and only the social
   accounts set in data/site.ts (empty ones are hidden). */
export function Footer() {
  const socials = [
    { label: "Instagram", href: site.social.instagram, icon: Instagram },
    { label: "Facebook", href: site.social.facebook, icon: Facebook },
    { label: "YouTube", href: site.social.youtube, icon: Youtube },
    { label: "Pinterest", href: site.social.pinterest, icon: null },
  ].filter((s) => s.href);

  return (
    <>
      <PopularLinks />
      <footer className="relative overflow-hidden bg-carbon text-bone grain">
        <div className="container-site pt-16 md:pt-24">
          <div className="grid gap-12 border-b border-line-dark pb-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Logo size={56} />
              <p className="mt-7 max-w-sm font-display text-4xl leading-[1.02]">
                We make it <span className="italic text-gold-light">for you.</span>
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">Personalized skincare and cosmetics — ready-made essentials, travel sizes and formulas made to order.</p>
              <div className="mt-8 max-w-md">
                <p className="eyebrow mb-3 text-bone/60">The CO2 letter</p>
                <NewsletterForm dark compact />
              </div>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8 lg:pl-8">
              <FooterCol title="CO2" links={footerNav.brand} />
              <FooterCol title="Shop" links={footerNav.shop} />
              <FooterCol title="Customer Care" links={footerNav.care} />
              <FooterCol title="Discover" links={footerNav.discover} />
            </nav>
          </div>

          <div className="grid gap-8 py-10 md:grid-cols-2 md:items-center">
            <ul className="flex flex-col gap-3 text-sm text-bone/80 sm:flex-row sm:flex-wrap sm:gap-x-8">
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 hover:text-gold-light">
                  <Mail className="h-4 w-4" strokeWidth={1.4} /> {site.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-gold-light">
                  <Phone className="h-4 w-4" strokeWidth={1.4} /> {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold-light">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp
                </a>
              </li>
              <li className="text-bone/50">{site.contact.hours}</li>
            </ul>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-3 md:justify-end" aria-label="CO2 on social media">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="chip chip-dark">
                      {s.icon && <s.icon className="h-3.5 w-3.5" />} {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-line-dark pb-10 pt-8 text-xs text-bone/50 md:flex-row md:items-center md:justify-between md:pb-12">
            <p>© {new Date().getFullYear()} CO2 — a brand of {site.legalName}. All rights reserved.</p>
            <Molecule className="hidden text-gold md:block" />
            <ul className="flex flex-wrap gap-5">
              <li><Link href="/privacy" className="hover:text-bone">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-bone">Terms</Link></li>
              <li><Link href="/shipping" className="hover:text-bone">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-bone">Returns</Link></li>
              <li><Link href="/cancellation" className="hover:text-bone">Cancellation</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow text-gold-light/80">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="link-underline text-bone/80 hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
