import { NextResponse } from "next/server";
import { razorpayConfigured } from "@/lib/razorpay";

/* Public config only — the key id is safe to expose; the secret never is. */
export async function GET() {
  return NextResponse.json({ enabled: razorpayConfigured(), keyId: razorpayConfigured() ? process.env.RAZORPAY_KEY_ID : null });
}
