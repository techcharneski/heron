"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Sobre", href: "/sobre" },
    { label: "Livros", href: "/livros" },
    { label: "Artigos", href: "/artigos" },
    { label: "Apresentações", href: "/apresentacoes" },
    { label: "Imprensa", href: "/imprensa" },
    { label: "Serviços", href: "/servicos" },
    { label: "Contato", href: "/contato" },
  ];

  return (
    <header className="w-full border-b border-brand-gold/25 bg-brand-navy py-4 md:py-5 shadow-md z-50 sticky top-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
        {/* Brand / Name & Qualifications */}
        <Link 
          href="/" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex flex-col group py-0.5"
        >
          <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-brand-gold transition-colors duration-200 whitespace-nowrap">
            Heron Charneski
          </span>
          <span className="text-[9px] md:text-[10px] font-sans font-semibold tracking-wider text-brand-gold/90 uppercase leading-none mt-1">
            Advogado &bull; Contador &bull; Professor &bull; Parecerista &bull; Autor
          </span>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex gap-x-4 xl:gap-x-6 text-[11px] xl:text-xs font-semibold tracking-wider">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors duration-200 pb-0.5 uppercase whitespace-nowrap ${
                    isActive
                      ? "text-brand-gold border-b-2 border-brand-gold"
                      : "text-white/85 hover:text-brand-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Lattes link */}
          <div className="flex items-center border-l border-white/20 pl-4 text-white/70">
            <a
              href="http://lattes.cnpq.br/6393905469333944"
              target="_blank"
              rel="noopener noreferrer"
              title="Currículo Lattes (CNPq)"
              className="border border-brand-gold bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider px-3 py-1"
            >
              Lattes
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-white/90 hover:text-brand-gold focus:outline-none transition-colors duration-200"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Menu Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-[calc(100%+17px)] left-0 w-full bg-brand-navy/98 backdrop-blur-md border-b border-brand-gold/25 shadow-2xl flex flex-col py-6 px-6 z-50 space-y-5 animate-fade-in-down">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-xs font-bold uppercase tracking-wider py-2 border-b border-white/5 transition-colors duration-200 ${
                      isActive
                        ? "text-brand-gold border-brand-gold/40"
                        : "text-white/80 hover:text-brand-gold"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-brand-gold/15 text-white/70">
              <a
                href="mailto:contato@charneski.com.br"
                className="hover:text-brand-gold transition-colors duration-200 text-[11px] sm:text-xs font-semibold uppercase tracking-wider shrink-0"
              >
                contato@charneski.com.br
              </a>
              <a
                href="http://lattes.cnpq.br/6393905469333944"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-brand-gold bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider px-3 py-1 shrink-0"
              >
                Lattes
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
