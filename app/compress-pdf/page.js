"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Minimize2,
  Upload,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import { compressPDF } from "../../utils/compressPdf";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const compressionLevels = ["low", "medium", "high"];

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setSuccess(false);
    setCompressedSize(null);

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setOriginalSize(null);
      setError("Please select a valid PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setOriginalSize(null);
      setError("Maximum file size is 50MB.");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
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
    setOriginalSize(null);
    setCompressedSize(null);
    setSuccess(false);
    setError("");
  };

  const handleCompress = async () => {
    if (!file || loading) return;

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const compressed = await compressPDF(file, quality);
      setCompressedSize(compressed.size);
      saveAs(compressed, `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`);
      setSuccess(true);
    } catch (compressionError) {
      console.error("Compression failed:", compressionError);
      setError("Compression failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const getQualityLabel = (level) => {
    if (level === "low") return "High quality";
    if (level === "medium") return "Balanced";
    return "Smallest file";
  };

  const reduction = originalSize && compressedSize
    ? Math.max(0, ((1 - compressedSize / originalSize) * 100).toFixed(0))
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            <Minimize2 className="h-4 w-4" />
            Free PDF Tool
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Compress <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Reduce your PDF file size while keeping the best possible document quality.
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
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-green-500 hover:bg-green-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50">
                  <Upload className="h-9 w-9 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700">
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
                    <p className="mt-1 text-sm text-slate-500">{formatSize(originalSize)} • Ready to compress</p>
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
                    <h2 className="text-xl font-bold text-slate-800">Choose compression level</h2>
                    <p className="mt-1 text-sm text-slate-500">Select the balance between quality and file size.</p>
                  </div>
                  <Minimize2 className="h-6 w-6 shrink-0 text-green-600" />
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {compressionLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setQuality(level)}
                      className={`rounded-xl border px-4 py-3 text-left transition ${quality === level ? "border-green-500 bg-green-50 text-green-800 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:bg-green-50/40"}`}
                    >
                      <span className="block text-sm font-bold capitalize">{level}</span>
                      <span className="mt-1 block text-xs text-slate-500">{getQualityLabel(level)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompress}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-green-500/20 transition hover:from-green-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-6 w-6 animate-spin" />Compressing PDF...</> : <><Download className="h-6 w-6" />Compress and download PDF</>}
              </button>

              {success && compressedSize && (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span><strong>Compression complete.</strong> {formatSize(originalSize)} to {formatSize(compressedSize)}</span>
                  </div>
                  <span className="shrink-0 font-bold">-{reduction}%</span>
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
