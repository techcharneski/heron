"use client";

import { useEffect, useState } from "react";
import MediaUploadInput from "@/components/admin/MediaUploadInput";

export default function EditPagesContent() {
  const [pagesData, setPagesData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"home" | "sobre" | "pareceres" | "servicos" | "contato">("home");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadPages() {
      try {
        const res = await fetch("/api/admin/pages");
        const data = await res.json();
        setPagesData(data);
      } catch (err) {
        console.error("Error loading pages:", err);
      }
    }
    loadPages();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagesData),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Erro ao salvar");

      setMessage({ text: "Textos da página atualizados com sucesso!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Erro ao salvar alterações.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!pagesData) {
    return (
      <div className="py-12 text-center text-gray-500 font-mono text-sm">
        Carregando dados das páginas...
      </div>
    );
  }

  // Helper updater
  const updateField = (path: string[], value: any) => {
    setPagesData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let current = copy;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Save Bar */}
      <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Edição de Textos de Páginas
          </h2>
          <p className="text-xs text-gray-500">
            Altere os títulos, parágrafos e seções das páginas do site público.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 text-xs font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {[
          { id: "home", label: "Página Inicial (Home)" },
          { id: "sobre", label: "Sobre & Minibio" },
          { id: "pareceres", label: "Pareceres" },
          { id: "servicos", label: "Serviços" },
          { id: "contato", label: "Contato" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-brand-navy text-brand-navy bg-gray-50 font-extrabold"
                : "border-transparent text-gray-500 hover:text-brand-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-8 border border-gray-200 space-y-8">
        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
              Seção Hero da Home
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Superior</label>
                <input
                  type="text"
                  value={pagesData.home?.badge || ""}
                  onChange={(e) => updateField(["home", "badge"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-none focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título Principal</label>
                <input
                  type="text"
                  value={pagesData.home?.title || ""}
                  onChange={(e) => updateField(["home", "title"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-none focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo (Titulações)</label>
                <input
                  type="text"
                  value={pagesData.home?.subtitle || ""}
                  onChange={(e) => updateField(["home", "subtitle"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-none focus:border-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descrição / Áreas de Atuação</label>
                <input
                  type="text"
                  value={pagesData.home?.description || ""}
                  onChange={(e) => updateField(["home", "description"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-none focus:border-brand-navy"
                />
              </div>

              <div>
                <MediaUploadInput
                  label="Imagem de Fundo do Hero da Home"
                  value={pagesData.home?.bgImage || "/images/library_bg.png"}
                  onChange={(url) => updateField(["home", "bgImage"], url)}
                  accept="image/*"
                  placeholder="/images/library_bg.png"
                  type="image"
                />
              </div>
            </div>

            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2 pt-4">
              Seção Sobre na Home (Resumo)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parágrafo 1</label>
                <textarea
                  rows={3}
                  value={pagesData.home?.aboutSection?.paragraph1 || ""}
                  onChange={(e) => updateField(["home", "aboutSection", "paragraph1"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-none focus:border-brand-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parágrafo 2</label>
                <textarea
                  rows={3}
                  value={pagesData.home?.aboutSection?.paragraph2 || ""}
                  onChange={(e) => updateField(["home", "aboutSection", "paragraph2"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-none focus:border-brand-navy"
                />
              </div>
            </div>
          </div>
        )}

        {/* SOBRE TAB */}
        {activeTab === "sobre" && (
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
              Cabeçalho da Página Sobre
            </h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título</label>
              <input
                type="text"
                value={pagesData.sobre?.title || ""}
                onChange={(e) => updateField(["sobre", "title"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo / Qualificações</label>
              <input
                type="text"
                value={pagesData.sobre?.subtitle || ""}
                onChange={(e) => updateField(["sobre", "subtitle"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Parágrafos da Minibio</label>
              {(pagesData.sobre?.introParagraphs || []).map((para: string, idx: number) => (
                <textarea
                  key={idx}
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const newArr = [...pagesData.sobre.introParagraphs];
                    newArr[idx] = e.target.value;
                    updateField(["sobre", "introParagraphs"], newArr);
                  }}
                  className="w-full p-2 text-sm border border-gray-300 mb-2"
                />
              ))}
            </div>

            {/* Formação Acadêmica Array */}
            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2 pt-4 flex items-center justify-between">
              <span>Formação Acadêmica</span>
              <button
                type="button"
                onClick={() => {
                  const newForm = [
                    ...(pagesData.sobre?.formation || []),
                    { id: `f_${Date.now()}`, year: "2026", title: "Nova Titulação", institution: "Instituição", details: "Descrição..." }
                  ];
                  updateField(["sobre", "formation"], newForm);
                }}
                className="text-xs bg-brand-navy text-white px-3 py-1 font-sans"
              >
                + Adicionar Formação
              </button>
            </h3>
            <div className="space-y-4">
              {(pagesData.sobre?.formation || []).map((f: any, idx: number) => (
                <div key={f.id || idx} className="p-4 border border-gray-200 bg-gray-50 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newArr = pagesData.sobre.formation.filter((_: any, i: number) => i !== idx);
                      updateField(["sobre", "formation"], newArr);
                    }}
                    className="absolute top-2 right-2 text-red-600 text-xs font-bold"
                  >
                    Excluir
                  </button>
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Ano"
                      value={f.year || ""}
                      onChange={(e) => {
                        const newArr = [...pagesData.sobre.formation];
                        newArr[idx].year = e.target.value;
                        updateField(["sobre", "formation"], newArr);
                      }}
                      className="p-2 text-sm border border-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="Título"
                      value={f.title || ""}
                      onChange={(e) => {
                        const newArr = [...pagesData.sobre.formation];
                        newArr[idx].title = e.target.value;
                        updateField(["sobre", "formation"], newArr);
                      }}
                      className="col-span-3 p-2 text-sm border border-gray-300"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Instituição"
                    value={f.institution || ""}
                    onChange={(e) => {
                      const newArr = [...pagesData.sobre.formation];
                      newArr[idx].institution = e.target.value;
                      updateField(["sobre", "formation"], newArr);
                    }}
                    className="w-full p-2 text-sm border border-gray-300"
                  />
                  <textarea
                    rows={2}
                    placeholder="Detalhes / Tese"
                    value={f.details || ""}
                    onChange={(e) => {
                      const newArr = [...pagesData.sobre.formation];
                      newArr[idx].details = e.target.value;
                      updateField(["sobre", "formation"], newArr);
                    }}
                    className="w-full p-2 text-sm border border-gray-300"
                  />
                </div>
              ))}
            </div>

            {/* Linha do Tempo / Trajetória */}
            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2 pt-4 flex items-center justify-between">
              <span>Trajetória Profissional e Acadêmica</span>
              <button
                type="button"
                onClick={() => {
                  const newTimeline = [
                    ...(pagesData.sobre?.timeline || []),
                    { id: `t_${Date.now()}`, period: "2026 – Atual", role: "Cargo / Função", organization: "Instituição", description: "Descrição..." }
                  ];
                  updateField(["sobre", "timeline"], newTimeline);
                }}
                className="text-xs bg-brand-navy text-white px-3 py-1 font-sans"
              >
                + Adicionar Atuação
              </button>
            </h3>
            <div className="space-y-4">
              {(pagesData.sobre?.timeline || []).map((t: any, idx: number) => (
                <div key={t.id || idx} className="p-4 border border-gray-200 bg-gray-50 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newArr = pagesData.sobre.timeline.filter((_: any, i: number) => i !== idx);
                      updateField(["sobre", "timeline"], newArr);
                    }}
                    className="absolute top-2 right-2 text-red-600 text-xs font-bold"
                  >
                    Excluir
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Período"
                      value={t.period || ""}
                      onChange={(e) => {
                        const newArr = [...pagesData.sobre.timeline];
                        newArr[idx].period = e.target.value;
                        updateField(["sobre", "timeline"], newArr);
                      }}
                      className="p-2 text-sm border border-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="Cargo / Função"
                      value={t.role || ""}
                      onChange={(e) => {
                        const newArr = [...pagesData.sobre.timeline];
                        newArr[idx].role = e.target.value;
                        updateField(["sobre", "timeline"], newArr);
                      }}
                      className="col-span-2 p-2 text-sm border border-gray-300"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Organização / Instituição"
                    value={t.organization || ""}
                    onChange={(e) => {
                      const newArr = [...pagesData.sobre.timeline];
                      newArr[idx].organization = e.target.value;
                      updateField(["sobre", "timeline"], newArr);
                    }}
                    className="w-full p-2 text-sm border border-gray-300"
                  />
                  <textarea
                    rows={2}
                    placeholder="Descrição da atuação"
                    value={t.description || ""}
                    onChange={(e) => {
                      const newArr = [...pagesData.sobre.timeline];
                      newArr[idx].description = e.target.value;
                      updateField(["sobre", "timeline"], newArr);
                    }}
                    className="w-full p-2 text-sm border border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PARECERES TAB */}
        {activeTab === "pareceres" && (
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
              Página de Pareceres Jurídicos
            </h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge</label>
              <input
                type="text"
                value={pagesData.pareceres?.badge || ""}
                onChange={(e) => updateField(["pareceres", "badge"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título</label>
              <input
                type="text"
                value={pagesData.pareceres?.title || ""}
                onChange={(e) => updateField(["pareceres", "title"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo</label>
              <input
                type="text"
                value={pagesData.pareceres?.subtitle || ""}
                onChange={(e) => updateField(["pareceres", "subtitle"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Texto de Introdução</label>
              <textarea
                rows={3}
                value={pagesData.pareceres?.introText || ""}
                onChange={(e) => updateField(["pareceres", "introText"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <h4 className="font-serif text-md font-bold text-brand-navy pt-4 border-b pb-2 flex items-center justify-between">
              <span>Áreas de Atuação Parecerística</span>
              <button
                type="button"
                onClick={() => {
                  const newSecs = [
                    ...(pagesData.pareceres?.sections || []),
                    {
                      id: `p_${Date.now()}`,
                      title: "Nova Área de Parecer",
                      description: "Descrição da nova área de parecer..."
                    }
                  ];
                  updateField(["pareceres", "sections"], newSecs);
                }}
                className="text-xs bg-brand-navy text-white px-3 py-1 font-sans hover:bg-brand-gold hover:text-brand-navy transition-colors"
              >
                + Adicionar Área de Parecer
              </button>
            </h4>
            <div className="space-y-4">
              {(pagesData.pareceres?.sections || []).map((sec: any, idx: number) => (
                <div key={sec.id || idx} className="p-4 border border-gray-200 bg-gray-50 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newSecs = pagesData.pareceres.sections.filter((_: any, i: number) => i !== idx);
                      updateField(["pareceres", "sections"], newSecs);
                    }}
                    className="absolute top-2 right-2 text-red-600 text-xs font-bold hover:underline"
                  >
                    Excluir
                  </button>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Título da Área</label>
                    <input
                      type="text"
                      placeholder="Título da Área"
                      value={sec.title || ""}
                      onChange={(e) => {
                        const newSecs = [...pagesData.pareceres.sections];
                        newSecs[idx].title = e.target.value;
                        updateField(["pareceres", "sections"], newSecs);
                      }}
                      className="w-full p-2 text-sm border border-gray-300 font-bold text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      placeholder="Descrição detalhada"
                      value={sec.description || ""}
                      onChange={(e) => {
                        const newSecs = [...pagesData.pareceres.sections];
                        newSecs[idx].description = e.target.value;
                        updateField(["pareceres", "sections"], newSecs);
                      }}
                      className="w-full p-2 text-sm border border-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVIÇOS TAB */}
        {activeTab === "servicos" && (
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
              Página de Serviços
            </h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge</label>
              <input
                type="text"
                value={pagesData.servicos?.badge || ""}
                onChange={(e) => updateField(["servicos", "badge"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título</label>
              <input
                type="text"
                value={pagesData.servicos?.title || ""}
                onChange={(e) => updateField(["servicos", "title"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo</label>
              <input
                type="text"
                value={pagesData.servicos?.subtitle || ""}
                onChange={(e) => updateField(["servicos", "subtitle"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <h4 className="font-serif text-md font-bold text-brand-navy pt-4 border-b pb-2 flex items-center justify-between">
              <span>Lista de Serviços Prestados</span>
              <button
                type="button"
                onClick={() => {
                  const newSrvs = [
                    ...(pagesData.servicos?.servicesList || []),
                    {
                      id: `s_${Date.now()}`,
                      title: "Novo Serviço",
                      description: "Descrição detalhada do serviço...",
                      focusPoints: []
                    }
                  ];
                  updateField(["servicos", "servicesList"], newSrvs);
                }}
                className="text-xs bg-brand-navy text-white px-3 py-1 font-sans hover:bg-brand-gold hover:text-brand-navy transition-colors"
              >
                + Adicionar Serviço
              </button>
            </h4>
            <div className="space-y-4">
              {(pagesData.servicos?.servicesList || []).map((srv: any, idx: number) => (
                <div key={srv.id || idx} className="p-4 border border-gray-200 bg-gray-50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newSrvs = pagesData.servicos.servicesList.filter((_: any, i: number) => i !== idx);
                      updateField(["servicos", "servicesList"], newSrvs);
                    }}
                    className="absolute top-2 right-2 text-red-600 text-xs font-bold hover:underline"
                  >
                    Excluir
                  </button>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Nome do Serviço</label>
                    <input
                      type="text"
                      placeholder="Nome do Serviço"
                      value={srv.title || ""}
                      onChange={(e) => {
                        const newSrvs = [...pagesData.servicos.servicesList];
                        newSrvs[idx].title = e.target.value;
                        updateField(["servicos", "servicesList"], newSrvs);
                      }}
                      className="w-full p-2 text-sm border border-gray-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      placeholder="Descrição do serviço"
                      value={srv.description || ""}
                      onChange={(e) => {
                        const newSrvs = [...pagesData.servicos.servicesList];
                        newSrvs[idx].description = e.target.value;
                        updateField(["servicos", "servicesList"], newSrvs);
                      }}
                      className="w-full p-2 text-sm border border-gray-300"
                    />
                  </div>

                  {/* Focus Points / Tópicos de Atuação */}
                  <div className="pt-2 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase">
                        Pontos de Foco / Eixos de Atuação (Bullet Points)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newSrvs = [...pagesData.servicos.servicesList];
                          const points = newSrvs[idx].focusPoints ? [...newSrvs[idx].focusPoints] : [];
                          points.push("Novo tópico de atuação");
                          newSrvs[idx].focusPoints = points;
                          updateField(["servicos", "servicesList"], newSrvs);
                        }}
                        className="text-[11px] text-brand-navy font-bold hover:underline"
                      >
                        + Adicionar Tópico
                      </button>
                    </div>

                    {(srv.focusPoints || []).map((pt: string, pIdx: number) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={pt}
                          onChange={(e) => {
                            const newSrvs = [...pagesData.servicos.servicesList];
                            const points = [...newSrvs[idx].focusPoints];
                            points[pIdx] = e.target.value;
                            newSrvs[idx].focusPoints = points;
                            updateField(["servicos", "servicesList"], newSrvs);
                          }}
                          className="w-full p-1.5 text-xs border border-gray-300"
                          placeholder="Descrição do tópico..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSrvs = [...pagesData.servicos.servicesList];
                            const points = newSrvs[idx].focusPoints.filter((_: any, i: number) => i !== pIdx);
                            newSrvs[idx].focusPoints = points;
                            updateField(["servicos", "servicesList"], newSrvs);
                          }}
                          className="text-red-500 font-bold px-2 py-1 text-xs hover:bg-red-50"
                          title="Remover Tópico"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTATO TAB */}
        {activeTab === "contato" && (
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
              Página de Contato Institucional
            </h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título da Página</label>
              <input
                type="text"
                value={pagesData.contato?.title || ""}
                onChange={(e) => updateField(["contato", "title"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instruções do Formulário</label>
              <textarea
                rows={2}
                value={pagesData.contato?.formInstructions || ""}
                onChange={(e) => updateField(["contato", "formInstructions"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Endereço Completo</label>
              <textarea
                rows={2}
                value={pagesData.contato?.address || ""}
                onChange={(e) => updateField(["contato", "address"], e.target.value)}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Telefone</label>
                <input
                  type="text"
                  value={pagesData.contato?.phone || ""}
                  onChange={(e) => updateField(["contato", "phone"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  value={pagesData.contato?.email || ""}
                  onChange={(e) => updateField(["contato", "email"], e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
