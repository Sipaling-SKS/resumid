import * as pdfjsLib from 'pdfjs-dist';

// const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs')

const pdfDefaultOptions = (pdfjsLib as any).GlobalWorkerOptions;
pdfDefaultOptions.workerSrc = 'pdf.worker.min.mjs'

export { pdfjsLib };

