/**
 * PDF Text Extractor
 * Uses pdfjs-dist in the browser to extract plain text from uploaded PDF files.
 */
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker for Vite/modern ES module environments
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useWorkerFetch: true,
  });

  const pdf = await loadingTask.promise;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter((str: string) => str.trim().length > 0);

    pageTexts.push(strings.join(' '));
  }

  const fullText = pageTexts.join('\n\n');
  return fullText.trim();
}
