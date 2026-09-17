"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciais inválidas");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Erro ao se conectar com o servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy p-4 selection:bg-brand-gold selection:text-brand-navy">
      <div className="w-full max-w-md bg-white border border-brand-gold/30 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold-dark px-3 py-1 bg-brand-navy/5 border border-brand-gold/20 inline-block">
            Painel de Gestão de Conteúdo
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy">
            Heron Charneski
          </h1>
          <p className="text-xs text-brand-navy/70">
            Digite suas credenciais para acessar o painel de administração.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
              Usuário
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário..."
              className="w-full px-3 py-2 text-sm border border-brand-gold/40 focus:outline-none focus:border-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha..."
              className="w-full px-3 py-2 text-sm border border-brand-gold/40 focus:outline-none focus:border-brand-navy"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 border border-brand-gold disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-gray-100">
          <a
            href="/"
            className="text-xs text-brand-navy/60 hover:text-brand-navy transition-colors font-mono"
          >
            ← Voltar para o site público
          </a>
        </div>
      </div>
    </div>
  );
}
