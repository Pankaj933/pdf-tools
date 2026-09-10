"use client";

import { useCallback, useEffect, useState } from "react";
import pptxgen from "pptxgenjs";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Presentation,
  Upload,
  X,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function PdfToPowerPointPage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const extractPdfPages = async (selectedFile) => {
    const arrayBuffer = await selectedFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const extractedPages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const lines = new Map();

      content.items.forEach((item) => {
        if (!("str" in item) || !item.str.trim()) return;

        const y = Math.round(item.transform[5]);
        const line = lines.get(y) || [];
        line.push({ x: item.transform[4], value: item.str.trim() });
        lines.set(y, line);
      });

      const text = [...lines.entries()]
        .sort(([firstY], [secondY]) => secondY - firstY)
        .map(([, line]) =>
          line
            .sort((first, second) => first.x - second.x)
            .map((item) => item.value)
            .join(" ")
            .trim()
        )
        .filter(Boolean);

      extractedPages.push(text);
    }

    return { pageCount: pdf.numPages, pages: extractedPages };
  };

  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDownloaded(false);
    setFile(null);
    setPages([]);
    setPageCount(0);

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Maximum file size is 50MB.");
      return;
    }

    setLoading(true);

    try {
      const result = await extractPdfPages(selectedFile);
      if (!result.pages.some((page) => page.length)) {
        setError("This PDF does not contain selectable text. Scanned PDFs need OCR and cannot be converted here.");
        return;
      }

      setFile(selectedFile);
      setPageCount(result.pageCount);
      setPages(result.pages);
    } catch (conversionError) {
      console.error("PDF text extraction error:", conversionError);
      setError("Unable to read this PDF. Please try another PDF file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPageCount(0);
    setPages([]);
    setError("");
    setDownloaded(false);
  };

  const formatFileSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const downloadPowerPoint = async () => {
    if (!pages.length || converting) return;

    setConverting(true);
    setError("");
    setDownloaded(false);

    try {
      const presentation = new pptxgen();
      presentation.layout = "LAYOUT_WIDE";
      presentation.author = "PDFSnap";
      presentation.subject = `PowerPoint conversion of ${file.name}`;
      presentation.title = file.name.replace(/\.pdf$/i, "");
      presentation.company = "PDFSnap";
      presentation.lang = "en-US";

      pages.forEach((pageLines, pageIndex) => {
        const slide = presentation.addSlide();
        slide.background = { color: "F8FAFC" };
        slide.addText(`${file.name.replace(/\.pdf$/i, "")} | Page ${pageIndex + 1}`, {
          x: 0.6,
          y: 0.35,
          w: 12.1,
          h: 0.35,
          fontFace: "Aptos",
          fontSize: 11,
          color: "64748B",
          margin: 0,
        });
        slide.addText(pageLines.join("\n"), {
          x: 0.75,
          y: 1.05,
          w: 11.8,
          h: 5.9,
          fontFace: "Aptos",
          fontSize: Math.max(12, Math.min(22, 28 - pageLines.length * 0.45)),
          color: "0F172A",
          breakLine: false,
          fit: "shrink",
          margin: 0.08,
          valign: "top",
          paraSpaceAfterPt: 8,
        });
      });

      await presentation.writeFile({
        fileName: `${file.name.replace(/\.pdf$/i, "")}.pptx`,
      });
      setDownloaded(true);
    } catch (conversionError) {
      console.error("PPTX generation error:", conversionError);
      setError("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const previewLines = pages.flat().slice(0, 12);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <Presentation className="h-4 w-4" />
            Free PDF Converter
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            PDF to <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">PowerPoint</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Convert text-based PDF pages into editable PPTX slides directly in your browser.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          {!file && !loading && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-orange-500 hover:bg-orange-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50"><Upload className="h-9 w-9 text-orange-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">Text-based PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700">
                  <Upload className="h-5 w-5" />
                  Select PDF
                  <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600" /><p className="mt-4 font-semibold text-slate-700">Reading your PDF...</p><p className="mt-1 text-sm text-slate-400">Preparing editable PowerPoint slides</p></div>}
          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}

          {file && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50"><FileText className="h-6 w-6 text-orange-600" /></div>
                  <div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? "page" : "pages"}</p></div>
                </div>
                <button onClick={removeFile} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-800">Slide preview</h2><p className="mt-1 text-sm text-slate-500">Each PDF page becomes an editable PowerPoint slide.</p></div><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" /></div>
                <div className="mt-5 max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">{previewLines.join("\n")}{pages.flat().length > previewLines.length ? "\n…" : ""}</div>
              </div>

              <button onClick={downloadPowerPoint} disabled={converting} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                {converting ? <><Loader2 className="h-6 w-6 animate-spin" />Creating PowerPoint file...</> : <><Download className="h-6 w-6" />Download PowerPoint presentation</>}
              </button>
              {downloaded && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Download started successfully.</div>}
              <p className="text-center text-sm text-slate-400">Your PDF is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}