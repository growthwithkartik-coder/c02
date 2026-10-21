import type { Metadata } from "next";
import { Breaker } from "@/components/brand/Breakers";
import { PageHero } from "@/components/hero/PageHero";
import { IngredientLibrary } from "@/components/sections/IngredientLibrary";
import { getIngredientLibrary } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Ingredients",
  description: "The CO2 ingredient library — every key ingredient printed on our packs, what it's there for, and the products that contain it.",
  alternates: { canonical: "/ingredients" },
};

export default function IngredientsPage() {
  const lib = getIngredientLibrary().map((e) => ({ name: e.name, note: e.note, products: e.products.map((p) => ({ slug: p.slug, name: p.name, image: p.images[0] ?? null })) }));
  return (
    <>
      <PageHero
        kicker="Ingredients & formulation"
        title="The ingredient"
        italic="library."
        intro={`${lib.length} key ingredients, each listed exactly as printed on a CO2 pack — what it's there for and where you'll find it. No percentages or clinical claims; just what's inside.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Ingredients" }]}
        image="renew-firming-cream"
        compact
      />
      <IngredientLibrary items={lib} />
      <Breaker id="essential" />
    </>
  );
}
