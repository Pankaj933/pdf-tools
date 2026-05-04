import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* --- Background Ambient Glow --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <span>PDFSnap</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <Link href="#tools" className="hover:text-white transition-colors">Tools</Link>
            <Link href="#why-choose" className="hover:text-white transition-colors">Why Us</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <button className="bg-white text-slate-950 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-40 pb-20 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          New: AI-Powered OCR
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Master Your PDFs <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            With Precision
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate premium toolkit for your documents. Merge, split, compress, and convert securely with enterprise-grade speed.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#tools">
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all">
              Get Started Free
            </button>
          </Link>
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Watch Demo
          </button>
        </div>
      </section>

      {/* --- Tools Grid --- */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete PDF Toolkit</h2>
            <p className="text-slate-400">Everything you need to handle documents, wrapped in a beautiful interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Merge */}
            <Link href="/merge-pdf" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/10">
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Merge PDF</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Combine multiple PDF files into one single document seamlessly. Arrange files in any order.</p>
              <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300">
                Start Merging 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </Link>

            {/* Card 2: Compress */}
            <Link href="/compress-pdf" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10">
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-green-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-green-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Compress PDF</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Reduce file size while optimizing for maximal PDF quality. Save space without losing clarity.</p>
              <div className="flex items-center text-green-400 text-sm font-semibold group-hover:text-green-300">
                Compress Now 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </Link>

            {/* Card 3: Split */}
            <Link href="/split-pdf" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10">
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Split PDF</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Separate one page or a whole set for easy conversion into independent PDF files.</p>
              <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:text-blue-300">
                Split Files 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </Link>

             {/* Card 4: JPG to PDF */}
             <Link href="/jpg-to-pdf" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-900/10">
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-orange-600 group-hover:to-red-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">JPG to PDF</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Convert images to PDF documents in seconds. Perfect for scanning and archiving.</p>
              <div className="flex items-center text-orange-400 text-sm font-semibold group-hover:text-orange-300">
                Convert 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </Link>

            {/* Card 5: PDF to Word */}
            <Link href="/pdf-to-word" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10">
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-blue-500 mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">PDF to Word</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Convert your PDFs to editable Word documents effortlessly while keeping formatting.</p>
              <div className="flex items-center text-blue-500 text-sm font-semibold group-hover:text-blue-400">
                Convert to Word 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </Link>

            {/* Card 6: Protect PDF */}
            {/* <Link href="/protect-pdf" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/10">
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-red-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-pink-600 group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Protect PDF</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Encrypt your PDF documents with a password. Keep your sensitive data safe.</p>
              <div className="flex items-center text-red-400 text-sm font-semibold group-hover:text-red-300">
                Encrypt File 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </Link> */}

          </div>
        </div>
      </section>

      {/* --- Why Choose PDFSnap Section (NEW) --- */}
      <section id="why-choose" className="py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PDFSnap?</h2>
            <p className="text-slate-400">Designed for professionals who demand the best performance and security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Bank-Grade Security</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Your files are processed with TLS encryption and automatically deleted from our servers.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Our optimized cloud engine delivers results in seconds, not minutes.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">High Fidelity</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Maintain the original quality of your documents. No pixelation or formatting loss.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Works Everywhere</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Use PDFSnap on any device. Mobile, Tablet, or Desktop, with no app installation needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer (Premium Look) --- */}
      <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <span>PDFSnap</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Making document management easy, secure, and accessible for everyone. Built for the modern web.
              </p>
            </div>

            {/* Tools Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Popular Tools</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/merge-pdf" className="hover:text-purple-400 transition-colors">Merge PDF</Link></li>
                <li><Link href="/compress-pdf" className="hover:text-purple-400 transition-colors">Compress PDF</Link></li>
                <li><Link href="/split-pdf" className="hover:text-purple-400 transition-colors">Split PDF</Link></li>
                <li><Link href="/pdf-to-word" className="hover:text-purple-400 transition-colors">PDF to Word</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Social / Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
              <div className="flex gap-4 mb-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500 transition-all">
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

    </main>
  );
}