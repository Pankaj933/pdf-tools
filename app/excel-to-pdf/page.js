"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ROWS_PER_PAGE = 34;
const MAX_COLUMNS = 10;

const sanitizePdfText = (value) =>
  String(value ?? "")
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
    .replace(/[^\x20-\x7E]/g, "?");

const formatCell = (value) => {
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "number") return value.toLocaleString();
  return String(value ?? "");
};

const readWorkbook = async (file) => {
  const workbook = XLSX.read(await file.arrayBuffer(), {
    cellDates: true,
    cellText: false,
  });
  const sheets = workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: true,
    })
      .map((row) => row.map(formatCell))
      .filter((row) => row.some((cell) => cell.trim()));

    return { name: sheetName, rows };
  }).filter((sheet) => sheet.rows.length);

  if (!sheets.length) throw new Error("The workbook does not contain data.");
  return sheets;
};

export default function ExcelToPDFPage() {
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setDownloaded(false);
    setFile(null);
    setSheets([]);

    const isSpreadsheet =
      selectedFile.name.toLowerCase().endsWith(".xlsx") ||
      selectedFile.name.toLowerCase().endsWith(".xls") ||
      selectedFile.type.includes("spreadsheet") ||
      selectedFile.type.includes("excel");

    if (!isSpreadsheet) {
      setError("Please select an XLSX or XLS spreadsheet.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Maximum file size is 50MB.");
      return;
    }

    setLoading(true);

    try {
      const workbookSheets = await readWorkbook(selectedFile);
      setFile(selectedFile);
      setSheets(workbookSheets);
    } catch (readError) {
      console.error("Spreadsheet read error:", readError);
      setError("Unable to read this spreadsheet. Please try another file.");
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
    setSheets([]);
    setDownloaded(false);
    setError("");
  };

  const createPdf = async () => {
    if (!sheets.length || converting) return;

    setConverting(true);
    setDownloaded(false);
    setError("");

    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

      sheets.forEach(({ name, rows }) => {
        for (let start = 0; start < rows.length; start += ROWS_PER_PAGE) {
          const page = pdf.addPage([792, 612]);
          const pageRows = rows.slice(start, start + ROWS_PER_PAGE);
          const columnCount = Math.min(
            MAX_COLUMNS,
            Math.max(...pageRows.map((row) => row.length), 1)
          );
          const columnWidth = 700 / columnCount;
          const rowHeight = 15;
          const tableTop = 548;

          page.drawText(sanitizePdfText(name), {
            x: 46,
            y: 570,
            size: 16,
            font: boldFont,
            color: rgb(0.06, 0.09, 0.15),
          });
          page.drawText(`Rows ${start + 1}-${Math.min(start + ROWS_PER_PAGE, rows.length)}`, {
            x: 650,
            y: 574,
            size: 8,
            font,
            color: rgb(0.35, 0.4, 0.47),
          });

          pageRows.forEach((row, rowIndex) => {
            const y = tableTop - rowIndex * rowHeight;
            const isHeader = start === 0 && rowIndex === 0;

            page.drawRectangle({
              x: 46,
              y: y - 3,
              width: 700,
              height: rowHeight,
              color: isHeader ? rgb(0.86, 0.94, 0.9) : rowIndex % 2 ? rgb(0.97, 0.98, 0.98) : rgb(1, 1, 1),
              borderColor: rgb(0.82, 0.86, 0.86),
              borderWidth: 0.35,
            });

            for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
              const cell = sanitizePdfText(row[columnIndex] || "");
              page.drawText(cell.slice(0, 42), {
                x: 50 + columnIndex * columnWidth,
                y,
                size: 7.5,
                font: isHeader ? boldFont : font,
                color: rgb(0.12, 0.16, 0.2),
                maxWidth: columnWidth - 8,
              });
            }
          });
        }
      });

      const pdfBytes = await pdf.save();
      saveAs(
        new Blob([pdfBytes], { type: "application/pdf" }),
        `${file.name.replace(/\.(xlsx|xls)$/i, "")}.pdf`
      );
      setDownloaded(true);
    } catch (conversionError) {
      console.error("Spreadsheet PDF generation error:", conversionError);
      setError("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const formatFileSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const previewRows = sheets[0]?.rows.slice(0, 8) || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            <FileSpreadsheet className="h-4 w-4" />
            Free Document Converter
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Excel to <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">PDF</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Convert Excel spreadsheets into clean, shareable PDF documents directly in your browser.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          {!file && !loading && (
            <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-green-500 hover:bg-green-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50"><Upload className="h-9 w-9 text-green-600" /></div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your spreadsheet</h2>
                <p className="mt-2 text-slate-500">Drag and drop your Excel file here or select a file</p>
                <p className="mt-2 text-sm text-slate-400">XLSX and XLS files only, maximum 50MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700">
                  <Upload className="h-5 w-5" />
                  Select spreadsheet
                  <input type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" /><p className="mt-4 font-semibold text-slate-700">Reading your spreadsheet...</p><p className="mt-1 text-sm text-slate-400">Preparing worksheet data</p></div>}
          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>}

          {file && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex min-w-0 items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50"><FileSpreadsheet className="h-6 w-6 text-green-600" /></div><div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{file.name}</h2><p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)} • {sheets.length} {sheets.length === 1 ? "worksheet" : "worksheets"}</p></div></div>
                <button type="button" onClick={removeFile} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" />Remove</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-800">Spreadsheet preview</h2><p className="mt-1 text-sm text-slate-500">Preview of the first worksheet. All populated worksheets will be included.</p></div><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" /></div>
                <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200"><table className="min-w-full text-left text-sm"><tbody>{previewRows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-slate-100 last:border-0">{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className="max-w-[220px] whitespace-nowrap px-4 py-3 text-slate-600">{cell || "-"}</td>)}</tr>)}</tbody></table></div>
              </div>

              <button type="button" onClick={createPdf} disabled={converting} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-green-500/20 transition hover:from-green-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {converting ? <><Loader2 className="h-6 w-6 animate-spin" />Creating PDF...</> : <><Download className="h-6 w-6" />Download PDF</>}
              </button>
              {downloaded && <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Download started successfully.</div>}
              <p className="text-center text-sm text-slate-400">Your spreadsheet is processed directly in your browser. No files are uploaded to our server.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
