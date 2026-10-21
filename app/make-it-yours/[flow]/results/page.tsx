import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Results } from "@/components/miy/Results";
import { flows, getFlow } from "@/lib/customize/flows";

export function generateStaticParams() {
  return flows.map((f) => ({ flow: f.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ flow: string }> }): Promise<Metadata> {
  const { flow } = await params;
  const f = getFlow(flow);
  return f ? { title: `Your ${f.label.toLowerCase()} routine — Make It Yours`, robots: { index: false } } : {};
}

export default async function ResultsPage({ params }: { params: Promise<{ flow: string }> }) {
  const { flow } = await params;
  const f = getFlow(flow);
  if (!f) notFound();
  return <Results flowId={f.id} />;
}
