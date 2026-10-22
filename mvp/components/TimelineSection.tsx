"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb, Target, Palette, Rocket, RefreshCw, Check } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  desc: string;
  icon: any;
}

const MILESTONES: Milestone[] = [
  {
    id: "ideia",
    title: "Ideia",
    desc: "A dor identificada no mercado e a visão de produto do founder.",
    icon: Lightbulb,
  },
  {
    id: "escopo",
    title: "Menor escopo que prova a ideia",
    desc: "Filtro implacável do que é essencial para validar a tese.",
    icon: Target,
  },
  {
    id: "design",
    title: "Design aprovado",
    desc: "Protótipo navegável em alta fidelidade validado com você.",
    icon: Palette,
  },
  {
    id: "mvp",
    title: "MVP no ar",
    desc: "Deploy em nuvem, pronto para receber usuários reais e faturar.",
    icon: Rocket,
  },
  {
    id: "upgrades",
    title: "Upgrades mensais",
    desc: "Evolução contínua baseada em dados reais de uso e retenção.",
    icon: RefreshCw,
  },
];

export default function TimelineSection() {
  const [activeStep, setActiveStep] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (rect.height + viewportHeight * 0.5)));
      const stepIndex = Math.min(4, Math.floor(progress * 5));
      setActiveStep(stepIndex);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      id="linha-do-tempo"
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 bg-[#08080a] text-white border-y border-white/10 select-none scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold mb-3">
            ROADMAP ENXUTO &bull; ETAPAS CLARAS
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
            Da ideia ao MVP
          </h2>

          <p className="mt-4 text-zinc-400 font-body text-base md:text-lg leading-relaxed">
            Sem burocracia e sem enrolação. Cada etapa tem um objetivo claro de validação técnica e comercial.
          </p>
        </div>

        {/* Flagship Effect #3: Timeline - Horizontal on Desktop, Vertical on Mobile */}
        <div className="relative">
          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-white/10 z-0">
            <div
              className="h-full bg-[#C5FF41] transition-all duration-700 shadow-[0_0_15px_#C5FF41]"
              style={{ width: `${(activeStep / 4) * 100}%` }}
            />
          </div>

          {/* Mobile Vertical Line */}
          <div className="lg:hidden absolute top-8 bottom-8 left-7 w-0.5 bg-white/10 z-0">
            <div
              className="w-full bg-[#C5FF41] transition-all duration-700 shadow-[0_0_15px_#C5FF41]"
              style={{ height: `${(activeStep / 4) * 100}%` }}
            />
          </div>

          {/* Milestones Grid / List */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {MILESTONES.map((m, index) => {
              const isPastOrCurrent = index <= activeStep;
              const isCurrent = index === activeStep;
              const Icon = m.icon;

              return (
                <div
                  key={m.id}
                  className="flex lg:flex-col items-start gap-5 lg:gap-6 group"
                >
                  {/* Step Marker Indicator */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
                      isPastOrCurrent
                        ? "bg-[#C5FF41] text-black border-[#C5FF41] shadow-[0_0_25px_rgba(197,255,65,0.4)]"
                        : "bg-zinc-950 text-zinc-500 border-white/10"
                    } ${isCurrent ? "scale-110 ring-4 ring-[#C5FF41]/20" : ""}`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Step Details */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-zinc-500">
                      ETAPA 0{index + 1}
                    </div>
                    <h3
                      className={`font-display font-bold text-lg sm:text-xl leading-snug transition-colors ${
                        isPastOrCurrent ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {m.title}
                    </h3>
                    <p className="text-zinc-400 font-body text-xs sm:text-sm leading-relaxed">
                      {m.desc}
                    </p>
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
