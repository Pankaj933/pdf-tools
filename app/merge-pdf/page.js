"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Combine,
  Upload,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import { mergePDFs } from "../../utils/mergePdf";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (selectedFiles) => {
    const incomingFiles = Array.from(selectedFiles || []);
    if (!incomingFiles.length) return;

    setDone(false);
    setError("");

    const invalidFile = incomingFiles.find(
      (file) =>
        (file.type !== "application/pdf" &&
          !file.name.toLowerCase().endsWith(".pdf")) ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setError(
        invalidFile.size > MAX_FILE_SIZE
          ? `${invalidFile.name} is larger than the 50MB limit.`
          : `${invalidFile.name} is not a valid PDF file.`
      );
      return;
    }

    setFiles((currentFiles) => [...currentFiles, ...incomingFiles]);
  };

  const handleInputChange = (event) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  };

  const removeFile = (indexToRemove) => {
    setFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove)
    );
    setDone(false);
  };

  const clearAll = () => {
    setFiles([]);
    setDone(false);
    setError("");
  };

  const handleMerge = async () => {
    if (files.length < 2 || merging) return;

    setMerging(true);
    setDone(false);
    setError("");

    try {
      const merged = await mergePDFs(files);
      saveAs(merged, "merged.pdf");
      setDone(true);
    } catch (mergeError) {
      console.error("PDF merge error:", mergeError);
      setError("Unable to merge these PDFs. Please try again.");
    } finally {
      setMerging(false);
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
            <Combine className="h-4 w-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Merge <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Combine multiple PDF files into one organized document in seconds.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6"
          >
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-orange-500 hover:bg-orange-50/30">
              <div className="mb-5 flex h-18 w-18 items-center justify-center rounded-2xl bg-orange-50 p-5">
                <Upload className="h-9 w-9 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDFs</h2>
              <p className="mt-2 text-slate-500">Select two or more files, or drag and drop them here</p>
              <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB per file</p>
              <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700">
                <Upload className="h-5 w-5" />
                Select PDFs
                <input type="file" accept="application/pdf,.pdf" multiple onChange={handleInputChange} className="hidden" />
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Files to merge</h2>
                    <p className="mt-1 text-sm text-slate-500">Files are merged in the order shown below.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">{files.length} files</span>
                    <button type="button" onClick={clearAll} className="text-sm font-semibold text-slate-500 transition hover:text-red-600">Clear all</button>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">{index + 1}</span>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50"><FileText className="h-5 w-5 text-red-500" /></div>
                        <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-700">{file.name}</p><p className="mt-1 text-xs text-slate-500">{formatSize(file.size)}</p></div>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Ready to merge</h2>
                    <p className="mt-1 text-sm text-slate-500">Your combined file will be downloaded as merged.pdf.</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleMerge}
                disabled={files.length < 2 || merging}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {merging ? <><Loader2 className="h-6 w-6 animate-spin" />Merging PDFs...</> : <><Combine className="h-6 w-6" />Merge PDF files</>}
              </button>

              {files.length < 2 && <p className="text-center text-sm text-amber-600">Add at least two PDF files to merge them.</p>}
              {done && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Your merged PDF downloaded successfully.</div>}
              <p className="text-center text-sm text-slate-400">Your PDFs are processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
