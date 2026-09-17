"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsManager() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Erro ao salvar configurações");

      setMessage("Configurações gerais atualizadas com sucesso!");
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="py-12 text-center text-gray-500 font-mono text-sm">
        Carregando configurações...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-navy">
            Configurações Globais &amp; SEO
          </h2>
          <p className="text-xs text-gray-500">
            Altere dados de contato institucionais, rodapé, título global e palavras-chave de SEO.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold"
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>

      {message && (
        <div className="p-4 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {message}
        </div>
      )}

      <div className="bg-white p-8 border border-gray-200 space-y-8">
        {/* IDENTIDADE */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
            Identidade do Site
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Nome do Professor / Autor</label>
              <input
                type="text"
                value={settings.siteName || ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Slogan / Subtítulo Institucional</label>
              <input
                type="text"
                value={settings.siteTagline || ""}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* CONTATO DO RODAPÉ */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
            Informações de Contato (Rodapé &amp; Geral)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Telefone</label>
              <input
                type="text"
                value={settings.contact?.phone || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value },
                  })
                }
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">E-mail Institucional</label>
              <input
                type="text"
                value={settings.contact?.email || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase mb-1">Endereço Físico</label>
              <input
                type="text"
                value={settings.contact?.address || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, address: e.target.value },
                  })
                }
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Link Currículo Lattes</label>
              <input
                type="text"
                value={settings.contact?.lattes || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, lattes: e.target.value },
                  })
                }
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Link do Escritório</label>
              <input
                type="text"
                value={settings.contact?.officeSite || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, officeSite: e.target.value },
                  })
                }
                className="w-full p-2 text-sm border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-2">
            Metadados de SEO (Otimização para Busca)
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Título Padrão (Page Title)</label>
            <input
              type="text"
              value={settings.seo?.defaultTitle || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, defaultTitle: e.target.value },
                })
              }
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Descrição Meta Padrão</label>
            <textarea
              rows={3}
              value={settings.seo?.defaultDescription || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, defaultDescription: e.target.value },
                })
              }
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Palavras-chave (Keywords)</label>
            <input
              type="text"
              value={settings.seo?.keywords || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, keywords: e.target.value },
                })
              }
              className="w-full p-2 text-sm border border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
