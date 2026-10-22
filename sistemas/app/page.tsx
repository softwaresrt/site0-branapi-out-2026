import SpreadsheetHero from "../components/SpreadsheetHero";
import ThreeBenefitsSection from "../components/ThreeBenefitsSection";
import DraggableWidgetGrid from "../components/DraggableWidgetGrid";
import DashboardSidebarSection from "../components/DashboardSidebarSection";
import HonestComparisonSection from "../components/HonestComparisonSection";
import FinalCtaSection from "../components/FinalCtaSection";
import GiantFooter from "../components/GiantFooter";
import FloatingNav from "../components/FloatingNav";
import WhatsAppFloat from "../components/WhatsAppFloat";
import CustomCursor from "../components/CustomCursor";
import SmoothScroll from "../components/SmoothScroll";

export default function SistemasPage() {
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

      {/* Main Content Sections with Alternating Rhythm (Dark / White) */}
      <main id="conteudo-principal" className="relative w-full">
        {/* EFFECT 1 & 5: Hero "Planilha vira sistema" + Dot Wave Canvas (Dark #000000) */}
        <SpreadsheetHero />

        {/* EFFECT 6: 3 Benefícios Numerados com Contorno Gigante (White / Light Background) */}
        <ThreeBenefitsSection />

        {/* EFFECT 2: Dashboard de Widgets Arrastáveis (Dark #000000) */}
        <DraggableWidgetGrid />

        {/* EFFECT 3: Dashboard com Sidebar - Módulos Mais Pedidos (White / Light Background) */}
        <DashboardSidebarSection />

        {/* EFFECT 4: Tabela Comparativa Honesta com Coluna Branapi Respirando (Dark #000000) */}
        <HonestComparisonSection />

        {/* Final CTA with Pulsing Ripple Button (Dark #050505) */}
        <FinalCtaSection />
      </main>

      {/* Giant Reactive Footer */}
      <GiantFooter />
    </div>
  );
}
