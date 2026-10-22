"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function XRayTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 280;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.domElement.className = "w-full h-full block pointer-events-none";

    container.appendChild(renderer.domElement);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uProgress;
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      void main() {
        // Bell-curve intensity tied to scroll progress
        float intensity = sin(clamp(uProgress, 0.0, 1.0) * 3.14159265);
        if (intensity <= 0.02) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;

        // Thin neon blueprint grid lines
        vec2 grid = abs(fract(st * 16.0 - 0.5) - 0.5) / fwidth(st * 16.0);
        float line = min(grid.x, grid.y);
        float gridPattern = 1.0 - min(line, 1.0);

        // Subgrid with subtle intensity
        vec2 subGrid = abs(fract(st * 64.0 - 0.5) - 0.5) / fwidth(st * 64.0);
        float subLine = min(subGrid.x, subGrid.y);
        float subGridPattern = (1.0 - min(subLine, 1.0)) * 0.25;

        // Floating glowing dust particles
        vec2 p = st * 30.0 + vec2(uTime * 0.15, uTime * 0.1);
        float dust = pow(noise(p), 8.0) * 3.5;

        // Soft edge feathering so there is no hard rectangular boundary
        float edgeY = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
        float edgeX = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
        float feather = edgeY * edgeX;

        float pattern = (gridPattern * 0.7 + subGridPattern + dust) * feather;
        vec3 greenNeon = vec3(0.772, 1.0, 0.255);

        float alpha = pattern * intensity * 0.6;
        gl_FragColor = vec4(greenNeon, alpha);
      }
    `;

    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 90%",
      end: "bottom 10%",
      scrub: 1,
      onUpdate: (self) => {
        uniforms.uProgress.value = self.progress;
      },
    });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 280;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    let rafId: number;
    let clock = new THREE.Clock();

    const render = () => {
      if (isVisible && renderer) {
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      st.kill();
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-48 md:h-64 pointer-events-none z-10 overflow-hidden my-4"
      aria-hidden="true"
    />
  );
}
