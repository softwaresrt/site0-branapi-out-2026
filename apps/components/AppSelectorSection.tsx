"use client";

import { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  Cpu,
  Layers,
  Globe,
  CheckCircle2,
  Bell,
  Fingerprint,
  CreditCard,
  Calendar,
  ShoppingBag,
} from "lucide-react";

type ArchType = "nativo" | "hibrido" | "pwa";

interface ArchOption {
  id: ArchType;
  label: string;
  badge: string;
  headline: string;
  summary: string;
  characteristics: string[];
  recommendedFor: string;
}

const ARCH_OPTIONS: ArchOption[] = [
  {
    id: "nativo",
    label: "App Nativo",
    badge: "Máxima Performance",
    headline: "Desenvolvimento 100% nativo em Swift (iOS) e Kotlin (Android)",
    summary:
      "Acesso irrestrito a todo o hardware do dispositivo, processamento em tempo real a 60/120 FPS e suporte nativo às últimas novidades da Apple e Google.",
    characteristics: [
      "Fluidez incomparável para animações complexas e 3D",
      "Biometria, FaceID, giroscópio, Bluetooth e NFC nativos",
      "Funcionamento robusto em segundo plano (background tasks)",
      "Homologação otimizada na App Store e Google Play",
    ],
    recommendedFor: "Apps com alta exigência de processamento, geolocalização contínua ou gráficos complexos.",
  },
  {
    id: "hibrido",
    label: "Híbrido (React Native)",
    badge: "Maior Custo-Benefício",
    headline: "Código único de alta performance para iOS e Google Play simultaneamente",
    summary:
      "A escolha adotada por 85% das empresas: uma única base de código em React Native com componentes nativos reais, reduzindo custos e acelerando o lançamento pela metade.",
    characteristics: [
      "Uma só equipe e um só repositório para iOS e Android",
      "Interface nativa indistinguível de um app 100% Swift",
      "Publicação oficial na App Store e Google Play Store",
      "Atualizações over-the-air (OTA) sem esperar aprovação das lojas",
    ],
    recommendedFor: "A imensa maioria dos apps corporativos, e-commerces, delivery e clubes de clientes.",
  },
  {
    id: "pwa",
    label: "PWA (Web App)",
    badge: "Instalação Imediata",
    headline: "Instalável direto pelo navegador sem passar pelas lojas de apps",
    summary:
      "O cliente abre o link do seu site no navegador e adiciona à tela inicial como um aplicativo real, sem ocupar memória pesada e sem taxas das lojas.",
    characteristics: [
      "Zero dependência da taxa de 30% da Apple ou Google",
      "Acesso instantâneo via link, QR Code ou WhatsApp",
      "Atualizações automáticas imediatas no backend",
      "Notificações push em Android e computadores",
    ],
    recommendedFor: "Sistemas internos de equipes, cardápios digitais e validações rápidas de mercado.",
  },
];

