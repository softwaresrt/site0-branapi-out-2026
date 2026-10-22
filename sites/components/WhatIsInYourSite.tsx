"use client";

import { useState } from "react";
import {
  Palette,
  Search,
  MessageSquare,
  Edit3,
  Network,
  ChevronDown,
  Globe,
  Sliders,
  Send,
  Zap,
} from "lucide-react";

interface SiteFeature {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: typeof Palette;
  badge: string;
  mockupUrl: string;
}

const FEATURES: SiteFeature[] = [
  {
    id: "design",
    num: "01",
    title: "Design exclusivo (nada de template com cara de todo mundo)",
    subtitle:
      "Construção 100% autoral alinhada à autoridade da sua marca. Tipografia personalizada, direção de arte premium e microinterações fluidas.",
    icon: Palette,
    badge: "Direção de Arte",
    mockupUrl: "suaempresa.com.br",
  },
  {
    id: "seo",
    num: "02",
    title: "Estrutura de SEO desde o primeiro dia: títulos, velocidade, mobile, dados estruturados",
    subtitle:
      "Arquitetura técnica para conquistar as primeiras posições no Google. Schema.org, meta tags, sitemap e pontuação máxima no PageSpeed.",
    icon: Search,
    badge: "Google First",
    mockupUrl: "google.com.br/search?q=seu-servico",
  },
  {
    id: "conversao",
    num: "03",
    title: "Botões e formulários pensados para gerar contato",
    subtitle:
      "Gatilhos de conversão estrategicamente posicionados. Formulários rápidos sem atrito, botão fixo de WhatsApp e mensuração de cliques.",
    icon: MessageSquare,
    badge: "Conversão Real",
    mockupUrl: "suaempresa.com.br/contato",
  },
  {
    id: "cms",
    num: "04",
    title: "Painel para você mesmo trocar textos e imagens",
    subtitle:
      "Gerenciador de conteúdo visual e direto. Altere frases, publique fotos e atualize seus produtos sem depender de programador.",
    icon: Edit3,
    badge: "Autonomia Total",
    mockupUrl: "suaempresa.com.br/admin",
  },
  {
    id: "integracoes",
    num: "05",
    title: "Integração com WhatsApp, Google Analytics e CRM",
    subtitle:
      "Sincronização em tempo real com as ferramentas que você já usa: Pixel do Meta, GA4, RD Station, HubSpot e webhooks.",
    icon: Network,
    badge: "Telemetria & Dados",
    mockupUrl: "analytics.google.com",
  },
];

