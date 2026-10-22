"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Globe, MessageSquare } from "lucide-react";

const ECOSYSTEM_LINKS = [
  { name: "Página Principal", href: "https://branapi.com/", desc: "Visão Geral do Ecossistema" },
  { name: "Software House", href: "https://software.branapi.com/", desc: "Desenvolvimento Sob Medida" },
  { name: "Criação de Sites", href: "https://sites.branapi.com/", desc: "Sites de Alta Performance" },
  { name: "Aplicativos Móveis", href: "https://apps.branapi.com/", desc: "Apps iOS & Android", current: true },
  { name: "Sistemas & ERP", href: "https://sistemas.branapi.com/", desc: "Sistemas Empresariais" },
  { name: "Automações com IA", href: "https://automacao.branapi.com/", desc: "Agentes & Workflows" },
  { name: "Desenvolvimento MVP", href: "https://mvp.branapi.com/", desc: "Validação Ágil de Ideias" },
];

export default function GiantFooter() {
  const giantRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const el = giantRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const phone = "5562981580707";
  const defaultMsg = "Oi, tenho uma ideia de app e quero um escopo";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <footer
      className="relative w-full bg-black text-white pt-24 pb-12 px-4 sm:px-6 md:px-12 border-t border-white/[0.08] overflow-hidden select-none"
      id="rodape"
    >
      {/* Ecosystem Links Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-white/[0.08]">
        {/* Col 1: Brand Wordmark & Mission */}
        <div className="md:col-span-5 space-y-5">
          <a href="https://branapi.com" className="inline-block" aria-label="Branapi Início">
            <div className="relative w-32 h-8">
              <Image
                src="/branapi-wordmark.png"
                alt="Branapi"
                width={140}
                height={35}
                className="object-contain h-full w-auto"
              />
            </div>
          </a>

          <p className="text-zinc-400 font-body text-sm md:text-base leading-relaxed max-w-sm">
            Desenvolvimento de aplicativos sob medida para iOS e Android, do design de alta fidelidade à publicação oficial na App Store e Google Play.
          </p>

          <div className="pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5FF41] text-black font-mono-code font-bold text-xs hover:bg-[#d6ff6a] transition-all shadow-[0_0_20px_rgba(197,255,65,0.4)]"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Falar no WhatsApp Comercial</span>
            </a>
          </div>
        </div>

        {/* Col 2: Ecosystem Pages */}
        <div className="md:col-span-7">
          <div className="text-xs font-mono-code uppercase tracking-widest text-[#C5FF41] font-bold mb-6 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Ecossistema Branapi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ECOSYSTEM_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                  link.current
                    ? "bg-[#C5FF41]/10 border-[#C5FF41]/40 text-white"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/20 text-zinc-300"
                }`}
              >
                <div>
                  <div className="font-display font-semibold text-sm group-hover:text-white transition-colors flex items-center gap-1.5">
                    <span>{link.name}</span>
                    {link.current && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF41] animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] font-mono-code text-zinc-500 mt-0.5">
                    {link.desc}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#C5FF41] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* GIANT 'BRANAPI' TYPOGRAPHY FILLED BY REACTIVE GREEN GRADIENT */}
      <div
        ref={giantRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative my-8 sm:my-14 overflow-hidden text-center cursor-default py-4"
        aria-hidden="true"
      >
        <div
          className="font-display font-black text-[20vw] leading-[0.75] tracking-tighter uppercase select-none transition-all duration-300"
          style={{
            backgroundImage: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, rgba(197, 255, 65, 0.95) 0%, rgba(197, 255, 65, 0.25) 45%, rgba(255, 255, 255, 0.05) 85%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextStroke: isHovering
              ? "2px rgba(197, 255, 65, 0.7)"
              : "1.5px rgba(255, 255, 255, 0.15)",
            color: "transparent",
            filter: isHovering ? "drop-shadow(0 0 45px rgba(197,255,65,0.4))" : "none",
          }}
        >
          BRANAPI
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-zinc-500 pt-6 border-t border-white/[0.06]">
        <div>
          &copy; {new Date().getFullYear()} Branapi Tecnologia. Todos os direitos reservados.
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://branapi.com"
            className="hover:text-[#C5FF41] transition-colors"
          >
            branapi.com
          </a>
          <a
            href="https://apps.branapi.com"
            className="text-zinc-300 hover:text-[#C5FF41] transition-colors"
          >
            apps.branapi.com
          </a>
        </div>
      </div>
    </footer>
  );
}
