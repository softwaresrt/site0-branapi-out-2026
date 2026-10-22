"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertCircle, Smartphone, Clock, EyeOff, ShieldAlert } from "lucide-react";

export default function SignalWordReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLParagraphElement>(null);

  const copyText =
    "Demora mais de 3 segundos pra abrir, quebra no celular, ninguém te encontra pelo nome do serviço, ou você tem vergonha de mandar o link pro cliente.";

  const words = copyText.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = containerRef.current;
    const wordSpans = wordsContainerRef.current?.querySelectorAll(".signal-word");

    if (!container || !wordSpans) return;

    if (isReduced) {
      gsap.set(wordSpans, { color: "#ffffff", opacity: 1 });
      return;
    }

    gsap.fromTo(
      wordSpans,
      {
        color: "#27272a", // Dark muted gray
        opacity: 0.35,
      },
      {
        color: "#ffffff",
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.8,
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 md:py-36 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto scroll-mt-24 select-none"
      id="sinais"
    >
      {/* Background Warning Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-500/5 rounded-full blur-[180px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="text-center max-w-3xl mx-auto mb-14">
        {/* Eyebrow */}
        <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-red-400 font-bold mb-3">
          DIAGNÓSTICO OPERACIONAL
        </div>

        {/* Exact Semantic H2 */}
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          Sinais de que seu site atual está custando vendas
        </h2>
      </div>

      {/* Word-by-Word Illuminated Reveal Paragraph */}
      <div className="p-8 sm:p-12 md:p-16 rounded-[2.5rem] bg-zinc-950/80 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] relative overflow-hidden">
        {/* Top subtle red/neon glow line */}
        <div
          className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
          aria-hidden="true"
        />

        <p
          ref={wordsContainerRef}
          className="font-display font-bold text-2xl sm:text-4xl md:text-5xl lg:text-5xl leading-[1.3] tracking-tight text-center max-w-4xl mx-auto"
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="signal-word inline-block mr-[0.28em] transition-colors will-change-transform"
            >
              {word}
            </span>
          ))}
        </p>

        {/* Diagnostic Badges Grid below reveal */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono-code">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-start gap-3">
            <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Lentidão que queima anúncio</div>
              <div className="text-[11px] text-zinc-400 mt-1">Visitante desiste em 3s</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-start gap-3">
            <Smartphone className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Quebra no celular</div>
              <div className="text-[11px] text-zinc-400 mt-1">80% do tráfego é mobile</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Invisível no Google</div>
              <div className="text-[11px] text-zinc-400 mt-1">Concorrentes dominam a busca</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Vergonha do link</div>
              <div className="text-[11px] text-zinc-400 mt-1">Falta de autoridade visual</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
