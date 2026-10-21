import type { Metadata } from "next";
import { LegalPage } from "@/components/hero/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Privacy policy", description: "How CO2 collects, uses and protects your personal information.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage confirm={["Data controller details for " + site.legalName, "Service providers (hosting, Razorpay, email/WhatsApp, form webhooks)", "Retention periods", "Grievance officer contact as required under the DPDP Act, 2023"]} kicker="Legal" title="Privacy policy" updated="October 2026" intro={`This policy explains how CO2, a brand of ${site.legalName}, handles your personal information.`}>
      <h2>What we collect</h2>
      <ul>
        <li><b>Order details</b> — name, email, phone, shipping address and the products you buy.</li>
        <li><b>Payment</b> — payments are processed by Razorpay. We never see or store your full card, UPI PIN or bank credentials; we receive a payment reference and status.</li>
        <li><b>Made-to-order preferences</b> — shade, finish and ingredient preferences you choose, used only to prepare your formula.</li>
        <li><b>Newsletter</b> — your email address, if you subscribe.</li>
        <li><b>On this device</b> — your bag, wishlist and saved details are stored in your browser&rsquo;s local storage so they persist between visits. You can clear them at any time from your browser settings or the Account page.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To process and deliver orders, send order updates (email, SMS or WhatsApp), provide customer support, prepare custom formulas, and — only if you subscribe — send the CO2 letter. We don&rsquo;t sell your personal information.</p>
      <h2>Sharing</h2>
      <p>We share only what&rsquo;s necessary with service providers who help us run the shop: payment processing (Razorpay), couriers, and messaging/email providers.</p>
      <h2>Your choices</h2>
      <p>You can unsubscribe from emails at any time, and ask us to access, correct or delete your information by writing to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</p>
      <h2>Contact</h2>
      <p>{site.legalName} · <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> · {site.contact.phone}</p>
      <h2>Consultation answers and saved routines</h2>
      <p>Answers to Make It Yours consultations, your results, saved routines and saved customizations are stored in your browser (local storage) on your device. They are not sent to us unless you submit a customization request or place an order that includes them. Clearing your browser data removes them.</p>
      <h2>Customization requests and reviews</h2>
      <p>When you send a customization request or a product review we receive the details you enter (name, email, optional phone, your choices and notes) so we can reply. These are stored on our server and may be forwarded to our team by email or WhatsApp.</p>
      <h2>Virtual try-on</h2>
      <p>The lip try-on runs entirely in your browser. Camera frames and photos are never uploaded or stored.</p>
    </LegalPage>
  );
}
