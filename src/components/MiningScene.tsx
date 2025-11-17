import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MiningScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0015);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create mining particles (dust, ore fragments)
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 4000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Premium dark mode neon palette
    const miningColors = [
      new THREE.Color(0x3b82f6), // blue
      new THREE.Color(0x8b5cf6), // purple
      new THREE.Color(0x10b981), // emerald
      new THREE.Color(0x60a5fa), // light blue
      new THREE.Color(0xa78bfa), // light purple
      new THREE.Color(0x34d399), // light emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      const color = miningColors[Math.floor(Math.random() * miningColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Add neon tunnel lights
    const lightBlue = new THREE.PointLight(0x3b82f6, 1.5, 120);
    lightBlue.position.set(-30, 0, 20);
    scene.add(lightBlue);

    const lightPurple = new THREE.PointLight(0x8b5cf6, 1.2, 120);
    lightPurple.position.set(30, 20, -20);
    scene.add(lightPurple);

    const lightEmerald = new THREE.PointLight(0x10b981, 0.8, 100);
    lightEmerald.position.set(0, -20, 10);
    scene.add(lightEmerald);

    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
    scene.add(ambientLight);

    // Animation loop
    let time = 0;
    const animate = () => {
      if (!sceneRef.current) return;
      
      const animationId = requestAnimationFrame(animate);
      sceneRef.current.animationId = animationId;

      time += 0.001;

      // Rotate particles slowly
      particles.rotation.x = time * 0.1;
      particles.rotation.y = time * 0.15;

      // Animate particle positions (drifting dust)
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Pulse neon lights
      lightBlue.intensity = 1.5 + Math.sin(time * 2) * 0.4;
      lightPurple.intensity = 1.2 + Math.cos(time * 1.5) * 0.3;
      lightEmerald.intensity = 0.8 + Math.sin(time * 2.5) * 0.2;

      renderer.render(scene, camera);
    };

    // Store refs before starting animation
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      animationId: 0,
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.particles.geometry.dispose();
        (sceneRef.current.particles.material as THREE.Material).dispose();
        if (containerRef.current && sceneRef.current.renderer.domElement) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default MiningScene;
