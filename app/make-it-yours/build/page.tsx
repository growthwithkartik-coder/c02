import type { Metadata } from "next";
import { Suspense } from "react";
import { Builder } from "@/components/miy/Builder";
import { Breadcrumbs } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Builder — personalize your product & packaging",
  description: "Build a made-to-order CO2 formula or send a customization request: formula options, container, colour, cap and label, with a 3D packaging preview. Prices on request, as per your customization.",
  alternates: { canonical: "/make-it-yours/build" },
};

export default function BuildPage() {
  return (
    <>
      <div className="container-site pb-6 pt-[calc(var(--nav-h)+1.5rem)]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Make It Yours", href: "/make-it-yours" }, { label: "Builder" }]} />
      </div>
      <Suspense>
        <Builder />
      </Suspense>
    </>
  );
}
