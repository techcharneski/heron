"use client";

import Link from "next/link";

export interface Book {
  id: string;
  titulo: string;
  subtitulo?: string;
  autor: string;
  ano: number;
  editora: string;
  paginas?: string;
  isbn?: string;
  imagemCapa?: string;
  resumo: string;
  topicos?: string[];
}

export default function BookCard({ 
  book, 
  layout = "horizontal" 
}: { 
  book: Book;
  layout?: "vertical" | "horizontal";
}) {
  if (layout === "horizontal") {
    return (
      <div className="bg-white border border-brand-gold/25 hover:border-brand-gold hover:shadow-2xl transition-all duration-500 group rounded-none overflow-hidden flex flex-col sm:flex-row h-full">
        {/* Left/Top: 3D Book Mockup Display */}
        <div className="bg-brand-navy sm:w-5/12 p-6 sm:p-8 flex flex-col justify-center items-center relative overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-brand-gold/20 min-h-[280px]">
          {/* Subtle library background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay scale-105"
            style={{ backgroundImage: "url('/images/library_bg.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-brand-navy/60 z-0" />
          
          {/* 3D-styled Book Mockup Container */}
          <div className="relative z-10 w-36 h-52 sm:w-40 sm:h-56 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
            {/* Book Spine Shadow */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-black/40 z-20" />
            
            {/* Book Cover Surface */}
            <div className="w-full h-full bg-gradient-to-br from-brand-navy-light via-brand-navy to-[#001433] border-t border-r border-b border-brand-gold/60 p-4 flex flex-col justify-between text-center relative overflow-hidden">
              {/* Top accent */}
              <div className="text-[8px] font-sans font-bold uppercase tracking-widest text-brand-gold">
                {book.editora}
              </div>
              
              {/* Title on cover */}
              <div className="my-auto space-y-1">
                <h4 className="font-serif text-xs md:text-sm font-bold text-white leading-snug line-clamp-3">
                  {book.titulo}
                </h4>
                <div className="w-6 h-[1px] bg-brand-gold mx-auto my-1.5" />
                <p className="text-[9px] font-serif italic text-brand-gold/90">
                  {book.autor}
                </p>
              </div>
              
              {/* Bottom ISBN or Tag */}
              <div className="text-[8px] font-mono text-white/60 flex items-center justify-between">
                <span>{book.ano}</span>
                <span>{book.paginas || "Obra"}</span>
              </div>
            </div>
          </div>

          <span className="relative z-10 text-[9px] font-mono text-brand-gold/80 mt-4 uppercase tracking-widest">
            {book.isbn || `Ano ${book.ano}`}
          </span>
        </div>

        {/* Right/Body: Book Content Details */}
        <div className="sm:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark border-b border-brand-gold/15 pb-2">
              <span>{book.editora}</span>
              <span className="font-mono text-brand-navy font-bold">{book.ano}</span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-navy leading-snug group-hover:text-brand-gold-dark transition-colors">
              {book.titulo}
            </h3>

            {book.subtitulo && (
              <p className="font-serif text-xs italic text-brand-text/75 leading-relaxed">
                {book.subtitulo}
              </p>
            )}

            <p className="text-xs sm:text-sm text-brand-text/80 leading-relaxed pt-1">
              {book.resumo}
            </p>
          </div>

          {/* Highlighted topics */}
          {book.topicos && book.topicos.length > 0 && (
            <div className="pt-4 border-t border-brand-gold/15 space-y-2">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                Tópicos Centrais da Obra:
              </span>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-brand-text/75">
                {book.topicos.map((topico, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-gold rotate-45 mt-1 shrink-0" />
                    <span>{topico}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/livros"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold-dark hover:text-brand-navy transition-colors uppercase tracking-wider group/link"
            >
              Ver detalhes da obra
              <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout fallback for small cards
  return (
    <div className="flex flex-col bg-white border border-brand-gold/20 hover:border-brand-gold hover:shadow-2xl transition-all duration-300 group rounded-none overflow-hidden h-full">
      <div className="bg-brand-navy p-8 flex justify-center items-center relative overflow-hidden min-h-[260px] border-b border-brand-gold/20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: "url('/images/library_bg.png')" }}
        />
        
        <div className="relative z-10 w-40 h-56 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-black/40 z-20" />
          <div className="w-full h-full bg-gradient-to-br from-brand-navy-light via-brand-navy to-[#001433] border-t border-r border-b border-brand-gold/50 p-4 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="text-[8px] font-sans font-bold uppercase tracking-widest text-brand-gold">
              {book.editora} &bull; {book.ano}
            </div>
            
            <div className="my-auto">
              <h4 className="font-serif text-xs md:text-sm font-bold text-white leading-tight mb-1 line-clamp-3">
                {book.titulo}
              </h4>
              <div className="w-8 h-[1px] bg-brand-gold mx-auto my-2" />
              <p className="text-[9px] font-serif italic text-brand-gold/90 line-clamp-2">
                {book.autor}
              </p>
            </div>
            
            <div className="text-[8px] font-mono text-white/50">
              {book.isbn || "Edição Acadêmica"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
        <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark">
          <span>{book.editora}</span>
          <span>{book.ano}</span>
        </div>

        <h3 className="font-serif text-lg md:text-xl font-bold text-brand-navy leading-snug group-hover:text-brand-gold-dark transition-colors">
          {book.titulo}
        </h3>

        {book.subtitulo && (
          <p className="font-serif text-xs italic text-brand-text/75 leading-relaxed">
            {book.subtitulo}
          </p>
        )}

        <p className="text-xs md:text-sm text-brand-text/80 leading-relaxed flex-grow">
          {book.resumo}
        </p>

        {book.topicos && book.topicos.length > 0 && (
          <div className="pt-4 border-t border-brand-gold/15 space-y-2">
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
              Eixos da Obra:
            </span>
            <ul className="space-y-1.5 text-xs text-brand-text/75">
              {book.topicos.map((topico, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-brand-gold rotate-45 mt-1.5 shrink-0" />
                  <span>{topico}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
