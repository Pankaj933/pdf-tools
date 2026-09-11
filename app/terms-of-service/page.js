const sections = [
  ["acceptance", "Acceptance of Terms"],
  ["services", "Our Services"],
  ["acceptable-use", "Acceptable Use"],
  ["your-content", "Your Content"],
  ["ai-features", "AI Features"],
  ["intellectual-property", "Intellectual Property"],
  ["availability", "Availability and Changes"],
  ["disclaimer", "Disclaimer and Liability"],
  ["contact", "Contact Us"],
];

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-20 text-slate-900">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> The PDFSnap agreement
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Terms that keep things clear.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              These terms explain the simple rules for using PDFSnap. By using our tools, you agree to use them responsibly and keep control of the documents you work with.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5 text-sm text-slate-400">
            <span><strong className="font-semibold text-white">Terms</strong> · Service agreement</span>
            <span><strong className="font-semibold text-white">Applies to</strong> · PDFSnap tools</span>
            <span><strong className="font-semibold text-white">Contact</strong> · support@pdfsnap.in</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-16 lg:px-8 lg:py-16">
        <aside className="self-start lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">On this page</p>
          <nav aria-label="Terms of service sections" className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 lg:block lg:space-y-3">
            {sections.map(([id, title], index) => (
              <a key={id} href={`#${id}`} className="group flex items-start gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600">
                <span className="font-mono text-xs text-slate-400 group-hover:text-blue-500">{String(index + 1).padStart(2, "0")}</span>
                <span>{title}</span>
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-8 shadow-xl shadow-slate-900/5 sm:px-10 sm:py-12 lg:px-14">
          <p className="border-b border-slate-200 pb-8 text-lg leading-8 text-slate-600">
            Welcome to <span className="font-bold text-slate-900">PDFSnap</span>. These Terms of Service govern your access to and use of the PDFSnap website and tools. Please read them carefully before using the service.
          </p>

          <TermsSection id="acceptance" number="01" title="Acceptance of Terms">
            <p>By accessing or using PDFSnap, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with these terms, please do not use the service.</p>
          </TermsSection>

          <TermsSection id="services" number="02" title="Our Services">
            <p>PDFSnap provides online tools for tasks such as merging, compressing, splitting, converting, editing, rotating, protecting, and unlocking PDF files. We may add, update, or remove tools as the service develops.</p>
          </TermsSection>

          <TermsSection id="acceptable-use" number="03" title="Acceptable Use">
            <p>You agree to use PDFSnap only for lawful purposes. You must not use the service to upload content that is illegal, harmful, fraudulent, infringing, malicious, or intended to interfere with the service or another person&apos;s access to it.</p>
          </TermsSection>

          <TermsSection id="your-content" number="04" title="Your Content">
            <p>You retain ownership of the files and other content you submit to PDFSnap. You are responsible for having the rights and permissions needed to upload and process that content.</p>
            <p className="mt-4">You grant PDFSnap only the limited permission needed to process your content and return the requested result. Files may be temporarily handled by our service providers to complete a task, as described in our Privacy Policy.</p>
          </TermsSection>

          <TermsSection id="ai-features" number="05" title="AI Features">
            <p>AI-powered tools may send relevant document content to third-party AI providers to generate a requested result. AI output can be incomplete or inaccurate, so you should review it before relying on it for important decisions.</p>
          </TermsSection>

          <TermsSection id="intellectual-property" number="06" title="Intellectual Property">
            <p>PDFSnap, including its branding, interface, software, and original content, is owned by or licensed to PDFSnap and is protected by applicable intellectual property laws. These terms do not give you ownership of any part of the service.</p>
          </TermsSection>

          <TermsSection id="availability" number="07" title="Availability and Changes">
            <p>We aim to keep PDFSnap useful and available, but we do not guarantee uninterrupted or error-free operation. We may suspend access for maintenance, security, legal, or operational reasons.</p>
            <p className="mt-4">We may update these terms from time to time. Continued use of PDFSnap after an update means you accept the revised terms.</p>
          </TermsSection>

          <TermsSection id="disclaimer" number="08" title="Disclaimer and Liability">
            <p>PDFSnap is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, PDFSnap is not responsible for indirect losses, loss of data, or decisions made solely from results produced by the service.</p>
          </TermsSection>

          <section id="contact" className="scroll-mt-28 pt-9">
            <SectionHeading number="09" title="Contact Us" />
            <p>If you have questions about these Terms of Service, contact us at:</p>
            <a href="mailto:support@pdfsnap.in" className="mt-5 inline-flex rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700 transition hover:bg-blue-100">support@pdfsnap.in</a>
          </section>
        </article>
      </div>
    </main>
  );
}

function TermsSection({ id, number, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-slate-200 py-9">
      <SectionHeading number={number} title={title} />
      <div className="leading-7 text-slate-600">{children}</div>
    </section>
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