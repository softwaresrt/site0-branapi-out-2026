"use client";

import { ArrowUpRight, CheckCircle2, Cpu, CreditCard, Layers, Store } from "lucide-react";

const CASES = [
  {
    category: "Fintech & SaaS B2B",
    title: "Plataforma de Antecipação de Recebíveis & Split",
    desc: "Arquitetura com gateway de pagamento integrado, conciliação Pix instantânea e dashboard multi-tenant para 450+ empresas usuárias.",
    metrics: "R$ 18M transacionados no 1º semestre",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Pix API"],
    icon: CreditCard,
  },
  {
    category: "Logística & Marketplace",
    title: "Marketplace On-Demand para Frotas e Embarcadores",
    desc: "Plataforma web e mobile com algoritmo de pareamento inteligente de fretes, precificação dinâmica e rastreio em tempo real.",
    metrics: "Validação em 45 dias com faturamento ativo",
    tech: ["React Native", "WebSockets", "Go", "Docker"],
    icon: Store,
  },
  {
    category: "Inteligência Artificial & SaaS",
    title: "Plataforma de Auditoria Contratual com LLM",
    desc: "Sistema SaaS que lê minutas jurídicas, identifica cláusulas de risco e preenche propostas comerciais automaticamente.",
    metrics: "Tempo de análise reduzido de 3h para 40s",
    tech: ["Next.js", "OpenAI API", "Python", "Redis"],
    icon: Cpu,
  },
];

export default function PortfolioCasesSection() {
  return (
    <section
      id="ja-construimos"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-white text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
            HISTÓRICO COMPROVADO &bull; CASES REAIS
          </div>

          {/* Exact H2 Copy */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            Já construímos
          </h2>

          {/* Exact Copy Paragraph */}
          <p className="mt-4 text-zinc-600 font-display text-lg sm:text-xl md:text-2xl leading-relaxed">
            Plataformas, SaaS, gateways de pagamento, marketplaces e sistemas com IA.
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASES.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="p-8 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-[#C5FF41] flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono-code uppercase tracking-wider text-zinc-500 bg-zinc-200/70 px-2.5 py-1 rounded-full font-bold">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-zinc-950 leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-zinc-600 font-body text-sm leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-6 p-3.5 rounded-2xl bg-white border border-zinc-200 text-xs font-mono-code text-zinc-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-bold">{item.metrics}</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-200/80 flex flex-wrap gap-1.5">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-zinc-200/60 text-zinc-700 font-mono-code text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
