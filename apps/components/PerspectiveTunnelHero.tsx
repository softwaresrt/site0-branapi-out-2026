"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  ShoppingBag,
  Calendar,
  CreditCard,
  Truck,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function PerspectiveTunnelHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tunnelTrackRef = useRef<HTMLDivElement>(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const phone = "5562981580707";
  const defaultMsg = "Oi, tenho uma ideia de app e quero um escopo";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch && !isReduced) {
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
        const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
        setMouseTilt({ x: x * 6, y: -y * 6 });
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const track = tunnelTrackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    // Advance camera through the 3D tunnel on scroll
    const st = gsap.to(track, {
      z: 1600,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=120%",
        scrub: 1.2,
        pin: true,
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between items-center pt-28 pb-12 px-4 select-none"
      id="hero"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5FF41]/8 rounded-full blur-[180px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Top Header Text Content */}
      <div className="relative z-20 max-w-5xl mx-auto text-center px-4">
        {/* Eyebrow - Clean typography without rounded capsule or sparkles */}
        <div className="text-xs sm:text-sm font-mono-code font-bold uppercase tracking-[0.25em] text-[#C5FF41] mb-5">
          BRANAPI &bull; DESENVOLVIMENTO DE APLICATIVOS
        </div>

        {/* Exact Semantic H1 */}
        <h1 className="font-display font-bold tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          <span>Seu app nas mãos dos seus clientes, </span>
          <span className="block mt-2 sm:mt-3 text-[#C5FF41] neon-glow font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            publicado na App Store e no Google Play.
          </span>
        </h1>

        {/* Exact Copy Paragraph */}
        <p className="mt-7 text-base sm:text-lg md:text-xl font-body text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          Ter um aplicativo próprio muda a relação com o cliente: ele deixa de te procurar quando lembra e passa a te ter no bolso. Pedido, agendamento, pagamento, acompanhamento, fidelidade: tudo num ícone na tela inicial.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#C5FF41] text-black font-mono-code font-bold text-sm hover:bg-[#d6ff6a] hover:shadow-[0_0_30px_rgba(197,255,65,0.6)] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Pedir escopo do meu aplicativo</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="#para-quem"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-zinc-950/80 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-mono-code text-sm backdrop-blur-xl transition-all"
          >
            <span>Ver para quem faz sentido</span>
            <ArrowDown className="w-4 h-4 text-[#C5FF41]" />
          </a>
        </div>
      </div>

      {/* 3D PERSPECTIVE TUNNEL CONTAINER */}
      <div className="relative w-full max-w-5xl h-[420px] md:h-[500px] perspective-container my-4 flex items-center justify-center pointer-events-none">
        <div
          ref={tunnelTrackRef}
          className="relative w-full h-full preserve-3d flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
          }}
        >
          {/* SCREEN 1: PEDIDO (Left Side, Z: -1600px) */}
          <div
            className="absolute w-[240px] md:w-[280px] p-4 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] preserve-3d"
            style={{
              transform: "translate3d(-340px, -60px, -1500px) rotateY(18deg) rotateZ(-3deg)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-code text-zinc-400">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5FF41]" />
                Pedido Online
              </span>
              <span className="text-[#C5FF41]">Novo</span>
            </div>
            <div className="mt-3 space-y-2 text-xs font-body">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                <span className="text-zinc-200">Plano Anual Premium</span>
                <span className="text-[#C5FF41] font-bold">R$ 289</span>
              </div>
              <div className="p-2 rounded-lg bg-[#C5FF41] text-black text-center font-mono-code font-bold text-[11px]">
                Confirmar no App
              </div>
            </div>
          </div>

          {/* SCREEN 2: AGENDAMENTO (Right Side, Z: -1100px) */}
          <div
            className="absolute w-[240px] md:w-[280px] p-4 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] preserve-3d"
            style={{
              transform: "translate3d(320px, 40px, -1100px) rotateY(-18deg) rotateZ(3deg)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-code text-zinc-400">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#C5FF41]" />
                Agendamento
              </span>
              <span className="text-[#C5FF41]">Confirmado</span>
            </div>
            <div className="mt-3 space-y-2 text-xs font-mono-code">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300">
                <div>Consulta &bull; Dr. Especialista</div>
                <div className="text-[#C5FF41] text-[11px] mt-1">Hoje às 14:30h</div>
              </div>
            </div>
          </div>

          {/* SCREEN 3: PAGAMENTO PIX & CARTÃO (Left Side, Z: -700px) */}
          <div
            className="absolute w-[240px] md:w-[280px] p-4 rounded-3xl bg-zinc-950/95 border border-[#C5FF41]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] preserve-3d"
            style={{
              transform: "translate3d(-260px, 30px, -700px) rotateY(12deg)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-code text-zinc-400">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <CreditCard className="w-3.5 h-3.5 text-[#C5FF41]" />
                Checkout Seguro
              </span>
              <span className="text-[#C5FF41]">Pix 1s</span>
            </div>
            <div className="mt-3 space-y-2 text-center text-xs font-mono-code">
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-zinc-300">
                <div className="text-[10px] text-zinc-400 uppercase">Total Pago</div>
                <div className="text-base font-bold text-[#C5FF41]">R$ 1.450,00</div>
              </div>
            </div>
          </div>

          {/* SCREEN 4: ACOMPANHAMENTO / RASTREIO (Right Side, Z: -350px) */}
          <div
            className="absolute w-[240px] md:w-[280px] p-4 rounded-3xl bg-zinc-950/95 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] preserve-3d"
            style={{
              transform: "translate3d(240px, -40px, -350px) rotateY(-12deg)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-code text-zinc-400">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Truck className="w-3.5 h-3.5 text-[#C5FF41]" />
                Rastreio em Tempo Real
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C5FF41] animate-pulse" />
            </div>
            <div className="mt-3 space-y-2 text-xs font-mono-code text-zinc-300">
              <div className="flex items-center justify-between text-[11px]">
                <span>Status:</span>
                <span className="text-[#C5FF41] font-bold">Em trânsito</span>
              </div>
              <div className="text-[10px] text-zinc-400">Chegada prevista em 14 min</div>
            </div>
          </div>

          {/* SCREEN 5: APP PRINCIPAL (Fidelidade / Hub - Center Front, Z: 0px) */}
          <div
            className="relative w-[280px] md:w-[320px] p-5 rounded-[2.5rem] bg-zinc-950 border-2 border-[#C5FF41]/60 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(197,255,65,0.2)] preserve-3d z-10"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4 border border-white/10" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-code">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C5FF41] text-black flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">App da Empresa</div>
                  <div className="text-[10px] text-zinc-400">iOS &bull; Android</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#C5FF41]/20 text-[#C5FF41] text-[10px] font-bold">
                Ativo
              </span>
            </div>

            {/* Loyalty & Shortcuts Widget */}
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C5FF41]" />
                  Clube de Fidelidade
                </span>
                <span className="text-[#C5FF41] font-bold">1.250 pts</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#C5FF41] w-4/5 rounded-full shadow-[0_0_8px_#C5FF41]" />
              </div>
              <div className="text-[10px] font-mono-code text-zinc-400">
                Resgate instantâneo com 1 toque
              </div>
            </div>

            {/* Published Badge */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-code text-zinc-400">
              <span className="text-white font-bold">Homologado</span>
              <span className="text-[#C5FF41]">App Store &bull; Play Store</span>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Scroll Indicator */}
      <div className="relative z-20 text-xs font-mono-code text-zinc-400 flex items-center gap-2 pt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] animate-ping" />
        <span>Role para avançar pelo túnel 3D</span>
      </div>
    </section>
  );
}
