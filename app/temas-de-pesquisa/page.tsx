import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Linhas de Pesquisa | Prof. Dr. Heron Charneski",
  description: "Linhas de pesquisa acadêmica de Heron Charneski.",
};

export default function TemasDePesquisaLegacy() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-20 flex items-center justify-center">
        <div className="mx-auto max-w-6xl px-6 md:px-8 text-center space-y-8">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block border border-brand-gold/40 px-3 py-1 bg-brand-gold/10 inline-block">
            Investigação Científica
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy">
            Linhas de Pesquisa
          </h1>
          <p className="text-sm md:text-base text-brand-text/80 leading-relaxed font-serif">
            Os eixos de pesquisa e a minibio do Prof. Dr. Heron Charneski estão reunidos na seção **Sobre**.
          </p>

          <div>
            <Link
              href="/sobre"
              className="inline-flex items-center justify-center border border-brand-gold bg-brand-gold text-brand-navy text-xs md:text-sm font-bold uppercase tracking-wider px-8 py-4 hover:bg-transparent hover:text-brand-gold transition-all duration-300 shadow-md"
            >
              Ver Minibio, Linhas de Pesquisa e Reconhecimentos &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
