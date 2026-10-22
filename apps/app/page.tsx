import PerspectiveTunnelHero from "../components/PerspectiveTunnelHero";
import GlassFoldersSection from "../components/GlassFoldersSection";
import AppSelectorSection from "../components/AppSelectorSection";
import IncludedScopeSection from "../components/IncludedScopeSection";
import FinalCtaSection from "../components/FinalCtaSection";
import GiantFooter from "../components/GiantFooter";
import FloatingNav from "../components/FloatingNav";
import WhatsAppFloat from "../components/WhatsAppFloat";
import CustomCursor from "../components/CustomCursor";
import SmoothScroll from "../components/SmoothScroll";

export default function AppsPage() {
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

      {/* Main Content Sections */}
      <main id="conteudo-principal" className="relative w-full">
        {/* EFFECT 1: Hero Perspective Tunnel (Dark) */}
        <PerspectiveTunnelHero />

        {/* EFFECT 3: Glass Folders "Para quem faz sentido" (White/Light Background) */}
        <GlassFoldersSection />

        {/* EFFECT 2 & 6: 3D Phone + Nativo/Híbrido/PWA Selector (Dark) */}
        <AppSelectorSection />

        {/* EFFECT 4 & 5: 3D Glare Cards + Self-Drawing Checklist "O que está incluso" (White/Light Background) */}
        <IncludedScopeSection />

        {/* EFFECT 7: Final CTA with Pulsing Ripple Button (Dark) */}
        <FinalCtaSection />
      </main>

      {/* Giant Reactive Footer */}
      <GiantFooter />
    </div>
  );
}
