"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-100 shadow-sm">
      
      {/* Main Navbar */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="h-20 flex items-center">

            {/* ================= LOGO ================= */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
            >
              <Image
                src="/pdfsnap-icon.png"
                alt="PDFSnap"
                width={48}
                height={48}
                className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
                priority
              />

              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  PDFSnap
                </span>

                <span className="text-[6px] sm:text-[7px] font-semibold tracking-[0.18em] text-[#06466b] mt-1">
                  SNAP. CONVERT. DONE.
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <div className="hidden md:flex items-center ml-auto gap-8">

              {/* Home */}
              <Link
                href="/"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
              >
                Home
              </Link>

              {/* Tools */}
              <Link
                href="/tools"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
              >
                Tools
              </Link>

              {/* AI Tools */}
              <Link
                href="/#ai-features"
                className="text-slate-600 hover:text-purple-600 font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <span>AI Tools</span>

                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                  NEW
                </span>
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
              >
                Contact
              </Link>

              {/* About */}
              <Link
                href="/about"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
              >
                About Us
              </Link>

              {/* ================= GET STARTED ================= */}
              <Link
                href="/#tools"
                className="
                  inline-flex
                  items-center
                  justify-center
                  shrink-0
                  px-6
                  py-3
                  rounded-xl
                  bg-slate-900
                  text-white
                  font-semibold
                  text-sm
                  whitespace-nowrap
                  hover:bg-blue-600
                  hover:shadow-lg
                  hover:shadow-blue-500/20
                  transition-all
                  duration-200
                "
              >
                Get Started
              </Link>
            </div>

            {/* ================= MOBILE BUTTON ================= */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-auto text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          
          <div className="px-5 py-5 space-y-4">

            {/* Home */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            {/* Tools */}
            <Link
              href="/#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Tools
            </Link>

            {/* AI Tools */}
            <Link
              href="/#ai-features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 font-medium text-slate-700 hover:text-purple-600 transition-colors"
            >
              <span>AI Tools</span>

              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                NEW
              </span>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>

            {/* About */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>

            {/* Mobile Get Started */}
            <Link
              href="/#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="
                block
                w-full
                text-center
                px-5
                py-3
                rounded-xl
                bg-slate-900
                text-white
                font-semibold
                hover:bg-blue-600
                transition-all
              "
            >
              Get Started
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}