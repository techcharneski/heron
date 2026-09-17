export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export interface RecommendedTool {
  name: string;
  url: string;
  label: string;
}

export const RECOMMENDED_OPTIMIZATION_TOOLS: RecommendedTool[] = [
  { name: "TinyPNG", label: "🌐 TinyPNG / TinyJPG", url: "https://tinypng.com" },
  { name: "iLoveIMG", label: "🌐 iLoveIMG Compressor", url: "https://www.iloveimg.com/pt/comprimir-imagem" },
  { name: "Squoosh", label: "🌐 Squoosh (Google)", url: "https://squoosh.app" },
  { name: "CompressJPEG", label: "🌐 CompressJPEG", url: "https://compressjpeg.com/pt/" },
];

export interface FileValidationError {
  title: string;
  message: string;
  sizeInMB: string;
  recommendations: RecommendedTool[];
}

export function validateFileSize(file: File): FileValidationError | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      title: `O arquivo "${file.name}" excede o limite máximo de 4 MB (${sizeMB} MB).`,
      message: `Imagens e arquivos muito grandes deixam o site lento. Por favor, otimize ou comprima o arquivo antes de realizar o upload.`,
      sizeInMB: sizeMB,
      recommendations: RECOMMENDED_OPTIMIZATION_TOOLS,
    };
  }
  return null;
}
