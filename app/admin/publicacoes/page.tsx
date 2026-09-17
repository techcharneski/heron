"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploadInput from "@/components/admin/MediaUploadInput";

export default function PublicationsManager() {
  const router = useRouter();
  const [publications, setPublications] = useState<any[]>([]);
  const [temas, setTemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [pubsRes, temasRes] = await Promise.all([
        fetch("/api/admin/collections/publications"),
        fetch("/api/admin/collections/temas"),
      ]);
      const pubsData = await pubsRes.json();
      const temasData = await temasRes.json();
      setPublications(Array.isArray(pubsData) ? pubsData : []);
      setTemas(Array.isArray(temasData) ? temasData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!editingItem) return;
    setSaving(true);
    setMessage("");

    let updated;
    const exists = publications.some((p) => p.id === editingItem.id);
    if (exists) {
      updated = publications.map((p) => (p.id === editingItem.id ? editingItem : p));
    } else {
      updated = [editingItem, ...publications];
    }

    try {
      const res = await fetch("/api/admin/collections/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao salvar publicação");

      setPublications(updated);
      setEditingItem(null);
      setMessage("Publicação acadêmica salva com sucesso!");
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Erro ao salvar publicação");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;
    const updated = publications.filter((p) => p.id !== id);

    try {
      const res = await fetch("/api/admin/collections/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao excluir publicação");

      setPublications(updated);
      setMessage("Publicação excluída com sucesso!");
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Erro ao excluir publicação");
    }
  }

  const startNewPub = () => {
    setEditingItem({
      id: `pub-${Date.now()}`,
      titulo: "",
      tipo: "artigo",
      ano: new Date().getFullYear(),
      veiculo: "",
      temaId: temas[0]?.id || "contabilidade-como-linguagem",
      detalhes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Gerenciador de Produção Acadêmica
          </h2>
          <p className="text-xs text-gray-500">
            Cadastre teses, dissertações, livros e artigos científicos organizados por tema de pesquisa.
          </p>
        </div>

        <button
          onClick={startNewPub}
          className="px-5 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold"
        >
          + Adicionar Publicação Acadêmica
        </button>
      </div>

      {message && (
        <div className="p-4 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {message}
        </div>
      )}

      {/* EDIT FORM */}
      {editingItem && (
        <div className="bg-white p-6 border-2 border-brand-gold space-y-4 shadow-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              {publications.some((p) => p.id === editingItem.id) ? "Editar Publicação" : "Nova Publicação"}
            </h3>
            <button
              onClick={() => setEditingItem(null)}
              className="text-xs font-bold text-gray-500 hover:text-black"
            >
              ✕ Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase mb-1">Título da Publicação</label>
              <input
                type="text"
                value={editingItem.titulo || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Tipo</label>
              <select
                value={editingItem.tipo || "artigo"}
                onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              >
                <option value="artigo">Artigo Científico</option>
                <option value="livro">Livro / Capítulo</option>
                <option value="tese">Tese / Dissertação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Tema de Pesquisa Atribuído</label>
              <select
                value={editingItem.temaId || ""}
                onChange={(e) => setEditingItem({ ...editingItem, temaId: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              >
                {temas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.titulo || t.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Ano</label>
              <input
                type="number"
                value={editingItem.ano || 2026}
                onChange={(e) => setEditingItem({ ...editingItem, ano: parseInt(e.target.value, 10) })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Veículo / Revista / Editora</label>
              <input
                type="text"
                value={editingItem.veiculo || editingItem.editora || ""}
                onChange={(e) => setEditingItem({ ...editingItem, veiculo: e.target.value, editora: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div className="md:col-span-2">
              <MediaUploadInput
                label="Arquivo PDF ou Documento da Publicação"
                value={editingItem.pdfUrl || ""}
                onChange={(url) => setEditingItem({ ...editingItem, pdfUrl: url })}
                accept=".pdf,application/pdf"
                placeholder="/uploads/publicacao.pdf"
                type="pdf"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Detalhes / Resumo Científico</label>
            <textarea
              rows={4}
              value={editingItem.detalhes || ""}
              onChange={(e) => setEditingItem({ ...editingItem, detalhes: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 border text-xs font-bold uppercase"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-brand-navy text-white text-xs font-bold uppercase hover:bg-brand-gold hover:text-brand-navy border border-brand-gold"
            >
              {saving ? "Salvando..." : "Salvar Publicação"}
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase font-mono">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Ano</th>
              <th className="p-3">Tema</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Carregando publicações...
                </td>
              </tr>
            ) : publications.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Nenhuma publicação cadastrada.
                </td>
              </tr>
            ) : (
              publications.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-brand-navy">{p.titulo}</td>
                  <td className="p-3 uppercase">{p.tipo}</td>
                  <td className="p-3 font-mono">{p.ano}</td>
                  <td className="p-3">{p.temaId}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingItem(p)}
                      className="px-3 py-1 bg-brand-navy text-white text-xs font-bold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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
