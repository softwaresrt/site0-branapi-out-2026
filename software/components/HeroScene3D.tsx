"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean container children if any (hot reload safety)
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    const scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.domElement.className =
      "w-full h-full max-w-[900px] max-h-[800px] object-contain drop-shadow-[0_0_50px_rgba(57,255,136,0.25)] pointer-events-none";

    container.appendChild(renderer.domElement);

    // Group for armillary sphere + geometric core
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Armillary Rings (Concentric outer gimbal rings)
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xc5ff41,
      transparent: true,
      opacity: 0.85,
    });

    const createRing = (radius: number, segments: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(segments);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.LineLoop(geometry, ringMaterial);
    };

    const ring1 = createRing(7.2, 128);
    const ring2 = createRing(6.4, 128);
    const ring3 = createRing(5.6, 128);

    ring1.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    ring3.rotation.x = Math.PI / 2.5;
    ring3.rotation.y = Math.PI / 5;

    rootGroup.add(ring1);
    rootGroup.add(ring2);
    rootGroup.add(ring3);

    // 2. Wireframe Icosahedron (Geometric core)
    const icoGeometry = new THREE.IcosahedronGeometry(4.2, 1);
    const wireframe = new THREE.WireframeGeometry(icoGeometry);
    const wireframeLine = new THREE.LineSegments(
      wireframe,
      new THREE.LineBasicMaterial({
        color: 0xc5ff41,
        transparent: true,
        opacity: 0.6,
      })
    );
    rootGroup.add(wireframeLine);

    // 3. Glowing vertex nodes
    const pointMaterial = new THREE.PointsMaterial({
      color: 0xc5ff41,
      size: 0.35,
      transparent: true,
      opacity: 0.95,
    });
    const pointsMesh = new THREE.Points(icoGeometry, pointMaterial);
    rootGroup.add(pointsMesh);

    // 4. Subtle inner glowing energy core
    const coreGeo = new THREE.OctahedronGeometry(2.0, 0);
    const coreWire = new THREE.WireframeGeometry(coreGeo);
    const coreLine = new THREE.LineSegments(
      coreWire,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
      })
    );
    rootGroup.add(coreLine);

    // Mouse & Scroll Parallax state
    let targetRotX = 0;
    let targetRotY = 0;
    let targetPosX = 0;
    let targetPosY = 0;
    let isVisible = true;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * 0.45;
      targetRotX = normY * 0.35;
      targetPosX = normX * 0.8;
      targetPosY = normY * 0.6;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      targetRotX = scrollY * 0.002;
      targetRotY = scrollY * 0.0015;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Pause when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 700;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!isReduced) {
        // Continuous ambient rotation
        rootGroup.rotation.y += 0.005;
        rootGroup.rotation.x += 0.003;

        ring1.rotation.z += 0.004;
        ring2.rotation.x += 0.005;
        ring3.rotation.y += 0.006;

        coreLine.rotation.y -= 0.01;

        // Smooth floating bob
        rootGroup.position.y = Math.sin(time * 1.5) * 0.45;

        // Smooth lerp to mouse/scroll parallax
        rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.04;
        rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.04;
        rootGroup.position.x += (targetPosX - rootGroup.position.x) * 0.05;
        rootGroup.position.y += (targetPosY - rootGroup.position.y) * 0.05;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icoGeometry.dispose();
      coreGeo.dispose();
      ringMaterial.dispose();
      pointMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-10"
      aria-hidden="true"
    >
      {!webGlSupported && (
        /* Fallback SVG armillary sphere if WebGL is disabled */
        <div className="relative w-72 h-72 rounded-full border border-[#C5FF41]/40 animate-spin [animation-duration:30s] flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-dashed border-[#C5FF41]/60 animate-spin [animation-duration:20s]" />
          <div className="absolute w-40 h-40 rounded-full border border-[#C5FF41]/80 animate-ping [animation-duration:4s]" />
          <div className="absolute w-4 h-4 rounded-full bg-[#C5FF41] shadow-[0_0_20px_#C5FF41]" />
        </div>
      )}
    </div>
  );
}
