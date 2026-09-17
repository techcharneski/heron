"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    books: 0,
    articles: 0,
    press: 0,
    presentations: 0,
    publications: 0,
    temas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [books, articles, press, presentations, publications, temas] = await Promise.all([
          fetch("/api/admin/collections/books").then((r) => r.json()),
          fetch("/api/admin/collections/articles").then((r) => r.json()),
          fetch("/api/admin/collections/press").then((r) => r.json()),
          fetch("/api/admin/collections/presentations").then((r) => r.json()),
          fetch("/api/admin/collections/publications").then((r) => r.json()),
          fetch("/api/admin/collections/temas").then((r) => r.json()),
        ]);

        setStats({
          books: Array.isArray(books) ? books.length : 0,
          articles: Array.isArray(articles) ? articles.length : 0,
          press: Array.isArray(press) ? press.length : 0,
          presentations: Array.isArray(presentations) ? presentations.length : 0,
          publications: Array.isArray(publications) ? publications.length : 0,
          temas: Array.isArray(temas) ? temas.length : 0,
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    { title: "Livros", count: stats.books, href: "/admin/livros", icon: "📚", color: "border-blue-500" },
    { title: "Artigos", count: stats.articles, href: "/admin/artigos", icon: "📰", color: "border-amber-500" },
    { title: "Imprensa", count: stats.press, href: "/admin/imprensa", icon: "🗞️", color: "border-emerald-500" },
    { title: "Apresentações", count: stats.presentations, href: "/admin/apresentacoes", icon: "🎥", color: "border-purple-500" },
    { title: "Produção Acadêmica", count: stats.publications, href: "/admin/publicacoes", icon: "📑", color: "border-indigo-500" },
    { title: "Temas de Pesquisa", count: stats.temas, href: "/admin/temas", icon: "🔍", color: "border-rose-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-brand-navy text-white p-8 border border-brand-gold/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold block">
            Painel Central de Edição
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold">
            Bem-vindo ao Painel Administrativo
          </h2>
          <p className="text-xs md:text-sm text-white/80 max-w-2xl leading-relaxed">
            Aqui você pode adicionar, editar e gerenciar absolutamente todo o conteúdo do site: textos institucionais das páginas, livros, artigos, notícias, vídeos, publicações acadêmicas e configurações de SEO.
          </p>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`bg-white p-6 border-l-4 ${c.color} border-t border-r border-b border-gray-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between group`}
          >
            <div>
              <span className="text-2xl block mb-2">{c.icon}</span>
              <h3 className="font-serif text-lg font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                {loading ? "Carregando..." : `${c.count} cadastrado(s)`}
              </p>
            </div>
            <span className="text-brand-navy font-bold text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 border border-gray-200 space-y-4">
        <h3 className="font-serif text-lg font-bold text-brand-navy">
          Ações Rápidas de Edição
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/paginas"
            className="p-4 border border-brand-gold/30 bg-brand-bg/50 hover:bg-brand-gold/10 transition-colors block text-left"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy block mb-1">
              📄 Editar Textos de Páginas
            </span>
            <span className="text-xs text-gray-600 block">
              Altere os textos da Home, Sobre, Pareceres, Serviços e Contato.
            </span>
          </Link>

          <Link
            href="/admin/midias"
            className="p-4 border border-brand-gold/30 bg-brand-bg/50 hover:bg-brand-gold/10 transition-colors block text-left"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy block mb-1">
              📁 Enviar Novo Arquivo / PDF
            </span>
            <span className="text-xs text-gray-600 block">
              Faça upload de capas de livros, PDFs de artigos ou imagens.
            </span>
          </Link>

          <Link
            href="/admin/configuracoes"
            className="p-4 border border-brand-gold/30 bg-brand-bg/50 hover:bg-brand-gold/10 transition-colors block text-left"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy block mb-1">
              ⚙️ Editar Rodapé &amp; SEO
            </span>
            <span className="text-xs text-gray-600 block">
              Atualize endereço, telefone, e-mail institucional e palavras-chave.
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
