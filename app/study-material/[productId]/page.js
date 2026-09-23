"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, IndianRupee, LockKeyhole } from "lucide-react";
import { supabase } from "../../../lib/supabase";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function ProductDetailPage({ params }) {
  const { productId } = use(params);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState("");
  const coverUrl = product?.cover_image_path ? supabase.storage.from("product-covers").getPublicUrl(product.cover_image_path).data.publicUrl : "";

  useEffect(() => {
    const loadProduct = async () => {
      const { data } = await supabase
        .from("study_material_products")
        .select("id, title, description, price, tag, features, cover_image_path")
        .eq("id", productId)
        .eq("status", "published")
        .maybeSingle();
      setProduct(data);
      setProductLoading(false);
    };

    loadProduct();
  }, [productId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  const handleBuyNow = async () => {
    setError("");
    const trimmedEmail = email.trim();

    if (!product?.id) {
      setError("This product is not available for purchase right now.");
      return;
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: trimmedEmail }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Unable to start payment.");
      if (!window.Razorpay) throw new Error("Payment window is still loading. Please try again.");

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.order.amount,
        currency: result.order.currency,
        name: "PDFSnap",
        description: product.title,
        order_id: result.order.id,
        prefill: { email: trimmedEmail },
        theme: { color: "#2563eb" },
        handler: async (paymentResponse) => {
          try {
            setProcessingPayment(true);
            setLoading(false);

            const verificationResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...paymentResponse, productId: product.id, email: trimmedEmail }),
            });
            const verification = await verificationResponse.json();

            if (!verificationResponse.ok || !verification.verified) {
              throw new Error(verification.error || "Payment verification failed.");
            }

            const thankYouUrl = `/thank-you?product=${encodeURIComponent(product.title)}&email=${encodeURIComponent(trimmedEmail)}`;
            setTimeout(() => {
              window.location.href = thankYouUrl;
            }, 1200);
          } catch (verificationError) {
            setProcessingPayment(false);
            setLoading(false);
            setError(verificationError.message || "Payment verification failed.");
          }
        },
      });

      razorpay.open();
    } catch (paymentError) {
      setLoading(false);
      setError(paymentError.message || "Unable to start payment.");
    }
  };

  if (productLoading) {
    return <main className="min-h-screen bg-slate-50 px-6 pb-20 pt-32 text-center text-slate-500">Loading product...</main>;
  }

  if (!product) {
    return <main className="min-h-screen bg-slate-50 px-6 pb-20 pt-32 text-center"><h1 className="text-3xl font-black text-slate-900">Product not found</h1><Link href="/study-material" className="mt-5 inline-flex text-sm font-bold text-blue-600">Back to Study Material</Link></main>;
  }

  return (
    <>
      {processingPayment ? (
        <main className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-3xl border border-blue-200/40 bg-white p-8 text-center shadow-2xl shadow-blue-900/20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
            <p className="text-2xl font-black text-slate-900">Payment successful</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Preparing your order and redirecting you to the thank-you page...</p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
              Processing
            </div>
          </div>
        </main>
      ) : null}

      <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 sm:px-6">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link href="/study-material" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to Study Material</Link>
            <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900 p-8 text-white shadow-xl sm:p-12">{coverUrl ? <img src={coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}<div className="relative"><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]">{product.tag}</span><h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl">{product.title}</h1><p className="mt-5 max-w-xl text-lg leading-8 text-blue-100">{product.description}</p></div></div>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-2xl font-black text-slate-900">What you will get</h2><div className="mt-5 space-y-4">{product.features.map((feature) => <p key={feature} className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />{feature}</p>)}</div></div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Get instant access</p><h2 className="mt-3 text-xl font-black text-slate-900">Buy this resource</h2><div className="mt-5 flex items-center border-b border-slate-100 pb-5 text-3xl font-black text-slate-900"><IndianRupee className="h-6 w-6" />{product.price}</div><label htmlFor="buyer-email" className="mt-5 block text-sm font-bold text-slate-700">Email for delivery</label><input id="buyer-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />{processingPayment ? null : <button type="button" onClick={handleBuyNow} disabled={!email.trim() || !isValidEmail(email) || loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"><LockKeyhole className="h-4 w-4" />{loading ? "Starting payment..." : "Buy Now"}</button>}{error && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">{error}</p>}<p className="mt-4 text-center text-xs leading-5 text-slate-400">Secure Razorpay test checkout. Digital delivery will be enabled after payment verification.</p></aside>
        </section>
      </main>
    </>
  );
}