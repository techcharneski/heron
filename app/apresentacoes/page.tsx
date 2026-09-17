import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PresentationCard from "@/components/PresentationCard";
import { getCollection } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Apresentações, Sustentações Orais e Palestras | Prof. Dr. Heron Charneski",
  description: "Apresentações, sustentações orais e palestras em vídeo de Heron Charneski.",
};

export default async function Apresentacoes() {
  const presentationsData = (await getCollection("presentations")) || [];
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8 space-y-10">
          
          {/* Header Intro */}
          <div className="max-w-[720px] border-b border-brand-gold/20 pb-6">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              Apresentações, Sustentações Orais e Palestras
            </h1>
          </div>

          {/* Unified Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {presentationsData.map((item) => (
              <PresentationCard key={item.id} item={item as any} />
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
