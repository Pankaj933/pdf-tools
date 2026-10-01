import crypto from "node:crypto";
import { NextResponse } from "next/server";

const AI_SUMMARY_PRICE_INR = 299;

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, productName } = body ?? {};
    const trimmedEmail = typeof email === "string" ? email.trim() : "";

    if (!action || !["create-order", "verify"].includes(action)) {
      return NextResponse.json({ error: "Invalid AI summary request." }, { status: 400 });
    }

    if (action === "create-order") {
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
      }

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
          { error: "Razorpay is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the environment." },
          { status: 503 }
        );
      }

      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: AI_SUMMARY_PRICE_INR * 100,
          currency: "INR",
          receipt: `ai_summary_${Date.now()}`,
          notes: {
            product: productName || "AI PDF Summary Premium",
            buyer_email: trimmedEmail,
          },
        }),
      });

      const order = await razorpayResponse.json();

      if (!razorpayResponse.ok) {
        return NextResponse.json({ error: order?.error?.description || "Unable to create Razorpay order." }, { status: razorpayResponse.status });
      }

      return NextResponse.json({ order });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Incomplete payment verification data." }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay is not configured on the server." }, { status: 503 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Payment signature verification failed." }, { status: 400 });
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      productName: productName || "AI PDF Summary Premium",
    });
  } catch (error) {
    console.error("AI summary payment error:", error);
    return NextResponse.json({ error: "Unable to process the payment." }, { status: 500 });
  }
}
