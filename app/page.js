"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FileText, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Gift, 
  CheckCircle2, 
  GripVertical, 
  Layers, 
  Minimize2, 
  Scissors, 
  Image as ImageIcon, 
  Cpu, 
  MessageSquare, 
  SearchCheck, 
  Star, 
  ChevronDown, 
  Twitter, 
  Linkedin, 
  GitHub, 
  Heart,
  Table2,
  RotateCw,
  Unlock,
  Grid2X2,
  FileImage,
  MonitorSmartphone
} from "lucide-react";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- Sub-Components ---

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20  lg:pb-32 overflow-hidden bg-slate-50">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity 
          }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-[100px]" 
        />

        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            delay: 1 
          }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-400/30 rounded-full blur-[100px]" 
        />

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Center Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center flex flex-col items-center"
        >

          {/* Trusted Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>

            <span className="text-sm font-semibold text-slate-600">
              Trusted by 1M+ users
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
            All-in-One PDF Tools
            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              for Free
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
            Merge, Compress, Split, Convert and Summarize PDFs instantly
            with AI-powered tools. Experience the future of document
            management.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link 
              href="#tools" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-blue-500/25 hover:-translate-y-1"
            >
              Start Using Tools
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <Link 
              href="#ai-features" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:text-purple-600 transition-all duration-300 hover:-translate-y-1"
            >
              <Sparkles className="mr-2 w-5 h-5 text-purple-600" />
              Try AI Summary
            </Link>

          </div>

          {/* Features */}
          <div className="mt-10 flex items-center justify-center gap-6 text-slate-400 text-sm font-medium">

            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure
            </span>

            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500" />
              Fast
            </span>

            <span className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-pink-500" />
              Free
            </span>

          </div>

        </motion.div>

      </div>

    </section>
  );
};

const ToolCard = ({ icon: Icon, title, desc, colorClass, delay, link }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -6 }}
    className="h-full min-w-0"
  >
    <Link
      href={link}
      className="
        group
        relative
        flex
        flex-col
        h-full
        min-h-[250px]
        w-full
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-6
        sm:p-7
        overflow-hidden
        transition-all
        duration-300
        hover:border-blue-200
        hover:shadow-2xl
        hover:shadow-slate-200/70
      "
    >
      {/* Icon */}
      <div
        className={`
          w-14
          h-14
          shrink-0
          rounded-2xl
          ${colorClass}
          flex
          items-center
          justify-center
          mb-7
          transition-transform
          duration-300
          group-hover:scale-110
        `}
      >
        <Icon className="w-7 h-7" />
      </div>

      {/* Title */}
      <h3 className="text-[21px] leading-tight font-bold text-slate-800 mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[15px] leading-7 text-slate-500">
        {desc}
      </p>

      {/* Bottom */}
      <div
        className="
          mt-auto
          pt-6
          flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-blue-600
          opacity-0
          translate-y-2
          transition-all
          duration-300
          group-hover:opacity-100
          group-hover:translate-y-0
        "
      >
        Open Tool

        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  </motion.div>
);

