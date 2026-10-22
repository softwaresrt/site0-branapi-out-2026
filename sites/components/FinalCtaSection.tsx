"use client";

import { useState } from "react";
import LiquidGlassButton from "./LiquidGlassButton";
import { MessageSquare, CheckCircle2 } from "lucide-react";

const SITE_OBJECTIVES = [
  "Site Institucional de Alto Padrão",
  "Landing Page para Campanha & Tráfego",
  "E-commerce e Loja Virtual",
  "Site com Área de Cliente / Agendamento",
  "Redesenho Completo de Site Atual",
];

export default function FinalCtaSection() {
  const [selectedObjective, setSelectedObjective] = useState(SITE_OBJECTIVES[0]);
  const phone = "5562981580707";

  const getWaUrl = () => {
    const baseMsg = "Oi, quero uma proposta de site com layout de exemplo";
    const fullMsg = `${baseMsg} (Foco: ${selectedObjective})`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(fullMsg)}`;
  };

  return (
    <section
      id="proposta"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-zinc-50 text-zinc-950 border-t border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto">
        <div className="relative p-8 sm:p-12 md:p-16 rounded-[2.5rem] bg-white border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center overflow-hidden">
          {/* Top Eyebrow - Clean typography without capsule or sparkles */}
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4">
            PROPOSTA PERSONALIZADA
          </div>

          {/* Exact Copy CTA Title */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight leading-tight max-w-3xl mx-auto">
            Quer ver como ficaria o seu?
          </h2>

          {/* Exact Subtitle Copy */}
          <p className="mt-4 text-zinc-800 font-display text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Peça uma proposta com layout de exemplo
          </p>

          <p className="mt-2 text-sm sm:text-base font-body text-zinc-500 max-w-xl mx-auto leading-relaxed">
            A gente desenha uma prévia de como sua marca pode se destacar na web, com estimativa de prazo e valor fechado.
          </p>

          {/* Focus Selector */}
          <div className="mt-10 mb-8 max-w-2xl mx-auto text-left">
            <label className="block text-xs font-mono-code uppercase tracking-wider text-zinc-500 mb-3 text-center sm:text-left">
              Selecione o objetivo principal do seu novo site:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SITE_OBJECTIVES.map((obj) => {
                const isSelected = selectedObjective === obj;
                return (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => setSelectedObjective(obj)}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-mono-code text-left flex items-center justify-between border transition-all ${
                      isSelected
                        ? "bg-black text-[#C5FF41] border-black font-semibold shadow-sm"
                        : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300"
                    }`}
                  >
                    <span className="truncate">{obj}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C5FF41] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liquid Glass CTA Button */}
          <div className="mt-8 flex flex-col items-center justify-center">
            <LiquidGlassButton href={getWaUrl()} className="px-10 py-5 text-base md:text-lg">
              <MessageSquare className="w-5 h-5 fill-current text-[#C5FF41]" />
              <span>Falar no WhatsApp e Pedir Proposta</span>
            </LiquidGlassButton>
          </div>

          {/* Guarantee Notes */}
          <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-6 text-xs font-mono-code text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
              Layout de exemplo exclusivo
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
              Sem compromisso de contratação
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
              Atendimento direto com especialistas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
