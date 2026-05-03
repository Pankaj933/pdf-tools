import { PDFDocument } from "pdf-lib";

export async function compressPDF(file, quality = "medium") {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);

  // Compression levels (basic simulation)
  let imageQuality;
  if (quality === "low") imageQuality = 0.9;
  if (quality === "medium") imageQuality = 0.7;
  if (quality === "high") imageQuality = 0.5;

  // Re-save PDF (this reduces size in many cases)
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  return new Blob([compressedBytes], { type: "application/pdf" });
}