export default function WhatIsInYourSite() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = FEATURES[activeIdx];

  return (
    <section
      id="o-que-vai"
      className="relative w-full py-24 sm:py-28 px-4 sm:px-6 md:px-8 bg-white text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Clean Header Without Capsule or Sparkles */}
        <div className="mb-14 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">
            ENTREGA COMPLETA
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            O que vai no seu site
          </h2>

          <p className="mt-4 text-zinc-600 font-body text-base md:text-lg leading-relaxed">
            Estrutura técnica robusta e design de estúdio sem modelos prontos. Tudo configurado para gerar vendas desde o primeiro dia.
          </p>
        </div>

        {/* Clean 2-Column Layout: Feature List + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Succinct Feature List */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              const isSelected = activeIdx === idx;

              return (
                <div key={feature.id} className="flex flex-col">
                  <div
                    onClick={() => setActiveIdx(idx)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveIdx(idx);
                      }
                    }}
                    className={`group p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                      isSelected
                        ? "bg-zinc-50 border-zinc-900 shadow-sm"
                        : "bg-white hover:bg-zinc-50/80 border-zinc-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-black text-[#C5FF41]"
                            : "bg-zinc-100 text-zinc-600 group-hover:text-black group-hover:bg-zinc-200"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-zinc-500">
                            {feature.num} &bull; {feature.badge}
                          </span>
                          <ChevronDown
                            className={`lg:hidden w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                              isSelected ? "rotate-180 text-black" : ""
                            }`}
                          />
                        </div>

                        <h3 className="font-display font-semibold text-lg text-zinc-950 mt-1 leading-snug">
                          {feature.title}
                        </h3>

                        <p className="mt-1.5 text-zinc-600 font-body text-sm leading-relaxed">
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Accordion Drawer */}
                  <div className="lg:hidden">
                    {isSelected && (
                      <div className="p-4 mt-2 rounded-2xl bg-zinc-50 border border-zinc-200 animate-in fade-in duration-150">
                        <LightMockupRenderer feature={feature} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Desktop Sticky Browser Mockup (Clean Light/Dark Hybrid) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-3xl bg-zinc-950 text-white shadow-xl border border-zinc-900 overflow-hidden">
              {/* Browser Window Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/90">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>

                <div className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-center font-mono-code text-[11px] text-zinc-400 truncate flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-[#C5FF41]" />
                  <span>https://{activeItem.mockupUrl}</span>
                </div>

                <span className="text-[10px] font-mono-code text-[#C5FF41] font-bold">
                  PRONTO
                </span>
              </div>

              {/* Mockup Preview Area */}
              <div className="p-6 min-h-[320px] flex flex-col justify-center">
                <LightMockupRenderer feature={activeItem} />
              </div>

              <div className="px-5 py-2.5 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs font-mono-code text-zinc-400">
                <span>Padronização Técnica Branapi</span>
                <span className="text-[#C5FF41] font-semibold">100% Otimizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LightMockupRenderer({ feature }: { feature: SiteFeature }) {
  if (feature.id === "design") {
    return (
      <div className="space-y-3 font-body">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-[10px] font-mono-code text-[#C5FF41] uppercase tracking-wider mb-1">
            Direção de Arte Exclusiva
          </div>
          <div className="font-display font-bold text-xl text-white">
            Identidade Forte e Sob Medida
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Design que posiciona sua marca como líder do setor, sem templates prontos.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center font-mono-code text-xs">
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[10px] text-zinc-500">Percepção de Valor</div>
            <div className="text-base font-bold text-[#C5FF41] mt-0.5">+340%</div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[10px] text-zinc-500">Animações</div>
            <div className="text-base font-bold text-white mt-0.5">60 FPS Fluidas</div>
          </div>
        </div>
      </div>
    );
  }

  if (feature.id === "seo") {
    return (
      <div className="space-y-3 font-mono-code">
        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
            <span className="text-blue-400 font-bold">Google</span>
            <span>https://suaempresa.com.br</span>
          </div>
          <div className="text-xs font-semibold text-[#C5FF41]">
            Sua Empresa &bull; Soluções Líderes de Mercado
          </div>
          <p className="text-[11px] text-zinc-300 font-body leading-relaxed">
            Estrutura técnica com Schema.org para ranquear no topo das pesquisas orgânicas.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#C5FF41]" />
            PageSpeed Score:
          </span>
          <span className="text-[#C5FF41] font-bold">100 / 100</span>
        </div>
      </div>
    );
  }

  if (feature.id === "conversao") {
    return (
      <div className="space-y-3 font-body">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <span className="text-[#C5FF41] font-bold">Gatilhos de Conversão</span>
            <span className="text-zinc-400 text-[10px]">1-Clique</span>
          </div>

          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono-code text-zinc-300 flex justify-between">
            <span>WhatsApp Direto</span>
            <span className="text-[#C5FF41]">✓ Instantâneo</span>
          </div>

          <button
            type="button"
            className="w-full py-2 rounded-lg bg-[#C5FF41] text-black font-mono-code font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contato Sem Fricção</span>
          </button>
        </div>
      </div>
    );
  }

  if (feature.id === "cms") {
    return (
      <div className="space-y-2.5 font-mono-code text-xs">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-[#C5FF41] font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Editor Visual Direto
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#C5FF41] text-black font-bold">
              Salvo
            </span>
          </div>
          <div className="p-2 rounded bg-black/50 border border-zinc-800 text-zinc-300 text-[11px]">
            &quot;Troque textos e fotos facilmente sem programador&quot;
          </div>
        </div>
      </div>
    );
  }

  // Integrations
  return (
    <div className="space-y-2 font-mono-code text-xs">
      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex justify-between text-zinc-400 pb-1.5 border-b border-zinc-800">
          <span className="text-[#C5FF41] font-bold">Integrações Conectadas</span>
          <span className="text-[10px] text-zinc-400">Tempo Real</span>
        </div>
        <div className="flex justify-between text-zinc-300 text-[11px]">
          <span>WhatsApp Cloud API</span>
          <span className="text-[#C5FF41]">Ativo</span>
        </div>
        <div className="flex justify-between text-zinc-300 text-[11px]">
          <span>Google Analytics 4 &amp; Pixel</span>
          <span className="text-[#C5FF41]">Ativo</span>
        </div>
        <div className="flex justify-between text-zinc-300 text-[11px]">
          <span>CRM &amp; Pipeline de Vendas</span>
          <span className="text-[#C5FF41]">Ativo</span>
        </div>
      </div>
    </div>
  );
}
