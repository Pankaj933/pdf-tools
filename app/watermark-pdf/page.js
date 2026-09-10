"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Stamp,
  Upload,
  X,
} from "lucide-react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const sanitizePdfText = (value) =>
  value
    .replace(/[\u2190\u2191\u2192\u2193]/g, (character) => ({
      "\u2190": "<-",
      "\u2191": "^",
      "\u2192": "->",
      "\u2193": "v",
    })[character])
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E]/g, "?");

export default function WatermarkPdfPage() {
  const [file, setFile] = useState(null);
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(45);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDownloaded(false);

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setError("Please select a valid PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Maximum file size is 50MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setFile(null);
    setDownloaded(false);
    setError("");
  };

  const addWatermark = async () => {
    const safeWatermark = sanitizePdfText(watermark.trim());
    if (!file || loading) return;
    if (!safeWatermark) {
      setError("Enter watermark text before continuing.");
      return;
    }

    setLoading(true);
    setDownloaded(false);
    setError("");

    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);

      pdf.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(safeWatermark, fontSize);
        const x = Math.max(24, (width - textWidth) / 2);
        const y = Math.max(24, (height - fontSize) / 2);

        page.drawText(safeWatermark, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.35, 0.4, 0.48),
          opacity,
          rotate: degrees(rotation),
        });
      });

      const bytes = await pdf.save();
      saveAs(
        new Blob([bytes], { type: "application/pdf" }),
        `${file.name.replace(/\.pdf$/i, "")}-watermarked.pdf`
      );
      setDownloaded(true);
    } catch (watermarkError) {
      console.error("PDF watermark error:", watermarkError);
      setError("Unable to add the watermark. Please try another PDF file.");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            <Stamp className="h-4 w-4" />
            Free PDF Editing Tool
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Watermark <span className="bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Add a custom text watermark to every page of your PDF directly in your browser.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          {!file && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-slate-500 hover:bg-slate-100/60">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100"><Upload className="h-9 w-9 text-slate-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-800 px-7 py-3.5 font-semibold text-white shadow-lg shadow-slate-800/20 transition hover:bg-slate-700">
                  <Upload className="h-5 w-5" />
                  Select PDF
                  <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}

          {file && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100"><FileText className="h-6 w-6 text-slate-600" /></div><div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)} • Watermark ready</p></div></div>
                <button type="button" onClick={removeFile} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-800">Watermark settings</h2><p className="mt-1 text-sm text-slate-500">The watermark will be centered on every page.</p></div><Stamp className="h-6 w-6 shrink-0 text-slate-600" /></div>
                <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="watermark-text">Watermark text</label>
                <input id="watermark-text" value={watermark} onChange={(event) => setWatermark(event.target.value)} maxLength={80} placeholder="CONFIDENTIAL" className="mt-2 box-border block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/10" />
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <label className="text-sm font-semibold text-slate-700">Font size<span className="mt-2 flex items-center gap-3"><input type="range" min="18" max="96" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} className="w-full accent-slate-700" /><span className="w-10 text-right text-xs font-normal text-slate-500">{fontSize}</span></span></label>
                  <label className="text-sm font-semibold text-slate-700">Opacity<span className="mt-2 flex items-center gap-3"><input type="range" min="0.05" max="0.8" step="0.05" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="w-full accent-slate-700" /><span className="w-10 text-right text-xs font-normal text-slate-500">{Math.round(opacity * 100)}%</span></span></label>
                  <label className="text-sm font-semibold text-slate-700">Rotation<span className="mt-2 flex items-center gap-3"><input type="range" min="0" max="360" step="15" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="w-full accent-slate-700" /><span className="w-10 text-right text-xs font-normal text-slate-500">{rotation}°</span></span></label>
                </div>
                <div className="mt-6 flex min-h-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50"><span className="select-none font-bold text-slate-500" style={{ fontSize: `${Math.min(fontSize, 54)}px`, opacity, transform: `rotate(${rotation}deg)` }}>{sanitizePdfText(watermark) || "YOUR WATERMARK"}</span></div>
              </div>

              <button type="button" onClick={addWatermark} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-slate-700 to-blue-700 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-slate-500/20 transition hover:from-slate-800 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><Loader2 className="h-6 w-6 animate-spin" />Adding watermark...</> : <><Download className="h-6 w-6" />Add watermark and download</>}
              </button>
              {downloaded && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Watermarked PDF downloaded successfully.</div>}
              <p className="text-center text-sm text-slate-400">Your PDF is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
