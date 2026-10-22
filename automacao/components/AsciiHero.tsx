"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Bot, Terminal, RefreshCw } from "lucide-react";

const CHARS = ["+", "=", "*", "#", "@", ".", ":", "-", "~", "x", "0", "1"];

export default function AsciiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayText, setDisplayText] = useState("Quanto da sua equipe passa o dia fazendo o que um sistema faz sozinho?");
  const originalText = "Quanto da sua equipe passa o dia fazendo o que um sistema faz sozinho?";

  // Flagship Effect #6: Text Decoding Effect (Scrambler/Matrix resolve)
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((letter, index) => {
            if (letter === " " || letter === "\n" || letter === "?") return letter;
            if (index < iteration) {
              return originalText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1.5;
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Flagship Effect #1: ASCII/TIPOS Shader Orb with cursor repulsion & spring return
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", onResize);

    // Particle nodes for ASCII orb
    const points: {
      origX: number;
      origY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      char: string;
      color: string;
      layer: number;
    }[] = [];

    const numPoints = 280;
    const radius = Math.min(width, height) * 0.28;
    const centerX = width * 0.5;
    const centerY = height * 0.52;

    for (let i = 0; i < numPoints; i++) {
      // Golden spiral distribution on sphere projected to 2D
      const theta = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;

      const px = centerX + radius * Math.sin(theta) * Math.cos(phi);
      const py = centerY + radius * Math.cos(theta) * 0.65;
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const layer = Math.sin(phi);

      points.push({
        origX: px,
        origY: py,
        x: px,
        y: py,
        vx: 0,
        vy: 0,
        char,
        color: layer > 0 ? "#C5FF41" : "rgba(197, 255, 65, 0.45)",
        layer,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Radial background glow behind orb
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius * 1.6);
      grad.addColorStop(0, "rgba(197, 255, 65, 0.12)");
      grad.addColorStop(0.6, "rgba(197, 255, 65, 0.02)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Idle slow pulsing rotation
        const pulse = Math.sin(time + i * 0.1) * 6;
        const targetX = p.origX + Math.cos(time * 0.5 + p.layer) * 12;
        const targetY = p.origY + pulse;

        // Mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 140;

        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 22;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Spring force returning to target
        const homeDx = targetX - p.x;
        const homeDy = targetY - p.y;
        p.vx += homeDx * 0.04;
        p.vy += homeDy * 0.04;

        // Damping
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        // Random character flicker occasionally
        if (Math.random() < 0.015) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        // Render ASCII glyph
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#C5FF41";
        ctx.shadowBlur = dist < repelRadius ? 8 : 2;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const phone = "5562981580707";
  const defaultMsg = "Oi, quero automatizar uma tarefa da minha empresa";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between items-center pt-28 pb-16 px-4 select-none"
    >
      {/* ASCII Shader Canvas Container */}
      <div className="absolute inset-0 pointer-events-auto z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 mt-4 pointer-events-none">
        {/* Eyebrow - strictly without rounded capsule borders */}
        <div className="text-xs sm:text-sm font-mono-code font-bold uppercase tracking-[0.25em] text-[#C5FF41] mb-5">
          BRANAPI &bull; INTELIGÊNCIA ARTIFICIAL &amp; WORKFLOWS
        </div>

        {/* Exact H1 Copy with Decoding Effect */}
        <h1 className="font-display font-bold tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] min-h-[140px] sm:min-h-[170px] flex items-center justify-center">
          <span>{displayText}</span>
        </h1>

        {/* Exact Intro Paragraph */}
        <p className="mt-6 text-base sm:text-lg md:text-xl font-body text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          Responder as mesmas perguntas, copiar dados de um lugar pro outro, cobrar, lembrar cliente, gerar relatório. Cada hora nisso é uma hora que não foi pra vender nem pra atender bem.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#C5FF41] text-black font-mono-code font-bold text-sm hover:bg-[#d6ff6a] hover:shadow-[0_0_30px_rgba(197,255,65,0.6)] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Quero automatizar uma tarefa</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="#fluxo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-zinc-950/80 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-mono-code text-sm backdrop-blur-xl transition-all"
          >
            <span>Ver fluxo interativo de nós</span>
            <ArrowDown className="w-4 h-4 text-[#C5FF41]" />
          </a>
        </div>
      </div>

      {/* Interaction Hint */}
      <div className="relative z-10 text-xs font-mono-code text-zinc-400 flex items-center gap-2 pt-8 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] animate-ping" />
        <span>Passe o mouse pelo orbe para dispersar os tipos ASCII</span>
      </div>
    </section>
  );
}
