"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  IndianRupee,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

const AI_SUMMARY_PRODUCT_NAME = "AI PDF Summary Premium";
const AI_SUMMARY_PRICE = 299;
const HAS_PURCHASED_KEY = "pdfsnap_ai_summary_purchased";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const features = [
  "Instant summary of long PDFs",
  "Key points and action items in plain English",
  "Perfect for notes, reports, contracts and study material",
  "Secure one-time premium access",
];

const stopWords = new Set([
  "the","a","an","and","or","but","if","then","else","for","with","from","into","of","on","in","at","by","to","is","are","was","were","be","been","being","it","its","this","that","these","those","as","we","you","your","our","they","them","their","he","she","his","her","who","what","when","where","why","how","can","could","should","would","may","might","do","does","did","not","no","yes","so","too","very","more","most","some","all","any","each","every","have","has","had","will","just","about","after","before","over","under","than","then","also","because","while","through","between","among","without","within","out","up","down","off","once","again","there","here","throughout"
]);

function extractSentences(text) {
  return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function buildSummary(text) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  if (!cleanText) return "Upload a PDF to generate a summary.";

  const sentences = extractSentences(cleanText);
  if (sentences.length === 0) return "No readable text was found in the uploaded PDF.";

  const frequency = new Map();
  sentences.forEach((sentence) => {
    const words = sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word && !stopWords.has(word) && word.length > 2);

    words.forEach((word) => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });
  });

  const ranked = sentences
    .map((sentence) => {
      const words = sentence
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word && !stopWords.has(word) && word.length > 2);

      const score = words.reduce((sum, word) => sum + (frequency.get(word) || 0), 0);
      return { sentence, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.sentence);

  const uniqueSentences = [...new Set(ranked)].slice(0, 4);

  return uniqueSentences.length
    ? uniqueSentences.map((sentence, index) => `${index + 1}. ${sentence}`).join("\n\n")
    : "The uploaded PDF is too short for a meaningful summary.";
}

async function extractPdfText(file) {
  if (typeof window === "undefined") {
    throw new Error("PDF extraction is only available in the browser.");
  }

  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const arrayBuffer = await file.arrayBuffer();
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.6.205/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const pageText = await page.getTextContent();
    text += pageText.items.map((item) => item.str || "").join(" ") + " ";
  }

  return text;
}

export default function AISummaryPremiumPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [fileName, setFileName] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => script.remove();
  }, []);

  useEffect(() => {
    const persisted = window.localStorage.getItem(HAS_PURCHASED_KEY) === "1";
    if (persisted) {
      setHasPurchased(true);
    }
  }, []);

  const purchaseStatusText = useMemo(() => {
    if (hasPurchased) {
      return "Premium access unlocked — you can now use the AI PDF Summary tool.";
    }
    return "Unlock premium access to generate AI summaries from your PDFs.";
  }, [hasPurchased]);

  const markPurchased = () => {
    setHasPurchased(true);
    window.localStorage.setItem(HAS_PURCHASED_KEY, "1");
  };

  const handleBuyNow = async () => {
    const trimmedEmail = email.trim();
    setError("");

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address to continue.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-order",
          email: trimmedEmail,
          productName: AI_SUMMARY_PRODUCT_NAME,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to start payment right now.");
      }

      if (!window.Razorpay) {
        throw new Error("Payment window is still loading. Please try again.");
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.order.amount,
        currency: result.order.currency,
        name: "PDFSnap",
        description: AI_SUMMARY_PRODUCT_NAME,
        order_id: result.order.id,
        prefill: { email: trimmedEmail },
        theme: { color: "#7c3aed" },
        handler: async (paymentResponse) => {
          try {
            setProcessingPayment(true);
            setLoading(false);

            const verificationResponse = await fetch("/api/ai-summary", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "verify",
                ...paymentResponse,
                email: trimmedEmail,
                productName: AI_SUMMARY_PRODUCT_NAME,
              }),
            });

            const verification = await verificationResponse.json();

            if (!verificationResponse.ok || !verification.verified) {
              throw new Error(verification.error || "Payment verification failed.");
            }

            markPurchased();
            setProcessingPayment(false);
          } catch (verificationError) {
            setProcessingPayment(false);
            setLoading(false);
            setError(verificationError.message || "Payment verification failed.");
          }
        },
      });

      razorpay.open();
    } catch (payError) {
      setLoading(false);
      setError(payError.message || "Unable to start the payment.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError("");
    setFileName(file.name);
    setSummaryText("");
    setSummaryLoading(true);

    try {
      const extracted = await extractPdfText(file);
      setPdfText(extracted);
      setSummaryLoading(false);
    } catch {
      setSummaryLoading(false);
      setError("The PDF could not be processed. Please try another file.");
    }
  };

  const generateSummary = () => {
    if (!pdfText.trim()) {
      setError("Please upload a PDF before generating the summary.");
      return;
    }

    setError("");
    setSummaryLoading(true);
    setTimeout(() => {
      setSummaryText(buildSummary(pdfText));
      setSummaryLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600">
          <ArrowLeft className="h-4 w-4" />
          Back to tools
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="rounded-[2rem] bg-gradient-to-br from-violet-700 via-purple-600 to-slate-900 p-8 text-white shadow-xl sm:p-12">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-violet-100">
                <Sparkles className="h-4 w-4" />
                Premium AI tool
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                {AI_SUMMARY_PRODUCT_NAME}
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-violet-100">
                Turn long, dense PDFs into clean summaries, key insights, and action points in seconds.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]">
                  One-time purchase
                </span>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
                  Instant access
                </span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-black text-slate-900">What you get</h2>
              <div className="mt-6 space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <p>{feature}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3 text-slate-900">
                  <FileText className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Best for</span>
                </div>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Students, professionals, recruiters, and teams who want fast understanding from long reports and notes without reading every page.
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
              <ShieldCheck className="h-4 w-4" />
              Secure checkout
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-900">{hasPurchased ? "Premium access unlocked" : "Unlock Premium Access"}</h2>

            {!hasPurchased ? (
              <>
                <div className="mt-5 flex items-end gap-2 border-b border-slate-100 pb-5">
                  <IndianRupee className="h-6 w-6 text-slate-800" />
                  <span className="text-4xl font-black text-slate-900">{AI_SUMMARY_PRICE}</span>
                </div>

                <label htmlFor="ai-email" className="mt-5 block text-sm font-bold text-slate-700">
                  Email for access
                </label>
                <input
                  id="ai-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                {!processingPayment && (
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!email.trim() || !isValidEmail(email) || loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <LockKeyhole className="h-4 w-4" />
                    {loading ? "Starting payment..." : "Pay Now"}
                  </button>
                )}

                <div className="mt-5 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-violet-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <MessageSquareText className="h-4 w-4" />
                    Includes premium AI summary generation
                  </div>
                </div>
                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Secure Razorpay checkout. Your premium access is activated after successful payment verification.
                </p>
              </>
            ) : (
              <div className="mt-5 space-y-5">
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-700">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    {purchaseStatusText}
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm font-medium text-slate-600 transition hover:border-violet-300 hover:bg-violet-50">
                    <Upload className="h-6 w-6 text-violet-600" />
                    <span>{fileName || "Upload PDF to summarize"}</span>
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={generateSummary}
                  disabled={summaryLoading || !pdfText.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  {summaryLoading ? "Generating summary..." : "Generate Summary"}
                </button>

                {error && <p className="rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">{error}</p>}

                {summaryText && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Summary</p>
                    <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{summaryText}</div>
                  </div>
                )}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
