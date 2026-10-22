"use client";

import { MessageSquareText } from "lucide-react";

export default function WhatsAppFloat() {
  const phone = "5562981580707";
  const message = "Oi, quero um escopo de software sob medida";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <aside
      aria-label="Atendimento rápido via WhatsApp"
      className="fixed bottom-6 right-5 md:right-8 z-50 pointer-events-auto"
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com especialista em software no WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0a0a0c]/85 hover:bg-[#111114] backdrop-blur-2xl border border-white/[0.12] hover:border-[#C5FF41]/50 shadow-[0_12px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(197,255,65,0.25)] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#C5FF41]"
      >
        {/* Pulsing indicator */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5FF41] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5FF41]" />
        </span>

        {/* WhatsApp Icon */}
        <div className="w-6 h-6 rounded-full bg-[#C5FF41]/20 flex items-center justify-center text-[#C5FF41] group-hover:scale-110 transition-transform">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-current"
            aria-hidden="true"
          >
            <path d="M12.04 2C6.5 2 2 6.49 2 12.01c0 1.77.46 3.44 1.28 4.9L2 22l5.24-1.37a10 10 0 0 0 4.8 1.22h.01C17.57 21.85 22 17.36 22 11.85 22 6.38 17.54 2 12.04 2Zm0 18.14a8.27 8.27 0 0 1-4.2-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.3c0-4.57 3.74-8.28 8.28-8.28 4.6 0 8.23 3.72 8.22 8.29a8.27 8.27 0 0 1-8.28 8.13ZM16.6 14c-.25-.12-1.45-.72-1.67-.8-.23-.08-.4-.13-.56.12-.17.25-.64.8-.78.96-.15.17-.29.19-.54.07-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.39.11-.51.12-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.16.04-.31-.02-.43l-.76-1.83c-.2-.48-.4-.41-.55-.42h-.48c-.17 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.66 4.22 3.73.6.26 1.07.42 1.44.54.61.2 1.16.17 1.6.1.49-.07 1.44-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.11-.23-.17-.48-.29Z" />
          </svg>
        </div>

        {/* Text */}
        <span className="font-mono-code text-[12px] md:text-[13px] text-zinc-200 group-hover:text-white font-medium flex items-center gap-1.5">
          <span>WhatsApp Comercial</span>
        </span>
      </a>
    </aside>
  );
}
