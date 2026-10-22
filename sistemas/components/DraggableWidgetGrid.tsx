"use client";

import { useState, useRef } from "react";
import {
  GripVertical,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface WidgetItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  colSpan: string;
}

const INITIAL_WIDGETS: WidgetItem[] = [
  {
    id: "vendas",
    title: "Vendas Hoje",
    subtitle: "R$ 68.420,00",
    tag: "+22.4% vs ontem",
    colSpan: "lg:col-span-4",
  },
  {
    id: "financeiro",
    title: "Fluxo de Caixa Líquido",
    subtitle: "R$ 342.800,00",
    tag: "D+30 projetado",
    colSpan: "lg:col-span-4",
  },
  {
    id: "estoque",
    title: "Giro de Estoque",
    subtitle: "98.2% em conformidade",
    tag: "3 alertas de reposição",
    colSpan: "lg:col-span-4",
  },
  {
    id: "crm",
    title: "Funil de Vendas & CRM",
    subtitle: "42 negócios ativos",
    tag: "R$ 1.2M em pipeline",
    colSpan: "lg:col-span-6",
  },
  {
    id: "agenda",
    title: "Agenda de Operações & Equipe",
    subtitle: "18 ordens de serviço hoje",
    tag: "100% no prazo",
    colSpan: "lg:col-span-6",
  },
];

export default function DraggableWidgetGrid() {
  const [widgets, setWidgets] = useState<WidgetItem[]>(INITIAL_WIDGETS);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const updated = [...widgets];
    const fromIndex = updated.findIndex((w) => w.id === draggedId);
    const toIndex = updated.findIndex((w) => w.id === targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setWidgets(updated);
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  const renderWidgetContent = (id: string) => {
    switch (id) {
      case "vendas":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="text-zinc-400">Meta diária: R$ 55.000</span>
              <span className="text-[#C5FF41] font-bold">124% atingida</span>
            </div>
            {/* SVG Line Chart */}
            <div className="h-16 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 280 60">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C5FF41" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#C5FF41" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 50 Q 40 45, 70 30 T 140 35 T 210 15 T 280 8 L 280 60 L 0 60 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M 0 50 Q 40 45, 70 30 T 140 35 T 210 15 T 280 8"
                  fill="none"
                  stroke="#C5FF41"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono-code text-zinc-500 pt-1 border-t border-white/5">
              <span>08:00h</span>
              <span>12:00h</span>
              <span>15:00h</span>
              <span className="text-white font-bold">Agora</span>
            </div>
          </div>
        );

      case "financeiro":
        return (
          <div className="space-y-3 font-mono-code">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex justify-between text-xs">
              <span className="text-zinc-400">A Receber (Pix/Boleto):</span>
              <span className="text-[#C5FF41] font-bold">R$ 412.300</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex justify-between text-xs">
              <span className="text-zinc-400">A Pagar Fornecedores:</span>
              <span className="text-zinc-300">R$ 69.500</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
              <span>Conciliação D+0</span>
              <span className="text-emerald-400">Automática</span>
            </div>
          </div>
        );

      case "estoque":
        return (
          <div className="space-y-3 font-mono-code">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Matéria-Prima A</span>
                <span className="text-white font-bold">88%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[88%] h-full bg-[#C5FF41] rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Produtos Acabados</span>
                <span className="text-white font-bold">94%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="w-[94%] h-full bg-[#C5FF41] rounded-full" />
              </div>
            </div>
            <div className="pt-1 flex items-center justify-between text-[11px] text-yellow-400">
              <span>Alerta de Compra</span>
              <span>Lote #402 em ponto de pedido</span>
            </div>
          </div>
        );

      case "crm":
        return (
          <div className="grid grid-cols-4 gap-2 text-center font-mono-code text-xs pt-1">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-zinc-400 uppercase">Leads</div>
              <div className="font-bold text-white text-base mt-1">142</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Novos</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-zinc-400 uppercase">Propostas</div>
              <div className="font-bold text-white text-base mt-1">45</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Enviadas</div>
            </div>
            <div className="p-3 rounded-xl bg-[#C5FF41]/10 border border-[#C5FF41]/30">
              <div className="text-[10px] text-[#C5FF41] uppercase font-bold">Negociação</div>
              <div className="font-bold text-[#C5FF41] text-base mt-1">18</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Quentes</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-zinc-400 uppercase">Fechados</div>
              <div className="font-bold text-emerald-400 text-base mt-1">11</div>
              <div className="text-[10px] text-emerald-500 mt-0.5">R$ 380k</div>
            </div>
          </div>
        );

      case "agenda":
        return (
          <div className="space-y-2 font-mono-code text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5FF41]" />
                <span className="text-zinc-200">Entrega de Carga &bull; Rota Norte</span>
              </div>
              <span className="text-zinc-400">14:30h</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-zinc-200">Revisão Fiscal &bull; Auditoria Externa</span>
              </div>
              <span className="text-zinc-400">16:00h</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section
      id="demonstracao"
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto select-none scroll-mt-20"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[550px] h-[550px] bg-[#C5FF41]/5 rounded-full blur-[170px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl">
          {/* Eyebrow - strictly without rounded capsule borders */}
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold mb-3">
            DASHBOARD INTERATIVO &bull; COMPONENTES MODULARES
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
            Seu painel de controle, como sua empresa precisa
          </h2>

          <p className="mt-4 text-zinc-400 font-body text-base md:text-lg leading-relaxed">
            Experimente reorganizar os widgets abaixo. Em um sistema sob medida, cada gestor tem acesso ao painel personalizado com os indicadores vitais da sua área.
          </p>
        </div>

        {/* Interactive Badge (Effect #2 Requirement: Rotular como demonstração) */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5FF41]/10 border border-[#C5FF41]/40 text-[#C5FF41] font-mono-code text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>DEMONSTRAÇÃO &bull; ARRASTE PARA REORDENAR</span>
        </div>
      </div>

      {/* Flagship Effect #2: Draggable Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {widgets.map((widget) => {
          const isDragging = draggedId === widget.id;
          const isOver = dragOverId === widget.id;

          return (
            <div
              key={widget.id}
              draggable
              onDragStart={() => handleDragStart(widget.id)}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDrop={(e) => handleDrop(e, widget.id)}
              onDragEnd={() => {
                setDraggedId(null);
                setDragOverId(null);
              }}
              className={`${widget.colSpan} relative rounded-3xl p-6 sm:p-7 bg-zinc-950/90 border transition-all duration-300 backdrop-blur-2xl cursor-grab active:cursor-grabbing ${
                isDragging
                  ? "opacity-50 scale-95 border-[#C5FF41] shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
                  : isOver
                  ? "border-[#C5FF41] bg-white/[0.05] scale-[1.02]"
                  : "border-white/10 hover:border-white/25 hover:shadow-2xl"
              }`}
            >
              {/* Top Drag Handle & Title */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <GripVertical className="w-4 h-4 text-zinc-500 hover:text-[#C5FF41] transition-colors" />
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      {widget.title}
                    </h3>
                    <div className="font-display font-black text-xl sm:text-2xl text-[#C5FF41] mt-0.5">
                      {widget.subtitle}
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono-code text-zinc-300">
                  {widget.tag}
                </span>
              </div>

              {/* Dynamic Content */}
              {renderWidgetContent(widget.id)}
            </div>
          );
        })}
      </div>
    </section>
  );
}
