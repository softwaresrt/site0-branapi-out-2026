"use client";

import { useState } from "react";
import { MessageSquare, ArrowRight, ShieldCheck, Clock, Send, Sparkles } from "lucide-react";

export default function ThreeLinesCtaSection() {
  const [ideaText, setIdeaText] = useState("");
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Calculate number of lines
  const lineCount = ideaText.trim() === "" ? 0 : Math.min(3, ideaText.split("\n").length);

  const phone = "5562981580707";
  const defaultMsg = "Oi, quero validar uma ideia de MVP com a Branapi";
  const finalMsg = ideaText.trim() ? `Oi! Minha ideia de MVP é:\n${ideaText}` : defaultMsg;
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(finalMsg)}`;

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

      <div className="relative max-w-4xl mx-auto text-center z-10 space-y-10">
        {/* Clean Eyebrow */}
        <div className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#C5FF41] font-bold">
          DIAGNÓSTICO ÁGIL &bull; RESPOSTA EM 24H
        </div>

        {/* Exact Copy Headline */}
        <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white max-w-3xl mx-auto">
          Tem uma ideia? Mande em 3 linhas e eu digo como validar
        </h2>

        <p className="text-zinc-400 font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Sem formulários burocráticos. Conte quem é o cliente, qual é a dor e como o produto resolve. Nós devolvemos o roadmap do MVP.
        </p>

        {/* Flagship Effect #4: Textarea "Ideia em 3 Linhas" with Glass Border & Glow */}
        <div className="max-w-2xl mx-auto text-left space-y-3">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:ring-2 focus-within:ring-[#C5FF41] focus-within:shadow-[0_0_35px_rgba(197,255,65,0.3)] transition-all">
            <div className="p-4 sm:p-6 rounded-[1.4rem] bg-zinc-950/90 backdrop-blur-2xl">
              <label htmlFor="idea-textarea" className="flex items-center justify-between text-xs font-mono-code text-zinc-400 mb-2">
                <span>Escreva sua ideia abaixo:</span>
                <span
                  className={`font-bold transition-colors ${
                    lineCount >= 3 ? "text-[#C5FF41]" : "text-zinc-500"
                  }`}
                >
                  Linhas: {lineCount}/3
                </span>
              </label>

              <textarea
                id="idea-textarea"
                rows={3}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="Exemplo: Um SaaS para clínicas veterinárias agendarem consultas automáticas e enviarem lembretes de vacinas por WhatsApp..."
                className="w-full bg-transparent text-white placeholder-zinc-600 font-body text-sm sm:text-base resize-none focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono-code text-zinc-500 px-2">
            <span>Dica: Pressione Enter para pular de linha</span>
            <span>100% de sigilo garantido</span>
          </div>
        </div>

        {/* CTA Pulsing Wave Button that sends encoded idea directly to WhatsApp */}
        <div className="pt-2 flex flex-col items-center gap-6">
          <div className="relative group">
            {/* Ambient Pulse Aura */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#C5FF41] via-[#9aff2e] to-[#C5FF41] opacity-75 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-700 animate-pulse pointer-events-none" />

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="relative inline-flex items-center gap-3.5 px-8 sm:px-12 py-5 sm:py-6 rounded-full bg-[#C5FF41] text-black font-display font-black text-base sm:text-lg tracking-tight hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-[0_0_50px_rgba(197,255,65,0.5)] overflow-hidden"
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

              <Send className="w-5 h-5 fill-black text-black shrink-0" />
              <span>Enviar minha ideia no WhatsApp</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </a>
          </div>

          {/* Quick value props beneath CTA */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 text-xs font-mono-code text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5FF41]" />
              <span>Feedback técnico em menos de 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5FF41]" />
              <span>NDA e proteção total da sua ideia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
