import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export async function POST(request) {
  try {
    const { productId, email } = await request.json();
    const trimmedEmail = typeof email === "string" ? email.trim() : "";

    if (!productId) {
      return NextResponse.json({ error: "A valid product is required." }, { status: 400 });
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase is not configured on the server. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the environment." }, { status: 503 });
    }

    const supabase = createAdminClient();
    const { data: product, error: productLookupError } = await supabase
      .from("study_material_products")
      .select("id, title, price, status")
      .eq("id", productId)
      .maybeSingle();

    if (productLookupError) {
      console.error("Product lookup failed for checkout:", { productId, productLookupError });
      return NextResponse.json({ error: "Unable to fetch the product right now. Please try again in a moment." }, { status: 500 });
    }

    if (!product) {
      console.error("Product not found for checkout:", { productId });
      return NextResponse.json({ error: "This product is not available for purchase yet. Please make sure it is published in the admin panel." }, { status: 404 });
    }

    const normalizedStatus = String(product.status || "").trim().toLowerCase();
    if (normalizedStatus !== "published") {
      console.error("Product found but not published:", { productId, status: product.status });
      return NextResponse.json({ error: "This product is not available for purchase yet. Please make sure it is published in the admin panel." }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay is not configured. Add RAZORPAY_KEY_SECRET to the server environment." }, { status: 503 });
    }

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(product.price) * 100,
        currency: "INR",
        receipt: `ps_${product.id}_${Date.now()}`,
        notes: { product_id: product.id, buyer_email: trimmedEmail },
      }),
    });

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      return NextResponse.json({ error: order?.error?.description || "Unable to create Razorpay order." }, { status: razorpayResponse.status });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    return NextResponse.json({ error: "Unable to start payment right now." }, { status: 500 });
  }
}