"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X, Smartphone } from "lucide-react";

const NAV_LINKS = [
  { name: "Software", href: "https://software.branapi.com/", current: false },
  { name: "Sites", href: "https://sites.branapi.com/", current: false },
  { name: "Apps", href: "https://apps.branapi.com/", current: true },
  { name: "Sistemas", href: "https://sistemas.branapi.com/", current: false },
  { name: "Automação", href: "https://automacao.branapi.com/", current: false },
  { name: "MVP", href: "https://mvp.branapi.com/", current: false },
];

export default function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = "5562981580707";
  const defaultMsg = "Oi, tenho uma ideia de app e quero um escopo";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <>
      <header
        className={`fixed top-4 inset-x-0 z-50 flex items-center justify-center px-4 transition-all duration-300 pointer-events-none ${
          isScrolled ? "-translate-y-1" : "translate-y-0"
        }`}
      >
        <nav
          aria-label="Navegação Principal"
          className="pointer-events-auto flex items-center justify-between gap-3 md:gap-6 px-4 md:px-6 py-2.5 rounded-full bg-zinc-950/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(197,255,65,0.06)]"
        >
          {/* Branapi Wordmark */}
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
                priority
                className="object-contain h-full w-auto"
              />
            </div>
          </a>

          <div className="hidden lg:block w-[1px] h-4 bg-white/10" aria-hidden="true" />

          {/* Desktop Ecosystem Links */}
          <div className="hidden lg:flex items-center gap-1 font-mono-code text-xs">
            {NAV_LINKS.map((link) => {
              if (link.current) {
                return (
                  <span
                    key={link.name}
                    aria-current="page"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5FF41]/15 text-[#C5FF41] border border-[#C5FF41]/30 font-semibold shadow-[0_0_12px_rgba(197,255,65,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] animate-pulse" />
                    <span>{link.name}</span>
                  </span>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Orçamento Grátis CTA */}
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

            {/* Mobile menu button */}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl lg:hidden flex flex-col justify-center px-8"
        >
          <div className="flex flex-col gap-3 font-mono-code text-sm">
            <div className="text-[11px] uppercase tracking-widest text-[#C5FF41] mb-2 flex items-center gap-2">
              <Smartphone className="w-3 h-3" />
              <span>Ecossistema Branapi &bull; Apps</span>
            </div>

            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-2xl text-base border flex items-center justify-between ${
                  link.current
                    ? "bg-[#C5FF41]/10 text-[#C5FF41] border-[#C5FF41]/30 font-bold"
                    : "text-zinc-300 border-white/[0.08] hover:bg-white/5"
                }`}
              >
                <span>{link.name}</span>
                {link.current && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#C5FF41] text-black font-semibold">
                    Atual
                  </span>
                )}
              </a>
            ))}

            <div className="pt-6">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#C5FF41] text-black font-bold font-mono-code text-sm shadow-[0_0_25px_rgba(197,255,65,0.4)]"
              >
                <span>Pedir Escopo de App no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
