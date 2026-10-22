"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: "Software", href: "https://software.branapi.com/" },
  { name: "Sites", href: "https://sites.branapi.com/" },
  { name: "Apps", href: "https://apps.branapi.com/" },
  { name: "Sistemas", href: "https://sistemas.branapi.com/", current: true },
  { name: "Automação", href: "https://automacao.branapi.com/" },
  { name: "MVP", href: "https://mvp.branapi.com/" },
];

export default function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phone = "5562981580707";
  const defaultMsg = "Oi, quero desenhar um sistema para a minha empresa";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <>
      <header
        className={`fixed top-4 inset-x-0 z-50 flex items-center justify-center px-4 transition-all duration-300 pointer-events-none ${
          isScrolled ? "-translate-y-1 sm:translate-y-0" : "translate-y-0"
        }`}
      >
        <nav
          aria-label="Navegação Principal"
          className="pointer-events-auto flex items-center justify-between gap-3 md:gap-6 px-4 md:px-6 py-2.5 rounded-full bg-zinc-950/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(197,255,65,0.06)]"
        >
          {/* Logo */}
          <a
            href="https://branapi.com"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            title="Branapi Ecossistema"
          >
            <div className="relative w-24 md:w-28 h-6 flex items-center">
              <Image
                src="/branapi-wordmark.png"
                alt="Branapi"
                width={120}
                height={28}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
          </a>

          {/* Divider */}
          <div className="hidden lg:block w-[1px] h-4 bg-white/10" aria-hidden="true" />

          {/* Desktop Links for 6 Pages */}
          <div className="hidden lg:flex items-center gap-1 font-mono-code text-xs">
            {NAV_ITEMS.map((item) => {
              if (item.current) {
                return (
                  <span
                    key={item.name}
                    aria-current="page"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5FF41]/15 text-[#C5FF41] border border-[#C5FF41]/30 font-semibold shadow-[0_0_12px_rgba(197,255,65,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] animate-pulse" />
                    <span>{item.name}</span>
                  </span>
                );
              }
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-3 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C5FF41] text-black font-mono-code text-xs md:text-sm font-bold hover:bg-[#d6ff6a] hover:shadow-[0_0_20px_rgba(197,255,65,0.5)] transition-all transform hover:scale-[1.02]"
            >
              <span>Orçamento grátis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="lg:hidden p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/90 backdrop-blur-3xl pt-28 px-6 pb-8 flex flex-col justify-between">
          <div className="space-y-3 font-mono-code">
            <div className="text-xs uppercase tracking-widest text-[#C5FF41] font-bold mb-4">
              Páginas do Ecossistema
            </div>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-2xl border text-sm transition-all ${
                  item.current
                    ? "bg-[#C5FF41]/10 border-[#C5FF41]/40 text-[#C5FF41] font-bold"
                    : "bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.06]"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-[#C5FF41] text-black font-display font-bold text-center block text-sm shadow-[0_0_25px_rgba(197,255,65,0.4)]"
            >
              Pedir Orçamento Grátis
            </a>
          </div>
        </div>
      )}
    </>
  );
}
