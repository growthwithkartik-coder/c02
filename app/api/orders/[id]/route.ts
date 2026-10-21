import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";

/* GET /api/orders/:id?email= — order lookup (email must match). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const email = new URL(req.url).searchParams.get("email")?.toLowerCase();
  const order = await getOrder(id);
  if (!order || !email || order.customer.email !== email) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order });
}
