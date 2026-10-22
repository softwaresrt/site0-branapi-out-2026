import NebulosaHero from "../components/NebulosaHero";
import FoundersWorkSection from "../components/FoundersWorkSection";
import InteractiveGlobeSection from "../components/InteractiveGlobeSection";
import TimelineSection from "../components/TimelineSection";
import PortfolioCasesSection from "../components/PortfolioCasesSection";
import ThreeLinesCtaSection from "../components/ThreeLinesCtaSection";
import GiantFooter from "../components/GiantFooter";
import FloatingNav from "../components/FloatingNav";
import WhatsAppFloat from "../components/WhatsAppFloat";
import CustomCursor from "../components/CustomCursor";
import SmoothScroll from "../components/SmoothScroll";

export default function MvpPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#C5FF41] selection:text-black">
      {/* Smooth scroll provider */}
      <SmoothScroll />

      {/* Desktop custom cursor (disabled on touch) */}
      <CustomCursor />

      {/* Floating navigation pill */}
      <FloatingNav />

      {/* Direct circular WhatsApp floating button */}
      <WhatsAppFloat />

      {/* Main Content Sections with Alternating Rhythm (Dark / White / Dark Tech) */}
      <main id="conteudo-principal" className="relative w-full">
        {/* EFFECT 1: Hero com Fundo Nebulosa (Dithering) + Palavra Decorativa "MVP" em Cromo Líquido (Dark #000000) */}
        <NebulosaHero />

        {/* EFFECT 5 & 6: Como a gente trabalha com founders + Cadeado animado (White / Light Background) */}
        <FoundersWorkSection />

        {/* EFFECT 2: Globo Cobe Interativo com Arcos e Cidades Brasileiras (Dark #000000) */}
        <InteractiveGlobeSection />

        {/* EFFECT 3: Linha do Tempo "Da Ideia ao MVP" Horizontal/Vertical (Dark Tech #08080a) */}
        <TimelineSection />

        {/* H2: Já construímos - Plataformas, SaaS, Gateways, Marketplaces (White / Light Background) */}
        <PortfolioCasesSection />

        {/* EFFECT 4 & CTA: "Ideia em 3 Linhas" com Textarea, Contador e Botão WhatsApp (Dark #050505) */}
        <ThreeLinesCtaSection />
      </main>

      {/* Giant Reactive Footer */}
      <GiantFooter />
    </div>
  );
}
