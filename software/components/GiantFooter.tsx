"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";

const ECOSYSTEM_PAGES = [
  { name: "Software House", href: "https://software.branapi.com", current: true },
  { name: "Sites de Alta Performance", href: "https://sites.branapi.com", current: false },
  { name: "Aplicativos iOS & Android", href: "https://apps.branapi.com", current: false },
  { name: "Sistemas Web Sob Medida", href: "https://sistemas.branapi.com", current: false },
  { name: "Automação com Inteligência Artificial", href: "https://automacao.branapi.com", current: false },
  { name: "MVP para Startups", href: "https://mvp.branapi.com", current: false },
];

export default function GiantFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      aria-label="Rodapé institucional"
      className="relative w-full pt-20 pb-12 px-4 md:px-8 bg-black border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Upper Navigation & Ecosystem Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link
                href="https://branapi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/branapi-wordmark.png"
                  alt="Branapi"
                  width={150}
                  height={38}
                  className="w-auto h-7 object-contain"
                />
              </Link>
              <p className="mt-4 text-zinc-400 font-body text-sm md:text-base max-w-sm leading-relaxed">
                Software house brasileira de tecnologia sob medida. Criamos sistemas, sites, apps e automações com código-fonte entregue e sem surpresas.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 text-zinc-400 text-xs font-mono-code">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-[#C5FF41]" />
                830+ projetos entregues
              </span>
              <span>·</span>
              <span>Brasil · Portugal · Peru</span>
            </div>
          </div>

          {/* 6 Pages Internal Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono-code uppercase tracking-widest text-[#C5FF41] mb-4">
              Páginas do Ecossistema
            </h4>
            <ul className="space-y-2.5">
              {ECOSYSTEM_PAGES.map((page) => (
                <li key={page.name}>
                  <Link
                    href={page.href}
                    className={`inline-flex items-center gap-2 text-sm transition-colors ${
                      page.current
                        ? "text-[#C5FF41] font-medium"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{page.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono-code uppercase tracking-widest text-[#C5FF41] mb-4">
              Contato & Redes
            </h4>
            <ul className="space-y-3 text-sm font-mono-code text-zinc-400">
              <li>
                <a
                  href="https://wa.me/5562981580707?text=Oi%2C%20quero%20um%20escopo%20de%20software%20sob%20medida"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-300 hover:text-[#C5FF41] transition-colors"
                >
                  <span>WhatsApp: (62) 98158-0707</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/branapi.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>@branapi.tech</span>
                </a>
              </li>
              <li>
                <a
                  href="https://branapi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>branapi.com (Site Principal)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Glowing Mouse-Reactive BRANAPI Display */}
        <div className="relative py-12 md:py-20 select-none overflow-hidden text-center">
          <div
            aria-hidden="true"
            style={{
              backgroundImage: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, #C5FF41 0%, rgba(197,255,65,0.3) 35%, rgba(255,255,255,0.08) 75%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="font-display font-black tracking-tighter text-[19vw] md:text-[21vw] leading-none transition-all duration-75 text-center cursor-default inline-block will-change-transform drop-shadow-[0_0_80px_rgba(197,255,65,0.2)]"
          >
            BRANAPI
          </div>
        </div>

        {/* Lower Legal Disclaimer */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-zinc-400">
          <div>
            BRANAPI © 2026. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://branapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5FF41] transition-colors"
            >
              Portal Branapi
            </Link>
            <span>·</span>
            <span className="text-zinc-400">software.branapi.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
