"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  FileText,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  Upload,
  Wand2,
  X,
} from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function formatSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function AiPdfSummaryPage() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setCopied(false);

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setSummary("");
      setKeywords([]);
      setAnswer("");
      setQuestion("");
      setError("Please upload a valid PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setSummary("");
      setKeywords([]);
      setAnswer("");
      setQuestion("");
      setError("Maximum file size is 20MB. Please upload a smaller PDF.");
      return;
    }

    setFile(selectedFile);
    setSummary("");
    setKeywords([]);
    setAnswer("");
    setQuestion("");
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const submitRequest = async ({ mode, customQuestion }) => {
    if (!file) return;

    if (mode === "chat" && !customQuestion?.trim()) {
      setError("Please enter a question about the PDF.");
      return;
    }

    const requestMode = mode === "chat" ? "chat" : "summary";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", requestMode);
    if (customQuestion) formData.append("question", customQuestion.trim());

    if (mode === "summary") {
      setLoading(true);
    } else {
      setChatLoading(true);
    }

    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to process the PDF.");
      }

      setSummary(data.summary || "");
      setKeywords(data.keywords || []);

      if (mode === "chat") {
        setAnswer(data.answer || "The PDF does not mention this.");
      }
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "The PDF could not be processed.");
    } finally {
      if (mode === "summary") setLoading(false);
      if (mode === "chat") setChatLoading(false);
    }
  };

  const handleGenerateSummary = () => submitRequest({ mode: "summary" });
  const handleAskQuestion = () => submitRequest({ mode: "chat", customQuestion: question });

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch (copyError) {
      console.error(copyError);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setSummary("");
    setKeywords([]);
    setQuestion("");
    setAnswer("");
    setError("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-10 pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
            <Sparkles className="h-4 w-4" />
            AI PDF Tool
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            AI <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">PDF Summary & Q&A</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Upload a PDF, get a quick summary, and ask questions about the document using AI.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl space-y-6">
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 md:p-6"
            >
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center transition hover:border-purple-500 hover:bg-purple-50/30">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50">
                  <Upload className="h-9 w-9 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Upload your PDF</h2>
                <p className="mt-2 text-slate-500">Drag and drop your file here or choose a PDF</p>
                <p className="mt-2 text-sm text-slate-400">PDF documents only, up to 20MB</p>
                <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700">
                  <Upload className="h-5 w-5" />
                  Select PDF
                  <input type="file" accept="application/pdf,.pdf" onChange={handleInputChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
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
                    <p className="mt-1 text-sm text-slate-500">{formatSize(file.size)} • Ready for AI summary</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-purple-500/20 transition hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Summarizing PDF...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-6 w-6" />
                      Generate summary
                    </>
                  )}
                </button>
              </div>

              {keywords.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800">Key insights</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {summary && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-800">Summary</h3>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="leading-8 text-slate-600 whitespace-pre-line">{summary}</p>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                  <MessageSquareText className="h-5 w-5 text-purple-600" />
                  Ask about this PDF
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask a question like: What are the main findings?"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-purple-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAskQuestion}
                    disabled={chatLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {chatLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Asking...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Ask AI
                      </>
                    )}
                  </button>
                </div>

                {answer && (
                  <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 p-4 text-slate-700">
                    <p className="text-sm font-semibold uppercase tracking-wide text-purple-700">AI Answer</p>
                    <p className="mt-2 leading-7 whitespace-pre-line">{answer}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
