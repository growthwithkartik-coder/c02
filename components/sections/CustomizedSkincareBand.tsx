import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/motion";
import { productImage } from "@/lib/utils";

/* SECTION 03 — the entry to Customized Skincare. */
export function CustomizedSkincareBand() {
  const steps = [
    ["Tell us about your skin", "Skin type, concerns, goals, current routine and what you like or avoid — about three minutes."],
    ["Get your matches", "CO2 products matched to your answers, each with the reasons from its pack."],
    ["Follow the order", "A morning, evening and weekly routine, ready to add to your cart in one step."],
  ];
  return (
    <section className="relative overflow-hidden bg-carbon py-section text-bone grain" aria-labelledby="cs-title">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-gold-light">Customized Skincare</p>
          <h2 id="cs-title" className="mt-5 max-w-[14ch] font-display text-display-md">Tell us about your skin. We&rsquo;ll build the routine.</h2>
          <p className="lead mt-6 max-w-lg text-bone/70">
            A short consultation, then a routine of CO2 products chosen for your skin type, concerns and preferences — with the reason for every pick and the order to use them in.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/make-it-yours/face" className="btn btn-gold btn-lg">Start the consultation</Link>
            <Link href="/customization" className="btn btn-outline-light btn-lg">Made-to-order formulas</Link>
          </div>
          <p className="mt-6 text-xs text-bone/45">No account needed. Cosmetic guidance, not a diagnosis.</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <ol className="divide-y divide-line-dark border-y border-line-dark">
            {steps.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.08} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="font-display text-4xl leading-none text-gold-light tabular-nums">{i + 1}</span>
                <div>
                  <p className="font-display text-2xl leading-tight">{t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-bone/60">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 grid grid-cols-3 gap-3" aria-hidden>
            {["red-grapes-face-wash-1", "24k-gold-face-elixir-1", "night-cream-1"].map((k) => (
              <div key={k} className="photo relative aspect-square">
                <Image src={productImage(k, 640)} alt="" fill sizes="(max-width:1024px) 30vw, 14vw" className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
