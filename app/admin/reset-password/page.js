"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import { supabase } from "../../../lib/supabase";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const exchangeRecoveryCode = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        setError("Invalid or expired password reset link.");
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        setError(exchangeError.message);
        return;
      }

      setSessionReady(true);
    };

    exchangeRecoveryCode();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!sessionReady) {
      setError("Please wait while the reset link is being verified.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push("/admin/login?reset=success");
    } catch (updateRequestError) {
      setError(updateRequestError?.message || "Unable to update your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[440px] items-center">
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="px-6 pb-5 pt-6">
            <h1 className="text-2xl font-bold text-slate-900">Set a new password</h1>
            <p className="mt-2 text-sm text-slate-500">Choose a new password for your admin account.</p>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 px-6 py-6">
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">New password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required className="box-border block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <label htmlFor="confirm-password" className="mb-2 mt-5 block text-sm font-semibold text-slate-700">Confirm password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required className="box-border block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
            {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
            <button type="submit" disabled={loading || !sessionReady} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Updating..." : sessionReady ? "Update password" : "Verifying link..."}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-center">
            <Link href="/admin/login" className="text-sm font-medium text-slate-500 hover:text-blue-600">Back to login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}