"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlignExtension from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";

interface RichContentEditorProps {
  value: any; // HTML string or blocks array
  onChange: (htmlOrBlocks: any) => void;
}

export default function RichContentEditor({ value, onChange }: RichContentEditorProps) {
  const [showHtml, setShowHtml] = useState(false);

  // Convert incoming value (array of blocks or string) into valid HTML string
  const initialHtml = Array.isArray(value)
    ? value
        .map((b) => {
          if (typeof b === "string") return `<p>${b}</p>`;
          if (b.tipo === "subtitulo") return `<h2>${b.texto || ""}</h2>`;
          if (b.tipo === "citacao") return `<blockquote>${b.texto || ""}</blockquote>`;
          if (b.tipo === "imagem") return "";
          if (b.tipo === "lista" && Array.isArray(b.itens)) {
            return `<ul>${b.itens.map((i: string) => `<li>${i}</li>`).join("")}</ul>`;
          }
          return `<p>${b.texto || b || ""}</p>`;
        })
        .join("")
    : typeof value === "string"
    ? value
    : "";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-navy underline font-bold hover:text-brand-gold-dark",
        },
      }),
      TextAlignExtension.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Keep editor content in sync when value changes externally (e.g. selecting different item)
  useEffect(() => {
    if (editor && !editor.isFocused) {
      const currentHtml = editor.getHTML();
      if (initialHtml && currentHtml !== initialHtml) {
        editor.commands.setContent(initialHtml);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 text-center text-xs text-gray-500 font-mono">
        Carregando editor de texto...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border-2 border-brand-navy/30 rounded-none bg-white shadow-md overflow-hidden">
      {/* Editor Scoped CSS for Headings, Lists, Blockquotes */}
      <style>{`
        .ProseMirror {
          outline: none !important;
        }
        .ProseMirror h1 {
          font-size: 1.85rem !important;
          line-height: 2.25rem !important;
          font-weight: 700 !important;
          color: #0b192c !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.75rem !important;
        }
        .ProseMirror h2 {
          font-size: 1.4rem !important;
          line-height: 1.75rem !important;
          font-weight: 700 !important;
          color: #0b192c !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ProseMirror h3 {
          font-size: 1.15rem !important;
          line-height: 1.5rem !important;
          font-weight: 600 !important;
          color: #0b192c !important;
          margin-top: 0.85rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
        }
        .ProseMirror li {
          display: list-item !important;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #d97706 !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          background-color: #fffbe6 !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
        }
        .ProseMirror p {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
      `}</style>

      {/* WORD / WORDPRESS CLASSIC TOOLBAR HEADER */}
      <div className="bg-slate-100 border-b border-slate-300 p-2 flex flex-wrap items-center gap-1 text-xs select-none">
        
        {/* Style Dropdown */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") editor.chain().focus().setParagraph().run();
            else if (val === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
            else if (val === "quote") editor.chain().focus().toggleBlockquote().run();
          }}
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : editor.isActive("blockquote")
              ? "quote"
              : "p"
          }
          className="p-1.5 bg-white border border-slate-300 font-bold text-slate-800 rounded-xs text-xs focus:ring-1 focus:ring-brand-navy"
        >
          <option value="p">Parágrafo Normal</option>
          <option value="h1">Título Principal (H1)</option>
          <option value="h2">Subtítulo de Seção (H2)</option>
          <option value="h3">Subtítulo Menor (H3)</option>
          <option value="quote">💬 Citação em Destaque</option>
        </select>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Text Formatting Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-7 h-7 flex items-center justify-center font-serif font-black rounded-xs border transition-colors ${
            editor.isActive("bold")
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Negrito (Ctrl+B)"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-7 h-7 flex items-center justify-center font-serif italic font-bold rounded-xs border transition-colors ${
            editor.isActive("italic")
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Itálico (Ctrl+I)"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`w-7 h-7 flex items-center justify-center font-serif underline font-bold rounded-xs border transition-colors ${
            editor.isActive("underline")
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Sublinhado (Ctrl+U)"
        >
          U
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`w-7 h-7 flex items-center justify-center line-through font-bold rounded-xs border transition-colors ${
            editor.isActive("strike")
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Tachado"
        >
          S
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-2 py-1 text-xs font-bold rounded-xs border transition-colors ${
            editor.isActive({ textAlign: "left" })
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Alinhar à Esquerda"
        >
          ⬅️
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-2 py-1 text-xs font-bold rounded-xs border transition-colors ${
            editor.isActive({ textAlign: "center" })
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Centralizar"
        >
          ↔️
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-2 py-1 text-xs font-bold rounded-xs border transition-colors ${
            editor.isActive({ textAlign: "right" })
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Alinhar à Direita"
        >
          ➡️
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2.5 py-1 text-xs font-bold rounded-xs border transition-colors ${
            editor.isActive("bulletList")
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Lista com Marcadores"
        >
          • Lista
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2.5 py-1 text-xs font-bold rounded-xs border transition-colors ${
            editor.isActive("orderedList")
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Lista Numerada"
        >
          1. Lista
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Link & Divider */}
        <button
          type="button"
          onClick={setLink}
          className={`px-2.5 py-1 text-xs font-bold rounded-xs border transition-colors ${
            editor.isActive("link")
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200"
          }`}
          title="Inserir / Editar Link"
        >
          🔗 Link
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2.5 py-1 text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-200 rounded-xs transition-colors"
          title="Linha Divisória"
        >
          ➖ Divisor
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="w-7 h-7 flex items-center justify-center bg-white text-slate-800 border border-slate-300 rounded-xs disabled:opacity-30 hover:bg-slate-200 font-bold"
          title="Desfazer (Ctrl+Z)"
        >
          ↩️
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="w-7 h-7 flex items-center justify-center bg-white text-slate-800 border border-slate-300 rounded-xs disabled:opacity-30 hover:bg-slate-200 font-bold"
          title="Refazer (Ctrl+Y)"
        >
          ↪️
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHtml(!showHtml)}
            className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-xs border transition-colors ${
              showHtml
                ? "bg-slate-800 text-amber-400 border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-200"
            }`}
            title="Alternar entre Editor Visual (Word) e Código HTML"
          >
            {showHtml ? "👁️ Ver Editor Word" : "</> CÓDIGO HTML"}
          </button>
        </div>
      </div>

      {/* EDITOR WORKSPACE */}
      {showHtml ? (
        <div className="p-4 bg-slate-900 text-amber-300 font-mono text-xs">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
            Edição Direta do Código HTML do Artigo:
          </label>
          <textarea
            rows={14}
            value={editor.getHTML()}
            onChange={(e) => {
              editor.commands.setContent(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full bg-slate-950 text-emerald-400 p-3 font-mono border border-slate-700 rounded-none focus:outline-none"
          />
        </div>
      ) : (
        <div className="p-6 md:p-8 bg-white min-h-[300px] cursor-text">
          <EditorContent
            editor={editor}
            className="prose max-w-none font-serif text-base md:text-lg leading-relaxed text-brand-text/90 focus:outline-none min-h-[260px]"
          />
        </div>
      )}
    </div>
  );
}
