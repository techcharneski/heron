"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-navy text-white/80 py-16 mt-auto border-t-2 border-brand-gold/30">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-white/10 text-sm">
          {/* Identity & Academic Mission */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white tracking-wide">
              Heron Charneski
            </h3>
            <p className="text-brand-gold text-xs uppercase font-bold tracking-wider">
              Advogado, Contador, Professor, Parecerista e Autor
            </p>
            <p className="text-white/70 leading-relaxed text-xs md:text-sm max-w-md">
              Portal dedicado à divulgação de pesquisas doutrinárias, obras publicadas, palestras e atividades de ensino na interface do Direito Tributário, Direito Societário e Ciência Contábil.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-brand-gold uppercase tracking-wider text-xs">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/sobre" className="hover:text-brand-gold transition-colors">Sobre</Link></li>
              <li><Link href="/livros" className="hover:text-brand-gold transition-colors">Livros</Link></li>
              <li><Link href="/artigos" className="hover:text-brand-gold transition-colors">Artigos</Link></li>
              <li><Link href="/apresentacoes" className="hover:text-brand-gold transition-colors">Apresentações</Link></li>
              <li><Link href="/imprensa" className="hover:text-brand-gold transition-colors">Imprensa</Link></li>
              <li><Link href="/servicos" className="hover:text-brand-gold transition-colors">Serviços</Link></li>
              <li><Link href="/contato" className="hover:text-brand-gold transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Academic & Professional Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-brand-gold uppercase tracking-wider text-xs">
              Links Institucionais
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="http://lattes.cnpq.br/6393905469333944"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-brand-gold rotate-45 shrink-0"></span>
                  Currículo Lattes (CNPq)
                </a>
              </li>
              <li>
                <a
                  href="https://www.charneski.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-brand-gold transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-brand-gold rotate-45 shrink-0"></span>
                  Charneski Advogados
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-white/50">
          <p>
            &copy; {currentYear} Prof. Dr. Heron Charneski. Difusão Acadêmica e Científica.
          </p>
          <p className="font-serif italic text-brand-gold/80">
            Direito Tributário, Direito Societário, Contabilidade e Reforma Tributária.
          </p>
        </div>
      </div>
    </footer>
  );
}
