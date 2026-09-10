import PDFDocument, { registerStdFonts } from "../node_modules/pdfkit/js/pdfkit.browser.mjs";
import Helvetica from "../node_modules/pdfkit/js/standard-fonts/Helvetica.mjs";

registerStdFonts(Helvetica);

export { PDFDocument };
export default PDFDocument;
