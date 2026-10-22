"use client";

import { useEffect, useRef } from "react";
import { Check, ShieldCheck, Cpu, Coins, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BENEFITS = [
  {
    number: "01",
    title: "Seu processo vira software, em vez de você virar o processo do software.",
    tagline: "Engenharia orientada à sua rotina",
    description:
      "Em sistemas prontos de prateleira, sua equipe é obrigada a mudar como trabalha para caber no molde do fornecedor. No sistema da Branapi, mapeamos cada etapa do seu fluxo diário e criamos telas, regras e automações que espelham perfeitamente o seu negócio.",
    deliverables: [
      "Campos e regras de negócio 100% personalizados",
      "Permissões granulares por cargo e filial",
      "Fluxos de aprovação com assinatura digital",
    ],
  },
  {
    number: "02",
    title: "Tudo conectado: vendas, estoque, financeiro e atendimento no mesmo lugar.",
    tagline: "Fim das ilhas de dados",
    description:
      "Uma venda fechada no CRM baixa o estoque automaticamente, emite a nota fiscal, gera o contas a receber no módulo financeiro e dispara o protocolo para a equipe de atendimento. Sem retrabalho, sem copiar e colar entre abas diferentes.",
    deliverables: [
      "Estoque sincronizado em milissegundos",
      "Conciliação bancária automática com Pix e boletos",
      "Histórico único do cliente em visão 360°",
    ],
  },
  {
    number: "03",
    title: "Custo previsível: investimento único, sem mensalidade por usuário crescendo junto com a empresa.",
    tagline: "Propriedade real do ativo",
    description:
      "Em sistemas SaaS alugados, quanto mais sua empresa contrata e expande, mais cara fica a conta no fim do mês. Na Branapi, o sistema e o código-fonte são seus: você investe no desenvolvimento e escala sua operação com tranquilidade.",
    deliverables: [
      "Zero taxa por usuário adicional cadastrado",
      "Propriedade do código-fonte e banco de dados",
      "Hospedagem em nuvem própria com custo de infraestrutura sob seu controle",
    ],
  },
];

export default function ThreeBenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beneficios"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-zinc-50 text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 sm:mb-20 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
            ARQUITETURA &bull; RETORNO OPERACIONAL
          </div>

          {/* Exact H2 Copy */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight leading-[1.1]">
            Um sistema sob medida resolve três coisas
          </h2>

          <p className="mt-4 text-zinc-600 font-body text-base md:text-lg leading-relaxed">
            Elimine as dores clássicas de quem depende de planilhas frágeis ou de softwares de prateleira engessados.
          </p>
        </div>

        {/* 3 Numbered Benefits Cards with Giant Outline Numbers */}
        <div className="space-y-8 sm:space-y-12">
          {BENEFITS.map((item, idx) => (
            <div
              key={item.number}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="group relative rounded-3xl p-7 sm:p-10 md:p-12 bg-white border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 group-hover:from-zinc-900 group-hover:via-[#C5FF41] group-hover:to-zinc-900 transition-all duration-500" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Col 1: Giant Outline Number (Effect #6) */}
                <div className="lg:col-span-3 flex lg:flex-col items-baseline justify-between">
                  <div
                    className="font-display font-black text-6xl sm:text-8xl md:text-9xl leading-none tracking-tighter select-none transition-transform duration-300 group-hover:scale-105"
                    style={{
                      WebkitTextStroke: "2.5px #18181b",
                      color: "transparent",
                    }}
                    aria-hidden="true"
                  >
                    {item.number}
                  </div>

                  <div className="text-xs font-mono-code uppercase tracking-wider text-zinc-500 font-bold lg:mt-4">
                    {item.tagline}
                  </div>
                </div>

                {/* Col 2: Content & Copy */}
                <div className="lg:col-span-9 space-y-5">
                  {/* Exact Copy Headline */}
                  <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-zinc-950 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-zinc-600 font-body text-base sm:text-lg leading-relaxed">
                    {item.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {item.deliverables.map((deliv) => (
                      <div
                        key={deliv}
                        className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5 text-xs font-mono-code text-zinc-800"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
