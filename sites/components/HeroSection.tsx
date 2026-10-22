"use client";

import { useEffect, useRef } from "react";
import LiquidFluidHero from "./LiquidFluidHero";
import LiquidGlassButton from "./LiquidGlassButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Sparkles, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textLine1Ref = useRef<HTMLDivElement>(null);
  const textLine2Ref = useRef<HTMLDivElement>(null);

  const phone = "5562981580707";
  const defaultMsg = "Oi, quero uma proposta de site com layout de exemplo";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const line1 = textLine1Ref.current;
    const line2 = textLine2Ref.current;
    const hero = heroRef.current;

    if (!line1 || !line2 || !hero) return;

    // Opposite horizontal parallax displacement on scroll
    gsap.to(line1, {
      xPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    gsap.to(line2, {
      xPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full pt-20 md:pt-24 pb-12 px-3 sm:px-6 md:px-8 max-w-[1540px] mx-auto select-none"
    >
      {/* 1. HERO DENTRO DE UM CARD GRANDE DE CANTOS ARREDONDADOS (PROFITIZE STYLE) */}
      <div className="relative min-h-[88vh] md:min-h-[94vh] rounded-[2.5rem] md:rounded-[3.5rem] bg-black/90 border border-white/[0.12] overflow-hidden flex flex-col justify-between items-center text-center p-6 sm:p-10 md:p-16 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
        {/* SHADER DE FLUIDO LÍQUIDO AO FUNDO */}
        <LiquidFluidHero />

        {/* Ambient Dark Gradient Vignette for Perfect Text Contrast */}
        <div
          className="absolute inset-0 bg-radial from-black/50 via-black/80 to-black pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* 2. ATRÁS DO H1: PALAVRAS GIGANTES DECORATIVAS 'SITE QUE VENDE' EM CONTORNO CORTADAS PELAS BORDAS */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-[2] overflow-hidden opacity-30 select-none"
        >
          {/* Line 1: Shifts left on scroll */}
          <div
            ref={textLine1Ref}
            className="whitespace-nowrap font-display font-black text-[14vw] leading-[0.85] stroke-text uppercase tracking-tighter will-change-transform"
          >
            SITE QUE VENDE &bull; SITE QUE VENDE &bull; SITE QUE VENDE &bull;
          </div>

          {/* Line 2: Shifts right on scroll */}
          <div
            ref={textLine2Ref}
            className="whitespace-nowrap font-display font-black text-[14vw] leading-[0.85] stroke-text-green uppercase tracking-tighter will-change-transform"
          >
            NO TOPO DO GOOGLE &bull; CONVERSÃO REAL &bull; BRANAPI SITES &bull;
          </div>
        </div>

        {/* Top Eyebrow Tag */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 mb-4 text-center">
          <span className="w-2 h-2 rounded-full bg-[#C5FF41] shadow-[0_0_10px_#C5FF41] animate-pulse" />
          <span className="text-xs md:text-sm font-mono-code font-medium tracking-[0.2em] uppercase text-[#C5FF41]">
            BRANAPI &bull; CRIAÇÃO DE SITES PROFISSIONAIS
          </span>
        </div>

        {/* Center H1 & Main Copy */}
        <div className="relative z-10 max-w-5xl mx-auto my-auto py-8">
          {/* Single Semantic H1 (Exact Copy) */}
          <h1 className="font-display font-bold tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
            <span className="block opacity-95">
              Um site bonito que ninguém acha não vende nada.
            </span>
            <span className="block mt-2 sm:mt-3 text-[#C5FF41] neon-glow font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
              A gente cria o que aparece no Google e fecha cliente.
            </span>
          </h1>

          {/* Exact Subtitles */}
          <p className="mt-8 text-lg sm:text-xl md:text-2xl font-display font-medium text-zinc-200 max-w-3xl mx-auto leading-relaxed">
            Seu site hoje é cartão de visita ou é vendedor? Se o visitante entra, olha e vai embora, o problema não é tráfego. É o site.
          </p>

          <p className="mt-4 text-sm sm:text-base md:text-lg font-body text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A gente constrói sites com três obrigações: carregar rápido, aparecer nas buscas e levar o visitante até o seu WhatsApp ou formulário.
          </p>

          {/* 4. BOTÃO LIQUID GLASS NO CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <LiquidGlassButton href={waUrl}>
              <span>Pedir proposta com layout de exemplo</span>
            </LiquidGlassButton>

            <a
              href="#o-que-vai"
              className="px-6 py-4 rounded-full bg-black/40 hover:bg-zinc-900/60 border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white font-mono-code text-xs md:text-sm backdrop-blur-xl transition-all flex items-center gap-2"
            >
              <span>Ver o que vai no seu site</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#C5FF41]" />
            </a>
          </div>
        </div>

        {/* Card Bottom Pillars (Core Web Vitals removed as requested) */}
        <div className="relative z-10 w-full max-w-2xl mx-auto pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-around gap-4 text-xs font-mono-code text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5FF41]" />
            <span className="text-zinc-200 font-medium">Aparecer nas buscas do Google (SEO)</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5FF41]" />
            <span className="text-zinc-200 font-medium">Converter visitantes em clientes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
