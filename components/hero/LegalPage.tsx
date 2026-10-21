import { PageHero } from "./PageHero";

/* `confirm` lists the details the business still has to confirm. The box is
   an internal note: it shows while developing (`npm run dev`) so a draft is
   never mistaken for a final policy, and is left out of the production build
   so customers never see placeholder text. Confirm every item before launch. */
const showDraftNotes = process.env.NODE_ENV !== "production";

export function LegalPage({ kicker, title, updated, intro, children, confirm }: { kicker: string; title: string; updated?: string; intro?: string; children: React.ReactNode; confirm?: string[] }) {
  return (
    <>
      <PageHero kicker={kicker} title={title} intro={intro} crumbs={[{ label: "Home", href: "/" }, { label: title }]} compact />
      <section className="container-site pb-section">
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            {updated && <p className="eyebrow text-taupe">Last updated · {updated}</p>}
            <nav aria-label="Policies" className="mt-6 space-y-2 text-sm">
              {[["Shipping", "/shipping"], ["Returns & refunds", "/returns"], ["Cancellation", "/cancellation"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, h]) => (
                <a key={h} href={h} className="block text-ink-soft hover:text-ink">{l}</a>
              ))}
            </nav>
          </aside>
          <article className="prose-co2 lg:col-span-7">
            {showDraftNotes && confirm && confirm.length > 0 && (
              <div className="not-prose mb-10 border border-gold bg-gold/5 p-5 text-sm" role="note">
                <p className="font-semibold uppercase tracking-[0.14em] text-gold-deep">Internal note — visible in development only</p>
                <p className="mt-2 text-ink-soft">This policy is a structured draft. Confirm the items below (and have the policy reviewed legally) before launch:</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-ink">{confirm.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            )}
            {children}
          </article>
        </div>
      </section>
    </>
  );
}
