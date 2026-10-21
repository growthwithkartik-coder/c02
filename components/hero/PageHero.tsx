import Image from "next/image";
import { LineReveal, Reveal } from "@/components/animations/motion";
import { Breadcrumbs } from "@/components/ui/primitives";
import { NavTheme } from "@/components/navbar/nav-theme";
import { cn, cutoutImage } from "@/lib/utils";

/* Editorial page opening used across shop, collections and content pages. */
export function PageHero({
  kicker,
  title,
  italic,
  intro,
  crumbs,
  dark = false,
  image,
  imageSide = "right",
  children,
  compact,
}: {
  kicker: string;
  title: string;
  italic?: string;
  intro?: string;
  crumbs?: { label: string; href?: string }[];
  dark?: boolean;
  image?: string | null; // cutout slug
  imageSide?: "right" | "left";
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden", dark ? "bg-carbon text-bone grain" : "bg-bone")}>
      {dark && <NavTheme tone="dark" />}
      {dark && <div aria-hidden className="absolute inset-0 bg-[radial-gradient(45%_70%_at_78%_55%,rgba(226,198,140,.22),transparent_70%)]" />}
      <div className={cn("container-site relative grid items-end gap-10 pt-[calc(var(--nav-h)+3rem)] md:grid-cols-12", compact ? "pb-10 md:pb-14" : "pb-14 md:pb-24 md:pt-[calc(var(--nav-h)+5rem)]")}>
        <div className={cn("md:col-span-7", image && imageSide === "left" && "md:order-2 md:col-start-6")}>
          {crumbs && <Breadcrumbs items={crumbs} dark={dark} className="mb-8" />}
          <p className={cn("eyebrow", dark ? "text-gold-light" : "text-taupe")}>{kicker}</p>
          <h1 className={cn("mt-4 font-display", compact ? "text-display-md" : "text-display-lg")}>
            <LineReveal immediate lines={italic ? [title, <span key="i" className={cn("italic", dark ? "text-gold-light" : "text-gold-deep")}>{italic}</span>] : [title]} />
          </h1>
          {intro && (
            <Reveal delay={0.2}>
              <p className={cn("lead mt-6 max-w-xl", dark ? "text-bone/70" : "text-ink-soft")}>{intro}</p>
            </Reveal>
          )}
          {children && <Reveal delay={0.3} className="mt-8">{children}</Reveal>}
        </div>
        {image && (
          <Reveal delay={0.15} className={cn("relative hidden h-[42vh] max-h-[460px] md:col-span-5 md:block", imageSide === "left" && "md:order-1 md:col-span-4")}>
            <Image src={cutoutImage(image)} alt="" fill priority sizes="40vw" className={cn("object-contain", imageSide === "left" ? "object-left" : "object-right", dark ? "drop-shadow-[0_40px_60px_rgba(0,0,0,.55)]" : "drop-shadow-[0_30px_40px_rgba(60,40,20,.25)]")} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
