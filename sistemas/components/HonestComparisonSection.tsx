"use client";

import { useState } from "react";
import { Check, X, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";

interface ComparisonRow {
  criteria: string;
  planilha: {
    status: string;
    sub: string;
    type: "partial" | "no" | "yes";
  };
  alugado: {
    status: string;
    sub: string;
    type: "partial" | "no" | "yes";
  };
  branapi: {
    status: string;
    sub: string;
    type: "partial" | "no" | "yes";
  };
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    criteria: "Adaptado ao seu processo",
    planilha: {
      status: "Parcial",
      sub: "Você monta como quer, mas quebra fácil",
      type: "partial",
    },
    alugado: {
      status: "Não",
      sub: "Você precisa mudar seu fluxo pra caber no sistema",
      type: "no",
    },
    branapi: {
      status: "Sim",
      sub: "Desenhado exatamente como sua empresa opera",
      type: "yes",
    },
  },
  {
    criteria: "Mensalidade",
    planilha: {
      status: "Não",
      sub: "Custo de licença zero (mas alto custo de tempo)",
      type: "no",
    },
    alugado: {
      status: "Sim, cresce",
      sub: "Paga por usuário e por volume todo santo mês",
      type: "partial",
    },
    branapi: {
      status: "Opcional, só suporte",
      sub: "Investimento único no projeto; sem taxa por usuário",
      type: "yes",
    },
  },
  {
    criteria: "Você é dono",
    planilha: {
      status: "Sim",
      sub: "O arquivo é seu no seu computador",
      type: "yes",
    },
    alugado: {
      status: "Não",
      sub: "Se parar de pagar, perde o acesso aos seus dados",
      type: "no",
    },
    branapi: {
      status: "Sim, com código-fonte",
      sub: "Propriedade total do software e do banco de dados",
      type: "yes",
    },
  },
  {
    criteria: "Escala com a empresa",
    planilha: {
      status: "Não",
      sub: "Trava com mais de 2 pessoas editando juntas",
      type: "no",
    },
    alugado: {
      status: "Limitado",
      sub: "Cobra mais caro ou exige trocar para plano Enterprise",
      type: "partial",
    },
    branapi: {
      status: "Sim",
      sub: "Nuvem escalável e arquitetura preparada para crescer",
      type: "yes",
    },
  },
];

export default function HonestComparisonSection() {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  return (
    <section
      id="comparativo"
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto select-none scroll-mt-20"
    >
      {/* Background Neon Aura */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5FF41]/6 rounded-full blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="mb-16 max-w-3xl">
        {/* Eyebrow */}
        <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold mb-3">
          ANÁLISE DE MERCADO &bull; DECISÃO ESTRATÉGICA
        </div>

        {/* Exact H2 Copy */}
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          Comparativo honesto
        </h2>

        <p className="mt-4 text-zinc-400 font-body text-base md:text-lg leading-relaxed">
          Sem meias-palavras: entenda os prós e contras de cada modelo antes de investir o capital da sua empresa.
        </p>
      </div>

      {/* Flagship Effect #4: Responsive Comparison Matrix with Glowing Column */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px] rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Header Row */}
          <div className="grid grid-cols-12 border-b border-white/10 font-mono-code text-xs">
            <div className="col-span-3 p-5 sm:p-6 text-zinc-500 uppercase tracking-wider font-bold flex items-center">
              Critério
            </div>
            <div className="col-span-3 p-5 sm:p-6 text-zinc-400 font-bold border-l border-white/10 flex items-center">
              Planilha
            </div>
            <div className="col-span-3 p-5 sm:p-6 text-zinc-400 font-bold border-l border-white/10 flex items-center">
              Sistema Alugado (SaaS)
            </div>
            {/* Highlighted Branapi Column Header */}
            <div className="col-span-3 p-5 sm:p-6 bg-[#C5FF41]/15 text-[#C5FF41] font-black border-l-2 border-[#C5FF41] flex items-center justify-between">
              <span className="text-sm">Sistema Branapi</span>
              <Sparkles className="w-4 h-4 text-[#C5FF41]" />
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5 font-mono-code text-xs">
            {COMPARISON_DATA.map((row, idx) => {
              const isHovered = hoveredRowIndex === idx;

              return (
                <div
                  key={row.criteria}
                  onMouseEnter={() => setHoveredRowIndex(idx)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                  className={`grid grid-cols-12 transition-colors duration-200 ${
                    isHovered ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Criteria Column */}
                  <div className="col-span-3 p-5 sm:p-6 text-white font-display font-bold text-sm sm:text-base flex items-center">
                    {row.criteria}
                  </div>

                  {/* Planilha */}
                  <div className="col-span-3 p-5 sm:p-6 border-l border-white/5 space-y-1 flex flex-col justify-center">
                    <span
                      className={`font-bold text-sm ${
                        row.planilha.status === "Sim"
                          ? "text-zinc-200"
                          : row.planilha.status === "Parcial"
                          ? "text-yellow-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {row.planilha.status}
                    </span>
                    <span className="text-[11px] text-zinc-500 leading-tight">
                      {row.planilha.sub}
                    </span>
                  </div>

                  {/* Sistema Alugado */}
                  <div className="col-span-3 p-5 sm:p-6 border-l border-white/5 space-y-1 flex flex-col justify-center">
                    <span
                      className={`font-bold text-sm ${
                        row.alugado.status === "Não"
                          ? "text-red-400"
                          : row.alugado.status === "Limitado"
                          ? "text-yellow-400"
                          : "text-zinc-300"
                      }`}
                    >
                      {row.alugado.status}
                    </span>
                    <span className="text-[11px] text-zinc-500 leading-tight">
                      {row.alugado.sub}
                    </span>
                  </div>

                  {/* Sistema Branapi (Highlighted Column with Breathing Glow) */}
                  <div className="col-span-3 p-5 sm:p-6 border-l-2 border-[#C5FF41] bg-[#C5FF41]/[0.08] glow-breathing space-y-1 flex flex-col justify-center">
                    <span className="font-display font-black text-base text-[#C5FF41] flex items-center gap-1.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{row.branapi.status}</span>
                    </span>
                    <span className="text-[11px] text-zinc-300 leading-tight font-body">
                      {row.branapi.sub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
