import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import FloatingNav from "@/components/FloatingNav";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RomanSideNav from "@/components/RomanSideNav";
import HeroSection from "@/components/HeroSection";
import SparkContactEffect from "@/components/SparkContactEffect";
import XRayTransition from "@/components/XRayTransition";
import DevelopServices from "@/components/DevelopServices";
import StickyProcessStack from "@/components/StickyProcessStack";
import CostComparison from "@/components/CostComparison";
import FaqTransition from "@/components/FaqTransition";
import FaqSection from "@/components/FaqSection";
import FinalCta from "@/components/FinalCta";
import GiantFooter from "@/components/GiantFooter";

export default function SoftwareHousePage() {
  return (
    <SmoothScroll>
      {/* Desktop-only custom cursor */}
      <CustomCursor />

      {/* Floating Pill Nav with 6 ecosystem links and Branapi logo */}
      <FloatingNav />

      {/* Floating WhatsApp pill button */}
      <WhatsAppFloat />

      {/* Roman Index Side Nav (I to VI) with scroll-spy */}
      <RomanSideNav />

      <main className="relative flex flex-col w-full bg-black text-white overflow-hidden">
        {/* SEÇÃO I: HERO COM 3 PROFUNDIDADES, 3D WIREFRAME E H1 */}
        <HeroSection />

        {/* EFEITO FAÍSCA: CONVERGÊNCIA DE NÓS (EMPRESA + SISTEMA) E EXPLOSÃO DE PARTÍCULAS */}
        <SparkContactEffect />

        {/* EFEITO RAIO-X: TRANSIÇÃO SHADER EM CONTORNOS NEON GREEN E POEIRA BRILHANTE */}
        <XRayTransition />

        {/* SEÇÃO II: O QUE A GENTE DESENVOLVE */}
        <DevelopServices />

        {/* SEÇÃO III: COMO FUNCIONA (5 ETAPAS EM CARTÕES EMPILHADOS COM NÚMEROS GIGANTES) */}
        <StickyProcessStack />

        {/* SEÇÃO IV: POR QUE O SISTEMA PRÓPRIO SAI MAIS BARATO (COMPARATIVO E CONTADOR SUBINDO) */}
        <CostComparison />

        {/* EFEITO DE TRANSIÇÃO FLUXO SINÁPTICO // MATRIX ANTES DO FAQ */}
        <FaqTransition />

        {/* SEÇÃO V: PERGUNTAS FREQUENTES */}
        <FaqSection />

        {/* SEÇÃO VI: CTA FINAL */}
        <FinalCta />

        {/* RODAPÉ COM BRANAPI GIGANTE REATIVO AO MOUSE E LINKS DO ECOSSISTEMA */}
        <GiantFooter />
      </main>
    </SmoothScroll>
  );
}
