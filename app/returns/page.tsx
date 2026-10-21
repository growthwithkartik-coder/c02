import type { Metadata } from "next";
import { LegalPage } from "@/components/hero/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Returns & refunds", description: "CO2 returns, replacements and refunds policy.", alternates: { canonical: "/returns" } };

export default function ReturnsPage() {
  const c = site.commerce;
  return (
    <LegalPage kicker="Customer care" title="Returns & refunds" updated="October 2026" intro="For hygiene reasons, cosmetics have a few special rules. Here they are, plainly." confirm={["Return window for unopened products (currently " + c.returnWindowDays + " days in data/site.ts)", "Window for reporting damaged or incorrect items", "Refund timelines for Razorpay and UPI payments", "Whether travel sizes and sample sets can be returned", "Treatment of shipping charges on refunds"]}>
      <h2>Returns</h2>
      <p>Unopened, unused products in their original packaging can be returned within {c.returnWindowDays} days of delivery. Write to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> with your order number to start a return.</p>
      <h2>Damaged or incorrect items</h2>
      <p>If something arrives damaged, leaking or different from what you ordered, send a photo within 48 hours of delivery and we&rsquo;ll replace it free of charge.</p>
      <h2>Travel sizes and samples</h2>
      <p>Because travel sizes are small, single-use-style packs, they can only be returned if they arrive damaged or incorrect.</p>
      <h2>Made-to-order formulas</h2>
      <p>Custom formulas are made for you and can&rsquo;t be returned unless they arrive damaged or incorrect. If a shade or finish isn&rsquo;t quite right, tell us — we&rsquo;ll note it on your formula card for the next batch.</p>
      <h2>Refunds</h2>
      <p>For Razorpay payments, approved refunds are issued to the original payment method within 5–7 working days of us receiving the return. For UPI QR payments, refunds are made by bank transfer. Original shipping charges are non-refundable unless the item was damaged or incorrect.</p>
    </LegalPage>
  );
}
