"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, MailCheck } from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const productName = searchParams.get("product") || "your product";
  const buyerEmail = searchParams.get("email") || "your email";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-200 bg-white p-8 shadow-xl sm:p-12">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Payment successful</p>
        <h1 className="mt-4 text-center text-3xl font-black text-slate-900 sm:text-4xl">Thank you for your purchase</h1>

        <div className="mt-8 space-y-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p>
              Your order for <strong>{productName}</strong> is confirmed.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Download className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
            <p>
              The PDF has been sent to <strong>{buyerEmail}</strong>.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm leading-6 text-slate-500">
          If you do not see the email within a few minutes, please check your spam folder or contact support.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/study-material" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600">
            Continue shopping
          </Link>
          <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 px-4 py-20 text-center text-slate-500">Loading...</main>}>
      <ThankYouContent />
    </Suspense>
  );
}
