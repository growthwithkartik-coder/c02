import Image from "next/image";
import { LineReveal } from "@/components/animations/motion";
import { NewsletterForm } from "./NewsletterForm";
import { cutoutImage } from "@/lib/utils";

/* SECTION 11 — newsletter. */
export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-[#1C1813] py-section text-bone" aria-labelledby="newsletter-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_80%_at_80%_50%,rgba(226,198,140,.22),transparent_70%)]" />
      <Image
        src={cutoutImage("24k-gold-face-elixir")}
        alt=""
        width={890}
        height={804}
        className="pointer-events-none absolute -right-[8%] bottom-[-10%] hidden w-[38vw] max-w-[620px] opacity-90 drop-shadow-[0_40px_60px_rgba(0,0,0,.5)] md:block"
      />
      <div className="container-site relative">
        <p className="eyebrow text-gold-light">The CO2 letter</p>
        <h2 id="newsletter-title" className="mt-6 font-display text-display-lg">
          <LineReveal lines={["Enter the", <span key="i" className="italic text-gold-light">CO2 world.</span>]} />
        </h2>
        <p className="mt-6 max-w-md text-bone/70">New formulas, made-to-order openings and quiet early access — a few letters a month, never more.</p>
        <div className="mt-10 max-w-xl">
          <NewsletterForm dark source="home" />
        </div>
      </div>
    </section>
  );
}
