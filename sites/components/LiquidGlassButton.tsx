"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface LiquidGlassButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}

export default function LiquidGlassButton({
  href,
  children,
  className = "",
  icon = true,
}: LiquidGlassButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isReduced) return;

    const btn = btnRef.current;
    if (!btn) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isAttracted = false;

    const magneticRadius = 90; // Attraction zone in px

    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < magneticRadius + rect.width / 2) {
        isAttracted = true;
        // Magnetic pull factor
        const pull = Math.max(0, 1 - dist / (magneticRadius + rect.width / 2));
        targetX = distX * 0.35 * pull;
        targetY = distY * 0.35 * pull;

        // Internal shine position (0% to 100%)
        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        const relY = ((e.clientY - rect.top) / rect.height) * 100;
        setShinePos({ x: relX, y: relY });
      } else {
        isAttracted = false;
        targetX = 0;
        targetY = 0;
      }
    };

    let rafId: number;
    const loop = () => {
      // Lerp offset
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      setOffset({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShinePos({ x: 50, y: 50 });
      }}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full liquid-glass-btn text-white font-mono-code font-bold text-sm md:text-base select-none cursor-pointer will-change-transform ${className}`}
    >
      {/* Specular internal cursor shine */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0.4,
          background: `radial-gradient(150px circle at ${shinePos.x}% ${shinePos.y}%, rgba(197, 255, 65, 0.45), transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Edge luminous refraction rim */}
      <div
        className="absolute -inset-[1px] rounded-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(120px circle at ${shinePos.x}% ${shinePos.y}%, rgba(197, 255, 65, 0.8), transparent 70%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2 tracking-wide text-white group-hover:text-[#C5FF41] transition-colors">
        {children}
      </span>

      {icon && (
        <span className="relative z-10 w-7 h-7 rounded-full bg-[#C5FF41] text-black flex items-center justify-center shadow-[0_0_15px_rgba(197,255,65,0.6)] group-hover:scale-110 transition-transform">
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </span>
      )}
    </a>
  );
}
