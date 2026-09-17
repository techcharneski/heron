"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BookCover3D from "./BookCover3D";

export interface BookItem {
  id: string;
  titulo: string;
  subtitulo?: string;
  autor: string;
  papel?: string;
  categoria?: string;
  ano: number;
  editora: string;
  paginas?: string;
  isbn?: string;
  imagemCapa?: string;
  resumo: string;
  topicos?: string[];
  theme?: "navy" | "bordeaux" | "emerald" | "indigo";
}

const themeMap: Record<string, "navy" | "bordeaux" | "emerald" | "indigo"> = {
  "livro-reforma-tributaria": "navy",
  "livro-lucro-real-ifrs": "bordeaux",
  "livro-normas-internacionais": "emerald",
  "livro-tributacao-autonomia": "indigo",
  "livro-normas-internacionais-tributacao": "navy",
  "livro-temas-atuais-gestao-empresarial-tributos": "bordeaux"
};

export default function BooksShowcase({ books }: { books: BookItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<"todas" | "individuais" | "coordenacao">("todas");
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredBooks = books.filter((b) => {
    if (selectedCategory === "individuais") {
      return b.categoria === "Obras Individuais" || !b.categoria;
    }
    if (selectedCategory === "coordenacao") {
      return b.categoria === "Coordenação de Livros";
    }
    return true;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  const handleCategoryChange = (cat: "todas" | "individuais" | "coordenacao") => {
    if (cat === selectedCategory) return;
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedCategory(cat);
      setCurrentPage(0);
      setIsAnimating(false);
    }, 150);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages || newPage === currentPage) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsAnimating(false);
    }, 150);
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const countIndividuais = books.filter((b) => b.categoria === "Obras Individuais" || !b.categoria).length;
  const countCoordenacao = books.filter((b) => b.categoria === "Coordenação de Livros").length;

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-gold/20 pb-3">
        <button
          onClick={() => handleCategoryChange("todas")}
          className={`px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-all border ${
            selectedCategory === "todas"
              ? "bg-brand-navy text-white border-brand-navy shadow-sm"
              : "bg-white text-brand-text/70 border-brand-gold/30 hover:border-brand-gold hover:text-brand-navy"
          }`}
        >
          Todas as Obras ({books.length})
        </button>
        <button
          onClick={() => handleCategoryChange("individuais")}
          className={`px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-all border ${
            selectedCategory === "individuais"
              ? "bg-brand-navy text-white border-brand-navy shadow-sm"
              : "bg-white text-brand-text/70 border-brand-gold/30 hover:border-brand-gold hover:text-brand-navy"
          }`}
        >
          Obras Individuais ({countIndividuais})
        </button>
        <button
          onClick={() => handleCategoryChange("coordenacao")}
          className={`px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider transition-all border ${
            selectedCategory === "coordenacao"
              ? "bg-brand-navy text-white border-brand-navy shadow-sm"
              : "bg-white text-brand-text/70 border-brand-gold/30 hover:border-brand-gold hover:text-brand-navy"
          }`}
        >
          Coordenação de Livros ({countCoordenacao})
        </button>
      </div>

      {/* Carousel Grid */}
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          itemsPerPage === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"
        } gap-6 transition-opacity duration-200 ${
          isAnimating ? "opacity-30" : "opacity-100"
        }`}
      >
        {visibleBooks.map((b) => {
          const isCoordinated = b.categoria === "Coordenação de Livros";
          return (
            <Link
              key={b.id}
              href={`/livros#${b.id}`}
              className="p-6 bg-white border border-brand-gold/25 shadow-sm hover:shadow-xl hover:border-brand-gold transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-widest border-b border-brand-gold/15 pb-2">
                  <span className={`px-1.5 py-0.5 border ${
                    isCoordinated
                      ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                      : "bg-brand-gold/10 border-brand-gold/30 text-brand-gold-dark"
                  }`}>
                    {isCoordinated ? "Coordenação" : "Obra Individual"}
                  </span>
                  <span className="font-mono text-brand-navy font-bold">{b.ano}</span>
                </div>

                <div className="flex justify-center py-3">
                  <BookCover3D
                    titulo={b.titulo}
                    autor={b.autor}
                    ano={b.ano}
                    editora={b.editora}
                    imagemCapa={b.imagemCapa}
                    theme={themeMap[b.id] || "navy"}
                    size="sm"
                  />
                </div>

                <div>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-brand-text/50 block mb-1">
                    {b.editora}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-brand-navy leading-snug group-hover:text-brand-gold-dark transition-colors line-clamp-2">
                    {b.titulo}
                  </h4>
                </div>

                <p className="text-xs text-brand-text/70 line-clamp-3 leading-relaxed font-serif">
                  {b.resumo}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-gold/15 mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark group-hover:text-brand-navy transition-colors">
                <span>Ver Detalhes</span>
                <span>&rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Carousel Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-brand-gold/15">
          <div className="text-xs text-brand-text/60 font-sans text-center sm:text-left">
            Mostrando <span className="font-bold text-brand-navy">{startIndex + 1}</span>-
            <span className="font-bold text-brand-navy">
              {Math.min(startIndex + itemsPerPage, filteredBooks.length)}
            </span>{" "}
            de <span className="font-bold text-brand-navy">{filteredBooks.length}</span> obras
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto py-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Página anterior"
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap border transition-all duration-200 shrink-0 ${
                currentPage === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-brand-gold/40 text-brand-navy hover:bg-brand-gold hover:text-brand-navy"
              }`}
            >
              &larr; Anterior
            </button>

            {/* Indicator Dots */}
            <div className="flex gap-1.5 px-1 sm:px-2 shrink-0">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx)}
                  aria-label={`Ir para página ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    currentPage === idx
                      ? "bg-brand-gold scale-110"
                      : "bg-brand-gold/25 hover:bg-brand-gold/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Próxima página"
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap border transition-all duration-200 shrink-0 ${
                currentPage >= totalPages - 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-brand-gold/40 text-brand-navy hover:bg-brand-gold hover:text-brand-navy"
              }`}
            >
              Próximo &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
