import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BooksShowcase from "@/components/BooksShowcase";
import PresentationCard, { Presentation } from "@/components/PresentationCard";
import PublicationCard, { Publication } from "@/components/PublicationCard";
import { getPagesContent, getCollection } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const pagesData = await getPagesContent();
  const booksData = await getCollection("books");
  const presentationsData = await getCollection("presentations");
  const articlesData = await getCollection("articles");

  const homeContent = pagesData?.home || {};
  const featuredBooks = booksData || [];
  const videoPresentations = ((presentationsData as unknown as Presentation[]) || [])
    .filter((p) => p.tipo === "video")
    .slice(0, 3);
  const featuredArticles = ((articlesData as unknown as Publication[]) || []).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow">
        {/* Premium Academic Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden flex flex-col items-center justify-center text-center bg-brand-navy border-b border-brand-gold/30">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 scale-105"
            style={{ backgroundImage: `url('${homeContent.bgImage || "/images/library_bg.png"}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/25 via-brand-navy/45 to-brand-navy/80 z-0" />
          
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8 flex flex-col items-center text-center">
            <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-widest text-white block mb-4 border border-brand-gold/40 px-3 py-1 bg-brand-gold/20 backdrop-blur-xs">
              {homeContent.badge || "Produção Científica • Atuação Docente • Doutrina Tributária"}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl drop-shadow-lg">
              {homeContent.title || "Heron Charneski"}
            </h1>

            <p className="mt-4 text-xs sm:text-sm md:text-base font-sans font-bold uppercase tracking-widest text-white max-w-3xl leading-relaxed drop-shadow-md">
              {homeContent.subtitle || "Advogado • Contador • Professor • Parecerista • Autor"}
            </p>
            
            <p className="mt-2 text-xs md:text-sm text-white/90 tracking-wider font-mono drop-shadow-sm">
              {homeContent.description || "Direito Tributário, Direito Societário, Contabilidade e Reforma Tributária"}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
              {(homeContent.buttons || [
                { label: "Livros", href: "/livros" },
                { label: "Artigos", href: "/artigos" },
                { label: "Minibio e Pesquisa", href: "/sobre" }
              ]).map((btn: any, idx: number) => (
                <Link
                  key={idx}
                  href={btn.href}
                  className="inline-flex items-center justify-center border border-brand-gold bg-brand-gold text-brand-navy text-xs md:text-sm font-bold uppercase tracking-wider px-7 py-3.5 hover:bg-transparent hover:text-brand-gold transition-all duration-300 shadow-md"
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1: Sobre (Minibio + Reconhecimentos) */}
        <section className="py-20 md:py-28 bg-white relative border-b border-brand-gold/15">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
              <div className="md:col-span-7 space-y-6">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                  {homeContent.aboutSection?.badge || "Perfil Acadêmico e Profissional"}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-navy leading-tight">
                  {homeContent.aboutSection?.title || "Sobre Heron Charneski"}
                </h2>
                <p className="text-sm md:text-base text-brand-navy/90 font-sans leading-relaxed">
                  {homeContent.aboutSection?.paragraph1 || "Doutor e Mestre em Direito Econômico, Financeiro e Tributário pela Faculdade de Direito da USP."}
                </p>
                <p className="text-sm md:text-base text-brand-navy/90 font-sans leading-relaxed">
                  {homeContent.aboutSection?.paragraph2 || "Atua como advogado, professor convidado, pesquisador e parecerista em matérias tributárias e societárias complexas."}
                </p>
                <div className="pt-2">
                  <Link
                    href={homeContent.aboutSection?.linkHref || "/sobre"}
                    className="text-xs md:text-sm font-bold uppercase tracking-wider text-brand-gold-dark hover:text-brand-navy transition-colors flex items-center gap-2 group"
                  >
                    {homeContent.aboutSection?.linkText || "Ver Minibio, Linhas de Pesquisa e Reconhecimentos →"}
                  </Link>
                </div>
              </div>

              {/* Portrait Frame */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-80 md:w-72 md:h-96">
                  <div className="absolute top-4 left-4 right-[-16px] bottom-[-16px] border-2 border-brand-gold/60 z-0" />
                  <div className="absolute inset-0 bg-brand-navy-light overflow-hidden z-10 shadow-xl border border-brand-gold/20">
                    <img 
                      src="/images/heron-charneski.webp" 
                      alt="Heron Charneski" 
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Livros (Obras Publicadas) */}
        <section className="py-20 md:py-28 bg-brand-bg/50 border-b border-brand-gold/15">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 border-b border-brand-gold/20 pb-6">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block mb-2">
                  Produção Autoral Monográfica
                </span>
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-brand-navy">
                  Obras de Referência
                </h2>
              </div>
              <Link
                href="/livros"
                className="text-xs md:text-sm font-bold uppercase tracking-wider text-brand-gold-dark hover:text-brand-navy transition-colors flex items-center gap-1 group shrink-0"
              >
                Página Exclusiva dos Livros &rarr;
              </Link>
            </div>

            {/* Interactive & Expansive Showcase */}
            <BooksShowcase books={featuredBooks} />
          </div>
        </section>

        {/* Section 3: Conteúdos em Vídeo */}
        <section className="py-20 md:py-28 bg-brand-gold-light/20 border-b border-brand-gold/15">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block mb-2">
                  Difusão Científica e Oralidade
                </span>
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-brand-navy">
                  Conteúdos em Vídeo
                </h2>
              </div>
              <Link
                href="/apresentacoes"
                className="text-xs md:text-sm font-bold uppercase tracking-wider text-brand-gold-dark hover:text-brand-navy transition-colors flex items-center gap-1 group shrink-0"
              >
                Ver todos os vídeos &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videoPresentations.map((item) => (
                <PresentationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Artigos */}
        <section className="py-20 md:py-28 bg-white border-b border-brand-gold/15">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block mb-2">
                  Produção Bibliográfica
                </span>
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-brand-navy">
                  Artigos e Capítulos de Livros
                </h2>
              </div>
              <Link
                href="/artigos"
                className="text-xs md:text-sm font-bold uppercase tracking-wider text-brand-gold-dark hover:text-brand-navy transition-colors flex items-center gap-1 group shrink-0"
              >
                Ver acervo de artigos &rarr;
              </Link>
            </div>

            <div className="flex flex-col space-y-6">
              {featuredArticles.map((art) => (
                <PublicationCard key={art.id} publication={art} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Imprensa */}
        <section className="py-20 md:py-28 bg-brand-navy text-white border-b border-brand-gold/30">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 space-y-6">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold block">
                  Cobertura Jornalística
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                  Imprensa e Análises na Mídia
                </h2>
                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                  Entrevistas, artigos de opinião e matérias jornalísticas de relevância nacional sobre a Reforma Tributária, IFRS e contencioso fiscal corporativo.
                </p>
                <div>
                  <Link
                    href="/imprensa"
                    className="inline-flex items-center gap-2 border border-brand-gold px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all"
                  >
                    Ver matérias e entrevistas &rarr;
                  </Link>
                </div>
              </div>

              {/* Press Clipping Thumbnail Preview */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative border-2 border-brand-gold/60 p-2 bg-brand-navy-light shadow-2xl max-w-sm">
                  <img
                    src="/images/impreensa.png"
                    alt="Clipping Imprensa - Jornal do Comércio"
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand-gold text-center mt-2">
                    Jornal do Comércio &bull; Perfil &amp; Trajetória
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
