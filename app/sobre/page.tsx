import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPagesContent } from "@/lib/content";

export const metadata = {
  title: "Sobre | Prof. Dr. Heron Charneski",
  description: "Minibio, linhas de pesquisa acadêmica e reconhecimentos factuais de Heron Charneski.",
};

export default async function Sobre() {
  const pagesData = await getPagesContent();
  const sobreData = pagesData?.sobre || {};

  const formation = sobreData.formation || [];
  const timeline = sobreData.timeline || [];
  const recognitions = sobreData.recognitions || [];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8 space-y-16">
          
          {/* Header Intro / Minibio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-6 max-w-[680px]">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                {sobreData.badge || "Minibio e Trajetória"}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
                {sobreData.title || "Heron Charneski"}
              </h1>
              <p className="text-xs md:text-sm font-sans font-bold uppercase tracking-widest text-brand-gold-dark border-l-2 border-brand-gold pl-3 py-0.5">
                {sobreData.subtitle || "Advogado, Contador, Professor, Parecerista e Autor"}
              </p>

              <div className="text-sm md:text-base text-brand-text/80 space-y-5 leading-relaxed pt-2">
                {(sobreData.introParagraphs || [
                  "Doutor e Mestre em Direito Econômico, Financeiro e Tributário pela Faculdade de Direito da USP.",
                  "Sócio-diretor do escritório Charneski Advogados e parecerista em matérias tributárias e societárias complexas."
                ]).map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Sidebar Portrait */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-80 md:w-72 md:h-96">
                <div className="absolute top-4 left-4 right-[-16px] bottom-[-16px] border-2 border-brand-gold/60 z-0" />
                <div className="absolute inset-0 bg-brand-navy-light overflow-hidden z-10 shadow-xl border border-brand-gold/20">
                  <img 
                    src="/images/heron-charneski.webp" 
                    alt="Prof. Dr. Heron Charneski" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Reportagem em Destaque — Jornal do Comércio (Perfil & Trajetória) */}
          <section className="pt-12 border-t border-brand-gold/15 space-y-6">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
              Perfil e Trajetória na Mídia
            </span>

            <div className="bg-brand-navy text-white border-2 border-brand-gold p-8 md:p-12 relative overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-6 space-y-4">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand-gold block">
                    Jornal do Comércio &bull; Retrato / Perfil
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                    Da literatura para a legislação e os números contábeis
                  </h2>
                  <p className="text-xs md:text-sm text-white/80 leading-relaxed font-serif">
                    Perfil biográfico e reportagem especial publicada no Jornal do Comércio, destacando a trajetória de Heron Charneski desde a afinidade juvenil pelas letras até a dupla graduação em Direito (PUCRS) e Ciências Contábeis (UFRGS) e sua atuação no contencioso tributário.
                  </p>
                  <div className="pt-2">
                    <a
                      href="/images/impreensa.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-brand-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all"
                    >
                      Ver Matéria Impressa &rarr;
                    </a>
                  </div>
                </div>

                {/* Visual Newspaper Clipping Image Display */}
                <div className="md:col-span-6 flex justify-center">
                  <a
                    href="/images/impreensa.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative border border-brand-gold bg-white p-2 shadow-2xl max-w-md group block"
                  >
                    <img
                      src="/images/impreensa.png"
                      alt="Reportagem Jornal do Comércio - Retrato / Heron Charneski"
                      className="w-full h-auto object-contain block opacity-95 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-brand-navy block text-center mt-2">
                      Página Impressa &bull; Jornal do Comércio
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Reconhecimentos Factuais */}
          <section className="pt-12 border-t border-brand-gold/15 space-y-8">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block mb-1">
                Acreditações Fiscais e Jurídicas
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy">
                Reconhecimentos Factuais
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recognitions.map((rec: any, idx: number) => (
                <div key={rec.id || idx} className="p-6 bg-white border border-brand-gold/30 shadow-xs hover:shadow-md transition-shadow">
                  <span className="text-[10px] font-mono font-bold uppercase text-brand-gold-dark block mb-1">
                    {rec.edition} &bull; {rec.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-brand-navy mb-2">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-brand-navy/80 leading-relaxed font-sans">
                    {rec.details}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Formação Acadêmica (Timeline) */}
          <section className="pt-12 border-t border-brand-gold/15 space-y-8 max-w-[680px]">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block mb-1">
                Titulação e Graduações
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy">
                Formação Acadêmica Completa
              </h2>
            </div>

            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-gold/40">
              {formation.map((item: any, idx: number) => (
                <div key={item.id || idx} className="relative pl-10 group">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 bg-brand-gold border-2 border-white rounded-full group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-mono font-bold text-brand-gold-dark block mb-1">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-base md:text-lg font-bold text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-navy/70 uppercase tracking-wider mb-2">
                    {item.institution}
                  </p>
                  <p className="text-xs md:text-sm text-brand-navy/80 font-sans leading-relaxed">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Atuação Profissional */}
          <section className="pt-12 border-t border-brand-gold/15 space-y-8 max-w-[680px]">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block mb-1">
                Trajetória Institucional
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy">
                Atuação Profissional e Docente
              </h2>
            </div>

            <div className="space-y-8">
              {timeline.map((item: any, idx: number) => (
                <div key={item.id || idx} className="p-6 bg-white border border-brand-gold/20 shadow-xs">
                  <span className="text-xs font-mono font-bold text-brand-gold-dark block mb-1">
                    {item.period}
                  </span>
                  <h3 className="font-serif text-base md:text-lg font-bold text-brand-navy">
                    {item.role}
                  </h3>
                  <p className="text-xs font-semibold text-brand-navy/70 uppercase tracking-wider mb-2">
                    {item.organization}
                  </p>
                  <p className="text-xs md:text-sm text-brand-navy/80 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
