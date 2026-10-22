"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface WordMaskHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  badge?: string;
  roman?: string;
  centered?: boolean;
}

export default function WordMaskHeading({
  text,
  as: Tag = "h2",
  className = "",
  badge,
  roman,
  centered = false,
}: WordMaskHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = container.querySelectorAll(".word-inner");

    if (isReduced) {
      gsap.set(words, { y: "0%", opacity: 1 });
      return;
    }

    gsap.fromTo(
      words,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [text]);

  const words = text.split(" ");

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-3 ${centered ? "items-center text-center" : ""}`}
    >
      {(badge || roman) && (
        <div
          className={`flex items-center gap-2 text-[12px] font-mono-code uppercase tracking-widest text-[#C5FF41] font-medium ${
            centered ? "justify-center" : ""
          }`}
        >
          {roman && <span className="font-bold text-[#C5FF41]">{roman} ·</span>}
          {badge && <span>{badge}</span>}
        </div>
      )}

      <Tag className={`font-display font-semibold tracking-tight ${className}`}>
        {words.map((word, index) => (
          <span key={index} className="inline-block whitespace-nowrap">
            <span className="inline-block overflow-hidden align-top pb-[0.08em]">
              <span className="word-inner inline-block will-change-transform">
                {word}
              </span>
            </span>
            {index < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </Tag>
    </div>
  );
}
