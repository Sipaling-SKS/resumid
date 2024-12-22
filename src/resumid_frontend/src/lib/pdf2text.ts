import { pdfjsLib } from "./pdflib";

export async function extractPDFContent(file: File): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ url: URL.createObjectURL(file) }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent({
      disableNormalization: true,
    });

    const lines: string[] = [];
    let lastY: number | null = null;
    
    content.items.forEach((item: any) => {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 10) {
        lines.push(' ');
      }
      lines.push(item.str);
      lastY = item.transform[5];
    });

    fullText += lines.join(' ')
  }

  fullText = fullText
    .replace(/[^\x00-\x7F]\s*/g, ' ') // Remove non-ASCII characters
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/ {2,}/g, ' ')          // Replace multiple spaces with a single space
    .replace(/\n{3,}/g, '\n\n')      // Reduce excessive new lines (keep at most 2 consecutive)
    .trimEnd();                      // Remove only trailing spaces or new lines at the end

  return fullText;
}

export function cleanExtractedText(rawText: string): string {
  // Replace multiple spaces with a single space
  let cleanedText = rawText.replace(/ +/g, ' ');

  // Replace unwanted newlines within sentences or words
  cleanedText = cleanedText.replace(/(\S)\n(\S)/g, '$1 $2'); // Merge words split by newlines

  // Remove leading spaces at the start of lines
  cleanedText = cleanedText.replace(/^\s+/gm, '');

  // Collapse multiple consecutive newlines into a single newline
  cleanedText = cleanedText.replace(/\n{2,}/g, '\n\n');

  // Trim spaces and newlines from the start and end of the text
  cleanedText = cleanedText.trim();

  return cleanedText;
}