"use client";

import { useState } from "react";
import { ArrowRight, Clock3, Mail, MessageSquareText, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-32 sm:px-6">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="relative overflow-hidden bg-slate-950 px-7 py-10 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Let&apos;s talk</p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">How can we help?</h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-300">Have a question about a tool, an idea for PDFSnap, or feedback about your experience? Send us a note.</p>

            <div className="mt-12 space-y-6 border-t border-white/10 pt-7">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email us</p><p className="mt-1 font-semibold text-white">support@pdfsnap.in</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Response time</p><p className="mt-1 font-semibold text-white">Usually within 24 hours</p></div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your privacy</p><p className="mt-1 font-semibold text-white">Your message stays confidential</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Contact support</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Send us a message</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Tell us a little about what you need and we&apos;ll get back to you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Your name</label>
              <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="Enter your name" />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">How can we help?</label>
              <textarea id="message" name="message" value={form.message} onChange={handleChange} rows="6" required className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="Write your message..." />
            </div>
            <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30">
              Send message <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}