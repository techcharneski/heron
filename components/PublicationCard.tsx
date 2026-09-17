"use client";

export interface Publication {
  id: string;
  slug?: string;
  titulo: string;
  autor?: string;
  coautores?: string[];
  tipo?: string;
  categoria?: string;
  ano?: number;
  data?: string;
  veiculo?: string;
  pdfUrl?: string;
  link?: string;
  resumo?: string;
  detalhes?: string;
}

interface PublicationCardProps {
  publication: Publication;
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  const downloadUrl = publication.pdfUrl || publication.link || "#";
  const displayData = publication.data || (publication.ano ? String(publication.ano) : null);

  // Formatar autor e coautores (ex: "Heron Charneski e Thiago Charneski")
  let authorsDisplay = publication.autor || "Heron Charneski";
  if (!publication.autor && publication.coautores && publication.coautores.length > 0) {
    authorsDisplay = `Heron Charneski e ${publication.coautores.join(", ")}`;
  }

  return (
    <div className="w-full bg-white border border-brand-gold/25 hover:border-brand-gold hover:shadow-xl transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
      <div className="space-y-3 flex-grow max-w-4xl">
        {/* Linha de Autor(es) e Data */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
          <div className="flex items-center gap-1.5 font-bold text-brand-navy">
            <svg className="w-3.5 h-3.5 text-brand-gold-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{authorsDisplay}</span>
          </div>

          {displayData && (
            <>
              <span className="text-brand-gold/60">&bull;</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-brand-navy bg-brand-gold/15 px-2.5 py-0.5 border border-brand-gold/30">
                <svg className="w-3 h-3 text-brand-gold-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {displayData}
              </span>
            </>
          )}
        </div>

        {/* Título */}
        <h3 className="font-serif text-lg md:text-xl font-bold text-brand-navy group-hover:text-brand-gold-dark transition-colors duration-200 leading-snug">
          {publication.titulo}
        </h3>

        {/* Resumo / Detalhes */}
        {(publication.detalhes || publication.resumo) && (
          <p className="text-xs md:text-sm text-brand-text/80 font-serif leading-relaxed">
            {publication.detalhes || publication.resumo}
          </p>
        )}
      </div>

      {/* Botão de Ação / Download */}
      {(publication.pdfUrl || publication.link) && (
        <div className="shrink-0 pt-2 md:pt-0">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 text-xs font-bold uppercase tracking-wider border border-brand-gold/40 shadow-sm whitespace-nowrap group/btn"
          >
            <span>DOWNLOAD PDF</span>
            <svg className="w-4 h-4 transition-transform group-hover/btn:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
