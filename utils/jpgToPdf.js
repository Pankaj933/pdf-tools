import { PDFDocument } from "pdf-lib";

export async function imagesToPDF(files) {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();

    let image;
    if (file.type === "image/jpeg") {
      image = await pdfDoc.embedJpg(bytes);
    } else {
      image = await pdfDoc.embedPng(bytes);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}