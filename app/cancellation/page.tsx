import type { Metadata } from "next";
import { LegalPage } from "@/components/hero/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Cancellation policy", description: "How to cancel a CO2 order, a made-to-order formula or a customization request.", alternates: { canonical: "/cancellation" } };

/* Structured draft. The open points are listed in `confirm` below (shown in
   development only) and must be set by the business before launch:
   - cancellation cut-off for ready-made orders (before dispatch / within N hours)
   - when preparation of a made-to-order formula counts as started, and any charge after that
   - refund timeline after a cancellation (N working days) */
export default function CancellationPage() {
  return (
    <LegalPage
      kicker="Customer care"
      title="Cancellation policy"
      updated="October 2026"
      intro="What you can cancel, and until when."
      confirm={[
        "Cut-off for cancelling ready-made orders before dispatch",
        "Cut-off for cancelling made-to-order formulas (before preparation starts)",
        "Refund method and timeline after a cancellation",
        "Whether partially prepared custom formulas incur a charge",
      ]}
    >
      <h2>Ready-made products</h2>
      <p>You can cancel an order before it is dispatched. Write to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or message us on WhatsApp ({site.contact.phone}) with your order number as soon as possible. Once an order has been dispatched it can&rsquo;t be cancelled, but unopened products can be returned under our <a href="/returns">returns policy</a>.</p>
      <h2>Travel sizes and sample sets</h2>
      <p>Samples follow the same rule as ready-made products: they can be cancelled until the order is dispatched.</p>
      <h2>Made-to-order formulas</h2>
      <p>After you order, we confirm your formula with you by email before it is prepared. You can cancel until preparation starts. Once a formula has been prepared for you it can&rsquo;t be cancelled, because it is made to your specification.</p>
      <h2>Customization requests</h2>
      <p>A customization request is not an order, so there is nothing to cancel until you accept a quote. You can withdraw a request at any time by replying to our email or messaging us on WhatsApp.</p>
      <h2>Refunds after cancellation</h2>
      <p>Approved cancellations are refunded to the original payment method (Razorpay) or by bank transfer (UPI QR payments).</p>
      <h2>If we cancel</h2>
      <p>We may cancel an order if a product is unavailable, a payment can&rsquo;t be verified, or a made-to-order formula can&rsquo;t be made as requested. If that happens, we&rsquo;ll let you know and refund the full amount paid.</p>
    </LegalPage>
  );
}
