import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Consultation } from "@/components/miy/Consultation";
import { Breadcrumbs } from "@/components/ui/primitives";
import { flows, getFlow } from "@/lib/customize/flows";
import { productImage } from "@/lib/utils";

export function generateStaticParams() {
  return flows.map((f) => ({ flow: f.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ flow: string }> }): Promise<Metadata> {
  const { flow } = await params;
  const f = getFlow(flow);
  if (!f) return {};
  return { title: `${f.title} — Make It Yours`, description: f.intro, alternates: { canonical: `/make-it-yours/${f.id}` } };
}

export default async function FlowPage({ params }: { params: Promise<{ flow: string }> }) {
  const { flow } = await params;
  const f = getFlow(flow);
  if (!f) notFound();
  return (
    <>
      <section className="border-b border-line bg-bone-2 pt-[calc(var(--nav-h)+1.5rem)]">
        <div className="container-site grid items-end gap-6 pb-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Make It Yours", href: "/make-it-yours" }, { label: f.label }]} />
            <h1 className="mt-5 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">{f.title}</h1>
            <p className="mt-3 max-w-2xl text-ink-soft">{f.intro}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-taupe">{f.kicker}</p>
          </div>
          <div className="relative hidden h-36 md:col-span-3 md:col-start-10 md:block" aria-hidden>
            <Image src={productImage(f.image, 640)} alt="" fill sizes="240px" className="object-contain" />
          </div>
        </div>
      </section>
      <Suspense>
        <Consultation flowId={f.id} />
      </Suspense>
    </>
  );
}
