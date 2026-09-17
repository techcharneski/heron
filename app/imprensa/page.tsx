import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PressCard, { PressItem } from "@/components/PressCard";
import { getCollection } from "@/lib/content";

export const metadata = {
  title: "Imprensa | Prof. Dr. Heron Charneski",
  description: "Reportagens, entrevistas e artigos na imprensa de Heron Charneski.",
};

export default async function ImprensaPage() {
  const pressData = await getCollection("press");
  const items = (pressData || []) as unknown as PressItem[];
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8 space-y-12">
          
          {/* Header Intro */}
          <div className="max-w-[760px] space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#E5ECF2] text-[#203854] px-3.5 py-1 text-xs font-bold uppercase tracking-widest rounded-md">
              Mídia & Opinião Pública
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              Reportagens e Imprensa
            </h1>
            <p className="text-base md:text-lg text-brand-text/80 leading-relaxed font-serif">
              Análises técnicas, opiniões de especialista e reportagens veiculadas nos principais veículos de comunicação e jornais de economia e direito.
            </p>
          </div>

          {/* Press Grid Section */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-gold-dark">
                Publicações e Aparições ({items.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {items.map((item) => (
                <PressCard key={item.id} item={item} />
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
