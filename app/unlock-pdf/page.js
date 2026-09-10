"use client";

import { useCallback, useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  CheckCircle2,
  Download,
  FileKey,
  FileText,
  KeyRound,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const RENDER_SCALE = 1.5;

export default function UnlockPdfPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setUnlocked(false);
    setPassword("");

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
    setPassword("");
    setUnlocked(false);
    setError("");
  };

  const formatFileSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const createUnlockedPdf = async () => {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setUnlocked(false);

    try {
      const bytes = await file.arrayBuffer();
      let outputBytes;

      try {
        const document = await PDFDocument.load(bytes);
        outputBytes = await document.save();
      } catch (pdfLibError) {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(bytes),
          password: password || undefined,
        });
        const pdf = await loadingTask.promise;
        const outputDocument = await PDFDocument.create();

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const sourcePage = await pdf.getPage(pageNumber);
          const baseViewport = sourcePage.getViewport({ scale: 1 });
          const renderViewport = sourcePage.getViewport({ scale: RENDER_SCALE });
          const canvas = window.document.createElement("canvas");
          const context = canvas.getContext("2d", { alpha: false });

          canvas.width = Math.ceil(renderViewport.width);
          canvas.height = Math.ceil(renderViewport.height);
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          await sourcePage.render({ canvasContext: context, viewport: renderViewport }).promise;

          const image = await outputDocument.embedPng(canvas.toDataURL("image/png"));
          const outputPage = outputDocument.addPage([baseViewport.width, baseViewport.height]);
          outputPage.drawImage(image, {
            x: 0,
            y: 0,
            width: baseViewport.width,
            height: baseViewport.height,
          });
        }

        outputBytes = await outputDocument.save();
        console.info("Encrypted PDF rebuilt after pdf-lib load failure:", pdfLibError);
      }

      downloadBlob(
        new Blob([outputBytes], { type: "application/pdf" }),
        `${file.name.replace(/\.pdf$/i, "")}-unlocked.pdf`
      );
      setUnlocked(true);
    } catch (unlockError) {
      console.error("PDF unlock error:", unlockError);
      const message = String(unlockError?.message || "").toLowerCase();
      setError(
        message.includes("password") || message.includes("encrypted")
          ? "This PDF needs the correct password. Please enter it and try again."
          : "Unable to unlock this PDF. Please check the file and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            <FileKey className="h-4 w-4" />
            Free PDF Security Tool
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Unlock <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Remove PDF restrictions in your browser and download a copy you can use freely.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-2xl">
          {!file && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-red-500 hover:bg-red-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50"><Upload className="h-9 w-9 text-red-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700">
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
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50"><FileText className="h-6 w-6 text-red-500" /></div>
                  <div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)}</p></div>
                </div>
                <button onClick={removeFile} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="mb-5 flex items-center gap-3"><KeyRound className="h-5 w-5 text-red-600" /><div><h2 className="font-bold text-slate-800">PDF password</h2><p className="mt-1 text-sm text-slate-500">Only required if this PDF is password protected.</p></div></div>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password if required" className="box-border block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10" />
                <button onClick={createUnlockedPdf} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-red-500/20 transition hover:from-red-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? <><Loader2 className="h-6 w-6 animate-spin" />Unlocking PDF...</> : <><Download className="h-6 w-6" />Unlock and download PDF</>}
                </button>
              </div>

              {unlocked && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Unlocked PDF download started.</div>}
              <p className="text-center text-sm text-slate-400">Your PDF is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
