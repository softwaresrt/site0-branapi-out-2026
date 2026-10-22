"use client";

import { useState, useEffect, useRef } from "react";
import WordMaskHeading from "./WordMaskHeading";
import {
  Laptop,
  Smartphone,
  Zap,
  Bot,
  Network,
  CheckCircle2,
  ArrowUpRight,
  Cpu,
  Layers,
  Activity,
  Shield,
  Code2,
  Database,
  Radio,
  Sparkles,
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: typeof Laptop;
  details: string[];
  mockupSnippet: string;
  techStack: string[];
  metrics: {
    label: string;
    value: string;
    sub: string;
  }[];
  architectureSteps: {
    node: string;
    desc: string;
    status: string;
  }[];
}

const SERVICES: ServiceItem[] = [
  {
    id: "sistemas",
    title: "Sistemas web sob medida (gestão, financeiro, estoque, agendamento, CRM)",
    description:
      "Construído do zero para o fluxo operacional exclusivo da sua empresa. Sem travas, sem licenças por usuário e com total flexibilidade de regras de negócio.",
    icon: Laptop,
    details: [
      "Painéis administrativos customizados",
      "Módulos financeiros com conciliação automática",
      "Gestão de estoque em tempo real com alertas",
      "CRM com funil e automação de follow-ups",
    ],
    mockupSnippet: `export const SystemSpec = {
  ownership: "100% da sua empresa",
  licenseFees: "R$ 0,00 perpétuo",
  database: "PostgreSQL isolado (single-tenant)",
  slaUptime: "99.99% garantido em contrato"
};`,
    techStack: ["React / Next.js", "TypeScript", "Node.js / Go", "PostgreSQL", "Redis"],
    metrics: [
      { label: "Latência Média", value: "8.4ms", sub: "Rede dedicada" },
      { label: "Uptime SLA", value: "99.99%", sub: "Disponibilidade" },
      { label: "Usuários", value: "Ilimitados", sub: "Sem custo adicional" },
    ],
    architectureSteps: [
      { node: "Client UI", desc: "Painel SPA ultra-rápido Next.js", status: "Online" },
      { node: "API Core", desc: "Regras de negócio em microsserviços", status: "99.99%" },
      { node: "Database", desc: "PostgreSQL com replicação em nuvem", status: "Isolado" },
      { node: "Cache Layer", desc: "Redis in-memory para dados quentes", status: "Ativo" },
    ],
  },
  {
    id: "apps",
    title: "Aplicativos para iOS e Android",
    description:
      "Apps fluidos, modernos e integrados ao seu backend. Prontos para publicação na App Store e Google Play com notificações push e funcionamento offline.",
    icon: Smartphone,
    details: [
      "Experiência 100% responsiva e nativa",
      "Notificações inteligentes e geolocalização",
      "Biometria, FaceID e segurança criptografada",
      "Publicação e homologação nas lojas",
    ],
    mockupSnippet: `export const MobileConfig = {
  platforms: ["iOS (App Store)", "Android (Google Play)"],
  auth: "Biometria Nativa + FaceID",
  offlineMode: "Cache SQLite local sincronizado",
  pushDelivery: "99.98% entregas em < 1s"
};`,
    techStack: ["React Native", "Swift / Kotlin", "APNs / FCM", "SQLite", "Biometrics"],
    metrics: [
      { label: "Taxa de Quadros", value: "60 FPS", sub: "Fluidez nativa" },
      { label: "Crash-free", value: "99.8%", sub: "Estabilidade" },
      { label: "Offline First", value: "Ativo", sub: "Sincronia automática" },
    ],
    architectureSteps: [
      { node: "Native Bridge", desc: "Comunicação direta com hardware móvel", status: "60 FPS" },
      { node: "Push Engine", desc: "Disparos segmentados via APNs / Firebase", status: "Sub-1s" },
      { node: "Local Storage", desc: "Banco SQLite criptografado no aparelho", status: "Seguro" },
      { node: "Sync Gateway", desc: "Sincronização em segundo plano", status: "Pronto" },
    ],
  },
  {
    id: "sites",
    title: "Sites e plataformas de alta performance",
    description:
      "Páginas com carregamento instantâneo, pontuação máxima no Google PageSpeed (Core Web Vitals) e arquitetura orientada à conversão comercial.",
    icon: Zap,
    details: [
      "Export estático (SSG) e Server-Side Rendering",
      "SEO técnico completo com Schema.org",
      "Animações fluidas em 60 FPS",
      "Design de estúdio premiado sem templates",
    ],
    mockupSnippet: `export const PageSpeedScore = {
  performance: 100,
  seo: 100,
  accessibility: 100,
  bestPractices: 100,
  coreWebVitals: "LCP 0.6s · CLS 0.00 · FID 2ms"
};`,
    techStack: ["Next.js SSG", "Tailwind CSS", "GSAP / Three.js", "Edge CDN", "Schema.org"],
    metrics: [
      { label: "PageSpeed", value: "100/100", sub: "Core Web Vitals" },
      { label: "LCP", value: "0.6s", sub: "Carregamento instantâneo" },
      { label: "SEO Index", value: "100%", sub: "Arquitetura técnica" },
    ],
    architectureSteps: [
      { node: "Edge CDN", desc: "Distribuição global com TTFB < 20ms", status: "Global" },
      { node: "SSG Engine", desc: "Páginas pré-compiladas no build", status: "100/100" },
      { node: "SEO Schema", desc: "Marcação rica para Google e IAs", status: "Otimizado" },
      { node: "Micro-motion", desc: "Animações aceleradas por GPU", status: "60 FPS" },
    ],
  },
  {
    id: "automacoes",
    title: "Automações e assistentes com inteligência artificial",
    description:
      "Agentes autônomos que atendem clientes, processam documentos, sintetizam dados e eliminam tarefas manuais repetitivas da sua equipe.",
    icon: Bot,
    details: [
      "Atendimento inteligente integrado ao WhatsApp",
      "Leitura e extração de dados de notas e PDFs",
      "Triagem e classificação automática de leads",
      "Geração de relatórios operacionais em tempo real",
    ],
    mockupSnippet: `export const AIAgentPipeline = {
  channel: "WhatsApp Oficial (API Cloud)",
  processing: "OCR + LLM com RAG contextual",
  action: "Atualização automática de ERP/CRM",
  humanHandover: "Transbordo instantâneo se necessário"
};`,
    techStack: ["Python / FastAPI", "OpenAI / Claude", "Vector DB (pgvector)", "WhatsApp API", "OCR Engine"],
    metrics: [
      { label: "Tempo de Resposta", value: "1.2s", sub: "Processamento IA" },
      { label: "Acurácia OCR", value: "99.4%", sub: "Extração de dados" },
      { label: "Redução Manual", value: "-80%", sub: "Tempo de equipe" },
    ],
    architectureSteps: [
      { node: "Ingestão Omnichannel", desc: "Mensagens, áudios e PDFs recebidos", status: "24/7" },
      { node: "IA RAG Engine", desc: "Consulta na base de dados da sua empresa", status: "Contextual" },
      { node: "Validação & Regras", desc: "Garante precisão sem alucinação", status: "Seguro" },
      { node: "Disparo no ERP", desc: "Executa a ação sem intervenção humana", status: "Automático" },
    ],
  },
  {
    id: "integracoes",
    title: "Integrações entre os sistemas que você já usa",
    description:
      "Unificação de ERPs, CRMs, gateways de pagamento, plataformas legadas e ferramentas de terceiros em um fluxo contínuo e sem retrabalho.",
    icon: Network,
    details: [
      "Integração com bancos e gateways de pagamento",
      "Sincronização de notas fiscais e contabilidade",
      "Webhooks seguros com retry automático",
      "Conexão de bancos legados a interfaces modernas",
    ],
    mockupSnippet: `export const IntegrationMesh = {
  protocols: ["REST", "GraphQL", "gRPC", "Webhooks HMAC"],
  resilience: "Dead-Letter Queue + Retry exponencial",
  auditLog: "Rastreabilidade de cada transação",
  dataSync: "Birecional em tempo real"
};`,
    techStack: ["Event-Driven", "RabbitMQ / Kafka", "REST & GraphQL", "HMAC SHA-256", "Webhook Hub"],
    metrics: [
      { label: "Throughput", value: "50k/min", sub: "Capacidade de eventos" },
      { label: "Perda de Dados", value: "0%", sub: "Retry com fila morta" },
      { label: "Criptografia", value: "TLS 1.3", sub: "Padrão bancário" },
    ],
    architectureSteps: [
      { node: "Event Ingress", desc: "Captura de Webhooks e web events", status: "Ativo" },
      { node: "Message Queue", desc: "Fila tolerante a falhas com retry", status: "Sem perda" },
      { node: "Data Transformer", desc: "Padronização e conversão de schemas", status: "Validado" },
      { node: "Destination Sync", desc: "Atualização em ERPs, bancos e CRMs", status: "Concluído" },
    ],
  },
];

