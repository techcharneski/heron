import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection } from "@/lib/content";
import { Metadata } from "next";
import { PressItem } from "@/components/PressCard";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const items = ((await getCollection("press")) || []) as unknown as PressItem[];
  return items.map((p) => ({
    slug: p.slug || p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const items = ((await getCollection("press")) || []) as unknown as PressItem[];
  const item = items.find((p) => (p.slug || p.id) === slug);

  if (!item) {
    return {
      title: "Matéria Não Encontrada | Prof. Dr. Heron Charneski",
    };
  }

  return {
    title: `${item.titulo} | Imprensa — Prof. Dr. Heron Charneski`,
    description: item.resumo,
  };
}

export default async function PressItemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const items = ((await getCollection("press")) || []) as unknown as PressItem[];
  const item = items.find((p) => (p.slug || p.id) === slug);

  if (!item) {
    notFound();
  }

  const downloadFile = item.pdfUrl || item.arquivoDownload;

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-12 md:py-20">
        <article className="mx-auto max-w-4xl px-6 md:px-8 space-y-10">

          {/* Breadcrumb & Top Navigation */}
          <div className="flex flex-wrap items-center justify-between border-b border-brand-gold/20 pb-4 text-xs gap-3">
            <div className="flex items-center gap-2 text-brand-text/60 font-sans">
              <Link href="/" className="hover:text-brand-gold-dark transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/imprensa" className="hover:text-brand-gold-dark transition-colors">
                Imprensa
              </Link>
              <span>/</span>
              <span className="text-brand-navy font-semibold truncate max-w-[200px] sm:max-w-md">
                {item.titulo}
              </span>
            </div>

            <Link
              href="/imprensa"
              className="inline-flex items-center gap-1.5 font-bold text-brand-gold-dark hover:text-brand-navy transition-colors shrink-0 uppercase tracking-wider text-[11px]"
            >
              &larr; Voltar para Imprensa
            </Link>
          </div>

          {/* Article Header Metadata */}
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#E5ECF2] text-[#203854] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md">
                {item.categoria || "IMPRENSA"}
              </span>
              <span className="text-xs font-sans font-bold text-brand-gold-dark">
                {item.veiculo}
              </span>
              <span className="text-brand-gold/50">&bull;</span>
              <span className="text-xs font-sans text-slate-500 font-medium">
                {item.data}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              {item.titulo}
            </h1>

            {item.subtitulo && (
              <p className="text-base md:text-xl text-brand-navy/80 font-serif font-medium leading-relaxed">
                {item.subtitulo}
              </p>
            )}

            {item.resumo && (
              <div className="border-l-4 border-brand-gold bg-white p-5 md:p-6 italic font-serif text-brand-navy text-sm md:text-base leading-relaxed shadow-sm border border-brand-gold/20 rounded-r-xl">
                {item.resumo}
              </div>
            )}
          </header>

          {/* Newspaper Clipping Image Container & External Action Bar */}
          <section className="space-y-4">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-lg overflow-hidden group">
              <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden rounded-xl">
                <img
                  src={item.imagem}
                  alt={item.titulo}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Action Toolbar overlay below image */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="text-xs text-slate-500 font-sans font-medium">
                  Publicação em: <strong className="text-brand-navy">{item.veiculo}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {downloadFile && (
                    <a
                      href={downloadFile}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-300 transition-colors"
                    >
                      <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Baixar PDF</span>
                    </a>
                  )}

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-brand-navy transition-all shadow-sm"
                  >
                    <span>Acessar Veículo Original</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Article Content Paragraphs / Rich Blocks */}
          {Array.isArray(item.conteudo) && item.conteudo.length > 0 ? (
            <section className="pt-6 border-t border-brand-gold/20 space-y-6">
              {item.conteudo.map((block: any, idx: number) => {
                if (typeof block === "string") {
                  return (
                    <p key={idx} className="text-base md:text-lg text-brand-text/85 leading-relaxed font-serif whitespace-pre-line">
                      {block}
                    </p>
                  );
                }

                if (block.tipo === "subtitulo") {
                  return (
                    <h2
                      key={idx}
                      className="font-serif text-xl md:text-2xl font-bold text-brand-navy pt-6 border-b border-brand-gold/20 pb-2 tracking-wide"
                    >
                      {block.texto}
                    </h2>
                  );
                }

                if (block.tipo === "citacao") {
                  return (
                    <blockquote
                      key={idx}
                      className="border-l-4 border-brand-gold bg-white p-5 md:p-6 italic font-serif text-brand-navy text-base md:text-lg leading-relaxed my-4 shadow-sm border border-brand-gold/20 rounded-r-xl"
                    >
                      &ldquo;{block.texto}&rdquo;
                    </blockquote>
                  );
                }

                if (block.tipo === "imagem") {
                  const imgUrl = block.url || block.texto;
                  return (
                    <figure key={idx} className="my-6">
                      <img src={imgUrl} alt={block.legenda || "Imagem no artigo"} className="w-full max-h-[500px] object-cover rounded-xl border border-slate-200 shadow-md" />
                      {block.legenda && (
                        <figcaption className="text-xs text-slate-500 font-sans mt-2 text-center italic">
                          {block.legenda}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.tipo === "lista" && Array.isArray(block.itens)) {
                  return (
                    <ul key={idx} className="space-y-2 my-4 pl-4 border-l-2 border-brand-gold/40">
                      {block.itens.map((it: string, iIdx: number) => (
                        <li key={iIdx} className="text-base font-serif text-brand-text/85 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-gold rotate-45 mt-2.5 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={idx} className="text-base md:text-lg text-brand-text/85 leading-relaxed font-serif whitespace-pre-line">
                    {block.texto || block}
                  </p>
                );
              })}
            </section>
          ) : typeof item.conteudo === "string" && (item.conteudo as string).trim() ? (
            <section
              className="pt-6 border-t border-brand-gold/20 space-y-6 font-serif text-base md:text-lg text-brand-text/85 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.conteudo }}
            />
          ) : null}

          {/* Download Box (If PDF exists) */}
          {downloadFile && (
            <section className="bg-gradient-to-r from-brand-navy to-[#001D40] text-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-brand-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold block">
                  Documento Completo
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  Arquivo da Publicação para Download
                </h3>
                <p className="text-xs sm:text-sm text-white/80 max-w-lg">
                  Faça o download do arquivo PDF contendo a matéria e reportagem publicada na imprensa.
                </p>
              </div>

              <a
                href={downloadFile}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-brand-gold text-brand-navy hover:bg-white hover:text-brand-navy px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 border border-brand-gold"
              >
                <span>Baixar Documento (PDF)</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </section>
          )}

          {/* Bottom Back Button */}
          <div className="pt-6 border-t border-brand-gold/20 flex justify-between items-center">
            <Link
              href="/imprensa"
              className="inline-flex items-center gap-2 border border-brand-navy px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-navy hover:bg-brand-navy hover:text-white transition-all rounded-xl"
            >
              &larr; Voltar para Imprensa
            </Link>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
