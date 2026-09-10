"use client";

import { useCallback, useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function EditPdfPage() {
  const [file, setFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [annotations, setAnnotations] = useState([]);
  const [wordEdits, setWordEdits] = useState({});
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const loadPdf = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDownloaded(false);
    setFile(null);
    setPdfDocument(null);
    setPages([]);
    setAnnotations([]);
    setWordEdits({});
    setSelectedWordId(null);

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
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
      const pagePreviews = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = window.document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: context, viewport }).promise;

        const textContent = await page.getTextContent();
        const words = textContent.items.flatMap((item, itemIndex) => {
          if (!item.str?.trim() || !item.width) return [];

          const parts = item.str.trim().split(/\s+/);
          const totalCharacters = parts.reduce((sum, part) => sum + part.length, 0);
          let characterOffset = 0;

          return parts.map((part, wordIndex) => {
            const wordWidth = (item.width * part.length) / totalCharacters;
            const wordX = viewport.convertToViewportPoint(
              item.transform[4] + (item.width * characterOffset) / totalCharacters,
              item.transform[5]
            )[0];
            const wordTop = viewport.height - viewport.convertToViewportPoint(
              item.transform[4],
              item.transform[5]
            )[1] - Math.abs(item.transform[3] || item.transform[0] || 12);
            const wordHeight = Math.abs(item.transform[3] || item.transform[0] || 12);
            const word = {
              id: `${pageNumber}-${itemIndex}-${wordIndex}`,
              text: part,
              x: (wordX / viewport.width) * 100,
              y: (wordTop / viewport.height) * 100,
              width: (wordWidth / viewport.width) * 100,
              height: (wordHeight / viewport.height) * 100,
              pdfX: item.transform[4] + (item.width * characterOffset) / totalCharacters,
              pdfY: item.transform[5],
              pdfWidth: wordWidth / viewport.scale,
              pdfHeight: wordHeight / viewport.scale,
              fontSize: Math.max(8, wordHeight / viewport.scale),
            };
            characterOffset += part.length;
            return word;
          });
        });

        pagePreviews.push({
          pageNumber,
          preview: canvas.toDataURL("image/jpeg", 0.86),
          width: viewport.width,
          height: viewport.height,
          words,
        });
      }

      setFile(selectedFile);
      setPdfDocument(pdf);
      setPages(pagePreviews);
      setSelectedPage(1);
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

  const addAnnotation = () => {
    const trimmedText = text.trim();
    if (!trimmedText || !pages.length) return;

    setAnnotations((currentAnnotations) => [
      ...currentAnnotations,
      {
        id: `${Date.now()}-${currentAnnotations.length}`,
        pageNumber: selectedPage,
        text: trimmedText,
        fontSize: Number(fontSize),
        x: 12,
        y: 18 + currentAnnotations.filter((item) => item.pageNumber === selectedPage).length * 9,
      },
    ]);
    setText("");
    setDownloaded(false);
  };

  const removeAnnotation = (annotationId) => {
    setAnnotations((currentAnnotations) =>
      currentAnnotations.filter((annotation) => annotation.id !== annotationId)
    );
    setDownloaded(false);
  };

  const updateSelectedWord = (value) => {
    if (!selectedWordId) return;
    setWordEdits((currentEdits) => ({ ...currentEdits, [selectedWordId]: value }));
    setDownloaded(false);
  };

  const removeFile = () => {
    setFile(null);
    setPdfDocument(null);
    setPages([]);
    setAnnotations([]);
    setWordEdits({});
    setSelectedWordId(null);
    setError("");
    setDownloaded(false);
  };

  const downloadEditedPdf = async () => {
    if (!file || (!annotations.length && !Object.keys(wordEdits).length) || saving) return;

    setSaving(true);
    setError("");
    setDownloaded(false);

    try {
      const document = await PDFDocument.load(await file.arrayBuffer());
      const font = await document.embedFont(StandardFonts.Helvetica);

      pages.forEach((pageData, pageIndex) => {
        const page = document.getPage(pageIndex);
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const scale = pageData.width / pageWidth;

        pageData.words.forEach((word) => {
          const editedText = wordEdits[word.id];
          if (editedText === undefined || editedText === word.text) return;

          const x = word.pdfX / scale;
          const y = pageHeight - (word.pdfY / scale) - word.pdfHeight;
          page.drawRectangle({
            x: Math.max(0, x - 1),
            y: Math.max(0, y - 1),
            width: word.pdfWidth + 2,
            height: word.pdfHeight + 3,
            color: rgb(1, 1, 1),
          });
          if (editedText.trim()) {
            page.drawText(editedText, {
              x,
              y,
              size: word.fontSize,
              font,
              color: rgb(0.08, 0.12, 0.2),
            });
          }
        });
      });

      annotations.forEach((annotation) => {
        const page = document.getPage(annotation.pageNumber - 1);
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const preview = pages[annotation.pageNumber - 1];
        const x = (annotation.x / 100) * pageWidth;
        const y = pageHeight - (annotation.y / 100) * pageHeight;
        const scale = pageWidth / preview.width;

        page.drawText(annotation.text, {
          x,
          y,
          size: annotation.fontSize * scale,
          font,
          color: rgb(0.08, 0.2, 0.45),
        });
      });

      const output = await document.save();
      const url = URL.createObjectURL(new Blob([output], { type: "application/pdf" }));
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, "")}-edited.pdf`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (saveError) {
      console.error("PDF editing error:", saveError);
      setError("Could not create the edited PDF. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const activePage = pages[selectedPage - 1];
  const activeAnnotations = annotations.filter((annotation) => annotation.pageNumber === selectedPage);
  const selectedWord = activePage?.words.find((word) => word.id === selectedWordId);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            <Pencil className="h-4 w-4" />
            Free PDF Editor
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Edit <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Click any detected word to edit it, or add new text to the selected page.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          {!file && !loading && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-indigo-500 hover:bg-indigo-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50"><Upload className="h-9 w-9 text-indigo-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your PDF here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">PDF files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
                  <Upload className="h-5 w-5" />
                  Select PDF
                  <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" /><p className="mt-4 font-semibold text-slate-700">Preparing PDF pages...</p><p className="mt-1 text-sm text-slate-400">Generating editable previews</p></div>}
          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}

          {file && !loading && activePage && (
            <div className="space-y-6">
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50"><FileText className="h-6 w-6 text-red-500" /></div><div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{pages.length} {pages.length === 1 ? "page" : "pages"}</p></div></div>
                <button onClick={removeFile} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-sm md:p-6">
                  <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-lg bg-white shadow-lg">
                    <img src={activePage.preview} alt={`PDF page ${selectedPage}`} className="block max-h-[700px] max-w-full" />
                    {activePage.words.map((word) => (
                      <button
                        key={word.id}
                        type="button"
                        onClick={() => setSelectedWordId(word.id)}
                        title={`Edit: ${wordEdits[word.id] ?? word.text}`}
                        className={`absolute overflow-hidden rounded-sm border px-0.5 text-left leading-none transition ${selectedWordId === word.id ? "z-10 border-indigo-500 bg-indigo-100/90 text-indigo-900 ring-2 ring-indigo-300" : "border-transparent bg-transparent text-transparent hover:border-indigo-300 hover:bg-indigo-50/60"}`}
                        style={{ left: `${word.x}%`, top: `${word.y}%`, width: `${Math.max(word.width, 1.5)}%`, height: `${Math.max(word.height, 1.5)}%` }}
                      >
                        {wordEdits[word.id] ?? word.text}
                      </button>
                    ))}
                    {activeAnnotations.map((annotation) => <span key={annotation.id} className="absolute whitespace-nowrap rounded bg-indigo-100/90 px-1 text-indigo-900" style={{ left: `${annotation.x}%`, top: `${annotation.y}%`, fontSize: `${Math.max(11, annotation.fontSize * 0.75)}px` }}>{annotation.text}</span>)}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2"><button disabled={selectedPage === 1} onClick={() => setSelectedPage((page) => page - 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="min-w-24 text-center text-sm font-semibold text-slate-600">Page {selectedPage} of {pages.length}</span><button disabled={selectedPage === pages.length} onClick={() => setSelectedPage((page) => page + 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Next</button></div>
                </div>

                <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div><h2 className="font-bold text-slate-800">Edit PDF text</h2><p className="mt-1 text-sm leading-6 text-slate-500">Click a word in the preview to replace it, or add new text below.</p></div>
                  {selectedWord && <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3"><label className="block text-sm font-semibold text-indigo-900">Selected word<input autoFocus value={wordEdits[selectedWord.id] ?? selectedWord.text} onChange={(event) => updateSelectedWord(event.target.value)} className="mt-2 w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 font-normal text-slate-800 outline-none focus:border-indigo-500" /></label><button type="button" onClick={() => setSelectedWordId(null)} className="mt-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900">Done editing word</button></div>}
                  <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Type your text..." rows={4} className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  <label className="block text-sm font-semibold text-slate-600">Font size<input type="number" min="8" max="48" value={fontSize} onChange={(event) => setFontSize(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-indigo-500" /></label>
                  <button onClick={addAnnotation} disabled={!text.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="h-4 w-4" />Add to page {selectedPage}</button>
                  {activeAnnotations.length > 0 && <div className="border-t border-slate-100 pt-4"><h3 className="text-sm font-bold text-slate-700">On this page</h3><div className="mt-3 space-y-2">{activeAnnotations.map((annotation) => <div key={annotation.id} className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="break-words text-slate-600">{annotation.text}</span><button onClick={() => removeAnnotation(annotation.id)} title="Remove annotation" className="shrink-0 text-slate-400 transition hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>}
                </aside>
              </div>

              <button onClick={downloadEditedPdf} disabled={saving || (!annotations.length && !Object.keys(wordEdits).length)} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60">{saving ? <><Loader2 className="h-6 w-6 animate-spin" />Creating edited PDF...</> : <><Download className="h-6 w-6" />Download edited PDF</>}</button>
              {downloaded && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Download started successfully.</div>}
              <p className="text-center text-sm text-slate-400">Your PDF is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}