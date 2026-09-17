import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Produção Acadêmica | Prof. Dr. Heron Charneski",
  description: "Redirecionamento para o acervo de Livros e Artigos do Prof. Dr. Heron Charneski.",
};

export default function ProducaoAcademicaLegacy() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-20 flex items-center justify-center">
        <div className="mx-auto max-w-6xl px-6 md:px-8 text-center space-y-8">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block border border-brand-gold/40 px-3 py-1 bg-brand-gold/10 inline-block">
            Acervo Reorganizado
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy">
            Produção Acadêmica
          </h1>
          <p className="text-sm md:text-base text-brand-text/80 leading-relaxed font-serif">
            A produção intelectual de Heron Charneski está organizada em duas seções principais:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <Link
              href="/livros"
              className="p-8 bg-white border border-brand-gold/30 hover:border-brand-gold hover:shadow-xl transition-all space-y-3 group"
            >
              <h3 className="font-serif text-xl font-bold text-brand-navy group-hover:text-brand-gold-dark transition-colors">
                Livros Publicados &rarr;
              </h3>
              <p className="text-xs text-brand-text/75 leading-relaxed">
                Obras completas com capas visuais, resumos e informações editoriais.
              </p>
            </Link>

            <Link
              href="/artigos"
              className="p-8 bg-white border border-brand-gold/30 hover:border-brand-gold hover:shadow-xl transition-all space-y-3 group"
            >
              <h3 className="font-serif text-xl font-bold text-brand-navy group-hover:text-brand-gold-dark transition-colors">
                Artigos e Capítulos &rarr;
              </h3>
              <p className="text-xs text-brand-text/75 leading-relaxed">
                Artigos individuais, em co-autoria e capítulos de coletâneas jurídicas.
              </p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
