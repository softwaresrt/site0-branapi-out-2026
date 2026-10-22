"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Target, Zap } from "lucide-react";

const CHARS = ["+", "=", "*", "#", "@", ".", ":", "-", "~", "0", "1"];

export default function HowWeStartSection() {
  const [headingText, setHeadingText] = useState("Como a gente começa");
  const targetHeading = "Como a gente começa";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setHeadingText(
        targetHeading
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) {
              return targetHeading[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= targetHeading.length) {
        clearInterval(interval);
      }
      iteration += 1;
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      step: "01",
      title: "Mapeamento da Maior Dor",
      desc: "Identificamos a tarefa repetitiva que mais consome horas da sua equipe todo santo dia (ex: triagem de WhatsApp, cobrança ou emissão de propostas).",
    },
    {
      step: "02",
      title: "Primeira Automação em Produção",
      desc: "Colocamos o primeiro assistente ou workflow rodando rápido. Sua equipe já sente o alívio imediato na primeira semana de operação.",
    },
    {
      step: "03",
      title: "Expansão Gradual sem Risco",
      desc: "Com o ROI comprovado na prática, você escolhe o próximo processo a ser automatizado. Sem contratos megalomaníacos ou surpresas.",
    },
  ];

  return (
    <section
      id="como-comecar"
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto select-none scroll-mt-20"
    >
      {/* Background Neon Aura */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#C5FF41]/5 rounded-full blur-[170px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#C5FF41] font-bold">
          METODOLOGIA PRAGMÁTICA &bull; RESULTADO RÁPIDO
        </div>

        {/* Exact H2 Copy with Decode Effect */}
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          {headingText}
        </h2>

        {/* Exact Copy Paragraph */}
        <p className="text-zinc-300 font-display text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
          Mapeia a tarefa que mais consome tempo da equipe e automatiza ela primeiro. Quando você vê o resultado, decide o próximo passo, sem projeto gigante de entrada.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div
            key={s.step}
            className="p-7 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-lg space-y-4 hover:border-white/20 transition-all"
          >
            <div className="text-xs font-mono-code text-[#C5FF41] font-bold">
              PASSO {s.step}
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              {s.title}
            </h3>
            <p className="text-zinc-400 font-body text-sm leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
