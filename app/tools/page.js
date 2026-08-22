"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Scissors,
  Minimize2,
  FileText,
  FileSpreadsheet,
  FileImage,
  Presentation,
  RotateCw,
  Unlock,
  Lock,
  Stamp,
  Sparkles,
  Image as ImageIcon,
  PenLine,
  Combine,
} from "lucide-react";


const tools = [
  {
    title: "Merge PDF",
    desc: "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: Combine,
    category: "Workflows",
    iconClass: "bg-orange-100 text-orange-600",
    link: "/merge-pdf",
  },
  {
    title: "Split PDF",
    desc: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: Scissors,
    category: "Workflows",
    iconClass: "bg-orange-100 text-orange-600",
    link: "/split-pdf",
  },
  {
    title: "Compress PDF",
    desc: "Reduce file size while optimizing your PDF for maximum quality.",
    icon: Minimize2,
    category: "Optimize PDF",
    iconClass: "bg-green-100 text-green-600",
    link: "/compress-pdf",
  },
  {
    title: "PDF to Word",
    desc: "Convert your PDF files into editable DOC and DOCX documents easily.",
    icon: FileText,
    category: "Convert PDF",
    iconClass: "bg-blue-100 text-blue-600",
    link: "/pdf-to-word",
  },
  {
    title: "PDF to PowerPoint",
    desc: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    icon: Presentation,
    category: "Convert PDF",
    iconClass: "bg-orange-100 text-orange-600",
    link: "/pdf-to-powerpoint",
  },
  {
    title: "PDF to Excel",
    desc: "Pull data straight from PDFs into editable Excel spreadsheets.",
    icon: FileSpreadsheet,
    category: "Convert PDF",
    iconClass: "bg-green-100 text-green-600",
    link: "/pdf-to-excel",
  },
  {
    title: "Word to PDF",
    desc: "Make DOC and DOCX files easy to read by converting them into PDF.",
    icon: FileText,
    category: "Convert PDF",
    iconClass: "bg-blue-100 text-blue-600",
    link: "/word-to-pdf",
  },
  {
    title: "PowerPoint to PDF",
    desc: "Convert PPT and PPTX slideshows into professional PDF files.",
    icon: Presentation,
    category: "Convert PDF",
    iconClass: "bg-orange-100 text-orange-600",
    link: "/powerpoint-to-pdf",
  },
  {
    title: "Excel to PDF",
    desc: "Convert Excel spreadsheets into clean and shareable PDF documents.",
    icon: FileSpreadsheet,
    category: "Convert PDF",
    iconClass: "bg-green-100 text-green-600",
    link: "/excel-to-pdf",
  },
  {
    title: "Edit PDF",
    desc: "Add text, images, shapes and annotations to your PDF documents.",
    icon: PenLine,
    category: "Edit PDF",
    iconClass: "bg-purple-100 text-purple-600",
    link: "/edit-pdf",
  },
  {
    title: "JPG to PDF",
    desc: "Convert JPG and PNG images into high-quality PDF documents.",
    icon: ImageIcon,
    category: "Convert PDF",
    iconClass: "bg-purple-100 text-purple-600",
    link: "/jpg-to-pdf",
  },
  {
    title: "PDF to JPG",
    desc: "Convert every PDF page into high-quality JPG images.",
    icon: FileImage,
    category: "Convert PDF",
    iconClass: "bg-slate-100 text-slate-700",
    link: "/pdf-to-jpg",
  },
  {
    title: "Rotate PDF",
    desc: "Rotate individual pages or the entire PDF document easily.",
    icon: RotateCw,
    category: "Organize PDF",
    iconClass: "bg-blue-100 text-blue-600",
    link: "/rotate-pdf",
  },
  {
    title: "Unlock PDF",
    desc: "Remove password protection from your PDF files securely.",
    icon: Unlock,
    category: "PDF Security",
    iconClass: "bg-red-100 text-slate-800",
    link: "/unlock-pdf",
  },
  {
    title: "Protect PDF",
    desc: "Add password protection and keep your PDF files secure.",
    icon: Lock,
    category: "PDF Security",
    iconClass: "bg-purple-100 text-purple-600",
    link: "/protect-pdf",
  },
  {
    title: "Watermark PDF",
    desc: "Add text or image watermarks to your PDF documents.",
    icon: Stamp,
    category: "Edit PDF",
    iconClass: "bg-slate-100 text-slate-800",
    link: "/watermark-pdf",
  },
  {
    title: "AI PDF Summary",
    desc: "Get an instant AI-powered summary of long PDF documents.",
    icon: Sparkles,
    category: "PDF Intelligence",
    iconClass: "bg-purple-100 text-purple-600",
    link: "/ai-summary",
  },
];


const categories = [
  "All",
  "Workflows",
  "Organize PDF",
  "Optimize PDF",
  "Convert PDF",
  "Edit PDF",
  "PDF Security",
  "PDF Intelligence",
];


export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools =
    activeCategory === "All"
      ? tools
      : tools.filter(
          (tool) => tool.category === activeCategory
        );


  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">

      {/* HERO */}

      <section className="pb-12">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* HEADING */}

          <div className="text-center max-w-5xl mx-auto">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-800">
                Everything Your PDF{" "}
            
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Needs. In One Place.
            </span>
            </h1>
            <p className="mt-5 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed text-slate-500">
                Merge, compress, convert, edit, and manage your PDFs with powerful,
                easy-to-use tools. Fast, secure, and completely free.
                </p>

          </div>


          {/* CATEGORY */}

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-6
                  py-3
                  rounded-full
                  text-sm
                  font-semibold
                  border
                  transition-all
                  duration-200

                  ${
                    activeCategory === category
                      ? "bg-slate-800 text-white border-slate-800 shadow-lg"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                  }
                `}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

      </section>


      {/* TOOLS */}

      <section className="pb-10">
  <div className="max-w-[1500px] mx-auto px-6 lg:px-8">

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-6
      "
    >
      {filteredTools.map((tool) => {
        const Icon = tool.icon;

        return (
          <Link
            key={tool.title}
            href={tool.link}
            className="
              group
              relative
              min-h-[280px]
              bg-white
              border
              border-slate-200
              rounded-[22px]
              p-6
              flex
              flex-col
              overflow-hidden
              transition-all
              duration-300
              hover:-translate-y-1.5
              hover:border-slate-300
              hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]
            "
          >

            {/* ICON */}
            <div
              className={`
                w-12
                h-12
                rounded-2xl
                flex
                items-center
                justify-center
                mb-6
                transition-transform
                duration-300
                group-hover:scale-110
                ${tool.iconClass}
              `}
            >
              <Icon className="w-6 h-6" />
            </div>


            {/* TITLE */}
            <h2 className="
              text-[21px]
              font-bold
              tracking-tight
              text-slate-800
              mb-3
              leading-tight
            ">
              {tool.title}
            </h2>


            {/* DESCRIPTION */}
            <p className="
              text-[15px]
              leading-7
              text-slate-500
            ">
              {tool.desc}
            </p>


            {/* BOTTOM LINE */}
            <div className="
              mt-auto
              pt-6
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-600
              transition-all
              duration-300
              opacity-0
              translate-y-2
              group-hover:opacity-100
              group-hover:translate-y-0
            ">
              Open Tool

              <ArrowRight className="
                w-4
                h-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              " />
            </div>

          </Link>
        );
      })}
    </div>

  </div>
</section>

    </main>
  );
}