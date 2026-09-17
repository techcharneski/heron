"use client";

import { useState, FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    instituicao: "",
    assunto: "palestra",
    mensagem: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.mensagem) {
      setStatus("error");
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Ocorreu um erro no envio. Tente novamente mais tarde.");
      }

      setStatus("success");
      setFormData({ nome: "", email: "", instituicao: "", assunto: "palestra", mensagem: "" });
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Não foi possível enviar a mensagem. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-gold selection:text-brand-navy">
      <Header />

      <main className="flex-grow py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-gold-dark block">
                  Interlocução Institucional
                </span>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy tracking-tight leading-tight">
                  Contato e Convites
                </h1>
                <p className="text-sm md:text-base text-brand-text/80 leading-relaxed font-serif">
                  Para convites acadêmicos, bancas examinadoras, palestras, coordenação de cursos de extensão ou solicitações de pareceres técnicos, utilize o formulário ao lado.
                </p>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-brand-gold/20 p-6 md:p-8 rounded-none hover:border-brand-gold hover:shadow-xl transition-all">
                <h2 className="font-serif text-xl font-bold text-brand-navy mb-6">
                  Formulário de Contato
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="nome" 
                      className="text-[10px] font-sans font-bold text-brand-navy uppercase tracking-widest"
                    >
                      Nome Completo *
                    </label>
                    <input
                      id="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      disabled={status === "loading" || status === "success"}
                      className="w-full bg-brand-bg/30 border border-brand-gold/20 px-4 py-3 text-sm rounded-none focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all disabled:opacity-50"
                      placeholder="Ex: Prof. Roberto Silva"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="email" 
                        className="text-[10px] font-sans font-bold text-brand-navy uppercase tracking-widest"
                      >
                        E-mail *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={status === "loading" || status === "success"}
                        className="w-full bg-brand-bg/30 border border-brand-gold/20 px-4 py-3 text-sm rounded-none focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all disabled:opacity-50"
                        placeholder="roberto@universidade.edu.br"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label 
                        htmlFor="instituicao" 
                        className="text-[10px] font-sans font-bold text-brand-navy uppercase tracking-widest"
                      >
                        Instituição / Organização
                      </label>
                      <input
                        id="instituicao"
                        type="text"
                        value={formData.instituicao}
                        onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                        disabled={status === "loading" || status === "success"}
                        className="w-full bg-brand-bg/30 border border-brand-gold/20 px-4 py-3 text-sm rounded-none focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all disabled:opacity-50"
                        placeholder="Ex: Universidade ou Empresa"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label 
                      htmlFor="assunto" 
                      className="text-[10px] font-sans font-bold text-brand-navy uppercase tracking-widest"
                    >
                      Natureza do Contato
                    </label>
                    <select
                      id="assunto"
                      value={formData.assunto}
                      onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                      disabled={status === "loading" || status === "success"}
                      className="w-full bg-brand-bg/30 border border-brand-gold/20 px-4 py-3 text-sm rounded-none focus:border-brand-gold focus:bg-white outline-none transition-all"
                    >
                      <option value="palestra">Convite para Palestra ou Congresso</option>
                      <option value="curso">Docência ou Coordenação de Curso</option>
                      <option value="parecer">Solicitação de Parecer Técnico</option>
                      <option value="imprensa">Contato de Imprensa / Entrevista</option>
                      <option value="outro">Outros Assuntos Acadêmicos</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label 
                      htmlFor="mensagem" 
                      className="text-[10px] font-sans font-bold text-brand-navy uppercase tracking-widest"
                    >
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      required
                      rows={5}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      disabled={status === "loading" || status === "success"}
                      className="w-full bg-brand-bg/30 border border-brand-gold/20 px-4 py-3 text-sm rounded-none focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all disabled:opacity-50 resize-y"
                      placeholder="Descreva detalhadamente o convite ou a pauta..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-none">
                      {errorMessage}
                    </div>
                  )}

                  {status === "success" && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-none">
                      Mensagem enviada com sucesso. Em breve retornaremos o contato.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full bg-brand-navy text-white hover:text-brand-gold text-xs font-bold tracking-widest uppercase py-4 border border-brand-gold/15 hover:border-brand-gold transition-all duration-300 rounded-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                  >
                    {status === "loading" ? "Enviando..." : "Enviar Mensagem"}
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
