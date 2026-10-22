"use client";

import { useState } from "react";
import { Plus, Users, Briefcase, Zap, Store } from "lucide-react";

interface FolderItem {
  id: string;
  num: string;
  title: string;
  summary: string;
  details: string[];
  icon: typeof Users;
  category: string;
}

const FOLDERS: FolderItem[] = [
  {
    id: "recorrentes",
    num: "01",
    category: "FIDELIZAÇÃO & RECORRÊNCIA",
    title: "Empresas com clientes recorrentes (clínicas, academias, delivery, serviços)",
    summary:
      "Seus clientes compram ou agendam todo mês? Um app próprio coloca sua marca a 1 toque de distância na tela inicial, eliminando concorrência.",
    details: [
      "Notificações push diretas sem taxa por disparo",
      "Agendamento automático 24/7 sem recepcionista ocupada",
      "Clube de assinatura e fidelidade com pontos",
      "Histórico de atendimentos e exames na palma da mão",
    ],
    icon: Users,
  },
  {
    id: "campo",
    num: "02",
    category: "PRODUTIVIDADE OPERACIONAL",
    title: "Operações com equipe em campo que precisa registrar tudo pelo celular",
    summary:
      "Técnicos, inspetores, vendedores externos e motoristas. Elimine planilhas de papel e cadastre dados em tempo real mesmo sem sinal de internet.",
    details: [
      "Funcionamento 100% offline com sincronização automática",
      "Checklist com fotos geolocalizadas e assinatura digital",
      "Rotas otimizadas e comunicação com central",
      "Controle de estoque de peças em viaturas",
    ],
    icon: Briefcase,
  },
  {
    id: "startups",
    num: "03",
    category: "INOVAÇÃO & ESCALA",
    title: "Startups validando uma ideia com usuários reais",
    summary:
      "Construa seu MVP mobile com engenharia sólida, publique nas lojas oficiais e colete métricas comportamentais reais para atrair rodadas de investimento.",
    details: [
      "Ciclos rápidos de prototipação e validação",
      "Arquitetura escalável pronta para receber milhares de usuários",
      "Integração com analytics avançado e telemetria de uso",
      "Código proprietário 100% entregue à sua empresa",
    ],
    icon: Zap,
  },
  {
    id: "marketplaces",
    num: "04",
    category: "CANAL PROPRIETÁRIO & MARGEM",
    title: "Negócios que querem sair de marketplace e ter o próprio canal",
    summary:
      "Pare de pagar comissões abusivas de 15% a 30% a cada venda. Seja o dono do seu canal de relacionamento, da base de dados e do seu faturamento.",
    details: [
      "Zero comissão sobre vendas ou entregas",
      "Base de clientes e dados 100% sua (LGPD compliant)",
      "Checkout sem atrito com Pix e cartões salvos",
      "Comunicação direta sem intermediários ou bloqueios",
    ],
    icon: Store,
  },
];

export default function GlassFoldersSection() {
  const [openId, setOpenId] = useState<string | null>(FOLDERS[0].id);

  const toggleFolder = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="para-quem"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-zinc-50 text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Clean Typography without Pill Capsule or Sparkles */}
        <div className="mb-16 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
            PÚBLICO-ALVO &bull; MODELOS DE NEGÓCIO
          </div>

          {/* Exact Semantic H2 */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            Para quem faz sentido
          </h2>

          <p className="mt-4 text-zinc-600 font-body text-base md:text-lg leading-relaxed">
            Se o seu modelo de negócio se encaixa em um destes quatro cenários, ter um aplicativo próprio é o salto que multiplica retenção, margem e autoridade.
          </p>
        </div>

        {/* 4 Glass Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {FOLDERS.map((folder) => {
            const Icon = folder.icon;
            const isOpen = openId === folder.id;

            return (
              <div
                key={folder.id}
                onClick={() => toggleFolder(folder.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleFolder(folder.id);
                  }
                }}
                className="group relative cursor-pointer outline-none transition-transform duration-300 hover:-translate-y-1"
              >
                {/* BACK FOLDER (Metallic/Light Gradient Plate) */}
                <div className="relative rounded-[2rem] p-7 sm:p-9 glass-folder-back-light min-h-[320px] sm:min-h-[360px] flex flex-col justify-between overflow-hidden">
                  {/* Folder Tab at Top Left */}
                  <div className="absolute top-0 left-8 px-5 py-1.5 rounded-b-xl bg-white/90 border-x border-b border-zinc-200/80 text-[11px] font-mono-code font-bold uppercase tracking-wider text-zinc-600 shadow-sm">
                    {folder.num} &bull; {folder.category}
                  </div>

                  {/* Corner '+' Button that Rotates Smoothly on Open */}
                  <div className="absolute top-6 right-6 z-30">
                    <button
                      type="button"
                      aria-label={isOpen ? "Fechar pasta" : "Abrir pasta"}
                      className={`w-9 h-9 rounded-full bg-black text-white flex items-center justify-center transition-all duration-300 shadow-md ${
                        isOpen
                          ? "rotate-45 bg-[#C5FF41] text-black shadow-[0_0_15px_rgba(197,255,65,0.5)]"
                          : "group-hover:scale-110"
                      }`}
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Title & Category on the Folder Body */}
                  <div className="pt-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-black text-[#C5FF41] flex items-center justify-center shadow-sm shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-zinc-950 leading-snug">
                        {folder.title}
                      </h3>
                    </div>

                    <p className="text-zinc-600 font-body text-sm sm:text-base leading-relaxed">
                      {folder.summary}
                    </p>
                  </div>

                  {/* SLIDING INNER CARD (Slides up and expands when open) */}
                  <div
                    className={`transition-all duration-500 ease-out overflow-hidden ${
                      isOpen
                        ? "max-h-[400px] opacity-100 mt-6 pt-5 border-t border-zinc-200"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2.5">
                      <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-zinc-900 mb-2">
                        Oportunidades em Aplicativo:
                      </div>
                      {folder.details.map((detail, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm font-mono-code text-zinc-700"
                        >
                          <span className="text-black font-black mt-0.5">&bull;</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FRONT FOLDER LIP (Frosted Glass Effect at Bottom) */}
                  <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs font-mono-code text-zinc-500">
                    <span className="font-semibold text-zinc-800">
                      {isOpen ? "Clique para recolher pasta" : "Clique ou toque para abrir detalhes"}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-black font-bold">
                      Branapi Apps
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
