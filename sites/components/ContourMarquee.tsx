"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MARQUEE_ITEMS = [
  "INSTITUCIONAL",
  "LANDING PAGE",
  "E-COMMERCE",
  "LOJA VIRTUAL",
  "ÁREA DE CLIENTE",
  "AGENDAMENTO",
];

export default function ContourMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    if (!track1 || !track2) return;

    let baseSpeed = 1.0;
    let scrollVelocity = 0;
    let x1 = 0;
    let x2 = -1000;

    // Track scroll velocity via ScrollTrigger
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        // Absolute velocity capped
        scrollVelocity = Math.min(Math.abs(self.getVelocity() / 300), 8.0);
      },
    });

    let rafId: number;
    const animate = () => {
      // Decay velocity back to 0
      scrollVelocity *= 0.92;
      const effectiveSpeed = baseSpeed + scrollVelocity;

      // Track 1 moves left
      x1 -= effectiveSpeed * 1.2;
      // Track 2 moves right
      x2 += effectiveSpeed * 1.2;

      // Wrap around seamlessly
      const track1Width = track1.scrollWidth / 2;
      if (Math.abs(x1) >= track1Width) {
        x1 = 0;
      }

      const track2Width = track2.scrollWidth / 2;
      if (x2 >= 0) {
        x2 = -track2Width;
      }

      track1.style.transform = `translate3d(${x1}px, 0, 0)`;
      track2.style.transform = `translate3d(${x2}px, 0, 0)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      st.kill();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Repeat sequence for seamless marquee loop
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-12 overflow-hidden select-none bg-black"
      aria-label="Especialidades em Sites"
    >
      {/* Top subtle fade gradient */}
      <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

      {/* Track 1: Tilted -1 deg, moving Left */}
      <div className="py-2 transform -rotate-1 origin-center overflow-hidden border-y border-white/[0.06] bg-zinc-950/60 backdrop-blur-md">
        <div
          ref={track1Ref}
          className="flex items-center gap-8 whitespace-nowrap will-change-transform py-2"
        >
          {repeatedItems.map((item, idx) => (
            <div key={`t1-${idx}`} className="flex items-center gap-8 shrink-0">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-white hover:text-[#C5FF41] transition-colors">
                {item}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5FF41] shadow-[0_0_10px_#C5FF41] shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Track 2: Tilted +1 deg, moving Right */}
      <div className="py-2 mt-3 transform rotate-1 origin-center overflow-hidden border-y border-white/[0.06] bg-zinc-950/80 backdrop-blur-md">
        <div
          ref={track2Ref}
          className="flex items-center gap-8 whitespace-nowrap will-change-transform py-2"
        >
          {repeatedItems.map((item, idx) => (
            <div key={`t2-${idx}`} className="flex items-center gap-8 shrink-0">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider stroke-text-green hover:text-[#C5FF41] transition-colors">
                {item}
              </span>
              <span className="w-2 h-2 rounded-full border border-white/40 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
