import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const runtime = "nodejs";

if (typeof window === "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "../../../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
}

const stopWords = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "for", "to",
  "of", "in", "on", "at", "by", "with", "is", "are", "was", "were", "be",
  "been", "being", "it", "its", "this", "that", "these", "those", "from",
  "as", "into", "your", "you", "we", "they", "them", "their", "his", "her",
  "he", "she", "our", "about", "after", "before", "over", "under", "between",
  "through", "during", "within", "without", "will", "would", "should", "could",
  "may", "can", "have", "has", "had", "do", "does", "did", "not", "no", "yes",
  "also", "more", "most", "some", "such", "than", "very", "much", "too", "all",
  "each", "every", "any", "where", "when", "why", "what", "how", "who", "which",
  "while", "there", "here", "make", "made", "using", "used", "use", "one", "two",
  "three",
]);

function extractKeywords(text) {
  const words = (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(
    (word) => word.length > 3 && !stopWords.has(word)
  );

  const counts = new Map();
  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function buildLocalSummary(text) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "No readable text was found in the PDF. Please upload a document with selectable text.";
  }

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return normalized.length > 700 ? `${normalized.slice(0, 700).trim()}...` : normalized;
  }

  const keywords = new Set(extractKeywords(normalized));
  const scored = sentences.map((sentence) => {
    const lower = sentence.toLowerCase();
    const keywordHits = [...keywords].filter((keyword) => lower.includes(keyword)).length;
    const lengthScore = sentence.split(" ").length;
    const score = keywordHits * 3 + Math.min(lengthScore, 35) / 10;
    return { sentence, score };
  });

  const summarySentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(4, sentences.length))
    .map((item) => item.sentence);

  const summary = summarySentences.join(" ");
  return summary.length > 700 ? `${summary.slice(0, 700).trim()}...` : summary;
}

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const pages = [];

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text) pages.push(text);
  }

  return pages.join(" ") || "";
}

async function callGemini({ apiKey, prompt }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API request failed.");
  }

  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("")
      .trim() || ""
  );
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const mode = formData.get("mode")?.toString() || "summary";
    const question = formData.get("question")?.toString()?.trim() || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
    }

    const text = await extractPdfText(file);
    if (!text.trim()) {
      return NextResponse.json({ error: "No readable text was found in the PDF." }, { status: 400 });
    }

    const localSummary = buildLocalSummary(text);
    const localKeywords = extractKeywords(text);

    if (mode === "chat") {
      if (!question) {
        return NextResponse.json({ error: "Please enter a question about the PDF." }, { status: 400 });
      }

      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({
          answer: "Gemini API key is not configured yet. Add GEMINI_API_KEY to your environment to enable AI Q&A.",
          summary: localSummary,
          keywords: localKeywords,
          source: "fallback",
        });
      }

      const answer = await callGemini({
        apiKey: process.env.GEMINI_API_KEY,
        prompt: `Answer the user's question strictly from the PDF content below. If the answer is not in the document, respond with: "The PDF does not mention this." Do not invent facts.\n\nPDF CONTENT:\n${text}\n\nQUESTION:\n${question}`,
      });

      return NextResponse.json({
        answer: answer || "The PDF does not mention this.",
        summary: localSummary,
        keywords: localKeywords,
        source: "gemini",
      });
    }

    if (process.env.GEMINI_API_KEY) {
      const summary = await callGemini({
        apiKey: process.env.GEMINI_API_KEY,
        prompt: `Summarize the following PDF content in a clear, structured way. Highlight the main idea, key points, and any important conclusions. Keep it concise but informative.\n\nPDF CONTENT:\n${text}`,
      });

      return NextResponse.json({
        summary: summary || localSummary,
        keywords: localKeywords,
        source: "gemini",
      });
    }

    return NextResponse.json({
      summary: localSummary,
      keywords: localKeywords,
      source: "fallback",
    });
  } catch (error) {
    console.error("AI summary request failed:", error);
    return NextResponse.json(
      { error: error.message || "Unable to process this PDF right now." },
      { status: 500 }
    );
  }
}
