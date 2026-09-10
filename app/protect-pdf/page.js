"use client";

import { useCallback, useEffect, useState } from "react";
import PDFDocument from "../../lib/pdfkit-browser";
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

export default function ProtectPdfPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [protectedFile, setProtectedFile] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setProtectedFile(false);

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
    setConfirmPassword("");
    setProtectedFile(false);
    setError("");
  };

  const formatFileSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const generateProtectedPdf = async () => {
    if (!file || loading) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setProtectedFile(false);

    try {
      const bytes = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
      const pdf = await loadingTask.promise;
      const outputChunks = [];
      const document = new PDFDocument({
        autoFirstPage: false,
        userPassword: password,
        ownerPassword: `${password}-owner`,
        permissions: {
          printing: allowPrinting ? "highResolution" : undefined,
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: false,
          documentAssembly: false,
        },
      });

      document.on("data", (chunk) => outputChunks.push(chunk));
      const finished = new Promise((resolve, reject) => {
        document.on("end", resolve);
        document.on("error", reject);
      });

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

        document.addPage({ size: [baseViewport.width, baseViewport.height], margin: 0 });
        document.image(canvas.toDataURL("image/jpeg", 0.9), 0, 0, {
          width: baseViewport.width,
          height: baseViewport.height,
        });
      }

      document.end();
      await finished;

      const protectedBytes = new Uint8Array(
        outputChunks.reduce((total, chunk) => total + chunk.length, 0)
      );
      let offset = 0;
      outputChunks.forEach((chunk) => {
        protectedBytes.set(chunk, offset);
        offset += chunk.length;
      });

      const url = URL.createObjectURL(new Blob([protectedBytes], { type: "application/pdf" }));
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-protected.pdf`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setProtectedFile(true);
    } catch (protectError) {
      console.error("PDF protection error:", protectError);
      setError("Unable to protect this PDF. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
            <FileKey className="h-4 w-4" />
            Free PDF Security Tool
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Protect <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Add password protection to a PDF directly in your browser and control basic document permissions.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-2xl">
          {!file && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-purple-500 hover:bg-purple-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50"><Upload className="h-9 w-9 text-purple-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700">
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50"><FileText className="h-6 w-6 text-purple-600" /></div>
                  <div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)}</p></div>
                </div>
                <button onClick={removeFile} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="mb-5 flex items-center gap-3"><KeyRound className="h-5 w-5 text-purple-600" /><div><h2 className="font-bold text-slate-800">Set PDF password</h2><p className="mt-1 text-sm text-slate-500">Use at least 6 characters.</p></div></div>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" minLength={6} required className="box-border block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10" />
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" minLength={6} required className="mt-4 box-border block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10" />
                <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-600"><input type="checkbox" checked={allowPrinting} onChange={(event) => setAllowPrinting(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />Allow printing</label>
                <button onClick={generateProtectedPdf} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/20 transition hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? <><Loader2 className="h-6 w-6 animate-spin" />Protecting PDF...</> : <><Download className="h-6 w-6" />Protect and download PDF</>}
                </button>
              </div>

              {protectedFile && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Protected PDF download started.</div>}
              <p className="text-center text-sm text-slate-400">Your PDF is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
