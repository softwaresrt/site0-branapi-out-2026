"use client";

import { useState } from "react";
import WordMaskHeading from "./WordMaskHeading";
import { ArrowUpRight, MessageSquare, CheckCircle2 } from "lucide-react";

const SYSTEM_TYPES = [
  "Sistema Web / ERP Sob Medida",
  "Aplicativo iOS & Android",
  "Automação de Processos com IA",
  "Integração de APIs e Bancos",
  "Site ou Plataforma de Alta Performance",
  "Outro Desafio Operacional",
];

export default function FinalCta() {
  const [selectedType, setSelectedType] = useState<string>(SYSTEM_TYPES[0]);
  const phone = "5562981580707";

  const getWaUrl = () => {
    const baseMsg = "Oi, quero um escopo de software sob medida";
    const fullMsg = `${baseMsg} (Foco: ${selectedType})`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(fullMsg)}`;
  };

  return (
    <section
      id="cta-final"
      className="relative w-full py-28 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-24"
    >
      {/* Background glow burst */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#C5FF41]/10 rounded-full blur-[180px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="relative p-8 md:p-14 rounded-3xl bg-zinc-950/90 backdrop-blur-2xl border border-[#C5FF41]/30 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(197,255,65,0.15)] text-center overflow-hidden">
        {/* Top text indicator - Clean typography without rounded capsule or sparkle icon */}
        <div className="text-xs md:text-sm font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-semibold mb-6">
          Orçamento sem compromisso
        </div>

        {/* Exact CTA title */}
        <WordMaskHeading
          text="Conte sua dor em 2 minutos e receba um escopo sem compromisso"
          as="h2"
          centered={true}
          className="text-3xl md:text-5xl lg:text-6xl text-white font-bold leading-tight max-w-3xl mx-auto text-center"
        />

        <p className="mt-6 text-zinc-300 font-body text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
          Nossos engenheiros analisam seu fluxo operacional, desenham a arquitetura ideal e apresentam valor e prazo fechados por escrito.
        </p>

        {/* Quick Scope Selector */}
        <div className="mt-10 mb-8 max-w-2xl mx-auto text-left">
          <label className="block text-xs font-mono-code uppercase tracking-wider text-zinc-400 mb-3">
            Qual é o foco principal do seu projeto?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SYSTEM_TYPES.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-3 rounded-xl text-xs md:text-sm font-mono-code text-left flex items-center justify-between border transition-all ${
                    isSelected
                      ? "bg-[#C5FF41]/15 border-[#C5FF41] text-[#C5FF41] shadow-[0_0_15px_rgba(197,255,65,0.2)] font-semibold"
                      : "bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span className="truncate">{type}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C5FF41] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main WhatsApp CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <a
            href={getWaUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full bg-[#C5FF41] text-black font-mono-code font-bold text-sm md:text-base hover:bg-[#d6ff6a] hover:shadow-[0_0_35px_rgba(197,255,65,0.6)] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#C5FF41]"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Falar com Engenheiro no WhatsApp</span>
            <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
