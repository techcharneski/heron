"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Visão Geral", href: "/admin", icon: "📊" },
  { label: "Contatos / Leads", href: "/admin/contatos", icon: "📬" },
  { label: "Textos de Páginas", href: "/admin/paginas", icon: "📄" },
  { label: "Livros", href: "/admin/livros", icon: "📚" },
  { label: "Artigos", href: "/admin/artigos", icon: "📰" },
  { label: "Apresentações", href: "/admin/apresentacoes", icon: "🎥" },
  { label: "Imprensa", href: "/admin/imprensa", icon: "🗞️" },
  { label: "Produção Acadêmica", href: "/admin/publicacoes", icon: "📑" },
  { label: "Temas de Pesquisa", href: "/admin/temas", icon: "🔍" },
  { label: "Arquivos e Mídias", href: "/admin/midias", icon: "📁" },
  { label: "Configurações & SEO", href: "/admin/configuracoes", icon: "⚙️" },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // If we are on login page, render plain container
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 font-sans selection:bg-brand-gold selection:text-brand-navy">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white flex flex-col shrink-0 border-r border-brand-gold/30">
        <div className="p-6 border-b border-brand-gold/20 flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
            Dashboard Administrativo
          </span>
          <h2 className="font-serif text-xl font-bold tracking-tight text-white">
            Heron Charneski
          </h2>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-brand-gold text-brand-navy font-extrabold shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-gold/20 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-center py-2 px-3 text-xs font-mono text-brand-gold border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-navy transition-all"
          >
            ↗ Ver Site Público
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-center py-2 px-3 text-xs font-mono text-red-300 border border-red-400/30 hover:bg-red-500/20 transition-colors"
          >
            {loggingOut ? "Saindo..." : "Sair do Painel"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-mono text-gray-400 block uppercase tracking-wider">
              Painel de Edição Total
            </span>
            <h1 className="text-lg font-serif font-bold text-brand-navy">
              {NAV_ITEMS.find((item) => item.href === pathname)?.label || "Administração"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1 border border-gray-200">
              Sessão Ativa: Admin
            </span>
          </div>
        </header>

        <main className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