export default function DevelopServices() {
  const [activeTab, setActiveTab] = useState(0);
  const [inspectorView, setInspectorView] = useState<"arch" | "code" | "metrics">("arch");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Synchronize active tab with scroll position smoothly
  useEffect(() => {
    const handleScroll = () => {
      const scrollMiddle = window.scrollY + window.innerHeight * 0.45;

      for (let i = 0; i < cardRefs.current.length; i++) {
        const card = cardRefs.current[i];
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardTop = rect.top + window.scrollY;
          const cardBottom = cardTop + rect.height;

          if (scrollMiddle >= cardTop && scrollMiddle <= cardBottom) {
            setActiveTab(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentService = SERVICES[activeTab];
  const CurrentIcon = currentService.icon;

  return (
    <section
      id="desenvolvemos"
      className="relative w-full py-28 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Background neon ambient highlight */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#C5FF41]/5 rounded-full blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-16 md:mb-20">
        <WordMaskHeading
          roman="II"
          badge="Escopo sob demanda"
          text="O que a gente desenvolve"
          as="h2"
          className="text-3xl md:text-5xl lg:text-6xl text-white font-bold"
        />
        <p className="mt-4 text-zinc-400 font-body text-base md:text-lg max-w-2xl">
          Arquitetura robusta, código proprietário e engenharia de ponta a ponta. Soluções concebidas para sustentar o crescimento contínuo da sua empresa.
        </p>
      </div>

      {/* Services Grid with Rich Content on Both Sides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Clean Service Cards without number/category tags */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const isSelected = activeTab === index;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => setActiveTab(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveTab(index);
                  }
                }}
                className={`group p-6 md:p-8 rounded-3xl transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                  isSelected
                    ? "bg-zinc-950/90 border-[#C5FF41]/50 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(197,255,65,0.14)]"
                    : "bg-black/50 hover:bg-zinc-950/60 border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Active glow accent bar */}
                {isSelected && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C5FF41] shadow-[0_0_14px_#C5FF41]"
                    aria-hidden="true"
                  />
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isSelected
                        ? "bg-[#C5FF41] text-black shadow-[0_0_20px_rgba(197,255,65,0.5)] scale-105"
                        : "bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl md:text-2xl text-white leading-tight">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-zinc-300 font-body text-sm md:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Sub-items check list */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-white/[0.08]">
                  {service.details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-center gap-2.5 text-xs md:text-sm font-mono-code text-zinc-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C5FF41] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Rich Interactive Live Engineering Panel (Sticky throughout scroll) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-5">
          {/* Main Interactive Inspector Window */}
          <div className="p-6 md:p-7 rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden">
            {/* Top Chrome Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-[#C5FF41]" />
                <span className="ml-2 text-[11px] font-mono-code text-zinc-400">
                  branapi :: {currentService.id}.spec
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5FF41] animate-pulse" />
                <span className="text-[10px] font-mono-code text-[#C5FF41] font-bold tracking-wider uppercase">
                  AO VIVO
                </span>
              </div>
            </div>

            {/* View Selector Tabs */}
            <div className="flex items-center gap-2 mt-4 p-1 rounded-xl bg-black/60 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setInspectorView("arch")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono-code flex items-center justify-center gap-1.5 transition-all ${
                  inspectorView === "arch"
                    ? "bg-[#C5FF41] text-black font-bold shadow-[0_0_12px_rgba(197,255,65,0.3)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Arquitetura</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorView("metrics")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono-code flex items-center justify-center gap-1.5 transition-all ${
                  inspectorView === "metrics"
                    ? "bg-[#C5FF41] text-black font-bold shadow-[0_0_12px_rgba(197,255,65,0.3)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Métricas</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorView("code")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono-code flex items-center justify-center gap-1.5 transition-all ${
                  inspectorView === "code"
                    ? "bg-[#C5FF41] text-black font-bold shadow-[0_0_12px_rgba(197,255,65,0.3)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Código</span>
              </button>
            </div>

            {/* Dynamic View Content */}
            <div className="mt-5 min-h-[220px]">
              {/* TAB 1: ARCHITECTURE FLOW */}
              {inspectorView === "arch" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono-code text-zinc-400 mb-3">
                    <span className="flex items-center gap-1.5 text-zinc-200">
                      <CurrentIcon className="w-4 h-4 text-[#C5FF41]" />
                      Camadas Técnicas
                    </span>
                    <span className="text-[11px] text-[#C5FF41]">Tolerância a Falhas</span>
                  </div>

                  {currentService.architectureSteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-black/60 border border-white/[0.08] hover:border-[#C5FF41]/30 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#C5FF41]/10 text-[#C5FF41] border border-[#C5FF41]/30 font-mono-code text-[11px] flex items-center justify-center font-bold shrink-0">
                          0{sIdx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-mono-code font-bold text-white">
                            {step.node}
                          </div>
                          <div className="text-[11px] text-zinc-400">{step.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-[#C5FF41]/10 border border-[#C5FF41]/30 text-[#C5FF41] font-semibold shrink-0">
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: LIVE METRICS */}
              {inspectorView === "metrics" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-2.5">
                    {currentService.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-2xl bg-black/60 border border-white/[0.08] text-center"
                      >
                        <div className="text-[10px] font-mono-code text-zinc-400 uppercase">
                          {m.label}
                        </div>
                        <div className="text-lg md:text-xl font-mono-code font-bold text-[#C5FF41] my-1">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2 text-xs font-mono-code">
                    <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/[0.06]">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <Radio className="w-3.5 h-3.5 text-[#C5FF41]" />
                        Status de Monitoramento
                      </span>
                      <span className="text-[#C5FF41]">Telemetria Contínua</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Tempo de resposta no Brasil:</span>
                      <span className="text-white font-bold">&lt; 15ms</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Custo de licença recorrente:</span>
                      <span className="text-[#C5FF41] font-bold">Zero (R$ 0,00)</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Acesso ao repositório Git:</span>
                      <span className="text-white font-bold">Total do Cliente</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CODE & SPECS */}
              {inspectorView === "code" && (
                <div className="font-mono-code text-xs space-y-3 animate-in fade-in duration-200">
                  <div className="text-zinc-400 text-[11px]">
                    // Arquitetura e tipagem estrita TypeScript
                  </div>
                  <pre className="p-3.5 rounded-xl bg-black/80 border border-white/[0.08] text-[11px] text-[#C5FF41] overflow-x-auto leading-relaxed">
                    <code>{currentService.mockupSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Tech Stack Chips */}
            <div className="mt-5 pt-4 border-t border-white/[0.08]">
              <div className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-[#C5FF41]" />
                <span>Tecnologias Utilizadas:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentService.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono-code text-zinc-300 hover:border-[#C5FF41]/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA link */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#C5FF41]/10 border border-[#C5FF41]/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono-code text-zinc-400 uppercase">
                  Escopo Customizado
                </div>
                <div className="text-xs md:text-sm font-display font-semibold text-white">
                  Orçamento detalhado por escrito
                </div>
              </div>
              <a
                href="#cta-final"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C5FF41] text-black font-mono-code font-bold text-xs hover:bg-[#d6ff6a] transition-all shadow-[0_0_15px_rgba(197,255,65,0.4)]"
              >
                <span>Pedir</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Secondary Persistent Engineering Card (Ensures no dead space on right side) */}
          <div className="p-6 rounded-3xl bg-zinc-950/80 backdrop-blur-xl border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#C5FF41]" />
              <span className="font-mono-code text-xs uppercase tracking-wider text-white font-bold">
                Padrão de Engenharia Branapi
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 text-xs text-zinc-400 font-mono-code">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41]" />
                <span>Repositório Git com versionamento completo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41]" />
                <span>Ambiente de homologação online para testes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41]" />
                <span>30 dias de suporte direto com os desenvolvedores</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
