"use client";

import { useEffect, useState } from "react";
import MediaUploadInput from "@/components/admin/MediaUploadInput";

export default function ArticlesManager() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections/articles");
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!editingArticle) return;
    setSaving(true);
    setMessage("");

    let updated;
    const exists = articles.some((a) => a.id === editingArticle.id);
    if (exists) {
      updated = articles.map((a) => (a.id === editingArticle.id ? editingArticle : a));
    } else {
      updated = [editingArticle, ...articles];
    }

    try {
      const res = await fetch("/api/admin/collections/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao salvar artigo");

      setArticles(updated);
      setEditingArticle(null);
      setMessage("Artigo salvo com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao salvar artigo");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;
    const updated = articles.filter((a) => a.id !== id);

    try {
      const res = await fetch("/api/admin/collections/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao excluir artigo");

      setArticles(updated);
      setMessage("Artigo excluído com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao excluir artigo");
    }
  }

  const startNewArticle = () => {
    setEditingArticle({
      id: `artigo-${Date.now()}`,
      slug: `artigo-${Date.now()}`,
      titulo: "",
      autor: "Heron Charneski",
      veiculo: "",
      data: "",
      ano: new Date().getFullYear(),
      pdfUrl: "",
      detalhes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Gerenciador de Artigos de Opinião &amp; Doutrina
          </h2>
          <p className="text-xs text-gray-500">
            Adicione, edite ou remova artigos de opinião e newsletters jurídicas.
          </p>
        </div>

        <button
          onClick={startNewArticle}
          className="px-5 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold"
        >
          + Adicionar Novo Artigo
        </button>
      </div>

      {message && (
        <div className="p-4 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {message}
        </div>
      )}

      {/* EDIT MODAL / FORM */}
      {editingArticle && (
        <div className="bg-white p-6 border-2 border-brand-gold space-y-4 shadow-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              {articles.some((a) => a.id === editingArticle.id) ? "Editar Artigo" : "Novo Artigo"}
            </h3>
            <button
              onClick={() => setEditingArticle(null)}
              className="text-xs font-bold text-gray-500 hover:text-black"
            >
              ✕ Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase mb-1">Título do Artigo</label>
              <input
                type="text"
                value={editingArticle.titulo || ""}
                onChange={(e) => setEditingArticle({ ...editingArticle, titulo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Autor</label>
              <input
                type="text"
                value={editingArticle.autor || ""}
                onChange={(e) => setEditingArticle({ ...editingArticle, autor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Veículo / Publicação</label>
              <input
                type="text"
                value={editingArticle.veiculo || ""}
                onChange={(e) => setEditingArticle({ ...editingArticle, veiculo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 border border-gray-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-navy block">
                🗓️ Data de Publicação (Mês / Ano)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-gray-600">Selecione o Mês</label>
                  <select
                    value={
                      [
                        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                      ].find((m) => (editingArticle.data || "").toLowerCase().includes(m.toLowerCase())) || "Setembro"
                    }
                    onChange={(e) => {
                      const selMonth = e.target.value;
                      const selYear = editingArticle.ano || new Date().getFullYear();
                      setEditingArticle({
                        ...editingArticle,
                        data: `${selMonth} / ${selYear}`,
                        ano: selYear,
                      });
                    }}
                    className="w-full p-2 text-sm border border-gray-300 bg-white"
                  >
                    {[
                      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                    ].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-gray-600">Selecione o Ano</label>
                  <select
                    value={editingArticle.ano || new Date().getFullYear()}
                    onChange={(e) => {
                      const selYear = parseInt(e.target.value, 10);
                      const currentMonthStr = [
                        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                      ].find((m) => (editingArticle.data || "").toLowerCase().includes(m.toLowerCase())) || "Setembro";
                      setEditingArticle({
                        ...editingArticle,
                        data: `${currentMonthStr} / ${selYear}`,
                        ano: selYear,
                      });
                    }}
                    className="w-full p-2 text-sm border border-gray-300 bg-white"
                  >
                    {Array.from({ length: 30 }, (_, i) => 2005 + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-gray-600">Formatação Resultante</label>
                  <input
                    type="text"
                    value={editingArticle.data || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, data: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 bg-white font-mono font-bold text-brand-navy"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <MediaUploadInput
                label="Arquivo PDF ou Documento"
                value={editingArticle.pdfUrl || ""}
                onChange={(url) => setEditingArticle({ ...editingArticle, pdfUrl: url })}
                accept=".pdf,application/pdf"
                placeholder="/uploads/artigo.pdf"
                type="pdf"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Detalhes / Resumo</label>
            <textarea
              rows={4}
              value={editingArticle.detalhes || ""}
              onChange={(e) => setEditingArticle({ ...editingArticle, detalhes: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => setEditingArticle(null)}
              className="px-4 py-2 border text-xs font-bold uppercase"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-brand-navy text-white text-xs font-bold uppercase hover:bg-brand-gold hover:text-brand-navy border border-brand-gold"
            >
              {saving ? "Salvando..." : "Salvar Artigo"}
            </button>
          </div>
        </div>
      )}

      {/* ARTICLES LIST */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase font-mono">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Veículo</th>
              <th className="p-3">Data</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Carregando artigos...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Nenhum artigo cadastrado.
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-brand-navy">{a.titulo}</td>
                  <td className="p-3">{a.veiculo}</td>
                  <td className="p-3 font-mono">{a.data}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingArticle(a)}
                      className="px-3 py-1 bg-brand-navy text-white text-xs font-bold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-bold"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
