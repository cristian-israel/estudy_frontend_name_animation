import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  ttl: number;
  life: number;
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const particles = useRef<Particle[]>([]);
  const isMouseDown = useRef(false);
  const targetCount = useRef(Math.min(Math.floor(window.innerWidth * 1.5), 1000));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let addParticlesInterval: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      targetCount.current = Math.min(Math.floor(window.innerWidth * 1.5), 1000);
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: 0,
      ttl: Math.floor(Math.random() * 600 + 300),
      life: 0,
    });

    const lerp = (start: number, end: number, amt: number) => start + (end - start) * amt;

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Brilho leve no mouse
      const gradient = ctx.createRadialGradient(mouse.current.x, mouse.current.y, 0, mouse.current.x, mouse.current.y, 360);
      gradient.addColorStop(0, "rgba(255, 255, 200, 0.02)");
      gradient.addColorStop(1, "rgba(255, 255, 200, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        p.ttl -= 1;
        p.life += 1;

        if (p.life < 60) {
          p.opacity = lerp(p.opacity, 0.7, 0.05);
        }

        if (p.ttl < 60) {
          p.opacity = lerp(p.opacity, 0, 0.05);
        }

        if (p.ttl <= 0 || p.opacity <= 0.01) {
          particles.current.splice(i, 1);
          continue;
        }

        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        // Suave aproximação ao clicar
        if (isMouseDown.current && dist < 200) {
          p.x = lerp(p.x, mouse.current.x, 0.008); // menor valor para suavizar
          p.y = lerp(p.y, mouse.current.y, 0.008);
        } else if (!isMouseDown.current && dist < 150) {
          // Repulsão mais intensa após soltar
          const angle = Math.atan2(dy, dx);
          const force = (150 - dist) / 150; // força proporcional à distância
          p.x += Math.cos(angle) * 1.5 * force;
          p.y += Math.sin(angle) * 1.5 * force;
        }

        // movimento natural
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulsar de opacidade ao passar o mouse
        const pulse = Math.max(0, 1 - dist / 150);
        const pulsingOpacity = lerp(p.opacity, 0.7 + 0.3 * Math.pow(pulse, 1.5), 0.04);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${pulsingOpacity})`;
        ctx.fill();

        connectParticles(p, i);
      }
    };

    const connectParticles = (p: Particle, index: number) => {
      const maxConnections = 6;
      const maxDistanceSq = 150 * 150;

      for (
        let j = index + 1;
        j < Math.min(index + maxConnections, particles.current.length);
        j++
      ) {
        const other = particles.current[j];
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistanceSq) {
          const alpha = 0.1 * (1 - distSq / maxDistanceSq) * Math.min(p.opacity, other.opacity);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(250, 204, 21, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseDown = () => (isMouseDown.current = true);
    const handleMouseUp = () => (isMouseDown.current = false);

    addParticlesInterval = window.setInterval(() => {
      if (particles.current.length < targetCount.current) {
        const toAdd = Math.min(5, targetCount.current - particles.current.length);
        for (let i = 0; i < toAdd; i++) {
          particles.current.push(createParticle());
        }
      }
    }, 100);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(addParticlesInterval);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}
