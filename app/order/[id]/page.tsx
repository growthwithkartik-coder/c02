import type { Metadata } from "next";
import { getOrder } from "@/lib/orders";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = /^CO2-\d{6}-[A-Z0-9]{6}$/.test(id) ? await getOrder(id) : null;
  return <OrderConfirmation id={id} serverOrder={order} />;
}
