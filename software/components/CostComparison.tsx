"use client";

import { useEffect, useState, useRef } from "react";
import WordMaskHeading from "./WordMaskHeading";
import { Lock, TrendingUp, AlertTriangle, ShieldCheck, Check } from "lucide-react";

export default function CostComparison() {
  const [rentedCost, setRentedCost] = useState(3500);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = false;
    let timer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(container);

    // Continuous ticker increment while in viewport
    timer = setInterval(() => {
      if (isVisible) {
        setRentedCost((prev) => {
          // Increment in steps simulating monthly fees accumulation
          if (prev >= 280000) return 42000;
          return prev + Math.floor(Math.random() * 450 + 250);
        });
      }
    }, 40);

    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, []);

  const formattedCost = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(rentedCost);

  return (
    <section
      id="comparativo"
      ref={containerRef}
      className="relative w-full py-28 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-24"
    >
      {/* Glow highlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C5FF41]/5 rounded-full blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header with Exact H2 */}
      <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
        <WordMaskHeading
          text="Por que o sistema próprio sai mais barato que o alugado"
          as="h2"
          centered={true}
          className="text-3xl md:text-5xl lg:text-6xl text-white font-bold text-center"
        />
        <p className="mt-5 text-lg md:text-xl font-display font-medium text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Mensalidade não acaba nunca. Software seu é um ativo: você é dono do código, pode registrar no INPI e ninguém aumenta o preço do seu negócio.
        </p>
      </div>

      {/* 2-Column Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Column 1: Sistema Alugado (Endless climbing counter) */}
        <div className="p-8 md:p-10 rounded-3xl bg-zinc-950/70 border border-red-500/20 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="font-mono-code text-xs uppercase tracking-wider text-red-400 font-semibold">
                Sistema Alugado (SaaS)
              </span>
            </div>
            <span className="text-[11px] font-mono-code text-zinc-400">Dívida Perpétua</span>
          </div>

          <div className="my-8">
            <div className="text-xs font-mono-code text-zinc-400 mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Custo acumulado com o passar do tempo:</span>
            </div>
            <div className="text-4xl md:text-5xl font-mono-code font-bold text-red-400 tracking-tight flex items-baseline gap-2">
              <span>{formattedCost}</span>
              <span className="text-xs text-zinc-400 font-normal">... e subindo</span>
            </div>
            <p className="mt-2 text-xs font-mono-code text-zinc-400">
              * Considera reajustes anuais de licença e custo por usuário adicional.
            </p>
          </div>

          <ul className="space-y-3.5 pt-6 border-t border-white/[0.08] text-sm text-zinc-300">
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>Mensalidade eterna sem gerar patrimônio para o seu CNPJ.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>Se parar de pagar, a sua empresa perde acesso a todo o sistema.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>Cobrança extra a cada novo funcionário ou filial adicionada.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>Sua empresa é refém do roadmap e reajustes da fornecedora.</span>
            </li>
          </ul>
        </div>

        {/* Column 2: Sistema Próprio Branapi (Fixed Lock, Asset, Valuation) */}
        <div className="p-8 md:p-10 rounded-3xl bg-zinc-950/90 border border-[#C5FF41]/40 shadow-[0_0_40px_rgba(197,255,65,0.12)] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
          {/* Top highlight bar */}
          <div
            className="absolute top-0 inset-x-0 h-1 bg-[#C5FF41] shadow-[0_0_12px_#C5FF41]"
            aria-hidden="true"
          />

          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C5FF41]/20 border border-[#C5FF41]/40 flex items-center justify-center text-[#C5FF41] shadow-[0_0_12px_rgba(197,255,65,0.4)]">
                <Lock className="w-4 h-4 text-[#C5FF41]" />
              </div>
              <span className="font-mono-code text-xs uppercase tracking-wider text-[#C5FF41] font-bold">
                Sistema Próprio Branapi
              </span>
            </div>
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#C5FF41]">
              Código Seu
            </span>
          </div>

          <div className="my-8">
            <div className="text-xs font-mono-code text-[#C5FF41] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5FF41]" />
              <span>Custo de mensalidade de licença:</span>
            </div>
            <div className="text-4xl md:text-5xl font-mono-code font-bold text-[#C5FF41] tracking-tight flex items-baseline gap-2">
              <span>R$ 0,00</span>
              <span className="text-xs text-zinc-300 font-normal">/ mensalidade fixa</span>
            </div>
            <p className="mt-2 text-xs font-mono-code text-zinc-300">
              Investimento pontual de desenvolvimento. O software é patrimônio da sua empresa.
            </p>
          </div>

          <ul className="space-y-3.5 pt-6 border-t border-white/[0.08] text-sm text-zinc-200">
            <li className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#C5FF41]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#C5FF41]" />
              </div>
              <span><strong>Código-fonte 100% seu:</strong> entregue após quitação para auditoria ou evolução interna.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#C5FF41]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#C5FF41]" />
              </div>
              <span><strong>Registro no INPI:</strong> direito autoral de software registrado como ativo intangível no balanço.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#C5FF41]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#C5FF41]" />
              </div>
              <span><strong>Usuários ilimitados:</strong> cadastre 10 ou 10.000 colaboradores sem pagar 1 centavo a mais.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#C5FF41]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#C5FF41]" />
              </div>
              <span><strong>Aumento de Valuation:</strong> empresas com tecnologia proprietária valem muito mais no mercado.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
