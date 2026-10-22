import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import FloatingNav from "@/components/FloatingNav";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HeroSection from "@/components/HeroSection";
import ContourMarquee from "@/components/ContourMarquee";
import WhatIsInYourSite from "@/components/WhatIsInYourSite";
import SpeedComparator from "@/components/SpeedComparator";
import SiteTypesHorizontal from "@/components/SiteTypesHorizontal";
import SignalWordReveal from "@/components/SignalWordReveal";
import FinalCtaSection from "@/components/FinalCtaSection";
import GiantFooter from "@/components/GiantFooter";

export default function SitesLandingPage() {
  return (
    <SmoothScroll>
      {/* Desktop-only custom green pointer with trailing delayed ring */}
      <CustomCursor />

      {/* Floating glass pill navigation with Branapi logo & 6 ecosystem links */}
      <FloatingNav />

      {/* Floating WhatsApp pill button with specific pre-filled message */}
      <WhatsAppFloat />

      <main className="relative flex flex-col w-full bg-black text-white overflow-hidden">
        {/* 1. HERO EM CARD ARREDONDADO + SHADER DE FLUIDO + PALAVRAS GIGANTES 'SITE QUE VENDE' */}
        <HeroSection />

        {/* 3. MARQUEE EM DUAS LINHAS OPOSTAS COM INCLINAÇÃO E ACELERAÇÃO NO SCROLL */}
        <ContourMarquee />

        {/* 5. SEÇÃO 'O QUE VAI NO SEU SITE' COM MOCKUPS ANIMADOS E ACORDEÃO NO MOBILE */}
        <WhatIsInYourSite />

        {/* 6. COMPARADOR DE VELOCIDADE INTERATIVO COM SLIDER ARRASTÁVEL */}
        <SpeedComparator />

        {/* 7. 'TIPOS DE SITE': SCROLL HORIZONTAL COM PIN E 4 CARTÕES GRANDES */}
        <SiteTypesHorizontal />

        {/* 8. SINAIS DE QUE SEU SITE CUSTA VENDAS: REVELAÇÃO PALAVRA POR PALAVRA NO SCROLL */}
        <SignalWordReveal />

        {/* 4. CTA FINAL COM BOTÃO LIQUID GLASS MAGNÉTICO E LINK DO WHATSAPP */}
        <FinalCtaSection />

        {/* RODAPÉ COM A PALAVRA BRANAPI GIGANTE REATIVA AO MOUSE E LINKS DO ECOSSISTEMA */}
        <GiantFooter />
      </main>
    </SmoothScroll>
  );
}
