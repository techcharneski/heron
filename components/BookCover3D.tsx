"use client";

import React from "react";

interface BookCover3DProps {
  titulo: string;
  subtitulo?: string;
  autor: string;
  ano: number;
  editora: string;
  isbn?: string;
  imagemCapa?: string;
  theme?: "navy" | "bordeaux" | "emerald" | "indigo";
  size?: "sm" | "md" | "lg";
}

export default function BookCover3D({
  titulo,
  subtitulo,
  autor,
  ano,
  editora,
  isbn,
  imagemCapa,
  theme = "navy",
  size = "md"
}: BookCover3DProps) {
  // Color themes for distinctive book covers
  const themeStyles = {
    navy: {
      bg: "from-[#00142D] via-[#00214D] to-[#003366]",
      border: "border-brand-gold/60",
      accent: "text-brand-gold",
      divider: "bg-brand-gold",
      badge: "border-brand-gold/40 text-brand-gold"
    },
    bordeaux: {
      bg: "from-[#2A0812] via-[#4A0E1F] to-[#68142B]",
      border: "border-amber-300/60",
      accent: "text-amber-300",
      divider: "bg-amber-300",
      badge: "border-amber-300/40 text-amber-200"
    },
    emerald: {
      bg: "from-[#061F16] via-[#0D3828] to-[#16543C]",
      border: "border-emerald-300/60",
      accent: "text-emerald-300",
      divider: "bg-emerald-300",
      badge: "border-emerald-300/40 text-emerald-200"
    },
    indigo: {
      bg: "from-[#0E1329] via-[#1A234A] to-[#28356E]",
      border: "border-indigo-200/60",
      accent: "text-indigo-200",
      divider: "bg-indigo-200",
      badge: "border-indigo-200/40 text-indigo-100"
    }
  }[theme];

  const sizeClasses = {
    sm: "w-36 h-52 sm:w-40 sm:h-56",
    md: "w-44 h-64 sm:w-52 sm:h-76 md:w-56 md:h-80",
    lg: "w-52 h-76 sm:w-64 sm:h-96 md:w-72 md:h-[420px]"
  }[size];

  return (
    <div className="relative group perspective-1000 select-none py-4">
      {/* Soft shadow cast below book */}
      <div className="absolute bottom-2 left-4 right-4 h-6 bg-black/40 blur-xl rounded-full transform group-hover:scale-105 group-hover:blur-2xl transition-all duration-500 pointer-events-none" />

      {/* 3D Book Box Container */}
      <div 
        className={`relative z-10 ${sizeClasses} shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:rotate-y-[-6deg] group-hover:rotate-x-[2deg] cursor-pointer`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Book Spine Crease Effect */}
        <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-30 pointer-events-none" />
        
        {/* Book Paper Stack Edge (Right Side 3D Layer) */}
        <div 
          className="absolute top-1 bottom-1 -right-3 w-3 bg-gradient-to-r from-[#e8e4d8] via-[#f5f2e9] to-[#d9d4c5] border-t border-b border-r border-[#b8b29e] z-10 rounded-r-sm"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #d9d4c5, #d9d4c5 1px, #f5f2e9 1px, #f5f2e9 3px)"
          }}
        />

        {/* Book Cover Surface */}
        {imagemCapa ? (
          <div className="w-full h-full border-2 border-brand-gold/40 relative overflow-hidden z-20 shadow-xl bg-brand-navy">
            <img 
              src={imagemCapa} 
              alt={titulo} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${themeStyles.bg} border-2 ${themeStyles.border} p-5 sm:p-6 flex flex-col justify-between text-center relative overflow-hidden z-20 shadow-inner`}>
            
            {/* Double Ornate Gold Foil Frame */}
            <div className={`absolute inset-2 border ${themeStyles.border} opacity-40 pointer-events-none`} />
            <div className={`absolute inset-3 border ${themeStyles.border} opacity-20 pointer-events-none`} />

            {/* Top Section: Publisher & Year */}
            <div className="relative z-10 space-y-1">
              <span className={`text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-widest ${themeStyles.accent} block`}>
                {editora}
              </span>
              <div className={`w-6 h-[1px] ${themeStyles.divider} mx-auto opacity-70`} />
            </div>

            {/* Middle Section: Book Title & Subtitle */}
            <div className="relative z-10 my-auto px-1 space-y-2">
              <h4 className="font-serif text-xs sm:text-sm md:text-base font-bold text-white leading-tight tracking-tight drop-shadow-md">
                {titulo}
              </h4>
              
              {subtitulo && (
                <p className="text-[9px] sm:text-[10px] font-serif italic text-white/70 leading-snug line-clamp-2">
                  {subtitulo}
                </p>
              )}

              <div className={`w-10 h-[1px] ${themeStyles.divider} mx-auto my-2`} />
              
              <p className={`text-[9px] sm:text-[10px] font-serif font-semibold italic ${themeStyles.accent}`}>
                {autor}
              </p>
            </div>

            {/* Bottom Section: Year & ISBN / Seal */}
            <div className="relative z-10 pt-2 flex items-center justify-between border-t border-white/10 text-[8px] font-mono text-white/60">
              <span>{ano}</span>
              <span className="truncate max-w-[90px]">{isbn || "Obra Acadêmica"}</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
