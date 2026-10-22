"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { Globe, MapPin, Sparkles } from "lucide-react";

const CITIES = [
  { name: "São Paulo", lat: -23.5505, lon: -46.6333, founders: "14 Startups" },
  { name: "Goiânia", lat: -16.6869, lon: -49.2648, founders: "HQ Branapi" },
  { name: "Salvador", lat: -12.9714, lon: -38.5014, founders: "6 Startups" },
  { name: "Belo Horizonte", lat: -19.9167, lon: -43.9345, founders: "9 Startups" },
  { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, founders: "11 Startups" },
  { name: "Curitiba", lat: -25.4284, lon: -49.2733, founders: "8 Startups" },
];

export default function InteractiveGlobeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [activeCity, setActiveCity] = useState("São Paulo");

  // Flagship Effect #2: Cobe Interactive Globe with Brazil coordinates & neon green theme
  useEffect(() => {
    let phi = -0.8;
    let theta = -0.4;
    let width = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      if (canvas) {
        width = canvas.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Markers for São Paulo, Goiânia, Salvador, BH, Rio, Curitiba
    const markers = CITIES.map((c) => ({
      location: [c.lat, c.lon] as [number, number],
      size: c.name === "Goiânia" ? 0.08 : 0.05,
    }));

    let globe: ReturnType<typeof createGlobe> | null = null;

    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        width: width * 2,
        height: width * 2,
        phi,
        theta,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.08, 0.08, 0.1],
        markerColor: [0.77, 1.0, 0.25], // Neon green #C5FF41
        glowColor: [0.77, 1.0, 0.25],
        markers,
        onRender: (state) => {
          if (!pointerInteracting.current) {
            phi += 0.003;
          }
          state.phi = phi + pointerInteractionMovement.current;
          state.theta = theta;
          state.width = width * 2;
          state.height = width * 2;
        },
      });
    } catch (err) {
      console.warn("Cobe WebGL fallback:", err);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (globe) {
        globe.destroy();
      }
    };
  }, []);

  return (
    <section
      id="globo"
      className="relative w-full py-28 px-4 sm:px-6 md:px-8 bg-black text-white select-none scroll-mt-20 overflow-hidden"
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5FF41]/8 rounded-full blur-[190px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading, Legend & City Tags */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <div className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>COBE GLOBE INTERATIVO &bull; ESCALA NACIONAL</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
              Founders de todo o Brasil
            </h2>

            <p className="mt-4 text-zinc-400 font-body text-base md:text-lg leading-relaxed">
              Arraste o globo para navegar. Desenvolvemos e escalamos plataformas SaaS para startups operando nos principais polos de tecnologia do país.
            </p>
          </div>

          {/* Arcs & Cities Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => setActiveCity(city.name)}
                className={`p-3 rounded-2xl border text-left font-mono-code transition-all ${
                  activeCity === city.name
                    ? "bg-[#C5FF41]/10 border-[#C5FF41] text-white shadow-[0_0_15px_rgba(197,255,65,0.2)]"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MapPin className="w-3 h-3 text-[#C5FF41]" />
                  <span>{city.name}</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {city.founders}
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Legend Box */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono-code text-zinc-400 flex items-center justify-between">
            <span>Interligação em tempo real: Arcos luminosos ativos</span>
            <span className="text-[#C5FF41] font-bold">SP &harr; GYN &harr; SSA</span>
          </div>
        </div>

        {/* Right Column: 3D Globe Canvas with Touch Adaptation */}
        <div className="lg:col-span-6 flex justify-center items-center relative">
          <div
            className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[520px] md:h-[520px] cursor-grab active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
            onPointerDown={(e) => {
              pointerInteracting.current =
                e.clientX - pointerInteractionMovement.current;
            }}
            onPointerUp={() => {
              pointerInteracting.current = null;
            }}
            onPointerOut={() => {
              pointerInteracting.current = null;
            }}
            onMouseMove={(e) => {
              if (pointerInteracting.current !== null) {
                const delta = e.clientX - pointerInteracting.current;
                pointerInteractionMovement.current = delta * 0.005;
              }
            }}
            onTouchMove={(e) => {
              if (pointerInteracting.current !== null && e.touches[0]) {
                const delta = e.touches[0].clientX - pointerInteracting.current;
                pointerInteractionMovement.current = delta * 0.005;
              }
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full opacity-90 transition-opacity duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
