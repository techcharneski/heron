"use client";

import { useState, useEffect, useCallback } from "react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
  mimetype: string | null;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  filterType?: "image" | "pdf" | "auto";
}

function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
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

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  filterType = "auto",
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "images" | "docs">(
    filterType === "image" ? "images" : filterType === "pdf" ? "docs" : "all"
  );

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Erro ao carregar biblioteca de mídias:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, fetchMedia]);

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((item) => {
    const display = getDisplayFilename(item.name).toLowerCase();
    const rawName = item.name.toLowerCase();
    const matchesSearch =
      display.includes(searchQuery.toLowerCase()) || rawName.includes(searchQuery.toLowerCase());

    const itemIsImg = isImage(item.name, item.mimetype);
    if (activeTab === "images") return matchesSearch && itemIsImg;
    if (activeTab === "docs") return matchesSearch && !itemIsImg;

    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-brand-gold/40 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-brand-navy text-white flex items-center justify-between border-b border-brand-gold/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🖼️</span>
            <div>
              <h3 className="font-serif font-bold text-sm tracking-wide">
                Biblioteca de Mídias Existentes
              </h3>
              <p className="text-[11px] text-white/70">
                Selecione uma imagem ou documento já enviado anteriormente para usar neste campo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors rounded-none"
            title="Fechar Modal"
          >
            ✕
          </button>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar arquivo existente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 focus:outline-none focus:border-brand-navy bg-white font-sans"
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center border border-gray-300 overflow-hidden text-xs bg-white shrink-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 font-bold uppercase transition-colors ${
                activeTab === "all"
                  ? "bg-brand-navy text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todos ({mediaList.length})
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`px-3 py-1.5 font-bold uppercase transition-colors ${
                activeTab === "images"
                  ? "bg-brand-navy text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Imagens
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`px-3 py-1.5 font-bold uppercase transition-colors ${
                activeTab === "docs"
                  ? "bg-brand-navy text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Documentos
            </button>
          </div>
        </div>

        {/* Media Grid Content */}
        <div className="p-4 overflow-y-auto flex-1 min-h-[300px]">
          {loading ? (
            <div className="py-20 text-center text-gray-400 space-y-2">
              <span className="text-3xl animate-spin inline-block">⏳</span>
              <p className="text-xs font-mono">Carregando mídias da biblioteca...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 bg-gray-50/50 space-y-2">
              <span className="text-4xl">📭</span>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {searchQuery
                  ? "Nenhum arquivo encontrado para essa pesquisa"
                  : "Nenhuma mídia cadastrada na biblioteca"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredMedia.map((item) => {
                const isImg = isImage(item.name, item.mimetype);
                const displayName = getDisplayFilename(item.name);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    className="group bg-white border border-gray-200 hover:border-brand-gold hover:ring-2 hover:ring-brand-gold/50 text-left transition-all flex flex-col justify-between overflow-hidden shadow-xs cursor-pointer focus:outline-none"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-100 border-b border-gray-100 flex items-center justify-center overflow-hidden w-full">
                      {isImg ? (
                        <img
                          src={item.url}
                          alt={displayName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <span className="text-2xl">📄</span>
                          <span className="text-[9px] font-mono font-bold uppercase text-brand-navy/60 bg-gray-200 px-1.5 py-0.5">
                            PDF / DOC
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="p-2.5 space-y-1 w-full">
                      <p
                        className="text-[11px] font-bold text-brand-navy truncate group-hover:text-brand-gold transition-colors"
                        title={displayName}
                      >
                        {displayName}
                      </p>
                      <p className="text-[9px] text-gray-400 font-mono">
                        {formatBytes(item.size)}
                      </p>
                    </div>

                    <div className="px-2.5 py-1.5 bg-gray-50 border-t border-gray-100 text-[10px] font-bold uppercase text-brand-navy text-center group-hover:bg-brand-navy group-hover:text-white transition-colors">
                      ✓ Selecionar Este
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold uppercase transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
