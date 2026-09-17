"use client";

import { useEffect, useState } from "react";
import MediaUploadInput from "@/components/admin/MediaUploadInput";

export default function BooksManager() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections/books");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!editingBook) return;
    setSaving(true);
    setMessage("");

    const topicosArray = (
      typeof editingBook.topicosInput === "string"
        ? editingBook.topicosInput
        : Array.isArray(editingBook.topicos)
        ? editingBook.topicos.join(", ")
        : ""
    )
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const { topicosInput, ...cleanBookData } = editingBook;
    const bookToSave = {
      ...cleanBookData,
      topicos: topicosArray,
    };

    let updatedBooks;
    const exists = books.some((b) => b.id === bookToSave.id);
    if (exists) {
      updatedBooks = books.map((b) => (b.id === bookToSave.id ? bookToSave : b));
    } else {
      updatedBooks = [bookToSave, ...books];
    }

    try {
      const res = await fetch("/api/admin/collections/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooks),
      });

      if (!res.ok) throw new Error("Erro ao salvar livro");

      setBooks(updatedBooks);
      setEditingBook(null);
      setMessage("Livro salvo com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao salvar livro");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;
    const updatedBooks = books.filter((b) => b.id !== id);

    try {
      const res = await fetch("/api/admin/collections/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooks),
      });

      if (!res.ok) throw new Error("Erro ao excluir livro");

      setBooks(updatedBooks);
      setMessage("Livro excluído com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao excluir livro");
    }
  }

  async function moveBook(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === books.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newBooks = [...books];
    const [movedItem] = newBooks.splice(index, 1);
    newBooks.splice(targetIndex, 0, movedItem);

    setBooks(newBooks);

    try {
      const res = await fetch("/api/admin/collections/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooks),
      });

      if (!res.ok) throw new Error("Erro ao salvar ordem dos livros");

      setMessage("Ordem dos livros atualizada com sucesso!");
    } catch (err: any) {
      setMessage(err.message || "Erro ao atualizar ordem");
    }
  }

  const startNewBook = () => {
    setEditingBook({
      id: `livro-${Date.now()}`,
      titulo: "",
      subtitulo: "",
      autor: "Heron Charneski",
      papel: "Autor",
      categoria: "Obras Individuais",
      ano: new Date().getFullYear(),
      editora: "",
      paginas: "",
      isbn: "",
      imagemCapa: "",
      linkAmazon: "",
      resumo: "",
      topicos: [],
      topicosInput: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Gerenciador de Livros e Obras
          </h2>
          <p className="text-xs text-gray-500">
            Adicione, edite, remova ou reordene a exibição dos livros no site público.
          </p>
        </div>

        <button
          onClick={startNewBook}
          className="px-5 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold"
        >
          + Adicionar Novo Livro
        </button>
      </div>

      {message && (
        <div className="p-4 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-emerald-800 font-bold ml-4">✕</button>
        </div>
      )}

      {/* EDIT MODAL / FORM */}
      {editingBook && (
        <div className="bg-white p-6 border-2 border-brand-gold space-y-4 shadow-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-serif text-lg font-bold text-brand-navy">
              {books.some((b) => b.id === editingBook.id) ? "Editar Livro" : "Novo Livro"}
            </h3>
            <button
              onClick={() => setEditingBook(null)}
              className="text-xs font-bold text-gray-500 hover:text-black"
            >
              ✕ Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Título do Livro</label>
              <input
                type="text"
                value={editingBook.titulo || ""}
                onChange={(e) => setEditingBook({ ...editingBook, titulo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Subtítulo</label>
              <input
                type="text"
                value={editingBook.subtitulo || ""}
                onChange={(e) => setEditingBook({ ...editingBook, subtitulo: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Autor / Coordenador</label>
              <input
                type="text"
                value={editingBook.autor || ""}
                onChange={(e) => setEditingBook({ ...editingBook, autor: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Categoria</label>
              <select
                value={editingBook.categoria || "Obras Individuais"}
                onChange={(e) => setEditingBook({ ...editingBook, categoria: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              >
                <option value="Obras Individuais">Obras Individuais</option>
                <option value="Coordenação de Livros">Coordenação de Livros</option>
                <option value="Obras Coletivas">Obras Coletivas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Ano de Publicação</label>
              <input
                type="number"
                value={editingBook.ano || 2026}
                onChange={(e) => setEditingBook({ ...editingBook, ano: parseInt(e.target.value, 10) })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Editora</label>
              <input
                type="text"
                value={editingBook.editora || ""}
                onChange={(e) => setEditingBook({ ...editingBook, editora: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Páginas</label>
              <input
                type="text"
                value={editingBook.paginas || ""}
                onChange={(e) => setEditingBook({ ...editingBook, paginas: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">ISBN</label>
              <input
                type="text"
                value={editingBook.isbn || ""}
                onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div className="md:col-span-2">
              <MediaUploadInput
                label="Imagem de Capa do Livro"
                value={editingBook.imagemCapa || ""}
                onChange={(url) => setEditingBook({ ...editingBook, imagemCapa: url })}
                accept="image/*"
                placeholder="/images/livros/capa.jpg"
                type="image"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Link de Compra (Amazon/Editora)</label>
              <input
                type="text"
                placeholder="https://..."
                value={editingBook.linkAmazon || ""}
                onChange={(e) => setEditingBook({ ...editingBook, linkAmazon: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Resumo da Obra</label>
            <textarea
              rows={4}
              value={editingBook.resumo || ""}
              onChange={(e) => setEditingBook({ ...editingBook, resumo: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Tópicos Principais (separados por vírgula)</label>
            <input
              type="text"
              placeholder="Ex: Direito Tributário, Lucro Real, IFRS"
              value={editingBook.topicosInput ?? (Array.isArray(editingBook.topicos) ? editingBook.topicos.join(", ") : "")}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  topicosInput: e.target.value,
                })
              }
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => setEditingBook(null)}
              className="px-4 py-2 border text-xs font-bold uppercase"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-brand-navy text-white text-xs font-bold uppercase hover:bg-brand-gold hover:text-brand-navy border border-brand-gold"
            >
              {saving ? "Salvando..." : "Salvar Livro"}
            </button>
          </div>
        </div>
      )}

      {/* BOOKS LIST */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase font-mono">
            <tr>
              <th className="p-3 w-28 text-center">Ordem</th>
              <th className="p-3">Título</th>
              <th className="p-3">Ano</th>
              <th className="p-3">Editora</th>
              <th className="p-3">Categoria</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Carregando livros...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Nenhum livro cadastrado.
                </td>
              </tr>
            ) : (
              books.map((b, index) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-gray-500 font-mono text-[11px] font-bold w-6">#{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => moveBook(index, "up")}
                        disabled={index === 0}
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-brand-navy hover:text-white border border-gray-300 text-gray-700 font-bold rounded text-xs disabled:opacity-20 disabled:hover:bg-gray-100 disabled:hover:text-gray-700 transition-colors"
                        title="Mover para cima"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBook(index, "down")}
                        disabled={index === books.length - 1}
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-brand-navy hover:text-white border border-gray-300 text-gray-700 font-bold rounded text-xs disabled:opacity-20 disabled:hover:bg-gray-100 disabled:hover:text-gray-700 transition-colors"
                        title="Mover para baixo"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-brand-navy">{b.titulo}</td>
                  <td className="p-3 font-mono">{b.ano}</td>
                  <td className="p-3">{b.editora}</td>
                  <td className="p-3">{b.categoria}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        setEditingBook({
                          ...b,
                          topicosInput: Array.isArray(b.topicos) ? b.topicos.join(", ") : (b.topicos || ""),
                        })
                      }
                      className="px-3 py-1 bg-brand-navy text-white text-xs font-bold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
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
