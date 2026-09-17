"use client";

import { useEffect, useState } from "react";
import { LeadItem } from "@/lib/content";

const ASSUNTO_LABELS: Record<string, string> = {
  palestra: "Palestras / Congressos",
  curso: "Docência / Cursos",
  parecer: "Pareceres Técnicos",
  imprensa: "Imprensa / Entrevistas",
  outro: "Outros Assuntos",
};

export default function AdminContatos() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"todos" | "novos" | "lidos" | "respondidos" | "arquivados">("todos");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/contatos");
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, updates: { lido?: boolean; status?: LeadItem["status"] }) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/contatos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.leads) {
          setLeads(result.leads);
          if (selectedLead && selectedLead.id === id) {
            setSelectedLead({
              ...selectedLead,
              ...updates,
            });
          }
        } else {
          fetchLeads();
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar lead:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mensagem de contato? Esta ação não pode ser desfeita.")) {
      return;
    }
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/contatos?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((item) => item.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error("Erro ao excluir lead:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelectLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    // Se ainda não for lido, marca como lido automaticamente ao abrir
    if (!lead.lido || lead.status === "novo") {
      handleUpdateStatus(lead.id, { lido: true, status: "lido" });
    }
  };

  // Métricas
  const totalCount = leads.length;
  const novosCount = leads.filter((l) => !l.lido || l.status === "novo").length;
  const respondidosCount = leads.filter((l) => l.status === "respondido").length;
  const arquivadosCount = leads.filter((l) => l.status === "arquivado").length;

  // Filtragem de lista
  const filteredLeads = leads.filter((item) => {
    // Filtro por abas
    if (activeTab === "novos" && (item.lido && item.status !== "novo")) return false;
    if (activeTab === "lidos" && (!item.lido || item.status === "novo" || item.status === "arquivado")) return false;
    if (activeTab === "respondidos" && item.status !== "respondido") return false;
    if (activeTab === "arquivados" && item.status !== "arquivado") return false;

    // Filtro de busca por texto
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.nome.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.instituicao && item.instituicao.toLowerCase().includes(q)) ||
      item.mensagem.toLowerCase().includes(q) ||
      item.assunto.toLowerCase().includes(q)
    );
  });

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "-";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  const renderStatusBadge = (lead: LeadItem) => {
    if (lead.status === "arquivado") {
      return <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border border-gray-300">Arquivado</span>;
    }
    if (lead.status === "respondido") {
      return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border border-emerald-300">Respondido</span>;
    }
    if (!lead.lido || lead.status === "novo") {
      return <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border border-amber-300">Novo</span>;
    }
    return <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border border-blue-200">Lido</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-brand-gold-dark uppercase tracking-widest block">
            Gestão de Leads &amp; Contatos
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-navy">
            Mensagens Recebidas do Formulário
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Acompanhe solicitações de pareceres, convites para palestras, docência e imprensa enviados pelos leitores do site.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="self-start md:self-auto py-2 px-4 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider border border-brand-gold/30 hover:bg-brand-navy/90 transition-all cursor-pointer"
        >
          {loading ? "Carregando..." : "🔄 Atualizar Lista"}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-200 shadow-xs border-l-4 border-l-brand-navy">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">Total Recebidos</span>
          <span className="text-2xl font-serif font-bold text-brand-navy">{totalCount}</span>
        </div>
        <div className="bg-white p-4 border border-gray-200 shadow-xs border-l-4 border-l-amber-500">
          <span className="text-xs font-mono text-amber-700 uppercase tracking-wider block">Não Lidos / Novos</span>
          <span className="text-2xl font-serif font-bold text-amber-700">{novosCount}</span>
        </div>
        <div className="bg-white p-4 border border-gray-200 shadow-xs border-l-4 border-l-emerald-500">
          <span className="text-xs font-mono text-emerald-700 uppercase tracking-wider block">Respondidos</span>
          <span className="text-2xl font-serif font-bold text-emerald-700">{respondidosCount}</span>
        </div>
        <div className="bg-white p-4 border border-gray-200 shadow-xs border-l-4 border-l-gray-400">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">Arquivados</span>
          <span className="text-2xl font-serif font-bold text-gray-600">{arquivadosCount}</span>
        </div>
      </div>

      {/* Controls: Search and Tabs */}
      <div className="bg-white p-4 border border-gray-200 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-gray-200 w-full sm:w-auto">
            {(
              [
                { id: "todos", label: `Todos (${totalCount})` },
                { id: "novos", label: `Novos (${novosCount})` },
                { id: "lidos", label: "Lidos" },
                { id: "respondidos", label: `Respondidos (${respondidosCount})` },
                { id: "arquivados", label: `Arquivados (${arquivadosCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-brand-gold text-brand-navy bg-brand-bg/40 font-extrabold"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="🔍 Buscar por nome, e-mail ou assunto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 outline-none"
            />
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-500">
            Carregando mensagens de contato...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-gray-200 bg-gray-50">
            <span className="text-2xl block">📭</span>
            <p className="text-sm font-serif font-bold text-gray-700">Nenhum contato encontrado</p>
            <p className="text-xs text-gray-500">
              {search ? "Nenhuma mensagem corresponde aos critérios de busca." : "Ainda não há mensagens nesta categoria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-[10px] font-mono uppercase tracking-wider text-gray-600">
                  <th className="p-3">Status</th>
                  <th className="p-3">Nome &amp; Instituição</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Natureza</th>
                  <th className="p-3">Data</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                {filteredLeads.map((lead) => {
                  const isUnread = !lead.lido || lead.status === "novo";
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-brand-bg/50 transition-colors cursor-pointer ${
                        isUnread ? "bg-amber-50/50 font-semibold" : ""
                      }`}
                      onClick={() => handleSelectLead(lead)}
                    >
                      <td className="p-3 whitespace-nowrap">{renderStatusBadge(lead)}</td>
                      <td className="p-3">
                        <div className="font-serif font-bold text-brand-navy">{lead.nome}</div>
                        {lead.instituicao && (
                          <div className="text-[11px] text-gray-500 font-sans">{lead.instituicao}</div>
                        )}
                      </td>
                      <td className="p-3 font-mono text-gray-700">{lead.email}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 border border-gray-200">
                          {ASSUNTO_LABELS[lead.assunto] || lead.assunto}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSelectLead(lead)}
                            className="px-2 py-1 bg-brand-navy text-white text-[11px] hover:bg-brand-gold hover:text-brand-navy transition-colors"
                          >
                            Ver Mensagem
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            disabled={actionLoading === lead.id}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 text-[11px] border border-red-200 transition-colors"
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-brand-gold/40 max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {renderStatusBadge(selectedLead)}
                  <span className="text-[10px] font-mono text-gray-500">
                    {formatDate(selectedLead.created_at)}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-navy">
                  {selectedLead.nome}
                </h3>
                {selectedLead.instituicao && (
                  <p className="text-xs text-gray-600 font-sans">
                    Instituição: <strong>{selectedLead.instituicao}</strong>
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Info Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-bg/50 p-4 border border-brand-gold/20 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-500 block">E-mail para Resposta</span>
                <a
                  href={`mailto:${selectedLead.email}?subject=Re: ${encodeURIComponent(
                    ASSUNTO_LABELS[selectedLead.assunto] || selectedLead.assunto
                  )} - Heron Charneski`}
                  className="font-mono font-bold text-brand-navy hover:text-brand-gold underline block mt-0.5"
                >
                  ✉️ {selectedLead.email}
                </a>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-500 block">Natureza do Contato</span>
                <span className="font-bold text-gray-800 block mt-0.5">
                  {ASSUNTO_LABELS[selectedLead.assunto] || selectedLead.assunto}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-navy font-bold block">
                Conteúdo da Mensagem:
              </span>
              <div className="p-4 bg-gray-50 border border-gray-200 text-xs text-gray-800 font-sans leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                {selectedLead.mensagem}
              </div>
            </div>

            {/* Status Change & Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">Alterar status:</span>
                <select
                  value={selectedLead.status || (selectedLead.lido ? "lido" : "novo")}
                  onChange={(e) =>
                    handleUpdateStatus(selectedLead.id, {
                      status: e.target.value as LeadItem["status"],
                      lido: e.target.value !== "novo",
                    })
                  }
                  className="text-xs border border-gray-300 px-2 py-1 bg-white font-mono"
                >
                  <option value="novo">Novo</option>
                  <option value="lido">Lido</option>
                  <option value="respondido">Respondido</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedLead.email}?subject=Re: ${encodeURIComponent(
                    ASSUNTO_LABELS[selectedLead.assunto] || selectedLead.assunto
                  )} - Heron Charneski`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    handleUpdateStatus(selectedLead.id, { status: "respondido", lido: true });
                  }}
                  className="px-3 py-1.5 bg-brand-gold text-brand-navy hover:bg-brand-gold-dark text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                >
                  ✉️ Responder por E-mail
                </a>
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
