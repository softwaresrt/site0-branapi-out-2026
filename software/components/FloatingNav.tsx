"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Software", href: "https://software.branapi.com", active: true },
  { name: "Sites", href: "https://sites.branapi.com", active: false },
  { name: "Apps", href: "https://apps.branapi.com", active: false },
  { name: "Sistemas", href: "https://sistemas.branapi.com", active: false },
  { name: "Automação", href: "https://automacao.branapi.com", active: false },
  { name: "MVP", href: "https://mvp.branapi.com", active: false },
];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCta = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const cta = document.getElementById("cta-final");
    if (cta) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(cta);
      } else {
        cta.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-4 md:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* Floating Pill Bar */}
      <nav
        aria-label="Navegação principal"
        className={`pointer-events-auto flex items-center justify-between gap-3 md:gap-7 px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-2xl border border-white/[0.14] shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/5"
            : "bg-black/60 backdrop-blur-xl border border-white/[0.09] shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="https://branapi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#C5FF41] rounded-md"
          title="Branapi - Voltar para o site principal"
        >
          <div className="relative w-24 md:w-28 h-6 md:h-7 flex items-center">
            <Image
              src="/branapi-wordmark.png"
              alt="Branapi"
              width={140}
              height={36}
              priority
              loading="eager"
              className="object-contain w-auto h-5 md:h-6 transition-opacity duration-200 group-hover:opacity-90"
            />
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-4 bg-white/10" aria-hidden="true" />

        {/* Desktop 6 Ecosystem Links */}
        <ul className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-mono-code">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`relative px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#C5FF41] ${
                  link.active
                    ? "text-[#C5FF41] font-medium bg-[#C5FF41]/10 border border-[#C5FF41]/25 shadow-[0_0_15px_rgba(197,255,65,0.15)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {link.active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] shadow-[0_0_8px_#C5FF41] animate-pulse"
                    aria-hidden="true"
                  />
                )}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          <a
            href="#cta-final"
            onClick={scrollToCta}
            className="group relative inline-flex items-center gap-1.5 px-3.5 md:px-5 py-1.5 md:py-2 text-[12px] md:text-[13px] font-medium font-mono-code rounded-full bg-[#C5FF41] text-black transition-all duration-200 hover:bg-[#d6ff6a] hover:shadow-[0_0_24px_rgba(197,255,65,0.6)] focus:outline-none focus:ring-2 focus:ring-[#C5FF41] focus:ring-offset-2 focus:ring-offset-black"
          >
            <span>Orçamento grátis</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5FF41]"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#C5FF41]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de páginas do ecossistema"
          className="lg:hidden pointer-events-auto fixed inset-x-4 top-20 bg-[#080808]/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-50 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#C5FF41]">
              Ecossistema Branapi
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-zinc-400 hover:text-white text-xs font-mono-code"
            >
              Fechar [ESC]
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  link.active
                    ? "bg-[#C5FF41]/10 border-[#C5FF41]/40 text-[#C5FF41] shadow-[0_0_20px_rgba(197,255,65,0.12)]"
                    : "bg-white/[0.03] border-white/[0.06] text-zinc-300 hover:text-white hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] shadow-[0_0_6px_#C5FF41]" />
                  )}
                  <span className="font-display font-medium text-sm">{link.name}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2.5">
            <a
              href="#cta-final"
              onClick={scrollToCta}
              className="w-full py-3 rounded-xl bg-[#C5FF41] text-black text-center font-mono-code text-sm font-semibold hover:bg-[#d6ff6a] transition-colors"
            >
              Solicitar Orçamento Grátis
            </a>
            <Link
              href="https://branapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center text-xs font-mono-code text-zinc-400 hover:text-white"
            >
              Ir para o portal branapi.com →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
