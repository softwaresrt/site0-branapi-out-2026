"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  TrendingUp,
  Workflow,
  FileCheck,
  ArrowRight,
  GripHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

interface NodeData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  x: number;
  y: number;
  highlight: string;
}

const INITIAL_NODES: NodeData[] = [
  {
    id: "atendimento",
    title: "Atendimento",
    subtitle: "WhatsApp & Web 24/7",
    description:
      "Assistente virtual que responde no WhatsApp e no site, entende contexto e passa pra um humano na hora certa.",
    icon: MessageSquare,
    x: 80,
    y: 70,
    highlight: "Passagem com contexto completo para o consultor humano sem o cliente precisar repetir nada.",
  },
  {
    id: "vendas",
    title: "Vendas",
    subtitle: "Qualificação & Pipeline",
    description: "Qualificação de leads, follow-up automático, envio de proposta.",
    icon: TrendingUp,
    x: 420,
    y: 70,
    highlight: "Disparo automático de proposta e lembretes inteligentes nos momentos de maior conversão.",
  },
  {
    id: "operacao",
    title: "Operação",
    subtitle: "Integração & Relatórios",
    description: "Integração entre sistemas, conciliação, relatórios automáticos.",
    icon: Workflow,
    x: 80,
    y: 330,
    highlight: "Sincronização entre CRM, ERP bancário e planilhas legadas sem intervenção manual.",
  },
  {
    id: "documentos",
    title: "Documentos",
    subtitle: "OCR & Classificação IA",
    description: "Leitura, classificação e preenchimento com IA.",
    icon: FileCheck,
    x: 420,
    y: 330,
    highlight: "Extração de dados de notas fiscais, contratos e comprovantes direto para o seu banco de dados.",
  },
];

