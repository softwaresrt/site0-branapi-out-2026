import AsciiHero from "../components/AsciiHero";
import AutomationFlowSection from "../components/AutomationFlowSection";
import InteractiveChatAndCalculatorSection from "../components/InteractiveChatAndCalculatorSection";
import HowWeStartSection from "../components/HowWeStartSection";
import FinalCtaSection from "../components/FinalCtaSection";
import GiantFooter from "../components/GiantFooter";
import FloatingNav from "../components/FloatingNav";
import WhatsAppFloat from "../components/WhatsAppFloat";
import CustomCursor from "../components/CustomCursor";
import SmoothScroll from "../components/SmoothScroll";

export default function AutomacaoPage() {
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

      {/* Main Content Sections with Alternating Rhythm */}
      <main id="conteudo-principal" className="relative w-full">
        {/* EFFECT 1 & 6: Hero com Shader ASCII / Tipos + Título Decodificado (Dark #000000) */}
        <AsciiHero />

        {/* EFFECT 2 & 3: Campo de Limalha Magnético + Fluxo de Automação de Nós Elásticos (Dark Tech #08080a) */}
        <AutomationFlowSection />

        {/* EFFECT 4 & 5: Demo de Chat WhatsApp + Calculadora Simples de Horas (White / Light Background) */}
        <InteractiveChatAndCalculatorSection />

        {/* H2: Como a gente começa (Dark Tech #000000) */}
        <HowWeStartSection />

        {/* Final CTA with Pulsing Ripple Button (Dark #050505) */}
        <FinalCtaSection />
      </main>

      {/* Giant Reactive Footer */}
      <GiantFooter />
    </div>
  );
}
