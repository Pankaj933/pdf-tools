"use client";

import { useCallback, useEffect, useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  RotateCw,
  Upload,
  X,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ROTATION_OPTIONS = [0, 90, 180, 270];

export default function RotatePdfPage() {
  const [file, setFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const renderPagePreview = async (pdf, pageNumber, rotation) => {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 0.55, rotation });
    const canvas = window.document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;

    return canvas.toDataURL("image/jpeg", 0.82);
  };

  const loadPdf = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDownloaded(false);
    setFile(null);
    setPdfDocument(null);
    setPages([]);

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
      const bytes = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
      const pdf = await loadingTask.promise;
      const pagePreviews = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        pagePreviews.push({
          pageNumber,
          rotation: 0,
          preview: await renderPagePreview(pdf, pageNumber, 0),
        });
      }

      setFile(selectedFile);
      setPdfDocument(pdf);
      setPages(pagePreviews);
    } catch (loadError) {
      console.error("PDF loading error:", loadError);
      setError("Unable to read this PDF. Please try another PDF file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) loadPdf(selectedFile);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) loadPdf(droppedFile);
  };

  const updateRotation = async (pageNumber, amount) => {
    if (!pdfDocument) return;

    const currentPage = pages.find((page) => page.pageNumber === pageNumber);
    const nextRotation = (currentPage.rotation + amount + 360) % 360;
    const preview = await renderPagePreview(pdfDocument, pageNumber, nextRotation);

    setPages((currentPages) =>
      currentPages.map((page) =>
        page.pageNumber === pageNumber
          ? { ...page, rotation: nextRotation, preview }
          : page
      )
    );
    setDownloaded(false);
  };

  const setAllRotations = async (rotation) => {
    if (!pdfDocument) return;

    setLoading(true);
    try {
      const rotatedPages = await Promise.all(
        pages.map(async (page) => ({
          ...page,
          rotation,
          preview: await renderPagePreview(pdfDocument, page.pageNumber, rotation),
        }))
      );
      setPages(rotatedPages);
      setDownloaded(false);
    } catch (previewError) {
      console.error("PDF preview rotation error:", previewError);
      setError("Unable to update the page previews.");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPdfDocument(null);
    setPages([]);
    setError("");
    setDownloaded(false);
  };

  const formatFileSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const downloadRotatedPdf = async () => {
    if (!file || !pages.length || rotating) return;

    setRotating(true);
    setError("");
    setDownloaded(false);

    try {
      const bytes = await file.arrayBuffer();
      const document = await PDFDocument.load(bytes);

      document.getPages().forEach((page, index) => {
        page.setRotation(degrees(pages[index].rotation));
      });

      const rotatedBytes = await document.save();
      const blob = new Blob([rotatedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-rotated.pdf`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (rotationError) {
      console.error("PDF rotation error:", rotationError);
      setError("Rotation failed. Please try again.");
    } finally {
      setRotating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <RotateCw className="h-4 w-4" />
            Free PDF Organizer
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Rotate <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Rotate individual pages or the complete PDF, then download the corrected document.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          {!file && !loading && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-blue-500 hover:bg-blue-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50"><Upload className="h-9 w-9 text-blue-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                  <Upload className="h-5 w-5" />
                  Select PDF
                  <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /><p className="mt-4 font-semibold text-slate-700">Preparing PDF pages...</p><p className="mt-1 text-sm text-slate-400">Generating previews</p></div>}
          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}

          {file && !loading && (
            <div className="space-y-6">
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50"><FileText className="h-6 w-6 text-red-500" /></div>
                  <div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)} • {pages.length} {pages.length === 1 ? "page" : "pages"}</p></div>
                </div>
                <button onClick={removeFile} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-bold text-slate-800">Rotate all pages</h2><p className="mt-1 text-sm text-slate-500">Apply one rotation to the complete document.</p></div>
                <div className="flex flex-wrap gap-2">
                  {ROTATION_OPTIONS.map((rotation) => <button key={rotation} onClick={() => setAllRotations(rotation)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700">{rotation}°</button>)}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {pages.map((page) => (
                  <div key={page.pageNumber} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50"><img src={page.preview} alt={`PDF page ${page.pageNumber}`} className="max-h-full max-w-full object-contain" /></div>
                    <div className="mt-3 flex items-center justify-between"><span className="text-sm font-semibold text-slate-600">Page {page.pageNumber}</span><span className="text-xs font-semibold text-blue-600">{page.rotation}°</span></div>
                    <div className="mt-3 flex gap-2"><button onClick={() => updateRotation(page.pageNumber, -90)} title="Rotate left" className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 py-2 text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"><RotateCcw className="h-4 w-4" /></button><button onClick={() => updateRotation(page.pageNumber, 90)} title="Rotate right" className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 py-2 text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"><RotateCw className="h-4 w-4" /></button></div>
                  </div>
                ))}
              </div>

              <button onClick={downloadRotatedPdf} disabled={rotating} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-60">
                {rotating ? <><Loader2 className="h-6 w-6 animate-spin" />Creating rotated PDF...</> : <><Download className="h-6 w-6" />Download rotated PDF</>}
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
