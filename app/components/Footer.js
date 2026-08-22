"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Footer Main */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <img
                src="/pdflogo.png"
                alt="PDFSnap"
                className="w-12 h-12 object-contain"
              />

              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  PDFSnap
                </span>

                <span className="text-[10px] font-bold tracking-[0.25em] text-[#06456b]">
                  SNAP. CONVERT. DONE.
                </span>
              </div>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Making document management easy, secure, and accessible.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">
              Product
            </h4>

            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link
                  href="/merge-pdf"
                  className="hover:text-blue-600 transition-colors"
                >
                  Merge PDF
                </Link>
              </li>

              <li>
                <Link
                  href="/compress-pdf"
                  className="hover:text-blue-600 transition-colors"
                >
                  Compress PDF
                </Link>
              </li>

              <li>
                <Link
                  href="/split-pdf"
                  className="hover:text-blue-600 transition-colors"
                >
                  Split PDF
                </Link>
              </li>

              <li>
                <Link
                  href="/jpg-to-pdf"
                  className="hover:text-blue-600 transition-colors"
                >
                  JPG to PDF
                </Link>
              </li>

              <li>
                <Link
                  href="/ai-tools"
                  className="hover:text-purple-600 transition-colors"
                >
                  AI Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">
              Company
            </h4>

            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">
              Legal
            </h4>

            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} PDFSnap Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link
              href="/privacy-policy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-of-service"
              className="hover:text-blue-600 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}