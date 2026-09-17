"use client";

import { useState } from "react";

export default function MediaManager() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      // 1. Obter Signed URL para upload direto no Supabase Storage
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
        const uploadRes = await fetch(signedData.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        if (uploadRes.ok) {
          setUploadedUrl(signedData.publicUrl);
          setUploading(false);
          return;
        }
      }

      // 2. Fallback: rota tradicional
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
      setUploadedUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar upload do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("URL copiada para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-gray-200">
        <h2 className="font-serif text-xl font-bold text-brand-navy">
          Gerenciador de Mídias e Upload de Arquivos
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Faça upload de capas de livros, fotos, logos ou documentos em PDF. A URL gerada poderá ser colada nos editores do painel.
        </p>
      </div>

      <div className="bg-white p-8 border border-gray-200 space-y-6">
        <div className="border-2 border-dashed border-brand-gold/50 p-8 text-center bg-gray-50 hover:bg-white transition-colors">
          <input
            type="file"
            id="fileInput"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer inline-flex flex-col items-center space-y-2"
          >
            <span className="text-4xl">📁</span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
              {uploading ? "Enviando arquivo..." : "Clique aqui para selecionar um arquivo"}
            </span>
            <span className="text-xs text-gray-400">
              Suporta imagens (PNG, JPG, WEBP) e documentos PDF
            </span>
          </label>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-800 text-xs font-bold border border-red-200">
            {error}
          </div>
        )}

        {uploadedUrl && (
          <div className="p-6 bg-emerald-50 border border-emerald-200 space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase block">
              ✓ Arquivo enviado com sucesso!
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="w-full p-2 text-xs font-mono border border-emerald-300 bg-white"
              />
              <button
                onClick={() => copyToClipboard(uploadedUrl)}
                className="px-4 py-2 bg-brand-navy text-white text-xs font-bold uppercase hover:bg-brand-gold hover:text-brand-navy transition-all shrink-0"
              >
                Copiar Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
