const sections = [
  ["information", "Information We Collect"],
  ["security", "File Security"],
  ["cookies", "Cookies"],
  ["services", "Third-Party Services"],
  ["ai-features", "AI Features"],
  ["advertising", "Advertising"],
  ["updates", "Changes to This Policy"],
  ["contact", "Contact Us"],
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-20 text-slate-900">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> Trust at PDFSnap
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Privacy, in plain language.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              We want you to understand what happens to your information when you use our PDF tools. Here is the short version: your documents are yours, and we handle them with care.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 text-sm text-slate-400">
            <span><strong className="font-semibold text-white">Policy</strong> · Privacy &amp; data</span>
            <span><strong className="font-semibold text-white">Applies to</strong> · PDFSnap tools</span>
            <span><strong className="font-semibold text-white">Contact</strong> · support@pdfsnap.in</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-16 lg:px-8 lg:py-16">
        <aside className="self-start lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">On this page</p>
          <nav aria-label="Privacy policy sections" className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 lg:block lg:space-y-3">
            {sections.map(([id, title], index) => (
              <a key={id} href={`#${id}`} className="group flex items-start gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600">
                <span className="font-mono text-xs text-slate-400 group-hover:text-blue-500">0{index + 1}</span>
                <span>{title}</span>
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-8 shadow-xl shadow-slate-900/5 sm:px-10 sm:py-12 lg:px-14">
          <p className="border-b border-slate-200 pb-8 text-lg leading-8 text-slate-600">
            Welcome to <span className="font-bold text-slate-900">PDFSnap</span>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and PDF tools.
          </p>

          <section id="information" className="scroll-mt-28 border-b border-slate-200 py-9">
            <SectionHeading number="01" title="Information We Collect" />
            <p>When you use our tools, files may be temporarily processed to perform actions such as merging, compressing, splitting, or converting PDFs. We do not permanently store your files unless explicitly stated.</p>
          </section>

          <section id="security" className="scroll-mt-28 border-b border-slate-200 py-9">
            <SectionHeading number="02" title="File Security" />
            <p>We take reasonable security measures to protect your uploaded files and personal information. Most processing is done automatically and files are deleted after processing whenever possible.</p>
          </section>

          <section id="cookies" className="scroll-mt-28 border-b border-slate-200 py-9">
            <SectionHeading number="03" title="Cookies" />
            <p>PDFSnap may use cookies and similar technologies to improve website performance, analyze traffic, and enhance user experience.</p>
          </section>

          <section id="services" className="scroll-mt-28 border-b border-slate-200 py-9">
            <SectionHeading number="04" title="Third-Party Services" />
            <p>We may use third-party services such as analytics tools, advertising networks, and AI providers to improve our services. These providers may process limited technical information as required to provide their services.</p>
          </section>

          <section id="ai-features" className="scroll-mt-28 border-b border-slate-200 py-9">
            <SectionHeading number="05" title="AI Features" />
            <p>If you use AI-powered features such as PDF summaries or document analysis, parts of your document content may be securely processed through third-party AI APIs to generate results.</p>
          </section>

          <section id="advertising" className="scroll-mt-28 border-b border-slate-200 py-9">
            <SectionHeading number="06" title="Advertising" />
            <p>We may display advertisements through third-party advertising partners such as Google AdSense. These partners may use cookies to show personalized ads.</p>
          </section>

          <section id="updates" className="scroll-mt-28 border-b border-slate-200 py-9">
            <SectionHeading number="07" title="Changes to This Policy" />
            <p>We may update this Privacy Policy from time to time. Any updates will be posted on this page.</p>
          </section>

          <section id="contact" className="scroll-mt-28 pt-9">
            <SectionHeading number="08" title="Contact Us" />
            <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
            <a href="mailto:support@pdfsnap.in" className="mt-5 inline-flex rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700 transition hover:bg-blue-100">support@pdfsnap.in</a>
          </section>
        </article>
      </div>
    </main>
  );
}

function SectionHeading({ number, title }) {
  return (
    <div className="mb-4 flex items-baseline gap-4">
      <span className="font-mono text-xs font-bold tracking-wider text-blue-600">{number}</span>
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
    </div>
  );
}