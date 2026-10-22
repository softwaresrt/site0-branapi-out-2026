"use client";

import { useState } from "react";
import WordMaskHeading from "./WordMaskHeading";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Quanto custa um software sob medida?",
    answer:
      "Depende do escopo. Por isso o orçamento é feito depois de entender o seu processo, e se estourar seu budget a gente propõe um MVP com evolução mensal.",
  },
  {
    question: "O código fica comigo?",
    answer: "Sim, entregue após a quitação.",
  },
  {
    question: "E se eu precisar de mudança depois?",
    answer: "Existe plano de suporte mensal opcional.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative w-full py-28 px-4 md:px-8 max-w-4xl mx-auto scroll-mt-24"
    >
      <div className="mb-14 text-center">
        <WordMaskHeading
          roman="V"
          badge="Dúvidas comuns"
          text="Perguntas frequentes"
          as="h2"
          centered={true}
          className="text-3xl md:text-5xl lg:text-6xl text-white font-bold text-center"
        />
        <p className="mt-4 text-zinc-400 font-body text-base md:text-lg">
          Respostas diretas sobre investimento, propriedade intelectual e suporte contínuo.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-zinc-950/90 border-[#C5FF41]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(197,255,65,0.08)]"
                  : "bg-black/40 hover:bg-zinc-950/50 border-white/[0.08] hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full p-6 md:p-7 flex items-center justify-between gap-4 text-left focus:outline-none focus:ring-1 focus:ring-[#C5FF41]"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono-code text-[#C5FF41] shrink-0 font-bold">
                    0{idx + 1}
                  </span>
                  <span className="font-display font-semibold text-lg md:text-xl text-white">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 shrink-0 ${
                    isOpen
                      ? "rotate-180 bg-[#C5FF41] text-black border-[#C5FF41]"
                      : "bg-white/5 text-zinc-400 border-white/10"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 md:px-7 pb-6 pt-1 text-zinc-300 font-body text-base leading-relaxed border-t border-white/[0.06] animate-in fade-in duration-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
