"use client";

import { useState } from "react";
import { splitPDF } from "../../utils/splitPdf"; // Keep your existing logic
import { saveAs } from "file-saver";            // Keep your existing logic
import Link from "next/link";

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setDone(false);
  };

  const clearFile = () => {
    setFile(null);
    setDone(false);
    if (document.getElementById("file-upload")) {
        document.getElementById("file-upload").value = "";
    }
  };

  const handleSplit = async () => {
    if (!file) return alert("Upload PDF first");

    setLoading(true);
    setDone(false);

    try {
      const files = await splitPDF(file);

      // Download logic
      files.forEach((blob, index) => {
        saveAs(blob, `split-page-${index + 1}.pdf`);
      });
      
      setDone(true);
    } catch (error) {
      console.error(error);
      alert("Failed to split PDF.");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden selection:bg-red-500 selection:text-white">
      
      {/* --- Background Ambient Glow --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-600/20 blur-[120px] rounded-full" />
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span>PDFSnap</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
            <Link href="/#tools" className="hover:text-red-500 transition-colors">All Tools</Link>
            <Link href="/#why-choose" className="hover:text-red-500 transition-colors">Features</Link>
          </div>
          <button className="bg-white text-slate-950 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-24 relative z-10">
        
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Split PDF Files</h2>
            <p className="text-slate-400 text-sm">Extract pages from your PDF into separate files instantly.</p>
          </div>

          {/* File Upload Input */}
          <label className="block w-full cursor-pointer">
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              // File Selected State
              <div className="w-full border border-red-500/50 bg-red-500/5 rounded-xl p-4 flex items-center gap-4 transition-all">
                <div className="w-12 h-12 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent file dialog reopening
                    clearFile();
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ) : (
              // Empty State
              <div className="w-full border-2 border-dashed border-slate-700 rounded-xl p-10 text-center hover:border-red-500 hover:bg-slate-800/50 transition-all duration-300 flex flex-col items-center gap-3 group">
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <p className="text-slate-200 font-medium group-hover:text-white">Click to upload or drag & drop</p>
                <span className="text-xs text-slate-500">PDF files only</span>
              </div>
            )}
          </label>

          {/* Options (Optional extension) */}
          <div className="mt-6 flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <p className="text-xs text-slate-300">
              Pages will be separated into individual files (e.g., <span className="font-mono text-red-400">page-1.pdf</span>, <span className="font-mono text-red-400">page-2.pdf</span>)
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSplit}
            disabled={!file || loading}
            className={`
              w-full mt-8 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg
              ${!file || loading
                ? "bg-slate-700 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Splitting...
              </span>
            ) : (
              "Split PDF Now"
            )}
          </button>

          {/* Success Message */}
          {done && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-green-500/20 p-1.5 rounded-full">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Success!</p>
                <p className="text-xs text-slate-400">Files have been downloaded.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-white/10 bg-slate-950 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <span>PDFSnap</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Making document management easy, secure, and accessible for everyone.
              </p>
            </div>

            {/* Tools Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Popular Tools</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/merge-pdf" className="hover:text-red-500 transition-colors">Merge PDF</Link></li>
                <li><Link href="/compress-pdf" className="hover:text-red-500 transition-colors">Compress PDF</Link></li>
                <li><Link href="/split-pdf" className="hover:text-red-500 transition-colors">Split PDF</Link></li>
                <li><Link href="/pdf-to-word" className="hover:text-red-500 transition-colors">PDF to Word</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-red-500 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Social / Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Connect</h4>
              <div className="flex gap-4 mb-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} PDFSnap Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}