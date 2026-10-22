"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LiquidFluidHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove any previous children
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
    const height = container.clientHeight || window.innerHeight;

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
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uTouchActive;
      varying vec2 vUv;

      // Pseudo-random noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // Fractional Brownian Motion (fBm)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

        // Interactive mouse vortex distortion
        vec2 m = uMouse;
        float distToMouse = length(st - m);
        float mouseEffect = smoothstep(0.85, 0.0, distToMouse);
        
        // Fluid domain warping
        vec2 q = vec2(0.0);
        q.x = fbm(st + 0.05 * uTime + vec2(0.0, 0.0));
        q.y = fbm(st + vec2(5.2, 1.3) + 0.04 * uTime);

        // Vortex spin around cursor
        vec2 dir = normalize(st - m + vec2(0.0001));
        q += dir * mouseEffect * 0.45;

        vec2 r = vec2(0.0);
        r.x = fbm(st + 4.0 * q + vec2(1.7, 9.2) + 0.08 * uTime);
        r.y = fbm(st + 4.0 * q + vec2(8.3, 2.8) + 0.06 * uTime);

        float f = fbm(st + 4.0 * r);

        // Luminous Neon Veins: #C5FF41 (0.772, 1.0, 0.255)
        vec3 neonGreen = vec3(0.772, 1.0, 0.255);
        vec3 darkEmerald = vec3(0.08, 0.16, 0.03);
        vec3 deepBlack = vec3(0.015, 0.015, 0.02);

        // Sharpen fluid veins
        float veins = smoothstep(0.35, 0.75, f);
        float coreVein = smoothstep(0.6, 0.85, f) * 1.5;

        vec3 col = mix(deepBlack, darkEmerald, clamp(f * 1.2, 0.0, 1.0));
        col = mix(col, neonGreen, clamp(veins * 0.65 + coreVein * 0.35, 0.0, 1.0));

        // Extra mouse halo glow
        col += neonGreen * mouseEffect * 0.25;

        // Film grain / noise overlay
        float grain = (hash(gl_FragCoord.xy + uTime * 60.0) - 0.5) * 0.08;
        col += grain;

        // Vignette feathering towards edges
        float vignette = smoothstep(1.3, 0.2, length(st));
        col *= vignette;

        gl_FragColor = vec4(col, 0.95);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTouchActive: { value: 0.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse movement smoothing
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const aspect = rect.width / rect.height;
      targetMouseX = aspect > 1 ? x * 0.5 * aspect : x * 0.5;
      targetMouseY = aspect > 1 ? y * 0.5 : (y * 0.5) / aspect;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        const aspect = rect.width / rect.height;
        targetMouseX = aspect > 1 ? x * 0.5 * aspect : x * 0.5;
        targetMouseY = aspect > 1 ? y * 0.5 : (y * 0.5) / aspect;
        uniforms.uTouchActive.value = 1.0;
      }
    };

    const onTouchEnd = () => {
      uniforms.uTouchActive.value = 0.0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    let rafId: number;
    const clock = new THREE.Clock();

    const render = () => {
      if (isVisible && renderer) {
        const time = clock.getElapsedTime();
        uniforms.uTime.value = time;

        // Smooth mouse lerp
        currentMouseX += (targetMouseX - currentMouseX) * 0.06;
        currentMouseY += (targetMouseY - currentMouseY) * 0.06;

        // If no user motion, create a subtle idle wander
        const idleX = Math.sin(time * 0.5) * 0.25;
        const idleY = Math.cos(time * 0.4) * 0.25;

        uniforms.uMouse.value.set(
          currentMouseX + idleX * 0.15,
          currentMouseY + idleY * 0.15
        );

        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
