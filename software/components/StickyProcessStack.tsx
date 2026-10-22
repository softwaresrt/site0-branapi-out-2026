"use client";

import WordMaskHeading from "./WordMaskHeading";
import {
  MessageSquare,
  FileText,
  Palette,
  Terminal,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

interface Step {
  num: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof MessageSquare;
  rotation: string;
  deliverable: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    badge: "Etapa 01 · Diagnóstico",
    title: "1. Conversa: a gente ouve a dor antes de falar de tecnologia.",
    description:
      "A gente ouve a dor antes de falar de tecnologia. Mapeamos os gargalos operacionais da empresa, onde o processo atual perde tempo ou dinheiro e qual resultado de negócio precisa ser atingido.",
    icon: MessageSquare,
    rotation: "-rotate-1",
    deliverable: "Diagnóstico inicial e alinhamento de expectativas",
  },
  {
    num: "02",
    badge: "Etapa 02 · Planejamento",
    title: "2. Escopo: você recebe funcionalidades, valor e prazo por escrito.",
    description:
      "Você recebe funcionalidades, valor e prazo por escrito. Nada de orçamento vago ou estimativa aberta: você sabe exatamente o que será construído, quanto vai custar e a data exata de entrega.",
    icon: FileText,
    rotation: "rotate-1",
    deliverable: "Proposta técnica detalhada com escopo fechado",
  },
  {
    num: "03",
    badge: "Etapa 03 · Validação Visual",
    title: "3. Design: você aprova o layout antes de uma linha de código.",
    description:
      "Você aprova o layout antes de uma linha de código. Nossos designers criam a experiência completa no Figma, com protótipo navegável em alta fidelidade para validar com a sua equipe antes de programar.",
    icon: Palette,
    rotation: "-rotate-1.5",
    deliverable: "Protótipo interativo em alta fidelidade",
  },
  {
    num: "04",
    badge: "Etapa 04 · Construção Ágil",
    title: "4. Desenvolvimento e testes: você acompanha por um link externo e pede ajustes.",
    description:
      "Você acompanha por um link externo e pede ajustes. Ambiente de homologação aberto em tempo real. Você testa cada módulo pronto, valida o fluxo com seu time e ajusta o que for necessário.",
    icon: Terminal,
    rotation: "rotate-1",
    deliverable: "Ambiente de homologação online com deploys contínuos",
  },
  {
    num: "05",
    badge: "Etapa 05 · Go-Live & Suporte",
    title: "5. Entrega: código-fonte, documentação e manual do usuário. 30 dias de suporte com acesso direto aos devs.",
    description:
      "Código-fonte, documentação e manual do usuário. 30 dias de suporte com acesso direto aos devs. Você é o dono irrestrito do software. Sem taxas ocultas, sem dependência permanente.",
    icon: ShieldCheck,
    rotation: "rotate-0",
    deliverable: "Repositório completo, manuais e garantia de 30 dias",
  },
];

export default function StickyProcessStack() {
  return (
    <section
      id="como-funciona"
      className="relative w-full py-28 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-24"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-[#C5FF41]/5 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <WordMaskHeading
          roman="III"
          badge="Metodologia transparente"
          text="Como funciona (sem surpresa no caminho)"
          as="h2"
          centered={true}
          className="text-3xl md:text-5xl lg:text-6xl text-white font-bold text-center"
        />
        <p className="mt-4 text-zinc-400 font-body text-base md:text-lg">
          Processo claro e previsível. Você sabe o que está acontecendo em cada dia do desenvolvimento, sem jargões técnicos confusos.
        </p>
      </div>

      {/* Sticky Stacked Cards Container */}
      <div className="relative flex flex-col gap-12 pb-16">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          // Calculate sticky top offset
          const topOffset = `calc(13vh + ${index * 24}px)`;

          return (
            <div
              key={step.num}
              style={{ top: topOffset }}
              className={`sticky transition-transform duration-300 ${step.rotation}`}
            >
              <div className="relative p-7 md:p-12 rounded-3xl bg-[#09090b]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-[#C5FF41]/40 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden group">
                {/* Giant Green Outline Number Behind Card */}
                <div
                  aria-hidden="true"
                  className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 font-display font-black text-[120px] md:text-[210px] leading-none text-transparent [-webkit-text-stroke:2px_rgba(197,255,65,0.25)] group-hover:[-webkit-text-stroke:2px_rgba(197,255,65,0.6)] select-none pointer-events-none transition-all duration-500"
                >
                  {step.num}
                </div>

                {/* Subtle top neon border accent */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5FF41]/50 to-transparent"
                  aria-hidden="true"
                />

                <div className="relative z-10 max-w-2xl">
                  {/* Step Tag */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#C5FF41]/15 border border-[#C5FF41]/30 flex items-center justify-center text-[#C5FF41] shadow-[0_0_15px_rgba(197,255,65,0.2)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono-code uppercase tracking-wider text-[#C5FF41] font-semibold">
                      {step.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-3xl font-display font-semibold text-white leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-zinc-300 font-body text-base md:text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Deliverable Check Box */}
                  <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono-code text-zinc-200">
                    <CheckCircle className="w-4 h-4 text-[#C5FF41]" />
                    <span>Entrega: {step.deliverable}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
