"use client";

import { useEffect, useRef, useState } from "react";
import HeroScene3D from "./HeroScene3D";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const backGridRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    if (!isTouch) {
      // Desktop: Parallax via mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
        const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
        setMouseOffset({ x, y });
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    } else {
      // Mobile: Parallax via scroll position
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const normY = Math.min(scrollY / window.innerHeight, 1.5);
        setMouseOffset({ x: 0, y: normY });
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[92vh] md:min-h-screen w-full flex flex-col justify-between items-center pt-28 md:pt-36 pb-12 px-4 md:px-8 overflow-hidden bg-black select-none"
    >
      {/* LAYER 1 (Deepest Depth: Fine Grid + Neon Dot Matrix with negative parallax) */}
      <div
        ref={backGridRef}
        className="absolute inset-0 dot-grid pointer-events-none opacity-40 transition-transform duration-200 ease-out -z-10"
        style={{
          transform: `translate3d(${mouseOffset.x * -12}px, ${mouseOffset.y * -12}px, 0)`,
        }}
        aria-hidden="true"
      >
        {/* Subtle radial center spotlight */}
        <div className="absolute inset-0 bg-radial from-[#C5FF41]/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top Eyebrow - Clean typography without rounded capsule container */}
      <div className="relative z-20 flex items-center justify-center gap-2.5 mb-6 text-center">
        <span className="w-2 h-2 rounded-full bg-[#C5FF41] shadow-[0_0_10px_#C5FF41] animate-pulse" />
        <span className="text-xs md:text-sm font-mono-code font-medium tracking-[0.2em] uppercase text-[#C5FF41]">
          BRANAPI · SOFTWARE HOUSE NO BRASIL
        </span>
      </div>

      {/* LAYER 2: 3D Object in Wireframe (Middle Depth) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <HeroScene3D />
      </div>

      {/* LAYER 3: Giant H1 Typography with Spatial Overlap & Positive Parallax */}
      <div
        ref={textLayerRef}
        className="relative z-20 max-w-6xl mx-auto text-center my-auto px-2 transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 16}px, ${mouseOffset.y * 14}px, 0)`,
        }}
      >
        <h1 className="font-display font-bold tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          {/* Top segment */}
          <span className="block opacity-95">
            Software house que entrega o sistema
          </span>

          {/* Middle segment */}
          <span className="relative inline-block mt-1 sm:mt-2 z-20 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            que a sua empresa precisa.
          </span>

          {/* Bottom segment with official logo green */}
          <span className="block mt-2 sm:mt-3 text-[#C5FF41] neon-glow font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Não o que sobrou na prateleira.
          </span>
        </h1>

        {/* Quick action buttons in Hero */}
        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
          <a
            href="#cta-final"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C5FF41] text-black font-mono-code font-bold text-sm hover:bg-[#d6ff6a] hover:shadow-[0_0_30px_rgba(197,255,65,0.6)] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Pedir escopo do meu software</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="#desenvolvemos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-950/80 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-mono-code text-sm backdrop-blur-xl transition-all"
          >
            <span>Ver o que desenvolvemos</span>
            <ArrowDown className="w-4 h-4 text-[#C5FF41]" />
          </a>
        </div>
      </div>

    </section>
  );
}
