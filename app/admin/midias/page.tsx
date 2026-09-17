"use client";

import { useState, useEffect, useCallback } from "react";
import {
  validateFileSize,
  FileValidationError,
} from "@/lib/upload-utils";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
  mimetype: string | null;
}

function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

function isImage(filename: string, mimetype?: string | null) {
  if (mimetype && mimetype.startsWith("image/")) return true;
  const ext = filename.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext || "");
}

function getDisplayFilename(name: string) {
  if (/^\d{13}_/.test(name)) {
    return name.replace(/^\d{13}_/, "");
  }
  return name;
}

export default function MediaManager() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<FileValidationError | null>(null);

  // Lista de mídias do servidor
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "images" | "docs">("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Erro ao carregar mídias:", err);
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSizeError(null);
    setUploadedUrl(null);

    // Validação prévia de tamanho no cliente (4MB para imagens, 10MB para PDFs)
    const validationErr = validateFileSize(file);
    if (validationErr) {
      setSizeError(validationErr);
      return;
    }

    setUploading(true);

    try {
      // 1. Obter Signed URL para upload direto no Supabase Storage
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
          fetchMedia();
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
            "O arquivo é muito grande. Por favor, otimize e comprima o arquivo antes de enviar."
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
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Erro ao realizar upload do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Tem certeza que deseja excluir o arquivo "${getDisplayFilename(filename)}"?`)) {
      return;
    }

    setDeletingName(filename);
    try {
      const res = await fetch(`/api/admin/media?name=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMediaList((prev) => prev.filter((item) => item.name !== filename));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erro ao excluir arquivo.");
      }
    } catch (err) {
      console.error("Erro ao excluir mídia:", err);
      alert("Erro ao comunicar com o servidor para exclusão.");
    } finally {
      setDeletingName(null);
    }
  };

  // Filtragem da lista
  const filteredMedia = mediaList.filter((item) => {
    const display = getDisplayFilename(item.name).toLowerCase();
    const rawName = item.name.toLowerCase();
    const matchesSearch =
      display.includes(searchQuery.toLowerCase()) || rawName.includes(searchQuery.toLowerCase());

    const itemIsImg = isImage(item.name, item.mimetype);
    if (filterType === "images") return matchesSearch && itemIsImg;
    if (filterType === "docs") return matchesSearch && !itemIsImg;

    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Gerenciador de Mídias e Arquivos
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Faça upload de capas de livros, fotos, logos ou documentos em PDF (limites: 4 MB para Imagens, 10 MB para PDFs).
          </p>
        </div>
        <button
          onClick={fetchMedia}
          disabled={loadingMedia}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs font-bold uppercase tracking-wider border border-gray-300 transition-colors shrink-0"
        >
          <span className={loadingMedia ? "animate-spin" : ""}>🔄</span>
          <span>Atualizar Lista</span>
        </button>
      </div>

      {/* Area de Upload */}
      <div className="bg-white p-8 border border-gray-200 shadow-xs space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy border-b border-gray-100 pb-3 flex items-center gap-2">
          <span>📤</span> Novo Upload
        </h3>

        <div className="border-2 border-dashed border-brand-gold/60 p-8 text-center bg-gray-50 hover:bg-white transition-colors">
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
            <span className="text-4xl">{uploading ? "⏳" : "📁"}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
              {uploading ? "Enviando arquivo..." : "Clique aqui para selecionar um arquivo"}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Limites: <strong className="text-red-600">4 MB</strong> (Imagens) | <strong className="text-red-600">10 MB</strong> (PDFs)
            </span>
          </label>
        </div>

        {/* Alerta detalhado de tamanho com sites de otimização recomendados */}
        {sizeError && (
          <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 space-y-2.5 text-xs">
            <div className="flex items-start gap-2 font-bold text-red-700 text-sm">
              <span>⚠️</span>
              <span>{sizeError.title}</span>
            </div>
            <p className="text-xs text-gray-700">
              {sizeError.message}
            </p>
            <div className="pt-2 border-t border-amber-200">
              <span className="font-bold text-xs uppercase tracking-wider block text-brand-navy mb-2">
                💡 Recomendação: Utilize um dos sites gratuitos abaixo para comprimir seu {sizeError.isPdf ? "PDF" : "arquivo de imagem"}:
              </span>
              <div className="flex flex-wrap gap-2">
                {sizeError.recommendations.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white border border-amber-300 text-brand-navy text-xs font-bold hover:bg-brand-navy hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>{tool.label}</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && !sizeError && (
          <div className="p-4 bg-red-50 text-red-800 text-xs font-bold border border-red-200">
            ⚠️ {error}
          </div>
        )}

        {uploadedUrl && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase block flex items-center gap-1.5">
              <span>✓</span> Arquivo enviado com sucesso!
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="w-full p-2.5 text-xs font-mono border border-emerald-300 bg-white text-gray-800 selection:bg-brand-gold"
              />
              <button
                onClick={() => copyToClipboard(uploadedUrl)}
                className="px-4 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase hover:bg-brand-gold hover:text-brand-navy transition-all shrink-0"
              >
                {copiedUrl === uploadedUrl ? "✓ Copiado!" : "Copiar Link"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Galeria e Lista de Mídias */}
      <div className="bg-white p-6 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-sm font-serif font-bold text-brand-navy flex items-center gap-2">
              <span>🖼️</span> Mídias Adicionadas
              <span className="text-xs font-mono font-normal text-gray-400 bg-gray-100 px-2 py-0.5 border border-gray-200">
                {filteredMedia.length} {filteredMedia.length === 1 ? "arquivo" : "arquivos"}
              </span>
            </h3>
          </div>

          {/* Controles de Busca e Filtro */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Buscar arquivo pelo nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 focus:outline-none focus:border-brand-navy font-sans"
              />
              <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center border border-gray-200 rounded-none overflow-hidden text-xs">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 font-bold uppercase transition-colors ${
                  filterType === "all"
                    ? "bg-brand-navy text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType("images")}
                className={`px-3 py-1.5 font-bold uppercase transition-colors ${
                  filterType === "images"
                    ? "bg-brand-navy text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Imagens
              </button>
              <button
                onClick={() => setFilterType("docs")}
                className={`px-3 py-1.5 font-bold uppercase transition-colors ${
                  filterType === "docs"
                    ? "bg-brand-navy text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Documentos
              </button>
            </div>
          </div>
        </div>

        {/* Status Carregando */}
        {loadingMedia ? (
          <div className="py-16 text-center text-gray-400 space-y-2">
            <span className="text-2xl animate-spin inline-block">⏳</span>
            <p className="text-xs font-mono">Carregando lista de mídias...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-gray-200 bg-gray-50/50 space-y-2">
            <span className="text-3xl">📭</span>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              {searchQuery
                ? "Nenhum arquivo encontrado para essa busca"
                : "Nenhum arquivo encontrado no servidor"}
            </p>
            <p className="text-[11px] text-gray-400">
              Faça o upload no campo acima para disponibilizar seus arquivos no site.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => {
              const isImg = isImage(item.name, item.mimetype);
              const displayName = getDisplayFilename(item.name);
              const isDeleting = deletingName === item.name;

              return (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-200 hover:border-brand-gold/60 transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
                >
                  {/* Aspect Ratio Container for Preview */}
                  <div className="relative aspect-video bg-gray-100 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                    {isImg ? (
                      <img
                        src={item.url}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback se a imagem não carregar
                          (e.target as HTMLElement).style.display = "none";
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-3xl">🖼️</span>';
                          }
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <span className="text-3xl">📄</span>
                        <span className="text-[10px] font-mono font-bold uppercase text-brand-navy/60 bg-gray-200 px-2 py-0.5">
                          PDF / Documento
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 flex-grow space-y-1.5">
                    <p
                      className="text-xs font-bold text-brand-navy truncate"
                      title={displayName}
                    >
                      {displayName}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>{formatBytes(item.size)}</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                        copiedUrl === item.url
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-brand-navy border-gray-300 hover:bg-brand-navy hover:text-white"
                      }`}
                      title="Copiar Link para Área de Transferência"
                    >
                      {copiedUrl === item.url ? "✓ Copiado" : "Link"}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-2 bg-white text-gray-700 hover:text-brand-navy border border-gray-300 text-[10px] font-bold uppercase transition-colors"
                      title="Abrir arquivo em nova aba"
                    >
                      ↗
                    </a>

                    <button
                      onClick={() => handleDelete(item.name)}
                      disabled={isDeleting}
                      className="py-1.5 px-2 bg-white text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-[10px] font-bold uppercase transition-colors"
                      title="Excluir arquivo"
                    >
                      {isDeleting ? "⏳" : "🗑️"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
