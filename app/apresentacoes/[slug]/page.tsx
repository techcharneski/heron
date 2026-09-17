import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection } from "@/lib/content";
import { Presentation } from "@/components/PresentationCard";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const presentations = (await getCollection("presentations")) as unknown as Presentation[];
  return presentations.map((p) => ({
    slug: p.slug || p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const presentations = (await getCollection("presentations")) as unknown as Presentation[];
  const item = presentations.find((p) => (p.slug || p.id) === slug);

  if (!item) {
    return {
      title: "Apresentação Não Encontrada | Prof. Dr. Heron Charneski",
    };
  }

  return {
    title: `${item.titulo} | Prof. Dr. Heron Charneski`,
    description: item.resumo || item.descricao,
  };
}

export default async function PresentationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const presentations = (await getCollection("presentations")) as unknown as Presentation[];
  const item = presentations.find((p) => (p.slug || p.id) === slug);

  if (!item) {
    notFound();
  }

  // Extract YouTube Embed URL helper
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(item.url);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-12 md:py-20">
        <article className="mx-auto max-w-4xl px-6 md:px-8 space-y-10">

          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4 text-xs">
            <div className="flex items-center gap-2 text-brand-text/60 font-sans">
              <Link href="/" className="hover:text-brand-gold-dark transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/apresentacoes" className="hover:text-brand-gold-dark transition-colors">
                Apresentações
              </Link>
              <span>/</span>
              <span className="text-brand-navy font-semibold truncate max-w-[200px] sm:max-w-md">
                {item.titulo}
              </span>
            </div>

            <Link
              href="/apresentacoes"
              className="inline-flex items-center gap-1 font-bold text-brand-gold-dark hover:text-brand-navy transition-colors shrink-0 uppercase tracking-wider text-[11px]"
            >
              &larr; Voltar
            </Link>
          </div>

          {/* Header Metadata */}
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider border text-brand-navy bg-brand-gold-light/40 border-brand-gold/30">
                {item.plataforma || "Conteúdo em Vídeo & Podcast"}
              </span>
              <span className="text-xs font-mono font-bold text-brand-gold-dark">
                {item.ano}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              {item.titulo}
            </h1>

            {item.resumo && (
              <p className="text-base md:text-lg text-brand-text/80 leading-relaxed font-serif italic border-l-2 border-brand-gold pl-4 py-1">
                {item.resumo}
              </p>
            )}
          </header>

          {/* YouTube Video Player Embed */}
          {embedUrl && (
            <div className="relative aspect-video w-full border-2 border-brand-gold bg-brand-navy overflow-hidden shadow-2xl">
              <iframe
                src={embedUrl}
                title={item.titulo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Article Text Content */}
          {item.conteudo && item.conteudo.length > 0 && (
            <div className="pt-6 border-t border-brand-gold/15 space-y-6">
              {item.conteudo.map((block, idx) => {
                if (block.tipo === "subtitulo") {
                  return (
                    <h2
                      key={idx}
                      className="font-serif text-xl md:text-2xl font-bold text-brand-navy pt-6 border-b border-brand-gold/20 pb-2 tracking-wide uppercase"
                    >
                      {block.texto}
                    </h2>
                  );
                }

                if (block.tipo === "citacao") {
                  return (
                    <blockquote
                      key={idx}
                      className="border-l-4 border-brand-gold bg-white p-5 md:p-6 italic font-serif text-brand-navy text-sm md:text-base leading-relaxed my-4 shadow-sm border border-brand-gold/20"
                    >
                      {block.texto}
                    </blockquote>
                  );
                }

                return (
                  <p key={idx} className="text-sm md:text-base text-brand-text/85 leading-relaxed font-serif">
                    {block.texto}
                  </p>
                );
              })}
            </div>
          )}

          {/* Source Link Section */}
          {item.fonte && (
            <div className="pt-8 border-t border-brand-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 border border-brand-gold/30">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                  Publicação Original
                </span>
                <p className="text-xs font-serif text-brand-navy font-semibold mt-0.5">
                  Portal da Reforma Tributária &bull; Podcast Tax Capital
                </p>
              </div>
              <a
                href={item.fonte}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-brand-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-gold-dark hover:bg-brand-gold hover:text-brand-navy transition-all shrink-0"
              >
                Acessar Matéria Original &rarr;
              </a>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-brand-gold/20 flex justify-between items-center">
            <Link
              href="/apresentacoes"
              className="inline-flex items-center gap-2 border border-brand-navy px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
            >
              &larr; Voltar para Apresentações
            </Link>
          </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
