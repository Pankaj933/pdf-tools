"use client";

import { useCallback, useEffect, useState } from "react";
import { Upload, FileText, X, Download, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export default function PdfToJpgPage() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [quality, setQuality] = useState("high");
  const [scale, setScale] = useState(2);

  // --------------------------------------------------
  // PDF.JS WORKER FIX
  // --------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }
  }, []);

  // --------------------------------------------------
  // FILE SELECT
  // --------------------------------------------------
  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setPreviews([]);
    setPdfDoc(null);

    // PDF check
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file.");
      return;
    }

    // 50MB limit
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("Maximum file size is 50MB.");
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      });

      const pdf = await loadingTask.promise;

      setPdfDoc(pdf);

      const generatedPreviews = [];

      // Generate thumbnails for all pages
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: 0.8,
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        generatedPreviews.push({
          pageNumber,
          image: canvas.toDataURL("image/jpeg", 0.8),
        });
      }

      setPreviews(generatedPreviews);
    } catch (err) {
      console.error("PDF preview error:", err);

      setError(
        "Unable to read this PDF. Please try another PDF file."
      );

      setFile(null);
      setPdfDoc(null);
      setPreviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // FILE INPUT
  // --------------------------------------------------
  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }

    event.target.value = "";
  };

  // --------------------------------------------------
  // DRAG & DROP
  // --------------------------------------------------
  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // --------------------------------------------------
  // REMOVE FILE
  // --------------------------------------------------
  const removeFile = () => {
    setFile(null);
    setPdfDoc(null);
    setPreviews([]);
    setError("");
  };

  // --------------------------------------------------
  // DOWNLOAD SINGLE JPG
  // --------------------------------------------------
  const downloadImage = (dataUrl, pageNumber) => {
    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = `pdfsnap-page-${pageNumber}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --------------------------------------------------
  // GENERATE ALL JPG
  // --------------------------------------------------
  const generateJPGs = async () => {
    if (!pdfDoc) {
      setError("Please upload a PDF first.");
      return;
    }

    setConverting(true);
    setError("");

    try {
      let imageQuality = 0.92;

      if (quality === "medium") {
        imageQuality = 0.82;
      }

      if (quality === "low") {
        imageQuality = 0.7;
      }

      for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
        const page = await pdfDoc.getPage(pageNumber);

        const viewport = page.getViewport({
          scale,
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", {
          alpha: false,
        });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const jpgData = canvas.toDataURL(
          "image/jpeg",
          imageQuality
        );

        downloadImage(jpgData, pageNumber);

        // Small delay so browser doesn't block multiple downloads
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch (err) {
      console.error("JPG conversion error:", err);
      setError("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  // --------------------------------------------------
  // FORMAT FILE SIZE
  // --------------------------------------------------
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Hero */}
      <section className="pt-28 pb-10 px-4">
        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-5">
            <ImageIcon className="w-4 h-4" />
            Free PDF Converter
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            PDF to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              JPG
            </span>
          </h1>

          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Convert PDF pages into high-quality JPG images quickly and easily.
            Free, secure and no watermark.
          </p>

        </div>
      </section>

      {/* Main Tool */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">

          {/* Upload Area */}
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-4 md:p-6"
            >
              <div className="border-2 border-dashed border-slate-300 rounded-2xl min-h-[340px] flex flex-col items-center justify-center text-center px-6 hover:border-blue-500 hover:bg-blue-50/30 transition-all">

                <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <Upload className="w-9 h-9 text-blue-600" />
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  Upload your PDF
                </h2>

                <p className="mt-2 text-slate-500">
                  Drag & drop your PDF here or select a file
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  PDF files only • Maximum 50MB
                </p>

                <label className="mt-7 cursor-pointer inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all">
                  <Upload className="w-5 h-5" />
                  Select PDF

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </label>

              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">

              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />

              <p className="mt-4 font-semibold text-slate-700">
                Preparing PDF preview...
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Please wait a moment
              </p>

            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Uploaded File */}
          {file && !loading && (
            <div className="space-y-6">

              {/* File Header */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div className="flex items-center gap-4 min-w-0">

                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">
                        {file.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {formatFileSize(file.size)} •{" "}
                        {previews.length}{" "}
                        {previews.length === 1 ? "page" : "pages"}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={removeFile}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>

                </div>

              </div>

              {/* Preview */}
              {previews.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-7 shadow-sm">

                  <div className="flex items-center justify-between mb-5">

                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        PDF Preview
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Preview of all PDF pages
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Ready
                    </div>

                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                    {previews.map((preview) => (
                      <div
                        key={preview.pageNumber}
                        className="group bg-slate-50 border border-slate-200 rounded-xl p-2 hover:border-blue-400 hover:shadow-md transition-all"
                      >

                        <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden border border-slate-100">
                          <img
                            src={preview.image}
                            alt={`PDF page ${preview.pageNumber}`}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex items-center justify-between mt-2 px-1">

                          <span className="text-xs font-semibold text-slate-500">
                            Page {preview.pageNumber}
                          </span>

                          <button
                            onClick={() =>
                              downloadImage(
                                preview.image,
                                preview.pageNumber
                              )
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Download preview"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )}

              {/* Settings */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-7 shadow-sm">

                <h2 className="text-xl font-bold text-slate-800">
                  JPG Settings
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Choose image quality and resolution.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                  {/* Quality */}
                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Image Quality
                    </label>

                    <div className="grid grid-cols-3 gap-2">

                      {[
                        {
                          value: "low",
                          label: "Low",
                          desc: "Smaller",
                        },
                        {
                          value: "medium",
                          label: "Medium",
                          desc: "Balanced",
                        },
                        {
                          value: "high",
                          label: "High",
                          desc: "Best",
                        },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setQuality(item.value)}
                          className={`rounded-xl border px-3 py-3 text-center transition-all ${
                            quality === item.value
                              ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                          }`}
                        >
                          <div className="font-semibold text-sm">
                            {item.label}
                          </div>

                          <div className="text-xs mt-1 opacity-70">
                            {item.desc}
                          </div>
                        </button>
                      ))}

                    </div>

                  </div>

                  {/* Resolution */}
                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Image Resolution
                    </label>

                    <select
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    >
                      <option value={1.5}>Standard</option>
                      <option value={2}>High Quality</option>
                      <option value={2.5}>Very High Quality</option>
                      <option value={3}>Ultra Quality</option>
                    </select>

                  </div>

                </div>

              </div>

              {/* Generate Button */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-1 shadow-xl shadow-blue-500/20">

                <button
                  onClick={generateJPGs}
                  disabled={converting || !pdfDoc}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >

                  {converting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating JPGs...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6" />
                      Generate JPG Images
                    </>
                  )}

                </button>

              </div>

              <p className="text-center text-sm text-slate-400">
                Your PDF is processed directly in your browser. No files are
                uploaded to our server.
              </p>

            </div>
          )}

        </div>
      </section>

    </main>
  );
}