const Tools = () => {
  const tools = [
    {
      icon: Layers,
      title: "Merge PDF",
      desc: "Combine multiple PDFs into one.",
      colorClass: "bg-purple-100 text-purple-600",
      delay: 0,
      link: "/merge-pdf",
    },
    {
      icon: Minimize2,
      title: "Compress PDF",
      desc: "Reduce PDF file size while keeping quality.",
      colorClass: "bg-green-100 text-green-600",
      delay: 0.1,
      link: "/compress-pdf",
    },
    {
      icon: Scissors,
      title: "Split PDF",
      desc: "Extract pages or split PDF into files.",
      colorClass: "bg-orange-100 text-orange-600",
      delay: 0.2,
      link: "/split-pdf",
    },
    {
      icon: ImageIcon,
      title: "JPG to PDF",
      desc: "Convert JPG and PNG images into PDF.",
      colorClass: "bg-pink-100 text-pink-600",
      delay: 0.3,
      link: "/jpg-to-pdf",
    },
    {
      icon: FileImage,
      title: "PDF to JPG",
      desc: "Convert PDF pages into JPG images.",
      colorClass: "bg-blue-100 text-blue-600",
      delay: 0.4,
      link: "/pdf-to-jpg",
    },
    {
      icon: FileText,
      title: "PDF to Word",
      desc: "Convert PDF to editable Word documents.",
      colorClass: "bg-blue-100 text-blue-600",
      delay: 0.5,
      link: "/pdf-to-word",
    },
    {
      icon: Table2,
      title: "PDF to Excel",
      desc: "Convert PDF tables into Excel sheets.",
      colorClass: "bg-green-100 text-green-600",
      delay: 0.6,
      link: "/pdf-to-excel",
    },
    {
      icon: RotateCw,
      title: "Rotate PDF",
      desc: "Rotate PDF pages left or right.",
      colorClass: "bg-indigo-100 text-indigo-600",
      delay: 0.7,
      link: "/rotate-pdf",
    },
    {
      icon: Unlock,
      title: "Unlock PDF",
      desc: "Remove password protection from PDF.",
      colorClass: "bg-emerald-100 text-emerald-600",
      delay: 0.8,
      link: "/unlock-pdf",
    },
    {
      icon: Grid2X2,
      title: "More Tools",
      desc: "Explore more powerful PDF utilities.",
      colorClass: "bg-slate-100 text-slate-600",
      delay: 0.9,
      link: "#all-tools",
    },
  ];

  return (
    <section id="tools" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Popular PDF Tools
          </h2>

          <p className="text-lg text-slate-500">
            Everything you need to work with PDFs in one place.
            Fast, secure and easy to use.
          </p>
        </motion.div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              desc={tool.desc}
              colorClass={tool.colorClass}
              delay={tool.delay}
              link={tool.link}
            />
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-slate-700 font-semibold border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all"
          >
            View All PDF Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

const AIFeatures = () => {
  const features = [
    { icon: FileText, title: "Summarize PDFs", desc: "Turn long reports into concise bullet points.", gradient: "from-pink-500 to-rose-600" },
    { icon: MessageSquare, title: "Chat with PDFs", desc: "Ask questions and get accurate answers.", gradient: "from-blue-500 to-cyan-600" },
    { icon: SearchCheck, title: "Smart Analysis", desc: "Extract entities and key figures instantly.", gradient: "from-violet-500 to-purple-600" }
  ];

  return (
    <section id="ai-features" className="py-32 relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-red-400 text-xs font-bold uppercase tracking-wider mb-8">
             Comming Soon
          </div>
          <br></br>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Cpu className="w-3 h-3" /> Powered by GPT-4
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            AI-Powered <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">PDF Experience</span>
          </h2>
          <p className="text-lg text-slate-400">Don't just read documents. Understand them in seconds with our suite of intelligent tools.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors duration-500">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const features = [
    { icon: Zap, title: "Fast Processing", desc: "Cloud engine processes files in seconds.", color: "bg-blue-50 text-blue-600" },
    { icon: ShieldCheck, title: "Secure Files", desc: "256-bit SSL encryption. Auto-delete.", color: "bg-green-50 text-green-600" },
    { icon: MonitorSmartphone, title: "No Installation", desc: "Works directly in your browser.", color: "bg-purple-50 text-purple-600" },
    { icon: Heart, title: "Free to Use", desc: "Most tools are free forever.", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why Choose PDFSnap?</h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((item, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="text-center p-6">
              <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-6`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-semibold text-slate-800">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 text-slate-600">{answer}</div>
      </motion.div>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl font-bold text-center text-slate-900 mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        
        <div className="space-y-4">
          <FAQItem question="Is PDFSnap completely free?" answer="Yes, most of our core tools like Merge, Split, and Compress are free forever. We also offer a Premium plan for advanced AI features." />
          <FAQItem question="Are my files safe?" answer="Absolutely. We use SSL encryption to transfer your files. Your files are processed automatically and deleted from our servers permanently after 1 hour." />
          <FAQItem question="Does it work on mobile?" answer="Yes! PDFSnap is responsive and works perfectly on iPhone, Android, tablets, and desktop browsers." />
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="py-24 bg-slate-900 text-white">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-20 relative overflow-hidden"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to simplify your workflow?</h2>
        <p className="text-blue-100 text-lg mb-10">Join over 1 million users handling documents smarter.</p>
        <Link href="#tools" className="inline-block px-10 py-4 rounded-xl bg-white text-blue-900 font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl">
          Get Started Free
        </Link>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="footer" className="bg-white border-t border-slate-100 pt-16 pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">PDFSnap</span>
          </div>
          <p className="text-slate-500 text-sm mb-6">Making document management easy, secure, and accessible.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/merge-pdf" className="hover:text-blue-600">Merge PDF</Link></li>
            <li><Link href="/compress-pdf" className="hover:text-blue-600">Compress PDF</Link></li>
            <li><Link href="/ai-tools" className="hover:text-blue-600">AI Tools</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-blue-600">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
        <p>&copy; 2026 PDFSnap Inc.</p>
        {/* <div className="flex gap-4 mt-4 md:mt-0">
          <Twitter className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
          <Linkedin className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
          
        </div> */}
      </div>
    </div>
  </footer>
);

// --- Main Page Export ---
export default function Home() {
  return (
    <main className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-blue-200">
      
      <Hero />
      <Tools />
      <AIFeatures />
      <WhyUs />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}