"use client";

import { useEffect, useRef, useState } from "react";
import {
  Smartphone,
  Layers,
  Monitor,
  Network,
  UploadCloud,
  FileCode,
} from "lucide-react";

interface ScopeItem {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: typeof Smartphone;
  deliverable: string;
}

const SCOPE_ITEMS: ScopeItem[] = [
  {
    id: "design",
    num: "01",
    title: "Design de telas aprovado por você",
    description:
      "Protótipo interativo completo no Figma com todas as telas, botões e jornadas validados com sua equipe antes de programar.",
    icon: Smartphone,
    deliverable: "Protótipo navegável em alta fidelidade",
  },
  {
    id: "dev",
    num: "02",
    title: "Desenvolvimento iOS e Android",
    description:
      "Arquitetura moderna e código limpo garantindo compatibilidade, fluidez em 60 FPS e funcionamento estável em todos os modelos de celular.",
    icon: Layers,
    deliverable: "Aplicativo compilado para Apple e Google",
  },
  {
    id: "painel",
    num: "03",
    title: "Painel administrativo web",
    description:
      "Dashboard no navegador para você e sua equipe gerenciarem clientes, relatórios, disparos de push e dados operacionais com segurança.",
    icon: Monitor,
    deliverable: "Painel administrativo web com controle de acessos",
  },
  {
    id: "integracoes",
    num: "04",
    title: "Integrações (pagamento, notificações, APIs)",
    description:
      "Conexão do app com Pix automático, cartões de crédito, disparos de notificações inteligentes, ERPs e serviços de terceiros.",
    icon: Network,
    deliverable: "Gateways, push notifications e APIs conectadas",
  },
  {
    id: "publicacao",
    num: "05",
    title: "Publicação nas lojas",
    description:
      "Homologação ponta a ponta: preparamos certificados, capturas de tela e cuidamos do processo burocrático até o app estar ativo na App Store e Play Store.",
    icon: UploadCloud,
    deliverable: "App no ar na App Store e Google Play",
  },
  {
    id: "documentacao",
    num: "06",
    title: "Documentação completa",
    description:
      "Código-fonte 100% da sua empresa após quitação, manuais operacionais claros e 30 dias de suporte com acesso direto aos engenheiros.",
    icon: FileCode,
    deliverable: "Repositório Git, documentação técnica e suporte",
  },
];

export default function IncludedScopeSection() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  // Self-marking checklist triggered when entering viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            SCOPE_ITEMS.forEach((item, index) => {
              setTimeout(() => {
                setCheckedItems((prev) => ({ ...prev, [item.id]: true }));
              }, index * 220); // Sequential checkmark draw
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="o-que-esta-incluso"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-8 bg-white text-zinc-950 border-y border-zinc-200 select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - Clean Typography without Pill Capsule or Sparkles */}
        <div className="mb-16 max-w-3xl">
          <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-zinc-500 font-bold mb-3">
            ESCOPO COMPLETO DE ENTREGA
          </div>

          {/* Exact Semantic H2 */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
            O que está incluso
          </h2>

          <p className="mt-4 text-zinc-600 font-body text-base md:text-lg leading-relaxed">
            Design de telas aprovado por você, desenvolvimento iOS e Android, painel administrativo web, integrações (pagamento, notificações, APIs), publicação nas lojas e documentação completa.
          </p>
        </div>

        {/* 6 3D Tilt & Glare Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {SCOPE_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <TiltGlareCard key={item.id} item={item} isChecked={isChecked} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 4. CARDS 3D COM TILT E REFLEXO (GLARE) QUE SEGUE O CURSOR
function TiltGlareCard({ item, isChecked }: { item: ScopeItem; isChecked: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const Icon = item.icon;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 8;

    setTilt({ x: rotX, y: rotY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="perspective-container h-full"
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        className="relative h-full p-7 sm:p-8 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-200 ease-out flex flex-col justify-between overflow-hidden preserve-3d group"
      >
        {/* Holographic Glare Overlay following cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(280px circle at ${glare.x}% ${glare.y}%, rgba(197, 255, 65, 0.45), transparent 75%)`,
          }}
          aria-hidden="true"
        />

        <div>
          {/* Header Row: Number + Icon + Animated Checkmark */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-[#C5FF41] flex items-center justify-center shadow-sm shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-zinc-500">
                Item {item.num}
              </span>
            </div>

            {/* 5. CHECKLIST ANIMADO QUE SE MARCA SOZINHO COM TRAÇO VERDE */}
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  className="stroke-zinc-300"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  className={`stroke-[#16a34a] transition-all duration-500 ${
                    isChecked ? "opacity-100" : "opacity-0"
                  }`}
                  strokeWidth="2"
                  strokeDasharray="63"
                  strokeDashoffset={isChecked ? "0" : "63"}
                />
                <path
                  d="M7.5 12L10.5 15L16.5 9"
                  className={`stroke-[#16a34a] transition-all duration-500 delay-100 ${
                    isChecked ? "opacity-100" : "opacity-0"
                  }`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="20"
                  strokeDashoffset={isChecked ? "0" : "20"}
                />
              </svg>
            </div>
          </div>

          <h3 className="font-display font-bold text-xl text-zinc-950 leading-snug">
            {item.title}
          </h3>

          <p className="mt-3 text-zinc-600 font-body text-sm leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Deliverable Box */}
        <div className="mt-6 pt-4 border-t border-zinc-200 text-xs font-mono-code text-zinc-700 flex items-center gap-2">
          <span className="font-bold text-black">&bull; Entrega:</span>
          <span className="truncate">{item.deliverable}</span>
        </div>
      </div>
    </div>
  );
}
