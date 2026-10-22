"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Sparkles, Rocket } from "lucide-react";

export default function NebulosaHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [chromeOffset, setChromeOffset] = useState({ x: 0, y: 0 });

  // Flagship Effect #1: Nebulosa Background with Dithering / Noise Grain & Mouse Shift
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

    let targetX = width * 0.5;
    let targetY = height * 0.5;
    let currentX = width * 0.5;
    let currentY = height * 0.5;
    let time = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      const normX = ((e.clientX - rect.left) / rect.width) * 100;
      const normY = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x: normX, y: normY });
      setChromeOffset({
        x: (e.clientX / window.innerWidth - 0.5) * 50,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Procedural Dithering Pattern
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const noiseCtx = noiseCanvas.getContext("2d");
    if (noiseCtx) {
      const imgData = noiseCtx.createImageData(128, 128);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const val = Math.random() * 255;
        imgData.data[i] = val;
        imgData.data[i + 1] = val;
        imgData.data[i + 2] = val;
        imgData.data[i + 3] = 16; // Subtle grain
      }
      noiseCtx.putImageData(imgData, 0, 0);
    }

    const render = () => {
      time += 0.015;
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Top-Left Neon Glow
      const gradTL = ctx.createRadialGradient(
        currentX * 0.4,
        currentY * 0.4,
        20,
        currentX * 0.4,
        currentY * 0.4,
        width * 0.6
      );
      gradTL.addColorStop(0, "rgba(197, 255, 65, 0.22)");
      gradTL.addColorStop(0.5, "rgba(197, 255, 65, 0.05)");
      gradTL.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradTL;
      ctx.fillRect(0, 0, width, height);

      // Bottom-Right Ambient Nebula Pulse
      const brX = width - Math.cos(time) * 60;
      const brY = height - Math.sin(time) * 40;
      const gradBR = ctx.createRadialGradient(brX, brY, 30, brX, brY, width * 0.7);
      gradBR.addColorStop(0, "rgba(197, 255, 65, 0.16)");
      gradBR.addColorStop(0.6, "rgba(197, 255, 65, 0.03)");
      gradBR.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradBR;
      ctx.fillRect(0, 0, width, height);

      // Overlay Dithering Grain Pattern
      if (noiseCtx) {
        const pattern = ctx.createPattern(noiseCanvas, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, height);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const phone = "5562981580707";
  const defaultMsg = "Oi, quero validar uma ideia de MVP";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between items-center pt-28 pb-16 px-4 select-none"
    >
      {/* Nebulosa Shader with Dithering Grain */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Flagship Effect #1: Giant Liquid Chrome "MVP" Text (aria-hidden, behind H1) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 select-none overflow-hidden text-center w-full"
        aria-hidden="true"
      >
        <div
          className="font-display font-black text-[32vw] md:text-[36vw] leading-none tracking-tighter uppercase transition-transform duration-200 opacity-20 sm:opacity-25"
          style={{
            transform: `translate3d(${chromeOffset.x}px, ${chromeOffset.y}px, 0)`,
            backgroundImage: `linear-gradient(${120 + chromeOffset.x * 0.8}deg, #ffffff 0%, #71717a 25%, #ffffff 50%, #27272a 75%, #ffffff 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextStroke: "2px rgba(197, 255, 65, 0.4)",
            color: "transparent",
            filter: "drop-shadow(0 0 70px rgba(197,255,65,0.35))",
          }}
        >
          MVP
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 mt-8">
        {/* Eyebrow */}
        <div className="text-xs sm:text-sm font-mono-code font-bold uppercase tracking-[0.25em] text-[#C5FF41] mb-5">
          BRANAPI &bull; VALIDAÇÃO ÁGIL DE STARTUPS
        </div>

        {/* Exact H1 Copy */}
        <h1 className="font-display font-bold tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          <span>Valide sua ideia com usuários reais </span>
          <span className="block mt-2 sm:mt-3 text-[#C5FF41] neon-glow font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            antes de gastar o orçamento inteiro.
          </span>
        </h1>

        {/* Exact Intro Paragraph */}
        <p className="mt-7 text-base sm:text-lg md:text-xl font-body text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          O erro mais caro de uma startup é construir tudo antes de saber se alguém quer. O MVP resolve isso: só o essencial, no ar rápido, pra você aprender com o mercado e evoluir com dinheiro entrando.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#C5FF41] text-black font-mono-code font-bold text-sm hover:bg-[#d6ff6a] hover:shadow-[0_0_30px_rgba(197,255,65,0.6)] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Quero validar meu MVP</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="#como-trabalhamos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-zinc-950/80 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-mono-code text-sm backdrop-blur-xl transition-all"
          >
            <span>Como trabalhamos com founders</span>
            <ArrowDown className="w-4 h-4 text-[#C5FF41]" />
          </a>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="relative z-10 text-xs font-mono-code text-zinc-400 flex items-center gap-2 pt-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] animate-ping" />
        <span>Role para ver o método de validação</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#C5FF41] animate-bounce" />
      </div>
    </section>
  );
}
