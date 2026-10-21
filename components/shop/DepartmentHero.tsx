import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/primitives";
import type { Concern, Department } from "@/data/taxonomy";
import { SectionChips } from "@/components/filters/DepartmentExplorer";
import { cn, productImage } from "@/lib/utils";

/* Compact category banner: heading, short description, section chips and
   a product photograph (shown whole — object-contain). Kept short so the
   products start high on the page. */
export function DepartmentHero({
  dept,
  count,
  crumbs,
  title,
  description,
  image,
  concerns = [],
  children,
}: {
  dept?: Department;
  count: number;
  crumbs: { label: string; href?: string }[];
  title?: string;
  description?: string;
  image?: string;
  concerns?: Concern[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-bone">
      <div className="container-site pt-[calc(var(--nav-h)+1.75rem)]">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <div className="grid items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="eyebrow text-taupe">{count} products</p>
            <h1 className="mt-3 font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.95]">{title ?? dept?.title}</h1>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft">{description ?? dept?.description}</p>
            {dept && <div className="mt-6"><SectionChips department={dept.id} /></div>}
            {children}
          </div>
          {(image ?? dept?.image) && (
            <div className="relative hidden aspect-square w-full max-w-[300px] justify-self-end bg-bone-2 md:col-span-5 md:block lg:col-span-4">
              <Image src={productImage((image ?? dept!.image)!, 640)} alt="" fill priority sizes="300px" className="object-contain" />
            </div>
          )}
        </div>
      </div>

      {concerns.length > 0 && dept && (
        <div className="container-site mt-10">
          <p className="eyebrow mb-4 text-taupe">Shop by concern</p>
          <ul className="-mx-gutter flex gap-3 overflow-x-auto px-gutter pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 xl:grid-cols-8">
            {concerns.map((c) => (
              <li key={c.id} className="w-[38vw] shrink-0 sm:w-[26vw] md:w-auto">
                <ConcernTile concern={c} href={`/shop/${dept.id}?concern=${c.id}`} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="h-8" />
    </section>
  );
}

export function ConcernTile({ concern, href, className }: { concern: Concern; href: string; className?: string }) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="relative aspect-square bg-bone-2 ring-1 ring-transparent transition group-hover:ring-ink/30">
        <Image src={productImage(concern.image, 640)} alt="" fill sizes="(max-width:768px) 38vw, 12vw" className="object-contain" />
      </div>
      <p className="mt-2.5 text-[0.8125rem] font-medium leading-snug text-ink group-hover:text-gold-deep">{concern.label}</p>
    </Link>
  );
}
