"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  FileImage,
  FileText,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import { imagesToPDF } from "../../utils/jpgToPdf";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export default function JPGtoPDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  const addFiles = (selectedFiles) => {
    const incomingFiles = Array.from(selectedFiles || []);
    if (!incomingFiles.length) return;

    setDone(false);
    setError("");

    const invalidFile = incomingFiles.find(
      (file) =>
        !ACCEPTED_IMAGE_TYPES.includes(file.type) ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setError(
        invalidFile.size > MAX_FILE_SIZE
          ? `${invalidFile.name} is larger than the 50MB limit.`
          : `${invalidFile.name} is not a supported image. Use JPG or PNG.`
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

  const handleConvert = async () => {
    if (!files.length || loading) return;

    setLoading(true);
    setDone(false);
    setError("");

    try {
      const pdf = await imagesToPDF(files);
      saveAs(pdf, "converted.pdf");
      setDone(true);
    } catch (conversionError) {
      console.error("Image to PDF conversion error:", conversionError);
      setError("Conversion failed. Please use JPG or PNG images and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <FileImage className="h-4 w-4" />
            Free PDF Converter
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            JPG to <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Convert one or more JPG and PNG images into a single PDF document.
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
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50">
                <Upload className="h-9 w-9 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your images</h2>
              <p className="mt-2 text-slate-500">Select images or drag and drop them here</p>
              <p className="mt-2 text-sm text-slate-400">JPG and PNG files only, maximum 50MB per file</p>
              <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700">
                <ImagePlus className="h-5 w-5" />
                Select images
                <input type="file" accept="image/jpeg,image/png" multiple onChange={handleInputChange} className="hidden" />
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
                    <h2 className="text-xl font-bold text-slate-800">Images to convert</h2>
                    <p className="mt-1 text-sm text-slate-500">Images are added to the PDF in the order shown.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">{files.length} {files.length === 1 ? "image" : "images"}</span>
                    <button type="button" onClick={clearAll} className="text-sm font-semibold text-slate-500 transition hover:text-red-600">Clear all</button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <div className="aspect-[4/3]">
                        <img src={previewUrls[index]} alt={`Preview of ${file.name}`} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/75 text-xs font-bold text-white">{index + 1}</div>
                      <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-slate-600 opacity-100 shadow-sm transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"><X className="h-4 w-4" /></button>
                      <div className="flex items-center gap-2 px-3 py-2"><FileText className="h-4 w-4 shrink-0 text-slate-400" /><p className="truncate text-xs font-medium text-slate-600">{file.name}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Ready to convert</h2>
                    <p className="mt-1 text-sm text-slate-500">Each image will become one page in your PDF.</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/20 transition hover:from-orange-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-6 w-6 animate-spin" />Creating PDF...</> : <><FileImage className="h-6 w-6" />Convert to PDF</>}
              </button>

              {done && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Your PDF downloaded successfully.</div>}
              <p className="text-center text-sm text-slate-400">Your images are processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
