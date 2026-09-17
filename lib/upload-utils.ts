export const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB para Imagens
export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB para PDFs

export interface RecommendedTool {
  name: string;
  url: string;
  label: string;
}

export const RECOMMENDED_IMAGE_OPTIMIZATION_TOOLS: RecommendedTool[] = [
  { name: "TinyPNG", label: "🌐 TinyPNG / TinyJPG", url: "https://tinypng.com" },
  { name: "iLoveIMG", label: "🌐 iLoveIMG Compressor", url: "https://www.iloveimg.com/pt/comprimir-imagem" },
  { name: "Squoosh", label: "🌐 Squoosh (Google)", url: "https://squoosh.app" },
  { name: "CompressJPEG", label: "🌐 CompressJPEG", url: "https://compressjpeg.com/pt/" },
];

export const RECOMMENDED_PDF_OPTIMIZATION_TOOLS: RecommendedTool[] = [
  { name: "iLovePDF", label: "🌐 iLovePDF (Comprimir PDF)", url: "https://www.ilovepdf.com/pt/comprimir_pdf" },
  { name: "Smallpdf", label: "🌐 Smallpdf Compressor", url: "https://smallpdf.com/pt/compress-pdf" },
  { name: "PDF24", label: "🌐 PDF24 Tools", url: "https://tools.pdf24.org/pt/comprimir-pdf" },
  { name: "Adobe", label: "🌐 Adobe Acrobat Online", url: "https://www.adobe.com/br/acrobat/online/compress-pdf.html" },
];

export interface FileValidationError {
  title: string;
  message: string;
  sizeInMB: string;
  isPdf: boolean;
  maxAllowedMB: number;
  recommendations: RecommendedTool[];
}

export function isPdf(filename: string, mimetype?: string | null): boolean {
  if (mimetype === "application/pdf") return true;
  return filename.toLowerCase().endsWith(".pdf");
}

export function validateFileSize(file: File): FileValidationError | null {
  const fileIsPdf = isPdf(file.name, file.type);
  const maxAllowedBytes = fileIsPdf ? MAX_PDF_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  const maxAllowedMB = fileIsPdf ? 10 : 4;

  if (file.size > maxAllowedBytes) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const recommendations = fileIsPdf
      ? RECOMMENDED_PDF_OPTIMIZATION_TOOLS
      : RECOMMENDED_IMAGE_OPTIMIZATION_TOOLS;

    return {
      title: `O arquivo "${file.name}" excede o limite máximo de ${maxAllowedMB} MB (${sizeMB} MB).`,
      message: fileIsPdf
        ? `Documentos PDF muito pesados dificultam a navegação. Por favor, comprima seu PDF antes do upload.`
        : `Imagens muito pesadas deixam o site lento. Por favor, otimize ou comprima a imagem antes do upload.`,
      sizeInMB: sizeMB,
      isPdf: fileIsPdf,
      maxAllowedMB,
      recommendations,
    };
  }
  return null;
}
