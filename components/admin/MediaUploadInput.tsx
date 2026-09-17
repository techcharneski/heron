"use client";

import { useState } from "react";
import {
  validateFileSize,
  FileValidationError,
  RECOMMENDED_OPTIMIZATION_TOOLS,
} from "@/lib/upload-utils";
import MediaPickerModal from "./MediaPickerModal";

interface MediaUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  type?: "image" | "pdf" | "auto";
}

export default function MediaUploadInput({
  label,
  value,
  onChange,
  accept = "image/*,.pdf",
  placeholder = "/uploads/arquivo.png",
  type = "auto",
}: MediaUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<FileValidationError | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleUpload = async (file: File) => {
    setError(null);
    setSizeError(null);

    // Validação prévia de tamanho no cliente (Limite: 4MB)
    const validationErr = validateFileSize(file);
    if (validationErr) {
      setSizeError(validationErr);
      return;
    }

    setUploading(true);

    try {
      // 1. Obter Signed URL do Supabase Storage
      const signedRes = await fetch("/api/admin/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          fileSize: file.size,
        }),
      });

      let signedData: any = null;
      if (signedRes.ok) {
        signedData = await signedRes.json().catch(() => null);
      }

      if (signedData?.signedUrl && signedData?.publicUrl) {
        // Upload direto do navegador para o Supabase Storage
        const uploadRes = await fetch(signedData.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        if (uploadRes.ok) {
          onChange(signedData.publicUrl);
          setUploading(false);
          return;
        }
      }

      // 2. Fallback: upload tradicional via API rota /api/admin/upload
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(
            "O arquivo é muito grande para o servidor. Limite máximo: 4 MB. Por favor, otimize e comprima a imagem antes de fazer o upload."
          );
        }

        let errorMessage = "Erro no upload";
        try {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            errorMessage = data.error || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar upload do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const isImage =
    type === "image" ||
    (type === "auto" &&
      value &&
      (value.endsWith(".jpg") ||
        value.endsWith(".jpeg") ||
        value.endsWith(".png") ||
        value.endsWith(".webp") ||
        value.endsWith(".gif") ||
        value.endsWith(".svg") ||
        value.includes("/images/")));

  return (
    <div className="space-y-3 bg-gray-50 p-4 border border-gray-200">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
          {label}
        </label>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="text-xs font-bold text-brand-navy hover:text-brand-gold bg-white px-2.5 py-1 border border-gray-300 hover:border-brand-gold transition-all uppercase tracking-wider flex items-center gap-1 shadow-2xs"
          >
            <span>🖼️</span> Selecionar Existente
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[11px] text-red-600 hover:text-red-800 font-bold uppercase"
            >
              ✕ Remover
            </button>
          )}
        </div>
      </div>

      {/* Main Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.[0]) {
            handleUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`border-2 border-dashed p-4 transition-all text-center flex flex-col items-center justify-center gap-2.5 ${
          dragOver
            ? "border-brand-gold bg-brand-gold/10"
            : "border-gray-300 bg-white hover:border-brand-gold/60"
        }`}
      >
        <input
          type="file"
          accept={accept}
          id={`upload_${label.replace(/\s+/g, "_")}`}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
          disabled={uploading}
          className="hidden"
        />

        <label
          htmlFor={`upload_${label.replace(/\s+/g, "_")}`}
          className="cursor-pointer w-full flex flex-col items-center gap-1"
        >
          {uploading ? (
            <div className="py-2 flex items-center gap-2 text-xs font-bold text-brand-navy">
              <span className="animate-spin">⏳</span>
              <span>Enviando arquivo para o servidor...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                <span className="text-base">📁</span>
                <span>Clique para selecionar novo arquivo ou arraste aqui</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                Tamanho máximo: <strong className="text-red-600">4 MB</strong> (Imagens e PDFs)
              </span>
            </>
          )}
        </label>

        <div className="pt-2 border-t border-gray-100 w-full flex items-center justify-center">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="text-xs font-bold text-brand-navy hover:text-brand-gold underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>✨ Ou clique aqui para escolher de mídias já enviadas</span>
          </button>
        </div>
      </div>

      {/* Alerta de erro de tamanho (maior que 4MB) com sugestões de otimização */}
      {sizeError && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 space-y-2 text-xs">
          <div className="flex items-start gap-2 font-bold text-red-700">
            <span className="text-sm">⚠️</span>
            <span>{sizeError.title}</span>
          </div>
          <p className="text-[11px] text-gray-700">
            {sizeError.message}
          </p>
          <div className="pt-2 border-t border-amber-200/80">
            <span className="font-bold text-[10px] uppercase tracking-wider block text-brand-navy mb-1.5">
              💡 Recomendação: Otimize sua imagem gratuitamente nestes sites:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {RECOMMENDED_OPTIMIZATION_TOOLS.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-white border border-amber-300 text-brand-navy text-[10px] font-bold hover:bg-brand-navy hover:text-white transition-colors"
                >
                  {tool.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Outros erros genéricos */}
      {error && !sizeError && (
        <p className="text-[11px] text-red-600 font-medium bg-red-50 p-2 border border-red-200">
          ⚠️ {error}
        </p>
      )}

      {/* Manual Input / Result Preview */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 text-xs border border-gray-300 bg-white font-mono"
        />
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="px-3 py-2 bg-gray-200 text-brand-navy text-[11px] font-bold uppercase tracking-wider shrink-0 hover:bg-brand-navy hover:text-white transition-all flex items-center gap-1"
          title="Escolher das mídias existentes"
        >
          <span>🖼️ Biblioteca</span>
        </button>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider shrink-0 hover:bg-brand-gold hover:text-brand-navy transition-all"
          >
            ↗ Ver
          </a>
        )}
      </div>

      {/* Live Thumbnail Preview if Image */}
      {isImage && value && (
        <div className="pt-2 flex items-center gap-3">
          <div className="w-16 h-16 border border-gray-300 bg-white p-1 overflow-hidden shadow-xs shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <span className="text-[11px] text-emerald-700 font-mono">
            ✓ Mídia selecionada e pronta para publicação
          </span>
        </div>
      )}

      {/* Modal Seletor de Mídias Existentes */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange(url)}
        filterType={type}
      />
    </div>
  );
}
