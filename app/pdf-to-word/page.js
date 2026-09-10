"use client";

import { useCallback, useEffect, useState } from "react";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function PdfToWordPage() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const extractPdfText = async (selectedFile) => {
    const arrayBuffer = await selectedFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const lines = new Map();

      content.items.forEach((item) => {
        if (!("str" in item) || !item.str.trim()) return;

        const y = Math.round(item.transform[5]);
        const line = lines.get(y) || [];
        line.push({ x: item.transform[4], value: item.str });
        lines.set(y, line);
      });

      const pageText = [...lines.entries()]
        .sort(([firstY], [secondY]) => secondY - firstY)
        .map(([, line]) =>
          line
            .sort((first, second) => first.x - second.x)
            .map((item) => item.value)
            .join(" ")
            .trim()
        )
        .filter(Boolean)
        .join("\n");

      pages.push(pageText);
    }

    return { pageCount: pdf.numPages, text: pages.filter(Boolean).join("\n\n") };
  };

  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDownloaded(false);
    setFile(null);
    setText("");
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
      const result = await extractPdfText(selectedFile);

      if (!result.text) {
        setError("This PDF does not contain selectable text. Scanned PDFs need OCR and cannot be converted here.");
        return;
      }

      setFile(selectedFile);
      setPageCount(result.pageCount);
      setText(result.text);
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
    setText("");
    setError("");
    setDownloaded(false);
  };

  const formatFileSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const createWordDocument = async () => {
    if (!text || converting) return;

    setConverting(true);
    setError("");
    setDownloaded(false);

    try {
      const paragraphs = text.split(/\n{2,}/).map(
        (paragraph) =>
          new Paragraph({
            children: [new TextRun({ text: paragraph.replace(/\n/g, " "), size: 22 })],
            spacing: { after: 180, line: 276 },
          })
      );

      const document = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: file.name.replace(/\.pdf$/i, ""),
                heading: HeadingLevel.TITLE,
                spacing: { after: 360 },
              }),
              ...paragraphs,
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(document);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}.docx`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (conversionError) {
      console.error("DOCX generation error:", conversionError);
      setError("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <FileText className="h-4 w-4" />
            Free PDF Converter
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            PDF to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Word</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Convert text-based PDF files into editable DOCX documents directly in your browser.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          {!file && !loading && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-blue-500 hover:bg-blue-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50"><Upload className="h-9 w-9 text-blue-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">Text-based PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                  <Upload className="h-5 w-5" />
                  Select PDF
                  <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /><p className="mt-4 font-semibold text-slate-700">Reading your PDF...</p><p className="mt-1 text-sm text-slate-400">Preparing editable Word content</p></div>}
          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}

          {file && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50"><FileText className="h-6 w-6 text-red-500" /></div>
                  <div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? "page" : "pages"}</p></div>
                </div>
                <button onClick={removeFile} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-800">Ready to convert</h2><p className="mt-1 text-sm text-slate-500">Your PDF text has been extracted locally in your browser.</p></div><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" /></div>
                <div className="mt-5 max-h-64 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">{text.slice(0, 1800)}{text.length > 1800 ? "…" : ""}</div>
              </div>

              <button onClick={createWordDocument} disabled={converting} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/20 transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60">
                {converting ? <><Loader2 className="h-6 w-6 animate-spin" />Creating Word document...</> : <><Download className="h-6 w-6" />Download Word document</>}
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
