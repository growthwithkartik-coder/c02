import type { Metadata } from "next";
import { LegalPage } from "@/components/hero/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Shipping", description: "CO2 shipping rates, dispatch and delivery times across India.", alternates: { canonical: "/shipping" } };

export default function ShippingPage() {
  const c = site.commerce;
  return (
    <LegalPage kicker="Customer care" title="Shipping" updated="October 2026" intro="How and when your CO2 order reaches you." confirm={["Free-shipping threshold and flat fee (currently set in data/site.ts)", "Dispatch and delivery times, courier partners and tracking method", "Preparation time for made-to-order formulas", "Damaged-parcel reporting window", "International shipping availability"]}>
      <h2>Rates</h2>
      <ul>
        <li>Free standard shipping on orders over ₹{c.freeShippingThreshold} (after discounts).</li>
        <li>A flat ₹{c.shippingFee} on orders below that.</li>
      </ul>
      <h2>Dispatch & delivery</h2>
      <p>Ready products are packed and dispatched within {c.dispatchDays} of payment confirmation. Delivery usually takes {c.deliveryDays}, depending on your PIN code. Made-to-order formulas are prepared first (typically 5–8 working days) and then shipped.</p>
      <p>Once your order ships you&rsquo;ll receive the courier and tracking number by email or WhatsApp.</p>
      <h2>Travel sizes and sample sets</h2>
      <p>Travel sizes ship with the rest of your order at the same rates. A sample-only order follows the same free-shipping threshold and flat fee.</p>
      <h2>Customization requests</h2>
      <p>On-request formulas are quoted first. Shipping for them is confirmed in your quote, before anything is charged.</p>
      <h2>Where we ship</h2>
      <p>We currently ship across India. For international orders, please <a href="/contact">contact us</a>.</p>
      <h2>Damaged parcels</h2>
      <p>If your parcel arrives damaged, please photograph it before opening and write to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> within 48 hours — we&rsquo;ll replace the affected items.</p>
    </LegalPage>
  );
}
