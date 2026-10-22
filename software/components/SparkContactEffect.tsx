"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Cpu, Sparkles } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function SparkContactEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftNodeRef = useRef<HTMLDivElement>(null);
  const rightNodeRef = useRef<HTMLDivElement>(null);
  const sparkCenterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealedTextRef = useRef<HTMLDivElement>(null);
  const lineConnectorRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const leftNode = leftNodeRef.current;
    const rightNode = rightNodeRef.current;
    const sparkCenter = sparkCenterRef.current;
    const revealedText = revealedTextRef.current;
    const lineConnector = lineConnectorRef.current;
    const canvas = canvasRef.current;

    if (!container || !leftNode || !rightNode || !sparkCenter || !revealedText) return;

    // Respect reduced motion
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      gsap.set([leftNode, rightNode], { x: 0, opacity: 1 });
      gsap.set(revealedText, { opacity: 1, y: 0 });
      return;
    }

    // Particle system on canvas
    let particles: Particle[] = [];
    const ctx = canvas?.getContext("2d");

    const triggerBurst = () => {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Generate 70 neon spark particles
      for (let i = 0; i < 70; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          color: Math.random() > 0.3 ? "#C5FF41" : "#ffffff",
        });
      }
      setExploded(true);
    };

    let animationFrameId: number;
    const renderParticles = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#C5FF41";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderParticles);
    };
    renderParticles();

    // Resize canvas
    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let hasBurst = false;

    // ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 75%",
        end: "bottom 45%",
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > 0.48 && !hasBurst) {
            hasBurst = true;
            triggerBurst();
          } else if (self.progress < 0.45) {
            hasBurst = false;
          }
        },
      },
    });

    // Convergence animation
    tl.fromTo(
      leftNode,
      { x: "-45vw", opacity: 0.3, scale: 0.8 },
      { x: "0vw", opacity: 1, scale: 1, ease: "power2.out", duration: 1 }
    );
    tl.fromTo(
      rightNode,
      { x: "45vw", opacity: 0.3, scale: 0.8 },
      { x: "0vw", opacity: 1, scale: 1, ease: "power2.out", duration: 1 },
      "<"
    );
    if (lineConnector) {
      tl.fromTo(
        lineConnector,
        { scaleX: 1, opacity: 0.2 },
        { scaleX: 0.05, opacity: 0.9, duration: 1 },
        "<"
      );
    }

    // Spark collision impact & shockwave
    tl.fromTo(
      sparkCenter,
      { scale: 0, opacity: 0 },
      { scale: 2.2, opacity: 1, duration: 0.3, ease: "back.out(2)" }
    );
    tl.to(sparkCenter, { scale: 1, opacity: 0.5, duration: 0.4 });

    // Reveal next text
    tl.fromTo(
      revealedText,
      { y: 50, opacity: 0, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
      "-=0.2"
    );

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background radial glow */}
      <div
        className="absolute w-[600px] h-[350px] bg-radial from-[#C5FF41]/10 via-transparent to-transparent pointer-events-none blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        aria-hidden="true"
      />

      {/* Subtitle / Question intro */}
      <p className="text-zinc-400 font-display text-base md:text-xl text-center max-w-2xl mb-12 leading-relaxed">
        Você já pagou mensalidade por um sistema que faz 60% do que você precisa e obriga a empresa a se adaptar a ele? Ou ainda toca a operação em planilha que só uma pessoa entende?
      </p>

      {/* The Two Converging Nodes & Spark Point */}
      <div className="relative w-full flex items-center justify-center min-h-[140px] my-6">
        {/* Horizontal Laser Connector */}
        <div
          ref={lineConnectorRef}
          className="absolute inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#C5FF41] to-transparent origin-center z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Node A (Empresa) */}
        <div
          ref={leftNodeRef}
          className="relative z-20 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
            <Building2 className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <div className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400">Ponto A</div>
            <div className="text-sm md:text-base font-display font-semibold text-white">Sua Empresa</div>
          </div>
        </div>

        {/* Central Spark Fusion Point */}
        <div
          ref={sparkCenterRef}
          className="relative z-30 mx-3 w-12 h-12 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-full bg-[#C5FF41] blur-xl opacity-80 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-[#C5FF41] flex items-center justify-center text-black shadow-[0_0_20px_#C5FF41]">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
          </div>
        </div>

        {/* Node B (Sistema Sob Medida) */}
        <div
          ref={rightNodeRef}
          className="relative z-20 flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-[#C5FF41]/30 shadow-[0_10px_30px_rgba(197,255,65,0.15)]"
        >
          <div className="w-10 h-10 rounded-xl bg-[#C5FF41]/15 border border-[#C5FF41]/30 flex items-center justify-center text-[#C5FF41]">
            <Cpu className="w-5 h-5 text-[#C5FF41]" />
          </div>
          <div>
            <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#C5FF41]">Ponto B</div>
            <div className="text-sm md:text-base font-display font-semibold text-white">Software Sob Medida</div>
          </div>
        </div>
      </div>

      {/* Revealed Solution Card with 830+ projects */}
      <div
        ref={revealedTextRef}
        className="w-full max-w-3xl mt-8 p-6 md:p-8 rounded-3xl bg-zinc-950/70 backdrop-blur-2xl border border-[#C5FF41]/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden text-center"
      >
        {/* Clean text without rounded capsule */}
        <div className="text-[11px] md:text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-semibold mb-4">
          Fusão de Processo e Tecnologia
        </div>

        <p className="text-lg md:text-2xl font-display font-medium text-white leading-relaxed">
          A Branapi é uma software house que faz o contrário: a gente estuda como a sua empresa funciona e constrói o software em volta disso. Já são mais de <span className="text-[#C5FF41] font-bold drop-shadow-[0_0_12px_rgba(197,255,65,0.6)]">830 projetos entregues</span> para empresas de todo o Brasil.
        </p>
      </div>
    </div>
  );
}
