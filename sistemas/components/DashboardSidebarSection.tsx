"use client";

import { useState } from "react";
import {
  DollarSign,
  Package,
  Users,
  Calendar,
  FileText,
  BarChart3,
  UserCheck,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";

interface ModuleData {
  id: string;
  name: string;
  icon: any;
  summary: string;
  features: string[];
  mockupTitle: string;
  badge: string;
}

const MODULES: ModuleData[] = [
  {
    id: "financeira",
    name: "Gestão financeira",
    icon: DollarSign,
    summary:
      "Contas a pagar e receber, fluxo de caixa projetado, conciliação bancária via OFX/API Pix e centro de custos unificado.",
    features: [
      "Emissão automática de boletos e Pix com QR Code dinâmico",
      "DRE gerencial em tempo real sem esperar o fechamento mensal",
      "Rateio inteligente de despesas por filial e projeto",
      "Alerta de inadimplência com régua de cobrança automática",
    ],
    mockupTitle: "Fluxo Financeiro & DRE Consolidado",
    badge: "Conciliação Automática",
  },
  {
    id: "estoque",
    name: "Controle de estoque",
    icon: Package,
    summary:
      "Controle multidepósito, rastreabilidade por lote e validade, ponto de pedido automatizado e curva ABC de produtos.",
    features: [
      "Leitura de código de barras e QR Code via câmera do celular",
      "Inventário rotativo sem precisar paralisar a empresa",
      "Baixa automática com nota fiscal de entrada (XML)",
      "Histórico de movimentação com auditoria de usuário",
    ],
    mockupTitle: "Posição de Estoque & Curva ABC",
    badge: "Rastreio por Lote",
  },
  {
    id: "crm",
    name: "CRM e funil de vendas",
    icon: Users,
    summary:
      "Pipeline visual de oportunidades (Kanban), histórico completo de interações, automação de follow-up e métricas de fechamento.",
    features: [
      "Funis múltiplos personalizados para cada linha de serviço",
      "Integração nativa com WhatsApp e e-mail",
      "Distribuição automática de leads (Round-robin)",
      "Previsão de faturamento (Forecast) por vendedor",
    ],
    mockupTitle: "Pipeline de Oportunidades & Conversão",
    badge: "Kanban Visual",
  },
  {
    id: "agendamento",
    name: "Agendamento",
    icon: Calendar,
    summary:
      "Agenda integrada para equipes internas, técnicas e de atendimento, com lembretes automáticos e controle de disponibilidade.",
    features: [
      "Confirmação automática de presença via WhatsApp",
      "Controle de salas, equipamentos e viaturas",
      "Sincronização bidirecional com Google Agenda e Outlook",
      "Bloqueio inteligente de conflito de horários",
    ],
    mockupTitle: "Grade de Agendamentos & Ordens de Serviço",
    badge: "Sync com Google Agenda",
  },
  {
    id: "propostas",
    name: "Emissão de propostas e contratos",
    icon: FileText,
    summary:
      "Geração de orçamentos em PDF com 1 clique, assinatura eletrônica válida juridicamente e rastreamento de abertura.",
    features: [
      "Modelos dinâmicos com preenchimento automático de dados",
      "Assinatura digital integrada compatível com ICP-Brasil",
      "Notificação quando o cliente abre a proposta",
      "Conversão imediata de proposta aprovada em ordem de serviço",
    ],
    mockupTitle: "Gerador de Contratos & Assinatura Digital",
    badge: "Assinatura Eletrônica",
  },
  {
    id: "dashboards",
    name: "Dashboards em tempo real",
    icon: BarChart3,
    summary:
      "Gráficos executivos, KPIs operacionais, exportação para Excel/PDF e visualização adaptada para TV na sala de reuniões.",
    features: [
      "Atualização em tempo real sem necessidade de F5",
      "Filtros avançados por período, filial e categoria",
      "Métricas calculadas sob medida para a sua diretoria",
      "Modo apresentação de tela cheia para monitoramento contínuo",
    ],
    mockupTitle: "Painel Executivo de Indicadores (KPIs)",
    badge: "Tempo Real",
  },
  {
    id: "portal",
    name: "Portal do cliente",
    icon: UserCheck,
    summary:
      "Área exclusiva com login seguro para seus clientes consultarem faturas, pedidos, chamados e documentos em andamento.",
    features: [
      "2ª via de boletos e comprovantes fiscais 24/7",
      "Abertura e acompanhamento de chamados técnicos",
      "Aprovação de propostas pelo próprio cliente",
      "Redução drástica de mensagens repetitivas no atendimento",
    ],
    mockupTitle: "Área Exclusiva com Autoatendimento 24/7",
    badge: "Autoatendimento",
  },
];

export default function DashboardSidebarSection() {
  const [activeModuleId, setActiveModuleId] = useState("financeira");

  const activeModule =
    MODULES.find((m) => m.id === activeModuleId) || MODULES[0];
  const IconComponent = activeModule.icon;

  return (
    <section
      id="modulos"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-white text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          {/* Eyebrow */}
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
            ARQUITETURA MODULAR &bull; NUCLEO INTEGRADO
          </div>

          {/* Exact H2 Copy */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            Módulos mais pedidos
          </h2>

          {/* Exact Copy Paragraph */}
          <p className="mt-4 text-zinc-600 font-body text-base md:text-lg leading-relaxed">
            Gestão financeira, controle de estoque, CRM e funil de vendas, agendamento, emissão de propostas e contratos, dashboards em tempo real, portal do cliente.
          </p>
        </div>

        {/* Flagship Effect #3: Dashboard Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SIDEBAR: Left column on Desktop / Horizontal Scrollable on Mobile */}
          <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none">
            {MODULES.map((item) => {
              const isActive = item.id === activeModuleId;
              const ItemIcon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModuleId(item.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 shrink-0 sm:shrink ${
                    isActive
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-lg scale-[1.01]"
                      : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-[#C5FF41] text-black shadow-[0_0_12px_rgba(197,255,65,0.4)]"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <span className="font-display font-bold text-sm sm:text-base whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 hidden sm:block transition-transform ${
                      isActive
                        ? "text-[#C5FF41] translate-x-1"
                        : "text-zinc-400 group-hover:translate-x-0.5"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* RIGHT PANEL: Module Interactive Preview */}
          <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-zinc-50 border border-zinc-200 shadow-sm relative overflow-hidden transition-all duration-300">
            {/* Header of Active Module */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-[#C5FF41] flex items-center justify-center shadow-md">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-zinc-950">
                    {activeModule.name}
                  </h3>
                  <div className="text-xs font-mono-code text-zinc-500">
                    {activeModule.mockupTitle}
                  </div>
                </div>
              </div>

              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-zinc-200 text-zinc-800 text-xs font-mono-code font-bold">
                {activeModule.badge}
              </span>
            </div>

            {/* Description & Overview */}
            <div className="mt-6 space-y-4">
              <p className="text-zinc-700 font-body text-base sm:text-lg leading-relaxed">
                {activeModule.summary}
              </p>

              {/* Functional Deliverables Grid */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeModule.features.map((feat) => (
                  <div
                    key={feat}
                    className="p-3.5 rounded-xl bg-white border border-zinc-200 flex items-start gap-2.5 text-xs font-mono-code text-zinc-800 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Module Mockup Preview */}
            <div className="mt-8 p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs font-mono-code text-zinc-500 pb-3 border-b border-zinc-100">
                <span className="font-bold text-zinc-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Operação Ativa &bull; 100% Personalizado
                </span>
                <span className="text-zinc-400">Banco Relacional Seguro</span>
              </div>

              {/* Dynamic Sample Mockup based on module */}
              <div className="space-y-2 text-xs font-mono-code">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-zinc-950">
                      Registro de Exemplo #00412
                    </span>
                    <div className="text-zinc-500 text-[11px] mt-0.5">
                      Atualizado automaticamente pelos gatilhos do sistema
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    Sincronizado
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-mono-code text-zinc-500">
              <span>Módulo sob medida pronto para integração com seus softwares existentes.</span>
              <span className="font-bold text-zinc-900">Branapi Sistemas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
