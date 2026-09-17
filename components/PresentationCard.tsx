"use client";

import Link from "next/link";

export interface PresentationContentBlock {
  tipo: "paragrafo" | "subtitulo" | "citacao";
  texto: string;
}

export interface Presentation {
  id: string;
  slug?: string;
  titulo: string;
  tipo: "palestra" | "sustentacao" | "video";
  evento?: string;
  tribunal?: string;
  plataforma?: string;
  veiculo?: string;
  duracao?: string;
  local?: string;
  ano: number;
  data?: string;
  descricao?: string;
  resumo?: string;
  detalhes?: string;
  url?: string;
  fonte?: string;
  conteudo?: PresentationContentBlock[] | string;
}

export default function PresentationCard({ item }: { item: Presentation }) {
  const getCategoryLabel = (tipo: string) => {
    switch (tipo) {
      case "sustentacao":
        return "SUSTENTAÇÃO ORAL";
      case "palestra":
        return "PALESTRA";
      case "video":
      default:
        return "CONTEÚDO EM VÍDEO";
    }
  };

  const targetLink = `/apresentacoes/${item.slug || item.id}`;
  const displayVeiculo = item.veiculo || item.plataforma || item.evento || item.tribunal || "Portal da Reforma Tributária";
  const displayData = item.data || (item.ano ? String(item.ano) : null);

  return (
    <div className="flex flex-col bg-white border border-brand-gold/25 hover:border-brand-gold hover:shadow-xl transition-all duration-300 rounded-none group h-full overflow-hidden">
      {/* 1. Video / Image Thumbnail Frame */}
      <Link href={targetLink} className="relative aspect-video w-full bg-gradient-to-br from-brand-navy via-[#001838] to-brand-navy border-b border-brand-gold/20 overflow-hidden flex items-center justify-center p-4 group/thumb">
        {/* Background texture overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay group-hover/thumb:scale-105 transition-transform duration-500"
          style={{ backgroundImage: "url('/images/library_bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-brand-navy/50" />

        {/* Play Icon Button Overlay */}
        <div className="relative z-10 w-12 h-12 rounded-full border-2 border-brand-gold bg-brand-navy/80 text-brand-gold flex items-center justify-center shadow-lg group-hover/thumb:bg-brand-gold group-hover/thumb:text-brand-navy group-hover/thumb:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Bottom-Right Video Duration Tag */}
        {item.duracao && (
          <span className="absolute bottom-3 right-3 z-10 text-[9px] font-mono font-semibold bg-black/70 text-white/90 px-2 py-0.5 border border-white/20">
            {item.duracao}
          </span>
        )}
      </Link>

      {/* 2. Compact Body with Title & Action Button */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          {/* Veículo & Data Meta Header */}
          <div className="flex items-center justify-between border-b border-brand-gold/15 pb-2 text-[10px] font-sans font-bold uppercase tracking-widest">
            <span className="text-brand-gold-dark truncate max-w-[200px]" title={displayVeiculo}>
              {displayVeiculo}
            </span>
            {displayData && (
              <span className="font-mono text-brand-navy shrink-0 font-bold bg-brand-gold/10 px-1.5 py-0.5 border border-brand-gold/20">
                {displayData}
              </span>
            )}
          </div>

          <Link href={targetLink}>
            <h3 className="font-serif text-sm md:text-base font-bold text-brand-navy leading-snug group-hover:text-brand-gold-dark transition-colors line-clamp-3 mt-1">
              {item.titulo}
            </h3>
          </Link>
        </div>

        {/* 3. Action Button with Category Tag */}
        <div className="pt-2 border-t border-brand-gold/15 mt-auto">
          <Link
            href={targetLink}
            className="w-full inline-flex items-center justify-between text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 bg-brand-bg/60 border border-brand-gold/30 text-brand-navy group-hover:bg-brand-gold group-hover:text-brand-navy group-hover:border-brand-gold transition-all duration-300"
          >
            <span>{getCategoryLabel(item.tipo)}</span>
            <span>ASSISTIR E LER &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
