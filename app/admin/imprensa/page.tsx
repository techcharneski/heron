"use client";

import { useEffect, useState } from "react";
import MediaUploadInput from "@/components/admin/MediaUploadInput";
import RichContentEditor from "@/components/admin/RichContentEditor";

function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PressManager() {
  const [pressItems, setPressItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [showAddType, setShowAddType] = useState(false);
  const [newTypeInput, setNewTypeInput] = useState("");

  const existingTypes = Array.from(
    new Set([
      "Matéria de Imprensa",
      "Perfil Biográfico e Entrevista",
      "Artigo de Opinião e Entrevista",
      "Reportagem / Clipped",
      "Entrevista em Vídeo",
      "Podcast & Rádio",
      ...pressItems.map((p) => p.tipo).filter(Boolean),
      ...(editingItem?.tipo ? [editingItem.tipo] : []),
      ...customTypes,
    ])
  );

  useEffect(() => {
    loadPress();
  }, []);

  async function loadPress() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections/press");
      const data = await res.json();
      setPressItems(Array.isArray(data) ? data : []);
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
    const exists = pressItems.some((p) => p.id === editingItem.id);
    if (exists) {
      updated = pressItems.map((p) => (p.id === editingItem.id ? editingItem : p));
    } else {
      updated = [editingItem, ...pressItems];
    }

    try {
      const res = await fetch("/api/admin/collections/press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao salvar matéria");

      setPressItems(updated);
      setEditingItem(null);
      setMessage("Matéria salva com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao salvar matéria");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta matéria?")) return;
    const updated = pressItems.filter((p) => p.id !== id);

    try {
      const res = await fetch("/api/admin/collections/press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erro ao excluir matéria");

      setPressItems(updated);
      setMessage("Matéria excluída com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao excluir matéria");
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === pressItems.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...pressItems];
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, movedItem);

    setPressItems(newItems);

    try {
      const res = await fetch("/api/admin/collections/press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItems),
      });

      if (!res.ok) throw new Error("Erro ao salvar ordem das matérias");

      setMessage("Ordem das matérias atualizada com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao atualizar ordem");
    }
  }

  const startNewPress = () => {
    setEditingItem({
      id: `imprensa-${Date.now()}`,
      slug: `imprensa-${Date.now()}`,
      titulo: "",
      subtitulo: "",
      veiculo: "",
      data: "",
      tipo: "Matéria de Imprensa",
      categoria: "IMPRENSA",
      imagem: "",
      destaque: false,
      resumo: "",
      link: "",
      pdfUrl: "",
      conteudo: [
        { tipo: "paragrafo", texto: "" }
      ]
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Gerenciador de Imprensa e Entrevistas
          </h2>
          <p className="text-xs text-gray-500">
            Adicione, edite, ordene e formate matérias, perfil biográfico e entrevistas veiculadas.
          </p>
        </div>

        <button
          onClick={startNewPress}
          className="px-5 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold"
        >
          + Adicionar Matéria
        </button>
      </div>

      {message && (
        <div className="p-4 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-emerald-800 font-bold ml-4">✕</button>
        </div>
      )}

      {/* EDIT FORM */}
      {editingItem && (
        <div className="bg-white p-6 border-2 border-brand-gold space-y-5 shadow-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              {pressItems.some((p) => p.id === editingItem.id) ? "Editar Matéria" : "Nova Matéria"}
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
              <label className="block text-xs font-bold uppercase mb-1">Título</label>
              <input
                type="text"
                value={editingItem.titulo || ""}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  const newSlug = slugify(newTitle);
                  setEditingItem((prev: any) => ({
                    ...prev,
                    titulo: newTitle,
                    slug:
                      !prev?.slug ||
                      prev.slug.startsWith("imprensa-") ||
                      prev.slug === slugify(prev.titulo || "")
                        ? newSlug
                        : prev.slug,
                  }));
                }}
                className="w-full p-2 text-sm border border-gray-300 font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase mb-1">Subtítulo</label>
              <input
                type="text"
                value={editingItem.subtitulo || ""}
                onChange={(e) => setEditingItem({ ...editingItem, subtitulo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Veículo (Ex: Jornal do Comércio)</label>
              <input
                type="text"
                value={editingItem.veiculo || ""}
                onChange={(e) => setEditingItem({ ...editingItem, veiculo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase">Tipo de Matéria</label>
                <button
                  type="button"
                  onClick={() => setShowAddType(!showAddType)}
                  className="text-[11px] font-bold text-brand-navy hover:underline"
                >
                  {showAddType ? "✕ Cancelar" : "+ Novo Tipo"}
                </button>
              </div>

              {showAddType ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nome do novo tipo..."
                    value={newTypeInput}
                    onChange={(e) => setNewTypeInput(e.target.value)}
                    className="w-full p-2 text-sm border border-brand-gold font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTypeInput.trim()) return;
                      const added = newTypeInput.trim();
                      setCustomTypes((prev) => [...prev, added]);
                      setEditingItem({ ...editingItem, tipo: added });
                      setNewTypeInput("");
                      setShowAddType(false);
                    }}
                    className="px-3 py-2 bg-brand-navy text-white text-xs font-bold uppercase shrink-0 hover:bg-brand-gold hover:text-brand-navy transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              ) : (
                <select
                  value={editingItem.tipo || "Matéria de Imprensa"}
                  onChange={(e) => {
                    if (e.target.value === "__NEW__") {
                      setShowAddType(true);
                    } else {
                      setEditingItem({ ...editingItem, tipo: e.target.value });
                    }
                  }}
                  className="w-full p-2 text-sm border border-gray-300 font-medium bg-white"
                >
                  {existingTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  <option value="__NEW__">+ Outro / Cadastrar Novo Tipo...</option>
                </select>
              )}
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 border border-gray-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-navy block">
                🗓️ Data da Matéria
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-gray-600">
                    Selecionar no Calendário
                  </label>
                  <input
                    type="date"
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const [yearStr, monthStr, dayStr] = e.target.value.split("-");
                      const day = parseInt(dayStr, 10);
                      const monthIdx = parseInt(monthStr, 10) - 1;
                      const year = parseInt(yearStr, 10);
                      const fullMonths = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
                      const formatted = `${day} de ${fullMonths[monthIdx] || "janeiro"} de ${year}`;
                      setEditingItem({
                        ...editingItem,
                        data: formatted,
                      });
                    }}
                    className="w-full p-2 text-sm border border-gray-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-gray-600">
                    Texto Resultante / Digitação Livre
                  </label>
                  <input
                    type="text"
                    placeholder="15 de janeiro de 2026"
                    value={editingItem.data || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, data: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 bg-white font-mono font-bold text-brand-navy"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Link do Veículo / Notícia Original (URL)</label>
              <input
                type="text"
                placeholder="https://..."
                value={editingItem.link || ""}
                onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase">Slug / URL Amigável</label>
                <button
                  type="button"
                  onClick={() => {
                    if (editingItem?.titulo) {
                      setEditingItem({ ...editingItem, slug: slugify(editingItem.titulo) });
                    }
                  }}
                  className="text-[11px] font-bold text-brand-navy hover:underline"
                  title="Gerar URL amigável limpa baseada no título"
                >
                  ⚡ Gerar via título
                </button>
              </div>
              <input
                type="text"
                placeholder="nome-da-materia"
                value={editingItem.slug || ""}
                onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300 font-mono text-xs"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <MediaUploadInput
                label="Imagem Principal da Matéria"
                value={editingItem.imagem || ""}
                onChange={(url) => setEditingItem({ ...editingItem, imagem: url })}
                accept="image/*"
                placeholder="/images/imprensa.png"
                type="image"
              />

              <MediaUploadInput
                label="Arquivo PDF da Matéria (Download)"
                value={editingItem.pdfUrl || ""}
                onChange={(url) => setEditingItem({ ...editingItem, pdfUrl: url })}
                accept=".pdf,application/pdf"
                placeholder="/uploads/materia.pdf"
                type="pdf"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Resumo Curto (Exibido nas listagens e cartões)</label>
            <textarea
              rows={3}
              value={editingItem.resumo || ""}
              onChange={(e) => setEditingItem({ ...editingItem, resumo: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>

          {/* Editor de Conteúdo Completo para Leitura */}
          <div>
            <RichContentEditor
              value={editingItem.conteudo || []}
              onChange={(blocks) => setEditingItem({ ...editingItem, conteudo: blocks })}
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
              {saving ? "Salvando..." : "Salvar Matéria"}
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase font-mono">
            <tr>
              <th className="p-3 w-28 text-center">Ordem</th>
              <th className="p-3">Título</th>
              <th className="p-3">Veículo</th>
              <th className="p-3">Data</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Carregando imprensa...
                </td>
              </tr>
            ) : pressItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Nenhuma matéria cadastrada.
                </td>
              </tr>
            ) : (
              pressItems.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-gray-500 font-mono text-[11px] font-bold w-6">#{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-brand-navy hover:text-white border border-gray-300 text-gray-700 font-bold rounded text-xs disabled:opacity-20 disabled:hover:bg-gray-100 disabled:hover:text-gray-700 transition-colors"
                        title="Mover para cima"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, "down")}
                        disabled={index === pressItems.length - 1}
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-brand-navy hover:text-white border border-gray-300 text-gray-700 font-bold rounded text-xs disabled:opacity-20 disabled:hover:bg-gray-100 disabled:hover:text-gray-700 transition-colors"
                        title="Mover para baixo"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-brand-navy">{p.titulo}</td>
                  <td className="p-3">{p.veiculo}</td>
                  <td className="p-3 font-mono">{p.data}</td>
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
