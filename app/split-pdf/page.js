"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Scissors,
  Upload,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import { splitPDF } from "../../utils/splitPdf";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDone(false);

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

  const clearFile = () => {
    setFile(null);
    setDone(false);
    setError("");
  };

  const handleSplit = async () => {
    if (!file || loading) return;

    setLoading(true);
    setDone(false);
    setError("");

    try {
      const files = await splitPDF(file);
      files.forEach((blob, index) => saveAs(blob, `page-${index + 1}.pdf`));
      setDone(true);
    } catch (splitError) {
      console.error("PDF split error:", splitError);
      setError("Unable to split this PDF. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <Scissors className="h-4 w-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Split <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Extract every page from your PDF into separate files quickly and securely.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6"
            >
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-orange-500 hover:bg-orange-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50">
                  <Upload className="h-9 w-9 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700">
                  <Upload className="h-5 w-5" />
                  Select PDF
                  <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {file && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-slate-800">{file.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{formatSize(file.size)} • Ready to split</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Ready to split</h2>
                    <p className="mt-1 text-sm text-slate-500">Each page will be downloaded as a separate PDF file.</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                </div>
                <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3 text-sm text-orange-800">
                  Files will be named page-1.pdf, page-2.pdf, and so on.
                </div>
              </div>

              <button
                type="button"
                onClick={handleSplit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-6 w-6 animate-spin" />Splitting PDF...</> : <><Scissors className="h-6 w-6" />Split PDF</>}
              </button>

              {done && (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Your PDF pages were downloaded successfully.
                </div>
              )}
              <p className="text-center text-sm text-slate-400">Your PDF is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
