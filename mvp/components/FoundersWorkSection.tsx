"use client";

import { useEffect, useRef, useState } from "react";
import {
  Compass,
  Layers,
  CalendarDays,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface CardItem {
  id: string;
  title: string;
  desc: string;
  icon: any;
  metric: string;
}

const CARDS: CardItem[] = [
  {
    id: "escopo",
    title: "Define junto o menor escopo que prova a ideia",
    desc: "Cortamos 70% das features supérfluas que founders de primeira viagem querem colocar. Focamos apenas no núcleo que gera a primeira transação ou engajamento real.",
    icon: Compass,
    metric: "Mapeamento em 48h",
  },
  {
    id: "arquitetura",
    title: "Entrega arquitetura pensada pra escalar (não código descartável)",
    desc: "Nada de gambiarra ou no-code frágil que precisa ser reescrito do zero após 1.000 usuários. Código limpo em Next.js, Node e bancos relacionais robustos.",
    icon: Layers,
    metric: "Pronto para 100k+ usuários",
  },
  {
    id: "upgrades",
    title: "Upgrades mensais conforme a validação e o caixa permitem",
    desc: "Evolução modular sem sustos. Conforme os primeiros clientes pagam e dão feedback, adicionamos novos módulos com previsibilidade total de investimento.",
    icon: CalendarDays,
    metric: "Sprints ágeis",
  },
  {
    id: "codigo",
    title: "Código-fonte seu, sem refém de fornecedor",
    desc: "O repositório Git, o banco de dados e as chaves de API pertencem 100% à sua startup. Você tem liberdade para continuar com nosso time ou internalizar quando quiser.",
    icon: Lock,
    metric: "100% Proprietário",
  },
];

export default function FoundersWorkSection() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const lockRef = useRef<HTMLDivElement>(null);

  // Flagship Effect #6: Lock unlocking animation when entering viewport
  useEffect(() => {
    const el = lockRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsUnlocked(true);
          } else {
            setIsUnlocked(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="como-trabalhamos"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-zinc-50 text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
            METODOLOGIA LEAN &bull; PARCERIA DE VERDADE
          </div>

          {/* Exact H2 Copy */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            Como a gente trabalha com founders
          </h2>

          <p className="mt-4 text-zinc-600 font-body text-base md:text-lg leading-relaxed">
            Não somos uma fábrica de software que recebe um PDF e entrega um produto quebrado meses depois. Somos o braço técnico da sua startup.
          </p>
        </div>

        {/* Flagship Effect #5: Cards that lift, illuminate border, and reveal animated icons; Snap carousel on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory">
          {CARDS.map((card) => {
            const isLockCard = card.id === "codigo";
            const Icon = isLockCard && isUnlocked ? Unlock : card.icon;

            return (
              <div
                key={card.id}
                ref={isLockCard ? lockRef : undefined}
                className={`group relative p-7 sm:p-8 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between snap-center shrink-0 w-[290px] sm:w-[320px] md:w-auto ${
                  isLockCard
                    ? "border-emerald-300 shadow-md hover:shadow-2xl hover:-translate-y-2"
                    : "border-zinc-200/90 shadow-sm hover:border-zinc-900 hover:shadow-xl hover:-translate-y-2"
                }`}
              >
                {/* Top Icon & Metric */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isLockCard && isUnlocked
                          ? "bg-[#C5FF41] text-black shadow-[0_0_20px_rgba(197,255,65,0.5)]"
                          : "bg-zinc-950 text-white group-hover:bg-[#C5FF41] group-hover:text-black"
                      }`}
                    >
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>

                    <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                      {card.metric}
                    </span>
                  </div>

                  {/* Exact Copy Bullet Point */}
                  <h3 className="font-display font-bold text-lg sm:text-xl text-zinc-950 leading-snug">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-zinc-600 font-body text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Bottom Callout */}
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono-code text-zinc-500">
                  <span className="font-semibold text-zinc-900">
                    {isLockCard ? (isUnlocked ? "Acesso total liberado" : "Segurança jurídica") : "Padrão Branapi"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
