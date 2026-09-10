"use client";

import { useEffect } from "react";
import Link from "next/link";

const toolSeo = {
  "/compress-pdf": ["Compress PDF Online for Free", "Reduce PDF file size quickly while keeping documents readable and easy to share.", ["Upload your PDF file.", "Choose a compression level.", "Download the compressed PDF."], [["Will compression change my PDF content?", "The tool re-saves your PDF while preserving its pages and content."], ["Is there a file size limit?", "PDFSnap accepts PDF files up to 50MB on this tool."]], [["Merge PDF", "/merge-pdf"], ["Split PDF", "/split-pdf"], ["Watermark PDF", "/watermark-pdf"]]],
  "/merge-pdf": ["Merge PDF Files Online", "Combine multiple PDF documents into one file in the exact order you choose.", ["Select two or more PDF files.", "Review and remove files if needed.", "Download your merged PDF."], [["Can I control the page order?", "PDFs are merged in the order shown in the file list."], ["Are my files uploaded?", "No. The merge runs locally in your browser."]], [["Split PDF", "/split-pdf"], ["Compress PDF", "/compress-pdf"], ["PDF to JPG", "/pdf-to-jpg"]]],
  "/split-pdf": ["Split PDF Pages Online", "Extract every page from a PDF into separate downloadable files.", ["Upload a PDF file.", "Start the split process.", "Download the individual page PDFs."], [["Does splitting change the original file?", "No. The original PDF stays on your device."], ["How are pages named?", "Output files are named page-1.pdf, page-2.pdf, and so on."]], [["Merge PDF", "/merge-pdf"], ["Rotate PDF", "/rotate-pdf"], ["Compress PDF", "/compress-pdf"]]],
  "/pdf-to-word": ["Convert PDF to Word Online", "Extract selectable PDF text and download it as an editable DOCX document.", ["Upload a text-based PDF.", "Review the extracted text.", "Download the Word document."], [["Can scanned PDFs be converted?", "Scanned PDFs need OCR and are not supported by this browser tool."], ["Is the conversion private?", "Text extraction and DOCX generation happen locally."]], [["Word to PDF", "/word-to-pdf"], ["PDF to Excel", "/pdf-to-excel"], ["PDF to PowerPoint", "/pdf-to-powerpoint"]]],
  "/pdf-to-excel": ["Convert PDF to Excel Online", "Extract PDF text and table-like data into an editable Excel spreadsheet.", ["Upload a text-based PDF.", "Review detected rows and columns.", "Download the XLSX spreadsheet."], [["Does it support scanned documents?", "Scanned PDFs require OCR and are not supported."], ["Will tables be preserved perfectly?", "Complex layouts may need minor spreadsheet editing."]], [["Excel to PDF", "/excel-to-pdf"], ["PDF to Word", "/pdf-to-word"], ["PDF to JPG", "/pdf-to-jpg"]]],
  "/pdf-to-powerpoint": ["Convert PDF to PowerPoint Online", "Turn selectable PDF page text into editable PowerPoint slides.", ["Upload a text-based PDF.", "Review the slide text preview.", "Download the PPTX presentation."], [["Does each PDF page become a slide?", "Yes. Each source page becomes one PowerPoint slide."], ["Can scanned PDFs be converted?", "No. The tool requires selectable PDF text."]], [["PowerPoint to PDF", "/powerpoint-to-pdf"], ["PDF to Word", "/pdf-to-word"], ["PDF to JPG", "/pdf-to-jpg"]]],
  "/pdf-to-jpg": ["Convert PDF to JPG Images Online", "Turn PDF pages into downloadable JPG images with quality and resolution controls.", ["Upload your PDF.", "Choose image quality and scale.", "Download the JPG images."], [["Can I convert every page?", "Yes. Each PDF page becomes a separate JPG image."], ["Are files processed privately?", "Yes. Rendering happens in your browser."]], [["JPG to PDF", "/jpg-to-pdf"], ["PDF to Word", "/pdf-to-word"], ["Split PDF", "/split-pdf"]]],
  "/jpg-to-pdf": ["Convert JPG to PDF Online", "Combine JPG and PNG images into one PDF document with ordered previews.", ["Select one or more images.", "Review the image order.", "Download the combined PDF."], [["Which image formats are supported?", "The tool supports JPG, JPEG, and PNG images."], ["Can I choose the page order?", "Images appear in the PDF in the order shown."]], [["PDF to JPG", "/pdf-to-jpg"], ["Merge PDF", "/merge-pdf"], ["Compress PDF", "/compress-pdf"]]],
  "/word-to-pdf": ["Convert Word to PDF Online", "Convert DOCX Word documents into clean PDF files with local browser processing.", ["Upload a DOCX file.", "Review the document preview.", "Download the generated PDF."], [["Are DOC files supported?", "This converter accepts DOCX files. Legacy DOC files are not supported."], ["Will formatting be preserved?", "Text and paragraph breaks are preserved."]], [["PDF to Word", "/pdf-to-word"], ["Excel to PDF", "/excel-to-pdf"], ["JPG to PDF", "/jpg-to-pdf"]]],
  "/excel-to-pdf": ["Convert Excel to PDF Online", "Convert XLSX and XLS spreadsheets into paginated PDF tables.", ["Upload an Excel spreadsheet.", "Review the worksheet preview.", "Download the PDF version."], [["Are multiple worksheets included?", "Yes. Every populated worksheet is included."], ["Which Excel formats are supported?", "The tool accepts XLSX and XLS files."]], [["PDF to Excel", "/pdf-to-excel"], ["Word to PDF", "/word-to-pdf"], ["JPG to PDF", "/jpg-to-pdf"]]],
  "/watermark-pdf": ["Add a Watermark to PDF Online", "Place a custom text watermark on every PDF page with adjustable settings.", ["Upload your PDF.", "Enter text and adjust settings.", "Download the watermarked PDF."], [["Can I change opacity?", "Yes. Use the opacity control to adjust visibility."], ["Will every page be watermarked?", "Yes. The watermark is applied to every page."]], [["Protect PDF", "/protect-pdf"], ["Edit PDF", "/edit-pdf"], ["Compress PDF", "/compress-pdf"]]],
  "/protect-pdf": ["Protect PDF with a Password Online", "Add password protection and control basic PDF permissions in your browser.", ["Upload your PDF.", "Set and confirm a password.", "Download the protected PDF."], [["Is my password stored?", "No. Password processing happens locally."], ["Can printing be allowed?", "Yes. A basic printing permission option is available."]], [["Unlock PDF", "/unlock-pdf"], ["Watermark PDF", "/watermark-pdf"], ["Compress PDF", "/compress-pdf"]]],
  "/unlock-pdf": ["Unlock PDF Online", "Remove supported PDF password restrictions and download an accessible copy.", ["Upload a supported PDF.", "Enter the document password if requested.", "Download the unlocked PDF."], [["Can every password be removed?", "It depends on the PDF encryption supported by the browser library."], ["Are files uploaded?", "No. Processing happens on your device."]], [["Protect PDF", "/protect-pdf"], ["Watermark PDF", "/watermark-pdf"], ["Merge PDF", "/merge-pdf"]]],
  "/rotate-pdf": ["Rotate PDF Pages Online", "Rotate PDF pages to the correct orientation and download the updated document.", ["Upload your PDF.", "Choose the rotation angle.", "Download the rotated PDF."], [["Can I rotate all pages?", "Yes. The selected rotation can be applied to the document."], ["Does rotation reduce quality?", "The page content remains in the PDF without image conversion by default."]], [["Split PDF", "/split-pdf"], ["Merge PDF", "/merge-pdf"], ["Edit PDF", "/edit-pdf"]]],
  "/edit-pdf": ["Edit PDF Online for Free", "Make common PDF edits in your browser, including text, images, shapes, and annotations.", ["Upload your PDF.", "Add or adjust content.", "Export the edited PDF."], [["Can I edit existing PDF text?", "Capabilities depend on the selected editing tool; additions and annotations are supported."], ["Is editing private?", "The document is processed in your browser where supported."]], [["Watermark PDF", "/watermark-pdf"], ["Rotate PDF", "/rotate-pdf"], ["Protect PDF", "/protect-pdf"]]],
};

export default function ToolSeoContent() {
  const path = typeof window !== "undefined" ? window.location.pathname.replace(/\/$/, "") || "/" : "/";
  const content = toolSeo[path];

  useEffect(() => {
    if (content) document.title = `${content[0]} | PDFSnap`;
  }, [content]);

  if (!content) return null;
  const [title, description, steps, faqs, related] = content;

  return (
    <section className="border-t border-slate-200 bg-white px-4 py-14 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
            <h3 className="mt-8 text-lg font-bold text-slate-800">How to use this tool</h3>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              {steps.map((step, index) => <li key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600"><span className="mr-2 font-bold text-blue-600">{index + 1}.</span>{step}</li>)}
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Frequently asked questions</h3>
            <div className="mt-4 space-y-4">{faqs.map(([question, answer]) => <div key={question}><h4 className="font-semibold text-slate-800">{question}</h4><p className="mt-1 text-sm leading-6 text-slate-600">{answer}</p></div>)}</div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6"><p className="text-sm font-semibold text-slate-700">Related PDF tools</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">{related.map(([label, href]) => <Link key={href} href={href} className="font-medium text-blue-600 hover:text-blue-800">{label}</Link>)}</div></div>
      </div>
    </section>
  );
}
