"use client";

import { useState, useRef } from "react";
import { imagesToPDF } from "../../utils/jpgToPdf"; // Keep your existing logic
import { saveAs } from "file-saver";               // Keep your existing logic
import Link from "next/link";

export default function JPGtoPDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Handle standard file selection
  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => file.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...validFiles]);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleConvert = async () => {
    if (!files.length) return alert("Please upload at least one image");

    setLoading(true);
    try {
      const pdf = await imagesToPDF(files);
      saveAs(pdf, "converted.pdf");
    } catch (error) {
      console.error(error);
      alert("Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-hidden selection:bg-red-500 selection:text-white">
      
      {/* --- Background Ambient Glow --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full" />
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
        
        <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">JPG to PDF</h2>
            <p className="text-slate-400 text-sm">Convert your images into a single PDF document in seconds.</p>
          </div>

          {/* Drop Zone */}
          <div
            className={`relative w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? "border-red-500 bg-red-500/10 scale-[1.02]" 
                : "border-slate-700 hover:border-red-500 hover:bg-slate-800/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <p className="text-slate-200 font-medium">Click to upload or drag & drop images</p>
            <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP</p>
          </div>

          {/* Image Preview Grid */}
          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-300">
                  Selected Images ({files.length})
                </p>
                <button 
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {files.map((file, i) => (
                  <div key={i} className="group relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    {/* Image Thumbnail */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview ${i}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Index Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                      {i + 1}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(i)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || loading}
            className={`
              w-full mt-8 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg flex items-center justify-center gap-2
              ${files.length === 0 || loading
                ? "bg-slate-700 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Convert to PDF
              </>
            )}
          </button>
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
                <li><Link href="/jpg-to-pdf" className="hover:text-red-500 transition-colors">JPG to PDF</Link></li>
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