export default function AutomationFlowSection() {
  const limalhaCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [activeNodeId, setActiveNodeId] = useState<string>("atendimento");
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Flagship Effect #2: Campo de Limalha (Magnetic needle filaments reacting to mouse)
  useEffect(() => {
    const canvas = limalhaCanvasRef.current;
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

    const spacing = 44;
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);

    let mouseX = width * 0.5;
    let mouseY = height * 0.5;
    let isTouch = window.matchMedia("(pointer: coarse)").matches;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    if (!isTouch) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1.2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const cx = i * spacing + spacing * 0.5;
          const cy = j * spacing + spacing * 0.5;

          let angle: number;

          if (isTouch) {
            // Mobile: slow swirling wave pattern
            angle = Math.sin(time * 0.6 + i * 0.2 + j * 0.2) * Math.PI;
          } else {
            // Desktop: Orient toward mouse + vortex
            const dx = mouseX - cx;
            const dy = mouseY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const baseAngle = Math.atan2(dy, dx);
            // Slight vortex twist when close to cursor
            const twist = Math.max(0, 1 - dist / 300) * 0.8;
            angle = baseAngle + twist;
          }

          const length = 11;
          const x1 = cx - Math.cos(angle) * (length * 0.5);
          const y1 = cy - Math.sin(angle) * (length * 0.5);
          const x2 = cx + Math.cos(angle) * (length * 0.5);
          const y2 = cy + Math.sin(angle) * (length * 0.5);

          // Subtle gradient coloring
          const distToMouse = Math.hypot(mouseX - cx, mouseY - cy);
          const isNear = distToMouse < 180 && !isTouch;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = isNear
            ? "rgba(197, 255, 65, 0.45)"
            : "rgba(255, 255, 255, 0.08)";
          ctx.stroke();
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
  }, []);

  // Draggable node handling
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveNodeId(id);
    const node = nodes.find((n) => n.id === id);
    if (!node || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    };
    setDraggingNodeId(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 240, e.clientX - rect.left - dragOffsetRef.current.x));
    const newY = Math.max(20, Math.min(rect.height - 140, e.clientY - rect.top - dragOffsetRef.current.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
  };

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  return (
    <section
      id="fluxo"
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 bg-[#08080a] text-white border-y border-white/10 select-none scroll-mt-20 overflow-hidden"
    >
      {/* Campo de Limalha Canvas in background */}
      <canvas
        ref={limalhaCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
      />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold mb-3">
            WORKFLOWS AUTÔNOMOS &bull; INTEGRAÇÃO EM REDE
          </div>

          {/* Exact H2 Copy */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
            O que a gente automatiza
          </h2>

          <p className="mt-4 text-zinc-400 font-body text-base md:text-lg leading-relaxed">
            Arraste os nós do fluxo abaixo para ver a conexão viva entre as áreas da sua empresa. Os dados viajam pelas linhas elásticas em tempo real.
          </p>
        </div>

        {/* Flagship Effect #3: Interactive Node Editor & Detail Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* NODE CANVAS STAGE */}
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="lg:col-span-8 relative h-[520px] rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden touch-none"
          >
            {/* Top Bar with Hint */}
            <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between text-xs font-mono-code text-zinc-400 pointer-events-none">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <span className="w-2 h-2 rounded-full bg-[#C5FF41] animate-ping" />
                Editor de Nós Ativo
              </span>
              <span className="text-[11px] text-zinc-500">Arraste os nós para testar a curva elástica</span>
            </div>

            {/* SVG Connecting Lines with Traveling Data Pulses */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Node 0 to Node 1 (Atendimento -> Vendas) */}
              <path
                d={`M ${nodes[0].x + 110} ${nodes[0].y + 50} C ${nodes[0].x + 220} ${nodes[0].y + 50}, ${nodes[1].x - 60} ${nodes[1].y + 50}, ${nodes[1].x + 110} ${nodes[1].y + 50}`}
                fill="none"
                stroke="rgba(197, 255, 65, 0.4)"
                strokeWidth="2"
                className="data-pulse-line"
              />

              {/* Node 0 to Node 2 (Atendimento -> Operação) */}
              <path
                d={`M ${nodes[0].x + 110} ${nodes[0].y + 90} C ${nodes[0].x + 110} ${nodes[0].y + 180}, ${nodes[2].x + 110} ${nodes[2].y - 30}, ${nodes[2].x + 110} ${nodes[2].y + 50}`}
                fill="none"
                stroke="rgba(197, 255, 65, 0.4)"
                strokeWidth="2"
                className="data-pulse-line"
              />

              {/* Node 1 to Node 3 (Vendas -> Documentos) */}
              <path
                d={`M ${nodes[1].x + 110} ${nodes[1].y + 90} C ${nodes[1].x + 110} ${nodes[1].y + 180}, ${nodes[3].x + 110} ${nodes[3].y - 30}, ${nodes[3].x + 110} ${nodes[3].y + 50}`}
                fill="none"
                stroke="rgba(197, 255, 65, 0.4)"
                strokeWidth="2"
                className="data-pulse-line"
              />

              {/* Node 2 to Node 3 (Operação -> Documentos) */}
              <path
                d={`M ${nodes[2].x + 110} ${nodes[2].y + 50} C ${nodes[2].x + 220} ${nodes[2].y + 50}, ${nodes[3].x - 60} ${nodes[3].y + 50}, ${nodes[3].x + 110} ${nodes[3].y + 50}`}
                fill="none"
                stroke="rgba(197, 255, 65, 0.4)"
                strokeWidth="2"
                className="data-pulse-line"
              />
            </svg>

            {/* Draggable Node Cards */}
            {nodes.map((node) => {
              const isActive = activeNodeId === node.id;
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDown(node.id, e)}
                  style={{
                    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                  }}
                  className={`absolute z-10 w-[220px] p-4 rounded-2xl cursor-grab active:cursor-grabbing select-none transition-shadow backdrop-blur-xl border ${
                    isActive
                      ? "bg-zinc-900 border-[#C5FF41] shadow-[0_0_30px_rgba(197,255,65,0.35)] scale-[1.03]"
                      : "bg-zinc-950/90 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isActive ? "bg-[#C5FF41] text-black" : "bg-white/10 text-zinc-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-sm text-white">
                        {node.title}
                      </span>
                    </div>
                    <GripHorizontal className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="text-[11px] font-mono-code text-[#C5FF41] truncate">
                    {node.subtitle}
                  </div>
                  <div className="text-[11px] font-body text-zinc-400 mt-1 line-clamp-2 leading-snug">
                    {node.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE NODE DETAILS SIDEBAR */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="text-xs font-mono-code uppercase tracking-wider text-[#C5FF41] font-bold">
                Módulo Selecionado
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono-code text-zinc-400">
                100% Automatizado
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-2xl text-white">
                {activeNode.title}
              </h3>
              <p className="mt-3 text-zinc-300 font-body text-base leading-relaxed">
                {activeNode.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="text-xs font-mono-code uppercase text-[#C5FF41] font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Ganho de Eficiência
              </div>
              <p className="text-xs font-mono-code text-zinc-400 leading-relaxed">
                {activeNode.highlight}
              </p>
            </div>

            <div className="space-y-2 font-mono-code text-xs text-zinc-400 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span>Tempo de Resposta:</span>
                <span className="text-[#C5FF41] font-bold">&lt; 3 segundos</span>
              </div>
              <div className="flex justify-between">
                <span>Disponibilidade:</span>
                <span className="text-white font-bold">24 horas / 7 dias</span>
              </div>
              <div className="flex justify-between">
                <span>Transição Humana:</span>
                <span className="text-emerald-400 font-bold">Automática no WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
