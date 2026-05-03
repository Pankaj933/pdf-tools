import { PDFDocument } from "pdf-lib";

export async function splitPDF(file) {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);

  const totalPages = pdf.getPageCount();
  const splitFiles = [];

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);

    const pdfBytes = await newPdf.save();
    splitFiles.push(
      new Blob([pdfBytes], { type: "application/pdf" })
    );
  }

  return splitFiles;
}