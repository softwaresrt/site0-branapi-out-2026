"use client";

import { MessageSquare } from "lucide-react";

export default function WhatsAppFloat() {
  const phone = "5562981580707";
  const message = "Oi, tenho uma ideia de app e quero um escopo";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <aside
      aria-label="Atendimento no WhatsApp"
      className="fixed bottom-6 right-6 z-40"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#C5FF41] text-black shadow-[0_10px_30px_rgba(197,255,65,0.45)] hover:bg-[#d6ff6a] transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C5FF41]"
      >
        <span className="absolute -inset-1 rounded-full bg-[#C5FF41]/40 animate-ping pointer-events-none opacity-60" />
        <MessageSquare className="w-6 h-6 fill-current relative z-10 transition-transform duration-200 group-hover:scale-110" />
      </a>
    </aside>
  );
}
