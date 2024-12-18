import * as pdfjsLib from 'pdfjs-dist';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs`;
export { pdfjsLib };