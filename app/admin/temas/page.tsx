"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThemesManager() {
  const router = useRouter();
  const [temas, setTemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    loadTemas();
  }, []);

  async function loadTemas() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections/temas");
      const data = await res.json();
      setTemas(Array.isArray(data) ? data : []);
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
    const exists = temas.some((t) => t.id === editingItem.id);
    if (exists) {
      updated = temas.map((t) => (t.id === editingItem.id ? editingItem : t));
    } else {
      updated = [editingItem, ...temas];
    }

    try {
      const res = await fetch("/api/admin/collections/temas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao salvar tema de pesquisa");

      setTemas(updated);
      setEditingItem(null);
      setMessage("Tema de pesquisa salvo com sucesso!");
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Erro ao salvar tema");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este tema de pesquisa?")) return;
    const updated = temas.filter((t) => t.id !== id);

    try {
      const res = await fetch("/api/admin/collections/temas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao excluir tema");

      setTemas(updated);
      setMessage("Tema excluído com sucesso!");
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Erro ao excluir tema");
    }
  }

  const startNewTema = () => {
    setEditingItem({
      id: `tema-${Date.now()}`,
      titulo: "",
      subtitulo: "",
      resumo: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Gerenciador de Temas de Pesquisa
          </h2>
          <p className="text-xs text-gray-500">
            Cadastre e edite os 5 eixos temáticos principais de atuação científica.
          </p>
        </div>

        <button
          onClick={startNewTema}
          className="px-5 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold"
        >
          + Adicionar Tema de Pesquisa
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
              {temas.some((t) => t.id === editingItem.id) ? "Editar Tema" : "Novo Tema"}
            </h3>
            <button
              onClick={() => setEditingItem(null)}
              className="text-xs font-bold text-gray-500 hover:text-black"
            >
              ✕ Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">ID do Tema (slug único)</label>
              <input
                type="text"
                value={editingItem.id || ""}
                onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Título do Eixo Temático</label>
              <input
                type="text"
                value={editingItem.titulo || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Descrição / Âmbito de Pesquisa</label>
            <textarea
              rows={4}
              value={editingItem.resumo || editingItem.descricao || ""}
              onChange={(e) => setEditingItem({ ...editingItem, resumo: e.target.value, descricao: e.target.value })}
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
              {saving ? "Salvando..." : "Salvar Tema"}
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase font-mono">
            <tr>
              <th className="p-3">ID (Slug)</th>
              <th className="p-3">Título</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  Carregando temas...
                </td>
              </tr>
            ) : temas.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  Nenhum tema cadastrado.
                </td>
              </tr>
            ) : (
              temas.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono text-gray-600">{t.id}</td>
                  <td className="p-3 font-bold text-brand-navy">{t.titulo}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditingItem(t)}
                      className="px-3 py-1 bg-brand-navy text-white text-xs font-bold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
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
