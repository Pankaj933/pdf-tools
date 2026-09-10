"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { passwordResetClient } from "../../../lib/supabase/password-reset";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error: resetError } = await passwordResetClient.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/admin/reset-password` }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage("If an account exists for this email, a reset link has been sent.");
      }
    } catch (requestError) {
      setError(requestError?.message || "Unable to send the reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[440px] items-center">
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="px-6 pb-5 pt-6">
            <Link href="/admin/login" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
            <p className="mt-2 text-sm text-slate-500">Enter your admin email and we will send you a secure reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 px-6 py-6">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@pdfsnap.in"
                required
                className="box-border block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
            {message ? <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div> : null}
            <button type="submit" disabled={loading} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Sending..." : "Send reset link"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}