export default function AppSelectorSection() {
  const [selectedArch, setSelectedArch] = useState<ArchType>("hibrido");
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = ARCH_OPTIONS.find((opt) => opt.id === selectedArch) || ARCH_OPTIONS[1];

  // Mouse tilt on 3D device
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isReduced) return;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMouseTilt({ x: x * 10, y: -y * 10 });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto select-none scroll-mt-20"
      id="arquitetura"
    >
      {/* Background neon ambient highlight */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#C5FF41]/5 rounded-full blur-[170px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header - Clean Typography without Pill Capsule or Sparkles */}
      <div className="mb-16 max-w-3xl">
        <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold mb-3">
          ARQUITETURA &bull; ENGENHARIA MOBILE
        </div>

        {/* Exact Semantic H2 */}
        <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          App nativo, híbrido ou PWA?
        </h2>

        {/* Exact Subtitle Copy */}
        <p className="mt-4 text-zinc-300 font-display text-lg sm:text-xl md:text-2xl leading-relaxed">
          A gente indica o caminho certo pelo seu objetivo e orçamento, não pelo que é mais caro de fazer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive 3-Pill Selector & Detailed Analysis */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 3 Pills Selector with Sliding Morph Indicator */}
          <div className="relative p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between gap-1 backdrop-blur-xl">
            {ARCH_OPTIONS.map((opt) => {
              const isSelected = selectedArch === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedArch(opt.id)}
                  className={`relative flex-1 py-3 px-3 rounded-xl font-mono-code text-xs sm:text-sm font-semibold transition-all duration-300 z-10 flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-[#C5FF41] text-black font-bold shadow-[0_0_20px_rgba(197,255,65,0.4)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Morphing Supporting Content Card */}
          <div className="p-7 sm:p-9 rounded-3xl bg-zinc-950/90 border border-white/[0.1] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300">
            {/* Top Accent Line */}
            <div
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5FF41]/40 to-transparent"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono-code uppercase tracking-wider text-[#C5FF41] font-bold">
                {currentOption.badge}
              </span>
              <span className="text-[11px] font-mono-code text-zinc-500 uppercase">
                Análise Técnica Branapi
              </span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-white leading-snug">
              {currentOption.headline}
            </h3>

            <p className="mt-3 text-zinc-300 font-body text-sm sm:text-base leading-relaxed">
              {currentOption.summary}
            </p>

            {/* Checklist of Characteristics */}
            <div className="mt-6 space-y-2.5 pt-5 border-t border-white/[0.08]">
              {currentOption.characteristics.map((char, cIdx) => (
                <div
                  key={cIdx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm font-mono-code text-zinc-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C5FF41] shrink-0 mt-0.5" />
                  <span>{char}</span>
                </div>
              ))}
            </div>

            {/* Honest Recommendation Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono-code text-zinc-300">
              <span className="text-[#C5FF41] font-bold">Recomendado para: </span>
              <span>{currentOption.recommendedFor}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 2. CELULAR 3D CENTRAL COM TILT & PUSH SCREEN TRANSITION */}
        <div className="lg:col-span-5 flex justify-center items-center perspective-container py-6">
          <div
            className="relative w-[280px] sm:w-[310px] h-[580px] rounded-[3rem] bg-zinc-950 border-4 border-zinc-800 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(197,255,65,0.15)] p-4 flex flex-col justify-between preserve-3d transition-transform duration-150 ease-out"
            style={{
              transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
            }}
          >
            {/* Outer Rim Bevel */}
            <div className="absolute -inset-[2px] rounded-[3.1rem] border border-white/15 pointer-events-none" />

            {/* Dynamic Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full mx-auto mb-3 border border-white/10 flex items-center justify-center gap-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-zinc-800" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* SCREEN VIEWPORT WITH SLICK PUSH TRANSITION */}
            <div className="flex-1 rounded-[2rem] bg-black border border-white/10 p-4 flex flex-col justify-between overflow-hidden relative">
              {/* App Screen Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono-code">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#C5FF41] text-black font-black text-xs flex items-center justify-center">
                    B
                  </div>
                  <span className="text-white font-bold text-[11px]">Sua Marca</span>
                </div>
                <span className="text-[10px] font-mono-code text-[#C5FF41] font-bold uppercase">
                  {selectedArch}
                </span>
              </div>

              {/* Dynamic Screen Content Push based on Arch Selection */}
              <div className="my-auto space-y-3 font-mono-code">
                {selectedArch === "nativo" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-[#C5FF41]" />
                          FaceID Autenticado
                        </span>
                        <span className="text-[#C5FF41] text-[10px]">60 FPS</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Criptografia de chave privada no Secure Enclave
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#C5FF41]/10 border border-[#C5FF41]/30 text-center text-xs text-[#C5FF41] font-bold">
                      Acesso Nativo Sem Camadas
                    </div>
                  </div>
                )}

                {selectedArch === "hibrido" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 flex items-center gap-1.5">
                          <ShoppingBag className="w-4 h-4 text-[#C5FF41]" />
                          Pedido &bull; Loja 1-Clique
                        </span>
                        <span className="text-[#C5FF41] text-[10px]">Universal</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        React Native &bull; iOS App Store &bull; Google Play
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#C5FF41]/15 border border-[#C5FF41]/40 text-center text-xs text-white font-bold">
                      Publicado Simultaneamente
                    </div>
                  </div>
                )}

                {selectedArch === "pwa" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-[#C5FF41]" />
                          Web App Instalado
                        </span>
                        <span className="text-[#C5FF41] text-[10px]">Sem Loja</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Ícone na tela inicial &bull; Zero taxa de marketplace
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-center text-xs text-zinc-300 font-bold">
                      Deploy Imediato via Link
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Nav Bar of Phone */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-around text-zinc-500 text-[10px]">
                <span className="text-[#C5FF41]">Home</span>
                <span>Pedidos</span>
                <span>Perfil</span>
              </div>
            </div>

            {/* Home Indicator Bar */}
            <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
