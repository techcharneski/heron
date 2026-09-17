"use client";

import { useState } from "react";

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

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // 1. Obter Signed URL do Supabase Storage para evitar limites de payload (4.5MB) da Vercel
      const signedRes = await fetch("/api/admin/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
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
            "O arquivo é muito grande (máximo 4.5 MB via upload direto). Por favor, comprima o arquivo ou escolha um menor."
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
    <div className="space-y-2 bg-gray-50 p-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] text-red-600 hover:text-red-800 font-bold uppercase"
          >
            ✕ Remover Mídia
          </button>
        )}
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
        className={`border-2 border-dashed p-4 transition-all text-center flex flex-col items-center justify-center gap-2 ${
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
                <span>Clique para selecionar ou arraste o arquivo aqui</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                Suporta imagens e documentos PDF
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <p className="text-[11px] text-red-600 font-medium">{error}</p>
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
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider shrink-0 hover:bg-brand-gold hover:text-brand-navy transition-all"
          >
            ↗ Ver Mídia
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
            ✓ Prévia da imagem pronta para publicação
          </span>
        </div>
      )}
    </div>
  );
}
