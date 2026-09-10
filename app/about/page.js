import Link from "next/link";
import { ArrowRight, FileCheck2, LockKeyhole, Sparkles, Zap } from "lucide-react";

const values = [
  {
    title: "Simple by design",
    description: "Focused tools and clear workflows help you finish document tasks without a learning curve.",
    icon: Zap,
    tone: "bg-amber-100 text-amber-700",
  },
  {
    title: "Privacy comes first",
    description: "Your files are processed securely and are not kept permanently on our servers.",
    icon: LockKeyhole,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Built for real work",
    description: "From a quick conversion to an AI-assisted summary, PDFSnap is made for everyday needs.",
    icon: Sparkles,
    tone: "bg-blue-100 text-blue-700",
  },
];

export default function About() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 pt-20 text-slate-900">
      <section className="relative border-b border-slate-200 bg-white">
        <div className="absolute right-[-8rem] top-[-10rem] h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> About PDFSnap
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Make every PDF task feel <span className="text-blue-600">lighter.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              PDFSnap is a fast, friendly workspace for managing documents online. Convert, compress, merge and understand your files without installing another app.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/#tools" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600">
                Explore our tools <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">
                Talk to us
              </Link>
            </div>
          </div>

          <div className="relative rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-blue-900/15 sm:p-10">
            <div className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">Our mission</p>
            <h2 className="mt-12 text-3xl font-bold leading-tight">Give everyone better tools for the documents they already use.</h2>
            <p className="mt-5 leading-7 text-slate-300">Whether you are a student, a professional or a growing business, PDFSnap keeps the busywork moving so you can focus on what comes next.</p>
            <div className="mt-9 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              <div><strong className="block text-2xl text-white">Free</strong><span className="text-xs text-slate-400">to get started</span></div>
              <div><strong className="block text-2xl text-white">Fast</strong><span className="text-xs text-slate-400">browser workflows</span></div>
              <div><strong className="block text-2xl text-white">Secure</strong><span className="text-xs text-slate-400">by default</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">What guides us</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Useful software should get out of the way.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="border-t-2 border-slate-900 pt-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${value.tone}`}><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-xl font-bold">{value.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-blue-50/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-14 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Ready to make PDFs less complicated?</h2>
            <p className="mt-2 text-slate-600">Start with a tool and get straight to the result.</p>
          </div>
          <Link href="/#tools" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}