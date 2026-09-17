import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AreaBlock from "@/components/AreaBlock";
import Link from "next/link";
import { getPagesContent } from "@/lib/content";

export const metadata = {
  title: "Serviços e Atuação Profissional | Prof. Dr. Heron Charneski",
  description: "Pareceres Jurídicos, Consultoria Tributária e Societária, Cursos e Palestras com o Prof. Dr. Heron Charneski.",
};

const defaultServices = [
  {
    title: "Pareceres Jurídicos & Opiniões Técnicas",
    description: "Elaboração de pareceres jurídicos e doutrinários de alta densidade técnica para fundamentação de litígios tributários de elevada complexidade, teses constitucionais e consultas sobre a interface entre Direito e Contabilidade.",
    focusPoints: [
      "Análise de precedentes e teses sob repercussão geral no STF e STJ",
      "Interpretação sistemática de normas contábeis internacionais (IFRS) e fiscais",
      "Impactos conceituais e operacionais da Reforma Tributária (IBS e CBS)",
      "Avaliação de contingências e prevenção de litígios fiscais corporativos"
    ]
  },
  {
    title: "Consultoria Tributária & Planejamento Societário",
    description: "Orientação técnica e estratégica para corporações em matérias tributárias complexas, reorganizações societárias, planejamento tributário nacional e internacional e adequação às novas exigências regulatórias.",
    focusPoints: [
      "Adequação ao novo regime de Preços de Transferência (Lei nº 14.596/23)",
      "Reorganizações societárias, incorporações, cisões e M&A sob a ótica fiscal",
      "Modelagem e precificação da transição para o modelo de IVA Dual",
      "Governança tributária e conformidade fiscal de grandes grupos"
    ]
  },
  {
    title: "Cursos, Magistério & Capacitação Corporativa",
    description: "Docência em módulos de pós-graduação, especializações universitárias (IGET/USP) e treinamentos in-company customizados para equipes jurídicas, contábeis e de planejamento fiscal.",
    focusPoints: [
      "Módulos de especialização em Lucro Real, IFRS e Contabilidade Tributária",
      "Treinamentos in-company sobre a transição prática para o IBS/CBS",
      "Cursos sobre a jurisprudência tributária dos Tribunais Superiores",
      "Capacitação executiva para gestores fiscais e diretores jurídicos"
    ]
  },
  {
    title: "Palestras, Conferências & Simpósios",
    description: "Exposições didáticas e palestras de abertura/encerramento em congressos nacionais, simpósios de Direito Tributário, eventos associativos e encontros corporativos.",
    focusPoints: [
      "Conferências de abertura em congressos e simpósios jurídicos",
      "Painéis sobre os pilares dogmáticos da Reforma Tributária",
      "Palestras magnas para entidades setoriais e associações comerciais",
      "Debates sobre jurisprudência fiscal e contencioso constitucional"
    ]
  }
];

export default async function ServicosPage() {
  const pagesData = await getPagesContent();
  const servicosData = pagesData?.servicos || {};
  const servicesList = servicosData.servicesList || defaultServices;

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8 space-y-16">
          
          {/* Header Intro */}
          <div className="max-w-[780px] space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#E5ECF2] text-[#203854] px-3.5 py-1 text-xs font-bold uppercase tracking-widest rounded-md">
              {servicosData.badge || "Atuação Especializada • Serviços"}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
              {servicosData.title || "Serviços e Áreas de Atuação"}
            </h1>
            <p className="text-base md:text-lg text-brand-text/80 leading-relaxed font-serif">
              {servicosData.subtitle || "Integração entre Ciência Contábil, Direito Tributário e Dogmática Jurídica na prestação de pareceres, consultoria técnica, docência e conferências."}
            </p>
          </div>

          {/* Core Services Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-brand-gold-dark">
                Pilares de Atuação Profissional e Acadêmica
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {servicesList.map((service: any, index: number) => (
                <AreaBlock
                  key={index}
                  title={service.title}
                  description={service.description}
                  focusPoints={service.focusPoints}
                />
              ))}
            </div>
          </section>

          {/* Detailed Description Section */}
          <section className="bg-white border border-brand-gold/25 p-8 md:p-12 shadow-sm space-y-8">
            <div className="border-b border-brand-gold/20 pb-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block mb-1">
                Metodologia de Atuação
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy">
                Diferenciais da Atuação Acadêmico-Técnica
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/15 text-brand-gold-dark font-bold font-mono text-sm flex items-center justify-center border border-brand-gold/30">
                  01
                </div>
                <h3 className="font-serif font-bold text-brand-navy text-base">
                  Rigor Hermenêutico e Doutrinário
                </h3>
                <p className="text-xs md:text-sm text-brand-text/80 leading-relaxed font-serif">
                  Fundamentação jurisprudencial e doutrinária sólida respaldada em pesquisas acadêmicas na Faculdade de Direito da USP e UC Davis.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/15 text-brand-gold-dark font-bold font-mono text-sm flex items-center justify-center border border-brand-gold/30">
                  02
                </div>
                <h3 className="font-serif font-bold text-brand-navy text-base">
                  Visão Dupla: Direito &amp; Contabilidade
                </h3>
                <p className="text-xs md:text-sm text-brand-text/80 leading-relaxed font-serif">
                  Domínio técnico da Ciência Contábil (UFRGS) aliado à reflexão jurídica (PUCRS e USP), viabilizando a compreensão das demonstrações financeiras.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/15 text-brand-gold-dark font-bold font-mono text-sm flex items-center justify-center border border-brand-gold/30">
                  03
                </div>
                <h3 className="font-serif font-bold text-brand-navy text-base">
                  Foco na Reforma Tributária (IBS/CBS)
                </h3>
                <p className="text-xs md:text-sm text-brand-text/80 leading-relaxed font-serif">
                  Análise pioneira das diretrizes constitutivas do novo sistema IVA Dual, fornecendo diretrizes para a transição fiscal com segurança jurídica.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Call to Action */}
          <section className="bg-brand-navy text-white p-8 md:p-12 rounded-2xl shadow-xl border-2 border-brand-gold/40 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold block">
                Solicitação de Serviços &amp; Convites
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">
                Entre em Contato para Pareceres ou Convites
              </h2>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                Para consultas sobre elaboração de pareceres técnicos, agendamento de palestras, coordenação de cursos in-company ou convites para simpósios.
              </p>
            </div>

            <Link
              href="/contato"
              className="inline-flex items-center justify-center border border-brand-gold bg-brand-gold text-brand-navy text-xs md:text-sm font-bold uppercase tracking-wider px-8 py-4 hover:bg-white hover:text-brand-navy transition-all duration-300 shadow-md shrink-0 rounded-xl"
            >
              Enviar Mensagem &rarr;
            </Link>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
