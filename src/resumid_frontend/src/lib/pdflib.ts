import * as pdfjsLib from 'pdfjs-dist';

const pdfDefaultOptions = (pdfjsLib as any).GlobalWorkerOptions;
pdfDefaultOptions.workerSrc = 'pdf.worker.min.mjs'

export { pdfjsLib };
