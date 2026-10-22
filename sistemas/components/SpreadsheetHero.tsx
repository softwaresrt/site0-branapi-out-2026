"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Sparkles, AlertTriangle, TrendingUp, DollarSign, Database, CheckCircle2 } from "lucide-react";

export default function SpreadsheetHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTransformed, setIsTransformed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  // Flagship Effect #5: Fine dot mesh canvas that waves and repels from cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
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

    const spacing = 38;
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);
    let time = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (!isTouch) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const originX = i * spacing + 10;
          const originY = j * spacing + 10;

          // Wave offset
          const wave = Math.sin(time + originX * 0.015 + originY * 0.01) * 3;

          // Cursor repulsion
          let px = originX;
          let py = originY + wave;
          const dx = px - mousePos.x;
          const dy = py - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 24;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }

          // Dot render
          const isNear = dist < maxDist;
          ctx.beginPath();
          ctx.arc(px, py, isNear ? 1.6 : 1.1, 0, Math.PI * 2);
          ctx.fillStyle = isNear ? "rgba(197, 255, 65, 0.6)" : "rgba(255, 255, 255, 0.12)";
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      if (!isTouch) window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.x, mousePos.y]);

  const phone = "5562981580707";
  const defaultMsg = "Oi, quero desenhar um sistema para a minha empresa";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between items-center pt-28 pb-16 px-4 select-none"
    >
      {/* Background Interactive Dot Grid Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      />

      {/* Central Neon Ambient Aura */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-[#C5FF41]/8 rounded-full blur-[170px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Text Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 mt-4">
        {/* Clean Eyebrow - strictly without rounded capsule borders */}
        <div className="text-xs sm:text-sm font-mono-code font-bold uppercase tracking-[0.25em] text-[#C5FF41] mb-5">
          BRANAPI &bull; SISTEMA SOB MEDIDA
        </div>

        {/* Exact Copy H1 */}
        <h1 className="font-display font-bold tracking-tighter text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          <span>Chega de planilha. </span>
          <span className="block mt-2 sm:mt-3 text-[#C5FF41] neon-glow font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            Chega de sistema alugado que não faz o que você precisa.
          </span>
        </h1>

        {/* Exact Copy Intro */}
        <p className="mt-7 text-base sm:text-lg md:text-xl font-body text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          Se a sua operação roda em planilhas, o risco é um erro de fórmula custar dinheiro, ou a pessoa que &quot;sabe como funciona&quot; sair de férias. Se roda em sistema de prateleira, você paga todo mês por 100 funções e usa 12.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#C5FF41] text-black font-mono-code font-bold text-sm hover:bg-[#d6ff6a] hover:shadow-[0_0_30px_rgba(197,255,65,0.6)] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Quero desenhar meu sistema</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setIsTransformed(!isTransformed)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-zinc-950/80 border border-[#C5FF41]/40 text-[#C5FF41] font-mono-code text-sm backdrop-blur-xl hover:bg-[#C5FF41]/10 transition-all shadow-[0_0_15px_rgba(197,255,65,0.15)]"
          >
            <span>{isTransformed ? "Voltar para Planilha" : "Ver como fica no Sistema"}</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flagship Effect #1: "PLANILHA VIRA SISTEMA" Interactive Morphing Stage */}
      <div className="relative z-10 w-full max-w-5xl my-10 px-2 sm:px-4">
        <div className="relative p-4 sm:p-7 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-700">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs font-mono-code text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-bold text-zinc-300">
                {isTransformed ? "Branapi Enterprise ERP & CRM v2.6" : "CONTROLE_GERAL_OFICIAL_FINAL_v3_rev2.xlsx"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {isTransformed ? "Banco PostgreSQL Integrado" : "17 Células com Erro de Referência"}
              </span>
            </div>
          </div>

          {/* TRANSFORMATION CONTAINER */}
          {!isTransformed ? (
            /* STATE A: CHAOTIC SPREADSHEET */
            <div className="transition-all duration-700 ease-out animate-in fade-in">
              <div className="mb-3 flex items-center justify-between text-xs font-mono-code text-zinc-500">
                <span>Planilha Manual &bull; Vendas &amp; Estoque</span>
                <span className="text-red-400 flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Fórmulas corrompidas detectadas
                </span>
              </div>

              {/* Excel Table Mockup */}
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/60 font-mono-code text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 text-zinc-400 border-b border-white/10">
                      <th className="p-2.5 w-10 border-r border-white/5 text-center">#</th>
                      <th className="p-2.5 border-r border-white/5">Cliente</th>
                      <th className="p-2.5 border-r border-white/5">Pedido</th>
                      <th className="p-2.5 border-r border-white/5">Valor R$</th>
                      <th className="p-2.5 border-r border-white/5">Margem %</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-2.5 bg-zinc-900/40 text-center text-zinc-500">14</td>
                      <td className="p-2.5 font-sans">Hospital Central</td>
                      <td className="p-2.5 text-zinc-400">#8910</td>
                      <td className="p-2.5 font-bold">R$ 48.200</td>
                      <td className="p-2.5 text-[#C5FF41]">32.4%</td>
                      <td className="p-2.5 text-emerald-400">Entregue</td>
                    </tr>
                    <tr className="cell-error-blink">
                      <td className="p-2.5 bg-zinc-900/40 text-center text-zinc-500">15</td>
                      <td className="p-2.5 font-sans">Construtora Alvorada</td>
                      <td className="p-2.5 text-zinc-400">#8911</td>
                      <td className="p-2.5 font-black text-red-400">#REF!</td>
                      <td className="p-2.5 font-black text-red-400">#DIV/0!</td>
                      <td className="p-2.5 text-red-400 font-bold">ERRO NA FÓRMULA</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-2.5 bg-zinc-900/40 text-center text-zinc-500">16</td>
                      <td className="p-2.5 font-sans">Rede Farma Express</td>
                      <td className="p-2.5 text-zinc-400">#8912</td>
                      <td className="p-2.5 font-bold">R$ 19.450</td>
                      <td className="p-2.5 text-zinc-400">--</td>
                      <td className="p-2.5 text-yellow-400">Aguardando aprovação</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-2.5 bg-zinc-900/40 text-center text-zinc-500">17</td>
                      <td className="p-2.5 font-sans">Distribuidora Minas</td>
                      <td className="p-2.5 text-zinc-400">#8913</td>
                      <td className="p-2.5 font-bold">R$ 74.900</td>
                      <td className="p-2.5 text-red-400 font-bold">#N/D</td>
                      <td className="p-2.5 text-zinc-400">Em conferência</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-xs font-mono-code text-red-300 flex items-center justify-between">
                <span>Risco Real: Se alguém deletar a coluna D, o balanço fecha errado.</span>
                <button
                  type="button"
                  onClick={() => setIsTransformed(true)}
                  className="px-3 py-1 rounded-lg bg-[#C5FF41] text-black font-bold text-[11px] hover:bg-[#d6ff6a] transition-colors"
                >
                  Transformar em Sistema &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* STATE B: SLEEK MODERN DASHBOARD IN NEON GREEN OVER BLACK */
            <div className="transition-all duration-700 ease-out animate-in zoom-in-95">
              <div className="mb-4 flex items-center justify-between text-xs font-mono-code">
                <span className="text-[#C5FF41] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5FF41]" /> Sistema Sob Medida Branapi &bull; Tempo Real
                </span>
                <span className="text-zinc-400">Sincronizado via Webhook &bull; 0 Erros de Cálculo</span>
              </div>

              {/* Dashboard Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#C5FF41]/40 shadow-[0_0_20px_rgba(197,255,65,0.1)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code text-zinc-400">
                    <span>Faturamento Hoje</span>
                    <DollarSign className="w-4 h-4 text-[#C5FF41]" />
                  </div>
                  <div className="font-display font-black text-2xl text-white">R$ 142.550</div>
                  <div className="text-[11px] font-mono-code text-[#C5FF41] font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs meta do dia
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code text-zinc-400">
                    <span>Pedidos Aprovados</span>
                    <Database className="w-4 h-4 text-[#C5FF41]" />
                  </div>
                  <div className="font-display font-black text-2xl text-white">38 pedidos</div>
                  <div className="text-[11px] font-mono-code text-emerald-400">100% integrados ao estoque</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code text-zinc-400">
                    <span>Margem Média Líquida</span>
                    <span className="text-[#C5FF41] font-bold">%</span>
                  </div>
                  <div className="font-display font-black text-2xl text-white">31.8%</div>
                  <div className="text-[11px] font-mono-code text-zinc-400">Cálculo automatizado</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#C5FF41]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code text-zinc-400">
                    <span>Auditoria &amp; Backup</span>
                    <span className="w-2 h-2 rounded-full bg-[#C5FF41] animate-pulse" />
                  </div>
                  <div className="font-display font-bold text-lg text-[#C5FF41]">Imutável</div>
                  <div className="text-[11px] font-mono-code text-zinc-400">Histórico de cada alteração</div>
                </div>
              </div>

              {/* Interactive Mini Table */}
              <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-white/10 font-mono-code text-xs">
                <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/10 text-[11px]">
                  <span>Últimos Registros com Validação em Tempo Real</span>
                  <span className="text-[#C5FF41]">Tudo Conectado</span>
                </div>
                <div className="divide-y divide-white/5 pt-2 text-zinc-300">
                  <div className="py-1.5 flex justify-between items-center">
                    <span>#8911 &bull; Construtora Alvorada</span>
                    <span className="text-[#C5FF41] font-bold">R$ 52.800 (Fórmula corrigida)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">Aprovado</span>
                  </div>
                  <div className="py-1.5 flex justify-between items-center">
                    <span>#8912 &bull; Rede Farma Express</span>
                    <span className="text-zinc-200">R$ 19.450 (Estoque reservado)</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#C5FF41]/20 text-[#C5FF41] text-[10px]">Em Separação</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="relative z-10 text-xs font-mono-code text-zinc-400 flex items-center gap-2 pt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] animate-ping" />
        <span>Role para ver os 3 pilares da solução</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#C5FF41] animate-bounce" />
      </div>
    </section>
  );
}
