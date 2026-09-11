"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <Image src="/pdfsnap-icon.png" alt="PDFSnap" width={48} height={48} className="h-12 w-12 object-contain transition-transform group-hover:scale-105" />
              <span className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white">PDFSnap</span>
                <span className="mt-1 text-[7px] font-semibold tracking-[0.18em] text-blue-300">SNAP. CONVERT. DONE.</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">Simple, secure tools for the documents you work with every day.</p>
            <Link href="/#tools" className="mt-7 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500">Explore tools</Link>
          </div>

          <FooterColumn title="Product" links={[
            ["Merge PDF", "/merge-pdf"],
            ["Compress PDF", "/compress-pdf"],
            ["Split PDF", "/split-pdf"],
            ["JPG to PDF", "/jpg-to-pdf"],
            ["AI Tools", "/#ai-features"],
          ]} />
          <FooterColumn title="Company" links={[
            ["About Us", "/about"],
            ["Contact", "/contact"],
            ["Pricing", "/pricing"],
          ]} />
          <FooterColumn title="Legal" links={[
            ["Privacy Policy", "/privacy-policy"],
            ["Terms of Service", "/terms-of-service"],
          ]} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PDFSnap Inc. All rights reserved.</p>
          <p className="text-slate-600">Built for faster document work.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm text-slate-400">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="transition-colors hover:text-blue-300">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}