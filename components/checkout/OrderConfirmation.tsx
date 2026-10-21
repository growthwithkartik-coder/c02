"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clock, MessageCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { getProduct } from "@/lib/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { readJSON, STORAGE_KEYS } from "@/lib/storage";
import { site } from "@/data/site";
import { money } from "@/lib/utils";

/* Shows the server copy of the order; falls back to the copy saved in
   this browser at checkout (useful on serverless hosts). */
export function OrderConfirmation({ id, serverOrder }: { id: string; serverOrder: Order | null }) {
  const [order, setOrder] = useState<Order | null>(serverOrder);
  const [checked, setChecked] = useState(!!serverOrder);
  useEffect(() => {
    if (serverOrder) return;
    const local = readJSON<Order[]>(STORAGE_KEYS.orders, []).find((o) => o.id === id) ?? null;
    setOrder(local);
    setChecked(true);
  }, [id, serverOrder]);

  if (!checked) return <div className="min-h-[60vh]" />;
  if (!order) {
    return (
      <div className="container-site py-40 text-center">
        <p className="font-display text-4xl">We couldn&rsquo;t find that order.</p>
        <p className="mt-3 text-ink-soft">If you&rsquo;ve just paid, please contact us with your payment reference.</p>
        <Link href="/contact" className="btn btn-primary mt-8">Contact support</Link>
      </div>
    );
  }

  const paid = order.paymentStatus === "paid";
  const pending = order.paymentStatus === "pending-verification" || order.paymentStatus === "created" || order.paymentStatus === "pending";
  const failed = order.paymentStatus === "failed";
  const date = new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="bg-bone pb-section pt-[calc(var(--nav-h)+3rem)]">
      <div className="container-site">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
          <span className={`grid h-14 w-14 place-items-center rounded-full ${paid ? "bg-leaf text-bone" : failed ? "bg-red-700 text-bone" : "bg-gold text-carbon"}`}>
            {paid ? <Check className="h-6 w-6" /> : failed ? <XCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
          </span>
          <p className="eyebrow mt-8 text-taupe">Order {order.id}</p>
          <h1 className="mt-3 font-display text-display-md">
            {paid ? <>Thank you, {order.customer.name.split(" ")[0]}.</> : failed ? <>Payment didn&rsquo;t go through.</> : <>Order received.</>}
          </h1>
          <p className="lead mt-5 text-ink-soft">
            {paid && <>Your payment is confirmed. We&rsquo;ll send dispatch details to {order.customer.email} and on WhatsApp.</>}
            {pending && order.paymentMethod === "upi-qr" && <>We&rsquo;re verifying your UPI payment{order.upiReference ? ` (ref ${order.upiReference})` : ""}. You&rsquo;ll get a confirmation as soon as it&rsquo;s matched — usually within a few hours.</>}
            {pending && order.paymentMethod === "razorpay" && <>We&rsquo;re waiting for confirmation from the payment provider. This page updates on refresh.</>}
            {failed && <>No money was taken. Your items are still available — please try again.</>}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl">Items</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {order.items.map((i) => {
                const p = getProduct(i.slug);
                return (
                  <li key={i.slug + (i.shade ?? "")} className="flex items-center gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0">{p && <ProductImage product={p} sizes="80px" className="absolute inset-0" />}</div>
                    <div className="flex-1">
                      <p className="font-display text-xl">{i.name}</p>
                      <p className="text-xs text-taupe">Qty {i.qty}{i.shade ? ` · ${i.shade}` : ""}{i.options ? ` · ${Object.entries(i.options).map(([k, v]) => `${k}: ${v}`).join(", ")}` : ""}</p>
                    </div>
                    <p className="tabular-nums">{money(i.lineTotal)}</p>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-6 max-w-sm space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="tabular-nums">{money(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between text-leaf"><dt>Discount ({order.discountCode})</dt><dd>−{money(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd>{order.shippingFee ? money(order.shippingFee) : "Free"}</dd></div>
              <div className="flex justify-between border-t border-line pt-2 text-lg font-medium"><dt>Total</dt><dd className="tabular-nums">{money(order.total)}</dd></div>
            </dl>
          </div>
          <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
            <Info title="Order date">{date}</Info>
            <Info title="Payment">
              {order.paymentMethod === "razorpay" ? "Razorpay" : "UPI QR"} · <span className={paid ? "text-leaf" : failed ? "text-red-700" : "text-gold-deep"}>{paid ? "Paid" : failed ? "Failed" : "Pending verification"}</span>
              {order.razorpayPaymentId && <span className="block text-xs text-taupe">{order.razorpayPaymentId}</span>}
            </Info>
            <Info title="Customer">{order.customer.name}<br />{order.customer.email}<br />{order.customer.phone}</Info>
            <Info title="Ship to">{order.shipping.line1}{order.shipping.line2 ? <><br />{order.shipping.line2}</> : null}<br />{order.shipping.city}, {order.shipping.state} {order.shipping.pincode}</Info>
            <div className="flex flex-wrap gap-3">
              {failed ? <Link href="/checkout" className="btn btn-primary">Try again</Link> : <Link href="/shop" className="btn btn-primary">Continue shopping</Link>}
              <a href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(`Hi CO2, about my order ${order.id}`)}`} target="_blank" rel="noreferrer" className="btn btn-outline"><MessageCircle className="h-4 w-4" /> WhatsApp us</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="eyebrow text-taupe">{title}</p>
      <p className="mt-2 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
