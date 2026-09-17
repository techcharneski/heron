import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublicationCard, { Publication } from "@/components/PublicationCard";
import { getCollection } from "@/lib/content";

export const metadata = {
  title: "Artigos e Capítulos de Livros | Prof. Dr. Heron Charneski",
  description: "Acervo de artigos científicos, publicações em co-autoria e capítulos de livros do Prof. Dr. Heron Charneski.",
};

export default async function ArtigosPage() {
  const articlesData = await getCollection("articles");
  const articles = (articlesData || []) as unknown as Publication[];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8 space-y-10">
          
          {/* Header Intro */}
          <div className="max-w-[720px] space-y-3 border-b border-brand-gold/20 pb-8">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
              Produção Bibliográfica Indexada
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              Artigos e Capítulos de Livros
            </h1>
            <p className="text-sm md:text-base text-brand-text/80 leading-relaxed font-serif">
              Acervo de artigos individuais, artigos publicados em co-autoria com renomados juristas e capítulos de coletâneas jurídicas doutrinárias.
            </p>
          </div>

          {/* Articles List (1 per row) */}
          <div className="flex flex-col space-y-6 pt-2">
            {articles.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
