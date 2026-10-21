import Link from "next/link";
import { LineReveal } from "@/components/animations/motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  kicker,
  title,
  italic,
  link,
  dark,
  className,
  id,
}: {
  index?: string;
  kicker: string;
  title: string;
  italic?: string;
  link?: { href: string; label: string };
  dark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <p className={cn("eyebrow", dark ? "text-gold-light" : "text-taupe")}>
          {index && <span className="mr-3 tabular-nums">{index} —</span>}
          {kicker}
        </p>
        <h2 id={id} className="mt-4 font-display text-display-md">
          <LineReveal lines={italic ? [title, <span key="i" className={cn("italic", dark ? "text-gold-light" : "text-gold-deep")}>{italic}</span>] : [title]} />
        </h2>
      </div>
      {link && (
        <Link href={link.href} className={cn("link-underline self-start text-xs font-medium uppercase tracking-[0.18em] md:self-auto", dark ? "text-bone" : "text-ink")}>
          {link.label} →
        </Link>
      )}
    </div>
  );
}
