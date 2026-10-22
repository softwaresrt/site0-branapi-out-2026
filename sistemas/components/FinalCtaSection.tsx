"use client";

import { useState } from "react";
import { MessageSquare, ArrowRight, ShieldCheck, Clock, Cpu } from "lucide-react";

export default function FinalCtaSection() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const phone = "5562981580707";
  const message = "Oi, quero desenhar um sistema para a minha empresa";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 900);
  };

  return (
    <section
      id="contato"
      className="relative w-full bg-[#050505] text-white py-28 sm:py-36 px-4 sm:px-6 md:px-12 overflow-hidden border-t border-white/[0.08]"
    >
      {/* Background Ambient Glow & Radial Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px] opacity-25"
          style={{
            background: "radial-gradient(circle, #C5FF41 0%, rgba(197,255,65,0.15) 50%, transparent 75%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10 space-y-10">
        {/* Clean Eyebrow - strictly without rounded capsule borders */}
        <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#C5FF41] font-bold">
          DIAGNÓSTICO TÉCNICO &bull; PROJETO SOB MEDIDA
        </div>

        {/* Exact Copy Headline */}
        <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white max-w-4xl mx-auto">
          Mostra como sua empresa funciona hoje e a gente desenha o sistema
        </h2>

        {/* Subtext */}
        <p className="text-zinc-400 font-body text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Agende uma conversa técnica sem compromisso. Mapeamos as rotinas da sua equipe, identificamos gargalos e desenhamos a arquitetura do software sob medida para o seu negócio.
        </p>

        {/* Pulsing Button with Expand Wave on Click */}
        <div className="pt-4 flex flex-col items-center gap-6">
          <div className="relative group">
            {/* Ambient Pulse Aura */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#C5FF41] via-[#9aff2e] to-[#C5FF41] opacity-75 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700 animate-pulse pointer-events-none" />

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="relative inline-flex items-center gap-4 px-8 sm:px-12 py-5 sm:py-6 rounded-full bg-[#C5FF41] text-black font-display font-black text-base sm:text-lg tracking-tight hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-[0_0_50px_rgba(197,255,65,0.5)] overflow-hidden"
            >
              {/* Ripple elements on click */}
              {ripples.map((r) => (
                <span
                  key={r.id}
                  className="absolute pointer-events-none rounded-full bg-white/40 animate-ping"
                  style={{
                    left: r.x - 25,
                    top: r.y - 25,
                    width: 50,
                    height: 50,
                  }}
                />
              ))}

              <MessageSquare className="w-6 h-6 fill-black text-black shrink-0" />
              <span>Falar no WhatsApp e desenhar o sistema</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </a>
          </div>

          {/* Quick value props beneath CTA */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 text-xs font-mono-code text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5FF41]" />
              <span>Diagnóstico em até 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5FF41]" />
              <span>Código-fonte 100% da sua empresa</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#C5FF41]" />
              <span>Sem cobrança de mensalidade por usuário</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
