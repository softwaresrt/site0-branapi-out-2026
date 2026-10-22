"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelpCircle, Sparkles } from "lucide-react";

export default function FaqTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    const camera = new THREE.PerspectiveCamera(
      55,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || 320),
      0.1,
      1000
    );
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 320;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.domElement.className = "w-full h-full block";

    container.appendChild(renderer.domElement);

    // Particle Wave Grid Geometry (60 x 30 points)
    const cols = 55;
    const rows = 28;
    const count = cols * rows;
    const spacing = 1.2;

    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * spacing;
        const z = (r - rows / 2) * spacing;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        initialPositions[idx * 3] = x;
        initialPositions[idx * 3 + 1] = y;
        initialPositions[idx * 3 + 2] = z;

        scales[idx] = 1.0;
        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Shader Material for luminous neon particles
    const vertexShader = `
      attribute float scale;
      uniform float uTime;
      uniform float uProgress;
      uniform vec2 uMouse;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec3 pos = position;

        // Wave motion
        float wave1 = sin(pos.x * 0.25 + uTime * 2.0) * cos(pos.z * 0.25 + uTime * 1.5) * 2.8;
        float wave2 = sin(pos.z * 0.4 + uTime * 2.5) * 1.5;
        
        // Mouse interaction ripple
        float distToMouse = length(pos.xz - uMouse * 18.0);
        float mouseWave = sin(max(0.0, 10.0 - distToMouse) * 0.8) * 3.2;

        pos.y += (wave1 + wave2 + mouseWave) * (0.4 + uProgress * 0.6);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = scale * (220.0 / -mvPosition.z) * (0.8 + sin(uTime * 3.0 + pos.x) * 0.3);
        gl_Position = projectionMatrix * mvPosition;

        // Distance fog / fade
        float depth = clamp(-mvPosition.z / 50.0, 0.0, 1.0);
        vAlpha = (1.0 - depth) * (0.3 + uProgress * 0.7);

        // Official neon green: #C5FF41 (0.772, 1.0, 0.255)
        vec3 green = vec3(0.772, 1.0, 0.255);
        vec3 white = vec3(1.0, 1.0, 1.0);
        vColor = mix(green, white, clamp(pos.y * 0.2, 0.0, 0.6));
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Circular soft point
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float strength = pow(1.0 - dist * 2.0, 2.0);
        gl_FragColor = vec4(vColor, strength * vAlpha * 0.85);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Glowing wireframe rings around the center for focal effect
    const ringGeo = new THREE.RingGeometry(8, 8.1, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc5ff41,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.5;
    scene.add(ringMesh);

    // ScrollTrigger to tie wave energy to scroll
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 90%",
      end: "bottom 10%",
      scrub: 1.2,
      onUpdate: (self) => {
        uniforms.uProgress.value = self.progress;
      },
    });

    // Mouse move interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      uniforms.uMouse.value.set(x, y);
      setMousePos({ x, y });
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let rafId: number;
    const clock = new THREE.Clock();

    const render = () => {
      if (isVisible && renderer) {
        const time = clock.getElapsedTime();
        uniforms.uTime.value = time;
        ringMesh.rotation.z = time * 0.2;
        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      st.kill();
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-56 md:h-80 overflow-hidden my-2 select-none"
      aria-hidden="true"
    >
      {/* Central Cybernetic Decryption HUD */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#C5FF41]/30 backdrop-blur-md shadow-[0_0_20px_rgba(197,255,65,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#C5FF41] animate-pulse" />
          <span className="text-[11px] font-mono-code uppercase tracking-[0.2em] text-[#C5FF41] font-bold">
            FLUXO SINÁPTICO // BASE DE ESCLARECIMENTOS
          </span>
        </div>

        <div className="mt-3 text-[10px] md:text-xs font-mono-code text-zinc-400 tracking-wider">
          &lt; RESOLVENDO DÚVIDAS OPERACIONAIS &bull; PROTOCOLO BRANAPI &gt;
        </div>
      </div>

      {/* Top and Bottom feathered gradient so transition merges seamlessly with black bg */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </div>
  );
}
