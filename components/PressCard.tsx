"use client";

import Link from "next/link";

export interface PressContentBlock {
  tipo: "paragrafo" | "subtitulo" | "citacao";
  texto: string;
}

export interface PressItem {
  id: string;
  slug?: string;
  titulo: string;
  subtitulo?: string;
  veiculo: string;
  data: string;
  tipo?: string;
  categoria?: string;
  imagem: string;
  destaque?: boolean;
  resumo: string;
  link: string;
  pdfUrl?: string | null;
  arquivoDownload?: string | null;
  conteudo?: PressContentBlock[];
}

interface PressCardProps {
  item: PressItem;
}

export default function PressCard({ item }: PressCardProps) {
  const downloadFile = item.pdfUrl || item.arquivoDownload;
  const detailUrl = `/imprensa/${item.slug || item.id}`;

  return (
    <div className="flex flex-col bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-xl hover:border-brand-gold/40 transition-all duration-300 overflow-hidden group h-full">
      {/* Top Image Frame */}
      <Link href={detailUrl} className="relative aspect-[16/10] w-full bg-slate-50 border-b border-slate-100 overflow-hidden block group/thumb">
        <img
          src={item.imagem}
          alt={item.titulo}
          className="w-full h-full object-cover object-top group-hover/thumb:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-3">
          {/* Header Row: Date & Category Pill */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-sans text-slate-500 font-medium">
              {item.data}
            </span>
            <span className="bg-[#E5ECF2] text-[#203854] px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-md shrink-0">
              {item.categoria || "IMPRENSA"}
            </span>
          </div>

          {/* Title */}
          <Link href={detailUrl} className="block group/title">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-navy leading-snug group-hover/title:text-brand-gold-dark transition-colors line-clamp-2">
              {item.titulo}
            </h3>
          </Link>

          {/* Summary */}
          <p className="font-serif text-xs sm:text-sm text-brand-text/75 leading-relaxed line-clamp-3">
            {item.resumo}
          </p>
        </div>

        {/* Card Footer Divider & Action Row */}
        <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between gap-3">
          <Link
            href={detailUrl}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-brand-navy hover:text-brand-gold-dark transition-colors group/btn"
          >
            <span>LER MATÉRIA</span>
            <svg
              className="w-4 h-4 text-brand-navy group-hover/btn:text-brand-gold-dark transition-colors shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </Link>

          {/* Download Icon Button (circular button at bottom right, if file exists) */}
          {downloadFile && (
            <a
              href={downloadFile}
              download
              target="_blank"
              rel="noopener noreferrer"
              title="Baixar arquivo de imprensa (PDF)"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-brand-gold text-slate-700 hover:text-brand-navy shadow-sm flex items-center justify-center transition-all duration-200 shrink-0 group/download"
            >
              <svg
                className="w-4 h-4 text-slate-700 group-hover/download:text-brand-navy transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
