"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Zap, AlertTriangle, RefreshCw, Globe, CheckCircle2, XCircle } from "lucide-react";

export default function SpeedComparator() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercentage = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPosition(clampedPercentage);
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <section
      id="comparador-velocidade"
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto scroll-mt-24 select-none"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[400px] bg-[#C5FF41]/5 rounded-full blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-semibold mb-3">
          EXPERIÊNCIA DO VISITANTE
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          Comparador de Velocidade
        </h2>

        <p className="mt-4 text-zinc-400 font-body text-base md:text-lg">
          Cada segundo que seu site demora pra abrir custa clientes para a concorrência. Arraste a linha central para comparar o impacto na prática.
        </p>
      </div>

      {/* Interactive Drag Comparator Frame */}
      <div
        ref={containerRef}
        className="relative w-full h-[520px] md:h-[580px] rounded-3xl overflow-hidden border border-white/[0.12] bg-zinc-950 shadow-[0_25px_70px_rgba(0,0,0,0.95)] cursor-ew-resize select-none"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      >
        {/* ======================================================== */}
        {/* LAYER 1: BASE LAYER (LADO BRANAPI - ULTRA RÁPIDO) */}
        {/* ======================================================== */}
        <div className="absolute inset-0 w-full h-full bg-[#030303] flex flex-col">
          {/* Browser Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-black/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-[#C5FF41]" />
            </div>

            <div className="px-4 py-1 rounded-full bg-white/5 border border-[#C5FF41]/30 font-mono-code text-xs text-[#C5FF41] flex items-center gap-2">
              <Globe className="w-3 h-3" />
              <span>https://suaempresa.com.br</span>
            </div>

            <span className="text-[11px] font-mono-code font-bold text-[#C5FF41] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Site Branapi
            </span>
          </div>

          {/* Browser Body (Branapi Clean High Performance) */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-radial from-[#C5FF41]/10 via-transparent to-transparent">
            {/* Status Pill */}
            <div className="self-end px-3.5 py-1.5 rounded-full bg-[#C5FF41]/15 border border-[#C5FF41]/40 text-[#C5FF41] text-xs font-mono-code font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Carregamento Instantâneo</span>
            </div>

            <div className="max-w-md space-y-4 my-auto">
              <div className="inline-block text-xs font-mono-code px-3 py-1 rounded-md bg-white/10 text-white font-bold">
                Lighthouse 100/100
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-4xl text-white leading-tight">
                Engenharia de ponta a ponta sem engasgos.
              </h3>
              <p className="text-zinc-300 font-body text-sm sm:text-base leading-relaxed">
                Renderização imediata no primeiro byte. Os visitantes visualizam sua proposta sem nenhum tempo de espera ou travamento.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="px-4 py-2 rounded-xl bg-[#C5FF41] text-black font-mono-code font-bold text-xs shadow-[0_0_15px_rgba(197,255,65,0.4)]">
                  Falar no WhatsApp
                </span>
                <span className="text-xs font-mono-code text-zinc-400">Taxa de retenção: 100%</span>
              </div>
            </div>

            {/* Bottom Performance Metrics */}
            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center font-mono-code text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-zinc-400">Tempo de Resposta</div>
                <div className="text-sm font-bold text-[#C5FF41] mt-0.5">0.4s (Imediato)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-zinc-400">Layout Shift (CLS)</div>
                <div className="text-sm font-bold text-[#C5FF41] mt-0.5">0.00 (Zero oscilação)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-zinc-400">Conversão de Leads</div>
                <div className="text-sm font-bold text-[#C5FF41] mt-0.5">Máxima</div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LAYER 2: OVERLAY LAYER (LADO LENTO - SEU SITE ATUAL) */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 h-full overflow-hidden bg-zinc-950 flex flex-col border-r border-[#C5FF41]"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* Inner container with full width so content doesn't squash */}
          <div className="w-[100vw] max-w-[1240px] h-full flex flex-col bg-[#08080a]">
            {/* Browser Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-black/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-zinc-700" />
                <span className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>

              <div className="px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 font-mono-code text-xs text-red-400 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <span>https://seusiteatual.com.br</span>
              </div>

              <span className="text-[11px] font-mono-code font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Seu Site Atual
              </span>
            </div>

            {/* Browser Body (Slow Loading with Spinner and Skeleton Bars) */}
            <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              {/* Alert Banner */}
              <div className="self-start px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono-code font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Carregando elementos pesados...</span>
              </div>

              {/* Pulsating Skeleton Ghost Bars and Slow Spinner */}
              <div className="max-w-md space-y-4 my-auto">
                {/* Slow Spinner */}
                <div className="flex items-center gap-3 text-red-400 font-mono-code text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Aguardando resposta do servidor (4.8s)...</span>
                </div>

                {/* Skeleton title */}
                <div className="h-8 bg-zinc-800/80 rounded-lg w-3/4 animate-pulse" />
                <div className="h-8 bg-zinc-800/50 rounded-lg w-1/2 animate-pulse" />

                {/* Skeleton paragraphs */}
                <div className="space-y-2 pt-2">
                  <div className="h-4 bg-zinc-900 rounded w-full animate-pulse" />
                  <div className="h-4 bg-zinc-900 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-zinc-900 rounded w-2/3 animate-pulse" />
                </div>

                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono-code text-red-300">
                  ⚠️ O visitante desistiu de esperar e fechou a aba antes de ver seu telefone.
                </div>
              </div>

              {/* Bottom Negative Metrics */}
              <div className="pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center font-mono-code text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-zinc-500">Tempo de Resposta</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">5.2s (Lento)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-zinc-500">Perda de Tráfego</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">-53% dos Cliques</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-zinc-500">PageSpeed Score</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">32 / 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DRAGGABLE DIVIDER LINE & HANDLE */}
        {/* ======================================================== */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#C5FF41] shadow-[0_0_20px_#C5FF41] -translate-x-1/2 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Central Circular Grip Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black border-2 border-[#C5FF41] shadow-[0_0_25px_rgba(197,255,65,0.8)] flex items-center justify-center text-[#C5FF41] pointer-events-auto cursor-ew-resize">
            <span className="font-mono-code text-xs font-black tracking-tighter">
              &lt;|&gt;
            </span>
          </div>
        </div>
      </div>

      {/* Helper text below comparator */}
      <div className="mt-4 text-center text-xs font-mono-code text-zinc-400">
        &larr; Arraste a linha para comparar a velocidade e retenção de clientes &rarr;
      </div>
    </section>
  );
}
