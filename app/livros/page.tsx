import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCover3D from "@/components/BookCover3D";
import { getCollection } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Livros Publicados | Prof. Dr. Heron Charneski",
  description: "Obras individuais e coordenações científicas publicadas por Heron Charneski sobre Reforma Tributária, IFRS, Lucro Real e Federalismo Fiscal.",
};

const themeMap: Record<string, "navy" | "bordeaux" | "emerald" | "indigo"> = {
  "livro-reforma-tributaria": "navy",
  "livro-lucro-real-ifrs": "bordeaux",
  "livro-normas-internacionais": "emerald",
  "livro-tributacao-autonomia": "indigo",
  "livro-normas-internacionais-tributacao": "navy",
  "livro-temas-atuais-gestao-empresarial-tributos": "bordeaux"
};

export default async function LivrosPage() {
  const booksData = await getCollection("books");
  const obrasIndividuais = booksData.filter(
    (b) => (b as any).categoria === "Obras Individuais"
  );
  const coordenacaoLivros = booksData.filter(
    (b) => (b as any).categoria === "Coordenação de Livros"
  );

  const renderBookCard = (book: any, index: number, isCoordinated: boolean) => {
    const isEven = index % 2 === 0;
    const theme = themeMap[book.id] || "navy";

    return (
      <div 
        key={book.id}
        id={book.id}
        className="bg-white border border-brand-gold/25 p-8 md:p-12 shadow-lg relative overflow-hidden"
      >
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
          isEven ? "" : "lg:flex-row-reverse"
        }`}>
          
          {/* Cover 3D display */}
          <div className={`lg:col-span-5 flex flex-col items-center justify-center p-8 bg-brand-navy border border-brand-gold/30 text-white ${
            isEven ? "lg:order-1" : "lg:order-2"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 border ${
                isCoordinated
                  ? "bg-indigo-950/80 border-indigo-400/50 text-indigo-200"
                  : "bg-brand-gold/20 border-brand-gold/50 text-brand-gold"
              }`}>
                {isCoordinated ? "Coordenação de Livro" : "Obra Individual"}
              </span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand-gold/80">
                &bull; {book.ano}
              </span>
            </div>

            <BookCover3D
              titulo={book.titulo}
              subtitulo={book.subtitulo}
              autor={book.autor}
              ano={book.ano}
              editora={book.editora}
              isbn={book.isbn}
              imagemCapa={(book as any).imagemCapa}
              theme={theme}
              size="md"
            />
            <div className="mt-4 text-center text-xs font-mono text-brand-gold/80">
              {book.editora} &bull; {book.paginas || "Livro impresso"}
            </div>
          </div>

          {/* Book text details */}
          <div className={`lg:col-span-7 space-y-6 ${
            isEven ? "lg:order-2" : "lg:order-1"
          }`}>
            <div className="space-y-2 border-b border-brand-gold/15 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark">
                  {book.editora} &bull; {book.ano}
                </span>
                <span className="text-[10px] font-mono text-brand-text/50">&bull;</span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-brand-navy/70">
                  {(book as any).papel === "Coordenador" ? "Coordenação Científica" : "Autoria Individual"}
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy leading-tight">
                {book.titulo}
              </h3>
              {book.subtitulo && (
                <p className="font-serif text-sm italic text-brand-text/80 leading-relaxed">
                  {book.subtitulo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                Resumo da Pesquisa:
              </span>
              <p className="text-sm md:text-base text-brand-text/80 leading-relaxed font-serif whitespace-pre-line">
                {book.resumo}
              </p>
            </div>

            {book.topicos && (
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                  Principais Temas Analisados:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-text/80">
                  {book.topicos.map((topico: string, tIdx: number) => (
                    <li key={tIdx} className="flex items-start gap-2 p-2 bg-brand-bg border border-brand-gold/15">
                      <span className="w-1.5 h-1.5 bg-brand-gold rotate-45 mt-1 shrink-0" />
                      <span>{topico}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(book as any).linkAmazon && (
              <div className="pt-4 border-t border-brand-gold/15">
                <a
                  href={(book as any).linkAmazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-brand-navy text-white hover:text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/40 hover:border-brand-gold transition-all shadow-md group"
                >
                  <svg className="w-4 h-4 fill-brand-gold group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  <span>
                    {(book as any).linkAmazon.includes("nsmeditora") 
                      ? "Adquirir na NSM Editora" 
                      : "Comprar na Amazon"} &rarr;
                  </span>
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8 space-y-20">
          
          {/* Header Intro */}
          <div className="max-w-[760px] space-y-4">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
              Produção Autoral & Coordenação Editorial
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              Obras e Livros Publicados
            </h1>
            <p className="text-sm md:text-base text-brand-text/80 leading-relaxed font-serif italic border-l-2 border-brand-gold pl-4 py-1">
              Acervo acadêmico compreendendo monografias autorais exclusivas e obras jurídicas coletivas coordenadas pelo Prof. Dr. Heron Charneski.
            </p>
          </div>

          {/* Section 1: Obras Individuais */}
          <div className="space-y-12">
            <div className="border-b border-brand-gold/30 pb-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                Produção Monográfica (4 Obras)
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy mt-1">
                Obras Individuais
              </h2>
              <p className="text-xs md:text-sm text-brand-text/75 mt-1 font-serif">
                Livros e monografias jurídicas de autoria única e pesquisa doutrinária autoral.
              </p>
            </div>

            <div className="space-y-16">
              {obrasIndividuais.map((book, index) => renderBookCard(book, index, false))}
            </div>
          </div>

          {/* Section 2: Coordenação de Livros */}
          <div className="space-y-12 pt-8">
            <div className="border-b border-brand-gold/30 pb-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                Obras Coletivas (2 Obras)
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy mt-1">
                Coordenação de Livros
              </h2>
              <p className="text-xs md:text-sm text-brand-text/75 mt-1 font-serif">
                Coletâneas doutrinárias e estudos práticos sob a coordenação científica e editorial do Prof. Dr. Heron Charneski.
              </p>
            </div>

            <div className="space-y-16">
              {coordenacaoLivros.map((book, index) => renderBookCard(book, index, true))}
            </div>
          </div>

          {/* Institutional Note */}
          <div className="border-t border-brand-gold/20 pt-8 max-w-3xl">
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-brand-gold-dark mb-2">
              Disponibilidade e Aquisição
            </h3>
            <p className="text-xs text-brand-text/70 leading-relaxed">
              As obras acima foram publicadas por editoras jurídicas de prestígio (NSM Editora, IBDT, Quartier Latin e BH Editora). Estão disponíveis nas principais livrarias jurídicas do país e bibliotecas universitárias.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
