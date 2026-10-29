import type { Metadata } from "next";
import { LegalPage } from "@/components/hero/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Terms & conditions", description: "Terms of sale and use for the CO2 online shop.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage confirm={["Seller of record and registered address of " + site.legalName, "Governing law and jurisdiction", "Liability limits", "Discount-code rules", "Acceptance of customization quotes"]} kicker="Legal" title="Terms & conditions" updated="October 2026" intro={`These terms govern purchases from the CO2 online shop, operated by ${site.legalName}.`}>
      <h2>Products</h2>
      <p>CO2 products are cosmetics. Descriptions and ingredients are taken from product packaging; colours may vary slightly on screen. Always read the pack and patch-test before first use. Products are not intended to diagnose, treat or cure any condition.</p>
      <h2>Prices & payment</h2>
      <p>Prices of ready-made products and travel sizes are listed on the site in Indian Rupees and include applicable taxes unless stated otherwise. Made-to-order formulas and customizations are quoted on request. Payment is taken through Razorpay or by UPI. An order is confirmed once payment is verified.</p>
      <h2>Made-to-order formulas</h2>
      <p>Custom formulas are prepared to the options you choose. We may contact you to confirm details before preparation. Personalization is cosmetic and is not a medical service.</p>
      <h2>Shipping, returns & refunds</h2>
      <p>See our <a href="/shipping">Shipping</a> and <a href="/returns">Returns</a> pages, which form part of these terms.</p>
      <h2>Discount codes</h2>
      <p>One code per order; codes have no cash value and may be withdrawn at any time.</p>
      <h2>Liability</h2>
      <p>To the extent permitted by law, our liability for any order is limited to the amount paid for that order.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
      <h2>Personalized recommendations</h2>
      <p>Routines and product suggestions from our consultations are cosmetic recommendations based on the answers you give. They are not medical advice, a diagnosis, or a custom-manufactured formulation, and they don&rsquo;t replace advice from a dermatologist or doctor.</p>
      <h2>Customization requests</h2>
      <p>A customization request for a formula that isn&rsquo;t in our catalogue is an enquiry, not an order. We may decline a request. A contract is formed only when you accept our quote and pay for the order.</p>
      <h2>Travel sizes</h2>
      <p>Travel sizes are smaller packs of the same products, at the travel-size price listed on the site. Their price is not credited towards a full-size purchase unless we say so in writing.</p>
    </LegalPage>
  );
}
