import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { Reveal } from "@/components/animations/motion";
import { SectionHeading } from "./SectionHeading";
import { cn, cutoutImage } from "@/lib/utils";

/* SECTION 07 — shop by category, built from the real catalogue. */
export function ShopByCategory({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const layout = ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5", "lg:col-span-6", "lg:col-span-6"];
  const tones = ["bg-carbon text-bone", "bg-stone", "bg-[#E6DCCB]", "bg-[#D9CBB5]", "bg-bone-2"];
  return (
    <section className="bg-bone py-section" aria-labelledby="cats-title">
      <div className="container-site">
        <SectionHeading id="cats-title" index="07" kicker="Shop by category" title="Four rituals," italic="and yours." link={{ href: "/shop", label: "All products" }} />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.08} className={cn(layout[i], i === 0 && "md:col-span-2")}>
              <Link
                href={`/shop/${c.id}`}
                data-cursor="Shop"
                className={cn("group relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden p-6 md:p-8", i === 0 ? "lg:min-h-[680px]" : "lg:min-h-[330px]", tones[i])}
              >
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className={cn("eyebrow", i === 0 ? "text-gold-light" : "text-taupe")}>{String(i + 1).padStart(2, "0")} · {counts[c.id]} products</p>
                    <h3 className={cn("mt-3 font-display leading-none", i === 0 ? "text-7xl md:text-8xl" : "text-5xl md:text-6xl")}>{c.label}</h3>
                  </div>
                  <span className="mt-1 text-xs uppercase tracking-[0.16em] opacity-60 transition-opacity group-hover:opacity-100">Shop →</span>
                </div>
                <div className="relative z-10 max-w-[60%] md:max-w-[18rem]">
                  <p className={cn("text-sm leading-relaxed", i === 0 ? "text-bone/70" : "text-ink-soft")}>{c.description}</p>
                  {c.types.length > 1 && (
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.12em] opacity-70">
                      {c.types.map((t) => (
                        <li key={t.id}>{t.label}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {c.hero !== "custom" ? (
                  <Image
                    src={cutoutImage(c.hero)}
                    alt=""
                    width={900}
                    height={900}
                    sizes="(max-width: 1024px) 70vw, 40vw"
                    className={cn(
                      "pointer-events-none absolute object-contain transition-transform duration-[1400ms] ease-expo group-hover:-translate-y-3 group-hover:rotate-[-3deg] group-hover:scale-[1.04]",
                      i === 0 ? "-right-[10%] bottom-[4%] h-[52%] w-auto drop-shadow-[0_40px_50px_rgba(0,0,0,.5)] md:-right-[6%] md:h-[70%]" : "-right-[12%] bottom-[-4%] h-[56%] w-auto drop-shadow-[0_25px_30px_rgba(60,40,20,.25)] md:-right-[4%] md:h-[72%]",
                    )}
                  />
                ) : (
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-[80%] w-[60%] opacity-90 transition-transform duration-[1400ms] ease-expo group-hover:-translate-y-3" aria-hidden>
                    <div className="absolute bottom-10 right-28 h-40 w-24 rounded-[26px] bg-[#B98466] shadow-2xl" />
                    <div className="absolute bottom-10 right-12 h-52 w-28 rounded-[30px] bg-[#DCEBE5] shadow-2xl" />
                    <div className="absolute bottom-10 right-44 h-24 w-36 rounded-full bg-[#C87D78] shadow-2xl" />
                    <span className="absolute bottom-24 right-[4.5rem] font-display text-2xl text-white/90">CO2</span>
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
