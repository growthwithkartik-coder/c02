import {
  CategoryEditorial,
  CombosSection,
  CommunitySection,
  Curated,
  FilmBreaker,
  FinalCTA,
  Hero,
  IngredientStory,
  MakeItYoursShowcase,
  OneSizeBreaker,
  PhilosophySection,
  SamplingSection,
} from "@/components/home/HomeEditorial";
import { BenefitsStrip, TrustStrip } from "@/components/brand/Strips";
import { ServicesSection } from "@/components/sections/ServicesSection";

/* ------------------------------------------------------------------
   Homepage — a guided journey, not a product wall.
   1 announcement bar + 2 navigation (layout)
   3 hero: customization in seconds + "We make it for you."
   4 benefits strip  + Services (all six, Oct 2026)             5 breaker: not one-size-fits-all
   6 shop by category          7 Make It Yours — four steps
   8 film breaker              9 curated products (4 + a routine + made to order)
   10 ingredient story         11 sampling studio
   12 combos                   13 philosophy       — trust strip —
   14 community (no fabricated reviews)            15 final CTA
   Popular links + footer come from the layout.
------------------------------------------------------------------- */
export default function Home() {
  return (
    <>
      <Hero />
      <BenefitsStrip />
      <ServicesSection />
      <OneSizeBreaker />
      <CategoryEditorial />
      <MakeItYoursShowcase />
      <FilmBreaker />
      <Curated />
      <IngredientStory />
      <SamplingSection />
      <CombosSection />
      <PhilosophySection />
      <TrustStrip />
      <CommunitySection />
      <FinalCTA />
    </>
  );
}
