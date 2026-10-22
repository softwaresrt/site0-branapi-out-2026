"use client";

import {
  Building2,
  Rocket,
  ShoppingCart,
  CalendarCheck,
  ArrowUpRight,
  Shield,
  CreditCard,
  Lock,
} from "lucide-react";

interface SiteTypeCard {
  id: string;
  num: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  ctaText: string;
  icon: typeof Building2;
}

const CARDS: SiteTypeCard[] = [
  {
    id: "institucional",
    num: "01",
    category: "AUTORIDADE DE MARCA",
    title: "Institucional",
    description:
      "Apresentação de alto padrão para posicionar sua empresa como referência no mercado. Transmita solidez, credibilidade e porte corporativo.",
    highlights: [
      "Apresentação da empresa, equipe e diferenciais",
      "Páginas de serviços detalhadas para ranquear no Google",
      "Depoimentos, cases de sucesso e provas sociais",
      "Design autoral sem modelos prontos",
    ],
    ctaText: "Pedir site institucional",
    icon: Building2,
  },
  {
    id: "landing-page",
    num: "02",
    category: "CONVERSÃO DE TRÁFEGO PAGO",
    title: "Landing page de campanha",
    description:
      "Páginas focadas em uma única ação comercial: captar leads e vender. Otimizadas para campanhas de Google Ads e Meta Ads.",
    highlights: [
      "Copy persuasiva orientada à dor do cliente",
      "Carregamento sub-segundo para não perder cliques caros",
      "Formulário rápido integrado ao WhatsApp e CRM",
      "Testes de conversão e tracking completo",
    ],
    ctaText: "Pedir landing page de alta conversão",
    icon: Rocket,
  },
  {
    id: "ecommerce",
    num: "03",
    category: "VENDAS ONLINE SEM FRICÇÃO",
    title: "E-commerce e loja virtual",
    description:
      "Sua vitrine digital aberta 24 horas por dia. Navegação fluida, cálculo de frete automático, checkout transparente e Pix instantâneo.",
    highlights: [
      "Catálogo de produtos com busca inteligente e filtros",
      "Checkout otimizado para evitar abandono de carrinho",
      "Integração com gateways de pagamento e frete",
      "Painel de gestão de pedidos e estoque",
    ],
    ctaText: "Pedir e-commerce profissional",
    icon: ShoppingCart,
  },
  {
    id: "area-cliente",
    num: "04",
    category: "PORTAL INTERATIVO & SERVIÇOS",
    title: "Site com área de cliente ou agendamento",
    description:
      "Uma plataforma onde seus clientes realizam agendamentos, acessam documentos, pagam faturas e acompanham pedidos com login seguro.",
    highlights: [
      "Área logada com segurança e autenticação",
      "Agendamento automático sincronizado com calendário",
      "Download de contratos, laudos ou notas fiscais",
      "Redução drástica do atendimento manual da sua equipe",
    ],
    ctaText: "Pedir site com área de cliente",
    icon: CalendarCheck,
  },
];

export default function SiteTypesHorizontal() {
  const phone = "5562981580707";
  const defaultMsg = "Oi, quero uma proposta de site com layout de exemplo";

  return (
    <section
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto select-none scroll-mt-20"
      id="tipos-de-site"
    >
      {/* Background neon ambient highlight */}
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#C5FF41]/5 rounded-full blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header - Clean typography without pill capsule or sparkles */}
      <div className="mb-16 max-w-4xl">
        <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold mb-3">
          SOLUÇÕES SOB MEDIDA
        </div>

        {/* Exact Semantic H2 */}
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          Tipos de site que fazemos
        </h2>

        {/* Exact Subtitle Copy */}
        <p className="mt-4 text-zinc-300 font-display text-lg sm:text-xl md:text-2xl leading-relaxed">
          Institucional, landing page de campanha, e-commerce e loja virtual, site com área de cliente ou agendamento.
        </p>
      </div>

      {/* 2x2 Expansive Responsive Grid - Eliminates any pin overlap bug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
            `${defaultMsg} (Foco: ${card.title})`
          )}`;

          return (
            <div
              key={card.id}
              className="p-7 sm:p-9 rounded-3xl bg-zinc-950/90 border border-white/[0.1] hover:border-[#C5FF41]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5FF41]/40 to-transparent group-hover:via-[#C5FF41] transition-all"
                aria-hidden="true"
              />

              {/* Giant Outline Number Behind Card */}
              <div
                aria-hidden="true"
                className="absolute right-4 -bottom-4 font-display font-black text-[120px] sm:text-[140px] leading-none stroke-text-green opacity-15 group-hover:opacity-30 pointer-events-none select-none transition-opacity"
              >
                {card.num}
              </div>

              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5FF41]/15 border border-[#C5FF41]/30 flex items-center justify-center text-[#C5FF41] shadow-[0_0_15px_rgba(197,255,65,0.25)] group-hover:scale-105 transition-transform shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#C5FF41]">
                      {card.category}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-white mt-0.5">
                      {card.title}
                    </h3>
                  </div>
                </div>

                <p className="text-zinc-300 font-body text-sm sm:text-base leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                  {card.highlights.map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-mono-code text-zinc-300"
                    >
                      <span className="text-[#C5FF41] font-bold mt-0.5">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini-Animation Box */}
              <div className="my-6 p-3.5 rounded-2xl bg-black/60 border border-white/[0.08]">
                <CardMiniAnimation type={card.id} />
              </div>

              {/* Bottom Action Link */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono-code font-bold text-white group-hover:text-[#C5FF41] transition-colors"
                >
                  <span>{card.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C5FF41]" />
                </a>

                <span className="text-[11px] font-mono-code text-zinc-500">
                  Sob Medida
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CardMiniAnimation({ type }: { type: string }) {
  if (type === "institucional") {
    return (
      <div className="flex items-center justify-between text-xs font-mono-code">
        <div className="flex items-center gap-2 text-zinc-300">
          <Shield className="w-4 h-4 text-[#C5FF41]" />
          <span>Autoridade Máxima</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C5FF41] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        <span className="text-[11px] text-[#C5FF41]">Design Autoral</span>
      </div>
    );
  }

  if (type === "landing-page") {
    return (
      <div className="space-y-1.5 font-mono-code text-xs">
        <div className="flex justify-between text-zinc-400 text-[11px]">
          <span>Funil Comercial de Conversão</span>
          <span className="text-[#C5FF41] font-bold">Alta Conversão</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-white via-[#C5FF41] to-[#C5FF41] rounded-full w-4/5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === "ecommerce") {
    return (
      <div className="flex items-center justify-between text-xs font-mono-code">
        <div className="flex items-center gap-2 text-zinc-300">
          <CreditCard className="w-4 h-4 text-[#C5FF41]" />
          <span>Checkout em 1 Clique</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#C5FF41]/15 text-[#C5FF41] text-[10px] font-bold">
          Pix Instantâneo
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-xs font-mono-code">
      <div className="flex items-center gap-2 text-zinc-300">
        <Lock className="w-4 h-4 text-[#C5FF41]" />
        <span>Área Restrita do Cliente</span>
      </div>
      <span className="text-[11px] text-[#C5FF41]">Autenticação 2FA</span>
    </div>
  );
}
