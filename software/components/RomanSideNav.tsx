"use client";

import { useEffect, useState } from "react";

interface SectionItem {
  id: string;
  roman: string;
  title: string;
}

const SECTIONS: SectionItem[] = [
  { id: "hero", roman: "I", title: "Hero" },
  { id: "desenvolvemos", roman: "II", title: "O que desenvolvemos" },
  { id: "como-funciona", roman: "III", title: "Como funciona" },
  { id: "comparativo", roman: "IV", title: "Próprio vs Alugado" },
  { id: "faq", roman: "V", title: "Perguntas frequentes" },
  { id: "cta-final", roman: "VI", title: "CTA final" },
];

export default function RomanSideNav() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall scroll progress (0-100)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Scroll spy logic
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | string) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentSection = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];

  return (
    <>
      {/* Mobile Top Progress Bar */}
      <div className="xl:hidden">
        <div
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso de leitura"
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-white/10 z-[60]"
        >
          <div
            className="h-full bg-[#C5FF41] shadow-[0_0_10px_#C5FF41] transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Desktop Fixed Lateral Index */}
      <nav
        aria-label="Índice de seções"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3.5 select-none"
      >
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group flex items-center justify-end gap-2.5 py-1 text-right focus:outline-none"
              aria-label={`Ir para seção ${section.roman} - ${section.title}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Expandable Title Label on Hover or Active */}
              <div
                className={`transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                  isActive
                    ? "opacity-100 max-w-[200px]"
                    : "opacity-0 max-w-0 group-hover:opacity-80 group-hover:max-w-[200px]"
                }`}
              >
                <span className="text-[11px] font-mono-code whitespace-nowrap text-zinc-300">
                  {section.title}
                </span>
                {/* Dotted connecting line */}
                <span
                  className="w-4 border-t border-dotted border-[#C5FF41]/70"
                  aria-hidden="true"
                />
              </div>

              {/* Roman Numeral */}
              <div
                className={`flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-md font-mono-code text-[12px] transition-all duration-200 border ${
                  isActive
                    ? "bg-[#C5FF41]/15 border-[#C5FF41] text-[#C5FF41] font-bold shadow-[0_0_15px_rgba(197,255,65,0.25)] scale-110"
                    : "bg-black/40 border-white/10 text-zinc-500 group-hover:text-zinc-200 group-hover:border-white/30"
                }`}
              >
                {section.roman}
              </div>
            </button>
          );
        })}
      </nav>
    </>
  );
}
