"use client";

import { useState } from "react";
import JSZip from "jszip";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const extractDocxText = async (file) => {
  const archive = await JSZip.loadAsync(await file.arrayBuffer());
  const documentXml = await archive.file("word/document.xml")?.async("text");

  if (!documentXml) {
    throw new Error("DOCX content was not found.");
  }

  const xml = new DOMParser().parseFromString(documentXml, "application/xml");
  if (xml.querySelector("parsererror")) {
    throw new Error("DOCX content could not be read.");
  }

  const paragraphs = Array.from(xml.getElementsByTagName("w:p"))
    .map((paragraph) =>
      Array.from(paragraph.getElementsByTagName("w:t"))
        .map((textNode) => textNode.textContent || "")
        .join("")
        .trim()
    )
    .filter(Boolean);

  return paragraphs.join("\n\n");
};
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
    .replace(/[^\x20-\x7E\n\r\t]/g, "?");

const wrapText = (text, maxCharacters) =>
  text.split("\n").flatMap((line) => {
    if (!line.trim()) return [""];

    const words = line.split(/\s+/);
    const wrappedLines = [];
    let currentLine = "";

    words.forEach((word) => {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;
      if (nextLine.length > maxCharacters && currentLine) {
        wrappedLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = nextLine;
      }
    });

    if (currentLine) wrappedLines.push(currentLine);
    return wrappedLines;
  });

export default function WordToPDFPage() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDownloaded(false);
    setFile(null);
    setText("");

    if (!selectedFile.name.toLowerCase().endsWith(".docx")) {
      setError("Please select a DOCX file. Legacy DOC files are not supported.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Maximum file size is 50MB.");
      return;
    }

    setLoading(true);

    try {
      const extractedText = await extractDocxText(selectedFile);
      if (!extractedText) {
        setError("This Word document does not contain readable text.");
        return;
      }

      setFile(selectedFile);
      setText(extractedText);
    } catch (conversionError) {
      console.error("DOCX text extraction error:", conversionError);
      setError("Unable to read this Word document. Please try another DOCX file.");
    } finally {
      setLoading(false);
    }
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
    setText("");
    setDownloaded(false);
    setError("");
  };

  const createPdf = async () => {
    if (!text || converting) return;

    setConverting(true);
    setDownloaded(false);
    setError("");

    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const lines = wrapText(sanitizePdfText(text), 92);
      const linesPerPage = 44;

      for (let index = 0; index < lines.length; index += linesPerPage) {
        const page = pdf.addPage([612, 792]);
        const pageLines = lines.slice(index, index + linesPerPage);
        let y = 738;

        if (index === 0) {
          page.drawText(sanitizePdfText(file.name.replace(/\.docx$/i, "")), {
            x: 54,
            y,
            size: 20,
            font: titleFont,
            color: rgb(0.06, 0.09, 0.15),
          });
          y -= 38;
        }

        pageLines.forEach((line) => {
          if (line) {
            page.drawText(line, {
              x: 54,
              y,
              size: 11,
              font,
              color: rgb(0.12, 0.16, 0.22),
            });
          }
          y -= 15;
        });
      }

      const pdfBytes = await pdf.save();
      saveAs(
        new Blob([pdfBytes], { type: "application/pdf" }),
        `${file.name.replace(/\.docx$/i, "")}.pdf`
      );
      setDownloaded(true);
    } catch (conversionError) {
      console.error("PDF generation error:", conversionError);
      setError("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <FileText className="h-4 w-4" />
            Free Document Converter
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Word to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Convert DOCX documents into clean PDF files directly in your browser.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          {!file && !loading && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-blue-500 hover:bg-blue-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50"><Upload className="h-9 w-9 text-blue-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your Word document</h2>
                <p className="mt-2 text-slate-500">Drag and drop your DOCX file here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">DOCX files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                  <Upload className="h-5 w-5" />
                  Select DOCX
                  <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /><p className="mt-4 font-semibold text-slate-700">Reading your document...</p><p className="mt-1 text-sm text-slate-400">Preparing PDF content</p></div>}
          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}

          {file && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50"><FileText className="h-6 w-6 text-blue-600" /></div><div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)} • Ready to convert</p></div></div>
                <button type="button" onClick={removeFile} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-800">Document preview</h2><p className="mt-1 text-sm text-slate-500">Text extracted locally from your Word document.</p></div><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" /></div>
                <div className="mt-5 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">{text.slice(0, 2400)}{text.length > 2400 ? "\n…" : ""}</div>
              </div>

              <button type="button" onClick={createPdf} disabled={converting} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/20 transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60">
                {converting ? <><Loader2 className="h-6 w-6 animate-spin" />Creating PDF...</> : <><Download className="h-6 w-6" />Download PDF</>}
              </button>
              {downloaded && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Download started successfully.</div>}
              <p className="text-center text-sm text-slate-400">Your document is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
