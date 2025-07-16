import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  ttl: number; // tempo de vida em frames
  fadeOut?: boolean; // se está começando a desaparecer
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const particles = useRef<Particle[]>([]);
  const targetCount = useRef(
    Math.min(Math.floor(window.innerWidth * 1.5), 1000)
  );

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
      opacity: Math.random() * 0.5 + 0.4,
      ttl: Math.floor(Math.random() * 600 + 300), // 5–15s em 60FPS
    });

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, i) => {
        // Reduz tempo de vida
        particle.ttl -= 1;

        if (particle.ttl <= 60) {
          // começa a sumir
          particle.opacity = Math.max(0, particle.opacity - 0.01);
        }

        // remove se sumiu completamente
        if (particle.ttl <= 0 || particle.opacity <= 0) {
          particles.current.splice(i, 1);
          return;
        }

        // Seguir mouse
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        particle.x += dx * 0.0003; // ou até 0.0002
        particle.y += dy * 0.0003;

        // Movimento natural
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Loop bordas
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Desenhar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${particle.opacity})`; // yellow-400
        ctx.fill();

        connectParticles(particle, i);
      });
    };

    const connectParticles = (particle: Particle, index: number) => {
      const maxConnections = 4;
      const maxDistanceSq = 100 * 100;

      for (
        let j = index + 1;
        j < Math.min(index + maxConnections, particles.current.length);
        j++
      ) {
        const other = particles.current[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistanceSq) {
          ctx.beginPath();
          const alpha = 0.1 * (1 - distSq / maxDistanceSq);
          ctx.strokeStyle = `rgba(250, 204, 21, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
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

    // Adiciona novas partículas aos poucos
    addParticlesInterval = window.setInterval(() => {
      if (particles.current.length < targetCount.current) {
        const toAdd = Math.min(
          5,
          targetCount.current - particles.current.length
        );
        for (let i = 0; i < toAdd; i++) {
          particles.current.push(createParticle());
        }
      }
    }, 100);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(addParticlesInterval);
      window.removeEventListener("mousemove", handleMouseMove);
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
